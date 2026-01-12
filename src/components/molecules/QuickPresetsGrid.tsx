/**
 * QuickPresetsGrid Component
 * 
 * Preset Library: All Jewelry Types, Women, On Model
 * Organized by style categories for easy navigation
 */

'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, Camera, Sparkles, User, Sun, Gem, Zap, Film, Laugh, Focus,
  Building2, Leaf, Sunset, Coffee, Square, Blinds, Hand, Aperture, Moon,
  Droplets, Diamond, Scan, Contrast, Building, Lightbulb, Columns, Feather,
  CircleDot, TreeDeciduous, Armchair, BedDouble, FlipHorizontal, Landmark,
  Flower2, BookOpen, CloudSun, SunMedium, Shirt, SunDim, Layers, Fingerprint,
  Sparkle, Crop, Wind, HeartHandshake, Cloud, TreePine, RotateCcw, GlassWater,
  ShirtIcon, Grid3X3, Brain, Ear, Link2, CircleDashed, Activity, Scissors,
  SunSnow, Undo2, MoveHorizontal, Grip, StretchHorizontal, LayoutGrid, Sunrise,
  Paintbrush, Waves, Ribbon, CloudFog, Hexagon, Shield, Flame, CircleDotDashed,
  Target, Flashlight, Star, Droplet, PartyPopper, Smile, HandMetal, Shapes,
  Thermometer, CircleUser, Microscope, Move3D, ScanFace, FileSearch, ChevronDown,
  ChevronRight, Users, Crosshair, Eye, Gauge, Heart, Brush, Timer, Droplet as DropletIcon,
  PersonStanding, Blend, Shirt as ShirtBlaze, Minus, ArrowDownToLine, Palette as PaletteIcon,
  Lamp, Instagram, PartyPopperIcon, Glasses, Palmtree, Crown, Square as SquareIcon,
  Wand2, Pill
} from 'lucide-react';

interface QuickPreset {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
}

interface PresetCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  presets: QuickPreset[];
}

// ============================================================================
// PRESET LIBRARY: All Jewelry Types, Women, On Model
// ============================================================================

const PRESET_CATEGORIES: PresetCategory[] = [
  // -------------------------------------------------------------------------
  // STUDIO & COMMERCIAL
  // -------------------------------------------------------------------------
  {
    id: 'studio-commercial',
    name: 'Studio & Commercial',
    icon: Camera,
    color: 'text-blue-400',
    presets: [
      { id: 'e-commerce', name: 'E-Commerce', icon: ShoppingBag, description: 'White background, catalog ready', color: 'text-blue-400' },
      { id: 'high-key', name: 'High Key', icon: Sun, description: 'Ultra-clean commercial beauty', color: 'text-yellow-200' },
      { id: 'high-key-catalog', name: 'Catalog', icon: Target, description: 'White cyclorama, commercial', color: 'text-slate-100' },
      { id: 'bright-beauty', name: 'Bright Beauty', icon: Star, description: 'High-key, slicked hair', color: 'text-yellow-100' },
      { id: 'dewy-studio', name: 'Dewy Studio', icon: Droplet, description: 'Glowing skin, wet-look', color: 'text-cyan-200' },
      { id: 'butterfly-light', name: 'Butterfly Light', icon: Aperture, description: 'Paramount lighting, studio', color: 'text-violet-200' },
      { id: 'diamond-studio', name: 'Diamond Studio', icon: Diamond, description: 'Professional gemstone', color: 'text-cyan-300' },
      { id: 'still-life', name: 'Still Life', icon: Gem, description: 'Product-only elegance', color: 'text-green-400' },
      { id: 'macro', name: 'Macro', icon: Focus, description: 'Extreme close-up details', color: 'text-cyan-400' },
      { id: 'sharp-strobe', name: 'Sharp Strobe', icon: Zap, description: 'Hard light, facet sparkle', color: 'text-yellow-300' },
      { id: 'octabox-luxury', name: 'Octabox Luxury', icon: Lamp, description: 'Clamshell lighting, minimal', color: 'text-blue-200' },
      { id: 'ceo-diamond', name: 'CEO Diamond', icon: Crown, description: 'Low angle, tuxedo power', color: 'text-slate-400' },
      { id: 'relaxed-chin-touch', name: 'Relaxed Chin Touch', icon: Hand, description: 'Hand near cheek, relaxed', color: 'text-rose-200' },
      { id: 'wavy-framing-calm', name: 'Wavy Framing Calm', icon: Wind, description: 'Wavy hair, pure white', color: 'text-violet-200' },
      { id: 'chest-presentation', name: 'Chest Presentation', icon: Target, description: 'Chest view, knitwear', color: 'text-amber-200' },
    ],
  },

  // -------------------------------------------------------------------------
  // JOY & EXPRESSION
  // -------------------------------------------------------------------------
  {
    id: 'joy-expression',
    name: 'Joy & Expression',
    icon: Smile,
    color: 'text-yellow-400',
    presets: [
      { id: 'joy-burst', name: 'Joy Burst', icon: PartyPopper, description: 'Head back laughter, genuine', color: 'text-yellow-300' },
      { id: 'beaming-smile', name: 'Beaming Smile', icon: Smile, description: 'Duchenne joy, sparkling', color: 'text-amber-200' },
      { id: 'playful-giggle', name: 'Playful Giggle', icon: HandMetal, description: 'Hand to mouth, spontaneous', color: 'text-pink-200' },
      { id: 'hair-motion', name: 'Hair Motion', icon: Zap, description: 'Flying hair, dynamic energy', color: 'text-purple-200' },
      { id: 'crows-feet-joy', name: 'Crows Feet Joy', icon: Eye, description: 'Expression lines, authentic', color: 'text-amber-300' },
      { id: 'candid-laugh', name: 'Candid Laugh', icon: Laugh, description: 'Real moment, genuine emotion', color: 'text-pink-300' },
      { id: 'duo-friends', name: 'Duo Friends', icon: Users, description: 'Two models, friendship', color: 'text-rose-300' },
      { id: 'motion-candid', name: 'Motion Candid', icon: Wind, description: 'Hair blowing, movement blur', color: 'text-violet-300' },
      { id: 'bracelet-laugh', name: 'Bracelet Laugh', icon: Laugh, description: 'Covering mouth, genuine joy', color: 'text-amber-300' },
      { id: 'smiling-jawline', name: 'Smiling Jawline', icon: Smile, description: 'Anonymous, gentle smile', color: 'text-yellow-200' },
    ],
  },

  // -------------------------------------------------------------------------
  // HARD LIGHT & DRAMA
  // -------------------------------------------------------------------------
  {
    id: 'hard-light-drama',
    name: 'Hard Light & Drama',
    icon: Flashlight,
    color: 'text-orange-400',
    presets: [
      { id: 'hard-sun-joy', name: 'Hard Sun Joy', icon: SunDim, description: 'Sharp shadows, sparkling gems', color: 'text-orange-300' },
      { id: 'diamond-sparkle', name: 'Diamond Sparkle', icon: Gem, description: 'Hard light fire, macro', color: 'text-cyan-100' },
      { id: 'hand-shadow', name: 'Hand Shadow', icon: Shapes, description: 'Geometric shadows, editorial', color: 'text-slate-300' },
      { id: 'snoot-drama', name: 'Snoot Drama', icon: Flashlight, description: 'Focused beam, chiaroscuro', color: 'text-zinc-300' },
      { id: 'rim-halo', name: 'Rim Halo', icon: CircleDotDashed, description: 'Backlight drama, profile', color: 'text-slate-300' },
      { id: 'golden-studio', name: 'Golden Studio', icon: Thermometer, description: 'Warm hard light, summer', color: 'text-amber-300' },
      { id: 'shadow-play', name: 'Shadow Play', icon: Blinds, description: 'Venetian patterns, contrast', color: 'text-amber-400' },
      { id: 'chiaroscuro', name: 'Chiaroscuro', icon: Contrast, description: 'Renaissance drama', color: 'text-amber-500' },
      { id: 'hair-strand-shadow', name: 'Hair Strand', icon: Brush, description: 'Hair shadows on face', color: 'text-purple-300' },
      { id: 'kodak-low-key', name: 'Kodak Low Key', icon: Film, description: 'Cinematic chiaroscuro', color: 'text-amber-600' },
      { id: 'oily-glow', name: 'Oily Glow', icon: Droplets, description: 'Sweaty sheen, specular', color: 'text-yellow-200' },
      { id: 'spotlight-dark', name: 'Spotlight Dark', icon: Flashlight, description: 'Low-key, black background', color: 'text-zinc-400' },
      { id: 'party-flash', name: 'Party Flash', icon: Zap, description: 'Direct flash, night candid', color: 'text-pink-400' },
      { id: 'gobo-vacation', name: 'Gobo Vacation', icon: Palmtree, description: 'Dappled shadows, exotic', color: 'text-amber-400' },
    ],
  },

  // -------------------------------------------------------------------------
  // LIFESTYLE & CANDID
  // -------------------------------------------------------------------------
  {
    id: 'lifestyle-candid',
    name: 'Lifestyle & Candid',
    icon: Coffee,
    color: 'text-amber-400',
    presets: [
      { id: 'lifestyle', name: 'Lifestyle', icon: Camera, description: 'Natural, Instagram-ready', color: 'text-pink-400' },
      { id: 'coffee-moment', name: 'Coffee Moment', icon: Coffee, description: 'Cozy cafe aesthetic', color: 'text-amber-400' },
      { id: 'daydreaming', name: 'Daydreaming', icon: Brain, description: 'Window gaze, thoughtful', color: 'text-purple-200' },
      { id: 'hair-tuck', name: 'Hair Tuck', icon: MoveHorizontal, description: 'Ear reveal, candid gesture', color: 'text-amber-200' },
      { id: 'cashmere-hand', name: 'Cashmere Hand', icon: Grip, description: 'Cozy sweater, warm detail', color: 'text-orange-100' },
      { id: 'lap-hands', name: 'Lap Hands', icon: LayoutGrid, description: 'High angle, linen calm', color: 'text-amber-100' },
      { id: 'adorning-moment', name: 'Adorning', icon: HeartHandshake, description: 'Putting on jewelry', color: 'text-pink-300' },
      { id: 'natural-50mm', name: 'Natural 50mm', icon: Gauge, description: 'Gentle smile, approachable', color: 'text-stone-200' },
      { id: 'urban-cafe', name: 'Urban Cafe', icon: Building, description: 'Bustling coffee shop', color: 'text-orange-400' },
      { id: 'soft-blinds', name: 'Soft Blinds', icon: Grid3X3, description: 'Gentle stripes, peaceful', color: 'text-amber-100' },
      { id: 'chain-tension', name: 'Chain Tension', icon: Link2, description: 'Pendant pull, tactile', color: 'text-yellow-300' },
      { id: 'influencer-golden', name: 'Influencer Golden', icon: Instagram, description: 'Golden hour, sun flare', color: 'text-orange-400' },
      { id: 'pendant-touch', name: 'Pendant Touch', icon: Shirt, description: 'Soft touch, intimate', color: 'text-stone-200' },
      { id: 'beige-knit-warmth', name: 'Beige Knit Warmth', icon: Heart, description: 'Soft knitwear, warm', color: 'text-orange-200' },
      { id: 'pendant-chain-pull', name: 'Pendant Chain Pull', icon: Link2, description: 'Chain tension, tactile', color: 'text-yellow-300' },
    ],
  },

  // -------------------------------------------------------------------------
  // MACRO & SKIN DETAIL
  // -------------------------------------------------------------------------
  {
    id: 'macro-detail',
    name: 'Macro & Skin Detail',
    icon: Microscope,
    color: 'text-emerald-400',
    presets: [
      { id: 'clinical-macro', name: 'Clinical Macro', icon: Microscope, description: 'Collarbone focus, minimalist', color: 'text-slate-200' },
      { id: 'derma-detail', name: 'Derma Detail', icon: FileSearch, description: 'Goosebumps, micro-texture', color: 'text-stone-200' },
      { id: 'earlobe-macro', name: 'Earlobe Macro', icon: Ear, description: 'Extreme ear detail', color: 'text-rose-200' },
      { id: 'fingerprint-ring', name: 'Fingerprint Ring', icon: CircleDashed, description: 'Real hand texture', color: 'text-orange-200' },
      { id: 'pulse-point', name: 'Pulse Point', icon: Activity, description: 'Inner wrist, delicate', color: 'text-red-200' },
      { id: 'chain-press', name: 'Chain Press', icon: Link2, description: 'Chain on collarbone', color: 'text-yellow-200' },
      { id: 'dewy-macro', name: 'Dewy Macro', icon: Waves, description: 'Hydrated sheen, close-up', color: 'text-cyan-200' },
      { id: 'hyper-real', name: 'Hyper Real', icon: ScanFace, description: '150MP detail, authentic', color: 'text-emerald-200' },
      { id: 'wet-look-glam', name: 'Wet Look Glam', icon: Droplets, description: 'High-shine, glossy', color: 'text-sky-300' },
      { id: 'peach-fuzz-rim', name: 'Peach Fuzz Rim', icon: CircleDot, description: 'Backlit vellus hair', color: 'text-rose-100' },
      { id: 'tension-grip', name: 'Tension Grip', icon: Hand, description: 'Hand on neck, veins', color: 'text-red-300' },
      { id: 'ear-cartilage', name: 'Ear Cartilage', icon: Ear, description: 'Ultra-macro, capillaries', color: 'text-rose-300' },
      { id: 'pendant-hollow', name: 'Pendant Hollow', icon: Minus, description: 'Collarbone dip, intimate', color: 'text-stone-300' },
      { id: 'lapel-contrast', name: 'Lapel Contrast', icon: Blend, description: 'Fabric vs skin texture', color: 'text-slate-300' },
      { id: 'natural-moles-pores', name: 'Natural Moles Pores', icon: CircleDot, description: 'Hyper-real moles, pores', color: 'text-rose-200' },
    ],
  },

  // -------------------------------------------------------------------------
  // OUTDOOR & NATURE
  // -------------------------------------------------------------------------
  {
    id: 'outdoor-nature',
    name: 'Outdoor & Nature',
    icon: Sun,
    color: 'text-green-400',
    presets: [
      { id: 'golden-hour', name: 'Golden Hour', icon: Sunset, description: 'Warm sunset lighting', color: 'text-orange-400' },
      { id: 'leaf-shadows', name: 'Leaf Shadows', icon: Leaf, description: 'Dappled warmth, Kodak film', color: 'text-lime-200' },
      { id: 'sun-tilt', name: 'Sun Tilt', icon: Sunrise, description: 'Eyes closed, peaceful bliss', color: 'text-yellow-300' },
      { id: 'dappled-light', name: 'Dappled Light', icon: TreeDeciduous, description: 'Tree shadows, green bokeh', color: 'text-green-300' },
      { id: 'blue-sky', name: 'Blue Sky', icon: Cloud, description: 'Low angle, summer peace', color: 'text-sky-300' },
      { id: 'sun-shield', name: 'Sun Shield', icon: SunSnow, description: 'Light through fingers', color: 'text-yellow-300' },
      { id: 'natural-outdoor', name: 'Natural Outdoor', icon: Leaf, description: 'Garden sunlight', color: 'text-green-400' },
      { id: 'flower-walk', name: 'Flower Walk', icon: Flower2, description: 'Garden stroll, blooms', color: 'text-pink-400' },
      { id: 'glazed-tan', name: 'Glazed Tan', icon: SunMedium, description: 'Golden hour, dewy skin', color: 'text-amber-300' },
      { id: 'rustic-light', name: 'Rustic Light', icon: Armchair, description: 'Sunlit apartment', color: 'text-amber-400' },
      { id: 'sunset-squint', name: 'Sunset Squint', icon: SunDim, description: 'Golden hour, terracotta', color: 'text-orange-500' },
    ],
  },

  // -------------------------------------------------------------------------
  // FASHION & EDITORIAL
  // -------------------------------------------------------------------------
  {
    id: 'fashion-editorial',
    name: 'Fashion & Editorial',
    icon: Sparkles,
    color: 'text-purple-400',
    presets: [
      { id: 'on-model', name: 'On Model', icon: User, description: 'Professional model placement', color: 'text-purple-400' },
      { id: 'blazer-deep-v', name: 'Blazer Deep V', icon: Hexagon, description: 'Oversized beige, sophisticated', color: 'text-amber-200' },
      { id: 'power-shoulders', name: 'Power Shoulders', icon: Shield, description: 'Strong silhouette, confident', color: 'text-stone-300' },
      { id: 'sheer-tulle', name: 'Sheer Tulle', icon: Flame, description: 'Semi-transparent, ethereal', color: 'text-rose-100' },
      { id: 'silk-slip', name: 'Silk Slip', icon: Ribbon, description: 'Champagne cowl, liquid silk', color: 'text-yellow-100' },
      { id: 'white-shirt', name: 'White Shirt', icon: ShirtIcon, description: 'Unbuttoned elegance, clean', color: 'text-slate-100' },
      { id: 'angora-cozy', name: 'Angora Cozy', icon: CloudFog, description: 'Fuzzy texture, dreamy warmth', color: 'text-orange-100' },
      { id: 'editorial', name: 'Editorial', icon: Film, description: 'Magazine-style luxury', color: 'text-rose-400' },
      { id: 'denim-contrast', name: 'Denim Contrast', icon: Scissors, description: 'Rough vs shiny, casual', color: 'text-blue-300' },
      { id: 'luxury-boudoir', name: 'Luxury Boudoir', icon: BedDouble, description: 'Intimate bedroom elegance', color: 'text-pink-400' },
      { id: 'blazer-jawline', name: 'Blazer Jawline', icon: Hexagon, description: 'High-key, white blazer', color: 'text-slate-200' },
      { id: 'dark-glow', name: 'Dark Glow', icon: Star, description: 'Deep dark skin, cashmere', color: 'text-amber-400' },
      { id: 'silk-shoulder', name: 'Silk Shoulder', icon: Ribbon, description: 'Olive skin, champagne slip', color: 'text-rose-200' },
      { id: 'freckle-linen', name: 'Freckle Linen', icon: Shirt, description: 'Fair skin, natural freckles', color: 'text-orange-200' },
      { id: 'hair-tie-profile', name: 'Hair Tie Profile', icon: User, description: 'Tying hair, earrings', color: 'text-violet-200' },
      { id: 'black-silk-evening', name: 'Black Silk Evening', icon: Moon, description: 'Deep neckline, evening', color: 'text-slate-400' },
      { id: 'sunglasses-rings', name: 'Sunglasses Rings', icon: Glasses, description: 'It-girl attitude', color: 'text-zinc-300' },
      { id: 'wind-silk-blouse', name: 'Wind Silk Blouse', icon: Wind, description: 'Hair shadows, intense', color: 'text-purple-300' },
      { id: 'cashmere-cozy', name: 'Cashmere Cozy', icon: CloudFog, description: 'Collar to chin, cozy', color: 'text-amber-200' },
      { id: 'silk-blouse-elegance', name: 'Silk Blouse Elegance', icon: Shirt, description: 'White silk, healthy glow', color: 'text-slate-100' },
      { id: 'hasselblad-editorial', name: 'Hasselblad Editorial', icon: Camera, description: 'Gray backdrop, 8K detail', color: 'text-stone-400' },
      { id: 'deep-neckline-contrast', name: 'Deep Neckline Contrast', icon: Moon, description: 'Black silk, evening elegance', color: 'text-slate-500' },
    ],
  },

  // -------------------------------------------------------------------------
  // LENS & PERSPECTIVE
  // -------------------------------------------------------------------------
  {
    id: 'lens-perspective',
    name: 'Lens & Perspective',
    icon: Crosshair,
    color: 'text-indigo-400',
    presets: [
      { id: 'portrait-85mm', name: 'Portrait 85mm', icon: CircleUser, description: 'Classic bust-up, commercial', color: 'text-rose-200' },
      { id: 'dynamic-35mm', name: 'Dynamic 35mm', icon: Move3D, description: 'Waist up, gesturing', color: 'text-violet-200' },
      { id: 'natural-50mm', name: 'Natural 50mm', icon: Gauge, description: 'Gentle smile, approachable', color: 'text-stone-200' },
      { id: 'collarbone-crop', name: 'Collarbone Crop', icon: Crop, description: 'Chin/collarbone only, elegant', color: 'text-stone-200' },
      { id: 'shoulder-glance', name: 'Shoulder Glance', icon: RotateCcw, description: 'Over shoulder view, neck reveal', color: 'text-rose-200' },
      { id: 'back-necklace', name: 'Back Necklace', icon: Undo2, description: 'Spine elegance, rear view', color: 'text-pink-200' },
    ],
  },

  // -------------------------------------------------------------------------
  // MINIMALIST & ELEGANT
  // -------------------------------------------------------------------------
  {
    id: 'minimalist-elegant',
    name: 'Minimalist & Elegant',
    icon: Square,
    color: 'text-stone-400',
    presets: [
      { id: 'pure-white', name: 'Pure White', icon: Square, description: 'Infinite clean white', color: 'text-slate-200' },
      { id: 'soft-minimalist', name: 'Soft Minimalist', icon: Feather, description: 'Whisper soft, delicate', color: 'text-rose-100' },
      { id: 'camisole-shoulder', name: 'Camisole Shoulder', icon: StretchHorizontal, description: 'Spaghetti strap, morning light', color: 'text-slate-100' },
      { id: 'nude-palette', name: 'Nude Palette', icon: Paintbrush, description: 'Monochrome beige, calm', color: 'text-stone-200' },
      { id: 'bare-canvas', name: 'Bare Canvas', icon: Layers, description: 'Simple shoulder frame', color: 'text-stone-100' },
      { id: 'silk-ethereal', name: 'Silk Ethereal', icon: Sparkle, description: 'Soft silk, creamy blur', color: 'text-rose-200' },
      { id: 'gentle-touch', name: 'Gentle Touch', icon: Fingerprint, description: 'Hand on face, 100mm macro', color: 'text-pink-100' },
      { id: 'curtain-dreams', name: 'Curtain Dreams', icon: FlipHorizontal, description: 'Sheer curtain, diffused', color: 'text-pink-200' },
      { id: 'water-glass', name: 'Water Glass', icon: GlassWater, description: 'Caustic light, fresh morning', color: 'text-teal-200' },
      { id: 'clean-girl-crop', name: 'Clean Girl Crop', icon: Crop, description: 'Eyes cropped, dekolte', color: 'text-slate-100' },
      { id: 'anonymous-jawline', name: 'Anonymous Jawline', icon: Eye, description: 'Cropped, chin visible', color: 'text-zinc-300' },
    ],
  },

  // -------------------------------------------------------------------------
  // ARTISTIC & SPECIAL
  // -------------------------------------------------------------------------
  {
    id: 'artistic-special',
    name: 'Artistic & Special',
    icon: Sparkles,
    color: 'text-fuchsia-400',
    presets: [
      { id: 'prism-art', name: 'Prism Art', icon: Diamond, description: 'Rainbow light, spectrum', color: 'text-pink-300' },
      { id: 'wet-beauty', name: 'Wet Beauty', icon: Droplets, description: 'Water droplets, fresh', color: 'text-sky-300' },
      { id: 'vintage-film', name: 'Vintage Film', icon: Film, description: 'Hasselblad, 1960s', color: 'text-amber-300' },
      { id: 'moonlit', name: 'Moonlit', icon: Moon, description: 'Cool night elegance', color: 'text-indigo-300' },
      { id: 'clean-girl', name: 'Clean Girl', icon: Droplet, description: 'Fresh bathroom, minimal', color: 'text-cyan-200' },
      { id: 'art-gallery', name: 'Art Gallery', icon: Landmark, description: 'Museum, stark white walls', color: 'text-slate-400' },
      { id: 'architecture', name: 'Architecture', icon: Columns, description: 'Modern geometric lines', color: 'text-slate-300' },
      { id: 'library-classic', name: 'Library Classic', icon: BookOpen, description: 'Warm wood, old books', color: 'text-amber-500' },
      { id: 'bw-lips-pendant', name: 'BW Lips Pendant', icon: SquareIcon, description: 'Monochrome macro, iconic', color: 'text-zinc-400' },
      { id: 'mirror-shard', name: 'Mirror Shard', icon: Wand2, description: 'Broken reflection, surreal', color: 'text-purple-400' },
      { id: 'wet-droplets', name: 'Wet Droplets', icon: Droplets, description: 'Water on skin, glossy', color: 'text-cyan-300' },
      { id: 'motion-blur-focus', name: 'Motion Blur Focus', icon: Zap, description: 'Long exposure, jewelry sharp', color: 'text-purple-300' },
    ],
  },
];

interface QuickPresetsGridProps {
  onPresetSelect: (presetId: string) => void;
  disabled?: boolean;
}

export function QuickPresetsGrid({ onPresetSelect, disabled = false }: QuickPresetsGridProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['studio-commercial', 'joy-expression']) // Default open categories
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-1">
      {PRESET_CATEGORIES.map((category) => {
        const isExpanded = expandedCategories.has(category.id);
        const CategoryIcon = category.icon;

        return (
          <div key={category.id} className="rounded-lg border border-white/5 bg-white/[0.01]">
            {/* Category Header */}
            <button
              onClick={() => toggleCategory(category.id)}
              className="flex w-full items-center justify-between px-2 py-1.5 text-left transition-colors hover:bg-white/5"
            >
              <div className="flex items-center gap-1.5">
                <CategoryIcon className={`h-3 w-3 ${category.color}`} />
                <span className="text-[10px] font-medium text-white/80">{category.name}</span>
                <span className="text-[8px] text-white/30">({category.presets.length})</span>
              </div>
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-white/40" />
              ) : (
                <ChevronRight className="h-3 w-3 text-white/40" />
              )}
            </button>

            {/* Category Presets */}
            {isExpanded && (
              <div className="grid grid-cols-2 gap-1 px-1.5 pb-1.5">
                {category.presets.map((preset) => {
                  const Icon = preset.icon;
                  
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onPresetSelect(preset.id)}
                      disabled={disabled}
                      className={`
                        group flex flex-col items-start gap-0.5 rounded-md border border-white/5 
                        bg-white/[0.02] p-1.5 text-left transition-all
                        hover:border-purple-500/30 hover:bg-purple-500/5
                        disabled:cursor-not-allowed disabled:opacity-50
                      `}
                    >
                      <div className="flex items-center gap-1">
                        <Icon className={`h-3 w-3 ${preset.color} transition-transform group-hover:scale-110`} />
                        <span className="text-[9px] font-medium text-white/90">{preset.name}</span>
                      </div>
                      <span className="text-[7px] leading-tight text-white/40">
                        {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Total Count */}
      <div className="pt-1 text-center text-[8px] text-white/30">
        {PRESET_CATEGORIES.reduce((acc, cat) => acc + cat.presets.length, 0)} presets available
      </div>
    </div>
  );
}

export default QuickPresetsGrid;
