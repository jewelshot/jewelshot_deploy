# ⚡ SUPABASE HIZLI KURULUM (5 DAKİKA)

## 🎯 TÜM SETUP TEK SEFERDE!

### 1️⃣ DATABASE TABLES (1 dakika)

**Supabase Dashboard:**
- Sol menü: **SQL Editor**
- **New query**
- Dosyayı aç: `supabase_sql_setup.sql`
- Tüm içeriği kopyala → SQL Editor'e yapıştır
- **RUN** butonuna bas
- ✅ "Success. No rows returned"

---

### 2️⃣ STORAGE BUCKET (30 saniye)

**Dashboard → Storage:**
1. **"Create a new bucket"**
2. Ayarlar:
   - Name: `images`
   - Public bucket: ✅
   - File size limit: `10`
   - Allowed MIME types: `image/jpeg, image/png, image/webp`
3. **"Create bucket"**

---

### 3️⃣ STORAGE POLICIES (30 saniye)

**2 YOL VAR - BİRİNİ SEÇ:**

#### 🚀 YOL 1: TEK SQL (EN HIZLI)
1. **SQL Editor** → **New query**
2. Dosyayı aç: `supabase_storage_policies.sql`
3. Tüm içeriği kopyala → yapıştır
4. **RUN**
5. ✅ Bitti!

#### 🖱️ YOL 2: UI'DAN TEMPLATE (DAHA KOLAY)
1. **Storage** → `images` bucket → **Policies** tab
2. **"New Policy"** → **"Get started quickly"**
3. Template seç:
   - ✅ **"Allow public read access"** (SELECT)
   - ✅ **"Allow logged in users to upload"** (INSERT)  
   - ✅ **"Allow users to delete their own files"** (DELETE)
4. Her birini **"Review"** → **"Save policy"**

---

### 4️⃣ EMAIL AUTH (10 saniye)

**Dashboard → Authentication → Providers:**
- **Email** provider'ı bul
- Toggle switch: **ON** ✅
- **Save**

---

### 5️⃣ LOCAL TEST (2 dakika)

```bash
cd /Users/yasin/Desktop/vortex/jewelshot
npm run dev
```

**Browser'da test:**
1. http://localhost:3000/auth/signup
2. Yeni hesap oluştur
3. Email'ini confirm et
4. Login yap
5. Studio → Upload image
6. Gallery → Image'i gör

---

## ✅ HIZLI KONTROL

### Dashboard'da Kontrol Et:
- **Table Editor** → `profiles` → User var mı?
- **Table Editor** → `images` → Image var mı?
- **Storage** → `images` bucket → File var mı?

### SORUN MU VAR?

**"RLS policy violation"**
→ SQL Editor'de policy'leri tekrar çalıştır

**"Bucket not found"**
→ Storage'da `images` bucket'ı var mı kontrol et

**"Email not confirmed"**
→ Authentication → Users → User'ı bul → "..." → "Confirm email"

---

## 🎉 BİTTİ!

**Toplam süre:** ~5 dakika

**Sırada:** 
- GitHub'a push
- Vercel'e deploy
- Production test

---

**Not:** `.env.local` zaten hazır, bir şey değiştirmene gerek yok!
