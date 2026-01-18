-- ============================================
-- FRAUD PREVENTION SYSTEM - SQL MIGRATION
-- ============================================
--
-- Bu migration şunları oluşturur:
-- 1. trusted_devices - Güvenilir cihazlar
-- 2. device_verification_codes - Cihaz onay kodları
-- 3. user_sessions - Oturum yönetimi
-- 4. phone_otp_codes - Telefon doğrulama OTP
-- 5. credit_unlocks - Aşamalı kredi unlock
-- 6. signup_ips - Kayıt IP takibi
--
-- Created: 2025-01-18
-- ============================================

-- ============================================
-- 1. TRUSTED DEVICES (Güvenilir Cihazlar)
-- ============================================

CREATE TABLE IF NOT EXISTS public.trusted_devices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_hash VARCHAR(64) NOT NULL,
  device_name VARCHAR(100) NOT NULL,
  device_info JSONB DEFAULT '{}',
  ip_address INET NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, device_hash)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_active 
  ON public.trusted_devices(user_id, is_active) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_trusted_devices_hash 
  ON public.trusted_devices(device_hash);

-- RLS
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own devices" ON public.trusted_devices;
CREATE POLICY "Users can view own devices"
  ON public.trusted_devices FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own devices" ON public.trusted_devices;
CREATE POLICY "Users can delete own devices"
  ON public.trusted_devices FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 2. DEVICE VERIFICATION CODES
-- ============================================

CREATE TABLE IF NOT EXISTS public.device_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_hash VARCHAR(64) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_codes_user 
  ON public.device_verification_codes(user_id);

-- RLS
ALTER TABLE public.device_verification_codes ENABLE ROW LEVEL SECURITY;

-- Only service role can access
DROP POLICY IF EXISTS "Service role only" ON public.device_verification_codes;
CREATE POLICY "Service role only"
  ON public.device_verification_codes
  USING (false);

-- ============================================
-- 3. USER SESSIONS (Oturum Yönetimi)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id VARCHAR(64) PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_token VARCHAR(64) NOT NULL,
  device_hash VARCHAR(64),
  ip_address INET NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  terminated_at TIMESTAMPTZ,
  terminated_reason VARCHAR(50)
);

-- Index for active sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user_active 
  ON public.user_sessions(user_id, is_active) 
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_sessions_created 
  ON public.user_sessions(created_at DESC);

-- RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
CREATE POLICY "Users can view own sessions"
  ON public.user_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 4. PHONE OTP CODES (Telefon Doğrulama)
-- ============================================

CREATE TABLE IF NOT EXISTS public.phone_otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  attempts INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_phone_otp_user 
  ON public.phone_otp_codes(user_id);

-- RLS
ALTER TABLE public.phone_otp_codes ENABLE ROW LEVEL SECURITY;

-- Only service role can access
DROP POLICY IF EXISTS "Service role only" ON public.phone_otp_codes;
CREATE POLICY "Service role only"
  ON public.phone_otp_codes
  USING (false);

-- ============================================
-- 5. CREDIT UNLOCKS (Aşamalı Kredi)
-- ============================================

CREATE TABLE IF NOT EXISTS public.credit_unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stage VARCHAR(50) NOT NULL,
  credits_awarded INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, stage)
);

CREATE INDEX IF NOT EXISTS idx_credit_unlocks_user 
  ON public.credit_unlocks(user_id);

-- RLS
ALTER TABLE public.credit_unlocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own unlocks" ON public.credit_unlocks;
CREATE POLICY "Users can view own unlocks"
  ON public.credit_unlocks FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 6. SIGNUP IPS (Kayıt IP Takibi)
-- ============================================

CREATE TABLE IF NOT EXISTS public.signup_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  device_fingerprint VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add device_fingerprint column if table exists but column doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'signup_ips' AND column_name = 'device_fingerprint'
  ) THEN
    ALTER TABLE public.signup_ips ADD COLUMN device_fingerprint VARCHAR(64);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_signup_ips_ip 
  ON public.signup_ips(ip_address);

-- Create fingerprint index only if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'signup_ips' AND column_name = 'device_fingerprint'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_signup_ips_fingerprint 
      ON public.signup_ips(device_fingerprint) 
      WHERE device_fingerprint IS NOT NULL;
  END IF;
EXCEPTION WHEN others THEN
  NULL; -- Ignore if index already exists
END $$;

-- RLS
ALTER TABLE public.signup_ips ENABLE ROW LEVEL SECURITY;

-- Only service role can access
DROP POLICY IF EXISTS "Service role only" ON public.signup_ips;
CREATE POLICY "Service role only"
  ON public.signup_ips
  USING (false);

-- ============================================
-- 7. DEVICE FINGERPRINTS (Eski tablo varsa)
-- ============================================

CREATE TABLE IF NOT EXISTS public.device_fingerprints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fingerprint_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, fingerprint_hash)
);

CREATE INDEX IF NOT EXISTS idx_device_fp_hash 
  ON public.device_fingerprints(fingerprint_hash);

-- ============================================
-- 8. UPDATE PROFILES TABLE
-- ============================================

-- Phone verification columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone_number VARCHAR(20);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone_verified'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone_verified BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone_verified_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone_verified_at TIMESTAMPTZ;
  END IF;
END $$;

-- Unique index on phone number (bir telefon = bir hesap)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone 
  ON public.profiles(phone_number) 
  WHERE phone_number IS NOT NULL AND phone_verified = true;

-- ============================================
-- 9. UPDATE HANDLE_NEW_USER (Progressive Credits)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile with 0 credits (progressive unlock)
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url, 
    bio, 
    credits, 
    subscription_plan, 
    subscription_status,
    welcome_credits_used,
    phone_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'bio',
    0,      -- START WITH 0 CREDITS (progressive unlock)
    'free',
    'active',
    false,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    bio = COALESCE(EXCLUDED.bio, profiles.bio),
    updated_at = NOW();
  
  -- Create user_credits with 0 balance
  INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
  VALUES (NEW.id, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Record SIGNUP stage (0 credits)
  INSERT INTO public.credit_unlocks (user_id, stage, credits_awarded)
  VALUES (NEW.id, 'SIGNUP', 0)
  ON CONFLICT (user_id, stage) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. EMAIL VERIFIED TRIGGER
-- ============================================
-- Supabase email doğrulandığında +2 kredi ver

CREATE OR REPLACE FUNCTION public.handle_email_verified()
RETURNS TRIGGER AS $$
DECLARE
  v_already_unlocked BOOLEAN;
BEGIN
  -- Email doğrulandı mı?
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    
    -- Bu aşama zaten tamamlanmış mı?
    SELECT EXISTS (
      SELECT 1 FROM public.credit_unlocks 
      WHERE user_id = NEW.id AND stage = 'EMAIL_VERIFIED'
    ) INTO v_already_unlocked;
    
    IF NOT v_already_unlocked THEN
      -- Aşamayı kaydet
      INSERT INTO public.credit_unlocks (user_id, stage, credits_awarded)
      VALUES (NEW.id, 'EMAIL_VERIFIED', 2);
      
      -- +2 kredi ver
      UPDATE public.user_credits 
      SET balance = balance + 2, total_earned = total_earned + 2, updated_at = NOW()
      WHERE user_id = NEW.id;
      
      -- Profiles tablosunu da güncelle (sync)
      UPDATE public.profiles
      SET credits = credits + 2, updated_at = NOW()
      WHERE id = NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger oluştur
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;
CREATE TRIGGER on_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_verified();

-- ============================================
-- 11. CLEANUP OLD SESSIONS (Cron Job için)
-- ============================================

CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- 24 saatten eski inactive session'ları sil
  DELETE FROM public.user_sessions
  WHERE is_active = false 
    AND terminated_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  -- 7 günden eski aktif session'ları timeout et
  UPDATE public.user_sessions
  SET 
    is_active = false,
    terminated_at = NOW(),
    terminated_reason = 'timeout'
  WHERE is_active = true 
    AND last_activity < NOW() - INTERVAL '7 days';
  
  RETURN v_count;
END;
$$;

-- ============================================
-- 12. GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION public.cleanup_old_sessions() TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trusted_devices TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.device_verification_codes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_sessions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.phone_otp_codes TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_unlocks TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.signup_ips TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.device_fingerprints TO service_role;

GRANT SELECT ON public.trusted_devices TO authenticated;
GRANT SELECT ON public.user_sessions TO authenticated;
GRANT SELECT ON public.credit_unlocks TO authenticated;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
