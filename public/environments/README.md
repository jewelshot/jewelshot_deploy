# Environment Maps for 3D Viewer

HDR ve EXR ortam haritası dosyalarınızı bu klasöre ekleyin.
Dosyalar otomatik olarak 3D görüntüleyicideki "Özel" sekmesinde listelenecektir.

## Desteklenen Formatlar

- `.hdr` - Radiance HDR formatı
- `.exr` - OpenEXR formatı (yüksek kalite için önerilir)

## Önerilen Özellikler

| Özellik | Öneri |
|---------|-------|
| Çözünürlük | 2048x1024 (2K) veya 4096x2048 (4K) |
| Format | Equirectangular (küresel) |
| Dinamik Aralık | HDR (Yüksek Dinamik Aralık) |
| Dosya Boyutu | Optimal yükleme için < 10MB |

## Kullanım

1. HDR veya EXR dosyanızı bu klasöre sürükleyip bırakın
2. 3D görüntüleyiciye gidin
3. Environment Picker'da "Özel" sekmesine tıklayın
4. Dosyanız listede görünecektir
5. "Yenile" butonuna tıklayarak listeyi güncelleyebilirsiniz

## Mücevher için Önerilen Ortam Türleri

1. **Stüdyo Aydınlatması** - Ürün çekimleri için temiz, kontrollü ışık
2. **Altın Saat** - Sıcak, gün batımı benzeri aydınlatma
3. **Bulutlu Gökyüzü** - Yumuşak, dağınık aydınlatma
4. **Lüks İç Mekan** - Sıcak tonlarda iç mekan aydınlatması
5. **Nötr Gri** - Doğru malzeme görselleştirmesi için

## Ücretsiz HDR Kaynakları

- [Poly Haven](https://polyhaven.com/hdris) - Ücretsiz HDRI'lar
- [HDRIHaven](https://hdri-haven.com/) - Ücretsiz HDR görüntüler
- [sIBL Archive](http://www.hdrlabs.com/sibl/archive.html) - Ücretsiz HDRI'lar

## Mevcut Dosyalar

Bu klasöre eklediğiniz dosyalar aşağıda otomatik olarak listelenecektir.

---

**Not:** Dosya adları otomatik olarak gösterim adına dönüştürülür.
Örnek: `studio_warm_light.hdr` → "Studio Warm Light"
