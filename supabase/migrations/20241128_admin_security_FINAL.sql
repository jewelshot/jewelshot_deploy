-- ============================================
-- MIGRATION: Admin Security Enhancements
-- Date: 2024-11-28
-- Version: FINAL (For existing Jewelshot DB with profiles table)
-- Description: Add admin roles and audit logging to existing setup
-- ============================================

-- ============================================
-- STEP 1: ADD ADMIN ROLE TO PROFILES TABLE
-- ============================================

-- Add role column (default: 'user')
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Add 2FA columns for future use
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_2fa_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);

-- Create role constraint (only allow specific values)
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('user', 'admin', 'superadmin'));

-- Create index for role-based queries (performance)
CREATE INDEX IF NOT EXISTS idx_profiles_role 
ON profiles(role) 
WHERE role IN ('admin', 'superadmin');

-- Add comments
COMMENT ON COLUMN profiles.role IS 'User role: user (default), admin (dashboard access), superadmin (full access)';
COMMENT ON COLUMN profiles.is_2fa_enabled IS 'Whether user has enabled two-factor authentication';
COMMENT ON COLUMN profiles.two_factor_secret IS 'TOTP secret for 2FA (encrypted)';

-- ============================================
-- STEP 2: CREATE AUDIT LOGS TABLE
-- ============================================

-- Drop if exists (for clean migration)
DROP TABLE IF EXISTS admin_audit_logs CASCADE;

-- Create comprehensive audit log table
CREATE TABLE admin_audit_logs (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Admin who performed the action
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Action details
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),  -- e.g., 'user', 'credit', 'system'
  target_id UUID,            -- ID of the affected resource
  
  -- Request context
  ip_address VARCHAR(45),    -- IPv4 or IPv6
  user_agent TEXT,
  request_method VARCHAR(10), -- GET, POST, DELETE, etc.
  request_path TEXT,
  request_body JSONB,         -- Sanitized request data
  
  -- Response details
  response_status INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  
  -- Additional metadata
  metadata JSONB,             -- Flexible field for extra data
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add table comment
COMMENT ON TABLE admin_audit_logs IS 'Comprehensive audit trail for all administrative actions';

-- ============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for querying by admin and time
CREATE INDEX idx_audit_admin_id 
ON admin_audit_logs(admin_id, created_at DESC);

-- Index for querying by action type
CREATE INDEX idx_audit_action 
ON admin_audit_logs(action, created_at DESC);

-- Index for querying by target
CREATE INDEX idx_audit_target 
ON admin_audit_logs(target_type, target_id) 
WHERE target_id IS NOT NULL;

-- Index for time-based queries (most recent actions)
CREATE INDEX idx_audit_created 
ON admin_audit_logs(created_at DESC);

-- Index for failed actions (security monitoring)
CREATE INDEX idx_audit_failed 
ON admin_audit_logs(created_at DESC) 
WHERE success = false;

-- ============================================
-- STEP 4: SETUP ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on audit logs
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins can read audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "No one can update audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "No one can delete audit logs" ON admin_audit_logs;

-- Policy 1: Only admins can read audit logs
CREATE POLICY "Admins can read audit logs"
  ON admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'superadmin')
    )
  );

-- Policy 2: Service role can insert (for API routes)
CREATE POLICY "Service role can insert audit logs"
  ON admin_audit_logs FOR INSERT
  WITH CHECK (true);
  -- Note: This uses service role key which bypasses RLS

-- Policy 3: No updates allowed (immutable audit trail)
CREATE POLICY "No one can update audit logs"
  ON admin_audit_logs FOR UPDATE
  USING (false);

-- Policy 4: No deletes allowed (permanent record)
CREATE POLICY "No one can delete audit logs"
  ON admin_audit_logs FOR DELETE
  USING (false);

-- ============================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- ============================================

-- Drop existing functions first (if any)
DROP FUNCTION IF EXISTS get_user_role(UUID);
DROP FUNCTION IF EXISTS is_admin(UUID);
DROP FUNCTION IF EXISTS log_admin_action(UUID, VARCHAR, VARCHAR, UUID, VARCHAR, TEXT, VARCHAR, TEXT, JSONB, INTEGER, BOOLEAN, TEXT, JSONB);

-- Function 1: Get user role (convenience function)
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS VARCHAR(20)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role VARCHAR(20);
BEGIN
  SELECT role INTO user_role
  FROM profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

COMMENT ON FUNCTION get_user_role IS 'Get role for a given user ID';

-- Function 2: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role VARCHAR(20);
BEGIN
  SELECT role INTO user_role
  FROM profiles
  WHERE id = user_id;
  
  RETURN user_role IN ('admin', 'superadmin');
END;
$$;

COMMENT ON FUNCTION is_admin IS 'Check if user has admin privileges';

-- Function 3: Log admin action (simplified insert)
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action VARCHAR(100),
  p_target_type VARCHAR(50) DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_ip_address VARCHAR(45) DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_request_method VARCHAR(10) DEFAULT NULL,
  p_request_path TEXT DEFAULT NULL,
  p_request_body JSONB DEFAULT NULL,
  p_response_status INTEGER DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO admin_audit_logs (
    admin_id,
    action,
    target_type,
    target_id,
    ip_address,
    user_agent,
    request_method,
    request_path,
    request_body,
    response_status,
    success,
    error_message,
    metadata
  ) VALUES (
    p_admin_id,
    p_action,
    p_target_type,
    p_target_id,
    p_ip_address,
    p_user_agent,
    p_request_method,
    p_request_path,
    p_request_body,
    p_response_status,
    p_success,
    p_error_message,
    p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

COMMENT ON FUNCTION log_admin_action IS 'Insert admin action into audit log and return log ID';

-- ============================================
-- STEP 6: CREATE USEFUL VIEWS
-- ============================================

-- View 1: Recent admin actions (last 100)
CREATE OR REPLACE VIEW recent_admin_actions AS
SELECT 
  aal.id,
  aal.admin_id,
  p.email AS admin_email,
  p.role AS admin_role,
  aal.action,
  aal.target_type,
  aal.target_id,
  aal.ip_address,
  aal.success,
  aal.error_message,
  aal.created_at
FROM admin_audit_logs aal
JOIN profiles p ON aal.admin_id = p.id
ORDER BY aal.created_at DESC
LIMIT 100;

COMMENT ON VIEW recent_admin_actions IS 'Last 100 admin actions with user details';

-- View 2: Failed admin actions (security monitoring)
CREATE OR REPLACE VIEW failed_admin_actions AS
SELECT 
  aal.id,
  aal.admin_id,
  p.email AS admin_email,
  aal.action,
  aal.ip_address,
  aal.error_message,
  aal.created_at
FROM admin_audit_logs aal
JOIN profiles p ON aal.admin_id = p.id
WHERE aal.success = false
ORDER BY aal.created_at DESC
LIMIT 100;

COMMENT ON VIEW failed_admin_actions IS 'Failed admin actions for security monitoring';

-- View 3: Admin activity summary (by admin)
CREATE OR REPLACE VIEW admin_activity_summary AS
SELECT 
  p.id AS admin_id,
  p.email AS admin_email,
  p.role AS admin_role,
  COUNT(*) AS total_actions,
  COUNT(*) FILTER (WHERE aal.success = true) AS successful_actions,
  COUNT(*) FILTER (WHERE aal.success = false) AS failed_actions,
  MAX(aal.created_at) AS last_action_at
FROM profiles p
LEFT JOIN admin_audit_logs aal ON p.id = aal.admin_id
WHERE p.role IN ('admin', 'superadmin')
GROUP BY p.id, p.email, p.role
ORDER BY total_actions DESC;

COMMENT ON VIEW admin_activity_summary IS 'Summary of admin activity by user';

-- ============================================
-- STEP 7: GRANT PERMISSIONS
-- ============================================

-- Grant view access to authenticated users (RLS will filter)
GRANT SELECT ON recent_admin_actions TO authenticated;
GRANT SELECT ON failed_admin_actions TO authenticated;
GRANT SELECT ON admin_activity_summary TO authenticated;

-- Grant function execution to authenticated users
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION log_admin_action TO service_role;

-- ============================================
-- STEP 8: VERIFICATION QUERIES
-- ============================================

-- Run these queries after migration to verify:

-- 1. Check profiles table structure
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name IN ('role', 'is_2fa_enabled', 'two_factor_secret');
-- Expected: 3 rows

-- 2. Check audit_logs table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'admin_audit_logs';
-- Expected: 1 row

-- 3. Check indexes created
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'admin_audit_logs';
-- Expected: 5-6 indexes

-- 4. Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_audit_logs';
-- Expected: rowsecurity = true

-- 5. Check functions created
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_user_role', 'is_admin', 'log_admin_action');
-- Expected: 3 functions

-- 6. Check views created
SELECT table_name 
FROM information_schema.views 
WHERE table_name LIKE '%admin%';
-- Expected: 3 views

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Next step: Set your user as admin
-- See MANUAL_ADMIN_SETUP_PROFILES.md for instructions

