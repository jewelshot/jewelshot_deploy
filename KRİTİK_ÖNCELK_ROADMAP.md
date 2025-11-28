# 🚨 JEWELSHOT - KRİTİK ÖNCELİKLİ ROADMAP

**Tarih:** 28 Kasım 2025  
**Durum:** Bakım Modu  
**Hedef:** Production-Ready Enterprise App  

---

## 📊 IMPACT x URGENCY MATRİX

```
         │ URGENT (1-3 gün)    │ ÖNEMLI (1 hafta)   │ GELECEK (1+ hafta)
─────────┼──────────────────────┼─────────────────────┼──────────────────
CRITICAL │ 🔴 P0 (ŞİMDİ!)      │ 🟠 P1 (BU HAFTA)    │ 🟡 P2 (SONRA)
HIGH     │ 🟠 P1 (BU HAFTA)    │ 🟡 P2 (SONRA)       │ 🟢 P3 (OPTIONAL)
MEDIUM   │ 🟡 P2 (SONRA)       │ 🟢 P3 (OPTIONAL)    │ ⚪ P4 (MAYBE)
LOW      │ 🟢 P3 (OPTIONAL)    │ ⚪ P4 (MAYBE)       │ ⚪ P4 (MAYBE)
```

---

## 🔴 **P0: KRİTİK & ACİL (ŞİMDİ - 1-3 GÜN)**

### **1. FRONTEND - PRODUCTION DEBUG KODU TEMİZLİĞİ** 🔴🔴🔴

**SORUN:**
```tsx
// 45+ console.log in production!
console.log('🔥 CATALOGUE COMPONENT MOUNTING...');
console.log('🔥 FUCK ORDERING - JUST RETURN imagesWithUrls');
console.log('🔥 BYPASS ZUSTAND - Read directly from localStorage');

// Debug comments everywhere:
// SCREW THE ORDERING - JUST USE imagesWithUrls DIRECTLY
// CLEAR STALE CATALOGUE STORE
```

**ETKİ:**
- 🔴 **PROFESSIONALISM:** Müşteriler console'da debug görürse güven kaybı
- 🔴 **PERFORMANS:** Console.log pahalı (özellikle object logging)
- 🔴 **GÜVENLİK:** Sensitive data leak riski
- 🔴 **MEMORY:** Console'da object reference leak

**ÇÖZÜM:**
```bash
# 1. Console.log'ları bul ve değiştir
find src/components -name "*.tsx" -exec grep -l "console\." {} \;

# 2. Logger kullan
import { createScopedLogger } from '@/lib/logger';
const logger = createScopedLogger('Catalogue');

// Development'ta çalışır, production'da kapalı:
logger.debug('Component mounting');
logger.info('Loaded favorites:', count);

# 3. Debug yorumları sil
grep -r "🔥" src/components/
grep -r "FUCK" src/components/
grep -r "BYPASS" src/components/
```

**SÜRE:** 1 gün  
**ETKİ:** YÜKSEK (professionalism + performance)  
**RİSK:** DÜŞÜK (sadece cleanup)

---

### **2. FRONTEND - STATE MANAGEMENT UNIFICATION** 🔴🔴🔴

**SORUN:**
```tsx
// CatalogueContent.tsx
// ❌ İKİ TRUTH SOURCE!

// 1. Zustand store (kullanılmıyor)
const { favorites } = useImageMetadataStore();

// 2. Manuel localStorage (bypass)
const [favorites, setFavorites] = useState<FavoriteImage[]>([]);
useEffect(() => {
  const stored = localStorage.getItem('jewelshot-image-metadata');
  setFavorites(JSON.parse(stored));
}, []);

// ⚠️ SYNC SORUNU: Component A Zustand kullanıyor, B localStorage!
```

**ETKİ:**
- 🔴 **DATA INCONSISTENCY:** Farklı components farklı data görüyor
- 🔴 **RACE CONDITIONS:** Concurrent updates kaybolabilir
- 🔴 **BUGS:** Favoriler bazen kaybolur, bazen duplicate olur
- 🔴 **MAINTAINABILITY:** Hangi component ne kullanıyor bilinmiyor

**ÇÖZÜM:**
```tsx
// ✅ SADECE ZUSTAND KULLAN (persist middleware zaten var!)

// useImageMetadataStore.ts zaten persist yapıyor:
export const useImageMetadataStore = create()(
  persist(
    (set, get) => ({
      metadata: {},
      favorites: [],
      addToFavorites: (id) => { ... },
      removeFromFavorites: (id) => { ... },
    }),
    { name: 'jewelshot-image-metadata' } // ← localStorage key
  )
);

// ✅ TÜM COMPONENTS ZUSTAND KULLANSIN
export default function CatalogueContent() {
  // localStorage'a DOKUNMA!
  const { favorites, metadata, addToFavorites } = useImageMetadataStore();
  
  // Zustand otomatik sync yapıyor ✅
}
```

**AKSİYON PLAN:**
```bash
# 1. Zustand kullanan components:
grep -r "useImageMetadataStore" src/components/

# 2. localStorage kullanan components:
grep -r "localStorage.getItem.*image-metadata" src/components/

# 3. Her birini Zustand'a migrate et
- CatalogueContent.tsx
- GalleryContent.tsx
- İlgili diğerleri

# 4. localStorage manual access'leri sil
- Remove all localStorage.getItem('jewelshot-image-metadata')
- Remove all localStorage.setItem('jewelshot-image-metadata')
- Sadece Zustand persist'e bırak
```

**SÜRE:** 2 gün  
**ETKİ:** ÇOK YÜKSEK (data consistency critical!)  
**RİSK:** ORTA (test et, rollback hazır ol)

---

### **3. BACKEND - DUAL CREDIT SYSTEM TEMİZLİĞİ** 🔴🔴

**SORUN:**
```
# İKİ PARALEL KREDİ SİSTEMİ ÇALIŞIYOR!

ESKİ SİSTEM (deprecated):
  src/lib/credits.ts
  └─ deductUserCredit() → RPC: use_credit
  └─ refundUserCredit() → RPC: refund_credit
  └─ Atomic değil, reserve yok!

YENİ SİSTEM (doğru):
  src/lib/credit-manager.ts
  └─ reserveCredit() → RPC: reserve_credit
  └─ confirmCredit() → RPC: confirm_credit
  └─ refundCredit() → RPC: refund_credit
  └─ Atomic, transactional!

⚠️ KARMAŞIKLIK: Hangi endpoint hangisini kullanıyor?
```

**ETKİ:**
- 🔴 **CODE COMPLEXITY:** İki sistem maintain etmek zor
- 🟡 **BUGS:** Eski sistem refund yapmayabilir
- 🟡 **INCONSISTENCY:** Bazı işlemler eski, bazıları yeni

**ÇÖZÜM:**
```bash
# 1. Eski sistemi kullanan yerleri bul
grep -r "deductUserCredit\|refundUserCredit" src/

# 2. Yeni sisteme migrate et
# Her yerde: deductUserCredit → reserveCredit + confirmCredit

# 3. Eski dosyayı SİL
rm src/lib/credits.ts

# 4. Eski RPC functions'ları deprecate et (DB'de)
-- DROP FUNCTION IF EXISTS use_credit;
-- DROP FUNCTION IF EXISTS refund_credit;
-- (reserve_credit, confirm_credit, refund_credit kalsın)
```

**SÜRE:** 1 gün  
**ETKİ:** ORTA (code quality)  
**RİSK:** DÜŞÜK (yeni sistem zaten çalışıyor)

---

## 🟠 **P1: YÜKSEK ÖNCELİK (BU HAFTA - 3-7 GÜN)**

### **4. FRONTEND - MEGA COMPONENT REFACTORING** 🟠🟠🟠

**SORUN:**
```bash
Canvas.tsx:          2,049 satır  🔴 UNMAINTAINABLE!
GalleryContent.tsx:    987 satır  🔴
ImageViewer.tsx:       738 satır  🟡
MobileStudio.tsx:      641 satır  🟡
CatalogueContent.tsx:  548 satır  🟡
```

**ETKİ:**
- 🔴 **MAINTAINABILITY:** Kod okunamıyor, bug'lar gizleniyor
- 🔴 **PERFORMANCE:** Her state change → full re-render
- 🔴 **TESTING:** Unit test imkansız
- 🔴 **COLLABORATION:** Merge conflict nightmare

**ÇÖZÜM:**

#### **Canvas.tsx (2,049 → 300 satır)**

```
ÖNCE (2,049 satır):
Canvas.tsx
  ├─ 50+ useState
  ├─ 30+ useEffect
  ├─ 100+ handlers
  └─ 1,500 satır JSX

SONRA (300 satır):
Canvas.tsx (orchestrator)
  ├─ CanvasCore.tsx (200 satır)        // Viewport rendering
  ├─ CanvasToolbar.tsx (180 satır)     // Top controls
  ├─ CanvasFilters.tsx (250 satır)     // Edit panel
  ├─ CanvasHistory.tsx (120 satır)     // Undo/redo
  └─ CanvasModals.tsx (150 satır)      // Crop, keyboard help

+ Context API:
  CanvasContext
    ├─ state: { scale, position, transform, filters }
    └─ actions: { setScale, undo, redo, save }
```

**REFACTORİNG PLAN:**

```tsx
// 1. Context oluştur
// src/contexts/CanvasContext.tsx
export const CanvasContext = createContext();

export function CanvasProvider({ children }) {
  // Tüm state buraya
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // ...
  
  const value = {
    state: { scale, position, transform, filters },
    actions: { setScale, setPosition, undo, redo, save },
  };
  
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

// 2. Ana component sadece layout
// Canvas.tsx (300 satır)
export function Canvas() {
  return (
    <CanvasProvider>
      <CanvasCore />
      <CanvasToolbar />
      <CanvasFilters />
      <CanvasHistory />
    </CanvasProvider>
  );
}

// 3. Sub-components context kullanır
// CanvasToolbar.tsx (180 satır)
function CanvasToolbar() {
  const { state, actions } = useCanvas();
  // Clean, focused, testable!
}
```

**SÜRE:** 3-4 gün (Canvas + Gallery)  
**ETKİ:** ÇOK YÜKSEK (maintainability + performance)  
**RİSK:** ORTA (dikkatli test gerekli)

---

### **5. FRONTEND - ACCESSIBILITY (WCAG 2.1 AA)** 🟠🟠

**SORUN:**
```tsx
// ❌ ARIA labels yok
<button onClick={handleSave}>
  <SaveIcon />
</button>

// ❌ Keyboard navigation eksik
<div onClick={handleClick}>
  <img src={image} />
</div>

// ❌ Screen reader support yok
<Badge count={5} />

// Lighthouse Accessibility: 72/100 🔴
```

**ETKİ:**
- 🔴 **LEGAL RISK:** ADA/WCAG compliance gerekli (US/EU)
- 🔴 **USER EXCLUSION:** Görme engelliler kullanamıyor
- 🔴 **SEO:** Accessibility SEO'yu etkiliyor
- 🟡 **BRAND:** Inclusive design eksikliği

**ÇÖZÜM:**

```tsx
// ✅ ARIA labels ekle
<button
  onClick={handleSave}
  aria-label="Save image to gallery"
  aria-describedby="save-hint"
>
  <SaveIcon aria-hidden="true" />
</button>
<span id="save-hint" className="sr-only">
  Saves the current image with all applied filters
</span>

// ✅ Keyboard navigation
<div
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabIndex={0}
  aria-label="Select image"
>
  <img src={image} alt="Generated jewelry image" />
</div>

// ✅ Screen reader announcements
<Badge
  count={5}
  aria-label="5 new items"
  role="status"
  aria-live="polite"
/>

// ✅ Focus indicators
.focus-visible:focus {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}
```

**AKSİYON PLAN:**
```bash
# 1. Lighthouse audit
npm run lighthouse

# 2. axe DevTools scan
npm install -D @axe-core/react
# Test her sayfayı

# 3. Screen reader test
# VoiceOver (Mac): Cmd+F5
# NVDA (Windows): Free download

# 4. Keyboard navigation test
# Tab, Enter, Space, Arrow keys
# Tüm fonksiyonlar erişilebilir mi?

# 5. Color contrast check
# WCAG AA: 4.5:1 ratio minimum
```

**HEDEF:** Lighthouse Accessibility 90+  
**SÜRE:** 3 gün (tüm components)  
**ETKİ:** YÜKSEK (compliance + inclusivity)  
**RİSK:** DÜŞÜK (pure addition)

---

### **6. BACKEND - DATABASE TRANSACTIONS** 🟠🟠

**SORUN:**
```tsx
// ❌ RACE CONDITION RİSKİ
// Batch oluşturma - 2 ayrı query!

// 1. Batch oluştur
const { data: batch } = await supabase
  .from('batch_projects')
  .insert({ name, user_id })
  .single();

// 2. İmajları oluştur (AYRI QUERY!)
for (let i = 0; i < totalImages; i++) {
  await supabase
    .from('batch_images')
    .insert({ batch_id: batch.id, index: i });
}

// ⚠️ 1. başarılı, 2. fail olursa → orphan batch!
// ⚠️ Rollback yok!
```

**ETKİ:**
- 🟡 **DATA INTEGRITY:** Yarım batch kayıtları
- 🟡 **CLEANUP GEREKLІ:** Manuel temizlik
- 🟡 **USER EXPERIENCE:** Inconsistent state

**ÇÖZÜM:**

```sql
-- ✅ RPC FUNCTION (ATOMIC TRANSACTION)
CREATE OR REPLACE FUNCTION create_batch_with_images(
  p_name TEXT,
  p_user_id UUID,
  p_total_images INT,
  p_prompt TEXT DEFAULT NULL
) RETURNS TABLE(batch_id UUID, status TEXT) AS $$
DECLARE
  v_batch_id UUID;
BEGIN
  -- 1. Batch oluştur
  INSERT INTO batch_projects (user_id, name, total_images, prompt, status)
  VALUES (p_user_id, p_name, p_total_images, COALESCE(p_prompt, 'enhance'), 'pending')
  RETURNING id INTO v_batch_id;
  
  -- 2. İmajları oluştur (SAME TRANSACTION!)
  FOR i IN 1..p_total_images LOOP
    INSERT INTO batch_images (batch_id, image_index, status)
    VALUES (v_batch_id, i, 'pending');
  END LOOP;
  
  -- 3. Return
  RETURN QUERY
  SELECT v_batch_id, 'success'::TEXT;
  
  -- Hata olursa OTOMATIK ROLLBACK!
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Batch creation failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

```tsx
// ✅ API tarafında kullanım
const { data, error } = await supabase.rpc('create_batch_with_images', {
  p_name: name,
  p_user_id: userId,
  p_total_images: totalImages,
  p_prompt: prompt,
});

// Tek çağrı, atomic, rollback garantili!
```

**TRANSACTION GEREKLİ YERLER:**
- ✅ Batch creation (batch + images)
- ✅ Credit operations (zaten var - reserve/confirm)
- ✅ User registration (user + credits + preferences)
- ✅ Batch completion (update batch + create notification)

**SÜRE:** 2 gün (critical paths için)  
**ETKİ:** ORTA (data integrity)  
**RİSK:** DÜŞÜK (test et)

---

## 🟡 **P2: ORTA ÖNCELİK (1-2 HAFTA)**

### **7. FRONTEND - PERFORMANCE OPTIMIZATION** 🟡🟡

**SORUN:**
```tsx
// Canvas.tsx - Her scale değişiminde TÜM canvas re-render!
export function Canvas() {
  const [scale, setScale] = useState(1);
  
  return (
    <div>
      <TopBar /> {/* ❌ Re-render (gereksiz) */}
      <RightSidebar /> {/* ❌ Re-render (gereksiz) */}
      <BottomBar /> {/* ❌ Re-render (gereksiz) */}
      <ImageViewer scale={scale} /> {/* ✅ Re-render (gerekli) */}
    </div>
  );
}

// Profiler: 1 keystroke → 4x re-render!
```

**ÇÖZÜM:**

```tsx
// ✅ MEMOIZATION
const TopBar = React.memo(() => {
  // Sadece kendi props'u değişince render
});

const RightSidebar = React.memo(({ onGenerate }) => {
  // ...
});

// ✅ useCallback
const handleGenerate = useCallback((prompt) => {
  // Stable reference
}, [/* dependencies */]);

// ✅ useMemo
const filteredImages = useMemo(() => {
  return images.filter(img => img.favorite);
}, [images]); // Sadece images değişince recalculate

// ✅ CONTEXT SPLIT
// Canvas state → CanvasContext (canvas components only)
// UI state → UIContext (sidebar, topbar, etc.)
```

**HEDEF:**
- Lighthouse Performance: 78 → 90+
- LCP: 2.8s → <2.5s
- Re-renders: 4x → 1x

**SÜRE:** 3 gün  
**ETKİ:** ORTA (UX improvement)  
**RİSK:** DÜŞÜK

---

### **8. FRONTEND - IMAGE OPTIMIZATION** 🟡🟡

**SORUN:**
```tsx
// ❌ Full resolution images (10MB JPEG)
<img src={imageUrl} alt="..." />

// ❌ No lazy loading
// ❌ No WebP
// ❌ No responsive images
```

**ÇÖZÜM:**

```tsx
// ✅ NEXT.JS IMAGE
import Image from 'next/image';

<Image
  src={imageUrl}
  alt={alt}
  width={1200}
  height={800}
  quality={85}
  placeholder="blur"
  loading="lazy"
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// ✅ RESPONSIVE + WebP
<picture>
  <source
    srcSet="/thumb-small.webp 640w, /thumb-medium.webp 1024w"
    type="image/webp"
  />
  <img src="/thumb-large.jpg" alt={alt} />
</picture>

// ✅ VIRTUAL SCROLLING (Gallery)
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: images.length,
  getScrollElement: () => containerRef.current,
  estimateSize: () => 280, // image card height
});
```

**SÜRE:** 2 gün  
**ETKİ:** ORTA (performance + UX)  
**RİSK:** DÜŞÜK

---

### **9. TESTING COVERAGE** 🟡🟡

**SORUN:**
```
Current Coverage: ~60%
  Unit Tests: 243 passing (skipped: 17)
  E2E Tests: 0
  Component Tests: Minimal
```

**HEDEF:**
```
Target Coverage: 80%+
  Unit Tests: Critical paths (credit, queue, batch)
  Component Tests: All organisms + molecules
  E2E Tests: User flows (signup → studio → generate)
```

**PLAN:**

```bash
# 1. Component tests (React Testing Library)
src/components/atoms/__tests__/
src/components/molecules/__tests__/
src/components/organisms/__tests__/

# 2. E2E tests (Playwright)
tests/e2e/
  ├─ auth.spec.ts (signup, login, logout)
  ├─ studio.spec.ts (upload, generate, save)
  ├─ gallery.spec.ts (view, favorite, download)
  └─ batch.spec.ts (create, upload, process)

# 3. Visual regression (Chromatic)
npm install --save-dev chromatic
# Screenshot her component, diff detect
```

**SÜRE:** 1 hafta  
**ETKİ:** ORTA (quality assurance)  
**RİSK:** DÜŞÜK

---

## 🟢 **P3: DÜŞÜK ÖNCELİK (OPTIONAL)**

### **10. BACKEND - API VERSIONING** 🟢

```
/api/v1/ai/submit
/api/v1/credits/balance
/api/v2/ai/submit (new features)

# Breaking change'ler için versioning
```

**SÜRE:** 2 gün  
**ETKİ:** DÜŞÜK (future-proofing)

---

### **11. FRONTEND - ERROR BOUNDARIES** 🟢

```tsx
// Her major component wrap et
<ErrorBoundary fallback={<GalleryFallback />}>
  <GalleryContent />
</ErrorBoundary>
```

**SÜRE:** 1 gün  
**ETKİ:** DÜŞÜK (edge case handling)

---

### **12. MONITORING & OBSERVABILITY** 🟢

```bash
# APM (Application Performance Monitoring)
- Vercel Analytics (zaten var)
- Sentry Performance (ekle)

# Logging
- Structured logs → Datadog/Logflare
- Error tracking → Sentry (zaten var)
- Uptime monitoring → UptimeRobot (zaten var)
```

**SÜRE:** 2 gün  
**ETKİ:** DÜŞÜK (nice to have)

---

## 📅 EXECUTION TIMELINE

### **HAFTA 1: KRİTİK CLEANUP (P0)**

```
GÜN 1: Console.log temizliği + Debug yorumları
  └─ 45+ console.log → logger
  └─ Debug comments sil
  └─ Test + deploy

GÜN 2-3: State management unification
  └─ Zustand only (no localStorage bypass)
  └─ CatalogueContent.tsx refactor
  └─ GalleryContent.tsx refactor
  └─ Test + deploy

GÜN 4: Backend dual system cleanup
  └─ credits.ts → credit-manager.ts migrate
  └─ Remove old system
  └─ Test + deploy

GÜN 5: Buffer (test, bug fixes)
```

### **HAFTA 2: YÜKSEK ÖNCELİK (P1) - PART 1**

```
GÜN 1-3: Canvas component refactoring
  └─ Canvas.tsx → 6 sub-components
  └─ Context API
  └─ Test + deploy

GÜN 4-5: GalleryContent refactoring
  └─ GalleryContent.tsx → 4 sub-components
  └─ Context API
  └─ Test + deploy
```

### **HAFTA 3: YÜKSEK ÖNCELİK (P1) - PART 2**

```
GÜN 1-3: Accessibility (WCAG 2.1 AA)
  └─ ARIA labels (all components)
  └─ Keyboard navigation
  └─ Screen reader test
  └─ Color contrast fixes
  └─ Lighthouse 90+ target

GÜN 4-5: Database transactions
  └─ RPC functions (batch, user reg)
  └─ Test + deploy
```

### **HAFTA 4: ORTA ÖNCELİK (P2)**

```
GÜN 1-3: Performance optimization
  └─ React.memo
  └─ useCallback/useMemo
  └─ Bundle size optimization
  └─ Image lazy loading

GÜN 4-5: Testing coverage
  └─ Component tests
  └─ E2E setup (Playwright)
```

---

## 📊 SONUÇ: LAYER BY LAYER PRİORİTY

### **🥇 EN KRİTİK: FRONTEND CODE QUALITY**

```
SORUN: Production debug kodu, state chaos
ETKI: Professionalism, data consistency, bugs
SÜRE: 3 gün
RİSK: Düşük
ROI:  ⭐⭐⭐⭐⭐

ACTIONS:
  ✅ Console.log temizliği (1 gün)
  ✅ State unification (2 gün)
```

### **🥈 İKİNCİ KRİTİK: FRONTEND ARCHITECTURE**

```
SORUN: Mega-components (2,000+ satır)
ETKI: Maintainability, performance, testing
SÜRE: 1 hafta
RİSK: Orta
ROI:  ⭐⭐⭐⭐

ACTIONS:
  ✅ Canvas refactoring (3 gün)
  ✅ Gallery refactoring (2 gün)
  ✅ Context API (2 gün)
```

### **🥉 ÜÇÜNCÜ KRİTİK: ACCESSIBILITY**

```
SORUN: WCAG compliance fail, ARIA eksik
ETKI: Legal risk, user exclusion, SEO
SÜRE: 3 gün
RİSK: Düşük
ROI:  ⭐⭐⭐⭐

ACTIONS:
  ✅ ARIA labels (1 gün)
  ✅ Keyboard nav (1 gün)
  ✅ Screen reader test (1 gün)
```

### **4. BACKEND CODE QUALITY**

```
SORUN: Dual credit system, transaction eksik
ETKI: Code complexity, data integrity
SÜRE: 3 gün
RİSK: Düşük
ROI:  ⭐⭐⭐

ACTIONS:
  ✅ Credit system cleanup (1 gün)
  ✅ Database transactions (2 gün)
```

### **5. PERFORMANCE**

```
SORUN: Re-renders, bundle size, image optimization
ETKI: UX, loading time
SÜRE: 5 gün
RİSK: Düşük
ROI:  ⭐⭐⭐

ACTIONS:
  ✅ Memoization (2 gün)
  ✅ Image optimization (2 gün)
  ✅ Bundle optimization (1 gün)
```

### **6. TESTING**

```
SORUN: Coverage 60%, no E2E
ETKI: Quality assurance
SÜRE: 1 hafta
RİSK: Düşük
ROI:  ⭐⭐

ACTIONS:
  ✅ Component tests (3 gün)
  ✅ E2E setup (2 gün)
  ✅ Visual regression (2 gün)
```

---

## 🎯 ÖNERİ: 4 HAFTALIK SPRINT

```
📅 HAFTA 1 (P0):
  └─ Frontend cleanup (console.log, state, debug)
  └─ Backend cleanup (dual system)
  └─ DEPLOY: Clean production code ✅

📅 HAFTA 2 (P1 - Part 1):
  └─ Canvas refactoring
  └─ Gallery refactoring
  └─ DEPLOY: Maintainable components ✅

📅 HAFTA 3 (P1 - Part 2):
  └─ Accessibility (WCAG 2.1 AA)
  └─ Database transactions
  └─ DEPLOY: Compliant & safe ✅

📅 HAFTA 4 (P2):
  └─ Performance optimization
  └─ Testing coverage
  └─ DEPLOY: Fast & tested ✅
```

**SONUÇ:**
- 4 hafta sonra: **PRODUCTION-READY ENTERPRISE APP** ✅
- Code quality: 5/10 → 8/10
- Performance: 78 → 90+
- Accessibility: 72 → 90+
- Maintainability: ⭐⭐ → ⭐⭐⭐⭐

---

**Son Güncelleme:** 28 Kasım 2025  
**Durum:** Bakım planı hazır, execution başlayabilir!


