-- ============================================
-- BACKUP STORAGE BUCKET
-- ============================================
-- Creates storage bucket for automated daily backups
-- Created: 2025-01-28
-- ============================================

-- Create backups storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('backups', 'backups', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RLS POLICIES FOR BACKUPS BUCKET
-- ============================================

-- Policy: Only service role can upload backups
CREATE POLICY "Service role can upload backups"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'backups');

-- Policy: Only service role can read backups
CREATE POLICY "Service role can read backups"
ON storage.objects
FOR SELECT
TO service_role
USING (bucket_id = 'backups');

-- Policy: Only service role can delete old backups
CREATE POLICY "Service role can delete backups"
ON storage.objects
FOR DELETE
TO service_role
USING (bucket_id = 'backups');

-- ============================================
-- BACKUP RESTORE HELPER FUNCTION (Future use)
-- ============================================

-- Function to log backup operations
CREATE OR REPLACE FUNCTION log_backup_operation(
  p_operation_type TEXT,
  p_backup_name TEXT,
  p_status TEXT,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- In future, you can log to a dedicated backup_logs table
  -- For now, just use RAISE NOTICE for logging
  RAISE NOTICE 'Backup %: % - % (Details: %)', 
    p_operation_type, 
    p_backup_name, 
    p_status, 
    p_details;
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION log_backup_operation TO service_role;

