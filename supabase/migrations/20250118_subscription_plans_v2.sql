-- ============================================
-- SUBSCRIPTION PLANS V2 MIGRATION
-- ============================================
-- 
-- Changes:
-- 1. New users get 5 welcome credits (was 10)
-- 2. When subscribing, welcome credits are ADDED to plan credits
-- 3. New plan structure: BASIC, STUDIO, PRO, ENTERPRISE
--
-- Plan Credits:
--   FREE: 5 credits (welcome bonus only)
--   BASIC: 50/month + 5 bonus = 55 total on first purchase
--   STUDIO: 200/month + 5 bonus = 205 total on first purchase
--   PRO: 500/month + 5 bonus = 505 total on first purchase
--   ENTERPRISE: Unlimited + 5 bonus = Unlimited
--
-- Created: 2025-01-18
-- ============================================

-- ============================================
-- 1. UPDATE HANDLE_NEW_USER - 5 Credits
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile with 5 welcome credits
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url, 
    bio, 
    credits, 
    subscription_plan, 
    subscription_status,
    welcome_credits_used
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'bio',
    5,      -- Changed from 10 to 5 welcome credits
    'free',
    'active',
    false   -- Track if welcome credits should be added to subscription
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    bio = COALESCE(EXCLUDED.bio, profiles.bio),
    updated_at = NOW();
  
  -- Create user_credits record with 5 welcome credits
  INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
  VALUES (NEW.id, 5, 0, 5, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. ADD welcome_credits_used COLUMN IF NOT EXISTS
-- ============================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'welcome_credits_used'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN welcome_credits_used BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ============================================
-- 3. UPDATE GRANT_SUBSCRIPTION_CREDITS
-- ============================================
-- Now adds welcome bonus (5 credits) on FIRST subscription

DROP FUNCTION IF EXISTS public.grant_subscription_credits(UUID, TEXT, INTEGER, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION public.grant_subscription_credits(
  p_user_id UUID,
  p_plan TEXT,
  p_credits INTEGER,
  p_renewal_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, message TEXT, new_balance INTEGER, bonus_added INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_welcome_bonus INTEGER := 0;
  v_welcome_credits_used BOOLEAN;
  v_total_credits INTEGER;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User ID is required'::TEXT, 0, 0;
    RETURN;
  END IF;
  
  IF p_credits <= 0 THEN
    RETURN QUERY SELECT false, 'Credits must be positive'::TEXT, 0, 0;
    RETURN;
  END IF;

  -- Check if this is user's first subscription (welcome bonus not yet used)
  SELECT welcome_credits_used INTO v_welcome_credits_used
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- If first subscription, add 5 welcome bonus credits
  IF v_welcome_credits_used IS NULL OR v_welcome_credits_used = false THEN
    v_welcome_bonus := 5;
  END IF;
  
  -- Calculate total credits (plan credits + welcome bonus)
  v_total_credits := p_credits + v_welcome_bonus;
  
  -- 1. Update or create user_credits record
  INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
  VALUES (p_user_id, v_total_credits, 0, v_total_credits, 0)
  ON CONFLICT (user_id) DO UPDATE SET
    balance = v_total_credits,  -- Reset to plan credits + bonus
    reserved = 0,               -- Clear any stale reservations
    total_earned = user_credits.total_earned + v_total_credits,
    updated_at = NOW()
  RETURNING balance INTO v_new_balance;

  -- 2. Update profiles table
  UPDATE public.profiles
  SET 
    credits = v_total_credits,
    subscription_plan = p_plan,
    subscription_status = 'active',
    subscription_renewal_date = COALESCE(p_renewal_date, NOW() + INTERVAL '30 days'),
    welcome_credits_used = true,  -- Mark welcome bonus as used
    updated_at = NOW()
  WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE WARNING 'Profile not found for user %', p_user_id;
  END IF;

  -- 3. Clear any pending/reserved credit transactions
  UPDATE public.credit_transactions
  SET 
    status = 'refunded',
    refunded_at = NOW()
  WHERE user_id = p_user_id 
    AND status = 'reserved'
    AND created_at < NOW() - INTERVAL '1 hour';

  RETURN QUERY SELECT true, 
    format('Credits granted: %s plan + %s bonus = %s total', p_credits, v_welcome_bonus, v_total_credits)::TEXT, 
    v_new_balance,
    v_welcome_bonus;
END;
$$;

-- ============================================
-- 4. UPDATE REVOKE_SUBSCRIPTION_CREDITS
-- ============================================
-- Free tier now has 5 credits (was 10)

DROP FUNCTION IF EXISTS public.revoke_subscription_credits(UUID, TEXT);

CREATE OR REPLACE FUNCTION public.revoke_subscription_credits(
  p_user_id UUID,
  p_reason TEXT DEFAULT 'canceled'
)
RETURNS TABLE(success BOOLEAN, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_free_credits INTEGER := 5;  -- Changed from 10 to 5
BEGIN
  IF p_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User ID is required'::TEXT;
    RETURN;
  END IF;

  -- Update user_credits to free plan level
  UPDATE public.user_credits
  SET 
    balance = LEAST(balance, v_free_credits),
    reserved = 0,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
    VALUES (p_user_id, v_free_credits, 0, v_free_credits, 0);
  END IF;

  -- Update profiles table
  UPDATE public.profiles
  SET 
    credits = LEAST(credits, v_free_credits),
    subscription_plan = 'free',
    subscription_status = p_reason,
    subscription_renewal_date = NULL,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Clear any pending reservations
  UPDATE public.credit_transactions
  SET 
    status = 'refunded',
    refunded_at = NOW()
  WHERE user_id = p_user_id 
    AND status = 'reserved';

  RETURN QUERY SELECT true, 'Credits revoked, downgraded to free (5 credits)'::TEXT;
END;
$$;

-- ============================================
-- 5. CREATE SUBSCRIPTION_PLANS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  creem_product_id TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  concurrency_limit INTEGER DEFAULT 2,
  storage_gb INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the 4 plans + free tier
INSERT INTO public.subscription_plans (
  id, name, display_name, credits, price_monthly, price_yearly, 
  concurrency_limit, storage_gb, sort_order, features
) VALUES
  ('free', 'FREE', 'Free', 5, 0, 0, 2, 5, 0, 
   '["5 welcome credits", "2 concurrent requests", "5GB storage", "Basic support", "7-day history"]'::jsonb),
  ('basic', 'BASIC', 'Basic', 50, 9.00, 90.00, 3, 10, 1,
   '["50 credits/month", "3 concurrent requests", "10GB storage", "Email support", "30-day history", "Standard quality"]'::jsonb),
  ('studio', 'STUDIO', 'Studio', 200, 29.00, 290.00, 5, 25, 2,
   '["200 credits/month", "5 concurrent requests", "25GB storage", "Priority support", "Unlimited history", "High quality", "Batch processing"]'::jsonb),
  ('pro', 'PRO', 'Pro', 500, 79.00, 790.00, 10, 100, 3,
   '["500 credits/month", "10 concurrent requests", "100GB storage", "Priority support", "Unlimited history", "Maximum quality", "Batch processing", "API access", "Custom presets"]'::jsonb),
  ('enterprise', 'ENTERPRISE', 'Enterprise', 999999, 199.00, 1990.00, 25, 500, 4,
   '["Unlimited credits", "25 concurrent requests", "500GB storage", "24/7 dedicated support", "Unlimited history", "Maximum quality", "Batch processing", "Full API access", "Custom integrations", "White-label options", "Team management"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  credits = EXCLUDED.credits,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  concurrency_limit = EXCLUDED.concurrency_limit,
  storage_gb = EXCLUDED.storage_gb,
  features = EXCLUDED.features,
  updated_at = NOW();

-- ============================================
-- 6. GET PLAN DETAILS FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.get_plan_details(p_plan_id TEXT)
RETURNS TABLE(
  id TEXT,
  name TEXT,
  display_name TEXT,
  credits INTEGER,
  price_monthly DECIMAL,
  concurrency_limit INTEGER,
  storage_gb INTEGER,
  features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.name,
    sp.display_name,
    sp.credits,
    sp.price_monthly,
    sp.concurrency_limit,
    sp.storage_gb,
    sp.features
  FROM public.subscription_plans sp
  WHERE sp.id = LOWER(p_plan_id) AND sp.is_active = true;
END;
$$;

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION public.grant_subscription_credits(UUID, TEXT, INTEGER, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_subscription_credits(UUID, TEXT, INTEGER, TIMESTAMPTZ) TO service_role;

GRANT EXECUTE ON FUNCTION public.revoke_subscription_credits(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_subscription_credits(UUID, TEXT) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_plan_details(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_plan_details(TEXT) TO service_role;

GRANT SELECT ON public.subscription_plans TO authenticated;
GRANT SELECT ON public.subscription_plans TO service_role;

-- ============================================
-- 8. UPDATE EXISTING FREE USERS TO 5 CREDITS
-- ============================================
-- Only if they haven't used any credits yet

UPDATE public.user_credits uc
SET balance = 5, total_earned = 5
FROM public.profiles p
WHERE uc.user_id = p.id
  AND p.subscription_plan = 'free'
  AND uc.total_spent = 0
  AND uc.balance = 10;

UPDATE public.profiles
SET credits = 5
WHERE subscription_plan = 'free'
  AND credits = 10
  AND id IN (
    SELECT user_id FROM public.user_credits WHERE total_spent = 0
  );

-- ============================================
-- END OF MIGRATION
-- ============================================
