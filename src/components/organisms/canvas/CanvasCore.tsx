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
// AILoadingOverlay removed - using global AILoadingModal instead
import type { Transform } from '@/hooks/useImageTransform';
import type {
  AdjustFilters,
  ColorFilters,
  FilterEffects,
} from '@/hooks/useImageFilters';

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
  onLeftImageScaleChange: Dispatch<SetStateAction<number>>;
  onLeftImagePositionChange: Dispatch<SetStateAction<{ x: number; y: number }>>;
  rightImageScale: number;
  rightImagePosition: { x: number; y: number };
  onRightImageScaleChange: Dispatch<SetStateAction<number>>;
  onRightImagePositionChange: Dispatch<
    SetStateAction<{ x: number; y: number }>
  >;

  transform: Transform;
  adjustFilters: AdjustFilters;
  colorFilters: ColorFilters;
  filterEffects: FilterEffects;

  // Background & UI
  background: 'none' | 'black' | 'gray' | 'white' | 'alpha';
  canvasControlsVisible: boolean;

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
      className="fixed z-10 panel-transition"
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
              className="h-full w-full panel-transition"
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
              className="relative flex h-full w-full items-center justify-center gap-4 panel-transition"
              style={{
                paddingTop: `${imagePadding.top}px`,
                paddingLeft: `${imagePadding.left}px`,
                paddingRight: `${imagePadding.right}px`,
                paddingBottom: `${imagePadding.bottom}px`,
              }}
            >
              {/* AI Loading handled by global AILoadingModal */}

              {/* Original Image (Left) */}
              {originalImage && (
                <div
                  className="relative flex h-full w-1/2 flex-col items-center justify-center"
                  style={{
                    zIndex: activeImage === 'left' ? 10 : 5,
                  }}
                >
                  <div
                    className="relative h-full w-full cursor-pointer"
                    onClick={() => onActiveImageChange('left')}
                    title="Click to select"
                  >
                    <ImageViewer
                      src={originalImage}
                      alt="Original"
                      scale={leftImageScale}
                      position={leftImagePosition}
                      onScaleChange={onLeftImageScaleChange}
                      onPositionChange={onLeftImagePositionChange}
                      transform={{
                        rotation: 0,
                        flipHorizontal: false,
                        flipVertical: false,
                      }}
                      adjustFilters={{}}
                      colorFilters={{}}
                      filterEffects={{}}
                      isAIProcessing={false}
                      aiProgress=""
                      onImageLoad={onImageLoad}
                      onImageError={onImageError}
                      controlsVisible={canvasControlsVisible}
                    />
                    {/* Label with selection indicator */}
                    <div 
                      className={`absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md px-3 py-1 text-xs font-medium backdrop-blur-sm transition-all ${
                        activeImage === 'left'
                          ? 'border border-purple-500/60 bg-purple-500/20 text-purple-300'
                          : 'border border-white/10 bg-black/60 text-white/70'
                      }`}
                    >
                      {activeImage === 'left' && <span className="mr-1.5">●</span>}
                      Original
                    </div>
                  </div>
                </div>
              )}

              {/* Edited Image (Right) */}
              <div
                className="relative flex h-full w-1/2 flex-col items-center justify-center"
                style={{
                  zIndex: activeImage === 'right' ? 10 : 5,
                }}
              >
                <div
                  className="relative h-full w-full cursor-pointer"
                  onClick={() => onActiveImageChange('right')}
                  title="Click to select"
                >
                  <ImageViewer
                    src={uploadedImage}
                    alt="Edited"
                    scale={rightImageScale}
                    position={rightImagePosition}
                    onScaleChange={onRightImageScaleChange}
                    onPositionChange={onRightImagePositionChange}
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
                  {/* Label with selection indicator */}
                  <div 
                    className={`absolute bottom-2 left-1/2 -translate-x-1/2 rounded-md px-3 py-1 text-xs font-medium backdrop-blur-sm transition-all ${
                      activeImage === 'right'
                        ? 'border border-purple-500/60 bg-purple-500/20 text-purple-300'
                        : 'border border-white/10 bg-black/60 text-white/70'
                    }`}
                  >
                    {activeImage === 'right' && <span className="mr-1.5">●</span>}
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
