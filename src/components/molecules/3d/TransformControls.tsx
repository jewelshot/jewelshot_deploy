/**
 * TransformControls - Complete transform panel for 3D models
 * 
 * Atomic Architecture: Molecule component
 * Contains Position, Rotation, Scale, and Flip controls
 */

'use client';

import React, { useCallback } from 'react';
import {
  RotateCcw,
  Move,
  RotateCw,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
  Layers,
} from 'lucide-react';
import { Vector3Input } from '@/components/atoms/Vector3Input';
import type { TransformState, FlipState, Vector3Values } from '@/lib/3d/types';
import { DEFAULT_TRANSFORM, DEFAULT_FLIP } from '@/lib/3d/types';

interface TransformControlsProps {
  transform: TransformState;
  flip: FlipState;
  onTransformChange: (transform: TransformState) => void;
  onFlipChange: (flip: FlipState) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function TransformControls({
  transform,
  flip,
  onTransformChange,
  onFlipChange,
  disabled = false,
  compact = false,
}: TransformControlsProps) {
  // Position change handler
  const handlePositionChange = useCallback((position: Vector3Values) => {
    onTransformChange({ ...transform, position });
  }, [transform, onTransformChange]);

  // Rotation change handler
  const handleRotationChange = useCallback((rotation: Vector3Values) => {
    onTransformChange({ ...transform, rotation });
  }, [transform, onTransformChange]);

  // Scale change handler
  const handleScaleChange = useCallback((scale: Vector3Values) => {
    onTransformChange({ ...transform, scale });
  }, [transform, onTransformChange]);

  // Flip handler
  const handleFlip = useCallback((axis: keyof FlipState) => {
    onFlipChange({ ...flip, [axis]: !flip[axis] });
  }, [flip, onFlipChange]);

  // Reset all transforms
  const handleReset = useCallback(() => {
    onTransformChange(DEFAULT_TRANSFORM);
    onFlipChange(DEFAULT_FLIP);
  }, [onTransformChange, onFlipChange]);

  // Quick rotation buttons
  const rotateQuick = useCallback((axis: 'x' | 'y' | 'z', degrees: number) => {
    const newRotation = { ...transform.rotation };
    newRotation[axis] = (newRotation[axis] + degrees) % 360;
    if (newRotation[axis] < 0) newRotation[axis] += 360;
    onTransformChange({ ...transform, rotation: newRotation });
  }, [transform, onTransformChange]);

  return (
    <div className={`space-y-4 ${compact ? 'text-xs' : ''}`}>
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-white/80">Transform</span>
        </div>
        <button
          onClick={handleReset}
          disabled={disabled}
          className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
          title="Reset All"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Position */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Move className="h-3.5 w-3.5 text-white/60" />
          <span className="text-xs font-medium text-white/70">Position</span>
        </div>
        <Vector3Input
          label=""
          value={transform.position}
          onChange={handlePositionChange}
          min={-100}
          max={100}
          step={0.1}
          unit="mm"
          disabled={disabled}
          precision={2}
        />
      </div>

      {/* Rotation */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCw className="h-3.5 w-3.5 text-white/60" />
            <span className="text-xs font-medium text-white/70">Rotation</span>
          </div>
          {/* Quick rotation buttons */}
          <div className="flex gap-1">
            {[90, -90].map((deg) => (
              <button
                key={deg}
                onClick={() => rotateQuick('y', deg)}
                disabled={disabled}
                className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/60 transition-colors hover:bg-white/20 hover:text-white disabled:opacity-50"
              >
                {deg > 0 ? '+' : ''}{deg}°
              </button>
            ))}
          </div>
        </div>
        <Vector3Input
          label=""
          value={transform.rotation}
          onChange={handleRotationChange}
          min={0}
          max={360}
          step={1}
          unit="°"
          disabled={disabled}
          precision={1}
          showSliders={!compact}
        />
      </div>

      {/* Scale */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Maximize2 className="h-3.5 w-3.5 text-white/60" />
          <span className="text-xs font-medium text-white/70">Scale</span>
        </div>
        <Vector3Input
          label=""
          value={transform.scale}
          onChange={handleScaleChange}
          min={0.01}
          max={10}
          step={0.01}
          unit="x"
          disabled={disabled}
          precision={2}
        />
        {/* Uniform scale checkbox */}
        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="uniform-scale"
            className="h-3 w-3 rounded border-white/20 bg-white/10"
            defaultChecked
          />
          <label htmlFor="uniform-scale" className="text-[10px] text-white/50">
            Uniform scale
          </label>
        </div>
      </div>

      {/* Flip Controls */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="mb-3 flex items-center gap-2">
          <FlipHorizontal className="h-3.5 w-3.5 text-white/60" />
          <span className="text-xs font-medium text-white/70">Flip / Mirror</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* Flip X */}
          <button
            onClick={() => handleFlip('x')}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors ${
              flip.x
                ? 'border-red-500/50 bg-red-500/20 text-red-400'
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/10'
            } disabled:opacity-50`}
          >
            <FlipHorizontal className="h-4 w-4" />
            <span className="text-[9px] font-medium">X</span>
          </button>

          {/* Flip Y */}
          <button
            onClick={() => handleFlip('y')}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors ${
              flip.y
                ? 'border-green-500/50 bg-green-500/20 text-green-400'
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/10'
            } disabled:opacity-50`}
          >
            <FlipVertical className="h-4 w-4" />
            <span className="text-[9px] font-medium">Y</span>
          </button>

          {/* Flip Z */}
          <button
            onClick={() => handleFlip('z')}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors ${
              flip.z
                ? 'border-blue-500/50 bg-blue-500/20 text-blue-400'
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/10'
            } disabled:opacity-50`}
          >
            <span className="text-xs font-bold">Z</span>
            <span className="text-[9px] font-medium">Z</span>
          </button>

          {/* Flip Normals */}
          <button
            onClick={() => handleFlip('normals')}
            disabled={disabled}
            className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-colors ${
              flip.normals
                ? 'border-purple-500/50 bg-purple-500/20 text-purple-400'
                : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:bg-white/10'
            } disabled:opacity-50`}
            title="Flip face normals (inside-out)"
          >
            <Layers className="h-4 w-4" />
            <span className="text-[9px] font-medium">N</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransformControls;
