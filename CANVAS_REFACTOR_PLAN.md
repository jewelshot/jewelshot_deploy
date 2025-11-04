# 🎯 Canvas.tsx Refactor Plan

## Current State
- **File:** `src/components/organisms/Canvas.tsx`
- **Lines:** 1,130
- **Hooks Used:** 20+
- **State Variables:** 50+
- **Props:** Minimal (good!)
- **Dependencies:** 13 custom hooks, 34 components

---

## Analysis

### Logical Sections (Current Canvas.tsx)

```
1. IMPORTS & SETUP (lines 1-38)
   - 13 hooks
   - 12 molecules
   - 4 atoms
   - 7 organisms

2. STATE MANAGEMENT (lines 39-134)
   - Sidebar store
   - Image state (useImageState)
   - Transform state (useImageTransform)
   - Filter state (useImageFilters)
   - UI state (useCanvasUI)
   - Toast (useToast)
   - AI Edit (useImageEdit)
   - Canvas handlers (useCanvasHandlers)
   - Keyboard shortcuts (useKeyboardShortcuts)
   - Local state (10+ useState)

3. AI GENERATION LOGIC (lines 135-180)
   - useImageEdit hook
   - onSuccess callback (with auto-save!)
   - onError callback
   - Preset generation handler

4. KEYBOARD SHORTCUTS SETUP (lines 181-250)
   - 15+ shortcuts
   - Fullscreen toggle
   - Sidebar toggles
   - Zoom controls
   - etc.

5. CROP MODAL LOGIC (lines 251-300)
   - Crop state
   - Apply crop
   - Cancel crop

6. UI TOGGLE LOGIC (lines 301-350)
   - Hide/show UI
   - Auto-hide timeout
   - Mouse move tracking

7. VIEW MODE LOGIC (lines 351-400)
   - Original/Edited/Comparison
   - Zoom adjustments

8. AI EDIT EVENT LISTENERS (lines 401-450)
   - Window event listeners
   - AI edit generate events

9. FULLSCREEN LOGIC (lines 451-500)
   - Enter/exit fullscreen
   - Keyboard F key

10. SEARCH PARAMS SYNC (lines 501-550)
    - URL params → state
    - Preset loading

11. CANVAS RENDER LOGIC (lines 551-800)
    - Image rendering
    - Filter application
    - Transform application

12. JSX STRUCTURE (lines 801-1130)
    - Layout
    - Panels
    - Modals
    - Controls
```

---

## Refactor Strategy

### 🎯 Target Architecture

```
Canvas.tsx (Main Orchestrator - 250 lines)
  ├── CanvasCore.tsx (Rendering Engine - 200 lines)
  ├── CanvasControls.tsx (UI Controls - 200 lines)
  ├── AIEditManager.tsx (AI Logic - 200 lines)
  └── CanvasModals.tsx (Modals & Overlays - 200 lines)
```

### Breakdown

#### 1. **Canvas.tsx** (Main Orchestrator - 250 lines)
**Responsibility:** High-level coordination, layout, state orchestration

**Contains:**
- Imports & setup
- Main state (via hooks)
- Top-level event handlers
- Layout JSX (panels arrangement)
- Child component composition

**Props it passes down:**
```typescript
// To CanvasCore
coreProps = {
  uploadedImage,
  originalImage,
  isAIImageLoading,
  viewMode,
  scale,
  position,
  transform,
  adjustFilters,
  colorFilters,
  filterEffects,
  background,
  cropRatio,
  // ... etc
}

// To CanvasControls
controlsProps = {
  scale, setScale,
  onZoomIn, onZoomOut, onResetZoom,
  onRotateLeft, onRotateRight,
  onFlipH, onFlipV,
  // ... etc
}

// To AIEditManager
aiProps = {
  uploadedImage,
  fileName,
  onAIEditComplete,
  onAIEditError,
  // ... etc
}

// To CanvasModals
modalsProps = {
  isCropping,
  cropRatio,
  onCropApply,
  onCropCancel,
  showShortcutsModal,
  // ... etc
}
```

---

#### 2. **CanvasCore.tsx** (Rendering Engine - 200 lines)
**Responsibility:** Image rendering, filters, transforms

**Contains:**
- Canvas ref
- Image rendering logic
- Filter application
- Transform application
- View mode rendering (original/edited/comparison)

**Props:**
```typescript
interface CanvasCoreProps {
  uploadedImage: string | null;
  originalImage: string | null;
  isAIImageLoading: boolean;
  viewMode: 'original' | 'edited' | 'comparison';
  scale: number;
  position: { x: number; y: number };
  transform: Transform;
  adjustFilters: AdjustFilters;
  colorFilters: ColorFilters;
  filterEffects: FilterEffects;
  background: string;
  cropRatio: string | null;
  // ... render-specific props
}
```

**Extracted Components:**
- `ImageViewer` (already exists)
- `LoadingState` (already exists)
- `AILoadingOverlay` (already exists)

---

#### 3. **CanvasControls.tsx** (UI Controls - 200 lines)
**Responsibility:** All UI controls (zoom, rotate, etc.)

**Contains:**
- Zoom controls
- Rotation controls
- Flip controls
- Background selector
- View mode selector
- Top/bottom controls
- Keyboard shortcuts setup

**Props:**
```typescript
interface CanvasControlsProps {
  // Zoom
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  
  // Transform
  transform: Transform;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  
  // Background
  background: string;
  onBackgroundChange: (bg: string) => void;
  
  // View mode
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  
  // UI visibility
  isFullscreen: boolean;
  uiVisible: boolean;
  
  // Actions
  onSave: () => void;
  onDownload: () => void;
  onReset: () => void;
  onShare: () => void;
}
```

**Extracted Components:**
- `ZoomControls` (already exists)
- `ActionControls` (already exists)
- `BackgroundSelector` (already exists)
- `ViewModeSelector` (already exists)
- `TopLeftControls` (already exists)
- `BottomRightControls` (already exists)

---

#### 4. **AIEditManager.tsx** (AI Logic - 200 lines)
**Responsibility:** AI generation, editing, preset handling

**Contains:**
- useImageEdit hook
- Preset generation logic
- AI success/error handlers
- Auto-save to gallery
- AI edit event listeners

**Props:**
```typescript
interface AIEditManagerProps {
  uploadedImage: string | null;
  fileName: string;
  originalImage: string | null;
  onImageUpdate: (imageUrl: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}
```

**Internal Logic:**
- `useImageEdit()` hook
- `editWithAI()` function
- Auto-save after successful generation
- Gallery sync event dispatch

---

#### 5. **CanvasModals.tsx** (Modals & Overlays - 200 lines)
**Responsibility:** All modals, overlays, dialogs

**Contains:**
- Crop modal
- Keyboard shortcuts modal
- Fullscreen logic
- UI hide/show logic
- Empty state

**Props:**
```typescript
interface CanvasModalsProps {
  // Crop
  isCropping: boolean;
  cropRatio: string | null;
  uploadedImage: string | null;
  onCropApply: (croppedImage: string) => void;
  onCropCancel: () => void;
  
  // Keyboard shortcuts
  showShortcutsModal: boolean;
  onCloseShortcuts: () => void;
  
  // Fullscreen
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  
  // Empty state
  hasImage: boolean;
  onFileSelect: (file: File) => void;
}
```

**Extracted Components:**
- `CropModal` (already exists)
- `KeyboardShortcutsModal` (already exists)
- `EmptyState` (already exists)
- `AILoadingOverlay` (already exists)

---

## Implementation Steps

### Phase 1: Create New Components (No Breaking Changes)
1. ✅ Create `CanvasCore.tsx` (copy relevant code)
2. ✅ Create `CanvasControls.tsx` (copy relevant code)
3. ✅ Create `AIEditManager.tsx` (copy relevant code)
4. ✅ Create `CanvasModals.tsx` (copy relevant code)
5. ✅ Ensure each compiles independently

### Phase 2: Update Canvas.tsx to Use New Components
1. ✅ Import new components
2. ✅ Replace JSX sections with new components
3. ✅ Pass props correctly
4. ✅ Test thoroughly

### Phase 3: Cleanup
1. ✅ Remove unused code from Canvas.tsx
2. ✅ Add proper TypeScript types
3. ✅ Add JSDoc comments
4. ✅ Run tests
5. ✅ Build and verify

---

## Safety Measures

### Before Starting:
- ✅ Create git checkpoint (already done: `pre-refactoring-checkpoint`)
- ✅ Run all tests (check current state)
- ✅ Take note of all props/state

### During Refactor:
- ✅ Build after each file creation
- ✅ No changes to hook logic (just move code)
- ✅ Preserve all prop names
- ✅ Keep all event handlers

### After Refactor:
- ✅ Full build
- ✅ Run all tests
- ✅ Manual UI testing
- ✅ Compare screenshots (before/after)

---

## Risk Assessment

### Low Risk:
- Moving JSX to new components
- Extracting props interfaces
- Adding TypeScript types

### Medium Risk:
- Callback prop drilling
- State synchronization
- Event handler references

### High Risk:
- Changing hook dependencies
- Modifying useEffect logic
- Breaking memoization

---

## Expected Benefits

### Before:
```
Canvas.tsx: 1,130 lines
- Maintainability: 2/10
- Testability: 1/10
- Readability: 3/10
```

### After:
```
Canvas.tsx: ~250 lines (Orchestrator)
CanvasCore.tsx: ~200 lines (Rendering)
CanvasControls.tsx: ~200 lines (Controls)
AIEditManager.tsx: ~200 lines (AI Logic)
CanvasModals.tsx: ~200 lines (Modals)

Total: ~1,050 lines (80 lines saved from cleanup)

- Maintainability: 8/10 ↑
- Testability: 7/10 ↑
- Readability: 9/10 ↑
```

---

## Timeline

- **Analysis:** 30 minutes (✅ Done)
- **Phase 1:** 2-3 hours
- **Phase 2:** 1-2 hours
- **Phase 3:** 1 hour
- **Testing:** 1 hour

**Total:** ~6-7 hours (1 work day)

