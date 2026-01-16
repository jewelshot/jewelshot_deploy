/**
 * ColorsPanel - Molecule Component
 * Professional color adjustment controls
 *
 * Atomic Architecture:
 * - Uses AdjustSlider atoms for consistent UI
 * - Manages color filter state
 * - Provides callback for parent components
 */

'use client';

import React, { useState, useEffect } from 'react';
import { AdjustSlider } from '@/components/atoms/AdjustSlider';
import { useLanguage } from '@/lib/i18n';

interface ColorsPanelProps {
  /**
   * Callback when any color value changes
   */
  onColorChange?: (colors: ColorFilters) => void;
}

export interface ColorFilters {
  temperature?: number; // -100 to +100 (Blue ↔ Orange)
  tint?: number; // -100 to +100 (Green ↔ Magenta)
  saturation?: number; // -100 to +100 (Grayscale ↔ Vivid)
  vibrance?: number; // -100 to +100 (Smart saturation)
}

/**
 * ColorsPanel Component
 * Provides professional color adjustment controls
 */
export function ColorsPanel({ onColorChange }: ColorsPanelProps) {
  const { t } = useLanguage();
  // Color state
  const [temperature, setTemperature] = useState(0);
  const [tint, setTint] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [vibrance, setVibrance] = useState(0);

  // Notify parent on change
  useEffect(() => {
    if (onColorChange) {
      onColorChange({
        temperature,
        tint,
        saturation,
        vibrance,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temperature, tint, saturation, vibrance]);

  return (
    <div className="flex flex-col gap-6">
      {/* Color Balance Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-white/80">{t.canvas.colors}</h4>
        </div>
        <div className="flex flex-col gap-3">
          <AdjustSlider
            label={t.canvas.temperature}
            value={temperature}
            min={-75}
            max={75}
            onChange={setTemperature}
          />
          <AdjustSlider
            label={t.canvas.tint}
            value={tint}
            min={-75}
            max={75}
            onChange={setTint}
          />
        </div>
      </div>

      {/* Color Intensity Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-white/80">{t.canvas.vibrance}</h4>
        </div>
        <div className="flex flex-col gap-3">
          <AdjustSlider
            label={t.canvas.saturation}
            value={saturation}
            min={-75}
            max={75}
            onChange={setSaturation}
          />
          <AdjustSlider
            label={t.canvas.vibrance}
            value={vibrance}
            min={-75}
            max={75}
            onChange={setVibrance}
          />
        </div>
      </div>
    </div>
  );
}

export default ColorsPanel;
