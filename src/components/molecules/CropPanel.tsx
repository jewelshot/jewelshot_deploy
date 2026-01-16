'use client';

import React, { useState } from 'react';
import CropRatioButton from '@/components/atoms/CropRatioButton';
import { useLanguage } from '@/lib/i18n';

interface CropRatio {
  label: string;
  ratio: number | null; // null for "Free"
}

interface CropPanelProps {
  /**
   * Crop ratio change handler
   */
  onCropRatioChange: (ratio: number | null) => void;
}

/**
 * CropPanel - Molecule component for crop controls
 */
export function CropPanel({ onCropRatioChange }: CropPanelProps) {
  const { t } = useLanguage();
  const [selectedRatio, setSelectedRatio] = useState<number | null | undefined>(
    undefined
  );

  const cropRatios: CropRatio[] = [
    { label: t.canvas.freeform, ratio: null },
    { label: '1:1', ratio: 1 },
    { label: '4:3', ratio: 4 / 3 },
    { label: '3:4', ratio: 3 / 4 },
    { label: '16:9', ratio: 16 / 9 },
    { label: '9:16', ratio: 9 / 16 },
  ];

  const handleRatioClick = (ratio: number | null) => {
    setSelectedRatio(ratio);
    onCropRatioChange(ratio);
  };

  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-white">{t.canvas.aspectRatio}</h4>
      <div className="grid grid-cols-3 gap-3">
        {cropRatios.map((item) => (
          <CropRatioButton
            key={item.label}
            label={item.label}
            ratio={item.ratio}
            active={selectedRatio === item.ratio}
            onClick={() => handleRatioClick(item.ratio)}
          />
        ))}
      </div>
    </div>
  );
}

export default CropPanel;
