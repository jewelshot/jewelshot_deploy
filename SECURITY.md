# 🔒 JEWELSHOT - GÜVENLİK DOKÜMANTASYONU

## 📊 GÜVEN LİK DURUMU

### ✅ GÜVENL İ (Production-Ready)

| Özellik                    | Durum | Açıklama                 |
| -------------------------- | ----- | ------------------------ |
| **HTTPS/SSL**              | ✅    | Cloudflare + Vercel SSL  |
| **API Keys (Server-Side)** | ✅    | FAL.AI key server-only   |
| **Supabase RLS**           | ✅    | Row Level Security aktif |
| **Console Logs**           | ✅    | Production'da disabled   |
| **Source Maps**            | ✅    | Production'da gizli      |
| **CSP Headers**            | ✅    | Content Security Policy  |
| **CORS**                   | ✅    | Same-origin policy       |

---

## 🔑 ENV VARIABLE'LAR

### Public (Client-Side) - GÖRÜNMESİ NORMAL

```bash
# Bu değişkenler client-side'da görünür (GÜVENL İ):
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  # ← RLS ile korunuyor
NEXT_PUBLIC_VERCEL_URL=jewelshot.ai
NEXT_PUBLIC_SENTRY_DSN=https://...
```

**Neden güvenli?**

- **ANON KEY** = Public key, RLS policy'leriyle sınırlı
- **URL'ler** = Zaten herkese açık
- **Sentry DSN** = Public endpoint (sadece error toplar)

---

### Private (Server-Side) - ASLA GÖRÜNMEMELİ

```bash
# Bu değişkenler SADECE server-side (GÜVENLİ):
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # ← TEHLIKELI! RLS bypass eder
FAL_AI_API_KEY=xxx  # ← Pahalı! Abuse edilebilir
STRIPE_SECRET_KEY=sk_live_...
DATABASE_PASSWORD=xxx
```

**Nerede kullanılıyor?**

- `/api/*` route'larında (server-side)
- `process.env.FAL_AI_API_KEY` (NEXT*PUBLIC* YOK!)

---

## 🛡️ KORUMA KATMANLARı

### 1. **Supabase Row Level Security (RLS)**

**Ne yapar?**

- ANON KEY ile bile user sadece kendi verilerini görür
- INSERT/UPDATE/DELETE yetkiler sınırlı

**Örnek:**

```sql
-- User sadece kendi credit'ini görebilir
CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- User credit'ini güncelleyemez (sadece server yapabilir)
CREATE POLICY "Service role can update credits"
  ON user_credits FOR UPDATE
  USING (auth.role() = 'service_role');
```

---

### 2. **API Rate Limiting** ⏳

**Ne yapar?**

- User başına request limiti
- Abuse'ü önler (spam, DoS)

**Limitler:**

```typescript
- AI Generation: 5 request / dakika
- AI Edit: 5 request / dakika
- Credits Check: 30 request / 10 saniye
- Auth: 5 request / dakika
```

**Response:**

```bash
HTTP 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704067200
Retry-After: 45
```

---

### 3. **Console Log Filtering**

**Production'da:**

```typescript
// next.config.ts
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
}

// logger.ts
const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) {
  console.log(...args);  // Sadece dev'de çalışır
}
```

---

### 4. **Content Security Policy (CSP)**

**Ne yapar?**

- XSS saldırılarını önler
- Sadece güvenilir kaynaklara izin verir

**next.config.ts:**

```typescript
headers: [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval'", // Next.js gereksinimi
      "connect-src 'self' https://*.supabase.co https://*.fal.media",
      "img-src 'self' data: https: blob:",
    ].join('; '),
  },
];
```

---

## 🚨 YAPILAMAYACAKLAR (Güvenlik)

### ❌ Client-Side'da Yapılamaz:

```typescript
// ❌ YANLIŞ (Client-side'da API key kullanma!)
const response = await fetch('https://api.fal.ai/generate', {
  headers: {
    Authorization: `Bearer ${process.env.FAL_KEY}`, // EXPOSE EDİLİR!
  },
});

// ✅ DOĞRU (Server-side API route kullan)
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt }),
});
```

---

### ❌ RLS Bypass Edemezsiniz:

```typescript
// ❌ YANLIŞ (Başka user'ın credit'ini göremezsin)
const { data } = await supabase
  .from('user_credits')
  .select('*')
  .eq('user_id', 'BASKA_USER_ID'); // RLS engeller!

// ✅ DOĞRU (Sadece kendininkini görebilirsin)
const { data } = await supabase
  .from('user_credits')
  .select('*')
  .eq('user_id', auth.uid()); // RLS izin verir
```

---

## 🔧 GÜVENLİK İYİLEŞTİRMELERİ (Yapılacak)

### Hemen Yapılacak:

1. **Rate Limiting Aktif Et**

   ```bash
   # Supabase'de SECURITY_IMPROVEMENTS.sql çalıştır
   ```

2. **RLS Policy'leri Sıkılaştır**

   ```sql
   -- User UPDATE yapamaz, sadece server
   -- DELETE yasak
   ```

3. **IP Whitelist (Opsiyonel)**
   ```typescript
   // Sadece belirli IP'lerden admin panel erişimi
   ```

---

### Gelecekte Yapılacak:

1. **2FA (Two-Factor Authentication)**
   - Supabase Auth 2FA desteği
   - SMS veya TOTP

2. **API Key Rotation**
   - FAL.AI key'i periyodik değiştir
   - Supabase key rotation

3. **Audit Logging**
   - Tüm kritik işlemleri logla
   - Şüpheli aktiviteyi tespit et

4. **DDoS Protection**
   - Cloudflare Pro plan
   - Advanced rate limiting

---

## 📋 GÜVENLİK CHECKLIST

### Deploy Öncesi:

- [ ] `.env.local` Git'te YOK ✅
- [ ] `.env.example` sadece public değişkenler içeriyor ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` NEXT*PUBLIC* değil ✅
- [ ] `FAL_AI_API_KEY` NEXT*PUBLIC* değil ✅
- [ ] RLS tüm tablolarda aktif ✅
- [ ] Console logs production'da disabled ✅
- [ ] Source maps gizli ✅
- [ ] Rate limiting aktif ⏳
- [ ] HTTPS/SSL aktif ✅

---

## 🆘 GÜVENLİK SORUNU BULDUYSANIZ

**Lütfen:**

1. ✉️ **Email:** security@jewelshot.ai
2. 🐛 **GitHub:** Private security advisory aç
3. 🚨 **Kritik:** Direkt bana ulaş

**Raporlarken:**

- Ne bulduğunuzu açıklayın
- Reproduce steps verin
- Impact assessment yapın
- Çözüm önerisi (varsa)

---

## 📚 KAYNAKLAR

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Son Güncelleme:** ${new Date().toISOString().split('T')[0]}

**Güvenlik Seviyesi:** 🟢 PRODUCTION-READY
