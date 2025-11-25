# 📋 CATALOGUE SYSTEM - MASTER PLAN

## 🎯 GENEL BAKIŞ

Kullanıcılar favorilerine ekledikleri görselleri, metadata bilgileri ile birlikte özelleştirilebilir PDF katalog olarak export edebilecek.

---

## 📊 ANA BÖLÜMLER

### 1. CATALOGUE PAGE STRUCTURE

- Sol navigasyon paneli (collapsable)
- Ana içerik alanı
- Önizleme paneli
- Ayarlar paneli

### 2. DATA SOURCE

- Kullanıcının favorite images (1-12 arası)
- Favori sırasına göre otomatik sıralama
- Her görsel için metadata bilgileri

### 3. USER SETTINGS

- Metadata field seçimi
- Sayfa düzeni (layout)
- Sayfa başına görsel sayısı
- Ön/arka kapak
- İletişim bilgileri
- Kenar boşlukları
- Sayfa numaraları

### 4. PDF GENERATION

- Client-side PDF oluşturma
- Özelleştirilebilir template
- Export butonu

---

## 🎨 PHASE BREAKDOWN

### ✅ PHASE 0: Planning & Setup (CURRENT)

- [ ] Master plan oluşturma
- [ ] Teknoloji seçimi (PDF library)
- [ ] Dosya yapısı planlama
- [ ] Store yapısı tasarlama

---

### 📦 PHASE 1: Basic Page Structure

**Hedef:** Catalogue sayfası iskelet yapısı

**Tasks:**

1. Create `/app/catalogue/page.tsx`
2. Add Sidebar integration (collapsable)
3. Create `CatalogueContent.tsx` main component
4. Add navigation link to Sidebar
5. Basic layout with responsive design

**Dosyalar:**

- `src/app/catalogue/page.tsx`
- `src/components/organisms/CatalogueContent.tsx`

---

### 📦 PHASE 2: Data Loading

**Hedef:** Favorite images ve metadata yükleme

**Tasks:**

1. Connect to `useImageMetadataStore`
2. Load favorite images (with order)
3. Load metadata for each favorite
4. Display image grid with metadata
5. Handle empty state

**Bağımlılıklar:**

- `useImageMetadataStore`
- `image_metadata` table
- `favorite_images` table

---

### 📦 PHASE 3: Drag & Drop Reordering

**Hedef:** Görsel sıralama değiştirme

**Tasks:**

1. Install `@dnd-kit` or `react-beautiful-dnd`
2. Implement drag handles
3. Update order on drop
4. Sync to Supabase
5. Visual feedback during drag

**Library Seçimi:**

- Option 1: `@dnd-kit/core` (modern, hafif)
- Option 2: `react-beautiful-dnd` (proven)

---

### 📦 PHASE 4: Settings Panel

**Hedef:** PDF ayarları UI

**Tasks:**

1. Create `CatalogueSettings.tsx` component
2. Metadata fields selector (checkboxes)
3. Layout selector (grid options)
4. Images per page (1, 2, 4, 6, 8, 12)
5. Cover settings (upload/text)
6. Contact info form
7. Margin controls (top, bottom, left, right)
8. Page numbers toggle

**Settings Store:**

```typescript
interface CatalogueSettings {
  selectedFields: string[];
  layout: 'grid' | 'list' | 'magazine';
  imagesPerPage: 1 | 2 | 4 | 6 | 8 | 12;
  coverFront?: {
    type: 'image' | 'text';
    content: string;
  };
  coverBack?: {
    type: 'image' | 'text';
    content: string;
  };
  contactInfo: {
    company?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
  };
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  showPageNumbers: boolean;
}
```

---

### 📦 PHASE 5: Preview Mode

**Hedef:** PDF önizleme

**Tasks:**

1. Create `CataloguePreview.tsx` component
2. Render pages with current settings
3. Show cover pages
4. Show product pages
5. Paginated view
6. Zoom controls

---

### 📦 PHASE 6: PDF Generation

**Hedef:** PDF export

**Tasks:**

1. Choose PDF library:
   - Option 1: `jsPDF` + `html2canvas` (simple)
   - Option 2: `@react-pdf/renderer` (React-based)
   - Option 3: `pdfmake` (configuration-based)
2. Implement PDF template
3. Add metadata fields
4. Add cover pages
5. Add page numbers
6. Add contact info
7. Export button with loading state
8. Download as file

**Önerilen:** `@react-pdf/renderer` (React components → PDF)

---

### 📦 PHASE 7: Polish & UX

**Hedef:** Son rötuşlar

**Tasks:**

1. Loading states
2. Error handling
3. Success toast
4. Save settings to localStorage
5. Keyboard shortcuts
6. Mobile warning (PDF best on desktop)
7. Tutorial/onboarding

---

## 🛠 TEKNIK STACK

### PDF Generation Library

**Öneri:** `@react-pdf/renderer`

```bash
npm install @react-pdf/renderer
```

**Avantajlar:**

- ✅ React component syntax
- ✅ Flexbox layout
- ✅ Font support
- ✅ Image embedding
- ✅ TypeScript support

### Drag & Drop

**Öneri:** `@dnd-kit/core`

```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

### State Management

**Mevcut:** Zustand

- Create `catalogueStore.ts`

---

## 📐 UI LAYOUT

```
┌─────────────────────────────────────────────────────┐
│  TopBar                                              │
├───────┬─────────────────────────────────────────────┤
│       │                                              │
│ Side  │  CatalogueContent                           │
│ bar   │  ┌──────────────────────────────────────┐  │
│       │  │ Favorite Images (Draggable)          │  │
│ (260) │  │ ┌───┐ ┌───┐ ┌───┐                   │  │
│       │  │ │ 1 │ │ 2 │ │ 3 │  ...              │  │
│       │  │ └───┘ └───┘ └───┘                   │  │
│       │  │                                       │  │
│       │  │ Settings Panel                       │  │
│       │  │ ✓ File Name  ✓ Price                │  │
│       │  │ ✓ Carat      ✓ SKU                  │  │
│       │  │ Layout: [Grid ▼]                    │  │
│       │  │ Per Page: [4 ▼]                     │  │
│       │  │                                       │  │
│       │  │ [Preview PDF]  [Export PDF]         │  │
│       │  └──────────────────────────────────────┘  │
│       │                                              │
├───────┴─────────────────────────────────────────────┤
│  BottomBar                                          │
└─────────────────────────────────────────────────────┘
```

---

## 📋 METADATA FIELDS (Seçilebilir)

Kullanıcı hangilerini göstermek istediğini seçebilir:

- [ ] File Name
- [ ] Carat (CT)
- [ ] Color
- [ ] Clarity
- [ ] Setting/Ayar
- [ ] Weight (Gram)
- [ ] Price
- [ ] SKU
- [ ] Description
- [ ] Notes

---

## 📄 PDF LAYOUT OPTIONS

### Layout Types

1. **Grid Layout**: 2x2, 3x2, 2x3 grid
2. **List Layout**: Single column with large images
3. **Magazine Layout**: Mixed sizes, editorial style

### Images Per Page

- 1 (full page)
- 2 (half page each)
- 4 (quarter page each)
- 6 (2x3 grid)
- 8 (2x4 or 4x2 grid)
- 12 (3x4 grid)

---

## 🎨 DESIGN PRINCIPLES

### Consistent with App

- Same color scheme (minimal, white/20)
- Same fonts
- Same transitions (800ms cubic-bezier)
- Sidebar sync

### PDF Design

- Professional look
- High-quality image rendering
- Clear metadata display
- Clean typography
- White background (print-friendly)

---

## 📊 IMPLEMENTATION ORDER

1. ✅ **Phase 0:** Planning (CURRENT)
2. 🔄 **Phase 1:** Basic Page Structure
3. ⏳ **Phase 2:** Data Loading
4. ⏳ **Phase 3:** Drag & Drop
5. ⏳ **Phase 4:** Settings Panel
6. ⏳ **Phase 5:** Preview Mode
7. ⏳ **Phase 6:** PDF Generation
8. ⏳ **Phase 7:** Polish & UX

**Tahmini Süre:** 8-12 commits (her phase 1-2 commit)

---

## 🚀 FIRST STEPS

1. Install PDF library
2. Create basic page structure
3. Add to Sidebar navigation
4. Load favorite images
5. Display in draggable grid

---

**Status:** 📝 Planning Complete - Ready to Start Phase 1
**Next:** Create `/app/catalogue/page.tsx` and basic structure
