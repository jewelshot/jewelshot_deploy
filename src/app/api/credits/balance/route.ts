/**
 * GET /api/credits/balance
 * 
 * Get user's current credit balance using new atomic credit system
 * Replaces old /api/credits/check endpoint
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserCredits } from '@/lib/credit-manager';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get credits using new atomic system
    const credits = await getUserCredits(user.id);

    return NextResponse.json({
      success: true,
      credits: credits.available, // available = balance - reserved
      balance: credits.balance,
      reserved: credits.reserved,
      used: credits.totalSpent,
      total_purchased: credits.totalEarned,
    });
  } catch (error: any) {
    console.error('[API] Error fetching credits:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch credits',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

