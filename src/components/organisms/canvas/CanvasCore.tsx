/**
 * =============================================================================
 * CANVAS CORE - Image Rendering Engine
 * =============================================================================
 * 
 * Handles:
 * - Image rendering (single view & side-by-side comparison)
 * - Filter & transform application
 * - Zoom & pan
 * - Loading & empty states
 * - Padding calculations
 * 
 * Extracted from Canvas.tsx (1,130 lines → maintainable components)
 */

'use client';

import React from 'react';
import ImageViewer from '@/components/molecules/ImageViewer';
import EmptyState from '@/components/molecules/EmptyState';
import LoadingState from '@/components/atoms/LoadingState';
import AILoadingOverlay from '@/components/atoms/AILoadingOverlay';
import type { Transform } from '@/hooks/useImageTransform';
import type { AdjustFilters, ColorFilters, FilterEffects } from '@/hooks/useImageFilters';

/**
 * Props for CanvasCore component
 */
export interface CanvasCoreProps {
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
  
  // Sidebar state (for padding calculations)
  leftOpen: boolean;
  rightOpen: boolean;
  topOpen: boolean;
  bottomOpen: boolean;
  
  // Event handlers
  onImageLoad: () => void;
  onImageError: () => void;
  onUploadClick: () => void;
}

/**
 * CanvasCore: Pure rendering component
 */
export default function CanvasCore({
  uploadedImage,
  originalImage,
  isLoading,
  isAIEditing,
  isAIImageLoading,
  aiProgress,
  viewMode,
  activeImage,
  onActiveImageChange,
  scale,
  position,
  onScaleChange,
  onPositionChange,
  transform,
  adjustFilters,
  colorFilters,
  filterEffects,
  background,
  canvasControlsVisible,
  isPromptExpanded,
  leftOpen,
  rightOpen,
  topOpen,
  bottomOpen,
  onImageLoad,
  onImageError,
  onUploadClick,
}: CanvasCoreProps) {
  // Calculate positions for smooth transitions
  const leftPos = leftOpen ? 260 : 0;
  const rightPos = rightOpen ? 260 : 0;
  const topPos = topOpen ? 64 : 0;
  const bottomPos = bottomOpen ? 40 : 0;

  // Minimal padding to prevent overlap with controls
  const minHorizontalPadding = Math.min(
    leftOpen ? 48 : 16,
    rightOpen ? 48 : 16
  );

  // Calculate bottom padding aligned with AI Edit Control
  const aiEditControlBottom = bottomOpen ? 56 : 16;
  const aiEditControlHeight = 50;
  const aiEditControlSpacing = bottomOpen ? 0 : 12;
  const promptAreaHeight = isPromptExpanded ? 110 : 0;
  const promptAreaSpacing = isPromptExpanded ? 8 : 0;

  const imagePadding = {
    top: canvasControlsVisible ? 80 : 16,
    left: canvasControlsVisible ? minHorizontalPadding : 16,
    right: canvasControlsVisible ? minHorizontalPadding : 16,
    bottom: canvasControlsVisible
      ? aiEditControlBottom +
        aiEditControlHeight +
        aiEditControlSpacing +
        promptAreaHeight +
        promptAreaSpacing
      : 16,
  };

  // Background styles
  const backgroundStyles = {
    none: {},
    black: { backgroundColor: '#000000' },
    gray: { backgroundColor: '#808080' },
    white: { backgroundColor: '#ffffff' },
    alpha: {
      backgroundImage:
        'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
      backgroundSize: '16px 16px',
      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
      backgroundColor: '#ffffff',
    },
  };

  return (
    <div
      className="fixed z-10 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: `${leftPos}px`,
        right: `${rightPos}px`,
        top: `${topPos}px`,
        bottom: `${bottomPos}px`,
        ...backgroundStyles[background],
      }}
    >
      {/* Empty State */}
      {!uploadedImage && !isLoading && (
        <EmptyState onUploadClick={onUploadClick} />
      )}

      {/* Loading State */}
      {isLoading && <LoadingState />}

      {/* Image Viewer */}
      {uploadedImage && (
        <>
          {viewMode === 'normal' ? (
            /* Single Image View */
            <div
              className="h-full w-full transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                paddingTop: `${imagePadding.top}px`,
                paddingLeft: `${imagePadding.left}px`,
                paddingRight: `${imagePadding.right}px`,
                paddingBottom: `${imagePadding.bottom}px`,
              }}
            >
              <ImageViewer
                src={uploadedImage}
                alt="Uploaded"
                scale={scale}
                position={position}
                onScaleChange={onScaleChange}
                onPositionChange={onPositionChange}
                transform={transform}
                adjustFilters={adjustFilters}
                colorFilters={colorFilters}
                filterEffects={filterEffects}
                isAIProcessing={isAIEditing || isAIImageLoading}
                aiProgress={aiProgress}
                onImageLoad={onImageLoad}
                onImageError={onImageError}
                controlsVisible={canvasControlsVisible}
              />
            </div>
          ) : (
            /* Side-by-Side Comparison View */
            <div
              className="relative flex h-full w-full items-center justify-center gap-4 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
              style={{
                paddingTop: `${imagePadding.top}px`,
                paddingLeft: `${imagePadding.left}px`,
                paddingRight: `${imagePadding.right}px`,
                paddingBottom: `${imagePadding.bottom}px`,
              }}
            >
              {/* AI Loading Overlay */}
              {(isAIEditing || isAIImageLoading) && (
                <div className="absolute inset-0 z-50">
                  <AILoadingOverlay progress={aiProgress} />
                </div>
              )}

              {/* Original Image (Left) */}
              {originalImage && (
                <div
                  className="relative flex h-full w-1/2 flex-col items-center justify-center transition-all duration-200"
                  style={{
                    zIndex: activeImage === 'left' ? 10 : 5,
                    opacity: activeImage === 'left' ? 1 : 0.85,
                  }}
                >
                  <div
                    className="relative h-full w-full cursor-pointer transition-all duration-200"
                    onClick={() => onActiveImageChange('left')}
                    title="Click to bring to front"
                    style={{
                      filter:
                        activeImage === 'left'
                          ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
                          : 'none',
                    }}
                  >
                    <ImageViewer
                      src={originalImage}
                      alt="Original"
                      scale={scale}
                      position={position}
                      onScaleChange={onScaleChange}
                      onPositionChange={onPositionChange}
                      transform={{ rotation: 0, flipHorizontal: false, flipVertical: false }}
                      adjustFilters={{}}
                      colorFilters={{}}
                      filterEffects={{}}
                      isAIProcessing={false}
                      aiProgress=""
                      onImageLoad={onImageLoad}
                      onImageError={onImageError}
                      controlsVisible={canvasControlsVisible}
                    />
                    {/* Label */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      Original
                    </div>
                  </div>
                </div>
              )}

              {/* Edited Image (Right) */}
              <div
                className="relative flex h-full w-1/2 flex-col items-center justify-center transition-all duration-200"
                style={{
                  zIndex: activeImage === 'right' ? 10 : 5,
                  opacity: activeImage === 'right' ? 1 : 0.85,
                }}
              >
                <div
                  className="relative h-full w-full cursor-pointer transition-all duration-200"
                  onClick={() => onActiveImageChange('right')}
                  title="Click to bring to front"
                  style={{
                    filter:
                      activeImage === 'right'
                        ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))'
                        : 'none',
                  }}
                >
                  <ImageViewer
                    src={uploadedImage}
                    alt="Edited"
                    scale={scale}
                    position={position}
                    onScaleChange={onScaleChange}
                    onPositionChange={onPositionChange}
                    transform={transform}
                    adjustFilters={adjustFilters}
                    colorFilters={colorFilters}
                    filterEffects={filterEffects}
                    isAIProcessing={false}
                    aiProgress=""
                    onImageLoad={onImageLoad}
                    onImageError={onImageError}
                    controlsVisible={canvasControlsVisible}
                  />
                  {/* Label */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    Edited
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

