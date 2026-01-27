/**
 * AI Job Submission Endpoint
 * 
 * Queue-based processing via Redis/BullMQ
 * Returns job ID immediately, client polls for status
 * 
 * Flow:
 * 1. Validate request & check credits
 * 2. Reserve credits
 * 3. Add job to Redis queue
 * 4. Return job ID immediately
 * 5. Worker processes job in background
 * 6. Client polls /api/ai/status/{jobId} for result
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIOperation, JobPriority } from '@/lib/queue/types';
import { reserveCredit, getAvailableCredits, confirmCredit, refundCredit } from '@/lib/credit-manager';
import { aiRateLimit, checkRateLimit } from '@/lib/rate-limit';
import { createApiError, ApiErrorCode, withErrorHandling } from '@/lib/api-error';
import { validateAIParams, ValidationError } from '@/lib/validation';
import { addJob, isQueueAvailable } from '@/lib/queue/client';
import { processAIJob } from '@/lib/queue/processors/ai-processor';
import { tryAcquireUserSlot, UserTier } from '@/lib/queue/user-concurrency';
import { hasKeyCapacity, getKeyPoolStats } from '@/lib/queue/api-key-manager';

// ============================================
// POST /api/ai/submit
// ============================================

export const POST = withErrorHandling(async (request: NextRequest) => {
    console.log('[API/submit] Request received');
    
    // ============================================
    // AUTHENTICATION
    // ============================================
    
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return createApiError(ApiErrorCode.UNAUTHORIZED);
    }

    // ============================================
    // RATE LIMITING (AI Operations)
    // ============================================
    
    const { success, limit, remaining, reset } = await checkRateLimit(user.id, aiRateLimit);
    
    if (!success) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          message: 'Too many AI requests. Please wait before trying again.',
          limit,
          remaining: 0,
          reset,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit?.toString() || '0',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset?.toString() || '0',
          },
        }
      );
    }

    // ============================================
    // PARSE REQUEST
    // ============================================
    
    const body = await request.json();
    const {
      operation,
      params,
      priority = 'normal',
      metadata,
      // New: Allow client to request sync processing
      sync = false,
    } = body as {
      operation: AIOperation;
      params: Record<string, any>;
      priority?: JobPriority;
      metadata?: any;
      sync?: boolean;
    };

    // ============================================
    // INPUT VALIDATION
    // ============================================
    
    if (!operation) {
      return createApiError(ApiErrorCode.MISSING_REQUIRED_FIELD, 'Operation is required');
    }

    try {
      validateAIParams(operation, params);
    } catch (error) {
      if (error instanceof ValidationError) {
        return createApiError(error.code, error.message);
      }
      throw error;
    }

    // ============================================
    // SYSTEM CAPACITY CHECK
    // ============================================
    
    if (!hasKeyCapacity()) {
      const stats = getKeyPoolStats();
      console.warn(`[API/submit] System at capacity: ${stats.utilizationPercent}%`);
      return NextResponse.json(
        { 
          error: 'System busy', 
          message: 'The system is currently processing many requests. Please try again in a few seconds.',
          stats: {
            utilization: stats.utilizationPercent,
            available: stats.availableCapacity,
          },
        },
        { status: 503 }
      );
    }

    // ============================================
    // PER-USER CONCURRENCY CHECK
    // ============================================
    
    // Determine user tier (default to 'free', can be enhanced with profile lookup)
    const userTier: UserTier = 'basic'; // TODO: Get from user profile
    
    const userSlot = tryAcquireUserSlot(user.id, userTier);
    if (!userSlot.acquired) {
      return NextResponse.json(
        { 
          error: 'Too many concurrent requests', 
          message: `You have ${userSlot.activeCount} active requests. Maximum allowed: ${userSlot.limit}. Please wait for current requests to complete.`,
          activeRequests: userSlot.activeCount,
          limit: userSlot.limit,
        },
        { status: 429 }
      );
    }

    // ============================================
    // CREDIT CHECK & RESERVATION
    // ============================================
    
    const availableCredits = await getAvailableCredits(user.id);
    if (availableCredits <= 0) {
      userSlot.release(); // Release user slot
      return createApiError(ApiErrorCode.INSUFFICIENT_CREDITS);
    }

    let creditReservation;
    try {
      creditReservation = await reserveCredit(user.id, operation);
    } catch (error: any) {
      userSlot.release(); // Release user slot
      console.error('[API] Credit reservation failed:', error);
      return NextResponse.json(
        { error: error.message || 'Insufficient credits' },
        { status: 402 }
      );
    }

    // Check FAL API key
    const hasFalKey = !!(process.env.FAL_KEY || process.env.FAL_AI_KEY_1);
    if (!hasFalKey) {
      userSlot.release(); // Release user slot
      await refundCredit(creditReservation.transactionId);
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    // ============================================
    // DETERMINE PROCESSING MODE
    // ============================================
    
    const useQueue = isQueueAvailable() && !sync;
    // 🔒 SECURITY: Use crypto for secure random ID
    const jobId = `job-${user.id.slice(0, 8)}-${Date.now()}-${crypto.randomUUID().slice(0, 7)}`;

    console.log(`[API/submit] Processing mode: ${useQueue ? 'QUEUE' : 'SYNC'}, JobID: ${jobId}`);

    // ============================================
    // QUEUE-BASED PROCESSING (Redis available)
    // ============================================
    
    if (useQueue) {
      const jobData = {
        userId: user.id,
        operation,
        params,
        priority,
        metadata: {
          ...metadata,
          creditTransactionId: creditReservation.transactionId,
          submittedAt: new Date().toISOString(),
          jobId,
        },
      };

      const queueResult = await addJob(jobData);

      if (!queueResult.success) {
        console.error('[API/submit] Failed to add job to queue:', queueResult.error);
        // Fallback to sync processing
        return processSynchronously(
          jobId, 
          user.id, 
          operation, 
          params, 
          priority, 
          metadata, 
          creditReservation,
          userSlot.release
        );
      }

      console.log(`[API/submit] Job queued: ${queueResult.jobId} in ${queueResult.queueName}`);

      // Note: User slot will be released when job completes via worker
      // For queue-based processing, we track via job metadata
      userSlot.release(); // Release immediately for queue (worker handles capacity)

      // Return immediately with job ID
      return NextResponse.json({
        jobId: queueResult.jobId || jobId,
        status: 'queued',
        state: 'waiting',
        priority,
        operation,
        message: 'Job added to queue. Poll /api/ai/status/{jobId} for updates.',
        creditReservation: {
          transactionId: creditReservation.transactionId,
          amount: creditReservation.amount,
        },
      });
    }

    // ============================================
    // SYNCHRONOUS PROCESSING (No Redis or sync requested)
    // ============================================
    
    return processSynchronously(
      jobId,
      user.id,
      operation,
      params,
      priority,
      metadata,
      creditReservation,
      userSlot.release
    );
});

// ============================================
// SYNC PROCESSING HELPER
// ============================================

async function processSynchronously(
  jobId: string,
  userId: string,
  operation: AIOperation,
  params: Record<string, any>,
  priority: JobPriority,
  metadata: any,
  creditReservation: { transactionId: string; amount: number },
  releaseUserSlot: () => void
) {
  console.log(`[API/submit] Processing ${operation} synchronously for user ${userId}`);

  try {
    const result = await processAIJob({
      userId,
      operation,
      params,
      priority,
      metadata: {
        ...metadata,
        creditTransactionId: creditReservation.transactionId,
        submittedAt: new Date().toISOString(),
        jobId,
      },
    });

    // Always release user slot when done
    releaseUserSlot();

    if (result.success) {
      await confirmCredit(creditReservation.transactionId, userId);
      console.log(`[API/submit] Job completed: ${jobId}`);

      return NextResponse.json({
        jobId,
        status: 'completed',
        state: 'completed',
        priority,
        operation,
        result,
        creditReservation: {
          transactionId: creditReservation.transactionId,
          amount: creditReservation.amount,
        },
      });
    } else {
      await refundCredit(creditReservation.transactionId);
      console.error(`[API/submit] Job failed: ${jobId}`, result.error);

      // Ensure error message is always a string
      const errorMessage = result.error?.message 
        || (typeof result.error === 'string' ? result.error : 'Processing failed');

      return NextResponse.json(
        {
          jobId,
          status: 'failed',
          state: 'failed',
          message: errorMessage,
          error: { message: errorMessage, code: result.error?.code },
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    // Always release user slot on error
    releaseUserSlot();
    
    await refundCredit(creditReservation.transactionId);
    console.error(`[API/submit] Error: ${jobId}`, error);

    const errorMessage = error.message || 'Unknown error';

    return NextResponse.json(
      {
        jobId,
        status: 'failed',
        state: 'failed',
        message: errorMessage,
        error: { message: errorMessage },
      },
      { status: 500 }
    );
  }
}
