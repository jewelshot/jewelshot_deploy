/**
 * AI Job Cancel Endpoint
 * 
 * Cancel a pending or active job
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllQueues } from '@/lib/queue/queues';

// ============================================
// POST /api/ai/cancel/[jobId]
// ============================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
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
    // FIND JOB
    // ============================================
    
    const { jobId } = await params;
    const queues = getAllQueues();
    
    let job = null;
    
    // Check all queues for the job
    for (const queue of queues) {
      const foundJob = await queue.getJob(jobId);
      if (foundJob) {
        job = foundJob;
        break;
      }
    }

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // ============================================
    // AUTHORIZATION
    // ============================================
    
    // Verify job belongs to requesting user
    if (job.data.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // ============================================
    // CANCEL JOB
    // ============================================
    
    const state = await job.getState();
    
    // Can only cancel waiting or active jobs
    if (state === 'completed' || state === 'failed') {
      return NextResponse.json(
        { error: `Cannot cancel ${state} job` },
        { status: 400 }
      );
    }

    await job.remove();
    
    console.log(`[API] Job ${job.id} cancelled by user ${user.id}`);

    // ============================================
    // RESPONSE
    // ============================================
    
    return NextResponse.json({
      jobId: job.id,
      status: 'cancelled',
      message: 'Job cancelled successfully',
    });
  } catch (error: any) {
    console.error('[API] Error cancelling job:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to cancel job',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


