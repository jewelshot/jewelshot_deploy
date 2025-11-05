# 📱 PWA Icon Setup Guide

## 🎯 Amaç

Android ve iOS'ta home screen'e eklenen PWA için profesyonel logo eklemek.

---

## ✅ Hazırlanan Dosyalar

### 1. Icon Generator (HTML)

📍 Konum: `scripts/generate-icons.html`

Bu dosya, 3 farklı boyutta icon oluşturur:

- **icon-512.png** (512x512) → Android splash screen
- **icon-192.png** (192x192) → Android home screen
- **apple-touch-icon.png** (180x180) → iOS home screen

---

## 📋 Adım Adım Kurulum

### **Adım 1: Icon Generator'ı Aç**

```bash
cd /Users/yasin/Desktop/vortex/jewelshot
open scripts/generate-icons.html
```

Tarayıcında 3 canvas açılacak (💎 emoji ile).

---

### **Adım 2: Icon'ları Kaydet**

Her canvas'a **sağ tıkla** → **"Save Image As..."**:

1. **İlk canvas (512x512)**

   ```
   Dosya adı: icon-512.png
   Konum: /Users/yasin/Desktop/vortex/jewelshot/public/icon-512.png
   ```

2. **İkinci canvas (192x192)**

   ```
   Dosya adı: icon-192.png
   Konum: /Users/yasin/Desktop/vortex/jewelshot/public/icon-192.png
   ```

3. **Üçüncü canvas (180x180)**
   ```
   Dosya adı: apple-touch-icon.png
   Konum: /Users/yasin/Desktop/vortex/jewelshot/public/apple-touch-icon.png
   (Mevcut dosyanın üzerine yaz - güncelleme)
   ```

---

### **Adım 3: Kontrol Et**

Dosyaların doğru yerde olduğunu kontrol et:

```bash
ls -lh public/icon-*.png public/apple-touch-icon.png
```

Çıktı:

```
-rw-r--r--  icon-192.png         (~ 5-10 KB)
-rw-r--r--  icon-512.png         (~ 15-25 KB)
-rw-r--r--  apple-touch-icon.png (~ 5-10 KB)
```

---

### **Adım 4: Build ve Deploy**

```bash
# Commit
git add public/icon-*.png public/apple-touch-icon.png manifest.json src/app/layout.tsx scripts/generate-icons.html
git commit -m "feat: add pwa icons for android and ios home screen"
git push origin main
```

Vercel otomatik deploy edecek (2-3 dakika).

---

### **Adım 5: Test Et**

#### **Android'de Test:**

1. Chrome'da aç: `https://jewelshot-final.vercel.app/`
2. Menu (⋮) → **"Add to Home Screen"**
3. Artık **💎 Jewelshot** logosu görünmeli!

#### **iOS'te Test:**

1. Safari'de aç: `https://jewelshot-final.vercel.app/`
2. Share buton (↑) → **"Add to Home Screen"**
3. Home screen'de **💎 Jewelshot** logosu görünmeli!

---

## 🎨 Logo'yu Özelleştirme

### **Option A: Emoji Değiştir**

`scripts/generate-icons.html` dosyasını düzenle:

```javascript
// Satır 48-50:
ctx.fillText('💎', size / 2, size / 2);

// Değiştir:
ctx.fillText('📷', size / 2, size / 2); // Kamera
ctx.fillText('✨', size / 2, size / 2); // Sparkle
ctx.fillText('💍', size / 2, size / 2); // Ring
```

### **Option B: Text Logo**

```javascript
// Emoji yerine text:
ctx.fillStyle = '#ffffff';
ctx.font = `bold ${size * 0.4}px Arial`;
ctx.fillText('JS', size / 2, size / 2); // Jewelshot
```

### **Option C: Renk Değiştir**

```javascript
// Satır 37-39: Gradient renkleri
gradient.addColorStop(0, '#9333ea'); // Purple → değiştir
gradient.addColorStop(1, '#7c3aed'); // Darker purple → değiştir

// Örnekler:
// Blue: #3b82f6 → #2563eb
// Green: #10b981 → #059669
// Red: #ef4444 → #dc2626
```

---

## 🚀 Profesyonel Logo (Opsiyonel)

Daha profesyonel bir logo istiyorsan:

### **Yöntem 1: Canva**

1. [Canva.com](https://canva.com) → Custom size: 512x512
2. Template seç veya tasarla
3. Export → PNG (512x512, 192x192, 180x180)

### **Yöntem 2: Figma**

1. [Figma.com](https://figma.com) → New file
2. 512x512 frame oluştur
3. Logo tasarla
4. Export → PNG (3 boyut)

### **Yöntem 3: Online Generator**

- [Favicon.io](https://favicon.io/) → Text-based logo
- [RealFaviconGenerator.net](https://realfavicongenerator.net/) → Full package

---

## 📱 Sonuç

✅ Artık uygulamanın:

- Android home screen'de logosu var
- iOS home screen'de logosu var
- Browser tab'da favicon'u var
- Splash screen'de logosu var

Kullanıcılar uygulamayı home screen'e eklediklerinde profesyonel bir logo görecekler! 🎉

---

## 🔧 Troubleshooting

### **Logo güncellenmedi?**

```bash
# Browser cache'i temizle:
# Chrome: Ctrl+Shift+Delete → Clear images and files
# Safari: Settings → Clear History and Website Data

# Veya incognito/private mode'da test et
```

### **Logo bulanık görünüyor?**

- 512x512 boyutunu kullandığından emin ol
- PNG formatında kaydettiğinden emin ol
- Compression'ı düşük tut (Canva'da: PNG, high quality)

### **iOS'ta logo görünmüyor?**

- `apple-touch-icon.png` dosyasının 180x180 olduğundan emin ol
- `layout.tsx`'de `icons.apple` ayarını kontrol et
- Safari cache'ini temizle

---

## ℹ️ Not

Bu guide, mevcut **PWA** (Progressive Web App) için icon eklemeyi anlatıyor.

**Native iOS/Android app** için:

- Capacitor kurulumu gerekir
- Xcode ve Android Studio gerekir
- Daha fazla bilgi için: `FLUTTER_VS_CAPACITOR.md`
