/**
 * =============================================================================
 * CANVAS MODALS - Modal Components & Overlays
 * =============================================================================
 * 
 * Handles:
 * - Crop modal
 * - Keyboard shortcuts modal
 * - Edit panel (right sidebar)
 * - Toast notifications
 * 
 * Extracted from Canvas.tsx (1,130 lines → maintainable components)
 * 
 * ⚡ PERFORMANCE: All modals are lazy loaded to reduce initial bundle size
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Transform } from '@/hooks/useImageTransform';
import type { AdjustFilters, ColorFilters, FilterEffects } from '@/hooks/useImageFilters';

// Lazy load heavy modals (150KB+ savings)
const CropModal = dynamic(() => import('@/components/organisms/CropModal'), {
  ssr: false,
});

const KeyboardShortcutsModal = dynamic(
  () => import('@/components/molecules/KeyboardShortcutsModal'),
  { ssr: false }
);

const EditPanel = dynamic(() => import('@/components/organisms/EditPanel'), {
  ssr: false,
});

/**
 * Props for CanvasModals component
 */
export interface CanvasModalsProps {
  // Crop modal
  isCropMode: boolean;
  cropRatio: number | null;
  uploadedImage: string | null;
  onCropApply: (croppedImage: string) => void;
  onCropCancel: () => void;
  
  // Keyboard shortcuts modal
  showKeyboardHelp: boolean;
  onCloseKeyboardHelp: () => void;
  
  // Edit panel
  isEditPanelOpen: boolean;
  onEditPanelClose: () => void;
  leftOpen: boolean;
  topOpen: boolean;
  onCropRatioChange: (ratio: number | null) => void;
  transform: Transform;
  onTransformChange: (transform: Transform) => void;
  adjustFilters: AdjustFilters;
  onAdjustFiltersChange: (filters: AdjustFilters) => void;
  colorFilters: ColorFilters;
  onColorFiltersChange: (filters: ColorFilters) => void;
  filterEffects: FilterEffects;
  onFilterEffectsChange: (effects: FilterEffects) => void;
  
  // Loading state (for edit panel)
  isLoading: boolean;

  // History controls
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

/**
 * CanvasModals: All modal components
 */
export default function CanvasModals({
  isCropMode,
  cropRatio,
  uploadedImage,
  onCropApply,
  onCropCancel,
  showKeyboardHelp,
  onCloseKeyboardHelp,
  isEditPanelOpen,
  onEditPanelClose,
  leftOpen,
  topOpen,
  onCropRatioChange,
  transform,
  onTransformChange,
  adjustFilters,
  onAdjustFiltersChange,
  colorFilters,
  onColorFiltersChange,
  filterEffects,
  onFilterEffectsChange,
  isLoading,
  onUndo,
  onRedo,
  onReset,
  canUndo,
  canRedo,
}: CanvasModalsProps) {
  
  return (
    <>
      {/* Crop Modal */}
      {isCropMode && uploadedImage && (
        <CropModal
          isOpen={isCropMode}
          imageSrc={uploadedImage}
          aspectRatio={cropRatio}
          onApply={onCropApply}
          onCancel={onCropCancel}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardHelp}
        onClose={onCloseKeyboardHelp}
      />

      {/* Edit Panel (Right Sidebar) */}
      {uploadedImage && !isLoading && isEditPanelOpen && (
        <EditPanel
          isOpen={isEditPanelOpen}
          onClose={onEditPanelClose}
          initialPosition={{
            x: leftOpen ? 276 : 16,
            y: topOpen ? 80 + 48 + 12 : 16 + 48 + 12, // top position + file bar height + gap
          }}
          leftOpen={leftOpen}
          topOpen={topOpen}
          onCropRatioChange={onCropRatioChange}
          onTransformChange={(transformData) => {
            onTransformChange({
              rotation: transformData.rotation,
              flipHorizontal: transformData.flipHorizontal,
              flipVertical: transformData.flipVertical,
            });
          }}
          onAdjustChange={(adjustData) => {
            onAdjustFiltersChange({
              brightness: adjustData.brightness,
              contrast: adjustData.contrast,
              exposure: adjustData.exposure,
              highlights: adjustData.highlights,
              shadows: adjustData.shadows,
              whites: adjustData.whites,
              blacks: adjustData.blacks,
              clarity: adjustData.clarity,
              sharpness: adjustData.sharpness,
              dehaze: adjustData.dehaze,
            });
          }}
          onColorChange={(colorData) => {
            onColorFiltersChange({
              temperature: colorData.temperature || 0,
              tint: colorData.tint || 0,
              saturation: colorData.saturation || 0,
              vibrance: colorData.vibrance || 0,
            });
          }}
          onFilterChange={(filterData) => {
            onFilterEffectsChange({
              vignetteAmount: filterData.vignetteAmount || 0,
              vignetteSize: filterData.vignetteSize || 50,
              vignetteFeather: filterData.vignetteFeather || 50,
              grainAmount: filterData.grainAmount || 0,
              grainSize: filterData.grainSize || 50,
              fadeAmount: filterData.fadeAmount || 0,
            });
          }}
          onUndo={onUndo}
          onRedo={onRedo}
          onReset={onReset}
          canUndo={canUndo}
          canRedo={canRedo}
        />
      )}
    </>
  );
}

