-- ============================================
-- EMAIL SYSTEM
-- ============================================
-- Email logging and tracking for notifications
-- Created: 2025-01-28
-- ============================================

-- ============================================
-- 1. EMAIL_LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  email_to TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Email Info
  email_type TEXT NOT NULL, -- 'welcome', 'batch_complete', 'credits_low', etc.
  subject TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
  message_id TEXT, -- Resend message ID
  
  -- Error Tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
  CONSTRAINT valid_email_type CHECK (email_type IN (
    'welcome',
    'batch_complete',
    'credits_low',
    'credits_depleted',
    'password_reset',
    'email_verification'
  ))
);

-- Indexes for performance
CREATE INDEX idx_email_logs_email_to ON public.email_logs(email_to);
CREATE INDEX idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX idx_email_logs_email_type ON public.email_logs(email_type);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_email_logs_user_type ON public.email_logs(user_id, email_type);

-- ============================================
-- 2. EMAIL_PREFERENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.email_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification Preferences
  welcome_emails BOOLEAN DEFAULT true,
  batch_complete_emails BOOLEAN DEFAULT true,
  credits_low_emails BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  
  -- Frequency Controls
  max_emails_per_day INTEGER DEFAULT 10,
  last_email_sent_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX idx_email_preferences_updated ON public.email_preferences(updated_at);

-- ============================================
-- 3. HELPER FUNCTIONS
-- ============================================

-- Check if user can receive email
CREATE OR REPLACE FUNCTION can_receive_email(
  p_user_id UUID,
  p_email_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_prefs RECORD;
  v_emails_today INTEGER;
BEGIN
  -- Get user preferences
  SELECT * INTO v_prefs
  FROM public.email_preferences
  WHERE user_id = p_user_id;
  
  -- If no preferences, create default and allow
  IF NOT FOUND THEN
    INSERT INTO public.email_preferences (user_id)
    VALUES (p_user_id);
    RETURN true;
  END IF;
  
  -- Check type-specific preference
  CASE p_email_type
    WHEN 'welcome' THEN
      IF NOT v_prefs.welcome_emails THEN RETURN false; END IF;
    WHEN 'batch_complete' THEN
      IF NOT v_prefs.batch_complete_emails THEN RETURN false; END IF;
    WHEN 'credits_low', 'credits_depleted' THEN
      IF NOT v_prefs.credits_low_emails THEN RETURN false; END IF;
  END CASE;
  
  -- Check daily limit
  SELECT COUNT(*) INTO v_emails_today
  FROM public.email_logs
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE
    AND status = 'sent';
  
  IF v_emails_today >= v_prefs.max_emails_per_day THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Get email stats
CREATE OR REPLACE FUNCTION get_email_stats(
  p_days INTEGER DEFAULT 7
)
RETURNS TABLE (
  total_sent BIGINT,
  total_failed BIGINT,
  emails_by_type JSONB,
  recent_failures JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'sent')::BIGINT AS total_sent,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT AS total_failed,
    jsonb_object_agg(
      email_type,
      type_count
    ) AS emails_by_type,
    jsonb_agg(
      jsonb_build_object(
        'email_to', email_to,
        'email_type', email_type,
        'error_message', error_message,
        'created_at', created_at
      )
      ORDER BY created_at DESC
    ) FILTER (WHERE status = 'failed') AS recent_failures
  FROM (
    SELECT
      email_type,
      COUNT(*)::INTEGER AS type_count
    FROM public.email_logs
    WHERE created_at >= now() - (p_days || ' days')::INTERVAL
    GROUP BY email_type
  ) type_counts,
  (
    SELECT *
    FROM public.email_logs
    WHERE created_at >= now() - (p_days || ' days')::INTERVAL
    ORDER BY created_at DESC
    LIMIT 100
  ) recent;
END;
$$;

-- ============================================
-- 4. AUTO-UPDATE TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_email_preferences_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER email_preferences_update_timestamp
  BEFORE UPDATE ON public.email_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_email_preferences_timestamp();

-- ============================================
-- 5. ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;

-- Email logs: Service role only
CREATE POLICY "email_logs_service_role_only"
  ON public.email_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Email preferences: Users can read/update their own
CREATE POLICY "email_prefs_users_own"
  ON public.email_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "email_prefs_users_update_own"
  ON public.email_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "email_prefs_service_role_all"
  ON public.email_preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 6. GRANTS
-- ============================================

GRANT EXECUTE ON FUNCTION can_receive_email TO service_role;
GRANT EXECUTE ON FUNCTION get_email_stats TO service_role;

-- ============================================
-- 7. COMMENTS
-- ============================================

COMMENT ON TABLE public.email_logs IS 'Logs all emails sent by the system';
COMMENT ON TABLE public.email_preferences IS 'User email notification preferences';
COMMENT ON FUNCTION can_receive_email IS 'Checks if a user can receive a specific type of email';
COMMENT ON FUNCTION get_email_stats IS 'Returns email statistics for monitoring';

