/**
 * QuickPresetsGrid Component
 * 
 * Built-in quick presets for common jewelry photography use cases
 * These work with any jewelry type and adapt to user's generation settings
 */

'use client';

import React from 'react';
import { 
  ShoppingBag, 
  Camera, 
  Sparkles, 
  User, 
  Palette,
  Sun,
  Gem,
  Image,
  Zap,
  Film,
  Laugh,
  Focus,
  Building2,
  Leaf,
  Sunset,
  Coffee,
  Square,
  Blinds,
  Hand,
  ScanEye
} from 'lucide-react';

interface QuickPreset {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

// Top 10 most popular use cases for jewelry photography
const QUICK_PRESETS: QuickPreset[] = [
  {
    id: 'e-commerce',
    name: 'E-Commerce',
    icon: ShoppingBag,
    description: 'White background, catalog ready',
    color: 'text-blue-400',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: Camera,
    description: 'Natural, Instagram-ready shots',
    color: 'text-pink-400',
  },
  {
    id: 'on-model',
    name: 'On Model',
    icon: User,
    description: 'Professional model placement',
    color: 'text-purple-400',
  },
  {
    id: 'still-life',
    name: 'Still Life',
    icon: Image,
    description: 'Minimalist flat lay aesthetic',
    color: 'text-rose-400',
  },
  {
    id: 'close-up',
    name: 'Close-Up',
    icon: Zap,
    description: 'Macro detail shots',
    color: 'text-amber-400',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    icon: Gem,
    description: 'High-end dramatic lighting',
    color: 'text-yellow-400',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    icon: Sparkles,
    description: 'Sophisticated presentation',
    color: 'text-violet-400',
  },
  {
    id: 'natural',
    name: 'Natural',
    icon: Sun,
    description: 'Organic, authentic feel',
    color: 'text-green-400',
  },
  {
    id: 'modern',
    name: 'Modern',
    icon: Palette,
    description: 'Clean, contemporary look',
    color: 'text-cyan-400',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    icon: Film,
    description: 'Bold, high-contrast style',
    color: 'text-red-400',
  },
  {
    id: 'high-key-joy',
    name: 'High-Key Joy',
    icon: Laugh,
    description: 'Bright, joyful commercial',
    color: 'text-orange-400',
  },
  {
    id: 'macro-ecommerce',
    name: 'Macro Detail',
    icon: Focus,
    description: 'Extreme close-up on skin',
    color: 'text-teal-400',
  },
  {
    id: 'editorial-luxury',
    name: 'Editorial Luxury',
    icon: Building2,
    description: 'High fashion apartment shot',
    color: 'text-fuchsia-400',
  },
  {
    id: 'rustic-morning',
    name: 'Rustic Morning',
    icon: Leaf,
    description: 'Natural light, cozy room',
    color: 'text-lime-400',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    icon: Sunset,
    description: 'Outdoor sunset warmth',
    color: 'text-amber-500',
  },
  {
    id: 'urban-cafe',
    name: 'Urban Cafe',
    icon: Coffee,
    description: 'Documentary cafe style',
    color: 'text-stone-400',
  },
  {
    id: 'bare-canvas',
    name: 'Bare Canvas',
    icon: Square,
    description: 'Clean skin, ready for jewelry',
    color: 'text-neutral-400',
  },
  {
    id: 'venetian-light',
    name: 'Venetian Light',
    icon: Blinds,
    description: 'Dramatic blind shadows',
    color: 'text-yellow-500',
  },
  {
    id: 'coffee-moment',
    name: 'Coffee Moment',
    icon: Hand,
    description: 'Candid casual elegance',
    color: 'text-orange-300',
  },
  {
    id: 'macro-skin',
    name: 'Macro Skin',
    icon: ScanEye,
    description: 'Hyper-realistic texture',
    color: 'text-rose-300',
  },
];

interface QuickPresetsGridProps {
  onPresetSelect: (presetId: string) => void;
  disabled?: boolean;
}

export function QuickPresetsGrid({ onPresetSelect, disabled = false }: QuickPresetsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {QUICK_PRESETS.map((preset) => {
        const Icon = preset.icon;
        
        return (
          <button
            key={preset.id}
            onClick={() => onPresetSelect(preset.id)}
            disabled={disabled}
            className={`
              group flex flex-col items-start gap-1 rounded-lg border border-white/10 
              bg-white/[0.02] p-2 text-left transition-all
              hover:border-purple-500/30 hover:bg-purple-500/5
              disabled:cursor-not-allowed disabled:opacity-50
            `}
          >
            <div className="flex items-center gap-1.5">
              <Icon className={`h-3.5 w-3.5 ${preset.color} transition-transform group-hover:scale-110`} />
              <span className="text-[10px] font-medium text-white/90">{preset.name}</span>
            </div>
            <span className="text-[8px] leading-tight text-white/40">
              {preset.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default QuickPresetsGrid;
