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
  ScanEye,
  Aperture,
  FlashlightOff,
  Moon,
  Droplets,
  Diamond,
  Scan,
  Contrast,
  Building,
  Car,
  Triangle,
  Lightbulb,
  Columns,
  CarFront,
  Feather,
  CircleDot,
  TreeDeciduous,
  Armchair,
  CoffeeIcon,
  BedDouble,
  FlipHorizontal,
  Soup,
  Landmark,
  Flower2,
  BookOpen,
  RectangleHorizontal,
  CloudSun,
  SunMedium,
  Shirt,
  UserCircle,
  SunDim
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
  {
    id: 'studio-editorial',
    name: 'Studio Editorial',
    icon: Aperture,
    description: 'Sharp studio, gray bg',
    color: 'text-slate-400',
  },
  {
    id: 'flash-glamour',
    name: 'Flash Glamour',
    icon: FlashlightOff,
    description: 'Night event, direct flash',
    color: 'text-pink-300',
  },
  {
    id: 'cinematic-profile',
    name: 'Cinematic Profile',
    icon: Moon,
    description: 'Low key, Rembrandt light',
    color: 'text-indigo-400',
  },
  {
    id: 'wet-beauty',
    name: 'Wet Beauty',
    icon: Droplets,
    description: 'Water droplets, glistening',
    color: 'text-sky-400',
  },
  {
    id: 'diamond-studio',
    name: 'Diamond Studio',
    icon: Diamond,
    description: 'Ultra-detailed craftsmanship',
    color: 'text-cyan-300',
  },
  {
    id: 'macro-droplets',
    name: 'Macro Droplets',
    icon: Scan,
    description: 'Extreme close-up, wet skin',
    color: 'text-blue-300',
  },
  {
    id: 'chiaroscuro',
    name: 'Chiaroscuro',
    icon: Contrast,
    description: 'Single spotlight, deep shadows',
    color: 'text-amber-600',
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    icon: Building,
    description: 'Industrial concrete, geometric',
    color: 'text-zinc-400',
  },
  {
    id: 'paparazzi-flash',
    name: 'Paparazzi Flash',
    icon: Car,
    description: 'Night car exit, candid',
    color: 'text-red-300',
  },
  {
    id: 'prism-art',
    name: 'Prism Art',
    icon: Triangle,
    description: 'Rainbow refraction, avant-garde',
    color: 'text-fuchsia-300',
  },
  {
    id: 'sharp-strobe',
    name: 'Sharp Strobe',
    icon: Lightbulb,
    description: 'Direct flash, high contrast',
    color: 'text-white',
  },
  {
    id: 'concrete-exterior',
    name: 'Concrete Exterior',
    icon: Columns,
    description: 'Brutalist outdoor, cold light',
    color: 'text-gray-400',
  },
  {
    id: 'luxury-exit',
    name: 'Luxury Exit',
    icon: CarFront,
    description: 'Night car flash, celebrity',
    color: 'text-violet-300',
  },
  {
    id: 'soft-minimalist',
    name: 'Soft Minimalist',
    icon: Feather,
    description: 'Cream tones, bright airy',
    color: 'text-amber-100',
  },
  {
    id: 'velvet-noir',
    name: 'Velvet Noir',
    icon: CircleDot,
    description: 'Low key, black velvet',
    color: 'text-purple-300',
  },
  {
    id: 'garden-bokeh',
    name: 'Garden Bokeh',
    icon: TreeDeciduous,
    description: 'Dappled sunlight, golden',
    color: 'text-green-300',
  },
  {
    id: 'car-sunset',
    name: 'Car Sunset',
    icon: Armchair,
    description: 'Luxury interior, golden hour',
    color: 'text-orange-400',
  },
  {
    id: 'parisian-cafe',
    name: 'Parisian Cafe',
    icon: CoffeeIcon,
    description: 'Street style, overcast chic',
    color: 'text-stone-300',
  },
  {
    id: 'linen-morning',
    name: 'Linen Morning',
    icon: BedDouble,
    description: 'White sheets, soft blinds',
    color: 'text-cream-200',
  },
  {
    id: 'mirror-reflection',
    name: 'Mirror Reflection',
    icon: FlipHorizontal,
    description: 'Vintage mirror, getting ready',
    color: 'text-pink-200',
  },
  {
    id: 'cafe-cozy',
    name: 'Cafe Cozy',
    icon: Soup,
    description: 'Ceramic cup, warm sweater',
    color: 'text-amber-200',
  },
  {
    id: 'stone-wall',
    name: 'Stone Wall',
    icon: Landmark,
    description: 'Golden hour, Kodak warmth',
    color: 'text-stone-400',
  },
  {
    id: 'flower-walk',
    name: 'Flower Walk',
    icon: Flower2,
    description: 'Candid bouquet, pastel tones',
    color: 'text-pink-300',
  },
  {
    id: 'book-corner',
    name: 'Book Corner',
    icon: BookOpen,
    description: 'Sunlit reading, dust motes',
    color: 'text-yellow-200',
  },
  {
    id: 'plaster-wall',
    name: 'Plaster Wall',
    icon: RectangleHorizontal,
    description: 'Beige texture, serene calm',
    color: 'text-amber-100',
  },
  {
    id: 'curtain-dreams',
    name: 'Curtain Dreams',
    icon: CloudSun,
    description: 'Sheer shadows, ethereal',
    color: 'text-sky-200',
  },
  {
    id: 'pure-white',
    name: 'Pure White',
    icon: SunMedium,
    description: 'High key, bright airy',
    color: 'text-white',
  },
  {
    id: 'monochrome-beige',
    name: 'Monochrome Beige',
    icon: Shirt,
    description: 'Tan cream palette, calm',
    color: 'text-orange-100',
  },
  {
    id: 'gentle-profile',
    name: 'Gentle Profile',
    icon: UserCircle,
    description: 'Back view, low bun, delicate',
    color: 'text-rose-200',
  },
  {
    id: 'shadow-play',
    name: 'Shadow Play',
    icon: SunDim,
    description: 'Golden hour shadows, warm',
    color: 'text-orange-300',
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
