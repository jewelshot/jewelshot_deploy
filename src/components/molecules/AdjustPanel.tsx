'use client';

import React, { useState, useEffect } from 'react';
import { AdjustSlider } from '@/components/atoms/AdjustSlider';
import { useLanguage } from '@/lib/i18n';

export interface AdjustState {
  // Temel Işık
  brightness: number;
  contrast: number;
  exposure: number;
  // İleri Ton Kontrolü
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  // Netlik & Detay
  clarity: number;
  sharpness: number;
  dehaze: number;
}

interface AdjustPanelProps {
  /**
   * Adjust change handler
   */
  onAdjustChange?: (adjust: AdjustState) => void;
}

/**
 * AdjustPanel - Molecule component for image adjustment controls
 */
export function AdjustPanel({ onAdjustChange }: AdjustPanelProps) {
  const { t } = useLanguage();
  const [adjust, setAdjust] = useState<AdjustState>({
    brightness: 0,
    contrast: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    clarity: 0,
    sharpness: 0,
    dehaze: 0,
  });

  // Notify parent of changes
  useEffect(() => {
    if (onAdjustChange) {
      onAdjustChange(adjust);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adjust]);

  const handleChange = (key: keyof AdjustState, value: number) => {
    setAdjust((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Basic Light */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-white/80">{t.canvas.adjustments}</h4>
        </div>
        <div className="flex flex-col gap-3">
          <AdjustSlider
            label={t.canvas.brightness}
            value={adjust.brightness}
            min={-75}
            max={75}
            onChange={(v) => handleChange('brightness', v)}
          />
          <AdjustSlider
            label={t.canvas.contrast}
            value={adjust.contrast}
            min={-75}
            max={75}
            onChange={(v) => handleChange('contrast', v)}
          />
          <AdjustSlider
            label={t.canvas.exposure}
            value={adjust.exposure}
            min={-75}
            max={75}
            onChange={(v) => handleChange('exposure', v)}
          />
        </div>
      </div>

      {/* Advanced Tone Control */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-white/80">
            {t.canvas.colors}
          </h4>
        </div>
        <div className="flex flex-col gap-3">
          <AdjustSlider
            label={t.canvas.highlights}
            value={adjust.highlights}
            min={-75}
            max={75}
            onChange={(v) => handleChange('highlights', v)}
          />
          <AdjustSlider
            label={t.canvas.shadows}
            value={adjust.shadows}
            min={-75}
            max={75}
            onChange={(v) => handleChange('shadows', v)}
          />
          <AdjustSlider
            label={t.canvas.whites}
            value={adjust.whites}
            min={-75}
            max={75}
            onChange={(v) => handleChange('whites', v)}
          />
          <AdjustSlider
            label={t.canvas.blacks}
            value={adjust.blacks}
            min={-75}
            max={75}
            onChange={(v) => handleChange('blacks', v)}
          />
        </div>
      </div>

      {/* Clarity & Detail */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-semibold text-white/80">
            {t.canvas.clarity}
          </h4>
        </div>
        <div className="flex flex-col gap-3">
          <AdjustSlider
            label={t.canvas.clarity}
            value={adjust.clarity}
            min={-75}
            max={75}
            onChange={(v) => handleChange('clarity', v)}
          />
          <AdjustSlider
            label={t.canvas.sharpness}
            value={adjust.sharpness}
            min={0}
            max={75}
            onChange={(v) => handleChange('sharpness', v)}
          />
          <AdjustSlider
            label={t.canvas.dehaze}
            value={adjust.dehaze}
            min={-75}
            max={75}
            onChange={(v) => handleChange('dehaze', v)}
          />
        </div>
      </div>
    </div>
  );
}

export default AdjustPanel;
