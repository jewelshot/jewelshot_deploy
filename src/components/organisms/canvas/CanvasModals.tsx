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
 */

'use client';

import React from 'react';
import CropModal from '@/components/organisms/CropModal';
import KeyboardShortcutsModal from '@/components/molecules/KeyboardShortcutsModal';
import EditPanel from '@/components/organisms/EditPanel';
import type { Transform } from '@/hooks/useImageTransform';
import type { AdjustFilters, ColorFilters, FilterEffects } from '@/hooks/useImageFilters';

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
        />
      )}
    </>
  );
}

