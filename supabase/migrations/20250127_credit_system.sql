-- ============================================
-- CREDIT SYSTEM MIGRATION
-- ============================================
-- 
-- Atomic credit management with reserve/confirm/refund pattern
-- Prevents free generations and ensures proper refunds
--
-- Created: 2025-01-27
-- ============================================

-- ============================================
-- 1. USER CREDITS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 500, -- Starting credits
  reserved INTEGER NOT NULL DEFAULT 0,  -- Credits currently reserved for pending jobs
  total_earned INTEGER NOT NULL DEFAULT 500,
  total_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own credits"
  ON public.user_credits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only server can insert/update (via RPC functions)
-- No direct INSERT/UPDATE policies for users

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);

-- ============================================
-- 2. CREDIT TRANSACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Negative for deductions, positive for additions
  operation_type TEXT NOT NULL, -- 'edit', 'generate', 'upscale', etc.
  status TEXT NOT NULL DEFAULT 'reserved', -- 'reserved', 'confirmed', 'refunded'
  job_id TEXT, -- BullMQ job ID
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  
  CONSTRAINT valid_status CHECK (status IN ('reserved', 'confirmed', 'refunded'))
);

-- Enable RLS
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_job_id ON public.credit_transactions(job_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_status ON public.credit_transactions(status);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);

-- ============================================
-- 3. OPERATION COSTS
-- ============================================

-- Store credit costs for each operation type
CREATE TABLE IF NOT EXISTS public.operation_costs (
  operation_type TEXT PRIMARY KEY,
  cost INTEGER NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Populate with default costs
INSERT INTO public.operation_costs (operation_type, cost, description) VALUES
  ('edit', 1, 'Studio edit (nano-banana)'),
  ('generate', 2, 'Image generation (FLUX Pro)'),
  ('upscale', 1, 'Image upscaling'),
  ('remove-bg', 1, 'Background removal'),
  ('camera-control', 2, 'Camera angle adjustment'),
  ('gemstone', 2, 'Gemstone enhancement'),
  ('metal-recolor', 2, 'Metal recoloring'),
  ('metal-polish', 2, 'Metal polishing'),
  ('natural-light', 2, 'Natural lighting'),
  ('video', 5, 'Video generation'),
  ('turntable', 5, 'Turntable video')
ON CONFLICT (operation_type) DO NOTHING;

-- Enable RLS
ALTER TABLE public.operation_costs ENABLE ROW LEVEL SECURITY;

-- RLS Policy (public read)
CREATE POLICY "Anyone can view operation costs"
  ON public.operation_costs
  FOR SELECT
  USING (true);

-- ============================================
-- 4. ATOMIC CREDIT FUNCTIONS
-- ============================================

-- --------------------------------------------
-- 4.1 RESERVE CREDIT
-- --------------------------------------------

CREATE OR REPLACE FUNCTION public.reserve_credit(
  p_user_id UUID,
  p_operation_type TEXT,
  p_job_id TEXT DEFAULT NULL
)
RETURNS UUID -- Returns transaction ID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cost INTEGER;
  v_current_balance INTEGER;
  v_reserved INTEGER;
  v_transaction_id UUID;
BEGIN
  -- Get operation cost
  SELECT cost INTO v_cost
  FROM public.operation_costs
  WHERE operation_type = p_operation_type;
  
  IF v_cost IS NULL THEN
    RAISE EXCEPTION 'Unknown operation type: %', p_operation_type;
  END IF;

  -- Lock user credits row to prevent concurrent modifications
  SELECT balance, reserved INTO v_current_balance, v_reserved
  FROM public.user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;
  
  -- Create credits row if doesn't exist
  IF NOT FOUND THEN
    INSERT INTO public.user_credits (user_id, balance, reserved)
    VALUES (p_user_id, 500, 0)
    RETURNING balance, reserved INTO v_current_balance, v_reserved;
  END IF;

  -- Check if user has enough available credits
  IF (v_current_balance - v_reserved) < v_cost THEN
    RAISE EXCEPTION 'Insufficient credits. Available: %, Required: %', (v_current_balance - v_reserved), v_cost;
  END IF;

  -- Reserve credits
  UPDATE public.user_credits
  SET 
    reserved = reserved + v_cost,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Create transaction record
  INSERT INTO public.credit_transactions (
    user_id,
    amount,
    operation_type,
    status,
    job_id
  )
  VALUES (
    p_user_id,
    -v_cost,
    p_operation_type,
    'reserved',
    p_job_id
  )
  RETURNING id INTO v_transaction_id;

  RETURN v_transaction_id;
END;
$$;

-- --------------------------------------------
-- 4.2 CONFIRM CREDIT
-- --------------------------------------------

CREATE OR REPLACE FUNCTION public.confirm_credit(
  p_transaction_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_amount INTEGER;
  v_status TEXT;
BEGIN
  -- Get transaction details
  SELECT user_id, amount, status
  INTO v_user_id, v_amount, v_status
  FROM public.credit_transactions
  WHERE id = p_transaction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found: %', p_transaction_id;
  END IF;

  IF v_status != 'reserved' THEN
    RAISE EXCEPTION 'Transaction already %', v_status;
  END IF;

  -- Update user credits (deduct from balance, unreserve)
  UPDATE public.user_credits
  SET 
    balance = balance + v_amount, -- v_amount is negative
    reserved = reserved + v_amount, -- Decrease reserved
    total_spent = total_spent - v_amount, -- v_amount is negative, so this adds
    updated_at = now()
  WHERE user_id = v_user_id;

  -- Update transaction status
  UPDATE public.credit_transactions
  SET 
    status = 'confirmed',
    confirmed_at = now()
  WHERE id = p_transaction_id;
END;
$$;

-- --------------------------------------------
-- 4.3 REFUND CREDIT
-- --------------------------------------------

CREATE OR REPLACE FUNCTION public.refund_credit(
  p_transaction_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_amount INTEGER;
  v_status TEXT;
BEGIN
  -- Get transaction details
  SELECT user_id, amount, status
  INTO v_user_id, v_amount, v_status
  FROM public.credit_transactions
  WHERE id = p_transaction_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found: %', p_transaction_id;
  END IF;

  IF v_status != 'reserved' THEN
    RAISE EXCEPTION 'Can only refund reserved transactions. Current status: %', v_status;
  END IF;

  -- Unreserve credits (give back to available balance)
  UPDATE public.user_credits
  SET 
    reserved = reserved + v_amount, -- v_amount is negative, so this decreases reserved
    updated_at = now()
  WHERE user_id = v_user_id;

  -- Update transaction status
  UPDATE public.credit_transactions
  SET 
    status = 'refunded',
    refunded_at = now()
  WHERE id = p_transaction_id;
END;
$$;

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Get user's available credits
CREATE OR REPLACE FUNCTION public.get_available_credits(
  p_user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_balance INTEGER;
  v_reserved INTEGER;
BEGIN
  SELECT balance, reserved
  INTO v_balance, v_reserved
  FROM public.user_credits
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN 500; -- Default starting credits
  END IF;
  
  RETURN v_balance - v_reserved;
END;
$$;

-- ============================================
-- 6. UPDATE TRIGGER
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.reserve_credit(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_credit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refund_credit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_available_credits(UUID) TO authenticated;

-- ============================================
-- END OF MIGRATION
-- ============================================


