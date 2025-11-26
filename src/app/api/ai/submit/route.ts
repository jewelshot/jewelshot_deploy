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

// ============================================
// POST /api/ai/submit
// ============================================

export async function POST(request: NextRequest) {
  try {
    // ============================================
    // AUTHENTICATION
    // ============================================
    
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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
      return NextResponse.json(
        { error: 'Missing operation' },
        { status: 400 }
      );
    }

    if (!params || typeof params !== 'object') {
      return NextResponse.json(
        { error: 'Invalid params' },
        { status: 400 }
      );
    }

    // ============================================
    // CREDIT CHECK & RESERVATION
    // ============================================
    
    // Check if user has enough credits
    const availableCredits = await getAvailableCredits(user.id);
    if (availableCredits <= 0) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please purchase more credits to continue.' },
        { status: 402 } // Payment Required
      );
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
  } catch (error: any) {
    console.error('[API] Error submitting job:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to submit job',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

