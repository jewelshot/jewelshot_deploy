/**
 * Anti-Abuse System
 * 
 * Multi-layered protection against credit abuse and fraud
 */

import { createServiceClient } from '@/lib/supabase/service';

// ============================================
// 1. IP-BASED LIMITING
// ============================================

const MAX_ACCOUNTS_PER_IP = 2;
const MAX_SIGNUPS_PER_HOUR = 1;

export async function checkIPLimit(ip: string): Promise<{
  allowed: boolean;
  reason?: string;
  existingAccounts?: number;
}> {
  const supabase = createServiceClient();
  
  // Check 1: Rate limit - 1 signup per hour from same IP
  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);

  const { data: recentSignups } = await supabase
    .from('signup_ips')
    .select('user_id')
    .eq('ip_address', ip)
    .gte('created_at', oneHourAgo.toISOString());

  if ((recentSignups?.length || 0) >= MAX_SIGNUPS_PER_HOUR) {
    return {
      allowed: false,
      reason: 'Please wait before creating another account. Try again in 1 hour.',
    };
  }

  // Check 2: Total accounts from this IP in last 30 days
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

  if ((signups?.length || 0) >= MAX_ACCOUNTS_PER_IP) {
    return {
      allowed: false,
      reason: 'Maximum account limit reached from this network. Contact support if you need assistance.',
      existingAccounts: signups?.length,
    };
  }

  return { allowed: true, existingAccounts: signups?.length || 0 };
}

// Record signup IP
export async function recordSignupIP(userId: string, ip: string, userAgent?: string): Promise<void> {
  const supabase = createServiceClient();
  
  await supabase.from('signup_ips').insert({
    user_id: userId,
    ip_address: ip,
    user_agent: userAgent || null,
  });
}

// ============================================
// 2. EMAIL DOMAIN FILTERING
// ============================================

const DISPOSABLE_EMAIL_DOMAINS = [
  '10minutemail.com', '10minutemail.net', '10minutemail.org',
  'guerrillamail.com', 'guerrillamail.info', 'guerrillamail.net',
  'mailinator.com', 'mailinator.net', 'mailinator.org',
  'tempmail.com', 'tempmail.net', 'tempmail.org',
  'throwaway.email', 'throwawaymail.com',
  'temp-mail.org', 'temp-mail.io', 'temp-mail.ru',
  'fakemailgenerator.com', 'fakeinbox.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net',
  'maildrop.cc', 'maildrop.ml',
  'getnada.com', 'nada.email',
  'sharklasers.com', 'grr.la', 'guerrillamail.biz',
  'dispostable.com', 'mailnesia.com',
  'tempr.email', 'discard.email', 'discardmail.com',
  'spamgourmet.com', 'mytrashmail.com', 'trashmail.com',
  'mailcatch.com', 'mailscrap.com', 'mailnull.com',
  'spamex.com', 'spamfree24.org', 'spamspot.com',
  'tempinbox.com', 'tempmailaddress.com', 'tempmails.net',
  'emailondeck.com', 'mohmal.com', 'emailfake.com',
  'crazymailing.com', 'tempmailo.com', 'fakemail.net',
  'throwam.com', 'moakt.com', 'moakt.ws',
  'getairmail.com', 'wegwerfmail.de', 'wegwerfmail.net',
  'trash-mail.com', 'trash-mail.de', 'trashmail.ws',
  'mail-temp.com', 'tempail.com', 'anonymbox.com',
  'mintemail.com', 'mailforspam.com', 'spambox.us',
  'gecikmeli.com', 'mailsac.com', 'mytemp.email',
  'burnermail.io', 'tempemailco.com', 'tmails.net',
];

const DISPOSABLE_PATTERNS = [
  /^\d{5,}@/,
  /@.*temp/i,
  /@.*disposable/i,
  /@.*fake/i,
  /@.*trash/i,
  /@.*spam/i,
  /@.*throw/i,
  /^test\d+@/i,
  /^user\d{4,}@/i,
];

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) return true;

  const suspiciousKeywords = ['temp', 'fake', 'trash', 'spam', 'disposable', 'throw', 'minute'];
  if (suspiciousKeywords.some(k => domain.includes(k))) return true;

  return DISPOSABLE_PATTERNS.some(p => p.test(email));
}

// ============================================
// 3. PHONE NUMBER VALIDATION
// ============================================

const VOIP_PATTERNS = [
  /^\+1(747|559|209|669)/,
  /^\+15005550/,
  /^\+1(800|888|877|866|855|844|833)/,
  /^\+44700/,
];

export function isVoIPNumber(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return VOIP_PATTERNS.some(p => p.test(cleaned));
}

export async function checkPhoneUniqueness(phone: string): Promise<{
  isUnique: boolean;
  reason?: string;
}> {
  const supabase = createServiceClient();
  const normalized = phone.replace(/[^\d+]/g, '');
  
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('phone_number', normalized)
    .eq('phone_verified', true)
    .limit(1);

  if (data && data.length > 0) {
    return { isUnique: false, reason: 'This phone number is already registered.' };
  }
  return { isUnique: true };
}

// ============================================
// 4. DEVICE FINGERPRINTING
// ============================================

export interface DeviceFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
}

export function generateFingerprintHash(fp: DeviceFingerprint): string {
  const str = JSON.stringify(fp);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function checkDeviceFingerprint(hash: string): Promise<{
  allowed: boolean;
  reason?: string;
  existingAccounts?: number;
}> {
  const supabase = createServiceClient();
  
  const { data } = await supabase
    .from('device_fingerprints')
    .select('user_id')
    .eq('fingerprint_hash', hash);

  if ((data?.length || 0) >= 2) {
    return { allowed: false, reason: 'Maximum accounts reached from this device.', existingAccounts: data?.length };
  }
  return { allowed: true, existingAccounts: data?.length || 0 };
}

export async function recordDeviceFingerprint(userId: string, hash: string): Promise<void> {
  const supabase = createServiceClient();
  await supabase.from('device_fingerprints').upsert({
    user_id: userId,
    fingerprint_hash: hash,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

// ============================================
// 5. COMPREHENSIVE SIGNUP VALIDATION
// ============================================

export interface SignupValidationResult {
  allowed: boolean;
  reason?: string;
  requiresPhoneVerification?: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export async function validateSignup(data: {
  email: string;
  ip: string;
  deviceFingerprint?: DeviceFingerprint;
}): Promise<SignupValidationResult> {

  // Check disposable email
  if (isDisposableEmail(data.email)) {
    return {
      allowed: false,
      reason: 'Please use a permanent email address. Temporary emails are not allowed.',
      riskLevel: 'high',
    };
  }

  // Check IP limit
  const ipCheck = await checkIPLimit(data.ip);
  if (!ipCheck.allowed) {
    return { allowed: false, reason: ipCheck.reason, riskLevel: 'high' };
  }

  // Check device fingerprint
  if (data.deviceFingerprint) {
    const hash = generateFingerprintHash(data.deviceFingerprint);
    const deviceCheck = await checkDeviceFingerprint(hash);
    if (!deviceCheck.allowed) {
      return { allowed: false, reason: deviceCheck.reason, riskLevel: 'high' };
    }
  }

  // Determine risk level
  const riskLevel = (ipCheck.existingAccounts || 0) >= 1 ? 'medium' : 'low';

  return {
    allowed: true,
    riskLevel,
    requiresPhoneVerification: riskLevel === 'medium',
  };
}

// ============================================
// 6. PHONE VERIFICATION VALIDATION
// ============================================

export async function validatePhoneForVerification(phone: string): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  if (isVoIPNumber(phone)) {
    return { allowed: false, reason: 'Virtual phone numbers are not allowed.' };
  }

  const uniqueness = await checkPhoneUniqueness(phone);
  if (!uniqueness.isUnique) {
    return { allowed: false, reason: uniqueness.reason };
  }

  return { allowed: true };
}

// ============================================
// 7. HONEYPOT DETECTION
// ============================================

export function checkHoneypot(data: { honeypot?: string; timestamp?: number }): boolean {
  if (data.honeypot && data.honeypot.length > 0) return true;
  if (data.timestamp && Date.now() - data.timestamp < 3000) return true;
  return false;
}

// ============================================
// 8. PROGRESSIVE CREDITS
// ============================================

export const CREDIT_UNLOCK_STAGES = {
  SIGNUP: 2,
  EMAIL_VERIFIED: 3,
  PHONE_VERIFIED: 5,
  FIRST_PURCHASE: 25,
};

export async function unlockProgressiveCredits(
  userId: string,
  stage: keyof typeof CREDIT_UNLOCK_STAGES
): Promise<number> {
  const credits = CREDIT_UNLOCK_STAGES[stage];
  const supabase = createServiceClient();
  
  const { data: existing } = await supabase
    .from('credit_unlocks')
    .select('stage')
    .eq('user_id', userId)
    .eq('stage', stage)
    .single();

  if (existing) return 0;

  await supabase.from('credit_unlocks').insert({
    user_id: userId,
    stage,
    credits_awarded: credits,
  });

  return credits;
}
