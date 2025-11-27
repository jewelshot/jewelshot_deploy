/**
 * AI Job Status Endpoint
 * 
 * Check status of a queued/processing job
 * Returns job state, progress, and result (if completed)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllQueues } from '@/lib/queue/queues';

// ============================================
// GET /api/ai/status/[jobId]
// ============================================

export async function GET(
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
    let queueName = '';
    
    // Check all queues for the job
    for (const queue of queues) {
      const foundJob = await queue.getJob(jobId);
      if (foundJob) {
        job = foundJob;
        queueName = queue.name;
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
    // GET JOB STATE
    // ============================================
    
    const state = await job.getState();
    const progress = job.progress;
    const returnvalue = job.returnvalue;
    const failedReason = job.failedReason;
    const attemptsMade = job.attemptsMade;

    // ============================================
    // RESPONSE
    // ============================================
    
    return NextResponse.json({
      jobId: job.id,
      state, // 'waiting' | 'active' | 'completed' | 'failed' | 'delayed'
      progress,
      queueName,
      operation: job.data.operation,
      priority: job.data.priority,
      attemptsMade,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      // Only include result if completed
      result: state === 'completed' ? returnvalue : null,
      // Only include error if failed
      error: state === 'failed' ? {
        message: failedReason,
        attempts: attemptsMade,
      } : null,
    });
  } catch (error: any) {
    console.error('[API] Error fetching job status:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch job status',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


