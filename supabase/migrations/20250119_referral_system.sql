-- =============================================
-- REFERRAL SYSTEM TABLES
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Referral Codes Table
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON referral_codes(user_id);

-- 2. Referrals Table (tracks who referred whom)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  referee_email VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  referrer_rewarded BOOLEAN DEFAULT FALSE,
  referee_rewarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referee ON referrals(referee_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- 3. RLS Policies
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Referral Codes: Users can view their own code
DROP POLICY IF EXISTS "Users can view own referral code" ON public.referral_codes;
CREATE POLICY "Users can view own referral code" ON public.referral_codes
  FOR SELECT USING (auth.uid() = user_id);

-- Referral Codes: Anyone can validate a code (for signup)
DROP POLICY IF EXISTS "Anyone can validate referral codes" ON public.referral_codes;
CREATE POLICY "Anyone can validate referral codes" ON public.referral_codes
  FOR SELECT USING (true);

-- Referral Codes: Service role can manage
DROP POLICY IF EXISTS "Service role manages referral codes" ON public.referral_codes;
CREATE POLICY "Service role manages referral codes" ON public.referral_codes
  FOR ALL USING (auth.role() = 'service_role');

-- Referrals: Users can view referrals they made
DROP POLICY IF EXISTS "Users can view own referrals" ON public.referrals;
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- Referrals: Service role can manage
DROP POLICY IF EXISTS "Service role manages referrals" ON public.referrals;
CREATE POLICY "Service role manages referrals" ON public.referrals
  FOR ALL USING (auth.role() = 'service_role');

-- 4. Grant permissions
GRANT SELECT ON public.referral_codes TO authenticated;
GRANT SELECT ON public.referrals TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.referral_codes TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.referrals TO service_role;

-- NOTE: Credits are managed via existing system (user_credits table)
-- No separate add_credits function needed - use direct UPDATE or existing grant_subscription_credits
