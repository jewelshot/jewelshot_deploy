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

import React, { Dispatch, SetStateAction } from 'react';
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
  viewMode: 'normal' | 'side-by-side';
  activeImage: 'left' | 'right';
  onActiveImageChange: (side: 'left' | 'right') => void;
  
  // Transform & filters (normal view)
  scale: number;
  position: { x: number; y: number };
  onScaleChange: Dispatch<SetStateAction<number>>;
  onPositionChange: Dispatch<SetStateAction<{ x: number; y: number }>>;
  
  // Side-by-side specific scales & positions
  leftImageScale: number;
  leftImagePosition: { x: number; y: number };
  onLeftImageScaleChange: (scale: number) => void;
  onLeftImagePositionChange: (pos: { x: number; y: number }) => void;
  rightImageScale: number;
  rightImagePosition: { x: number; y: number };
  onRightImageScaleChange: (scale: number) => void;
  onRightImagePositionChange: (pos: { x: number; y: number }) => void;
  
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
  
  // Layout positions (from Canvas.tsx)
  leftPos: number;
  rightPos: number;
  topPos: number;
  bottomPos: number;
  imagePadding: { top: number; bottom: number; left: number; right: number };
  backgroundStyles: Record<string, React.CSSProperties>;
  
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
  leftImageScale,
  leftImagePosition,
  onLeftImageScaleChange,
  onLeftImagePositionChange,
  rightImageScale,
  rightImagePosition,
  onRightImageScaleChange,
  onRightImagePositionChange,
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
  leftPos,
  rightPos,
  topPos,
  bottomPos,
  imagePadding,
  backgroundStyles,
  onImageLoad,
  onImageError,
  onUploadClick,
}: CanvasCoreProps) {
  // All calculations done in parent Canvas.tsx - props passed directly
  
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

