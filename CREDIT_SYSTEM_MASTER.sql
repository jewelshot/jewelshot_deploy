-- ============================================================================
-- 🎯 JEWELSHOT CREDIT SYSTEM - MASTER SETUP (SAFE MIGRATION)
-- ============================================================================
-- Bu SQL dosyası mevcut verileri KORUYARAK credit sistemini düzeltir
-- 
-- ÖNCEKİ DOSYALAR: ❌ ARTIK KULLANMAYIN
-- - SETUP_SUPABASE_NOW.sql (eski)
-- - SECURITY_IMPROVEMENTS.sql (eski)
-- - CREDIT_SYSTEM_SQL.sql (eski)
--
-- Bu dosya ONLARIN YERİNE GEÇİYOR ve tüm çakışmaları çözüyor.
--
-- ÇALIŞTIRMA:
-- 1. Supabase Dashboard > SQL Editor > New Query
-- 2. Bu dosyanın TAMAMINI kopyala-yapıştır
-- 3. RUN butonuna tıkla
-- 4. Başarılı mesajı bekle
-- ============================================================================

-- ============================================================================
-- 1. TABLOLAR (Mevcut tabloları koru, yoksa oluştur)
-- ============================================================================

-- 1A. User Credits Tablosu
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  credits_remaining INTEGER DEFAULT 10 NOT NULL,
  credits_used INTEGER DEFAULT 0 NOT NULL,
  total_credits_purchased INTEGER DEFAULT 0 NOT NULL,
  last_generation_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- User ID unique olmalı (bir user = bir kayıt)
  CONSTRAINT user_credits_user_id_unique UNIQUE (user_id),
  
  -- Credits negatif olamaz
  CONSTRAINT credits_remaining_positive CHECK (credits_remaining >= 0)
);

-- 1B. Credit Transactions Tablosu (History için)
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL, -- +10 (purchase), -1 (usage)
  type TEXT NOT NULL, -- 'purchase', 'usage', 'bonus', 'refund'
  description TEXT,
  balance_after INTEGER NOT NULL,
  metadata JSONB, -- {order_id, prompt, style, etc.}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. INDEXES (Performance için, varsa skip et)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) AKTIF ET
-- ============================================================================

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. RLS POLICIES - ÖNCEKİLERİ SİL, YENİLERİNİ OLUŞTUR
-- ============================================================================

-- 🗑️ Eski policy'leri temizle (çakışma olmasın)
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Service role can manage all credits" ON user_credits;
DROP POLICY IF EXISTS "Service role full access to user_credits" ON user_credits;
DROP POLICY IF EXISTS "Service role can update credits" ON user_credits;
DROP POLICY IF EXISTS "Service can insert credits" ON user_credits;
DROP POLICY IF EXISTS "Service role can insert credits" ON user_credits;
DROP POLICY IF EXISTS "Nobody can delete credits" ON user_credits;

DROP POLICY IF EXISTS "Users can view their own transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Service role can manage all transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Service role can insert transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Service role can update transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Nobody can delete transactions" ON credit_transactions;

-- ✅ Yeni policy'ler (GÜVENLİ ve DOĞRU)

-- 4A. USER_CREDITS Policies

-- User sadece KENDİ credit'ini görebilir (READ-ONLY)
CREATE POLICY "Users can view their own credits"
  ON user_credits
  FOR SELECT
  USING (auth.uid() = user_id);

-- User KENDİ credit'ini UPDATE EDEMEZ (güvenlik)
-- UPDATE sadece RPC fonksiyonu ile (SECURITY DEFINER)
CREATE POLICY "Service role can update credits"
  ON user_credits
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- INSERT sadece RPC fonksiyonu ile (SECURITY DEFINER)
CREATE POLICY "Service role can insert credits"
  ON user_credits
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- DELETE YASAK (kimse credit kaydı silemez)
CREATE POLICY "Nobody can delete credits"
  ON user_credits
  FOR DELETE
  USING (false);

-- 4B. CREDIT_TRANSACTIONS Policies

-- User sadece kendi transaction'larını görebilir
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT sadece RPC fonksiyonu ile
CREATE POLICY "Service role can insert transactions"
  ON credit_transactions
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- UPDATE yasak (transaction değiştirilemez)
CREATE POLICY "Service role can update transactions"
  ON credit_transactions
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- DELETE yasak
CREATE POLICY "Nobody can delete transactions"
  ON credit_transactions
  FOR DELETE
  USING (false);

-- ============================================================================
-- 5. TRIGGER FUNCTION: Yeni kullanıcıya otomatik 10 credit
-- ============================================================================

CREATE OR REPLACE FUNCTION create_user_credits_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits_remaining)
  VALUES (NEW.id, 10)
  ON CONFLICT (user_id) DO NOTHING; -- Mevcut kaydı koru
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. TRIGGER: Signup olunca otomatik credit ver
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_credits_on_signup();

-- ============================================================================
-- 7. RPC FUNCTION: Credit kullan (ATOMIK - race condition önler)
-- ============================================================================

CREATE OR REPLACE FUNCTION use_credit(
  p_user_id UUID,
  p_description TEXT DEFAULT 'AI Generation',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  success BOOLEAN,
  credits_remaining INTEGER,
  message TEXT
) AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- 🔒 Lock row (concurrent usage önlemek için FOR UPDATE)
  SELECT credits_remaining INTO v_current_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- ❌ User credit kaydı yok mu? Oluştur!
  IF v_current_credits IS NULL THEN
    -- Yeni kayıt ekle (ilk kez kullanıyor)
    INSERT INTO user_credits (user_id, credits_remaining, credits_used)
    VALUES (p_user_id, 10, 0)
    ON CONFLICT (user_id) DO NOTHING; -- Duplicate önle
    
    -- Tekrar oku (insert başarılıysa v_current_credits = 10 olur)
    SELECT credits_remaining INTO v_current_credits
    FROM user_credits
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    -- Hala NULL ise (çok nadir, concurrent insert), hata dön
    IF v_current_credits IS NULL THEN
      RETURN QUERY SELECT FALSE, 0, 'Failed to create user credits'::TEXT;
      RETURN;
    END IF;
  END IF;

  -- ❌ Credit yetersiz mi?
  IF v_current_credits < 1 THEN
    RETURN QUERY SELECT FALSE, v_current_credits, 'Insufficient credits'::TEXT;
    RETURN;
  END IF;

  -- ✅ Credit düş (başarılı)
  v_new_balance := v_current_credits - 1;
  
  UPDATE user_credits
  SET 
    credits_remaining = v_new_balance,
    credits_used = credits_used + 1,
    last_generation_at = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Transaction kaydet (history)
  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after, metadata)
  VALUES (p_user_id, -1, 'usage', p_description, v_new_balance, p_metadata);

  RETURN QUERY SELECT TRUE, v_new_balance, 'Credit used successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. RPC FUNCTION: Credit ekle (satın alma, bonus için)
-- ============================================================================

CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT DEFAULT 'purchase',
  p_description TEXT DEFAULT 'Credit purchase',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  success BOOLEAN,
  credits_remaining INTEGER,
  message TEXT
) AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- 🔒 Lock row
  SELECT credits_remaining INTO v_current_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- User yoksa oluştur
  IF v_current_credits IS NULL THEN
    INSERT INTO user_credits (user_id, credits_remaining, total_credits_purchased)
    VALUES (p_user_id, p_amount, CASE WHEN p_type = 'purchase' THEN p_amount ELSE 0 END)
    ON CONFLICT (user_id) DO NOTHING;
    
    v_new_balance := p_amount;
  ELSE
    -- Credit ekle
    v_new_balance := v_current_credits + p_amount;
    
    UPDATE user_credits
    SET 
      credits_remaining = v_new_balance,
      total_credits_purchased = CASE 
        WHEN p_type = 'purchase' THEN total_credits_purchased + p_amount 
        ELSE total_credits_purchased 
      END,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  -- Transaction kaydet
  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after, metadata)
  VALUES (p_user_id, p_amount, p_type, p_description, v_new_balance, p_metadata);

  RETURN QUERY SELECT TRUE, v_new_balance, 'Credits added successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. RPC FUNCTION: Credit iade et (başarısız işlemler için)
-- ============================================================================

CREATE OR REPLACE FUNCTION refund_credit(
  p_user_id UUID,
  p_description TEXT DEFAULT 'Credit refund',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  success BOOLEAN,
  credits_remaining INTEGER,
  message TEXT
) AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- 🔒 Lock row
  SELECT credits_remaining INTO v_current_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- User yoksa hata
  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'User not found'::TEXT;
    RETURN;
  END IF;

  -- ✅ Credit iade et (+1)
  v_new_balance := v_current_credits + 1;
  
  UPDATE user_credits
  SET 
    credits_remaining = v_new_balance,
    credits_used = GREATEST(credits_used - 1, 0), -- Negatif olmasın
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Transaction kaydet
  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after, metadata)
  VALUES (p_user_id, 1, 'refund', p_description, v_new_balance, p_metadata);

  RETURN QUERY SELECT TRUE, v_new_balance, 'Credit refunded successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 10. TEST QUERY (Opsiyonel - kendi user_id'nle test et)
-- ============================================================================

-- Test için:
-- 1. Kendi user_id'ni bul: SELECT id FROM auth.users WHERE email = 'senin@email.com';
-- 2. Credit kullan: SELECT * FROM use_credit('USER_ID_BURAYA', 'Test generation');
-- 3. Bakiye kontrol: SELECT * FROM user_credits WHERE user_id = 'USER_ID_BURAYA';
-- 4. Transaction history: SELECT * FROM credit_transactions WHERE user_id = 'USER_ID_BURAYA' ORDER BY created_at DESC;

-- ============================================================================
-- ✅ KURULUM TAMAMLANDI!
-- ============================================================================
-- Şimdi tüm API route'larda credit sistemi çalışacak.
-- Frontend'de sadece fetchCredits() kullanılacak (deductCredit() silinecek).
-- Her AI isteği otomatik olarak kredi düşürecek.
-- ============================================================================


