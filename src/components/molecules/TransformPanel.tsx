'use client';

import React, { useState, useEffect } from 'react';
import { RotateSlider } from '@/components/atoms/RotateSlider';
import { FlipButton } from '@/components/atoms/FlipButton';
import { Maximize2 } from 'lucide-react';

interface TransformPanelProps {
  /**
   * Transform change handler
   */
  onTransformChange?: (transform: TransformState) => void;
}

export interface TransformState {
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  imageScale: number; // New: image size scale (not zoom)
}

/**
 * TransformPanel - Molecule component for image transformation controls
 */
export function TransformPanel({ onTransformChange }: TransformPanelProps) {
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [imageScale, setImageScale] = useState(100); // 100 = 100% (original size)

  // Notify parent of changes
  useEffect(() => {
    if (onTransformChange) {
      onTransformChange({
        rotation,
        flipHorizontal,
        flipVertical,
        imageScale: imageScale / 100, // Convert to decimal (0.1 - 2.0)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation, flipHorizontal, flipVertical, imageScale]);

  return (
    <div className="flex flex-col gap-4">
      {/* Rotate */}
      <div>
        <RotateSlider value={rotation} onChange={setRotation} />
      </div>

      {/* Scale */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="h-3.5 w-3.5 text-white/50" />
            <label className="text-xs font-medium text-white/70">Scale</label>
          </div>
          <span className="text-xs text-white/50">{imageScale}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={200}
          value={imageScale}
          onChange={(e) => setImageScale(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-purple-500"
        />
        <div className="flex justify-between text-[10px] text-white/30">
          <span>10%</span>
          <button
            onClick={() => setImageScale(100)}
            className="text-purple-400/60 hover:text-purple-400 transition-colors"
          >
            Reset
          </button>
          <span>200%</span>
        </div>
      </div>

      {/* Flip */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-white/70">Flip</label>
        <div className="flex gap-2">
          <FlipButton
            direction="horizontal"
            isActive={flipHorizontal}
            onClick={() => setFlipHorizontal((prev) => !prev)}
          />
          <FlipButton
            direction="vertical"
            isActive={flipVertical}
            onClick={() => setFlipVertical((prev) => !prev)}
          />
        </div>
      </div>
    </div>
  );
}

export default TransformPanel;
