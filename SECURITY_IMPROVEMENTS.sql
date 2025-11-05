-- ============================================
-- JEWELSHOT - SECURITY HARDENING
-- ============================================
-- Supabase Dashboard > SQL Editor'da çalıştır

-- 1. Rate Limiting için Table
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  ip_address TEXT,
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT rate_limit_unique UNIQUE (user_id, ip_address, endpoint, window_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user ON rate_limits(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip ON rate_limits(ip_address);

-- 2. User Credits - Daha Sıkı RLS
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Service role can manage all credits" ON user_credits;
DROP POLICY IF EXISTS "Service can insert credits" ON user_credits;

-- Sadece kendini görebilir
CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- KENDİ credit'ini güncelleyemez (sadece okur)
-- UPDATE'ler sadece server-side (service role) yapabilir
CREATE POLICY "Service role can update credits"
  ON user_credits FOR UPDATE
  USING (auth.role() = 'service_role');

-- INSERT sadece service role
CREATE POLICY "Service role can insert credits"
  ON user_credits FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- DELETE yasak (kimse silemez)
CREATE POLICY "Nobody can delete credits"
  ON user_credits FOR DELETE
  USING (false);

-- 3. Credit Transactions - Sadece Okuma
DROP POLICY IF EXISTS "Users can view their own transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Service role can manage all transactions" ON credit_transactions;

-- Kullanıcı sadece kendi transaction'larını görebilir
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT/UPDATE/DELETE sadece service role
CREATE POLICY "Service role can insert transactions"
  ON credit_transactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update transactions"
  ON credit_transactions FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Nobody can delete transactions"
  ON credit_transactions FOR DELETE
  USING (false);

-- 4. Gallery - Güvenlik
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own images" ON gallery;
DROP POLICY IF EXISTS "Users can insert their own images" ON gallery;
DROP POLICY IF EXISTS "Users can delete their own images" ON gallery;

-- Kullanıcı sadece kendi resimlerini görebilir
CREATE POLICY "Users can view their own images"
  ON gallery FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcı kendi resimlerini ekleyebilir
CREATE POLICY "Users can insert their own images"
  ON gallery FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcı kendi resimlerini silebilir
CREATE POLICY "Users can delete their own images"
  ON gallery FOR DELETE
  USING (auth.uid() = user_id);

-- UPDATE yasak (metadata değiştirilemez)
CREATE POLICY "Nobody can update images"
  ON gallery FOR UPDATE
  USING (false);

-- 5. Waitlist - Public Read, Service Write
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can add to waitlist" ON waitlist;
DROP POLICY IF EXISTS "Only authenticated users can view waitlist" ON waitlist;

-- INSERT sadece service role (API route üzerinden)
CREATE POLICY "Service role can insert waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'anon');

-- SELECT sadece admin (authenticated service role)
CREATE POLICY "Only service role can view waitlist"
  ON waitlist FOR SELECT
  USING (auth.role() = 'service_role');

-- UPDATE/DELETE yasak
CREATE POLICY "Nobody can update waitlist"
  ON waitlist FOR UPDATE
  USING (false);

CREATE POLICY "Nobody can delete waitlist"
  ON waitlist FOR DELETE
  USING (false);

-- 6. Rate Limit Function
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_user_id UUID,
  p_ip_address TEXT,
  p_endpoint TEXT,
  p_window_start TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO rate_limits (user_id, ip_address, endpoint, request_count, window_start)
  VALUES (p_user_id, p_ip_address, p_endpoint, 1, p_window_start)
  ON CONFLICT (user_id, ip_address, endpoint, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Cleanup old rate limit records (çalıştır her gün)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS VOID AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SECURITY AUDIT QUERY
-- ============================================
-- Tüm policy'leri kontrol et:
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

