'use client';

import React from 'react';

interface AdjustSliderProps {
  /**
   * Slider label
   */
  label: string;
  /**
   * Current value
   */
  value: number;
  /**
   * Minimum value
   */
  min: number;
  /**
   * Maximum value
   */
  max: number;
  /**
   * Change handler
   */
  onChange: (value: number) => void;
  /**
   * Step value
   */
  step?: number;
}

/**
 * AdjustSlider - Atomic component for image adjustment control
 */
export function AdjustSlider({
  label,
  value,
  min,
  max,
  onChange,
  step = 1,
}: AdjustSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleReset = () => {
    onChange(0);
  };

  // Calculate percentage for gradient
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-medium text-white/60">{label}</label>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-white/80">
            {value > 0 ? '+' : ''}
            {value}
          </span>
          {value !== 0 && (
            <button
              onClick={handleReset}
              className="flex h-4 w-4 items-center justify-center rounded text-[10px] text-white/30 hover:bg-white/10 hover:text-white/60"
              title="Reset"
              aria-label={`Reset ${label}`}
            >
              ↺
            </button>
          )}
        </div>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          title={`${label}: ${value}`}
          aria-label={`${label} adjustment`}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
          style={{
            background: `linear-gradient(to right, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.25) ${percentage}%, rgba(255,255,255,0.08) ${percentage}%, rgba(255,255,255,0.08) 100%)`,
          }}
        />
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            appearance: none;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
            transition: all 0.15s;
          }
          input[type='range']::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15);
          }
          input[type='range']::-moz-range-thumb {
            width: 10px;
            height: 10px;
            border: none;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
            transition: all 0.15s;
          }
          input[type='range']::-moz-range-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.15);
          }
        `}</style>
      </div>
    </div>
  );
}

export default AdjustSlider;
