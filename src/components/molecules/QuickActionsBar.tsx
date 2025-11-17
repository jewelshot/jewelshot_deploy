/**
 * QuickActionsBar Component
 *
 * Vertical action bar for quick image operations (upscale, enhance, etc.)
 * Positioned on the right side of Canvas, dynamically adjusts based on RightSidebar state
 */

'use client';

import React from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/atoms/Tooltip';

interface QuickActionsBarProps {
  /** Whether the right sidebar is expanded */
  isRightSidebarExpanded: boolean;
  /** Callback when upscale button is clicked */
  onUpscale: () => void;
  /** Whether upscale operation is in progress */
  isUpscaling?: boolean;
  /** Whether there's an active image to process */
  hasActiveImage: boolean;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  isRightSidebarExpanded,
  onUpscale,
  isUpscaling = false,
  hasActiveImage,
}) => {
  return (
    <div
      className={`fixed top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 ${
        isRightSidebarExpanded
          ? 'right-[340px]' // When sidebar is expanded (320px + 20px margin)
          : 'right-6' // When sidebar is collapsed
      } `}
      style={{
        // Ensure it's below modals but above canvas content
        zIndex: 30,
      }}
    >
      {/* Upscale Button */}
      <Tooltip content="Upscale Image (2x)" placement="left">
        <button
          onClick={onUpscale}
          disabled={!hasActiveImage || isUpscaling}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
            hasActiveImage && !isUpscaling
              ? 'cursor-pointer bg-purple-500 text-white shadow-md hover:bg-purple-600 hover:shadow-lg'
              : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
          } ${isUpscaling ? 'animate-pulse' : ''} `}
          title={
            !hasActiveImage
              ? 'No active image'
              : isUpscaling
                ? 'Upscaling in progress...'
                : 'Upscale image (2x resolution)'
          }
        >
          {isUpscaling ? (
            // Spinner animation
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              {/* Upscale Icon - Arrow pointing up with sparkle effect */}
              <ArrowUpIcon className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-purple-500 dark:bg-gray-900">
                2×
              </span>
            </>
          )}
        </button>
      </Tooltip>

      {/* Future Actions - Placeholder buttons */}
      {/* 
      <Tooltip content="Enhance Details" placement="left">
        <button
          disabled
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
        >
          <SparklesIcon className="w-5 h-5" />
        </button>
      </Tooltip>

      <Tooltip content="Remove Background" placement="left">
        <button
          disabled
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
        >
          <ScissorsIcon className="w-5 h-5" />
        </button>
      </Tooltip>
      */}
    </div>
  );
};
