# 🛠️ Database Migration Required

## ❌ Sorun

`api/batch/create` endpoint'i **500 hatası** veriyor çünkü Supabase veritabanında `batch_projects` ve `batch_images` tabloları **YOK**.

## ✅ Çözüm: Migration Çalıştır

### Option 1: Supabase Dashboard (Önerilen)

1. **Supabase Dashboard'a git:** https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. **SQL Editor'ı aç** (sol menüden "SQL Editor")
3. **New query** butonuna tıkla
4. `supabase/migrations/20250118_batch_projects.sql` dosyasının **tüm içeriğini** kopyala
5. SQL Editor'a yapıştır
6. **RUN** butonuna tıkla
7. ✅ Success mesajını gördüğünde hazır!

### Option 2: Supabase CLI (Local)

Eğer Supabase CLI kuruluysa:

```bash
cd "jewelshot kopyası"
supabase db push
```

### Option 3: Setup Page (App İçinden)

1. Tarayıcıda şu URL'e git: https://www.jewelshot.ai/setup
2. "Check Database Status" butonuna tıkla
3. Eğer tablolar yoksa, talimatları takip et
4. Migration'ı Supabase Dashboard'dan çalıştır
5. Tekrar "Check Database Status" butonuna tıkla
6. ✅ Yeşil tik gördüğünde hazır!

## 🔍 Migration Ne Yapar?

Bu migration 2 tablo oluşturur:

### 1. `batch_projects`
- Her batch işlemi için bir kayıt
- Project adı, toplam görsel sayısı, durum (processing/completed)
- User ID ile ilişkilendirilmiş (her kullanıcı sadece kendi batch'lerini görür)

### 2. `batch_images`
- Her generate edilen görsel için bir kayıt
- Original filename, size, result URL
- Batch project ID ile ilişkilendirilmiş
- Status tracking (pending/processing/completed/failed)

### Bonus:
- **RLS Policies:** Her kullanıcı sadece kendi kayıtlarını görebilir/düzenleyebilir
- **Indexes:** Hızlı sorgulama için optimize edilmiş
- **Triggers:** Image status değiştiğinde project stats otomatik güncellenir
- **Auto-timestamps:** created_at, updated_at otomatik yönetilir

## 📊 Migration Sonrası

Migration başarılı olduktan sonra:

1. **Batch sayfası çalışacak:** `/batch` → Generate işlemi başlatabilirsin
2. **Gallery'de görünecek:** `/gallery` → Batch sekmesinde tüm projeler listelenecek
3. **Veri kaybı olmaz:** Tüm generate edilen görseller Supabase'de güvenle saklanır
4. **Background processing:** Sayfa yenilense bile batch işlemi devam eder

## 🐛 Hata Ayıklama

Eğer migration sonrası hala hata alıyorsan:

1. **Supabase'de tabloları kontrol et:**
   - Dashboard → Table Editor
   - `batch_projects` ve `batch_images` tabloları görünüyor mu?

2. **RLS policies kontrol et:**
   - Dashboard → Authentication → Policies
   - Her iki tablo için policies var mı?

3. **Console logları kontrol et:**
   - Browser console → Network tab
   - `api/batch/create` isteğinin cevabını incele

4. **Setup page'i kullan:**
   - `/setup` sayfasına git
   - "Check Database Status" ile durum kontrolü yap

## 💡 İpucu

Migration'ı çalıştırdıktan sonra `/setup` sayfasını sil veya koruma altına al (production'da herkesin erişmemesi için).

```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  // ... existing code ...
  
  // Protect setup page in production
  if (process.env.NODE_ENV === 'production' && pathname === '/setup') {
    return NextResponse.redirect(new URL('/batch', request.url));
  }
}
```

---

**Hazırlandı:** 2025-01-18  
**Son Güncelleme:** 2025-01-18  
**Durum:** 🔴 Migration Bekleniyor

