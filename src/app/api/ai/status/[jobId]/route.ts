/**
 * AI Job Status Endpoint
 * 
 * GET /api/ai/status/{jobId}
 * Poll this endpoint to get job status and result
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getJobStatus, isQueueAvailable } from '@/lib/queue/client';
import { createApiError, ApiErrorCode } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  // ============================================
  // AUTHENTICATION
  // ============================================
  
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return createApiError(ApiErrorCode.UNAUTHORIZED);
  }

  // ============================================
  // CHECK QUEUE AVAILABILITY
  // ============================================
  
  if (!isQueueAvailable()) {
    // If queue is not available, check if it was a sync job
    if (jobId.startsWith('job-') || jobId.startsWith('sync-')) {
      return NextResponse.json({
        jobId,
        status: 'unknown',
        state: 'unknown',
        message: 'Queue system not available. This may be a sync job that has already completed.',
      });
    }
    
    return NextResponse.json(
      { error: 'Queue system not available' },
      { status: 503 }
    );
  }

  // ============================================
  // GET JOB STATUS
  // ============================================
  
  const status = await getJobStatus(jobId);

  if (!status) {
    return NextResponse.json(
      { 
        jobId,
        status: 'not_found',
        state: 'not_found',
        message: 'Job not found in any queue. It may have expired or never existed.',
      },
      { status: 404 }
    );
  }

  // ============================================
  // SECURITY: Verify job belongs to user
  // ============================================
  
  // Job IDs are formatted as: operation-userId-timestamp
  // Extract userId from job ID for verification
  const jobIdParts = jobId.split('-');
  if (jobIdParts.length >= 2) {
    const jobUserId = jobIdParts[1];
    if (!user.id.startsWith(jobUserId) && jobUserId !== user.id.slice(0, 8)) {
      // User doesn't own this job
      return createApiError(ApiErrorCode.FORBIDDEN, 'You do not have access to this job');
    }
  }

  // ============================================
  // FORMAT RESPONSE
  // ============================================
  
  return NextResponse.json({
    jobId: status.id,
    status: status.state,
    state: status.state,
    progress: status.progress,
    attemptsMade: status.attemptsMade,
    result: status.state === 'completed' ? status.result : undefined,
    error: status.state === 'failed' ? status.error : undefined,
    timestamp: status.timestamp,
    message: getStatusMessage(status.state),
  });
}

function getStatusMessage(state: string): string {
  switch (state) {
    case 'waiting':
      return 'Job is waiting in queue';
    case 'active':
      return 'Job is being processed';
    case 'completed':
      return 'Job completed successfully';
    case 'failed':
      return 'Job failed';
    case 'delayed':
      return 'Job is delayed';
    default:
      return 'Unknown status';
  }
}
