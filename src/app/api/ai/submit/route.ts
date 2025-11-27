/**
 * AI Job Submission Endpoint
 * 
 * Unified endpoint for all AI operations
 * Accepts job request, adds to queue, returns jobId
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getQueueByPriority } from '@/lib/queue/queues';
import { AIOperation, JobPriority } from '@/lib/queue/types';
import { reserveCredit, getAvailableCredits } from '@/lib/credit-manager';
import { aiRateLimit, checkRateLimit } from '@/lib/rate-limit';
import { createApiError, ApiErrorCode, withErrorHandling } from '@/lib/api-error';

// ============================================
// POST /api/ai/submit
// ============================================

export const POST = withErrorHandling(async (request: NextRequest) => {
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
    } = body as {
      operation: AIOperation;
      params: Record<string, any>;
      priority?: JobPriority;
      metadata?: any;
    };

    // Validate required fields
    if (!operation) {
      return createApiError(ApiErrorCode.MISSING_REQUIRED_FIELD, 'Operation is required');
    }

    if (!params || typeof params !== 'object') {
      return createApiError(ApiErrorCode.INVALID_INPUT, 'Params must be a valid object');
    }

    // ============================================
    // CREDIT CHECK & RESERVATION
    // ============================================
    
    // Check if user has enough credits
    const availableCredits = await getAvailableCredits(user.id);
    if (availableCredits <= 0) {
      return createApiError(ApiErrorCode.INSUFFICIENT_CREDITS);
    }

    // Reserve credits atomically
    let creditReservation;
    try {
      creditReservation = await reserveCredit(user.id, operation);
    } catch (error: any) {
      console.error('[API] Credit reservation failed:', error);
      return NextResponse.json(
        { error: error.message || 'Insufficient credits' },
        { status: 402 }
      );
    }

    // ============================================
    // RATE LIMITING (Per User)
    // ============================================
    
    // TODO: Implement rate limiting check
    // const isAllowed = await checkUserRateLimit(user.id, priority);
    // if (!isAllowed) {
    //   // Refund credits if rate limited
    //   await refundCredit(creditReservation.transactionId);
    //   return NextResponse.json(
    //     { error: 'Rate limit exceeded. Please try again later.' },
    //     { status: 429 }
    //   );
    // }

    // ============================================
    // ADD TO QUEUE
    // ============================================
    
    const queue = getQueueByPriority(priority);
    
    if (!queue) {
      return NextResponse.json(
        { error: 'Queue system not configured. Please contact support.' },
        { status: 503 }
      );
    }
    
    const job = await queue.add(
      operation,
      {
        userId: user.id,
        operation,
        params,
        priority,
        metadata: {
          ...metadata,
          creditTransactionId: creditReservation.transactionId,
          submittedAt: new Date().toISOString(),
        },
      },
      {
        // Job-specific options (override defaults if needed)
        // timeout: priority === 'urgent' ? 60000 : undefined,
      }
    );

    console.log(`[API] Job ${job.id} submitted to ${priority} queue by user ${user.id}`);
    console.log(`[API] Credits reserved: ${creditReservation.amount} (Transaction: ${creditReservation.transactionId})`);

    // ============================================
    // RESPONSE
    // ============================================
    
    return NextResponse.json({
      jobId: job.id,
      status: 'queued',
      priority,
      operation,
      creditReservation: {
        transactionId: creditReservation.transactionId,
        amount: creditReservation.amount,
      },
    });
});

