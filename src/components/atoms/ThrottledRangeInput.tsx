/**
 * ThrottledRangeInput Component
 * 
 * A drop-in replacement for <input type="range"> that throttles onChange
 * to prevent excessive re-renders while maintaining smooth visual feedback.
 * 
 * Usage: Simply replace <input type="range" .../> with <ThrottledRangeInput .../>
 */

'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';

interface ThrottledRangeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  value: number;
  onChange: (value: number) => void;
  /** Throttle delay in ms. Default: 16ms (~60fps) */
  throttleMs?: number;
}

export const ThrottledRangeInput = memo(function ThrottledRangeInput({
  value,
  onChange,
  throttleMs = 16,
  className = 'viewer-slider',
  ...props
}: ThrottledRangeInputProps) {
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

    if (timeSinceLastCall >= throttleMs) {
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
      }, throttleMs - timeSinceLastCall);
    }
  }, [onChange, throttleMs]);

  // Ensure final value is sent on mouse up / touch end
  const handleChangeEnd = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onChange(localValue);
  }, [onChange, localValue]);

  return (
    <input
      type="range"
      value={localValue}
      onChange={handleChange}
      onMouseUp={handleChangeEnd}
      onTouchEnd={handleChangeEnd}
      className={className}
      {...props}
    />
  );
});

export default ThrottledRangeInput;
