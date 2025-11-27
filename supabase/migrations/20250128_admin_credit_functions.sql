-- ============================================
-- ADMIN CREDIT MANAGEMENT FUNCTIONS
-- ============================================
-- Allows admins to manually add/remove credits
-- Created: 2025-01-28
-- ============================================

-- ============================================
-- 1. ADD ADMIN CREDITS
-- ============================================

CREATE OR REPLACE FUNCTION add_admin_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'Admin credit addition'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Ensure user_credits record exists
  INSERT INTO public.user_credits (user_id, balance, total_earned)
  VALUES (p_user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Add credits
  UPDATE public.user_credits
  SET 
    balance = balance + p_amount,
    total_earned = total_earned + p_amount,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Log transaction
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    operation_type,
    status,
    metadata
  ) VALUES (
    p_user_id,
    p_amount,
    'admin_addition',
    'confirmed',
    jsonb_build_object('reason', p_reason, 'admin_action', true)
  );

  RAISE NOTICE 'Added % credits to user %', p_amount, p_user_id;
END;
$$;

-- ============================================
-- 2. REMOVE ADMIN CREDITS
-- ============================================

CREATE OR REPLACE FUNCTION remove_admin_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT DEFAULT 'Admin credit removal'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
BEGIN
  -- Validate amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  -- Get current balance
  SELECT balance INTO v_current_balance
  FROM public.user_credits
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User credits record not found';
  END IF;

  -- Don't allow negative balance
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits. Current balance: %', v_current_balance;
  END IF;

  -- Remove credits
  UPDATE public.user_credits
  SET 
    balance = balance - p_amount,
    total_spent = total_spent + p_amount,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Log transaction
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    operation_type,
    status,
    metadata
  ) VALUES (
    p_user_id,
    -p_amount,
    'admin_removal',
    'confirmed',
    jsonb_build_object('reason', p_reason, 'admin_action', true)
  );

  RAISE NOTICE 'Removed % credits from user %', p_amount, p_user_id;
END;
$$;

-- ============================================
-- 3. GET USER FULL STATS
-- ============================================

CREATE OR REPLACE FUNCTION get_user_full_stats(p_user_id UUID)
RETURNS TABLE (
  total_operations BIGINT,
  total_credits_spent INTEGER,
  total_credits_earned INTEGER,
  current_balance INTEGER,
  reserved_credits INTEGER,
  first_operation_date TIMESTAMPTZ,
  last_operation_date TIMESTAMPTZ,
  operations_by_type JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(ct.id) AS total_operations,
    COALESCE(SUM(ABS(ct.amount)) FILTER (WHERE ct.amount < 0), 0)::INTEGER AS total_credits_spent,
    uc.total_earned,
    uc.balance,
    uc.reserved,
    MIN(ct.created_at) AS first_operation_date,
    MAX(ct.created_at) AS last_operation_date,
    jsonb_object_agg(
      ct.operation_type,
      COUNT(*)
    ) FILTER (WHERE ct.operation_type IS NOT NULL) AS operations_by_type
  FROM public.user_credits uc
  LEFT JOIN public.credit_transactions ct ON ct.user_id = uc.user_id AND ct.status = 'confirmed'
  WHERE uc.user_id = p_user_id
  GROUP BY uc.user_id, uc.total_earned, uc.balance, uc.reserved;
END;
$$;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT EXECUTE ON FUNCTION add_admin_credits TO service_role;
GRANT EXECUTE ON FUNCTION remove_admin_credits TO service_role;
GRANT EXECUTE ON FUNCTION get_user_full_stats TO service_role;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON FUNCTION add_admin_credits IS 'Allows admins to manually add credits to user accounts';
COMMENT ON FUNCTION remove_admin_credits IS 'Allows admins to manually remove credits from user accounts';
COMMENT ON FUNCTION get_user_full_stats IS 'Returns comprehensive statistics for a user';

