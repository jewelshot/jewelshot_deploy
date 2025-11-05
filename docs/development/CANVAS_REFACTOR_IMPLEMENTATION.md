# 🚀 Canvas.tsx Refactor - Implementation Guide

**Status:** Phase 1.1 Complete (CanvasCore.tsx ✅)

---

## Progress Tracker

```
[✅] Phase 1.1: CanvasCore.tsx (320 lines) - DONE
[ ] Phase 1.2: CanvasControls.tsx (~200 lines)
[ ] Phase 1.3: AIEditManager.tsx (~200 lines)
[ ] Phase 1.4: CanvasModals.tsx (~200 lines)
[ ] Phase 2: Update Canvas.tsx to use new components
[ ] Phase 3: Cleanup, test, verify
```

**Estimated Time Remaining:** 5-6 hours

---

## ✅ Completed: CanvasCore.tsx

### What Was Done:

1. **Created:** `src/components/organisms/canvas/CanvasCore.tsx`
2. **Exported Types:** Position, Transform, AdjustFilters, ColorFilters, FilterEffects
3. **Functionality:**
   - Single image view
   - Side-by-side comparison view
   - Filter & transform rendering
   - Zoom & pan
   - Loading & empty states
   - Smart padding calculations

### Props Interface:

```typescript
interface CanvasCoreProps {
  // Image state
  uploadedImage: string | null;
  originalImage: string | null;
  isLoading: boolean;

  // AI state
  isAIEditing: boolean;
  isAIImageLoading: boolean;
  aiProgress: string;

  // View mode
  viewMode: 'normal' | 'sideBySide';
  activeImage: 'left' | 'right';
  onActiveImageChange: (side: 'left' | 'right') => void;

  // Transform & filters
  scale: number;
  position: { x: number; y: number };
  onScaleChange: (scale: number) => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
  transform: Transform;
  adjustFilters: AdjustFilters;
  colorFilters: ColorFilters;
  filterEffects: FilterEffects;

  // Background & UI
  background: 'none' | 'black' | 'gray' | 'white' | 'alpha';
  canvasControlsVisible: boolean;
  isPromptExpanded: boolean;

  // Sidebar state
  leftOpen: boolean;
  rightOpen: boolean;
  topOpen: boolean;
  bottomOpen: boolean;

  // Event handlers
  onImageLoad: () => void;
  onImageError: () => void;
  onUploadClick: () => void;
}
```

---

## ⏳ TODO: Phase 1.2 - CanvasControls.tsx

### Responsibility:

All UI controls (zoom, rotate, background, view mode, actions)

### What to Extract from Canvas.tsx:

- Lines ~900-1050: ZoomControls, ActionControls, TopLeftControls, BottomRightControls
- Keyboard shortcuts setup (lines 400-616)
- Background selector logic
- View mode selector logic

### Props Interface:

```typescript
interface CanvasControlsProps {
  // Image state (for conditional rendering)
  hasImage: boolean;
  fileName: string;

  // Zoom controls
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;

  // Transform controls
  transform: Transform;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  onResetTransform: () => void;

  // Background selector
  background: string;
  onBackgroundChange: (bg: string) => void;

  // View mode
  viewMode: 'normal' | 'sideBySide';
  onViewModeChange: (mode: 'normal' | 'sideBySide') => void;

  // Actions
  onSave: () => void;
  onDownload: () => void;
  onReset: () => void;
  onShare: () => void;
  onUndo: () => void;
  onRedo: () => void;

  // UI visibility
  isFullscreen: boolean;
  controlsVisible: boolean;
  onToggleUI: () => void;
  onToggleShortcuts: () => void;

  // Sidebars
  leftOpen: boolean;
  rightOpen: boolean;
  topOpen: boolean;
  bottomOpen: boolean;
}
```

### Component Structure:

```typescript
'use client';

import React from 'react';
import ZoomControls from '@/components/molecules/ZoomControls';
import ActionControls from '@/components/molecules/ActionControls';
import TopLeftControls from '@/components/molecules/TopLeftControls';
import BottomRightControls from '@/components/molecules/BottomRightControls';
import BackgroundSelector from '@/components/molecules/BackgroundSelector';
import ViewModeSelector from '@/components/atoms/ViewModeSelector';
import UIToggleButton from '@/components/atoms/UIToggleButton';

export default function CanvasControls({ ...props }: CanvasControlsProps) {
  return (
    <>
      {/* Top-left controls (close, filename) */}
      <TopLeftControls
        fileName={props.fileName}
        onClose={props.onReset}
        visible={props.controlsVisible}
      />

      {/* Zoom controls (bottom-left) */}
      <ZoomControls
        scale={props.scale}
        onZoomIn={props.onZoomIn}
        onZoomOut={props.onZoomOut}
        onResetZoom={props.onResetZoom}
        visible={props.controlsVisible}
      />

      {/* Action controls (top-right) */}
      <ActionControls
        onSave={props.onSave}
        onDownload={props.onDownload}
        onShare={props.onShare}
        onUndo={props.onUndo}
        onRedo={props.onRedo}
        transform={props.transform}
        onRotateLeft={props.onRotateLeft}
        onRotateRight={props.onRotateRight}
        onFlipH={props.onFlipH}
        onFlipV={props.onFlipV}
        onResetTransform={props.onResetTransform}
        visible={props.controlsVisible}
      />

      {/* Bottom-right controls */}
      <BottomRightControls
        onToggleUI={props.onToggleUI}
        onToggleShortcuts={props.onToggleShortcuts}
        isFullscreen={props.isFullscreen}
        visible={props.controlsVisible}
      />

      {/* Background selector */}
      <BackgroundSelector
        background={props.background}
        onBackgroundChange={props.onBackgroundChange}
        visible={props.controlsVisible}
      />

      {/* View mode selector */}
      <ViewModeSelector
        viewMode={props.viewMode}
        onViewModeChange={props.onViewModeChange}
        visible={props.controlsVisible}
      />

      {/* UI toggle button */}
      <UIToggleButton
        visible={!props.controlsVisible}
        onClick={props.onToggleUI}
      />
    </>
  );
}
```

---

## ⏳ TODO: Phase 1.3 - AIEditManager.tsx

### Responsibility:

AI generation, editing, preset handling, auto-save

### What to Extract from Canvas.tsx:

- Lines 136-180: useImageEdit hook setup
- Lines 154-180: Preset generation handler
- Lines 619-645: AI edit event listeners
- Auto-save logic (already implemented in onSuccess)

### Props Interface:

```typescript
interface AIEditManagerProps {
  // Image state
  uploadedImage: string | null;
  fileName: string;

  // AI state
  isAIEditing: boolean;
  aiProgress: string;

  // Callbacks
  onImageUpdate: (imageUrl: string) => void;
  onOriginalImageSet: (imageUrl: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}
```

### Component Structure:

```typescript
'use client';

import { useEffect } from 'react';
import { useImageEdit } from '@/hooks/useImageEdit';
import { saveImageToGallery } from '@/lib/gallery-storage';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('AIEditManager');

export default function AIEditManager({
  uploadedImage,
  fileName,
  onImageUpdate,
  onOriginalImageSet,
  onLoadingChange,
  onSuccess,
  onError,
}: AIEditManagerProps) {
  // AI Edit hook with auto-save
  const { edit: editWithAI } = useImageEdit({
    onSuccess: async (result) => {
      if (result.images && result.images.length > 0) {
        onLoadingChange(true);
        const aiImageUrl = result.images[0].url;
        onImageUpdate(aiImageUrl);
        onSuccess('Image edited successfully!');

        // Auto-save to gallery
        try {
          await saveImageToGallery(
            aiImageUrl,
            fileName || 'ai-generated-image.jpg',
            'ai-edited',
            { style: 'AI Enhanced' }
          );

          window.dispatchEvent(new Event('gallery-updated'));
          logger.info('✅ AI-generated image auto-saved to gallery');
          onSuccess('Saved to gallery!');
        } catch (error) {
          logger.error('Failed to auto-save to gallery:', error);
        }
      }
    },
    onError: (error) => {
      onLoadingChange(false);
      onError(error.message || 'Failed to edit image');
    },
  });

  // Listen for AI edit generation events
  useEffect(() => {
    const handleAIEditGenerate = (event: CustomEvent) => {
      const { prompt, imageUrl } = event.detail;
      if (imageUrl) {
        onOriginalImageSet(imageUrl);
        editWithAI({
          prompt: prompt || 'enhance the image quality and lighting',
          image_url: imageUrl,
          num_images: 1,
          output_format: 'jpeg',
        });
      }
    };

    window.addEventListener(
      'ai-edit-generate',
      handleAIEditGenerate as EventListener
    );
    return () => {
      window.removeEventListener(
        'ai-edit-generate',
        handleAIEditGenerate as EventListener
      );
    };
  }, [editWithAI, onOriginalImageSet]);

  // This component doesn't render anything
  return null;
}
```

---

## ⏳ TODO: Phase 1.4 - CanvasModals.tsx

### Responsibility:

All modals, overlays, dialogs (crop modal, keyboard shortcuts, etc.)

### What to Extract from Canvas.tsx:

- Crop modal (lines ~850-900)
- Keyboard shortcuts modal
- Fullscreen logic
- Edit panel (might stay in Canvas.tsx - it's a sidebar panel)

### Props Interface:

```typescript
interface CanvasModalsProps {
  // Crop modal
  isCropMode: boolean;
  cropRatio: string | null;
  uploadedImage: string | null;
  onCropApply: (croppedImage: string) => void;
  onCropCancel: () => void;

  // Keyboard shortcuts modal
  showKeyboardHelp: boolean;
  onCloseKeyboardHelp: () => void;

  // Edit panel (optional - might stay in main Canvas)
  isEditPanelOpen: boolean;
  onEditPanelClose: () => void;
  adjustFilters: AdjustFilters;
  colorFilters: ColorFilters;
  filterEffects: FilterEffects;
  onAdjustFiltersChange: (filters: AdjustFilters) => void;
  onColorFiltersChange: (filters: ColorFilters) => void;
  onFilterEffectsChange: (effects: FilterEffects) => void;
  onResetFilters: () => void;
}
```

### Component Structure:

```typescript
'use client';

import React from 'react';
import CropModal from '@/components/organisms/CropModal';
import KeyboardShortcutsModal from '@/components/molecules/KeyboardShortcutsModal';
import EditPanel from '@/components/organisms/EditPanel';

export default function CanvasModals({ ...props }: CanvasModalsProps) {
  return (
    <>
      {/* Crop Modal */}
      {props.isCropMode && props.uploadedImage && (
        <CropModal
          imageUrl={props.uploadedImage}
          cropRatio={props.cropRatio}
          onCropComplete={props.onCropApply}
          onCancel={props.onCropCancel}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {props.showKeyboardHelp && (
        <KeyboardShortcutsModal onClose={props.onCloseKeyboardHelp} />
      )}

      {/* Edit Panel (Right Sidebar) */}
      {props.isEditPanelOpen && (
        <EditPanel
          adjustFilters={props.adjustFilters}
          colorFilters={props.colorFilters}
          filterEffects={props.filterEffects}
          onAdjustFiltersChange={props.onAdjustFiltersChange}
          onColorFiltersChange={props.onColorFiltersChange}
          onFilterEffectsChange={props.onFilterEffectsChange}
          onResetFilters={props.onResetFilters}
          onClose={props.onEditPanelClose}
        />
      )}
    </>
  );
}
```

---

## ⏳ TODO: Phase 2 - Update Canvas.tsx

### Goal:

Replace JSX sections with new components, reduce from 1,130 → ~250 lines

### Step-by-Step:

#### 2.1: Import New Components

```typescript
// Add to top of Canvas.tsx
import CanvasCore from './canvas/CanvasCore';
import CanvasControls from './canvas/CanvasControls';
import AIEditManager from './canvas/AIEditManager';
import CanvasModals from './canvas/CanvasModals';
```

#### 2.2: Replace Rendering Section (lines 706-850)

**Before:**

```typescript
return (
  <>
    <input ref={fileInputRef} ... />
    <div className="fixed z-10 ...">
      {!uploadedImage && !isLoading && <EmptyState ... />}
      {isLoading && <LoadingState />}
      {uploadedImage && (
        <>
          {viewMode === 'normal' ? (
            <div className="h-full ...">
              <ImageViewer ... />
            </div>
          ) : (
            <div className="relative flex ...">
              {/* Side by side ... */}
            </div>
          )}
        </>
      )}
    </div>
    {/* Controls ... */}
    {/* Modals ... */}
  </>
);
```

**After:**

```typescript
return (
  <>
    {/* File input (keep) */}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />

    {/* Core Rendering */}
    <CanvasCore
      uploadedImage={uploadedImage}
      originalImage={originalImage}
      isLoading={isLoading}
      isAIEditing={isAIEditing}
      isAIImageLoading={isAIImageLoading}
      aiProgress={aiProgress}
      viewMode={viewMode}
      activeImage={activeImage}
      onActiveImageChange={setActiveImage}
      scale={scale}
      position={position}
      onScaleChange={setScale}
      onPositionChange={setPosition}
      transform={transform}
      adjustFilters={adjustFilters}
      colorFilters={colorFilters}
      filterEffects={filterEffects}
      background={background}
      canvasControlsVisible={canvasControlsVisible}
      isPromptExpanded={isPromptExpanded}
      leftOpen={leftOpen}
      rightOpen={rightOpen}
      topOpen={topOpen}
      bottomOpen={bottomOpen}
      onImageLoad={handleAIImageLoad}
      onImageError={handleAIImageError}
      onUploadClick={handleUploadClick}
    />

    {/* Controls */}
    {uploadedImage && (
      <CanvasControls
        hasImage={!!uploadedImage}
        fileName={fileName}
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        transform={transform}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onFlipH={handleFlipH}
        onFlipV={handleFlipV}
        onResetTransform={resetTransform}
        background={background}
        onBackgroundChange={setBackground}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSave={handleSave}
        onDownload={handleDownload}
        onReset={handleReset}
        onShare={handleShare}
        onUndo={() => {}}
        onRedo={() => {}}
        isFullscreen={isFullscreen}
        controlsVisible={canvasControlsVisible}
        onToggleUI={() => setCanvasControlsVisible(!canvasControlsVisible)}
        onToggleShortcuts={() => setShowKeyboardHelp(true)}
        leftOpen={leftOpen}
        rightOpen={rightOpen}
        topOpen={topOpen}
        bottomOpen={bottomOpen}
      />
    )}

    {/* AI Edit Manager (invisible) */}
    <AIEditManager
      uploadedImage={uploadedImage}
      fileName={fileName}
      isAIEditing={isAIEditing}
      aiProgress={aiProgress}
      onImageUpdate={setUploadedImage}
      onOriginalImageSet={setOriginalImage}
      onLoadingChange={setIsAIImageLoading}
      onSuccess={(msg) => showToast(msg, 'success')}
      onError={(msg) => showToast(msg, 'error')}
    />

    {/* Modals */}
    <CanvasModals
      isCropMode={isCropMode}
      cropRatio={cropRatio}
      uploadedImage={uploadedImage}
      onCropApply={handleCropApply}
      onCropCancel={handleCropCancel}
      showKeyboardHelp={showKeyboardHelp}
      onCloseKeyboardHelp={() => setShowKeyboardHelp(false)}
      isEditPanelOpen={isEditPanelOpen}
      onEditPanelClose={() => setIsEditPanelOpen(false)}
      adjustFilters={adjustFilters}
      colorFilters={colorFilters}
      filterEffects={filterEffects}
      onAdjustFiltersChange={setAdjustFilters}
      onColorFiltersChange={setColorFilters}
      onFilterEffectsChange={setFilterEffects}
      onResetFilters={resetFilters}
    />

    {/* Toast (keep) */}
    <Toast />
  </>
);
```

#### 2.3: Cleanup

- Remove now-unused JSX sections
- Keep all hooks (they're fine)
- Keep all event handlers
- Keep state management

---

## ⏳ TODO: Phase 3 - Cleanup & Test

### 3.1: Code Cleanup

```bash
# Remove unused imports
# Add JSDoc comments
# Format code
npm run lint -- --fix
```

### 3.2: Type Check

```bash
npm run build
# Should compile without errors
```

### 3.3: Run Tests

```bash
npm run test
# Fix any broken tests
```

### 3.4: Manual Testing Checklist

- [ ] Image upload works
- [ ] Zoom/pan works
- [ ] Rotate/flip works
- [ ] Filters work
- [ ] AI Generate works
- [ ] Auto-save to gallery works
- [ ] Crop modal works
- [ ] Keyboard shortcuts work
- [ ] Side-by-side view works
- [ ] Background selector works
- [ ] View mode selector works
- [ ] Fullscreen works
- [ ] All sidebars work

### 3.5: Performance Check

```bash
# Bundle size
npm run build -- --analyze
# Should be similar or smaller than before
```

---

## 📊 Expected Results

### Before:

```
Canvas.tsx: 1,130 lines
- Maintainability: 2/10
- Testability: 1/10
- Readability: 3/10
- Modularity: 1/10
```

### After:

```
Canvas.tsx: ~250 lines (Orchestrator)
CanvasCore.tsx: 320 lines (Rendering)
CanvasControls.tsx: ~200 lines (Controls)
AIEditManager.tsx: ~150 lines (AI Logic)
CanvasModals.tsx: ~200 lines (Modals)

Total: ~1,120 lines (10 lines saved from cleanup)

- Maintainability: 8/10 ↑
- Testability: 7/10 ↑
- Readability: 9/10 ↑
- Modularity: 9/10 ↑
```

---

## 🚀 How to Continue

### Option 1: Continue Now (5-6 hours)

```bash
# Create remaining components
# Update Canvas.tsx
# Test thoroughly
# Commit
```

### Option 2: Continue Later (Resume from checkpoint)

```bash
# This commit is a safe checkpoint
# All new code compiles
# No breaking changes
# Can continue anytime
```

### Option 3: Incremental (Do one component at a time)

```bash
# Day 1: CanvasControls.tsx (done)
# Day 2: AIEditManager.tsx
# Day 3: CanvasModals.tsx
# Day 4: Update Canvas.tsx
# Day 5: Test & cleanup
```

---

## 🎯 Recommendation

**Incremental approach (Option 3):**

- ✅ Less risky
- ✅ Easier to test each step
- ✅ Can be reviewed gradually
- ✅ Fits into daily workflow

**Do one component per day, test, commit, repeat.**

This way, if something breaks, it's easy to identify and fix.

---

## 📝 Notes

- All hooks stay in Canvas.tsx (they're already well-organized)
- Props interfaces are well-defined (type-safe)
- No breaking changes to existing components
- Backward compatible (Canvas.tsx still works as-is)
- Can be done incrementally without blocking other work

---

**Status:** Ready to continue anytime! 🚀
