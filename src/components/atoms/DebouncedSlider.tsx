/**
 * DebouncedSlider Component
 * 
 * A slider that provides immediate visual feedback but throttles
 * onChange calls to prevent excessive re-renders.
 */

'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

interface DebouncedSliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
  /** Delay in ms before calling onChange. Default: 16ms (60fps) */
  delay?: number;
  /** Show label and value display. Default: true */
  showLabel?: boolean;
  className?: string;
}

export const DebouncedSlider = memo(function DebouncedSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = '',
  icon,
  delay = 16,
  showLabel = true,
  className = '',
}: DebouncedSliderProps) {
  // Local state for immediate visual feedback
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);

  // Sync local value with prop when prop changes (external update)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);

    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;

    if (timeSinceLastCall >= delay) {
      // Call immediately
      lastCallRef.current = now;
      onChange(newValue);
    } else {
      // Schedule for later (trailing call)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        onChange(newValue);
      }, delay - timeSinceLastCall);
    }
  }, [onChange, delay]);

  // Ensure final value is sent on mouse up / touch end
  const handleChangeEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onChange(localValue);
  }, [onChange, localValue]);

  const displayValue = step < 1 ? localValue.toFixed(1) : localValue.toFixed(0);

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {icon && <span className="text-white/40">{icon}</span>}
            <span className="text-[10px] text-white/50">{label}</span>
          </div>
          <span className="text-[10px] font-mono text-white/60">
            {displayValue}{unit}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={localValue}
        onChange={handleChange}
        onMouseUp={handleChangeEnd}
        onTouchEnd={handleChangeEnd}
        className="w-full accent-purple-500"
      />
    </div>
  );
});

export default DebouncedSlider;
