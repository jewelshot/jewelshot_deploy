# 🌐 Production URL Fix

## ❌ Şu Anki Sorun

Local environment'ta:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Bu production'da **kritik sorunlara** yol açar:

- ❌ Email verification links kırık
- ❌ OAuth redirects çalışmaz
- ❌ Supabase redirects hatalı
- ❌ Sitemap/robots.txt yanlış URL

---

## ✅ Çözüm (2 dakika)

### 1. Vercel Production URL'ini Bul

**Vercel Dashboard** → Proje seç → **Domains**

Şunlardan biri olmalı:

- `https://jewelshot-final.vercel.app` (varsayılan)
- `https://jewelshot.com` (özel domain varsa)

### 2. Vercel Environment Variables'a Ekle

**Vercel Dashboard** → **Settings** → **Environment Variables**

#### 🔴 Production Environment

Yeni variable ekle:

- **Name**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://jewelshot-final.vercel.app` (kendi URL'in)
- **Environments**: ✅ **Production ONLY**

#### 🟡 Preview Environment

Yeni variable ekle:

- **Name**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `https://jewelshot-final-git-${VERCEL_GIT_COMMIT_REF}-jewelshots-projects.vercel.app`
- **Environments**: ✅ **Preview ONLY**

#### 🟢 Development Environment

Yeni variable ekle:

- **Name**: `NEXT_PUBLIC_SITE_URL`
- **Value**: `http://localhost:3000`
- **Environments**: ✅ **Development ONLY**

### 3. Local .env.local Ayarlama

`.env.local` dosyasında:

```bash
# Site URL (Local development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Bu değişmeyecek, local için uygun.

### 4. Supabase Redirect URLs'i Güncelle

**Supabase Dashboard** → Authentication → **URL Configuration**

#### Site URL:

```
https://jewelshot-final.vercel.app
```

#### Redirect URLs (Allowed):

```
http://localhost:3000/auth/callback
https://jewelshot-final.vercel.app/auth/callback
https://jewelshot-final-*.vercel.app/auth/callback
```

**Not**: `*` wildcard preview deployments için gerekli.

### 5. Redeploy

```bash
git push origin main
```

Vercel otomatik deploy edecek ve yeni URL'leri kullanacak! ✅

---

## 🎯 Doğrulama

### Test 1: Auth Redirect

1. Production'da signup yap
2. Email verification link'e tıkla
3. Doğru URL'e yönlendirmeli: `https://jewelshot-final.vercel.app/...`

### Test 2: Environment Check

Production console'da:

```javascript
console.log(process.env.NEXT_PUBLIC_SITE_URL);
// Beklenen: https://jewelshot-final.vercel.app
```

### Test 3: Sitemap

Ziyaret et: `https://jewelshot-final.vercel.app/sitemap.xml`

Linkler doğru URL'de olmalı:

```xml
<url>
  <loc>https://jewelshot-final.vercel.app/</loc>
</url>
```

---

## 📊 Environment Variables Özet

| Environment       | NEXT_PUBLIC_SITE_URL                    |
| ----------------- | --------------------------------------- |
| Local Dev         | `http://localhost:3000`                 |
| Vercel Dev        | `http://localhost:3000`                 |
| Vercel Preview    | `https://...-git-branch-....vercel.app` |
| Vercel Production | `https://jewelshot-final.vercel.app`    |

---

## 🚨 Önemli Notlar

1. **Her environment ayrı**: Production, Preview, Development farklı URL'ler
2. **Supabase whitelist**: Tüm URL'leri Supabase'e ekle
3. **Custom domain**: Eğer `jewelshot.com` gibi domain varsa onu kullan
4. **Wildcard**: `*` kullanarak tüm preview deployments'ı kapsayabilirsin

---

## ❓ Sorun mu var?

### "Unauthorized redirect_uri"

Supabase Redirect URLs'ine eklemediğin bir URL kullanıyorsun.

**Çözüm**:

1. Supabase Dashboard → Auth → URL Configuration
2. Redirect URLs'e ekle

### "NEXT_PUBLIC_SITE_URL undefined"

Environment variable doğru environment'a eklenmemiş.

**Çözüm**:

1. Vercel → Settings → Environment Variables
2. Doğru environment'ı seç (Production/Preview/Development)
3. Redeploy

---

## 🎉 Başarılı!

Artık tüm environment'larda doğru URL'ler kullanılacak! 🌐

**Test checklist**:

- ✅ Email verification works
- ✅ OAuth redirects correct
- ✅ Sitemap URLs correct
- ✅ No 401 redirect errors
