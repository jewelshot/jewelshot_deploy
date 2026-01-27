/**
 * Vector3Input - Input for X, Y, Z values
 * 
 * Atomic Architecture: Atom component
 * Used for position, rotation, scale controls
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { Vector3Values } from '@/lib/3d/types';

interface Vector3InputProps {
  label: string;
  value: Vector3Values;
  onChange: (value: Vector3Values) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  showSliders?: boolean;
  precision?: number;
}

export function Vector3Input({
  label,
  value,
  onChange,
  min = -1000,
  max = 1000,
  step = 0.1,
  unit = '',
  disabled = false,
  showSliders = false,
  precision = 2,
}: Vector3InputProps) {
  // Local state for input values (allows typing without immediate updates)
  const [localValues, setLocalValues] = useState({
    x: value.x.toFixed(precision),
    y: value.y.toFixed(precision),
    z: value.z.toFixed(precision),
  });

  // Sync local values when prop changes
  useEffect(() => {
    setLocalValues({
      x: value.x.toFixed(precision),
      y: value.y.toFixed(precision),
      z: value.z.toFixed(precision),
    });
  }, [value, precision]);

  const handleInputChange = useCallback((axis: 'x' | 'y' | 'z', inputValue: string) => {
    setLocalValues(prev => ({ ...prev, [axis]: inputValue }));
  }, []);

  const handleInputBlur = useCallback((axis: 'x' | 'y' | 'z') => {
    const numValue = parseFloat(localValues[axis]);
    if (!isNaN(numValue)) {
      const clamped = Math.max(min, Math.min(max, numValue));
      onChange({ ...value, [axis]: clamped });
    } else {
      // Reset to current value if invalid
      setLocalValues(prev => ({ ...prev, [axis]: value[axis].toFixed(precision) }));
    }
  }, [localValues, value, onChange, min, max, precision]);

  const handleSliderChange = useCallback((axis: 'x' | 'y' | 'z', sliderValue: number) => {
    onChange({ ...value, [axis]: sliderValue });
  }, [value, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, axis: 'x' | 'y' | 'z') => {
    if (e.key === 'Enter') {
      handleInputBlur(axis);
      (e.target as HTMLInputElement).blur();
    }
  }, [handleInputBlur]);

  const axisColors = {
    x: 'text-red-400 border-red-500/30 focus:border-red-500/60',
    y: 'text-green-400 border-green-500/30 focus:border-green-500/60',
    z: 'text-blue-400 border-blue-500/30 focus:border-blue-500/60',
  };

  const sliderColors = {
    x: 'accent-red-500',
    y: 'accent-green-500',
    z: 'accent-blue-500',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/70">{label}</span>
        {unit && <span className="text-[10px] text-white/40">{unit}</span>}
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {(['x', 'y', 'z'] as const).map((axis) => (
          <div key={axis} className="space-y-1">
            {/* Label */}
            <span className={`text-[10px] font-medium uppercase ${axisColors[axis].split(' ')[0]}`}>
              {axis}
            </span>
            
            {/* Input */}
            <input
              type="text"
              value={localValues[axis]}
              onChange={(e) => handleInputChange(axis, e.target.value)}
              onBlur={() => handleInputBlur(axis)}
              onKeyDown={(e) => handleKeyDown(e, axis)}
              disabled={disabled}
              className={`w-full rounded border bg-black/30 px-2 py-1 text-xs text-white outline-none transition-colors disabled:opacity-50 ${axisColors[axis]}`}
            />
            
            {/* Slider (optional) */}
            {showSliders && (
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[axis]}
                onChange={(e) => handleSliderChange(axis, parseFloat(e.target.value))}
                disabled={disabled}
                className={`w-full h-1 rounded-full bg-white/10 cursor-pointer disabled:opacity-50 ${sliderColors[axis]}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vector3Input;
