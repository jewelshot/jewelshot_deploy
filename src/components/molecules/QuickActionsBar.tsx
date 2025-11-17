/**
 * QuickActionsBar Component
 *
 * Vertical action bar for quick image operations
 * Matches Canvas UI design system exactly
 * Dynamic positioning based on sidebar states
 *
 * 5 Essential Buttons:
 * 1. Upscale (2x quality) - Purple
 * 2. Remove BG (transparent) - Blue
 * 3. Rotate Left (-30°) - Green
 * 4. Rotate Right (+30°) - Green
 * 5. Close-Up (zoom details) - Orange
 */

'use client';

import React from 'react';
import {
  ArrowUp,
  Scissors,
  RotateCcw,
  RotateCw,
  ZoomIn,
  Loader2,
} from 'lucide-react';

interface QuickActionsBarProps {
  /** Callback when upscale button is clicked */
  onUpscale: () => void;
  /** Whether upscale operation is in progress */
  isUpscaling?: boolean;
  /** Callback when remove background button is clicked */
  onRemoveBackground: () => void;
  /** Whether remove background operation is in progress */
  isRemovingBackground?: boolean;
  /** Callback when rotate left button is clicked */
  onRotateLeft: () => void;
  /** Whether rotate left operation is in progress */
  isRotatingLeft?: boolean;
  /** Callback when rotate right button is clicked */
  onRotateRight: () => void;
  /** Whether rotate right operation is in progress */
  isRotatingRight?: boolean;
  /** Callback when close-up button is clicked */
  onCloseUp: () => void;
  /** Whether close-up operation is in progress */
  isClosingUp?: boolean;
  /** Whether there's an active image to process */
  hasActiveImage: boolean;
  /** Whether right sidebar is open (for positioning) */
  isRightSidebarOpen: boolean;
  /** Whether top bar is open (for positioning) */
  isTopBarOpen: boolean;
  /** Whether controls are visible */
  controlsVisible: boolean;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onUpscale,
  isUpscaling = false,
  onRemoveBackground,
  isRemovingBackground = false,
  onRotateLeft,
  isRotatingLeft = false,
  onRotateRight,
  isRotatingRight = false,
  onCloseUp,
  isClosingUp = false,
  hasActiveImage,
  isRightSidebarOpen,
  isTopBarOpen,
  controlsVisible,
}) => {
  // Button base classes matching Canvas UI
  const buttonBaseClass =
    'relative flex h-7 w-7 items-center justify-center rounded-md transition-all';

  const getButtonClass = (
    isActive: boolean,
    isProcessing: boolean,
    colorClass: string
  ) => {
    if (!isActive || isProcessing) {
      return `${buttonBaseClass} cursor-not-allowed border border-[rgba(139,92,246,0.1)] bg-[rgba(139,92,246,0.02)] text-white/30`;
    }
    return `${buttonBaseClass} cursor-pointer ${colorClass}`;
  };

  // Color classes for each button (matching Canvas theme)
  const colors = {
    purple:
      'border border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.1)] text-purple-300 hover:border-[rgba(168,85,247,0.6)] hover:bg-[rgba(168,85,247,0.2)] hover:text-purple-200',
    blue: 'border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.1)] text-blue-300 hover:border-[rgba(59,130,246,0.6)] hover:bg-[rgba(59,130,246,0.2)] hover:text-blue-200',
    green:
      'border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] text-green-300 hover:border-[rgba(34,197,94,0.6)] hover:bg-[rgba(34,197,94,0.2)] hover:text-green-200',
    orange:
      'border border-[rgba(249,115,22,0.3)] bg-[rgba(249,115,22,0.1)] text-orange-300 hover:border-[rgba(249,115,22,0.6)] hover:bg-[rgba(249,115,22,0.2)] hover:text-orange-200',
  };

  return (
    <div
      className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        top: isTopBarOpen ? '140px' : '90px', // Below zoom controls
        right: isRightSidebarOpen ? '276px' : '16px',
        opacity: controlsVisible ? 1 : 0,
        transform: controlsVisible ? 'translateX(0)' : 'translateX(30px)',
        pointerEvents: controlsVisible ? 'auto' : 'none',
      }}
    >
      {/* Container matching Canvas UI */}
      <div className="flex flex-col gap-1.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-1.5 backdrop-blur-[16px]">
        {/* Upscale Button */}
        <button
          onClick={onUpscale}
          disabled={!hasActiveImage || isUpscaling}
          className={getButtonClass(hasActiveImage, isUpscaling, colors.purple)}
          title={isUpscaling ? 'Upscaling...' : 'Upscale 2x Quality'}
        >
          {isUpscaling ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <>
              <ArrowUp className="h-3.5 w-3.5" />
              {hasActiveImage && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-purple-500 text-[8px] font-bold text-white">
                  2×
                </span>
              )}
            </>
          )}
        </button>

        {/* Remove Background Button */}
        <button
          onClick={onRemoveBackground}
          disabled={!hasActiveImage || isRemovingBackground}
          className={getButtonClass(
            hasActiveImage,
            isRemovingBackground,
            colors.blue
          )}
          title={
            isRemovingBackground
              ? 'Removing Background...'
              : 'Remove Background'
          }
        >
          {isRemovingBackground ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Scissors className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Divider */}
        <div className="h-px w-full bg-[rgba(139,92,246,0.2)]" />

        {/* Rotate Left Button */}
        <button
          onClick={onRotateLeft}
          disabled={!hasActiveImage || isRotatingLeft}
          className={getButtonClass(
            hasActiveImage,
            isRotatingLeft,
            colors.green
          )}
          title={isRotatingLeft ? 'Rotating...' : 'Rotate Left (-30°)'}
        >
          {isRotatingLeft ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Rotate Right Button */}
        <button
          onClick={onRotateRight}
          disabled={!hasActiveImage || isRotatingRight}
          className={getButtonClass(
            hasActiveImage,
            isRotatingRight,
            colors.green
          )}
          title={isRotatingRight ? 'Rotating...' : 'Rotate Right (+30°)'}
        >
          {isRotatingRight ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCw className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Close-Up Button */}
        <button
          onClick={onCloseUp}
          disabled={!hasActiveImage || isClosingUp}
          className={getButtonClass(hasActiveImage, isClosingUp, colors.orange)}
          title={isClosingUp ? 'Creating Close-Up...' : 'Close-Up View'}
        >
          {isClosingUp ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ZoomIn className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
