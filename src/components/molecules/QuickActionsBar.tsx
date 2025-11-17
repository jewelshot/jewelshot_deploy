/**
 * QuickActionsBar Component
 *
 * Vertical action bar for quick image operations
 * Matches Canvas UI design system exactly
 * Dynamic positioning based on sidebar states
 *
 * 10 Essential Buttons:
 * 1. Upscale (2x quality) - Purple
 * 2. Remove BG (transparent) - Blue
 * 3. Rotate Left (-30°) - Green
 * 4. Rotate Right (+30°) - Green
 * 5. Close-Up (zoom details) - Orange
 * 6. Gemstone (enhance clarity) - Pink
 * 7. Metal Recolor (change metal) - Gold
 * 8. Metal Polish (mirror finish) - Silver
 * 9. Natural Light (realistic reflections) - Amber
 * 10. 360° Video (turntable) - Cyan
 */

'use client';

import React, { useState } from 'react';
import {
  ArrowUp,
  Scissors,
  RotateCcw,
  RotateCw,
  ZoomIn,
  Gem,
  Palette,
  Sparkles,
  Sun,
  Video,
  Loader2,
} from 'lucide-react';
import { Tooltip } from '@/components/atoms/Tooltip';
import { MetalColorPicker } from './MetalColorPicker';
import { MetalType } from '@/hooks/useMetalRecolor';

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
  /** Callback when gemstone enhance button is clicked */
  onGemstoneEnhance: () => void;
  /** Whether gemstone enhancement is in progress */
  isEnhancingGemstones?: boolean;
  /** Callback when metal recolor is selected */
  onMetalRecolor: (metalType: MetalType) => void;
  /** Whether metal recolor is in progress */
  isRecoloringMetal?: boolean;
  /** Callback when metal polish button is clicked */
  onMetalPolish: () => void;
  /** Whether metal polish is in progress */
  isPolishingMetal?: boolean;
  /** Callback when natural light button is clicked */
  onNaturalLight: () => void;
  /** Whether natural light enhancement is in progress */
  isEnhancingLight?: boolean;
  /** Callback when turntable video button is clicked */
  onTurntableVideo: () => void;
  /** Whether turntable video generation is in progress */
  isGeneratingTurntable?: boolean;
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
  onGemstoneEnhance,
  isEnhancingGemstones = false,
  onMetalRecolor,
  isRecoloringMetal = false,
  onMetalPolish,
  isPolishingMetal = false,
  onNaturalLight,
  isEnhancingLight = false,
  onTurntableVideo,
  isGeneratingTurntable = false,
  hasActiveImage,
  isRightSidebarOpen,
  isTopBarOpen, // eslint-disable-line @typescript-eslint/no-unused-vars
  controlsVisible,
}) => {
  // State for metal color picker
  const [isMetalPickerOpen, setIsMetalPickerOpen] = useState(false);

  // Handle metal color selection
  const handleMetalSelect = (metalType: MetalType) => {
    onMetalRecolor(metalType);
    setIsMetalPickerOpen(false); // Close picker after selection
  };
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
    pink: 'border border-[rgba(236,72,153,0.3)] bg-[rgba(236,72,153,0.1)] text-pink-300 hover:border-[rgba(236,72,153,0.6)] hover:bg-[rgba(236,72,153,0.2)] hover:text-pink-200',
    gold: 'border border-[rgba(218,165,32,0.3)] bg-[rgba(218,165,32,0.1)] text-yellow-300 hover:border-[rgba(218,165,32,0.6)] hover:bg-[rgba(218,165,32,0.2)] hover:text-yellow-200',
    silver:
      'border border-[rgba(192,192,192,0.3)] bg-[rgba(192,192,192,0.1)] text-gray-300 hover:border-[rgba(192,192,192,0.6)] hover:bg-[rgba(192,192,192,0.2)] hover:text-gray-200',
    amber:
      'border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)] text-amber-300 hover:border-[rgba(245,158,11,0.6)] hover:bg-[rgba(245,158,11,0.2)] hover:text-amber-200',
    cyan: 'border border-[rgba(6,182,212,0.3)] bg-[rgba(6,182,212,0.1)] text-cyan-300 hover:border-[rgba(6,182,212,0.6)] hover:bg-[rgba(6,182,212,0.2)] hover:text-cyan-200',
  };

  return (
    <div
      className="fixed z-20 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        top: '50%',
        transform: controlsVisible
          ? 'translateY(-50%) translateX(0)'
          : 'translateY(-50%) translateX(30px)',
        right: isRightSidebarOpen ? '276px' : '16px',
        opacity: controlsVisible ? 1 : 0,
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
        <Tooltip
          content={
            isRemovingBackground ? 'Removing BG...' : 'Remove Background'
          }
          side="left"
        >
          <button
            onClick={onRemoveBackground}
            disabled={!hasActiveImage || isRemovingBackground}
            className={getButtonClass(
              hasActiveImage,
              isRemovingBackground,
              colors.blue
            )}
          >
            {isRemovingBackground ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Scissors className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="h-px w-full bg-[rgba(139,92,246,0.2)]" />

        {/* Rotate Left Button */}
        <Tooltip
          content={isRotatingLeft ? 'Rotating...' : 'Rotate Left'}
          side="left"
        >
          <button
            onClick={onRotateLeft}
            disabled={!hasActiveImage || isRotatingLeft}
            className={getButtonClass(
              hasActiveImage,
              isRotatingLeft,
              colors.green
            )}
          >
            {isRotatingLeft ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Rotate Right Button */}
        <Tooltip
          content={isRotatingRight ? 'Rotating...' : 'Rotate Right'}
          side="left"
        >
          <button
            onClick={onRotateRight}
            disabled={!hasActiveImage || isRotatingRight}
            className={getButtonClass(
              hasActiveImage,
              isRotatingRight,
              colors.green
            )}
          >
            {isRotatingRight ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCw className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Close-Up Button */}
        <Tooltip content={isClosingUp ? 'Creating...' : 'Close-Up'} side="left">
          <button
            onClick={onCloseUp}
            disabled={!hasActiveImage || isClosingUp}
            className={getButtonClass(
              hasActiveImage,
              isClosingUp,
              colors.orange
            )}
          >
            {isClosingUp ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ZoomIn className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="h-px w-full bg-[rgba(139,92,246,0.2)]" />

        {/* Gemstone Enhancement Button */}
        <Tooltip
          content={isEnhancingGemstones ? 'Enhancing...' : 'Enhance Gemstones'}
          side="left"
        >
          <button
            onClick={onGemstoneEnhance}
            disabled={!hasActiveImage || isEnhancingGemstones}
            className={getButtonClass(
              hasActiveImage,
              isEnhancingGemstones,
              colors.pink
            )}
          >
            {isEnhancingGemstones ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Gem className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Metal Recolor Button */}
        <Tooltip
          content={isRecoloringMetal ? 'Recoloring...' : 'Metal Color'}
          side="left"
        >
          <button
            onClick={() => setIsMetalPickerOpen(!isMetalPickerOpen)}
            disabled={!hasActiveImage || isRecoloringMetal}
            className={getButtonClass(
              hasActiveImage,
              isRecoloringMetal,
              colors.gold
            )}
          >
            {isRecoloringMetal ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Palette className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Metal Polish Button */}
        <Tooltip
          content={isPolishingMetal ? 'Polishing...' : 'Metal Polish'}
          side="left"
        >
          <button
            onClick={onMetalPolish}
            disabled={!hasActiveImage || isPolishingMetal}
            className={getButtonClass(
              hasActiveImage,
              isPolishingMetal,
              colors.silver
            )}
          >
            {isPolishingMetal ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="h-px w-full bg-[rgba(139,92,246,0.2)]" />

        {/* Natural Light Button */}
        <Tooltip
          content={isEnhancingLight ? 'Adding Light...' : 'Natural Light'}
          side="left"
        >
          <button
            onClick={onNaturalLight}
            disabled={!hasActiveImage || isEnhancingLight}
            className={getButtonClass(
              hasActiveImage,
              isEnhancingLight,
              colors.amber
            )}
          >
            {isEnhancingLight ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sun className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>

        {/* 360° Turntable Video Button */}
        <Tooltip
          content={isGeneratingTurntable ? 'Generating...' : '360° Video'}
          side="left"
        >
          <button
            onClick={onTurntableVideo}
            disabled={!hasActiveImage || isGeneratingTurntable}
            className={getButtonClass(
              hasActiveImage,
              isGeneratingTurntable,
              colors.cyan
            )}
          >
            {isGeneratingTurntable ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Video className="h-3.5 w-3.5" />
            )}
          </button>
        </Tooltip>
      </div>

      {/* Metal Color Picker (slides out to the left) */}
      <MetalColorPicker
        isOpen={isMetalPickerOpen && hasActiveImage && !isRecoloringMetal}
        onSelect={handleMetalSelect}
        disabled={isRecoloringMetal}
      />
    </div>
  );
};
