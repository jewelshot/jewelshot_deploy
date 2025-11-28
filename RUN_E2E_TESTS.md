# 🎭 E2E Testleri Çalıştırma Kılavuzu

## Hızlı Başlangıç

### Yöntem 1: UI Mode (Önerilen - Görsel Arayüz)

```bash
npm run test:e2e:ui
```

**Ne olacak:**
1. ✅ Playwright UI açılacak (browser window)
2. ✅ Dev server otomatik başlatılacak (http://localhost:3000)
3. ✅ 49 test listelenecek
4. ✅ İstediğin testi seçip çalıştırabileceksin
5. ✅ Testleri izleyebileceksin (canlı)
6. ✅ Hataları debug edebileceksin

**UI Mode Özellikleri:**
- 🎬 Testleri adım adım izle
- 🔍 Her adımın screenshot'unu gör
- 🐛 Hataları yerinde debug et
- ⏯️ Testleri pause/resume et
- 📊 Test sonuçlarını görsel olarak gör

---

### Yöntem 2: Headless Mode (Hızlı - Terminal)

```bash
npm run test:e2e
```

**Ne olacak:**
1. ✅ Testler arka planda çalışacak (browser görünmez)
2. ✅ Dev server otomatik başlatılacak
3. ✅ Tüm testler sırayla çalışacak
4. ✅ Sonuçlar terminal'de gösterilecek
5. ✅ Hatalar için screenshot/video kaydedilecek

---

### Yöntem 3: Headed Mode (Browser Görsün)

```bash
npm run test:e2e:headed
```

**Ne olacak:**
1. ✅ Browser window açılacak (chromium)
2. ✅ Testlerin çalıştığını canlı göreceksin
3. ✅ Tüm testler otomatik çalışacak
4. ✅ Sonuçlar hem browser'da hem terminal'de

---

### Yöntem 4: Debug Mode (Detaylı İnceleme)

```bash
npm run test:e2e:debug
```

**Ne olacak:**
1. ✅ Playwright Inspector açılacak
2. ✅ Her satırı adım adım çalıştırabileceksin
3. ✅ Breakpoint koyabileceksin
4. ✅ Console logları görebileceksin
5. ✅ Network isteklerini görebileceksin

---

### Yöntem 5: Özel Test Çalıştırma

```bash
# Sadece auth testleri
npm run test:e2e auth.spec.ts

# Sadece studio testleri
npm run test:e2e studio.spec.ts

# Sadece gallery testleri
npm run test:e2e gallery.spec.ts

# Sadece rate-limiting testleri
npm run test:e2e rate-limiting.spec.ts

# Tek bir test
npm run test:e2e auth.spec.ts:73
```

---

## 📊 Test Sonuçlarını Görüntüleme

### HTML Raporu

Testler çalıştıktan sonra:

```bash
npm run test:e2e:report
```

**Rapor İçeriği:**
- ✅ Tüm test sonuçları
- 📸 Her adımın screenshot'u
- 🎥 Başarısız testlerin videosu
- 📈 İstatistikler (pass/fail/skip)
- ⏱️ Çalışma süreleri
- 🐛 Hata detayları

---

## 🔧 Troubleshooting

### Sorun: Dev server başlamıyor

```bash
# Manuel başlat
npm run dev

# Başka terminalde testleri çalıştır
npm run test:e2e
```

### Sorun: Port 3000 kullanımda

```bash
# Port'u öldür
lsof -ti:3000 | xargs kill -9

# Testleri tekrar çalıştır
npm run test:e2e
```

### Sorun: Browser açılmıyor

```bash
# Browser'ları yeniden kur
npx playwright install chromium --with-deps

# Testleri tekrar çalıştır
npm run test:e2e
```

### Sorun: Testler çok yavaş

```bash
# Sadece chromium kullan (varsayılan)
npm run test:e2e

# Paralel çalışma sayısını artır
npx playwright test --workers=4
```

### Sorun: Specific test fail oluyor

```bash
# Debug mode'da çalıştır
npm run test:e2e:debug

# Veya sadece o testi headed modda çalıştır
npx playwright test auth.spec.ts:73 --headed
```

---

## 🎯 Beklenen Sonuçlar

### Test Süreleri

```bash
Authentication Flow:    ~30-60 saniye (14 test)
Studio Flow:           ~45-90 saniye (13 test)
Gallery Flow:          ~30-60 saniye (10 test)
Rate Limiting:         ~45-90 saniye (12 test)

TOPLAM:                ~2.5-5 dakika (49 test)
```

### Başarı Oranı

```bash
Beklenen:  45-49/49 passing ✅
Kabul edilebilir: 40-49/49 passing ⚠️
Sorunlu: <40/49 passing ❌
```

**Not:** Bazı testler "lenient" (esnek) olduğu için UI varyasyonlarına göre skip olabilir.

---

## 📋 Test Checklist

### Kritik Testler (Mutlaka Geçmeli)

- [x] Authentication → Signup flow
- [x] Authentication → Login flow
- [x] Studio → Image upload
- [x] Studio → Canvas display
- [x] Gallery → Display images
- [x] Gallery → Delete images
- [x] Rate Limiting → Indicator visible

### Opsiyonel Testler (Geçmeyebilir)

- [ ] Studio → Zoom controls (UI'a bağlı)
- [ ] Studio → View modes (özellik flag'e bağlı)
- [ ] Gallery → Metadata display (veri varsa)

---

## 🚀 Şimdi Çalıştır!

### En Kolay Yöntem (Önerilen)

```bash
# UI modda aç, istediğin testi seç, çalıştır
npm run test:e2e:ui
```

### En Hızlı Yöntem

```bash
# Hepsini headless çalıştır
npm run test:e2e
```

### En Detaylı Yöntem

```bash
# Debug modda aç, adım adım ilerle
npm run test:e2e:debug
```

---

## 💡 İpuçları

### Test Yazarken

- Her test isolated olmalı (birbirine bağımlı olmamalı)
- Test user'lar dinamik oluşturulmalı (`test-${Date.now()}@example.com`)
- Temp dosyalar test sonunda silinmeli
- Timeout'lar generous olmalı (UI responsiveness için)

### Debug Ederken

- `page.pause()` ekleyerek testi durdur
- `--headed` flag'i ile browser'ı gör
- `--debug` flag'i ile inspector'ı aç
- Console log'ları izle: `page.on('console', ...)`

### CI/CD'de

- `--workers=1` (sequential)
- `--retries=2` (retry on fail)
- Screenshots ve videos kaydet
- HTML rapor oluştur

---

**Hazırsın! Testleri çalıştır ve sonuçları gör! 🎭✨**

---

*Son Güncelleme: 28 Kasım 2024*

