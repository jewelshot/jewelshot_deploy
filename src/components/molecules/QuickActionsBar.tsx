/**
 * QuickActionsBar Component
 *
 * Vertical action bar for quick image operations
 * Positioned in top-right, aligned with fullscreen/delete buttons
 *
 * 5 Essential Buttons:
 * 1. Upscale (2x quality)
 * 2. Remove BG (transparent)
 * 3. Rotate Left (-30°)
 * 4. Rotate Right (+30°)
 * 5. Close-Up (zoom details)
 */

'use client';

import React from 'react';
import {
  ArrowUpIcon,
  ScissorsIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

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
}) => {
  const buttonBaseClass =
    'group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200';

  const getButtonClass = (isActive: boolean, isProcessing: boolean) => {
    if (!isActive || isProcessing) {
      return `${buttonBaseClass} cursor-not-allowed bg-gray-100/50 text-gray-400 dark:bg-gray-800/50`;
    }
    return `${buttonBaseClass} cursor-pointer bg-white/90 text-gray-700 shadow-sm hover:bg-white hover:shadow-md dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-800`;
  };

  return (
    <div className="fixed right-4 top-20 z-40 flex flex-col gap-1.5 rounded-xl border border-gray-200/50 bg-white/80 p-2 shadow-lg backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
      {/* Upscale Button */}
      <button
        onClick={onUpscale}
        disabled={!hasActiveImage || isUpscaling}
        className={getButtonClass(hasActiveImage, isUpscaling)}
        title={isUpscaling ? 'Upscaling...' : 'Upscale 2x'}
      >
        {isUpscaling ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        ) : (
          <>
            <ArrowUpIcon className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white">
              2×
            </span>
          </>
        )}
      </button>

      {/* Remove Background Button */}
      <button
        onClick={onRemoveBackground}
        disabled={!hasActiveImage || isRemovingBackground}
        className={getButtonClass(hasActiveImage, isRemovingBackground)}
        title={isRemovingBackground ? 'Removing BG...' : 'Remove Background'}
      >
        {isRemovingBackground ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        ) : (
          <ScissorsIcon className="h-5 w-5" />
        )}
      </button>

      {/* Divider */}
      <div className="my-0.5 h-px bg-gray-200 dark:bg-gray-700" />

      {/* Rotate Left Button */}
      <button
        onClick={onRotateLeft}
        disabled={!hasActiveImage || isRotatingLeft}
        className={getButtonClass(hasActiveImage, isRotatingLeft)}
        title={isRotatingLeft ? 'Rotating...' : 'Rotate Left (-30°)'}
      >
        {isRotatingLeft ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        ) : (
          <ArrowLeftIcon className="h-5 w-5" />
        )}
      </button>

      {/* Rotate Right Button */}
      <button
        onClick={onRotateRight}
        disabled={!hasActiveImage || isRotatingRight}
        className={getButtonClass(hasActiveImage, isRotatingRight)}
        title={isRotatingRight ? 'Rotating...' : 'Rotate Right (+30°)'}
      >
        {isRotatingRight ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        ) : (
          <ArrowRightIcon className="h-5 w-5" />
        )}
      </button>

      {/* Close-Up Button */}
      <button
        onClick={onCloseUp}
        disabled={!hasActiveImage || isClosingUp}
        className={getButtonClass(hasActiveImage, isClosingUp)}
        title={isClosingUp ? 'Creating close-up...' : 'Close-Up View'}
      >
        {isClosingUp ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
