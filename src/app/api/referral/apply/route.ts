/**
 * Apply Referral API
 * POST /api/referral/apply - Apply a referral code for new user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { applyReferral } from '@/lib/referral/referral-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { referralCode } = body;

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    const result = await applyReferral({
      refereeId: user.id,
      refereeEmail: user.email || '',
      referralCode,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Apply referral error:', error);
    return NextResponse.json(
      { error: 'Failed to apply referral' },
      { status: 500 }
    );
  }
}
