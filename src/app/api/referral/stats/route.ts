/**
 * Referral Stats API
 * GET /api/referral/stats - Get referral statistics for current user
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getReferralStats, getReferralHistory } from '@/lib/referral/referral-service';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [stats, history] = await Promise.all([
      getReferralStats(user.id),
      getReferralHistory(user.id),
    ]);

    return NextResponse.json({
      ...stats,
      history,
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get referral stats' },
      { status: 500 }
    );
  }
}
