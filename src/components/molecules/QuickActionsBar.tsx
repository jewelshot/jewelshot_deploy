/**
 * QuickActionsBar Component
 *
 * Vertical action bar for quick image operations (upscale, enhance, etc.)
 * Positioned on the right side of Canvas, dynamically adjusts based on RightSidebar state
 */

'use client';

import React from 'react';
import {
  ArrowUpIcon,
  ScissorsIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/atoms/Tooltip';

interface QuickActionsBarProps {
  /** Whether the right sidebar is expanded */
  isRightSidebarExpanded: boolean;
  /** Callback when upscale button is clicked */
  onUpscale: () => void;
  /** Whether upscale operation is in progress */
  isUpscaling?: boolean;
  /** Callback when remove background button is clicked */
  onRemoveBackground: () => void;
  /** Whether remove background operation is in progress */
  isRemovingBackground?: boolean;
  /** Callback when rotate view button is clicked */
  onRotateView: () => void;
  /** Whether rotate view operation is in progress */
  isRotating?: boolean;
  /** Callback when close-up button is clicked */
  onCloseUp: () => void;
  /** Whether close-up operation is in progress */
  isClosingUp?: boolean;
  /** Callback when perspective button is clicked (top view / wide angle) */
  onPerspective: () => void;
  /** Whether perspective operation is in progress */
  isPerspectiveProcessing?: boolean;
  /** Whether there's an active image to process */
  hasActiveImage: boolean;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  isRightSidebarExpanded,
  onUpscale,
  isUpscaling = false,
  onRemoveBackground,
  isRemovingBackground = false,
  onRotateView,
  isRotating = false,
  onCloseUp,
  isClosingUp = false,
  onPerspective,
  isPerspectiveProcessing = false,
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

      {/* Remove Background Button */}
      <Tooltip content="Remove Background" placement="left">
        <button
          onClick={onRemoveBackground}
          disabled={!hasActiveImage || isRemovingBackground}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
            hasActiveImage && !isRemovingBackground
              ? 'cursor-pointer bg-blue-500 text-white shadow-md hover:bg-blue-600 hover:shadow-lg'
              : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
          } ${isRemovingBackground ? 'animate-pulse' : ''} `}
          title={
            !hasActiveImage
              ? 'No active image'
              : isRemovingBackground
                ? 'Removing background...'
                : 'Remove image background'
          }
        >
          {isRemovingBackground ? (
            // Spinner animation
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <ScissorsIcon className="h-5 w-5" />
          )}
        </button>
      </Tooltip>

      {/* Rotate View Button */}
      <Tooltip content="Rotate View (3 Angles)" placement="left">
        <button
          onClick={onRotateView}
          disabled={!hasActiveImage || isRotating}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
            hasActiveImage && !isRotating
              ? 'cursor-pointer bg-green-500 text-white shadow-md hover:bg-green-600 hover:shadow-lg'
              : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
          } ${isRotating ? 'animate-pulse' : ''} `}
          title={
            !hasActiveImage
              ? 'No active image'
              : isRotating
                ? 'Generating rotation angles...'
                : 'Rotate view (3 angles)'
          }
        >
          {isRotating ? (
            // Spinner animation
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <ArrowPathIcon className="h-5 w-5" />
          )}
        </button>
      </Tooltip>

      {/* Close-Up Button */}
      <Tooltip content="Close-Up View" placement="left">
        <button
          onClick={onCloseUp}
          disabled={!hasActiveImage || isClosingUp}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
            hasActiveImage && !isClosingUp
              ? 'cursor-pointer bg-orange-500 text-white shadow-md hover:bg-orange-600 hover:shadow-lg'
              : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
          } ${isClosingUp ? 'animate-pulse' : ''} `}
          title={
            !hasActiveImage
              ? 'No active image'
              : isClosingUp
                ? 'Creating close-up view...'
                : 'Create close-up view'
          }
        >
          {isClosingUp ? (
            // Spinner animation
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5" />
          )}
        </button>
      </Tooltip>

      {/* Perspective Button (Top View / Wide Angle) */}
      <Tooltip content="Perspective View" placement="left">
        <button
          onClick={onPerspective}
          disabled={!hasActiveImage || isPerspectiveProcessing}
          className={`group relative flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
            hasActiveImage && !isPerspectiveProcessing
              ? 'cursor-pointer bg-cyan-500 text-white shadow-md hover:bg-cyan-600 hover:shadow-lg'
              : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
          } ${isPerspectiveProcessing ? 'animate-pulse' : ''} `}
          title={
            !hasActiveImage
              ? 'No active image'
              : isPerspectiveProcessing
                ? 'Generating perspective view...'
                : 'Change perspective (Top View / Wide Angle)'
          }
        >
          {isPerspectiveProcessing ? (
            // Spinner animation
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <CubeIcon className="h-5 w-5" />
          )}
        </button>
      </Tooltip>
    </div>
  );
};
