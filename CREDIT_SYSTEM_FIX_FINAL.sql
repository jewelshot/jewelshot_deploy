-- ============================================================================
-- 🚨 KREDİ SİSTEMİ FIX - SON ÇÖZÜM
-- ============================================================================
-- Bu SQL'i Supabase Dashboard > SQL Editor'da ÇALIŞTIR
-- 
-- SORUNLAR:
-- 1. RPC functions yok veya hatalı
-- 2. RLS policies çakışıyor
-- 3. Trigger çalışmıyor
-- 
-- ÇÖZÜM: Her şeyi DROP edip sıfırdan kuruyoruz
-- ============================================================================

-- ============================================================================
-- 1. ESKİ POLİCY'LERİ TEMİZLE (Çakışma önleme)
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON user_credits;
DROP POLICY IF EXISTS "Service role can manage all credits" ON user_credits;
DROP POLICY IF EXISTS "Service role can update credits" ON user_credits;
DROP POLICY IF EXISTS "Service role can insert credits" ON user_credits;
DROP POLICY IF EXISTS "Service can insert credits" ON user_credits;
DROP POLICY IF EXISTS "Nobody can delete credits" ON user_credits;

DROP POLICY IF EXISTS "Users can view their own transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Service role can manage all transactions" ON credit_transactions;
DROP POLICY IF EXISTS "Service role can insert transactions" ON credit_transactions;

-- ============================================================================
-- 2. YENİ RLS POLİCY'LERİ (DOĞRU VERSİYON)
-- ============================================================================

-- USER_CREDITS: User sadece okuyabilir, server-side (API) güncelleyebilir
CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE sadece RPC functions (SECURITY DEFINER) yapabilir
-- Bu policy RPC function'ı kapsamıyor çünkü SECURITY DEFINER kullanıyor
CREATE POLICY "Service role full access"
  ON user_credits FOR ALL
  USING (auth.role() = 'service_role');

-- CREDIT_TRANSACTIONS: User sadece okuyabilir
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access transactions"
  ON credit_transactions FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- 3. ESKİ FUNCTIONS & TRIGGERS'I SİL
-- ============================================================================

DROP FUNCTION IF EXISTS use_credit(UUID, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS add_credits(UUID, INTEGER, TEXT, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS create_user_credits_on_signup() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================================================
-- 4. YENİ FUNCTIONS (SECURITY DEFINER = Bypass RLS)
-- ============================================================================

-- 4A. Credit Kullan (Atomik transaction, race condition yok)
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
  -- Lock row (concurrent usage önlemek için)
  SELECT credits_remaining INTO v_current_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- User yoksa 10 credit ile oluştur
  IF v_current_credits IS NULL THEN
    INSERT INTO user_credits (user_id, credits_remaining, credits_used)
    VALUES (p_user_id, 10, 0);
    v_current_credits := 10;
  END IF;

  -- Yeterli credit var mı?
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

-- 4B. Credit Ekle (Satın alma, bonus, refund)
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT DEFAULT 'purchase',
  p_description TEXT DEFAULT 'Credits added',
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
    VALUES (p_user_id, p_amount, p_amount);
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

-- 4C. Yeni kullanıcıya otomatik 10 credit
CREATE OR REPLACE FUNCTION create_user_credits_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits_remaining, credits_used, total_credits_purchased)
  VALUES (NEW.id, 10, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4D. Trigger: Signup olunca otomatik credit ver
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_credits_on_signup();

-- ============================================================================
-- 5. TEST (Opsiyonel - Silme!)
-- ============================================================================

-- Kendi user_id'nle test et (gerekirse)
-- SELECT * FROM use_credit('YOUR_USER_ID'::uuid, 'Test generation');
-- SELECT * FROM add_credits('YOUR_USER_ID'::uuid, 100, 'purchase', 'Test purchase');

-- ============================================================================
-- ✅ TAMAMLANDI!
-- ============================================================================
-- Şimdi application'da credit deduction çalışacak.
-- Frontend'de hiçbir değişiklik gerekmez, sadece backend API routes'lar düzeltilecek.
-- ============================================================================

