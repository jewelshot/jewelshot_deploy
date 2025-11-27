-- ============================================
-- BACKUP SYSTEM
-- ============================================
-- Manual backup triggers and logging
-- Supabase Pro already has automated backups
-- This adds manual trigger capability and audit trail
-- Created: 2025-01-28
-- ============================================

-- ============================================
-- 1. BACKUP_LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Backup Info
  backup_type TEXT NOT NULL, -- 'automated', 'manual', 'pre_migration'
  backup_method TEXT NOT NULL, -- 'supabase_dashboard', 'api_trigger', 'scheduled'
  
  -- Trigger Info
  triggered_by TEXT, -- Admin email who triggered it
  trigger_reason TEXT, -- Why was it triggered
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  
  -- Backup Details
  backup_size_mb NUMERIC,
  tables_included TEXT[],
  
  -- Metadata
  error_message TEXT,
  backup_reference TEXT, -- Supabase backup ID or reference
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_backup_type CHECK (backup_type IN ('automated', 'manual', 'pre_migration')),
  CONSTRAINT valid_backup_method CHECK (backup_method IN ('supabase_dashboard', 'api_trigger', 'scheduled')),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'completed', 'failed'))
);

-- Indexes
CREATE INDEX idx_backup_logs_created_at ON public.backup_logs(created_at DESC);
CREATE INDEX idx_backup_logs_status ON public.backup_logs(status);
CREATE INDEX idx_backup_logs_type ON public.backup_logs(backup_type);

-- ============================================
-- 2. HELPER FUNCTIONS
-- ============================================

-- Log backup action
CREATE OR REPLACE FUNCTION log_backup(
  p_backup_type TEXT,
  p_backup_method TEXT,
  p_triggered_by TEXT DEFAULT NULL,
  p_trigger_reason TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'completed'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_backup_id UUID;
BEGIN
  INSERT INTO public.backup_logs (
    backup_type,
    backup_method,
    triggered_by,
    trigger_reason,
    status,
    completed_at
  ) VALUES (
    p_backup_type,
    p_backup_method,
    p_triggered_by,
    p_trigger_reason,
    p_status,
    CASE WHEN p_status = 'completed' THEN now() ELSE NULL END
  )
  RETURNING id INTO v_backup_id;
  
  RETURN v_backup_id;
END;
$$;

-- Get backup stats
CREATE OR REPLACE FUNCTION get_backup_stats()
RETURNS TABLE (
  total_backups BIGINT,
  automated_backups BIGINT,
  manual_backups BIGINT,
  last_backup_date TIMESTAMPTZ,
  recent_backups JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT AS total_backups,
    COUNT(*) FILTER (WHERE backup_type = 'automated')::BIGINT AS automated_backups,
    COUNT(*) FILTER (WHERE backup_type = 'manual')::BIGINT AS manual_backups,
    MAX(created_at) AS last_backup_date,
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'backup_type', backup_type,
        'triggered_by', triggered_by,
        'status', status,
        'created_at', created_at
      )
      ORDER BY created_at DESC
    ) FILTER (WHERE created_at >= now() - INTERVAL '30 days') AS recent_backups
  FROM public.backup_logs;
END;
$$;

-- ============================================
-- 3. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "backup_logs_service_role_only"
  ON public.backup_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. GRANTS
-- ============================================

GRANT EXECUTE ON FUNCTION log_backup TO service_role;
GRANT EXECUTE ON FUNCTION get_backup_stats TO service_role;

-- ============================================
-- 5. COMMENTS
-- ============================================

COMMENT ON TABLE public.backup_logs IS 'Logs manual and automated database backups';
COMMENT ON FUNCTION log_backup IS 'Records a backup operation';
COMMENT ON FUNCTION get_backup_stats IS 'Returns backup statistics and history';

-- ============================================
-- 6. INITIAL LOG ENTRY
-- ============================================

-- Log the creation of the backup system itself
SELECT log_backup(
  'pre_migration',
  'api_trigger',
  'system',
  'Backup system initialization'
);

