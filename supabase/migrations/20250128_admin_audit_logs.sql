-- ============================================
-- ADMIN AUDIT LOGS SYSTEM
-- ============================================
-- Track all admin actions for security & compliance
-- Created: 2025-01-28
-- ============================================

-- ============================================
-- 1. ADMIN_LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Admin Info
  admin_email TEXT NOT NULL,
  admin_ip TEXT,
  admin_user_agent TEXT,
  
  -- Action Info
  action_type TEXT NOT NULL, -- 'user_ban', 'credit_add', 'credit_remove', 'user_delete', 'config_update', etc.
  action_category TEXT NOT NULL, -- 'user_management', 'credit_management', 'system_config', 'security'
  
  -- Target Info
  target_type TEXT, -- 'user', 'system', 'config', etc.
  target_id UUID, -- User ID, config ID, etc.
  target_email TEXT, -- For user-related actions
  
  -- Action Details
  action_details JSONB NOT NULL DEFAULT '{}', -- Full action data
  changes JSONB, -- Before/after state
  
  -- Result
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  
  -- Metadata
  api_endpoint TEXT, -- Which API was called
  request_id TEXT, -- For correlation
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Indexes for fast queries
  CONSTRAINT valid_action_type CHECK (action_type IN (
    'user_view', 'user_ban', 'user_unban', 'user_delete',
    'credit_add', 'credit_remove',
    'config_update', 'maintenance_toggle',
    'api_key_rotate', 'worker_restart',
    'batch_cancel', 'batch_retry',
    'login_success', 'login_fail'
  )),
  CONSTRAINT valid_category CHECK (action_category IN (
    'authentication', 'user_management', 'credit_management', 
    'system_config', 'security', 'batch_management'
  ))
);

-- Indexes for performance
CREATE INDEX idx_admin_logs_admin_email ON public.admin_logs(admin_email);
CREATE INDEX idx_admin_logs_action_type ON public.admin_logs(action_type);
CREATE INDEX idx_admin_logs_action_category ON public.admin_logs(action_category);
CREATE INDEX idx_admin_logs_target_id ON public.admin_logs(target_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at DESC);
CREATE INDEX idx_admin_logs_success ON public.admin_logs(success);

-- Composite index for common queries
CREATE INDEX idx_admin_logs_email_created ON public.admin_logs(admin_email, created_at DESC);
CREATE INDEX idx_admin_logs_target_created ON public.admin_logs(target_id, created_at DESC);

-- ============================================
-- 2. USER ACTION TIMELINE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_action_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Info
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Action Info
  action_type TEXT NOT NULL, -- 'signup', 'login', 'logout', 'generate', 'batch_create', 'credit_purchase', etc.
  action_category TEXT NOT NULL, -- 'auth', 'ai_operation', 'batch', 'payment', 'profile'
  
  -- Action Details
  action_details JSONB NOT NULL DEFAULT '{}',
  
  -- Context
  ip_address TEXT,
  user_agent TEXT,
  device_fingerprint TEXT,
  
  -- Result
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_user_timeline_user_id ON public.user_action_timeline(user_id);
CREATE INDEX idx_user_timeline_action_type ON public.user_action_timeline(action_type);
CREATE INDEX idx_user_timeline_created_at ON public.user_action_timeline(created_at DESC);
CREATE INDEX idx_user_timeline_user_created ON public.user_action_timeline(user_id, created_at DESC);

-- ============================================
-- 3. HELPER FUNCTIONS
-- ============================================

-- Log admin action
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_email TEXT,
  p_action_type TEXT,
  p_action_category TEXT,
  p_action_details JSONB DEFAULT '{}',
  p_target_type TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_target_email TEXT DEFAULT NULL,
  p_admin_ip TEXT DEFAULT NULL,
  p_api_endpoint TEXT DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.admin_logs (
    admin_email,
    admin_ip,
    action_type,
    action_category,
    target_type,
    target_id,
    target_email,
    action_details,
    api_endpoint,
    success,
    error_message
  ) VALUES (
    p_admin_email,
    p_admin_ip,
    p_action_type,
    p_action_category,
    p_target_type,
    p_target_id,
    p_target_email,
    p_action_details,
    p_api_endpoint,
    p_success,
    p_error_message
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Log user action
CREATE OR REPLACE FUNCTION log_user_action(
  p_user_id UUID,
  p_action_type TEXT,
  p_action_category TEXT,
  p_action_details JSONB DEFAULT '{}',
  p_ip_address TEXT DEFAULT NULL,
  p_success BOOLEAN DEFAULT true,
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.user_action_timeline (
    user_id,
    action_type,
    action_category,
    action_details,
    ip_address,
    success,
    error_message
  ) VALUES (
    p_user_id,
    p_action_type,
    p_action_category,
    p_action_details,
    p_ip_address,
    p_success,
    p_error_message
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Get admin activity summary
CREATE OR REPLACE FUNCTION get_admin_activity_summary(
  p_admin_email TEXT,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_actions BIGINT,
  successful_actions BIGINT,
  failed_actions BIGINT,
  actions_by_category JSONB,
  recent_actions JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_actions,
    COUNT(*) FILTER (WHERE success = true)::BIGINT AS successful_actions,
    COUNT(*) FILTER (WHERE success = false)::BIGINT AS failed_actions,
    jsonb_object_agg(
      action_category,
      category_count
    ) AS actions_by_category,
    jsonb_agg(
      jsonb_build_object(
        'action_type', action_type,
        'target_email', target_email,
        'created_at', created_at,
        'success', success
      )
      ORDER BY created_at DESC
    ) AS recent_actions
  FROM (
    SELECT
      action_category,
      COUNT(*)::INTEGER AS category_count
    FROM public.admin_logs
    WHERE admin_email = p_admin_email
      AND created_at >= now() - (p_days || ' days')::INTERVAL
    GROUP BY action_category
  ) category_counts,
  (
    SELECT *
    FROM public.admin_logs
    WHERE admin_email = p_admin_email
      AND created_at >= now() - (p_days || ' days')::INTERVAL
    ORDER BY created_at DESC
    LIMIT 100
  ) recent;
END;
$$;

-- Get user timeline
CREATE OR REPLACE FUNCTION get_user_timeline(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  action_type TEXT,
  action_category TEXT,
  action_details JSONB,
  success BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    uat.action_type,
    uat.action_category,
    uat.action_details,
    uat.success,
    uat.created_at
  FROM public.user_action_timeline uat
  WHERE uat.user_id = p_user_id
  ORDER BY uat.created_at DESC
  LIMIT p_limit;
END;
$$;

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_action_timeline ENABLE ROW LEVEL SECURITY;

-- Admin logs: Only service role can read/write
CREATE POLICY "admin_logs_service_role_only"
  ON public.admin_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- User timeline: Users can read their own, service role can do all
CREATE POLICY "user_timeline_users_read_own"
  ON public.user_action_timeline
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_timeline_service_role_all"
  ON public.user_action_timeline
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. GRANTS
-- ============================================

GRANT EXECUTE ON FUNCTION log_admin_action TO service_role;
GRANT EXECUTE ON FUNCTION log_user_action TO service_role;
GRANT EXECUTE ON FUNCTION get_admin_activity_summary TO service_role;
GRANT EXECUTE ON FUNCTION get_user_timeline TO service_role, authenticated;

-- ============================================
-- 6. COMMENTS
-- ============================================

COMMENT ON TABLE public.admin_logs IS 'Audit trail of all admin actions for security and compliance';
COMMENT ON TABLE public.user_action_timeline IS 'Timeline of user actions for support and analytics';
COMMENT ON FUNCTION log_admin_action IS 'Logs an admin action to the audit trail';
COMMENT ON FUNCTION log_user_action IS 'Logs a user action to their timeline';
COMMENT ON FUNCTION get_admin_activity_summary IS 'Returns activity summary for an admin';
COMMENT ON FUNCTION get_user_timeline IS 'Returns action timeline for a user';

