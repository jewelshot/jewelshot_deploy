# 🔐 MANUAL ADMIN SETUP GUIDE

> **Amaç:** Migration'dan sonra ilk admin kullanıcısını ayarla  
> **Süre:** 15 dakika  
> **Gerekli:** Supabase Dashboard access

---

## 🎯 ÖNCELİKLE: MİGRATION ÇALIŞTIRMA

### Seçenek 1: Supabase Dashboard (ÖNERİLEN)

1. **Supabase Dashboard'a git:**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **SQL Editor'ü aç:**
   - Sol menüden "SQL Editor" tıklayın
   - "New query" butonuna tıklayın

3. **Migration dosyasını kopyala:**
   - `supabase/migrations/20241128_admin_security.sql` dosyasını aç
   - **TÜM içeriği** kopyala (Ctrl+A, Ctrl+C)

4. **SQL Editor'e yapıştır:**
   - Kopyalanan SQL'i editor'e yapıştır
   - **"Run"** butonuna tıkla (veya Ctrl+Enter)

5. **Sonucu kontrol et:**
   ```
   ✅ Başarılı ise: "Success. No rows returned" mesajı
   ❌ Hata varsa: Hata mesajını oku ve düzelt
   ```

### Seçenek 2: Supabase CLI (Gelişmiş)

```bash
# 1. Supabase CLI yüklü mü kontrol et
supabase --version

# 2. Login (eğer değilsen)
supabase login

# 3. Link project (eğer local değilse)
supabase link --project-ref YOUR_PROJECT_REF

# 4. Migration'ı çalıştır
supabase db push

# 5. Verify
supabase db diff
```

---

## 👤 ADMIN KULLANICI AYARLAMA

### ADIM 1: Mevcut Email'inizi Bulun

**Supabase Dashboard:**
1. Sol menüden **"Authentication"** → **"Users"**
2. Kendi email'inizi bulun (örn: `jewelshot.ai@gmail.com`)
3. **User ID'yi kopyalayın** (UUID formatında)

**VEYA SQL ile:**
```sql
-- Kendi email'inizi buraya yazın
SELECT id, email, created_at 
FROM users 
WHERE email = 'jewelshot.ai@gmail.com';
```

---

### ADIM 2: Kendinizi Admin Yapın

**SQL Editor'de çalıştır:**

```sql
-- ============================================
-- SET YOURSELF AS ADMIN
-- ============================================

-- OPTION A: Email ile (ÖNERİLEN)
UPDATE users 
SET role = 'admin' 
WHERE email = 'jewelshot.ai@gmail.com';  -- 👈 KENDİ EMAIL'İNİZİ YAZIN

-- OPTION B: User ID ile
UPDATE users 
SET role = 'admin' 
WHERE id = 'YOUR-USER-ID-HERE';  -- 👈 USER ID'NİZİ YAZIN

-- VERIFY: Başarılı mı kontrol et
SELECT id, email, role, created_at 
FROM users 
WHERE role IN ('admin', 'superadmin');
```

**Beklenen Sonuç:**
```
id                                   | email                     | role  | created_at
-------------------------------------|---------------------------|-------|---------------------------
12345678-1234-1234-1234-123456789012 | jewelshot.ai@gmail.com    | admin | 2024-11-01 10:30:00+00
```

---

### ADIM 3: Verification (Doğrulama)

#### 3.1 Database'de Kontrol

```sql
-- 1. Users tablosunda role column var mı?
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('role', 'is_2fa_enabled', 'two_factor_secret');

-- Beklenen: 3 satır dönmeli


-- 2. Audit logs tablosu oluşturuldu mu?
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'admin_audit_logs';

-- Beklenen: 1 satır (admin_audit_logs)


-- 3. Indexes oluşturuldu mu?
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'admin_audit_logs';

-- Beklenen: 5-6 index


-- 4. RLS enabled mi?
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_audit_logs';

-- Beklenen: rowsecurity = true


-- 5. Functions oluşturuldu mu?
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name IN ('get_user_role', 'is_admin', 'log_admin_action');

-- Beklenen: 3 function


-- 6. Views oluşturuldu mu?
SELECT table_name 
FROM information_schema.views 
WHERE table_name LIKE '%admin%';

-- Beklenen: 3 view (recent_admin_actions, failed_admin_actions, admin_activity_summary)
```

#### 3.2 Application'da Test

**Frontend Test (Browser Console):**

```javascript
// 1. Login olun (admin olarak set ettiğiniz email ile)

// 2. Browser console'da çalıştırın:
fetch('/api/admin/test', {
  method: 'GET',
  credentials: 'include',
})
.then(r => r.json())
.then(console.log)
.catch(console.error);

// Beklenen: Admin data dönmeli (henüz route yok, 404 normal)
```

---

## 🧪 TEST ADMIN ACTION (OPTIONAL)

Migration başarılı mı test etmek için:

```sql
-- Test audit log entry oluştur
SELECT log_admin_action(
  (SELECT id FROM users WHERE email = 'jewelshot.ai@gmail.com'),  -- 👈 KENDİ EMAIL
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

-- Verify log created
SELECT * FROM recent_admin_actions WHERE action = 'MIGRATION_TEST';
```

**Beklenen Sonuç:**
- Function bir UUID dönmeli
- `recent_admin_actions` view'da test log görünmeli

---

## ✅ VERIFICATION CHECKLIST

```
□ Migration SQL başarıyla çalıştırıldı
□ users tablosuna 'role' column eklendi
□ admin_audit_logs tablosu oluşturuldu
□ Indexes oluşturuldu (5-6 tane)
□ RLS policies active
□ Helper functions created (3 tane)
□ Views created (3 tane)
□ Kendi user'ınız 'admin' role'e set edildi
□ Verification queries passed
□ Test audit log created (optional)
```

---

## 🚨 TROUBLESHOOTING

### Sorun 1: "Column 'role' already exists"

**Sebep:** Migration daha önce çalıştırılmış

**Çözüm:**
```sql
-- Sadece role'ü update edin
UPDATE users 
SET role = 'admin' 
WHERE email = 'jewelshot.ai@gmail.com';
```

### Sorun 2: "Table 'admin_audit_logs' already exists"

**Sebep:** Tablo zaten var

**Çözüm:**
```sql
-- Migration'ı DROP ile tekrar çalıştır
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
-- Sonra migration'ı tekrar çalıştır
```

### Sorun 3: "RLS policy already exists"

**Sebep:** Policy zaten oluşturulmuş

**Çözüm:**
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can read audit logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON admin_audit_logs;
-- Sonra migration'ı tekrar çalıştır
```

### Sorun 4: "Cannot update role - constraint violation"

**Sebep:** Role value invalid

**Çözüm:**
```sql
-- Check valid roles
SELECT unnest(enum_range(NULL::text)) AS valid_role
WHERE 'users_role_check' = 'users_role_check';

-- Use one of: 'user', 'admin', 'superadmin'
```

---

## 📝 NEXT STEPS

Migration başarılı olduktan sonra:

1. ✅ **Admin auth library oluştur** (Task 2)
2. ✅ **CORS/CSP implement et** (Task 3)
3. ✅ **Rate limiting enhance et** (Task 4)

→ **Continue to:** `WEEK1_SECURITY_SPRINT_PLAN.md` - Task 2

---

## 🔐 SECURITY NOTES

**⚠️ ÖNEMLİ:**
- Admin role çok güçlü - sadece güvendiğiniz kişilere verin
- Production'da test admin users oluşturmayın
- Audit logs'u düzenli kontrol edin
- 2FA'yı yakında enable edeceğiz (Task 2'de)

**🔒 Best Practices:**
- Her zaman en az sayıda admin kullanıcı
- Superadmin sadece founder/CTO için
- Admin actions'ı weekly review edin
- Failed actions'ları investigate edin

---

**Migration Complete!** 🎉  
**Admin User Set!** ✅  
**Ready for Task 2!** 🚀

