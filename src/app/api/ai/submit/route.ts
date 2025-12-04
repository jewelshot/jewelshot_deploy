/**
 * AI Job Submission Endpoint
 * 
 * Unified endpoint for all AI operations
 * Synchronous processing - processes immediately and returns result
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AIOperation, JobPriority } from '@/lib/queue/types';
import { reserveCredit, getAvailableCredits, confirmCredit, refundCredit } from '@/lib/credit-manager';
import { aiRateLimit, checkRateLimit } from '@/lib/rate-limit';
import { createApiError, ApiErrorCode, withErrorHandling } from '@/lib/api-error';
import { validateAIParams, ValidationError } from '@/lib/validation';
import { processAIJob } from '@/lib/queue/processors/ai-processor';

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

    // ============================================
    // INPUT VALIDATION
    // ============================================
    
    // Validate required fields
    if (!operation) {
      return createApiError(ApiErrorCode.MISSING_REQUIRED_FIELD, 'Operation is required');
    }

    // Validate and sanitize params
    try {
      validateAIParams(operation, params);
    } catch (error) {
      if (error instanceof ValidationError) {
        return createApiError(error.code, error.message);
      }
      throw error;
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
    // SYNCHRONOUS PROCESSING
    // ============================================
    
    console.log(`[API] Processing ${operation} synchronously for user ${user.id}`);
    console.log(`[API] Credits reserved: ${creditReservation.amount} (Transaction: ${creditReservation.transactionId})`);

    try {
      // Process the job immediately (synchronous)
      const result = await processAIJob({
        userId: user.id,
        operation,
        params,
        priority,
        metadata: {
          ...metadata,
          creditTransactionId: creditReservation.transactionId,
          submittedAt: new Date().toISOString(),
        },
      });

      if (result.success) {
        // Confirm credit deduction
        try {
          await confirmCredit(creditReservation.transactionId);
          console.log(`[API] Credits confirmed for transaction ${creditReservation.transactionId}`);
        } catch (creditError) {
          console.error('[API] Failed to confirm credits:', creditError);
        }

        // Return successful result
        return NextResponse.json({
          jobId: `sync-${Date.now()}`,
          status: 'completed',
          state: 'completed',
          priority,
          operation,
          result: result,
          creditReservation: {
            transactionId: creditReservation.transactionId,
            amount: creditReservation.amount,
          },
        });
      } else {
        // Processing failed - refund credits
        try {
          await refundCredit(creditReservation.transactionId);
          console.log(`[API] Credits refunded for failed job ${creditReservation.transactionId}`);
        } catch (refundError) {
          console.error('[API] Failed to refund credits:', refundError);
        }

        return NextResponse.json(
          {
            jobId: `sync-${Date.now()}`,
            status: 'failed',
            state: 'failed',
            error: result.error || { message: 'Processing failed' },
          },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error('[API] Synchronous processing error:', error);
      
      // Refund credits on error
      try {
        await refundCredit(creditReservation.transactionId);
        console.log(`[API] Credits refunded due to error ${creditReservation.transactionId}`);
      } catch (refundError) {
        console.error('[API] Failed to refund credits:', refundError);
      }

      return NextResponse.json(
        {
          error: 'AI processing failed',
          message: error.message || 'Unknown error',
        },
        { status: 500 }
      );
    }
});
