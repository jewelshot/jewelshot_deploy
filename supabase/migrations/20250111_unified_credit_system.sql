-- ============================================
-- UNIFIED CREDIT SYSTEM MIGRATION
-- ============================================
-- 
-- Fixes the critical bug where payment system and credit system were disconnected
-- 
-- Problem:
-- - Creem webhook updated profiles.credits
-- - AI generation used user_credits.balance
-- - These were NEVER synchronized!
--
-- Solution:
-- - Create grant_subscription_credits() function
-- - Update user_credits table when subscription is granted
-- - Add monthly renewal capability
-- - Keep profiles.credits for backwards compatibility (synced)
--
-- Created: 2025-01-11
-- ============================================

-- ============================================
-- 0. DROP EXISTING FUNCTIONS (to allow re-creation)
-- ============================================
DROP FUNCTION IF EXISTS public.add_admin_credits(UUID, INTEGER, TEXT);
DROP FUNCTION IF EXISTS public.remove_admin_credits(UUID, INTEGER, TEXT);
DROP FUNCTION IF EXISTS public.grant_subscription_credits(UUID, TEXT, INTEGER, TIMESTAMPTZ);
DROP FUNCTION IF EXISTS public.revoke_subscription_credits(UUID, TEXT);
DROP FUNCTION IF EXISTS public.get_user_plan_info(UUID);
DROP FUNCTION IF EXISTS public.check_subscription_renewals();
DROP FUNCTION IF EXISTS public.cleanup_orphaned_reservations();
DROP FUNCTION IF EXISTS public.sync_credits_to_profile() CASCADE;

-- ============================================
-- 1. GRANT SUBSCRIPTION CREDITS FUNCTION
-- ============================================
-- Called by Creem webhook when payment succeeds
-- Updates BOTH profiles and user_credits atomically

CREATE OR REPLACE FUNCTION public.grant_subscription_credits(
  p_user_id UUID,
  p_plan TEXT,
  p_credits INTEGER,
  p_renewal_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE(success BOOLEAN, message TEXT, new_balance INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User ID is required'::TEXT, 0;
    RETURN;
  END IF;
  
  IF p_credits <= 0 THEN
    RETURN QUERY SELECT false, 'Credits must be positive'::TEXT, 0;
    RETURN;
  END IF;

  -- Start transaction (implicit in function)
  
  -- 1. Update or create user_credits record
  INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
  VALUES (p_user_id, p_credits, 0, p_credits, 0)
  ON CONFLICT (user_id) DO UPDATE SET
    balance = p_credits,  -- Reset to plan credits (monthly reset)
    reserved = 0,         -- Clear any stale reservations
    total_earned = user_credits.total_earned + p_credits,
    updated_at = NOW()
  RETURNING balance INTO v_new_balance;

  -- 2. Update profiles table for UI display and backwards compatibility
  UPDATE public.profiles
  SET 
    credits = p_credits,
    subscription_plan = p_plan,
    subscription_status = 'active',
    subscription_renewal_date = COALESCE(p_renewal_date, NOW() + INTERVAL '30 days'),
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- If profile doesn't exist, that's a bigger problem - don't fail silently
  IF NOT FOUND THEN
    RAISE WARNING 'Profile not found for user %', p_user_id;
  END IF;

  -- 3. Clear any pending/reserved credit transactions (stale from failed jobs)
  UPDATE public.credit_transactions
  SET 
    status = 'refunded',
    refunded_at = NOW()
  WHERE user_id = p_user_id 
    AND status = 'reserved'
    AND created_at < NOW() - INTERVAL '1 hour';

  RETURN QUERY SELECT true, 'Credits granted successfully'::TEXT, v_new_balance;
END;
$$;

-- ============================================
-- 2. REVOKE SUBSCRIPTION CREDITS FUNCTION
-- ============================================
-- Called when subscription is canceled or expired

CREATE OR REPLACE FUNCTION public.revoke_subscription_credits(
  p_user_id UUID,
  p_reason TEXT DEFAULT 'canceled'
)
RETURNS TABLE(success BOOLEAN, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_free_credits INTEGER := 10;  -- Free plan credits
BEGIN
  -- Validate inputs
  IF p_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'User ID is required'::TEXT;
    RETURN;
  END IF;

  -- 1. Update user_credits to free plan level
  UPDATE public.user_credits
  SET 
    balance = LEAST(balance, v_free_credits),  -- Don't exceed free credits
    reserved = 0,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- If no record, create one with free credits
  IF NOT FOUND THEN
    INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
    VALUES (p_user_id, v_free_credits, 0, v_free_credits, 0);
  END IF;

  -- 2. Update profiles table
  UPDATE public.profiles
  SET 
    credits = LEAST(credits, v_free_credits),
    subscription_plan = 'free',
    subscription_status = p_reason,
    subscription_renewal_date = NULL,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- 3. Clear any pending reservations
  UPDATE public.credit_transactions
  SET 
    status = 'refunded',
    refunded_at = NOW()
  WHERE user_id = p_user_id 
    AND status = 'reserved';

  RETURN QUERY SELECT true, 'Credits revoked, downgraded to free'::TEXT;
END;
$$;

-- ============================================
-- 3. SYNC CREDITS TRIGGER
-- ============================================
-- Keeps profiles.credits in sync with user_credits.balance

CREATE OR REPLACE FUNCTION public.sync_credits_to_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When user_credits.balance changes, update profiles.credits
  UPDATE public.profiles
  SET 
    credits = NEW.balance,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if exists, then create
DROP TRIGGER IF EXISTS sync_credits_trigger ON public.user_credits;

CREATE TRIGGER sync_credits_trigger
  AFTER INSERT OR UPDATE OF balance ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_credits_to_profile();

-- ============================================
-- 4. GET USER PLAN INFO FUNCTION
-- ============================================
-- Returns complete plan and credit info for a user

CREATE OR REPLACE FUNCTION public.get_user_plan_info(p_user_id UUID)
RETURNS TABLE(
  plan TEXT,
  status TEXT,
  credits_available INTEGER,
  credits_reserved INTEGER,
  credits_total INTEGER,
  renewal_date TIMESTAMPTZ,
  is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.subscription_plan, 'free')::TEXT as plan,
    COALESCE(p.subscription_status, 'active')::TEXT as status,
    COALESCE(uc.balance - uc.reserved, 0)::INTEGER as credits_available,
    COALESCE(uc.reserved, 0)::INTEGER as credits_reserved,
    COALESCE(uc.balance, 0)::INTEGER as credits_total,
    p.subscription_renewal_date as renewal_date,
    (COALESCE(p.subscription_status, 'active') = 'active')::BOOLEAN as is_active
  FROM public.profiles p
  LEFT JOIN public.user_credits uc ON uc.user_id = p.id
  WHERE p.id = p_user_id;
END;
$$;

-- ============================================
-- 5. MONTHLY RENEWAL CHECK FUNCTION
-- ============================================
-- Called by cron job to check and renew subscriptions
-- Note: Actual credit renewal happens via Creem webhook on payment success

CREATE OR REPLACE FUNCTION public.check_subscription_renewals()
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  plan TEXT,
  status TEXT,
  renewal_date TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Return subscriptions that need attention (expired but still active)
  RETURN QUERY
  SELECT 
    p.id,
    p.email,
    p.subscription_plan::TEXT,
    p.subscription_status::TEXT,
    p.subscription_renewal_date
  FROM public.profiles p
  WHERE p.subscription_plan IN ('pro', 'enterprise')
    AND p.subscription_status = 'active'
    AND p.subscription_renewal_date < NOW();
END;
$$;

-- ============================================
-- 6. CLEANUP ORPHANED RESERVATIONS
-- ============================================
-- Cleans up reservations older than 1 hour (stale from failed jobs)

CREATE OR REPLACE FUNCTION public.cleanup_orphaned_reservations()
RETURNS TABLE(
  cleaned_count INTEGER,
  refunded_amount INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cleaned INTEGER := 0;
  v_refunded INTEGER := 0;
  r RECORD;
BEGIN
  -- Find all stale reserved transactions (older than 1 hour)
  FOR r IN 
    SELECT ct.id, ct.user_id, ct.amount
    FROM public.credit_transactions ct
    WHERE ct.status = 'reserved'
      AND ct.created_at < NOW() - INTERVAL '1 hour'
  LOOP
    -- Refund the credits
    UPDATE public.user_credits
    SET 
      reserved = reserved + r.amount,  -- amount is negative, so this decreases reserved
      updated_at = NOW()
    WHERE user_id = r.user_id;
    
    -- Mark transaction as refunded
    UPDATE public.credit_transactions
    SET 
      status = 'refunded',
      refunded_at = NOW(),
      metadata = jsonb_set(COALESCE(metadata, '{}'), '{refund_reason}', '"orphaned_cleanup"')
    WHERE id = r.id;
    
    v_cleaned := v_cleaned + 1;
    v_refunded := v_refunded + ABS(r.amount);
  END LOOP;
  
  RETURN QUERY SELECT v_cleaned, v_refunded;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.cleanup_orphaned_reservations() TO service_role;

-- ============================================
-- 7. MIGRATE EXISTING DATA
-- ============================================
-- Sync ALL profiles to user_credits (not just those with credits > 0)

DO $$
DECLARE
  r RECORD;
  v_credits INTEGER;
BEGIN
  FOR r IN 
    SELECT id, COALESCE(credits, 10) as credits, subscription_plan 
    FROM public.profiles
  LOOP
    -- Determine credits based on plan
    v_credits := CASE 
      WHEN r.subscription_plan = 'enterprise' THEN 999999
      WHEN r.subscription_plan = 'pro' THEN 500
      ELSE GREATEST(r.credits, 10)  -- At least 10 for free tier
    END;
    
    INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
    VALUES (r.id, v_credits, 0, v_credits, 0)
    ON CONFLICT (user_id) DO UPDATE SET
      balance = GREATEST(user_credits.balance, v_credits),
      updated_at = NOW();
  END LOOP;
  
  RAISE NOTICE 'Migrated profiles to user_credits';
END;
$$;

-- ============================================
-- 8. ADMIN CREDIT FUNCTIONS
-- ============================================
-- For admin panel to add/remove credits manually

CREATE OR REPLACE FUNCTION public.add_admin_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'Admin credit addition'
)
RETURNS TABLE(success BOOLEAN, message TEXT, new_balance INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RETURN QUERY SELECT false, 'Amount must be positive'::TEXT, 0;
    RETURN;
  END IF;

  -- Update or create user_credits
  INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
  VALUES (p_user_id, p_amount, 0, p_amount, 0)
  ON CONFLICT (user_id) DO UPDATE SET
    balance = user_credits.balance + p_amount,
    total_earned = user_credits.total_earned + p_amount,
    updated_at = NOW()
  RETURNING balance INTO v_new_balance;

  -- Log the transaction
  INSERT INTO public.credit_transactions (user_id, amount, operation_type, status, metadata)
  VALUES (
    p_user_id,
    p_amount,
    'admin_addition',
    'confirmed',
    jsonb_build_object('reason', p_reason, 'added_at', NOW())
  );

  RETURN QUERY SELECT true, format('Added %s credits', p_amount)::TEXT, v_new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.remove_admin_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'Admin credit removal'
)
RETURNS TABLE(success BOOLEAN, message TEXT, new_balance INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RETURN QUERY SELECT false, 'Amount must be positive'::TEXT, 0;
    RETURN;
  END IF;

  -- Get current balance
  SELECT balance INTO v_current_balance
  FROM public.user_credits
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'User has no credits'::TEXT, 0;
    RETURN;
  END IF;

  IF v_current_balance < p_amount THEN
    RETURN QUERY SELECT false, 'Insufficient credits'::TEXT, v_current_balance;
    RETURN;
  END IF;

  -- Remove credits
  UPDATE public.user_credits
  SET 
    balance = balance - p_amount,
    total_spent = total_spent + p_amount,
    updated_at = NOW()
  WHERE user_id = p_user_id
  RETURNING balance INTO v_new_balance;

  -- Log the transaction
  INSERT INTO public.credit_transactions (user_id, amount, operation_type, status, metadata)
  VALUES (
    p_user_id,
    -p_amount,
    'admin_removal',
    'confirmed',
    jsonb_build_object('reason', p_reason, 'removed_at', NOW())
  );

  RETURN QUERY SELECT true, format('Removed %s credits', p_amount)::TEXT, v_new_balance;
END;
$$;

-- ============================================
-- 9. UPDATE handle_new_user TO CREATE user_credits
-- ============================================
-- CRITICAL: When a new user signs up, we must create their credits record

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, avatar_url, bio, credits, subscription_plan, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'bio',
    10,  -- Free tier starting credits
    'free',
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    bio = COALESCE(EXCLUDED.bio, profiles.bio),
    updated_at = NOW();
  
  -- Create user_credits record for AI generation
  INSERT INTO public.user_credits (user_id, balance, reserved, total_earned, total_spent)
  VALUES (NEW.id, 10, 0, 10, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 10. GRANT PERMISSIONS
-- ============================================

-- RPC functions need to be callable by authenticated users and service role
GRANT EXECUTE ON FUNCTION public.grant_subscription_credits(UUID, TEXT, INTEGER, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_subscription_credits(UUID, TEXT, INTEGER, TIMESTAMPTZ) TO service_role;

GRANT EXECUTE ON FUNCTION public.revoke_subscription_credits(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_subscription_credits(UUID, TEXT) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_user_plan_info(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_plan_info(UUID) TO service_role;

GRANT EXECUTE ON FUNCTION public.check_subscription_renewals() TO service_role;

GRANT EXECUTE ON FUNCTION public.add_admin_credits(UUID, INTEGER, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.remove_admin_credits(UUID, INTEGER, TEXT) TO service_role;

-- ============================================
-- END OF MIGRATION
-- ============================================
