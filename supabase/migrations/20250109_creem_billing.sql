-- Creem.io Billing Integration Migration
-- Run this in Supabase SQL Editor

-- Add subscription fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS creem_customer_id TEXT DEFAULT NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_creem_customer_id ON profiles(creem_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_plan ON profiles(subscription_plan);

-- Create subscription history table for audit trail
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  action TEXT NOT NULL, -- 'activated', 'downgraded', 'upgraded', 'canceled', 'renewed'
  credits_granted INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for subscription history
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_created_at ON subscription_history(created_at DESC);

-- Enable RLS on subscription_history
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Users can only read their own subscription history
CREATE POLICY "Users can read own subscription history"
  ON subscription_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert (for webhooks)
CREATE POLICY "Service role can insert subscription history"
  ON subscription_history
  FOR INSERT
  WITH CHECK (true);

-- Grant access to authenticated users
GRANT SELECT ON subscription_history TO authenticated;

-- Comment for documentation
COMMENT ON TABLE subscription_history IS 'Tracks subscription changes for billing audit trail';
COMMENT ON COLUMN profiles.subscription_plan IS 'Current plan: free, pro, enterprise';
COMMENT ON COLUMN profiles.subscription_status IS 'Status: active, canceled, expired, trialing';
COMMENT ON COLUMN profiles.creem_customer_id IS 'Creem.io customer ID for portal access';

