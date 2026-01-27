/**
 * GET /api/credits/balance
 * 
 * Get user's current credit balance and plan info
 * Uses unified credit system (user_credits table)
 * 
 * Response:
 * - credits: Available credits (balance - reserved)
 * - balance: Total credit balance
 * - reserved: Credits reserved for pending operations
 * - plan: Current subscription plan
 * - status: Subscription status
 * - renewal_date: Next renewal date (if applicable)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Try to get plan info from unified RPC function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: planInfo, error: rpcError } = await (supabase as any).rpc('get_user_plan_info', {
      p_user_id: user.id,
    });

    if (!rpcError && planInfo && planInfo.length > 0) {
      const info = planInfo[0];
      return NextResponse.json({
        success: true,
        credits: info.credits_available || 0,
        balance: info.credits_total || 0,
        reserved: info.credits_reserved || 0,
        plan: info.plan || 'free',
        status: info.status || 'active',
        renewal_date: info.renewal_date,
        is_active: info.is_active,
      });
    }

    // Fallback: Query user_credits directly
    const { data: creditsDataRaw, error: creditsError } = await supabase
      .from('user_credits')
      .select('balance, reserved, total_earned, total_spent')
      .eq('user_id', user.id)
      .single();

    if (creditsError && creditsError.code !== 'PGRST116') {
      // PGRST116 = no rows returned (new user)
      console.error('[API/credits] Error fetching credits:', creditsError);
    }

    // Type assertion for credits data
    const creditsData = creditsDataRaw as { 
      balance: number; 
      reserved: number; 
      total_earned: number; 
      total_spent: number; 
    } | null;

    // Get plan info from profiles as fallback
    const { data: profileDataRaw } = await supabase
      .from('profiles')
      .select('subscription_plan, subscription_status, subscription_renewal_date, credits')
      .eq('id', user.id)
      .single();

    // Type assertion for profile data
    const profileData = profileDataRaw as {
      subscription_plan: string | null;
      subscription_status: string | null;
      subscription_renewal_date: string | null;
      credits: number | null;
    } | null;

    // Calculate values
    const balance = creditsData?.balance ?? profileData?.credits ?? 10;
    const reserved = creditsData?.reserved ?? 0;
    const available = balance - reserved;

    return NextResponse.json({
      success: true,
      credits: available,
      balance: balance,
      reserved: reserved,
      used: creditsData?.total_spent ?? 0,
      total_purchased: creditsData?.total_earned ?? balance,
      plan: profileData?.subscription_plan || 'free',
      status: profileData?.subscription_status || 'active',
      renewal_date: profileData?.subscription_renewal_date,
    });
  } catch (error: any) {
    console.error('[API/credits] Error fetching credits:', error);
    
    // 🔒 SECURITY: Don't expose error details
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
