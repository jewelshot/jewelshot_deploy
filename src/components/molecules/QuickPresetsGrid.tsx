/**
 * QuickPresetsGrid Component
 * 
 * Built-in Quick Presets: Top 10 Most Used
 * Each preset shows a preview image for better visual selection
 * For more presets, users can browse the full Library
 */

'use client';

import React from 'react';
import Image from 'next/image';

interface QuickPreset {
  id: string;
  name: string;
  image: string;
  description: string;
}

// ============================================================================
// TOP 10 BUILT-IN PRESETS
// Most commonly used presets for quick access
// For more options, users can browse the full Library
// ============================================================================

const QUICK_PRESETS: QuickPreset[] = [
  { 
    id: 'e-commerce', 
    name: 'E-Commerce', 
    image: '/presets/e-commerce.webp',
    description: 'White background, catalog ready'
  },
  { 
    id: 'high-key', 
    name: 'High Key', 
    image: '/presets/high-key-joy.webp',
    description: 'Ultra-clean commercial beauty'
  },
  { 
    id: 'lifestyle', 
    name: 'Lifestyle', 
    image: '/presets/lifestyle.webp',
    description: 'Natural, Instagram-ready'
  },
  { 
    id: 'macro', 
    name: 'Macro', 
    image: '/presets/close-up.webp',
    description: 'Extreme close-up details'
  },
  { 
    id: 'luxury', 
    name: 'Luxury Editorial', 
    image: '/presets/editorial-luxury.webp',
    description: 'High fashion elegance'
  },
  { 
    id: 'golden-hour', 
    name: 'Golden Hour', 
    image: '/presets/golden-hour.webp',
    description: 'Warm outdoor lighting'
  },
  { 
    id: 'joy-burst', 
    name: 'Joyful', 
    image: '/presets/joy-burst.webp',
    description: 'Genuine expressions'
  },
  { 
    id: 'dewy-studio', 
    name: 'Dewy Fresh', 
    image: '/presets/dewy-studio.webp',
    description: 'Glowing skin, wet-look'
  },
  { 
    id: 'diamond-sparkle', 
    name: 'Diamond Sparkle', 
    image: '/presets/diamond-sparkle.webp',
    description: 'Hard light fire, macro'
  },
  { 
    id: 'soft-minimalist', 
    name: 'Minimalist', 
    image: '/presets/soft-minimalist.webp',
    description: 'Clean, elegant simplicity'
  },
];

interface QuickPresetsGridProps {
  onPresetSelect: (presetId: string) => void;
  disabled?: boolean;
}

export function QuickPresetsGrid({ onPresetSelect, disabled = false }: QuickPresetsGridProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
          Quick Presets
        </span>
      </div>

      {/* Preset Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-2">
        {QUICK_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onPresetSelect(preset.id)}
            disabled={disabled}
            className={`
              group relative overflow-hidden rounded-lg aspect-[4/3]
              border border-white/10 hover:border-white/30
              transition-all duration-300
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {/* Background Image */}
            <Image
              src={preset.image}
              alt={preset.name}
              fill
              sizes="(max-width: 768px) 50vw, 150px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-2.5">
              {/* Name */}
              <span className="text-xs font-medium text-white drop-shadow-lg">
                {preset.name}
              </span>
              
              {/* Description */}
              <span className="text-[10px] text-white/70 leading-tight mt-0.5 drop-shadow-md">
                {preset.description}
              </span>
            </div>
            
            {/* Hover Border Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 rounded-lg ring-1 ring-white/40 ring-inset" />
            </div>
          </button>
        ))}
      </div>

      {/* Library hint */}
      <p className="text-[10px] text-white/30 text-center pt-1">
        Browse the Library for 200+ more presets
      </p>
    </div>
  );
}

export default QuickPresetsGrid;
