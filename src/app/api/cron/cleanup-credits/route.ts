/**
 * Cron Job: Cleanup Orphaned Credit Reservations
 * 
 * Cleans up credit reservations older than 1 hour (stale from failed/crashed jobs)
 * Should be called every hour via Vercel Cron or external service
 * 
 * @route GET /api/cron/cleanup-credits
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // 🔒 SECURITY: CRON_SECRET is REQUIRED - no bypass allowed
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
      console.error('[Cron/cleanup-credits] CRON_SECRET not configured - denying request');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Cron/cleanup-credits] Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Cron/cleanup-credits] Starting orphaned reservations cleanup');

    // Call the cleanup function
    const { data, error } = await supabaseAdmin.rpc('cleanup_orphaned_reservations');

    if (error) {
      console.error('[Cron/cleanup-credits] Cleanup failed:', error);
      return NextResponse.json(
        { error: 'Cleanup failed' },
        { status: 500 }
      );
    }

    const result = Array.isArray(data) ? data[0] : data;
    
    console.log('[Cron/cleanup-credits] Cleanup completed:', result);

    return NextResponse.json({
      success: true,
      cleaned_count: result?.cleaned_count || 0,
      refunded_amount: result?.refunded_amount || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Cron/cleanup-credits] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export const POST = GET;
