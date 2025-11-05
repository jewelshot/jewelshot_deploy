# 🎨 Asset Oluşturma Komutları

## Hızlı Placeholder Oluştur

### Yöntem 1: Online Tool (En Hızlı - 30 saniye)

**OG Image:**

```
1. Tarayıcıda aç: https://placehold.co/1200x630/9333ea/ffffff?text=Jewelshot+%E2%9C%A8&font=montserrat
2. Sağ tık → "Save image as..."
3. Kaydet: og-image.jpg
4. Taşı: /Users/yasin/Desktop/vortex/jewelshot/public/og-image.jpg
```

**Apple Touch Icon:**

```
1. Tarayıcıda aç: https://placehold.co/180x180/9333ea/ffffff?text=%E2%9C%A8&font=montserrat
2. Sağ tık → "Save image as..."
3. Kaydet: apple-touch-icon.png
4. Taşı: /Users/yasin/Desktop/vortex/jewelshot/public/apple-touch-icon.png
```

### Yöntem 2: ImageMagick (Terminal)

Eğer ImageMagick yüklüyse:

```bash
cd /Users/yasin/Desktop/vortex/jewelshot/public

# OG Image
convert -size 1200x630 gradient:#1a0a2e-#9333ea \
  -gravity center \
  -pointsize 80 -fill white -annotate +0-50 "✨ Jewelshot" \
  -pointsize 40 -fill "#d1d5db" -annotate +0+50 "AI-Powered Image Editing" \
  og-image.jpg

# Apple Touch Icon
convert -size 180x180 gradient:#9333ea-#6b21a8 \
  -gravity center \
  -pointsize 100 -fill white -annotate +0+0 "✨" \
  apple-touch-icon.png
```

### Yöntem 3: Online Generator (Canva benzeri)

**Logoipsum** (Hızlı logo generator):

1. https://logoipsum.com
2. İstediğin logoyu seç
3. Download → PNG
4. Online resize: https://imageresizer.com
   - OG: 1200x630px
   - Apple: 180x180px

---

## ✅ Sonuç Kontrol

```bash
cd /Users/yasin/Desktop/vortex/jewelshot/public
ls -lh *.jpg *.png

# Olmalı:
# og-image.jpg (1200x630px)
# apple-touch-icon.png (180x180px)
```

---

## 🚀 Git'e Ekle

```bash
cd /Users/yasin/Desktop/vortex/jewelshot
git add public/og-image.jpg public/apple-touch-icon.png
git commit -m "feat: add og image and apple touch icon for seo"
```

---

## 💡 Daha İyi Asset İstersen

Daha sonra profesyonel tasarım ile değiştirebilirsin:

- Canva Pro
- Figma
- Professional designer
- AI tools (Midjourney, DALL-E)

Ama şimdilik placeholder yeterli! 🎉
