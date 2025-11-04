# 🔥 SUPABASE SETUP - HIZLI BAŞLANGIÇ

## 1️⃣ SUPABASE PROJECT OLUŞTUR

### Adım 1: Supabase'e Git
1. 🌐 https://supabase.com adresine git
2. "Start your project" → Sign in with GitHub
3. "New Project" butonuna tık

### Adım 2: Project Ayarları
```
Name: jewelshot
Database Password: [GÜVENLİ BİR ŞİFRE - KAYDET!]
Region: Europe West (Frankfurt) 
         ↑ Türkiye'ye en yakın
```

### Adım 3: Project Oluşturulmasını Bekle
⏳ 2-3 dakika sürer...

---

## 2️⃣ DATABASE TABLES OLUŞTUR

### SQL Editor'ü Aç
1. Sol menüden **SQL Editor** seç
2. "New query" butonuna tık
3. Aşağıdaki SQL'i yapıştır:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table (user galleries)
CREATE TABLE public.images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_url TEXT NOT NULL,
  generated_url TEXT NOT NULL,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  prompt TEXT,
  style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for Images
CREATE POLICY "Users can view own images"
  ON public.images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images"
  ON public.images FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. **RUN** butonuna tık
5. ✅ "Success. No rows returned" görmelisin

---

## 3️⃣ STORAGE BUCKET OLUŞTUR

### Adım 1: Storage'a Git
1. Sol menüden **Storage** seç
2. "Create a new bucket" butonuna tık

### Adım 2: Bucket Ayarları
```
Name: images
Public bucket: ✅ (checked)
File size limit: 10 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

3. "Create bucket" butonuna tık

### Adım 3: Bucket Policies (RLS)
1. `images` bucket'ına tıkla
2. "Policies" tab'ına git
3. "Add policy" → Template'lerden seç:

**Policy 1: Upload (INSERT)**
```sql
-- Users can upload to own folder
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 2: View (SELECT)**
```sql
-- Anyone can view public images
CREATE POLICY "Public images are viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
```

**Policy 3: Delete**
```sql
-- Users can delete own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 4️⃣ API KEYS'Leri AL

### Adım 1: Settings'e Git
1. Sol menüden **Project Settings** (⚙️ icon)
2. **API** sekmesine tıkla

### Adım 2: Keys'leri Kopyala
```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co

# anon public key (UZUN KEY - public tarafta kullanılır)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **DİKKAT:** `service_role` key'i DEĞİL, `anon` key'i kullan!

---

## 5️⃣ EMAIL AUTH'U AKTİFLEŞTİR

### Adım 1: Authentication Settings
1. Sol menüden **Authentication** seç
2. **Providers** tab'ına git
3. **Email** provider'ını bul

### Adım 2: Email Settings
```
Enable Email provider: ✅
Confirm email: ✅ (recommended)
```

### Adım 3: Email Templates (Opsiyonel)
1. **Email Templates** tab'ına git
2. Signup, Reset Password template'lerini customize edebilirsin

---

## 6️⃣ LOCAL .env.local DOSYASI OLUŞTUR

```bash
cd /Users/yasin/Desktop/vortex/jewelshot

# .env.local oluştur
cat > .env.local << 'ENVEOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# FAL.AI
FAL_AI_API_KEY=ce993b67-6ee4-4ed6-a6c3-060ebe0ef0af:94aa5e61817f27591450479136baf799

# Optional
NEXT_PUBLIC_MAX_GALLERY_IMAGES=100
NEXT_PUBLIC_APP_ENV=development
ENVEOF
```

⚠️ **YUKARIYA KENDI KEYS'LERİNİ YAPIŞTI!**

---

## 7️⃣ TEST - LOCAL'DE ÇALIŞTIR

```bash
cd /Users/yasin/Desktop/vortex/jewelshot

# Restart dev server (yeni env vars için)
npm run dev
```

### Test Checklist:
1. ✅ http://localhost:3000/auth/signup → Signup form açılıyor mu?
2. ✅ Yeni bir hesap oluştur
3. ✅ Email confirmation (inbox'ını kontrol et)
4. ✅ Login yap
5. ✅ Studio'ya git → Image upload
6. ✅ Gallery'ye git → Images görünüyor mu?

---

## 8️⃣ SUPABASE DASHBOARD KONTROL

### Profiles Table
1. **Table Editor** → `profiles` 
2. Yeni oluşturduğun user'ı göreceksin

### Images Table  
1. **Table Editor** → `images`
2. Upload ettiğin image'leri göreceksin

### Storage Bucket
1. **Storage** → `images`
2. Upload ettiğin dosyaları göreceksin

---

## ✅ TAMAMLANDI!

Supabase setup'ı bitti! Artık:
- ✅ Authentication çalışıyor
- ✅ Database tables hazır
- ✅ Storage bucket aktif
- ✅ RLS policies ayarlandı

### 🚀 SIRADA:
1. GitHub'a push
2. Vercel'e deploy
3. Vercel'de environment variables ekle
4. Production test

---

## 🆘 SORUN YAŞARSAN

### "Email not confirmed" hatası
- Supabase → Authentication → Users
- User'ı bul → "..." menu → "Confirm email"

### "RLS policy violation" hatası  
- SQL query'leri tekrar çalıştır
- Policies doğru user_id kontrolü yapıyor mu kontrol et

### Images upload olmuyor
- Storage bucket'ın **public** olduğundan emin ol
- RLS policies'i kontrol et

---

**Hazırlayan:** AI Assistant
**Tarih:** $(date)
**Süre:** ~10-15 dakika
