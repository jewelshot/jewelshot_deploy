# 🔐 MANUAL ADMIN SETUP GUIDE (Profiles Table)

> **Amaç:** Migration'dan sonra ilk admin kullanıcısını ayarla  
> **Süre:** 10 dakika  
> **Gerekli:** Supabase Dashboard access

---

## 🎯 ADIM 1: MIGRATION'I ÇALIŞTIR

### Supabase Dashboard Method (ÖNERİLEN)

1. **Supabase Dashboard'a git:**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **SQL Editor'ü aç:**
   - Sol menüden "SQL Editor" tıklayın
   - "New query" butonuna tıklayın

3. **Migration dosyasını kopyala:**
   - `supabase/migrations/20241128_admin_security_FINAL.sql` dosyasını aç
   - **TÜM içeriği** kopyala (Ctrl+A, Ctrl+C)

4. **SQL Editor'e yapıştır ve çalıştır:**
   - Kopyalanan SQL'i editor'e yapıştır
   - **"Run"** butonuna tıkla (veya Ctrl+Enter)

5. **Sonucu kontrol et:**
   ```
   ✅ Başarılı: "Success. No rows returned" veya benzeri mesaj
   ❌ Hata: Hata mesajını buraya yapıştır (düzeltirim)
   ```

---

## 👤 ADIM 2: KENDİNİZİ ADMIN YAPIN

### 2.1: Mevcut Email'inizi Bulun

**SQL Editor'de çalıştır:**
```sql
-- Kendi email'inizi buraya yazın
SELECT id, email, created_at 
FROM profiles 
WHERE email = 'jewelshot.ai@gmail.com';  -- 👈 KENDİ EMAIL'İNİZİ YAZIN
```

**Beklenen Sonuç:**
```
id                                   | email                    | created_at
-------------------------------------|--------------------------|---------------------------
12345678-abcd-1234-abcd-123456789012 | jewelshot.ai@gmail.com   | 2024-11-01 10:30:00+00
```

---

### 2.2: Admin Role'ü Set Edin

**SQL Editor'de çalıştır:**

```sql
-- ============================================
-- SET YOURSELF AS ADMIN
-- ============================================

-- OPTION A: Email ile (ÖNERİLEN)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'jewelshot.ai@gmail.com';  -- 👈 KENDİ EMAIL'İNİZİ YAZIN

-- VERIFY: Başarılı mı kontrol et
SELECT id, email, role, created_at 
FROM profiles 
WHERE role IN ('admin', 'superadmin');
```

**Beklenen Sonuç:**
```
id                                   | email                    | role  | created_at
-------------------------------------|--------------------------|-------|---------------------------
12345678-abcd-1234-abcd-123456789012 | jewelshot.ai@gmail.com   | admin | 2024-11-01 10:30:00+00
```

**UPDATE başarılı olduysa şunu göreceksiniz:**
```
UPDATE 1
```

---

## ✅ ADIM 3: VERIFICATION (DOĞRULAMA)

### 3.1: Migration Sonuçlarını Kontrol Et

**SQL Editor'de çalıştır:**

```sql
-- 1. profiles tablosuna yeni kolonlar eklendi mi?
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('role', 'is_2fa_enabled', 'two_factor_secret');

-- Beklenen: 3 satır dönmeli
```

```sql
-- 2. admin_audit_logs tablosu oluşturuldu mu?
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'admin_audit_logs';

-- Beklenen: 1 satır (admin_audit_logs)
```

```sql
-- 3. Indexes oluşturuldu mu?
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'admin_audit_logs';

-- Beklenen: 5-6 index
```

```sql
-- 4. RLS enabled mi?
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_audit_logs';

-- Beklenen: rowsecurity = true
```

```sql
-- 5. Functions oluşturuldu mu?
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_user_role', 'is_admin', 'log_admin_action');

-- Beklenen: 3 function
```

```sql
-- 6. Views oluşturuldu mu?
SELECT table_name 
FROM information_schema.views 
WHERE table_name LIKE '%admin%';

-- Beklenen: 3 view (recent_admin_actions, failed_admin_actions, admin_activity_summary)
```

---

### 3.2: Admin Role'ü Test Et

```sql
-- Test: get_user_role function
SELECT get_user_role(
  (SELECT id FROM profiles WHERE email = 'jewelshot.ai@gmail.com')
);
-- Beklenen: 'admin'

-- Test: is_admin function
SELECT is_admin(
  (SELECT id FROM profiles WHERE email = 'jewelshot.ai@gmail.com')
);
-- Beklenen: true
```

---

## 🧪 ADIM 4: TEST AUDIT LOG (OPTIONAL)

```sql
-- Test audit log entry oluştur
SELECT log_admin_action(
  (SELECT id FROM profiles WHERE email = 'jewelshot.ai@gmail.com'),  -- 👈 KENDİ EMAIL
  'MIGRATION_TEST',
  'system',
  NULL,
  '127.0.0.1',
  'Manual SQL Test',
  'SQL',
  '/manual',
  NULL,
  200,
  true,
  NULL,
  '{"note": "Migration verification test"}'::jsonb
);

-- Function bir UUID dönmeli (başarılı)
```

**Verify audit log created:**
```sql
SELECT * FROM recent_admin_actions WHERE action = 'MIGRATION_TEST';

-- Beklenen: 1 satır görmeli (az önce oluşturduğunuz log)
```

---

## ✅ VERIFICATION CHECKLIST

```
DAY 1, TASK 1 - DATABASE MIGRATION CHECKLIST:

□ Migration SQL başarıyla çalıştırıldı (no errors)
□ profiles tablosuna 3 yeni kolon eklendi (role, is_2fa_enabled, two_factor_secret)
□ admin_audit_logs tablosu oluşturuldu
□ 5-6 index oluşturuldu
□ RLS policies active (4 policy)
□ Helper functions created (3 function)
□ Views created (3 view)
□ Kendi user'ınız 'admin' role'e set edildi
□ get_user_role() function test edildi → 'admin' döndü
□ is_admin() function test edildi → true döndü
□ Test audit log created (optional)
□ recent_admin_actions view'da log görünüyor (optional)
```

---

## 🎉 BAŞARILI OLDU MU?

**Eğer tüm checklistte ✅ varsa:**

```
╔════════════════════════════════════════════════════╗
║  ✅ DAY 1, TASK 1 COMPLETE!                        ║
║                                                    ║
║  Database foundation READY:                        ║
║  ✓ Admin roles configured                          ║
║  ✓ Audit logging setup                             ║
║  ✓ RLS policies active                             ║
║  ✓ Helper functions ready                          ║
║                                                    ║
║  Duration: ~10-15 minutes                          ║
║  Status: SUCCESS ✅                                 ║
║                                                    ║
║  NEXT: Day 1, Task 2 - Admin Auth Library          ║
╚════════════════════════════════════════════════════╝
```

**Şimdi git commit yapıp Task 2'ye geçelim!** 🚀

---

## 🚨 TROUBLESHOOTING

### Sorun 1: "column 'role' already exists"

**Sebep:** Migration daha önce çalıştırılmış

**Çözüm:**
```sql
-- Sadece role'ü update edin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'jewelshot.ai@gmail.com';
```

### Sorun 2: "Table 'admin_audit_logs' already exists"

**Sebep:** Tablo zaten var

**Çözüm:**
```sql
-- Migration başında DROP var, tekrar çalıştırın
-- VEYA manuel drop:
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
-- Sonra migration'ı tekrar çalıştır
```

### Sorun 3: "UPDATE 0 rows"

**Sebep:** Email bulunamadı

**Çözüm:**
```sql
-- Email'inizi kontrol edin
SELECT email FROM profiles;

-- Doğru email ile tekrar deneyin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'DOGRU-EMAIL-BURAYA@example.com';
```

### Sorun 4: "Foreign key constraint violated"

**Sebep:** profiles tablosu id column'u auth.users'a referans etmiyor olabilir

**Çözüm:**
```sql
-- profiles tablosunun yapısını kontrol et
\d profiles

-- Eğer id → auth.users(id) foreign key yoksa, ekle:
ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

---

## 📊 PROGRESS UPDATE

```
DAY 1: Foundation        [██░░░░░░░░] 20% - Task 1 DONE ✅
DAY 2: Migration (Part 1)[░░░░░░░░░░] 0%  - Pending
DAY 3: Migration (Part 2)[░░░░░░░░░░] 0%  - Pending
DAY 4: Testing           [░░░░░░░░░░] 0%  - Pending
DAY 5: Deployment        [░░░░░░░░░░] 0%  - Pending

OVERALL SPRINT:          [█░░░░░░░░░] 10% - In Progress
```

---

**Migration başarılı olduysa, buraya "BAŞARILI" yaz, Task 2'ye geçelim!** ✋

