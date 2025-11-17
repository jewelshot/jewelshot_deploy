-- ============================================================================
-- 🚨 ACİL: SUPABASE KURULUM - ŞİMDİ ÇALIŞTIR!
-- ============================================================================
-- Bu SQL'i Supabase Dashboard > SQL Editor'da ÇALIŞTIR
-- 
-- Adımlar:
-- 1. https://supabase.com/dashboard/project/{YOUR_PROJECT}/sql/new
-- 2. Bu dosyanın TAMAMINI kopyala
-- 3. Paste yap
-- 4. "RUN" butonuna tıkla
-- 5. Başarılı mesajı gelirse TAMAM!
-- ============================================================================

-- ============================================================================
-- 1. TABLOLARI OLUŞTUR
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
  
  CONSTRAINT user_credits_user_id_unique UNIQUE (user_id),
  CONSTRAINT credits_remaining_positive CHECK (credits_remaining >= 0)
);

-- 1B. Credit Transactions Tablosu
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  balance_after INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. INDEXES OLUŞTUR (Performance için)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS) AKTIF ET
-- ============================================================================

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. RLS POLICIES OLUŞTUR
-- ============================================================================

-- User kendi credit'lerini görebilir
DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
CREATE POLICY "Users can view their own credits"
  ON user_credits
  FOR SELECT
  USING (auth.uid() = user_id);

-- User kendi credit'lerini güncelleyebilir
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
CREATE POLICY "Users can update their own credits"
  ON user_credits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role her şeyi yapabilir
DROP POLICY IF EXISTS "Service role full access to user_credits" ON user_credits;
CREATE POLICY "Service role full access to user_credits"
  ON user_credits
  FOR ALL
  USING (auth.role() = 'service_role');

-- User kendi transaction'larını görebilir
DROP POLICY IF EXISTS "Users can view their own transactions" ON credit_transactions;
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role her şeyi yapabilir
DROP POLICY IF EXISTS "Service role can manage all transactions" ON credit_transactions;
CREATE POLICY "Service role can manage all transactions"
  ON credit_transactions
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- 5. TRIGGER FUNCTION: Yeni kullanıcıya otomatik 10 credit
-- ============================================================================

CREATE OR REPLACE FUNCTION create_user_credits_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits_remaining)
  VALUES (NEW.id, 10)
  ON CONFLICT (user_id) DO NOTHING;
  
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
  -- Lock row (concurrent usage önlemek için FOR UPDATE)
  SELECT credits_remaining INTO v_current_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- User bulunamadı
  IF v_current_credits IS NULL THEN
    -- User credit kaydı yoksa oluştur
    INSERT INTO user_credits (user_id, credits_remaining)
    VALUES (p_user_id, 10)
    RETURNING credits_remaining INTO v_current_credits;
  END IF;

  -- Credit yetersiz
  IF v_current_credits < 1 THEN
    RETURN QUERY SELECT FALSE, v_current_credits, 'Insufficient credits'::TEXT;
    RETURN;
  END IF;

  -- Credit düş
  v_new_balance := v_current_credits - 1;
  
  UPDATE user_credits
  SET 
    credits_remaining = v_new_balance,
    credits_used = credits_used + 1,
    last_generation_at = NOW(),
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Transaction kaydet
  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after, metadata)
  VALUES (p_user_id, -1, 'usage', p_description, v_new_balance, p_metadata);

  RETURN QUERY SELECT TRUE, v_new_balance, 'Credit used successfully'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. RPC FUNCTION: Credit ekle
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
  -- Lock row
  SELECT credits_remaining INTO v_current_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- User yoksa oluştur
  IF v_current_credits IS NULL THEN
    INSERT INTO user_credits (user_id, credits_remaining, total_credits_purchased)
    VALUES (p_user_id, p_amount, p_amount)
    RETURNING credits_remaining INTO v_new_balance;
  ELSE
    -- Var olan user'a ekle
    v_new_balance := v_current_credits + p_amount;
    
    UPDATE user_credits
    SET
      credits_remaining = v_new_balance,
      total_credits_purchased = total_credits_purchased + p_amount,
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
-- 9. MEVCUT USER'LARA 10 CREDIT VER (Eğer yoksa)
-- ============================================================================

INSERT INTO user_credits (user_id, credits_remaining)
SELECT id, 10
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_credits)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- ✅ KURULUM TAMAMLANDI!
-- ============================================================================
-- Şimdi kontrol et:
-- SELECT * FROM user_credits WHERE user_id = auth.uid();
-- 
-- 10 credit görmelisin!
-- ============================================================================





