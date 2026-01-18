/**
 * Referral Service
 * 
 * Handles referral code generation, tracking, and reward distribution.
 * 
 * REFERRAL FLOW:
 * 1. User A shares their unique referral link
 * 2. User B signs up using the link
 * 3. User B gets bonus credits on signup
 * 4. User A gets credits when User B completes first generation
 * 
 * REWARDS:
 * - Referrer (User A): +5 credits when referee makes first generation
 * - Referee (User B): +2 credits on signup
 */

import { createServiceClient } from '@/lib/supabase/service';
import { nanoid } from 'nanoid';

// Referral rewards configuration
export const REFERRAL_REWARDS = {
  REFERRER_CREDITS: 5,   // Credits for the person who referred
  REFEREE_CREDITS: 2,    // Bonus credits for the new user
  MAX_REFERRALS: 50,     // Maximum referrals per user
} as const;

// Types
export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  pendingRewards: number;
  earnedCredits: number;
  referralCode: string;
  referralLink: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  refereeEmail: string;
  status: 'pending' | 'completed' | 'expired';
  referrerRewarded: boolean;
  refereeRewarded: boolean;
  createdAt: string;
  completedAt?: string;
}

/**
 * Generate a unique referral code for a user
 */
export async function generateReferralCode(userId: string): Promise<string> {
  const supabase = createServiceClient();
  
  // Check if user already has a code
  const { data: existingCode } = await supabase
    .from('referral_codes')
    .select('code')
    .eq('user_id', userId)
    .single();

  if (existingCode?.code) {
    return existingCode.code;
  }

  // Generate new unique code
  const code = nanoid(8).toUpperCase();

  // Save to database
  await supabase.from('referral_codes').insert({
    user_id: userId,
    code,
  });

  return code;
}

/**
 * Get referral code for a user
 */
export async function getReferralCode(userId: string): Promise<string | null> {
  const supabase = createServiceClient();
  
  const { data } = await supabase
    .from('referral_codes')
    .select('code')
    .eq('user_id', userId)
    .single();

  return data?.code || null;
}

/**
 * Validate a referral code and get the referrer
 */
export async function validateReferralCode(code: string): Promise<{
  valid: boolean;
  referrerId?: string;
  reason?: string;
}> {
  const supabase = createServiceClient();
  
  const { data, error } = await supabase
    .from('referral_codes')
    .select('user_id')
    .eq('code', code.toUpperCase())
    .single();

  if (error || !data) {
    return { valid: false, reason: 'Invalid referral code' };
  }

  // Check if referrer has reached max referrals
  const { count } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true })
    .eq('referrer_id', data.user_id);

  if ((count || 0) >= REFERRAL_REWARDS.MAX_REFERRALS) {
    return { valid: false, reason: 'Referral code has reached its limit' };
  }

  return { valid: true, referrerId: data.user_id };
}

/**
 * Apply referral on signup
 */
export async function applyReferral(params: {
  refereeId: string;
  refereeEmail: string;
  referralCode: string;
}): Promise<{ success: boolean; error?: string }> {
  const { refereeId, refereeEmail, referralCode } = params;
  const supabase = createServiceClient();

  // Validate the code
  const validation = await validateReferralCode(referralCode);
  if (!validation.valid) {
    return { success: false, error: validation.reason };
  }

  // Prevent self-referral
  if (validation.referrerId === refereeId) {
    return { success: false, error: 'Cannot use your own referral code' };
  }

  // Check if this user was already referred
  const { data: existingReferral } = await supabase
    .from('referrals')
    .select('id')
    .eq('referee_id', refereeId)
    .single();

  if (existingReferral) {
    return { success: false, error: 'Already referred by someone' };
  }

  // Create referral record
  const { error: insertError } = await supabase.from('referrals').insert({
    referrer_id: validation.referrerId,
    referee_id: refereeId,
    referee_email: refereeEmail,
    status: 'pending',
    referrer_rewarded: false,
    referee_rewarded: false,
  });

  if (insertError) {
    console.error('Failed to create referral:', insertError);
    return { success: false, error: 'Failed to apply referral' };
  }

  // Give referee their bonus credits immediately
  await grantRefereeBonus(refereeId);

  return { success: true };
}

/**
 * Grant bonus credits to referee on signup
 */
async function grantRefereeBonus(refereeId: string): Promise<void> {
  const supabase = createServiceClient();

  // Add credits
  await supabase.rpc('add_credits', {
    p_user_id: refereeId,
    p_amount: REFERRAL_REWARDS.REFEREE_CREDITS,
    p_description: 'Referral signup bonus',
    p_transaction_type: 'referral_bonus',
  });

  // Mark as rewarded
  await supabase
    .from('referrals')
    .update({ referee_rewarded: true })
    .eq('referee_id', refereeId);
}

/**
 * Complete referral and reward referrer
 * Called when referee makes their first generation
 */
export async function completeReferral(refereeId: string): Promise<void> {
  const supabase = createServiceClient();

  // Find pending referral for this user
  const { data: referral } = await supabase
    .from('referrals')
    .select('id, referrer_id, referrer_rewarded')
    .eq('referee_id', refereeId)
    .eq('status', 'pending')
    .single();

  if (!referral || referral.referrer_rewarded) {
    return; // No pending referral or already rewarded
  }

  // Grant credits to referrer
  await supabase.rpc('add_credits', {
    p_user_id: referral.referrer_id,
    p_amount: REFERRAL_REWARDS.REFERRER_CREDITS,
    p_description: 'Referral reward - friend made first generation',
    p_transaction_type: 'referral_reward',
  });

  // Mark referral as completed
  await supabase
    .from('referrals')
    .update({
      status: 'completed',
      referrer_rewarded: true,
      completed_at: new Date().toISOString(),
    })
    .eq('id', referral.id);
}

/**
 * Get referral statistics for a user
 */
export async function getReferralStats(userId: string): Promise<ReferralStats> {
  const supabase = createServiceClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jewelshot.ai';

  // Get or generate referral code
  let code = await getReferralCode(userId);
  if (!code) {
    code = await generateReferralCode(userId);
  }

  // Get referral counts
  const { data: referrals } = await supabase
    .from('referrals')
    .select('status, referrer_rewarded')
    .eq('referrer_id', userId);

  const stats = {
    totalReferrals: referrals?.length || 0,
    pendingRewards: referrals?.filter(r => r.status === 'pending').length || 0,
    earnedCredits: (referrals?.filter(r => r.referrer_rewarded).length || 0) * REFERRAL_REWARDS.REFERRER_CREDITS,
    referralCode: code,
    referralLink: `${baseUrl}/auth/signup?ref=${code}`,
  };

  return stats;
}

/**
 * Get referral history for a user
 */
export async function getReferralHistory(userId: string): Promise<Referral[]> {
  const supabase = createServiceClient();

  const { data } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false });

  return (data || []).map(r => ({
    id: r.id,
    referrerId: r.referrer_id,
    refereeId: r.referee_id,
    refereeEmail: r.referee_email,
    status: r.status,
    referrerRewarded: r.referrer_rewarded,
    refereeRewarded: r.referee_rewarded,
    createdAt: r.created_at,
    completedAt: r.completed_at,
  }));
}
