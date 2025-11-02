import React from 'react';
import { PresetCard } from '@/components/atoms/PresetCard';

interface QuickModeContentProps {
  onPresetSelect: (presetName: string) => void;
}

/**
 * QuickModeContent - Quick presets for instant generation
 * Shows visual preset cards for one-click generation
 */
export function QuickModeContent({ onPresetSelect }: QuickModeContentProps) {
  const presets = [
    {
      id: 'e-commerce',
      title: 'White Background',
      imagePath: '/presets/e-commerce.webp',
    },
    {
      id: 'still-life',
      title: 'Still Life',
      imagePath: '/presets/still-life.webp',
    },
    {
      id: 'on-model',
      title: 'On Model',
      imagePath: '/presets/on-model.webp',
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      imagePath: '/presets/lifestyle.webp',
    },
    {
      id: 'luxury',
      title: 'Luxury',
      imagePath: '/presets/luxury.webp',
    },
    {
      id: 'close-up',
      title: 'Close Up',
      imagePath: '/presets/close-up.webp',
    },
  ];

  return (
    <div className="space-y-2">
      {/* Info text */}
      <p className="text-[9px] text-white/40">
        Select a preset style for instant generation
      </p>

      {/* Preset Cards */}
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <PresetCard
            key={preset.id}
            title={preset.title}
            imagePath={preset.imagePath}
            onClick={() => onPresetSelect(preset.id)}
          />
        ))}
      </div>
    </div>
  );
}
