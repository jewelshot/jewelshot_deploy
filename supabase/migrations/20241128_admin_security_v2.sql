-- ============================================
-- MIGRATION: Admin Security Enhancements V2
-- Date: 2024-11-28
-- Version: 2.0 (Fixed for Supabase setup)
-- Description: Create users table if not exists, then add admin features
-- ============================================

-- ============================================
-- STEP 0: CREATE USERS TABLE IF NOT EXISTS
-- ============================================

-- Option A: If you DON'T have a users table yet
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY IF NOT EXISTS "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY IF NOT EXISTS "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Trigger to auto-create user record on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync existing auth.users to public.users
INSERT INTO public.users (id, email, created_at)
SELECT 
  id, 
  email,
  created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 1: ADD ADMIN ROLE TO USERS TABLE
-- ============================================

-- Add role column (default: 'user')
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Add 2FA columns for future use
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_2fa_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);

-- Create role constraint (only allow specific values)
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('user', 'admin', 'superadmin'));

-- Create index for role-based queries (performance)
CREATE INDEX IF NOT EXISTS idx_users_role 
ON users(role) 
WHERE role IN ('admin', 'superadmin');

-- Add comments
COMMENT ON COLUMN users.role IS 'User role: user (default), admin (dashboard access), superadmin (full access)';
COMMENT ON COLUMN users.is_2fa_enabled IS 'Whether user has enabled two-factor authentication';
COMMENT ON COLUMN users.two_factor_secret IS 'TOTP secret for 2FA (encrypted)';

-- ============================================
-- STEP 2: CREATE AUDIT LOGS TABLE
-- ============================================

DROP TABLE IF EXISTS admin_audit_logs CASCADE;

CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_method VARCHAR(10),
  request_path TEXT,
  request_body JSONB,
  response_status INTEGER,
  success BOOLEAN NOT NULL,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE admin_audit_logs IS 'Comprehensive audit trail for all administrative actions';

-- ============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_audit_admin_id ON admin_audit_logs(admin_id, created_at DESC);
CREATE INDEX idx_audit_action ON admin_audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_target ON admin_audit_logs(target_type, target_id) WHERE target_id IS NOT NULL;
CREATE INDEX idx_audit_created ON admin_audit_logs(created_at DESC);
CREATE INDEX idx_audit_failed ON admin_audit_logs(created_at DESC) WHERE success = false;

-- ============================================
-- STEP 4: SETUP ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "No one can update audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "No one can delete audit logs" ON admin_audit_logs;

CREATE POLICY "Admins can read audit logs"
  ON admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Service role can insert audit logs"
  ON admin_audit_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "No one can update audit logs"
  ON admin_audit_logs FOR UPDATE
  USING (false);

CREATE POLICY "No one can delete audit logs"
  ON admin_audit_logs FOR DELETE
  USING (false);

-- ============================================
-- STEP 5: CREATE HELPER FUNCTIONS
-- ============================================

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
  FROM users
  WHERE id = user_id;
  
  RETURN COALESCE(user_role, 'user');
END;
$$;

COMMENT ON FUNCTION get_user_role IS 'Get role for a given user ID';

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
  FROM users
  WHERE id = user_id;
  
  RETURN user_role IN ('admin', 'superadmin');
END;
$$;

COMMENT ON FUNCTION is_admin IS 'Check if user has admin privileges';

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
    admin_id, action, target_type, target_id,
    ip_address, user_agent, request_method, request_path,
    request_body, response_status, success, error_message, metadata
  ) VALUES (
    p_admin_id, p_action, p_target_type, p_target_id,
    p_ip_address, p_user_agent, p_request_method, p_request_path,
    p_request_body, p_response_status, p_success, p_error_message, p_metadata
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

COMMENT ON FUNCTION log_admin_action IS 'Insert admin action into audit log';

-- ============================================
-- STEP 6: CREATE USEFUL VIEWS
-- ============================================

CREATE OR REPLACE VIEW recent_admin_actions AS
SELECT 
  aal.id, aal.admin_id, u.email AS admin_email, u.role AS admin_role,
  aal.action, aal.target_type, aal.target_id,
  aal.ip_address, aal.success, aal.error_message, aal.created_at
FROM admin_audit_logs aal
JOIN users u ON aal.admin_id = u.id
ORDER BY aal.created_at DESC
LIMIT 100;

CREATE OR REPLACE VIEW failed_admin_actions AS
SELECT 
  aal.id, aal.admin_id, u.email AS admin_email,
  aal.action, aal.ip_address, aal.error_message, aal.created_at
FROM admin_audit_logs aal
JOIN users u ON aal.admin_id = u.id
WHERE aal.success = false
ORDER BY aal.created_at DESC
LIMIT 100;

CREATE OR REPLACE VIEW admin_activity_summary AS
SELECT 
  u.id AS admin_id, u.email AS admin_email, u.role AS admin_role,
  COUNT(*) AS total_actions,
  COUNT(*) FILTER (WHERE aal.success = true) AS successful_actions,
  COUNT(*) FILTER (WHERE aal.success = false) AS failed_actions,
  MAX(aal.created_at) AS last_action_at
FROM users u
LEFT JOIN admin_audit_logs aal ON u.id = aal.admin_id
WHERE u.role IN ('admin', 'superadmin')
GROUP BY u.id, u.email, u.role
ORDER BY total_actions DESC;

-- ============================================
-- STEP 7: GRANT PERMISSIONS
-- ============================================

GRANT SELECT ON recent_admin_actions TO authenticated;
GRANT SELECT ON failed_admin_actions TO authenticated;
GRANT SELECT ON admin_activity_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION log_admin_action TO service_role;

-- ============================================
-- VERIFICATION QUERIES (Run after migration)
-- ============================================

-- SELECT column_name FROM information_schema.columns WHERE table_name = 'users';
-- SELECT * FROM information_schema.tables WHERE table_name = 'admin_audit_logs';
-- SELECT indexname FROM pg_indexes WHERE tablename = 'admin_audit_logs';
-- SELECT * FROM users WHERE email = 'jewelshot.ai@gmail.com';

