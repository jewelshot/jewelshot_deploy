-- ============================================
-- RATE LIMITING TABLE
-- Persistent server-side rate limiting
-- ============================================

CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint VARCHAR(100) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, endpoint)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_endpoint 
  ON public.rate_limits(user_id, endpoint);

-- RLS Policies (users can only read their own limits)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can read their own rate limits
CREATE POLICY "Users can read own rate limits"
  ON public.rate_limits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all rate limits (for API routes)
-- Note: This is handled via service_role key, no policy needed

-- ============================================
-- AUTO-CLEANUP: Delete old rate limit records
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete records older than 1 hour
  DELETE FROM public.rate_limits
  WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$;

-- Run cleanup every hour (requires pg_cron extension)
-- If pg_cron is not available, you can run this manually or via cron job
-- SELECT cron.schedule('cleanup-rate-limits', '0 * * * *', 'SELECT cleanup_old_rate_limits()');

-- ============================================
-- USAGE NOTES
-- ============================================
-- 1. In API routes, use service_role key to bypass RLS
-- 2. Check/update rate limits before processing requests
-- 3. Cleanup function should run periodically (every hour)








