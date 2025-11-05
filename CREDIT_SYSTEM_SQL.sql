-- ============================================
-- JEWELSHOT CREDIT SYSTEM
-- ============================================
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştır

-- 1. User Credits Tablosu
CREATE TABLE user_credits (
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

-- 2. Credit Transactions Tablosu (History için)
CREATE TABLE credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL, -- +10 (purchase), -1 (usage)
  type TEXT NOT NULL, -- 'purchase', 'usage', 'bonus', 'refund'
  description TEXT,
  balance_after INTEGER NOT NULL,
  metadata JSONB, -- {order_id, prompt, style, etc.}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Indexes (Performance için)
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- 4. Row Level Security (RLS)
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- User sadece kendi credit'ini görebilir
CREATE POLICY "Users can view their own credits"
  ON user_credits
  FOR SELECT
  USING (auth.uid() = user_id);

-- User sadece kendi credit'ini güncelleyebilir
CREATE POLICY "Users can update their own credits"
  ON user_credits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role her şeyi yapabilir (API için)
CREATE POLICY "Service role can manage all credits"
  ON user_credits
  FOR ALL
  USING (auth.role() = 'service_role');

-- User sadece kendi transaction'larını görebilir
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role her şeyi yapabilir
CREATE POLICY "Service role can manage all transactions"
  ON credit_transactions
  FOR ALL
  USING (auth.role() = 'service_role');

-- 5. Function: Yeni kullanıcıya otomatik 10 credit
CREATE OR REPLACE FUNCTION create_user_credits_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits_remaining)
  VALUES (NEW.id, 10)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger: Signup olunca otomatik credit ver
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_credits_on_signup();

-- 7. Function: Credit kullan (atomik transaction)
CREATE OR REPLACE FUNCTION use_credit(
  p_user_id UUID,
  p_description TEXT DEFAULT 'AI Generation',
  p_metadata JSONB DEFAULT '{}'
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

  -- Credit yok mu?
  IF v_current_credits IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'User not found';
    RETURN;
  END IF;

  IF v_current_credits < 1 THEN
    RETURN QUERY SELECT FALSE, 0, 'Insufficient credits';
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

  RETURN QUERY SELECT TRUE, v_new_balance, 'Credit used successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Function: Credit ekle (satın alma için)
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT DEFAULT 'purchase',
  p_description TEXT DEFAULT 'Credit purchase',
  p_metadata JSONB DEFAULT '{}'
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
      total_credits_purchased = total_credits_purchased + p_amount,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  -- Transaction kaydet
  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after, metadata)
  VALUES (p_user_id, p_amount, p_type, p_description, v_new_balance, p_metadata);

  RETURN QUERY SELECT TRUE, v_new_balance, 'Credits added successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TEST QUERIES (Opsiyonel)
-- ============================================

-- Test user oluştur (kendi user_id'ni kullan)
-- INSERT INTO user_credits (user_id, credits_remaining) 
-- VALUES ('YOUR_USER_ID_HERE', 10);

-- Credit kullan
-- SELECT * FROM use_credit('YOUR_USER_ID_HERE', 'Test generation');

-- Credit ekle
-- SELECT * FROM add_credits('YOUR_USER_ID_HERE', 100, 'purchase', 'Test purchase');

-- Tüm credits listele
-- SELECT * FROM user_credits;

-- Transaction history
-- SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 10;

