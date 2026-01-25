'use client';

import React, { useState, useEffect } from 'react';
import { RotateSlider } from '@/components/atoms/RotateSlider';
import { FlipButton } from '@/components/atoms/FlipButton';
import { ZoomIn, ZoomOut } from 'lucide-react';

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
  imageScale: number; // Image size scale (0.1 - 2.0)
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

  const handleQuickScale = (delta: number) => {
    const newValue = imageScale + delta;
    setImageScale(Math.max(10, Math.min(200, newValue)));
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Rotate */}
      <div>
        <RotateSlider value={rotation} onChange={setRotation} />
      </div>

      {/* Scale - Matching RotateSlider style */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-white/70">Scale</label>
          <span className="font-mono text-xs text-violet-400">{imageScale}%</span>
        </div>

        <div className="flex items-center gap-2">
          {/* -10% Button */}
          <button
            onClick={() => handleQuickScale(-10)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
            aria-label="Scale down 10%"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          {/* Slider */}
          <div className="relative flex flex-1 items-center">
            <input
              type="range"
              min={10}
              max={200}
              value={imageScale}
              onChange={(e) => setImageScale(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
              style={{
                background: `linear-gradient(to right, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.3) ${((imageScale - 10) / 190) * 100}%, rgba(255,255,255,0.1) ${((imageScale - 10) / 190) * 100}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <style jsx>{`
              input[type='range']::-webkit-slider-thumb {
                appearance: none;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #8b5cf6;
                cursor: pointer;
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
                transition: all 0.15s;
              }
              input[type='range']::-webkit-slider-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
              }
              input[type='range']::-moz-range-thumb {
                width: 12px;
                height: 12px;
                border: none;
                border-radius: 50%;
                background: #8b5cf6;
                cursor: pointer;
                box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
                transition: all 0.15s;
              }
              input[type='range']::-moz-range-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3);
              }
            `}</style>
          </div>

          {/* +10% Button */}
          <button
            onClick={() => handleQuickScale(10)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-400"
            aria-label="Scale up 10%"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Reset to 100% */}
        <div className="flex justify-center">
          <button
            onClick={() => setImageScale(100)}
            className="text-[10px] text-violet-400/60 hover:text-violet-400 transition-colors"
          >
            Reset to 100%
          </button>
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
