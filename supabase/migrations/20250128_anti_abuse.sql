-- ============================================
-- ANTI-ABUSE SYSTEM
-- ============================================
-- Tracks IP addresses, device fingerprints, and credit unlocks
-- Created: 2025-01-28
-- ============================================

-- ============================================
-- 1. SIGNUP IPS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.signup_ips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent TEXT,
  country_code TEXT,
  
  UNIQUE(user_id)
);

-- Index for fast IP lookups
CREATE INDEX IF NOT EXISTS idx_signup_ips_ip 
ON signup_ips(ip_address);

CREATE INDEX IF NOT EXISTS idx_signup_ips_created 
ON signup_ips(created_at DESC);

-- Enable RLS
ALTER TABLE public.signup_ips ENABLE ROW LEVEL SECURITY;

-- Only service role can access
CREATE POLICY "Service role can manage signup IPs"
ON public.signup_ips
FOR ALL
TO service_role
USING (true);

-- ============================================
-- 2. DEVICE FINGERPRINTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.device_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fingerprint_hash TEXT NOT NULL,
  fingerprint_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Index for fast fingerprint lookups
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_hash 
ON device_fingerprints(fingerprint_hash);

-- Enable RLS
ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;

-- Only service role can access
CREATE POLICY "Service role can manage fingerprints"
ON public.device_fingerprints
FOR ALL
TO service_role
USING (true);

-- ============================================
-- 3. CREDIT UNLOCKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.credit_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  credits_awarded INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, stage),
  
  CONSTRAINT valid_stage CHECK (
    stage IN ('SIGNUP', 'EMAIL_VERIFIED', 'FIRST_GENERATION', 'AFTER_24H', 'FIRST_PURCHASE')
  )
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_credit_unlocks_user 
ON credit_unlocks(user_id);

-- Enable RLS
ALTER TABLE public.credit_unlocks ENABLE ROW LEVEL SECURITY;

-- Users can view their own unlocks
CREATE POLICY "Users can view own credit unlocks"
ON public.credit_unlocks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only service role can insert
CREATE POLICY "Service role can manage unlocks"
ON public.credit_unlocks
FOR ALL
TO service_role
USING (true);

-- ============================================
-- 4. SUSPICIOUS ACTIVITIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.suspicious_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern TEXT NOT NULL,
  suspicion_score INTEGER NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed BOOLEAN NOT NULL DEFAULT false,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  action_taken TEXT -- 'none', 'warned', 'limited', 'banned'
);

-- Index for finding suspicious users
CREATE INDEX IF NOT EXISTS idx_suspicious_activities_user 
ON suspicious_activities(user_id);

CREATE INDEX IF NOT EXISTS idx_suspicious_activities_unreviewed 
ON suspicious_activities(reviewed) 
WHERE reviewed = false;

CREATE INDEX IF NOT EXISTS idx_suspicious_activities_score 
ON suspicious_activities(suspicion_score DESC);

-- Enable RLS
ALTER TABLE public.suspicious_activities ENABLE ROW LEVEL SECURITY;

-- Only service role and admins can access
CREATE POLICY "Service role can manage suspicious activities"
ON public.suspicious_activities
FOR ALL
TO service_role
USING (true);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to record signup IP
CREATE OR REPLACE FUNCTION record_signup_ip(
  p_user_id UUID,
  p_ip_address TEXT,
  p_user_agent TEXT DEFAULT NULL,
  p_country_code TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.signup_ips (user_id, ip_address, user_agent, country_code)
  VALUES (p_user_id, p_ip_address, p_user_agent, p_country_code)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    ip_address = EXCLUDED.ip_address,
    user_agent = EXCLUDED.user_agent,
    country_code = EXCLUDED.country_code;
END;
$$;

-- Function to record device fingerprint
CREATE OR REPLACE FUNCTION record_device_fingerprint(
  p_user_id UUID,
  p_fingerprint_hash TEXT,
  p_fingerprint_data JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.device_fingerprints (user_id, fingerprint_hash, fingerprint_data)
  VALUES (p_user_id, p_fingerprint_hash, p_fingerprint_data)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    fingerprint_hash = EXCLUDED.fingerprint_hash,
    fingerprint_data = EXCLUDED.fingerprint_data,
    last_seen_at = now();
END;
$$;

-- Function to flag suspicious activity
CREATE OR REPLACE FUNCTION flag_suspicious_activity(
  p_user_id UUID,
  p_pattern TEXT,
  p_suspicion_score INTEGER,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO public.suspicious_activities (user_id, pattern, suspicion_score, details)
  VALUES (p_user_id, p_pattern, p_suspicion_score, p_details)
  RETURNING id INTO v_activity_id;
  
  -- If high suspicion, could trigger alert/webhook here
  IF p_suspicion_score >= 70 THEN
    -- Could send notification to admins
    RAISE NOTICE 'High suspicion activity detected for user %', p_user_id;
  END IF;
  
  RETURN v_activity_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION record_signup_ip TO service_role;
GRANT EXECUTE ON FUNCTION record_device_fingerprint TO service_role;
GRANT EXECUTE ON FUNCTION flag_suspicious_activity TO service_role;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.signup_ips IS 'Tracks IP addresses used during signup to prevent abuse';
COMMENT ON TABLE public.device_fingerprints IS 'Tracks device fingerprints to detect multi-accounting';
COMMENT ON TABLE public.credit_unlocks IS 'Tracks progressive credit unlock stages for each user';
COMMENT ON TABLE public.suspicious_activities IS 'Logs suspicious user behavior for admin review';


