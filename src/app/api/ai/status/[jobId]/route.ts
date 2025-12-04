/**
 * AI Job Status Endpoint
 * 
 * DEPRECATED: Synchronous processing no longer uses queue polling
 * This endpoint returns "not found" for all requests
 * 
 * Note: BullMQ/Redis is not available in Vercel serverless
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { jobId } = await params;
    
    // ============================================
    // SYNCHRONOUS MODE - Queue polling disabled
    // ============================================
    
    // In synchronous mode, jobs complete immediately in /api/ai/submit
    // This endpoint is kept for backwards compatibility but returns "not found"
    console.log(`[API] Status check for ${jobId} - synchronous mode, no queue`);
    
    // Check if this is a synchronous job (starts with "sync-")
    if (jobId.startsWith('sync-')) {
      return NextResponse.json({
        jobId,
        state: 'completed',
        message: 'Synchronous jobs complete immediately. Check submit response.',
        result: null,
      });
    }

    return NextResponse.json(
      { 
        error: 'Job not found',
        message: 'Queue-based jobs are not supported. Use synchronous mode.',
      },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('[API] Error in status endpoint:', error);
    
    return NextResponse.json(
      {
        error: 'Status check failed',
        details: error.message,
      },
      { status: 500 }
    );
  }
}


