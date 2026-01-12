/**
 * QuickPresetsGrid Component
 * 
 * Built-in Quick Presets: Top 10 Most Used
 * For more presets, users can browse the full Library
 */

'use client';

import React from 'react';
import { 
  ShoppingBag, Sun, Camera, Focus, Sparkles, 
  Sunset, Smile, Crown, Droplet, Gem
} from 'lucide-react';

interface QuickPreset {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
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
    icon: ShoppingBag, 
    description: 'White background, catalog ready', 
    color: 'text-blue-400' 
  },
  { 
    id: 'high-key', 
    name: 'High Key', 
    icon: Sun, 
    description: 'Ultra-clean commercial beauty', 
    color: 'text-yellow-300' 
  },
  { 
    id: 'lifestyle', 
    name: 'Lifestyle', 
    icon: Camera, 
    description: 'Natural, Instagram-ready', 
    color: 'text-pink-400' 
  },
  { 
    id: 'macro', 
    name: 'Macro', 
    icon: Focus, 
    description: 'Extreme close-up details', 
    color: 'text-cyan-400' 
  },
  { 
    id: 'luxury', 
    name: 'Luxury Editorial', 
    icon: Crown, 
    description: 'High fashion elegance', 
    color: 'text-amber-400' 
  },
  { 
    id: 'golden-hour', 
    name: 'Golden Hour', 
    icon: Sunset, 
    description: 'Warm outdoor lighting', 
    color: 'text-orange-400' 
  },
  { 
    id: 'joy-burst', 
    name: 'Joyful', 
    icon: Smile, 
    description: 'Genuine expressions', 
    color: 'text-yellow-400' 
  },
  { 
    id: 'dewy-studio', 
    name: 'Dewy Fresh', 
    icon: Droplet, 
    description: 'Glowing skin, wet-look', 
    color: 'text-cyan-300' 
  },
  { 
    id: 'diamond-sparkle', 
    name: 'Diamond Sparkle', 
    icon: Gem, 
    description: 'Hard light fire, macro', 
    color: 'text-violet-300' 
  },
  { 
    id: 'soft-minimalist', 
    name: 'Minimalist', 
    icon: Sparkles, 
    description: 'Clean, elegant simplicity', 
    color: 'text-slate-300' 
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
        <span className="text-xs text-white/30">
          10 most used
        </span>
      </div>

      {/* Preset Grid - 2 columns */}
      <div className="grid grid-cols-2 gap-2">
        {QUICK_PRESETS.map((preset) => {
          const IconComponent = preset.icon;
          
          return (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset.id)}
              disabled={disabled}
              className={`
                group relative flex flex-col items-start gap-1.5 p-3 rounded-lg
                bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
                transition-all duration-200 text-left
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Icon */}
              <div className={`${preset.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <IconComponent className="w-4 h-4" />
              </div>
              
              {/* Name */}
              <span className="text-xs font-medium text-white/90 group-hover:text-white">
                {preset.name}
              </span>
              
              {/* Description */}
              <span className="text-[10px] text-white/40 group-hover:text-white/60 leading-tight">
                {preset.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Library hint */}
      <p className="text-[10px] text-white/30 text-center pt-1">
        Browse the Library for 200+ more presets
      </p>
    </div>
  );
}

export default QuickPresetsGrid;
