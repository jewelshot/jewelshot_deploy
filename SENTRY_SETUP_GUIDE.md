# 🛡️ Sentry DSN Setup Rehberi

## Neden Gerekli?

Sentry olmadan:

- ❌ Production hataları görünmüyor
- ❌ Kullanıcı sorunları bilinmiyor
- ❌ Error tracking yok

## ✅ Adımlar (5 dakika)

### 1. Sentry Hesabı Oluştur

1. **https://sentry.io** → Sign Up
2. Email ile kayıt ol (ücretsiz)
3. Organization adı: `jewelshot` veya istediğin ad

### 2. Proje Oluştur

1. **Create Project** butonuna tıkla
2. Platform seç: **Next.js**
3. Proje adı: `jewelshot-final`
4. Alert frekansı: **On every new issue**
5. **Create Project** → Tıkla

### 3. DSN'i Kopyala

Proje oluşturulunca şöyle bir ekran gelecek:

```
Client Keys (DSN)
https://abc123def456ghi789jkl012mno345@o1234567.ingest.sentry.io/9876543
```

**Bu URL'i kopyala!** 👆

### 4. Local Environment'a Ekle

`.env.local` dosyasını aç ve şunu ekle:

```bash
# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://abc123...@o1234567.ingest.sentry.io/9876543
```

### 5. Vercel'e Ekle

1. **Vercel Dashboard** → Proje seç
2. **Settings** → **Environment Variables**
3. Yeni variable ekle:
   - **Name**: `NEXT_PUBLIC_SENTRY_DSN`
   - **Value**: `https://abc123...` (kopyaladığın DSN)
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development
4. **Save** → Tıkla

### 6. Test Et (Optional)

Local'de test:

```bash
npm run dev
```

Browser console'da:

```javascript
// Test error
throw new Error('Sentry test error');
```

Sentry dashboard'da hata görünmeli! ✅

### 7. Redeploy (Vercel'e eklediysen)

```bash
git push origin main
```

Vercel otomatik deploy edecek. Yeni deployment artık Sentry'ye bağlı! 🎉

---

## 🎯 Doğrulama

Sentry Dashboard'da:

✅ **Issues** tab'ında hatalar görünmeli
✅ **Performance** tab'ında request'ler görünmeli
✅ **Releases** tab'ında deployment'lar görünmeli

---

## 📊 Beklenen Sonuç

```bash
✅ NEXT_PUBLIC_SENTRY_DSN: https://...
✅ Sentry integration: ACTIVE
✅ Error tracking: ENABLED
✅ Session replays: ENABLED (10%)
✅ Performance monitoring: ENABLED
```

---

## 🚨 Önemli Notlar

1. **DSN Public'tir**: `NEXT_PUBLIC_` prefix'i var, bu normal
2. **Rate Limit**: Free plan'da 5,000 errors/month
3. **Session Replay**: %10 sample rate (config'de ayarlı)
4. **Release Tracking**: Vercel commit SHA otomatik

---

## ❓ Sorun mu var?

### Hata: "Sentry DSN not found"

```bash
# .env.local kontrolü
cat .env.local | grep SENTRY

# Olmalı:
NEXT_PUBLIC_SENTRY_DSN=https://...
```

### Hata: "Invalid DSN format"

DSN formatı şöyle olmalı:

```
https://<key>@<organization>.ingest.sentry.io/<project>
```

### Vercel'de görünmüyor

1. Environment Variables'a ekledin mi?
2. Tüm environment'lar seçili mi? (Prod, Preview, Dev)
3. Redeploy yaptın mı?

---

## 🎉 Başarılı!

Artık production'da tüm hatalar Sentry'de görünecek! 🛡️
