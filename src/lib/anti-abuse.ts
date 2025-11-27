/**
 * Anti-Abuse System
 * 
 * Multi-layered protection against credit abuse
 */

import { createServiceClient } from '@/lib/supabase/service';

// ============================================
// 1. IP-BASED LIMITING
// ============================================

export async function checkIPLimit(ip: string): Promise<{
  allowed: boolean;
  reason?: string;
  existingAccounts?: number;
}> {
  const supabase = createServiceClient();
  
  // Get users registered from this IP in last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: signups, error } = await supabase
    .from('signup_ips')
    .select('user_id')
    .eq('ip_address', ip)
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (error) {
    console.error('IP check error:', error);
    return { allowed: true }; // Fail open
  }

  const MAX_ACCOUNTS_PER_IP = 2;
  
  if ((signups?.length || 0) >= MAX_ACCOUNTS_PER_IP) {
    return {
      allowed: false,
      reason: 'Maximum account limit reached from this network',
      existingAccounts: signups?.length,
    };
  }

  return { allowed: true };
}

// ============================================
// 2. EMAIL DOMAIN FILTERING
// ============================================

const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'throwaway.email',
  'temp-mail.org',
  'fakemailgenerator.com',
  'yopmail.com',
  'maildrop.cc',
  'getnada.com',
  // Add more as needed
];

const DISPOSABLE_PATTERNS = [
  /^\d+@/,           // Numbers only before @
  /@temp/i,          // Contains 'temp'
  /@disposable/i,    // Contains 'disposable'
  /@fake/i,          // Contains 'fake'
  /@trash/i,         // Contains 'trash'
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (!domain) return false;

  // Check blacklisted domains
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return true;
  }

  // Check patterns
  return DISPOSABLE_PATTERNS.some(pattern => pattern.test(email));
}

// ============================================
// 3. DEVICE FINGERPRINTING
// ============================================

export interface DeviceFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
}

export function generateFingerprintHash(fingerprint: DeviceFingerprint): string {
  const str = JSON.stringify(fingerprint);
  // Simple hash (in production, use crypto.subtle.digest)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export async function checkDeviceFingerprint(fingerprintHash: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const supabase = createServiceClient();
  
  const { data: devices, error } = await supabase
    .from('device_fingerprints')
    .select('user_id')
    .eq('fingerprint_hash', fingerprintHash);

  if (error) {
    console.error('Fingerprint check error:', error);
    return { allowed: true };
  }

  const MAX_ACCOUNTS_PER_DEVICE = 2;
  
  if ((devices?.length || 0) >= MAX_ACCOUNTS_PER_DEVICE) {
    return {
      allowed: false,
      reason: 'Maximum account limit reached from this device',
    };
  }

  return { allowed: true };
}

// ============================================
// 4. BEHAVIORAL ANALYSIS
// ============================================

export interface SuspiciousPattern {
  pattern: string;
  score: number; // 0-100
  details: string;
}

export async function analyzeBehavior(userId: string): Promise<{
  isSuspicious: boolean;
  suspicionScore: number;
  patterns: SuspiciousPattern[];
}> {
  const supabase = createServiceClient();
  const patterns: SuspiciousPattern[] = [];
  let totalScore = 0;

  // Get user's transactions
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'confirmed')
    .order('confirmed_at', { ascending: false })
    .limit(100);

  if (!transactions || transactions.length === 0) {
    return { isSuspicious: false, suspicionScore: 0, patterns: [] };
  }

  // Pattern 1: Rapid-fire operations (all credits used in < 5 minutes)
  const firstOp = new Date(transactions[transactions.length - 1].confirmed_at);
  const lastOp = new Date(transactions[0].confirmed_at);
  const timeDiff = (lastOp.getTime() - firstOp.getTime()) / 1000 / 60; // minutes

  if (transactions.length >= 5 && timeDiff < 5) {
    patterns.push({
      pattern: 'rapid_fire',
      score: 40,
      details: `${transactions.length} operations in ${timeDiff.toFixed(1)} minutes`,
    });
    totalScore += 40;
  }

  // Pattern 2: Same prompt repeated
  const prompts = transactions
    .map(t => t.metadata?.prompt)
    .filter(Boolean);
  
  const uniquePrompts = new Set(prompts);
  if (prompts.length > 5 && uniquePrompts.size === 1) {
    patterns.push({
      pattern: 'duplicate_prompts',
      score: 30,
      details: `Same prompt used ${prompts.length} times`,
    });
    totalScore += 30;
  }

  // Pattern 3: Only using free credits (never purchased)
  const { data: userCredits } = await supabase
    .from('user_credits')
    .select('total_earned')
    .eq('user_id', userId)
    .single();

  if (userCredits && userCredits.total_earned === 500) { // Only default credits
    const opsCount = transactions.length;
    if (opsCount > 20) {
      patterns.push({
        pattern: 'free_rider',
        score: 20,
        details: `${opsCount} operations, never purchased credits`,
      });
      totalScore += 20;
    }
  }

  return {
    isSuspicious: totalScore >= 50,
    suspicionScore: totalScore,
    patterns,
  };
}

// ============================================
// 5. COMPREHENSIVE SIGNUP CHECK
// ============================================

export async function validateSignup(data: {
  email: string;
  ip: string;
  deviceFingerprint?: DeviceFingerprint;
}): Promise<{
  allowed: boolean;
  reason?: string;
  requiresAdditionalVerification?: boolean;
}> {
  // Check 1: Disposable email
  if (isDisposableEmail(data.email)) {
    return {
      allowed: false,
      reason: 'Disposable email addresses are not allowed. Please use a permanent email address.',
    };
  }

  // Check 2: IP limit
  const ipCheck = await checkIPLimit(data.ip);
  if (!ipCheck.allowed) {
    return {
      allowed: false,
      reason: ipCheck.reason,
    };
  }

  // Check 3: Device fingerprint (if provided)
  if (data.deviceFingerprint) {
    const fingerprintHash = generateFingerprintHash(data.deviceFingerprint);
    const deviceCheck = await checkDeviceFingerprint(fingerprintHash);
    
    if (!deviceCheck.allowed) {
      return {
        allowed: false,
        reason: deviceCheck.reason,
      };
    }
  }

  // If IP has 1 existing account, require phone verification
  if (ipCheck.existingAccounts === 1) {
    return {
      allowed: true,
      requiresAdditionalVerification: true,
    };
  }

  return { allowed: true };
}

// ============================================
// 6. PROGRESSIVE CREDIT UNLOCK
// ============================================

export const CREDIT_UNLOCK_STAGES = {
  SIGNUP: 5,              // Initial signup
  EMAIL_VERIFIED: 5,      // Email confirmation
  FIRST_GENERATION: 5,    // First successful operation
  AFTER_24H: 10,          // 24 hours after signup
  FIRST_PURCHASE: 50,     // Bonus for first purchase
};

export async function unlockProgressiveCredits(
  userId: string,
  stage: keyof typeof CREDIT_UNLOCK_STAGES
): Promise<number> {
  const credits = CREDIT_UNLOCK_STAGES[stage];
  
  // Award credits via RPC function
  const supabase = createServiceClient();
  
  // Check if already unlocked this stage
  const { data: existing } = await supabase
    .from('credit_unlocks')
    .select('stage')
    .eq('user_id', userId)
    .eq('stage', stage)
    .single();

  if (existing) {
    return 0; // Already unlocked
  }

  // Record unlock
  await supabase
    .from('credit_unlocks')
    .insert({
      user_id: userId,
      stage,
      credits_awarded: credits,
    });

  return credits;
}

