# 📧 Waitlist & Maintenance Mode - Kullanım Kılavuzu

## 🎯 AMAÇ

Bu sistem sayesinde:

- ✅ Siteyi geçici olarak kapatabilirsin
- ✅ Ziyaretçilerden email toplayabilirsin
- ✅ Geliştirici olarak sen yine erişebilirsin
- ✅ Emailler Supabase'de güvenle saklanır

---

## 🚀 HIZLI BAŞLANGIÇ

### 1️⃣ Supabase Tabloyu Oluştur

**Supabase Dashboard'a git:**

```
https://supabase.com/dashboard → Projen → SQL Editor
```

**Aşağıdaki SQL'i çalıştır:**

```sql
-- Waitlist tablosu oluştur
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'pending'
);

-- Index ekle (performans için)
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);

-- Row Level Security (RLS) aktif et
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Public insert izni (herkes email ekleyebilir)
CREATE POLICY "Anyone can add to waitlist"
  ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Sadece authenticated user'lar okuyabilir
CREATE POLICY "Only authenticated users can view waitlist"
  ON waitlist
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

**"Run" butonuna bas → Tablo oluşturuldu! ✅**

---

### 2️⃣ Siteyi Kapat (Maintenance Mode)

**Dosya:** `src/middleware.ts`

**7. satırı değiştir:**

```typescript
const MAINTENANCE_MODE = true; // ✅ Siteyi kapat
```

**Kaydet ve deploy et → Site kapandı! 🚧**

Artık tüm ziyaretçiler `/maintenance` sayfasını görecek.

---

### 3️⃣ Sen Hala Erişebilirsin (Bypass)

**Tarayıcına şunu yaz:**

```
https://jewelshot.ai/api/maintenance-bypass?password=jewelshot2024
```

✅ Cookie setlenir → 7 gün boyunca sen erişebilirsin!

**Şifreyi değiştirmek için:**
`src/middleware.ts` → 8. satır:

```typescript
const MAINTENANCE_PASSWORD = 'yeni_sifreni_yaz'; // 🔑
```

---

## 📊 TOPLANan EMAILLERİ GÖRÜNTÜLE

### A) Supabase Dashboard (En Kolay)

1. Supabase Dashboard'a git
2. **Table Editor** → `waitlist` tablosunu seç
3. Tüm emailleri gör!

### B) API ile Kontrol Et

**Toplam email sayısı:**

```bash
curl https://jewelshot.ai/api/waitlist
```

Sonuç:

```json
{ "count": 42 }
```

---

## 🎨 COMING SOON SAYFASI

**Sayfa:** `/maintenance`

**Özellikler:**

- ✅ Güzel glassmorphic tasarım
- ✅ Aurora background efekti
- ✅ Email + isim (opsiyonel) toplama
- ✅ Gerçek zamanlı validasyon
- ✅ Başarı/hata mesajları
- ✅ Duplicate email kontrolü
- ✅ Responsive tasarım

**Özelleştirmek için:**
`src/app/maintenance/page.tsx` dosyasını düzenle.

---

## 🔄 SİTEYİ TEKRAR AÇ

**Dosya:** `src/middleware.ts`

**7. satırı değiştir:**

```typescript
const MAINTENANCE_MODE = false; // ✅ Site açık
```

**Kaydet ve deploy et → Site açıldı! 🚀**

---

## 📧 EMAIL EXPORT

### SQL Sorgusu (Supabase SQL Editor)

**Tüm emailleri listele:**

```sql
SELECT
  email,
  name,
  created_at,
  status
FROM waitlist
ORDER BY created_at DESC;
```

**CSV olarak indir:**

```sql
COPY (
  SELECT email, name, created_at
  FROM waitlist
  ORDER BY created_at DESC
) TO STDOUT WITH CSV HEADER;
```

---

## 🛠️ GELİŞMİŞ ÖZELLİKLER

### 1. Email Durumu Güncelle

```sql
-- Email'i "notified" olarak işaretle
UPDATE waitlist
SET status = 'notified'
WHERE email = 'kullanici@example.com';
```

### 2. Toplu Email Gönder

**Not:** Email gönderimi için Resend, SendGrid, veya Supabase Edge Functions kullanman gerekir.

Örnek (Node.js):

```javascript
const { data: emails } = await supabase
  .from('waitlist')
  .select('email, name')
  .eq('status', 'pending');

// Her email'e mesaj gönder
for (const user of emails) {
  await sendEmail(user.email, 'Jewelshot Launch!', '...');

  // Durumu güncelle
  await supabase
    .from('waitlist')
    .update({ status: 'notified' })
    .eq('email', user.email);
}
```

### 3. Analytics

```sql
-- Günlük email sayısı
SELECT
  DATE(created_at) as date,
  COUNT(*) as signups
FROM waitlist
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- En popüler domain'ler
SELECT
  SUBSTRING(email FROM '@(.*)$') as domain,
  COUNT(*) as count
FROM waitlist
GROUP BY domain
ORDER BY count DESC
LIMIT 10;
```

---

## 🔥 HIZLI KOMUTLAR

| Komut                                            | Açıklama            |
| ------------------------------------------------ | ------------------- |
| `MAINTENANCE_MODE = true`                        | Siteyi kapat        |
| `MAINTENANCE_MODE = false`                       | Siteyi aç           |
| `/api/maintenance-bypass?password=jewelshot2024` | Geliştirici erişimi |
| Supabase → Table Editor → waitlist               | Emailleri gör       |

---

## 🎉 BAŞARILI!

Artık:

- ✅ Site kapatma sistemi aktif
- ✅ Email toplama çalışıyor
- ✅ Güzel "Coming Soon" sayfası var
- ✅ Sen hala erişebiliyorsun

**Siteyi kapatmak için:**

1. `src/middleware.ts` → `MAINTENANCE_MODE = true`
2. Commit & push
3. Vercel otomatik deploy eder
4. Site kapanır! 🚧

**Sorular?**
Dosyalar hazır, sadece `MAINTENANCE_MODE` değişkenini değiştir!
