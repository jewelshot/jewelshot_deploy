/**
 * AdvancedPresetsPanel Component
 * 
 * Full control over all generation parameters with sub-options
 * Style, Model (with appearance details), Setting, Mood, Camera, Lighting
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, Sparkles, RotateCcw, Shuffle } from 'lucide-react';
import { FaceVisibility } from '@/lib/generation-settings-storage';
import { buildAdvancedPrompt } from '@/lib/prompt-builder';
import { useLanguage } from '@/lib/i18n';

// ============================================
// TYPES
// ============================================

type Gender = 'women' | 'men';
type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet';

interface ColorOption {
  id: string;
  label: string;
  hex: string;
}

interface OptionItem {
  id: string;
  label: string;
  description?: string;
  forGender?: Gender[];
  forJewelry?: JewelryType[];
  forStyles?: string[];
}

interface AdvancedSelections {
  // Main categories
  style: string | null;
  modelPose: string | null;
  setting: string | null;
  mood: string | null;
  
  // Model appearance (women)
  hairType: string | null;
  hairColor: string | null;
  nailType: string | null;
  nailColor: string | null;
  skinTone: string | null;
  makeup: string | null;
  
  // Model appearance (men)
  facialHair: string | null;
  hairStyleM: string | null;
  hairColorM: string | null;
  
  // Camera settings
  cameraAngle: string | null;
  depthOfField: string | null;
  focalLength: string | null;
  
  // Lighting
  lightingType: string | null;
  lightingDirection: string | null;
  lightingIntensity: string | null;
  
  // Color grading
  colorTemperature: string | null;
  contrast: string | null;
  saturation: string | null;
}

// ============================================
// OPTIONS DATA
// ============================================

const STYLE_OPTIONS: OptionItem[] = [
  { id: 'editorial', label: 'Editorial', description: 'Magazine quality' },
  { id: 'ecommerce', label: 'E-Commerce', description: 'Clean catalog' },
  { id: 'lifestyle', label: 'Lifestyle', description: 'Natural candid' },
  { id: 'luxury', label: 'Luxury', description: 'Premium dramatic' },
  { id: 'minimalist', label: 'Minimalist', description: 'Simple clean' },
  { id: 'artistic', label: 'Artistic', description: 'Creative experimental' },
  { id: 'vintage', label: 'Vintage', description: 'Classic retro' },
  { id: 'modern', label: 'Modern', description: 'Contemporary fresh' },
];

// Hair Types - Women
const HAIR_TYPE_WOMEN: OptionItem[] = [
  { id: 'straight-long', label: 'Straight Long', description: 'Sleek flowing' },
  { id: 'straight-short', label: 'Straight Short', description: 'Bob or pixie' },
  { id: 'wavy-long', label: 'Wavy Long', description: 'Flowing waves' },
  { id: 'wavy-medium', label: 'Wavy Medium', description: 'Shoulder length waves' },
  { id: 'curly', label: 'Curly', description: 'Natural curls' },
  { id: 'updo', label: 'Updo', description: 'Elegant upstyle' },
  { id: 'ponytail', label: 'Ponytail', description: 'Pulled back' },
  { id: 'braided', label: 'Braided', description: 'Braids or plaits' },
  { id: 'messy-bun', label: 'Messy Bun', description: 'Casual updo' },
  { id: 'slicked-back', label: 'Slicked Back', description: 'Wet look' },
];

// Hair Types - Men
const HAIR_TYPE_MEN: OptionItem[] = [
  { id: 'short-neat', label: 'Short Neat', description: 'Clean professional' },
  { id: 'short-textured', label: 'Short Textured', description: 'Styled with product' },
  { id: 'medium-swept', label: 'Medium Swept', description: 'Side swept' },
  { id: 'long', label: 'Long', description: 'Below ears' },
  { id: 'buzz-cut', label: 'Buzz Cut', description: 'Very short' },
  { id: 'fade', label: 'Fade', description: 'Tapered sides' },
  { id: 'slicked-back', label: 'Slicked Back', description: 'Formal look' },
  { id: 'curly', label: 'Curly', description: 'Natural curls' },
  { id: 'bald', label: 'Bald', description: 'No hair' },
];

// Hair Colors
const HAIR_COLORS: ColorOption[] = [
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'dark-brown', label: 'Dark Brown', hex: '#3d2314' },
  { id: 'brown', label: 'Brown', hex: '#5c3a21' },
  { id: 'light-brown', label: 'Light Brown', hex: '#8b5a2b' },
  { id: 'blonde', label: 'Blonde', hex: '#d4a574' },
  { id: 'platinum', label: 'Platinum', hex: '#e8e4e1' },
  { id: 'red', label: 'Red', hex: '#8b3a3a' },
  { id: 'auburn', label: 'Auburn', hex: '#6b3a2e' },
  { id: 'gray', label: 'Gray', hex: '#808080' },
  { id: 'silver', label: 'Silver', hex: '#c0c0c0' },
];

// Nail Types - Women
const NAIL_TYPES: OptionItem[] = [
  { id: 'natural', label: 'Natural', description: 'Short natural' },
  { id: 'manicured', label: 'Manicured', description: 'Polished neat' },
  { id: 'long-oval', label: 'Long Oval', description: 'Classic shape' },
  { id: 'almond', label: 'Almond', description: 'Elegant pointed' },
  { id: 'square', label: 'Square', description: 'Modern flat' },
  { id: 'stiletto', label: 'Stiletto', description: 'Long pointed' },
  { id: 'coffin', label: 'Coffin', description: 'Tapered flat' },
  { id: 'french', label: 'French Tip', description: 'White tips' },
];

// Nail Colors
const NAIL_COLORS: ColorOption[] = [
  { id: 'natural', label: 'Natural', hex: '#f5d5c8' },
  { id: 'nude', label: 'Nude', hex: '#e8c4b8' },
  { id: 'blush', label: 'Blush Pink', hex: '#e8b4b8' },
  { id: 'red', label: 'Classic Red', hex: '#b22234' },
  { id: 'burgundy', label: 'Burgundy', hex: '#722f37' },
  { id: 'coral', label: 'Coral', hex: '#ff6f61' },
  { id: 'white', label: 'White', hex: '#ffffff' },
  { id: 'black', label: 'Black', hex: '#1a1a1a' },
  { id: 'gold', label: 'Gold', hex: '#d4af37' },
  { id: 'silver', label: 'Silver', hex: '#c0c0c0' },
];

// Skin Tones
const SKIN_TONES: ColorOption[] = [
  { id: 'fair', label: 'Fair', hex: '#ffe4c4' },
  { id: 'light', label: 'Light', hex: '#f5d5c8' },
  { id: 'medium-light', label: 'Medium Light', hex: '#d4a574' },
  { id: 'medium', label: 'Medium', hex: '#c68642' },
  { id: 'olive', label: 'Olive', hex: '#b5854b' },
  { id: 'tan', label: 'Tan', hex: '#a0522d' },
  { id: 'brown', label: 'Brown', hex: '#8b4513' },
  { id: 'dark-brown', label: 'Dark Brown', hex: '#654321' },
  { id: 'deep', label: 'Deep', hex: '#3d2314' },
];

// Makeup Styles - Women
const MAKEUP_STYLES: OptionItem[] = [
  { id: 'natural', label: 'Natural', description: 'Minimal no-makeup look' },
  { id: 'soft-glam', label: 'Soft Glam', description: 'Enhanced natural' },
  { id: 'full-glam', label: 'Full Glam', description: 'Bold dramatic' },
  { id: 'editorial', label: 'Editorial', description: 'Artistic creative' },
  { id: 'smoky-eye', label: 'Smoky Eye', description: 'Dark dramatic eyes' },
  { id: 'nude-lips', label: 'Nude Lips', description: 'Neutral tones' },
  { id: 'red-lip', label: 'Red Lip', description: 'Classic bold lip' },
  { id: 'dewy', label: 'Dewy', description: 'Fresh glowing' },
  { id: 'matte', label: 'Matte', description: 'Smooth flawless' },
];

// Facial Hair - Men
const FACIAL_HAIR: OptionItem[] = [
  { id: 'clean-shaven', label: 'Clean Shaven', description: 'Smooth face' },
  { id: 'stubble', label: 'Stubble', description: '1-3 day growth' },
  { id: 'short-beard', label: 'Short Beard', description: 'Trimmed neat' },
  { id: 'full-beard', label: 'Full Beard', description: 'Longer maintained' },
  { id: 'goatee', label: 'Goatee', description: 'Chin beard' },
  { id: 'mustache', label: 'Mustache', description: 'Upper lip only' },
];

// Camera Angles
const CAMERA_ANGLES: OptionItem[] = [
  { id: 'straight-on', label: 'Straight On', description: 'Eye level direct' },
  { id: 'slight-high', label: 'Slight High', description: 'Above eye level' },
  { id: 'slight-low', label: 'Slight Low', description: 'Below eye level' },
  { id: 'high-angle', label: 'High Angle', description: 'Looking down' },
  { id: 'low-angle', label: 'Low Angle', description: 'Looking up' },
  { id: 'dutch', label: 'Dutch Angle', description: 'Tilted frame' },
  { id: 'birds-eye', label: 'Birds Eye', description: 'Directly above' },
  { id: 'worms-eye', label: 'Worms Eye', description: 'Directly below' },
];

// Depth of Field
const DEPTH_OF_FIELD: OptionItem[] = [
  { id: 'shallow', label: 'Shallow', description: 'Blurred background (f/1.4-2.8)' },
  { id: 'medium', label: 'Medium', description: 'Partial blur (f/4-5.6)' },
  { id: 'deep', label: 'Deep', description: 'Sharp throughout (f/8-11)' },
  { id: 'very-deep', label: 'Very Deep', description: 'Maximum sharpness (f/16+)' },
];

// Focal Length
const FOCAL_LENGTHS: OptionItem[] = [
  { id: 'wide', label: 'Wide', description: '24-35mm environmental' },
  { id: 'standard', label: 'Standard', description: '50mm natural' },
  { id: 'portrait', label: 'Portrait', description: '85mm flattering' },
  { id: 'telephoto', label: 'Telephoto', description: '135mm+ compressed' },
  { id: 'macro', label: 'Macro', description: 'Extreme close-up' },
];

// Lighting Types
const LIGHTING_TYPES: OptionItem[] = [
  { id: 'natural', label: 'Natural', description: 'Daylight window' },
  { id: 'studio', label: 'Studio', description: 'Controlled artificial' },
  { id: 'golden-hour', label: 'Golden Hour', description: 'Warm sunset' },
  { id: 'blue-hour', label: 'Blue Hour', description: 'Cool twilight' },
  { id: 'ring-light', label: 'Ring Light', description: 'Even circular' },
  { id: 'softbox', label: 'Softbox', description: 'Soft diffused' },
  { id: 'hard-light', label: 'Hard Light', description: 'Sharp shadows' },
  { id: 'mixed', label: 'Mixed', description: 'Natural + artificial' },
];

// Lighting Direction
const LIGHTING_DIRECTIONS: OptionItem[] = [
  { id: 'front', label: 'Front', description: 'Flat even' },
  { id: 'side', label: 'Side', description: 'Dramatic texture' },
  { id: 'back', label: 'Back', description: 'Rim light silhouette' },
  { id: 'rembrandt', label: 'Rembrandt', description: '45 degree classic' },
  { id: 'butterfly', label: 'Butterfly', description: 'Above center glamour' },
  { id: 'loop', label: 'Loop', description: 'Slight side shadow' },
  { id: 'split', label: 'Split', description: 'Half lit dramatic' },
];

// Lighting Intensity
const LIGHTING_INTENSITY: OptionItem[] = [
  { id: 'soft', label: 'Soft', description: 'Low contrast gentle' },
  { id: 'medium', label: 'Medium', description: 'Balanced natural' },
  { id: 'bright', label: 'Bright', description: 'High key airy' },
  { id: 'dramatic', label: 'Dramatic', description: 'High contrast bold' },
  { id: 'moody', label: 'Moody', description: 'Low key dark' },
];

// Color Temperature
const COLOR_TEMPERATURES: OptionItem[] = [
  { id: 'warm', label: 'Warm', description: '3000-4000K golden' },
  { id: 'neutral', label: 'Neutral', description: '5000-5500K daylight' },
  { id: 'cool', label: 'Cool', description: '6500-7500K blue' },
  { id: 'very-warm', label: 'Very Warm', description: '2700K candlelight' },
  { id: 'very-cool', label: 'Very Cool', description: '8000K+ shade' },
];

// Setting Options
const SETTING_OPTIONS: OptionItem[] = [
  { id: 'studio-white', label: 'Studio White', description: 'Pure seamless', forStyles: ['ecommerce', 'minimalist', 'editorial'] },
  { id: 'studio-gray', label: 'Studio Gray', description: 'Neutral backdrop', forStyles: ['ecommerce', 'minimalist', 'editorial', 'luxury'] },
  { id: 'studio-black', label: 'Studio Black', description: 'Dark dramatic', forStyles: ['luxury', 'editorial', 'artistic'] },
  { id: 'gradient', label: 'Gradient', description: 'Smooth color fade', forStyles: ['editorial', 'luxury', 'artistic'] },
  { id: 'living-room', label: 'Living Room', description: 'Home interior', forStyles: ['lifestyle'] },
  { id: 'bedroom', label: 'Bedroom', description: 'Intimate setting', forStyles: ['lifestyle'] },
  { id: 'vanity', label: 'Vanity Mirror', description: 'Getting ready', forStyles: ['lifestyle', 'editorial'] },
  { id: 'cafe', label: 'Cafe', description: 'Cozy public', forStyles: ['lifestyle'] },
  { id: 'garden', label: 'Garden', description: 'Natural greenery', forStyles: ['lifestyle', 'artistic'] },
  { id: 'beach', label: 'Beach', description: 'Coastal golden', forStyles: ['lifestyle', 'artistic'] },
  { id: 'urban', label: 'Urban', description: 'City street', forStyles: ['lifestyle', 'editorial'] },
  { id: 'abstract', label: 'Abstract', description: 'Bokeh blur', forStyles: ['artistic', 'luxury'] },
  { id: 'textured', label: 'Textured', description: 'Marble velvet', forStyles: ['luxury', 'editorial'] },
];

// Mood Options
const MOOD_OPTIONS: OptionItem[] = [
  { id: 'elegant', label: 'Elegant', description: 'Refined sophisticated' },
  { id: 'dramatic', label: 'Dramatic', description: 'Bold high contrast' },
  { id: 'fresh', label: 'Fresh', description: 'Bright natural' },
  { id: 'luxurious', label: 'Luxurious', description: 'Rich opulent' },
  { id: 'romantic', label: 'Romantic', description: 'Soft dreamy', forGender: ['women'] },
  { id: 'ethereal', label: 'Ethereal', description: 'Magical glow', forGender: ['women'] },
  { id: 'bold', label: 'Bold', description: 'Strong confident', forGender: ['men'] },
  { id: 'rugged', label: 'Rugged', description: 'Raw masculine', forGender: ['men'] },
  { id: 'warm', label: 'Warm', description: 'Golden cozy' },
  { id: 'cool', label: 'Cool', description: 'Modern blue' },
  { id: 'mysterious', label: 'Mysterious', description: 'Dark moody' },
  { id: 'serene', label: 'Serene', description: 'Calm peaceful' },
];

// Model Poses (simplified for advanced - detailed in camera angle)
const MODEL_POSES: OptionItem[] = [
  { id: 'product-only', label: 'Product Only', description: 'No model' },
  { id: 'hand', label: 'Hand Focus', description: 'Hand/wrist area', forJewelry: ['ring', 'bracelet'] },
  { id: 'neck', label: 'Neck Focus', description: 'Neck/chest area', forJewelry: ['necklace'] },
  { id: 'ear', label: 'Ear Focus', description: 'Ear/profile area', forJewelry: ['earring'] },
  { id: 'half-body', label: 'Half Body', description: 'Waist up' },
  { id: 'full-body', label: 'Full Body', description: 'Complete figure' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function filterOptions(options: OptionItem[], gender: Gender | null, jewelryType: JewelryType | null, style: string | null): OptionItem[] {
  return options.filter(opt => {
    if (opt.forGender && opt.forGender.length > 0 && gender && !opt.forGender.includes(gender)) return false;
    if (opt.forJewelry && opt.forJewelry.length > 0 && jewelryType && !opt.forJewelry.includes(jewelryType)) return false;
    if (opt.forStyles && opt.forStyles.length > 0 && style && !opt.forStyles.includes(style)) return false;
    return true;
  });
}

// ============================================
// UI COMPONENTS
// ============================================

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({ title, isOpen, onToggle, badge, disabled, children }: CollapsibleSectionProps) {
  return (
    <div className={`rounded-lg border overflow-hidden ${disabled ? 'border-white/5 opacity-50' : 'border-white/10 bg-white/[0.02]'}`}>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`flex w-full items-center justify-between px-3 py-2 transition-colors ${disabled ? 'cursor-not-allowed' : 'hover:bg-white/[0.03]'}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-white/80">{title}</span>
          {badge && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/50">{badge}</span>}
        </div>
        <ChevronDown className={`h-3 w-3 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all ${isOpen && !disabled ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="border-t border-white/5 p-2">{children}</div>
      </div>
    </div>
  );
}

function OptionButton({ label, description, isSelected, onClick }: { label: string; description?: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border p-1.5 text-left transition-all ${
        isSelected ? 'border-white/30 bg-white/10 text-white' : 'border-white/5 bg-white/[0.02] text-white/60 hover:border-white/15 hover:text-white/80'
      }`}
    >
      <span className="block text-[10px] font-medium">{label}</span>
      {description && <span className="block text-[8px] text-white/40">{description}</span>}
    </button>
  );
}

function ColorDot({ color, isSelected, onClick, label }: { color: string; isSelected: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`group relative h-6 w-6 rounded-full border-2 transition-all ${
        isSelected ? 'border-white scale-110' : 'border-transparent hover:border-white/50 hover:scale-105'
      }`}
      style={{ backgroundColor: color }}
    >
      {isSelected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-white/80" />
        </span>
      )}
    </button>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="mb-1.5 text-[9px] font-medium uppercase tracking-wider text-white/40">{title}</p>
      {children}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface AdvancedPresetsPanelProps {
  gender: 'women' | 'men' | null;
  jewelryType: 'ring' | 'necklace' | 'earring' | 'bracelet' | null;
  aspectRatio: string;
  showFace: FaceVisibility;
  onGenerate: (prompt: string) => void;
  disabled?: boolean;
}

export function AdvancedPresetsPanel({
  gender,
  jewelryType,
  aspectRatio,
  showFace,
  onGenerate,
  disabled = false,
}: AdvancedPresetsPanelProps) {
  const { t } = useLanguage();
  const initialSelections: AdvancedSelections = {
    style: null, modelPose: null, setting: null, mood: null,
    hairType: null, hairColor: null, nailType: null, nailColor: null, skinTone: null, makeup: null,
    facialHair: null, hairStyleM: null, hairColorM: null,
    cameraAngle: null, depthOfField: null, focalLength: null,
    lightingType: null, lightingDirection: null, lightingIntensity: null,
    colorTemperature: null, contrast: null, saturation: null,
  };

  const [selections, setSelections] = useState<AdvancedSelections>(initialSelections);
  const [openSections, setOpenSections] = useState({
    style: true, model: true, appearance: false, setting: true, mood: true, camera: false, lighting: false, color: false,
  });

  const toggleSection = (key: keyof typeof openSections) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  const updateSelection = (key: keyof AdvancedSelections, value: string | null) => {
    setSelections(prev => ({ ...prev, [key]: prev[key] === value ? null : value }));
  };

  const resetAll = () => setSelections(initialSelections);

  // Reset appearance when gender changes
  useEffect(() => {
    setSelections(prev => ({
      ...prev,
      hairType: null, hairColor: null, nailType: null, nailColor: null, makeup: null,
      facialHair: null, hairStyleM: null, hairColorM: null,
    }));
  }, [gender]);

  const filteredModelPoses = useMemo(() => filterOptions(MODEL_POSES, null, jewelryType, null), [jewelryType]);
  const filteredSettings = useMemo(() => filterOptions(SETTING_OPTIONS, null, null, selections.style), [selections.style]);
  const filteredMoods = useMemo(() => filterOptions(MOOD_OPTIONS, gender, null, null), [gender]);

  const settingsComplete = Boolean(gender && jewelryType && aspectRatio && showFace);
  const hasSelections = Object.values(selections).some(v => v !== null);

  // Get labels for appearance options
  const getOptionLabels = useCallback(() => {
    return {
      hairType: HAIR_TYPE_WOMEN.find(o => o.id === selections.hairType)?.label,
      hairColor: HAIR_COLORS.find(o => o.id === selections.hairColor)?.label,
      nailType: NAIL_TYPES.find(o => o.id === selections.nailType)?.label,
      nailColor: NAIL_COLORS.find(o => o.id === selections.nailColor)?.label,
      skinTone: SKIN_TONES.find(o => o.id === selections.skinTone)?.label,
      makeup: MAKEUP_STYLES.find(o => o.id === selections.makeup)?.label,
      facialHair: FACIAL_HAIR.find(o => o.id === selections.facialHair)?.label,
      hairStyleM: HAIR_TYPE_MEN.find(o => o.id === selections.hairStyleM)?.label,
      hairColorM: HAIR_COLORS.find(o => o.id === selections.hairColorM)?.label,
    };
  }, [selections]);

  const handleGenerate = useCallback(() => {
    if (!settingsComplete || !hasSelections || disabled) return;
    
    const { prompt } = buildAdvancedPrompt(
      { gender, jewelryType, aspectRatio, showFace },
      selections,
      getOptionLabels()
    );
    
    onGenerate(prompt);
  }, [settingsComplete, hasSelections, disabled, gender, jewelryType, aspectRatio, showFace, selections, getOptionLabels, onGenerate]);

  // Randomize all selections
  const handleRandomize = useCallback(() => {
    if (!settingsComplete) return;
    
    const pickRandom = <T extends { id: string }>(arr: T[]): T | null => {
      if (arr.length === 0) return null;
      return arr[Math.floor(Math.random() * arr.length)];
    };
    
    // Pick random style
    const randomStyle = pickRandom(STYLE_OPTIONS);
    if (!randomStyle) return;
    
    // Get filtered options
    const availablePoses = filterOptions(MODEL_POSES, null, jewelryType, null);
    const availableSettings = filterOptions(SETTING_OPTIONS, null, null, randomStyle.id);
    const availableMoods = filterOptions(MOOD_OPTIONS, gender, null, null);
    
    // Pick random main options
    const randomPose = pickRandom(availablePoses);
    const randomSetting = pickRandom(availableSettings);
    const randomMood = pickRandom(availableMoods);
    
    // Randomly decide which optional fields to fill (50% chance each)
    const shouldInclude = () => Math.random() > 0.5;
    
    // Appearance options based on gender
    let newSelections: AdvancedSelections = {
      ...initialSelections,
      style: randomStyle.id,
      modelPose: randomPose?.id || null,
      setting: randomSetting?.id || null,
      mood: randomMood?.id || null,
    };
    
    // Only add appearance if not product-only
    if (randomPose?.id !== 'product-only') {
      if (gender === 'women') {
        if (shouldInclude()) newSelections.hairType = pickRandom(HAIR_TYPE_WOMEN)?.id || null;
        if (shouldInclude()) newSelections.hairColor = pickRandom(HAIR_COLORS)?.id || null;
        if (shouldInclude()) newSelections.nailType = pickRandom(NAIL_TYPES)?.id || null;
        if (shouldInclude()) newSelections.nailColor = pickRandom(NAIL_COLORS)?.id || null;
        if (shouldInclude()) newSelections.makeup = pickRandom(MAKEUP_STYLES)?.id || null;
        if (shouldInclude()) newSelections.skinTone = pickRandom(SKIN_TONES)?.id || null;
      } else {
        if (shouldInclude()) newSelections.hairStyleM = pickRandom(HAIR_TYPE_MEN)?.id || null;
        if (shouldInclude()) newSelections.hairColorM = pickRandom(HAIR_COLORS)?.id || null;
        if (shouldInclude()) newSelections.facialHair = pickRandom(FACIAL_HAIR)?.id || null;
        if (shouldInclude()) newSelections.skinTone = pickRandom(SKIN_TONES)?.id || null;
      }
    }
    
    // Camera settings (30% chance each)
    const shouldIncludeCamera = () => Math.random() > 0.7;
    if (shouldIncludeCamera()) newSelections.cameraAngle = pickRandom(CAMERA_ANGLES)?.id || null;
    if (shouldIncludeCamera()) newSelections.depthOfField = pickRandom(DEPTH_OF_FIELD)?.id || null;
    if (shouldIncludeCamera()) newSelections.focalLength = pickRandom(FOCAL_LENGTHS)?.id || null;
    
    // Lighting settings (30% chance each)
    if (shouldIncludeCamera()) newSelections.lightingType = pickRandom(LIGHTING_TYPES)?.id || null;
    if (shouldIncludeCamera()) newSelections.lightingDirection = pickRandom(LIGHTING_DIRECTIONS)?.id || null;
    if (shouldIncludeCamera()) newSelections.lightingIntensity = pickRandom(LIGHTING_INTENSITY)?.id || null;
    
    // Color temperature (20% chance)
    if (Math.random() > 0.8) newSelections.colorTemperature = pickRandom(COLOR_TEMPERATURES)?.id || null;
    
    setSelections(newSelections);
  }, [settingsComplete, gender, jewelryType]);

  // Randomize and immediately generate
  const handleRandomGenerate = useCallback(() => {
    if (!settingsComplete || disabled) return;
    
    const pickRandom = <T extends { id: string }>(arr: T[]): T | null => {
      if (arr.length === 0) return null;
      return arr[Math.floor(Math.random() * arr.length)];
    };
    
    // Pick random style
    const randomStyle = pickRandom(STYLE_OPTIONS);
    if (!randomStyle) return;
    
    // Get filtered options
    const availablePoses = filterOptions(MODEL_POSES, null, jewelryType, null);
    const availableSettings = filterOptions(SETTING_OPTIONS, null, null, randomStyle.id);
    const availableMoods = filterOptions(MOOD_OPTIONS, gender, null, null);
    
    // Pick random main options
    const randomPose = pickRandom(availablePoses);
    const randomSetting = pickRandom(availableSettings);
    const randomMood = pickRandom(availableMoods);
    
    const shouldInclude = () => Math.random() > 0.5;
    
    let randomSelections: AdvancedSelections = {
      ...initialSelections,
      style: randomStyle.id,
      modelPose: randomPose?.id || null,
      setting: randomSetting?.id || null,
      mood: randomMood?.id || null,
    };
    
    // Appearance
    if (randomPose?.id !== 'product-only') {
      if (gender === 'women') {
        if (shouldInclude()) randomSelections.hairType = pickRandom(HAIR_TYPE_WOMEN)?.id || null;
        if (shouldInclude()) randomSelections.hairColor = pickRandom(HAIR_COLORS)?.id || null;
        if (shouldInclude()) randomSelections.makeup = pickRandom(MAKEUP_STYLES)?.id || null;
        if (shouldInclude()) randomSelections.skinTone = pickRandom(SKIN_TONES)?.id || null;
      } else {
        if (shouldInclude()) randomSelections.hairStyleM = pickRandom(HAIR_TYPE_MEN)?.id || null;
        if (shouldInclude()) randomSelections.facialHair = pickRandom(FACIAL_HAIR)?.id || null;
        if (shouldInclude()) randomSelections.skinTone = pickRandom(SKIN_TONES)?.id || null;
      }
    }
    
    // Update state for visual feedback
    setSelections(randomSelections);
    
    // Build option labels for the prompt
    const optLabels = {
      hairType: HAIR_TYPE_WOMEN.find(o => o.id === randomSelections.hairType)?.label,
      hairColor: HAIR_COLORS.find(o => o.id === randomSelections.hairColor)?.label,
      nailType: NAIL_TYPES.find(o => o.id === randomSelections.nailType)?.label,
      nailColor: NAIL_COLORS.find(o => o.id === randomSelections.nailColor)?.label,
      skinTone: SKIN_TONES.find(o => o.id === randomSelections.skinTone)?.label,
      makeup: MAKEUP_STYLES.find(o => o.id === randomSelections.makeup)?.label,
      facialHair: FACIAL_HAIR.find(o => o.id === randomSelections.facialHair)?.label,
      hairStyleM: HAIR_TYPE_MEN.find(o => o.id === randomSelections.hairStyleM)?.label,
      hairColorM: HAIR_COLORS.find(o => o.id === randomSelections.hairColorM)?.label,
    };
    
    // Generate with random selections
    const { prompt } = buildAdvancedPrompt(
      { gender, jewelryType, aspectRatio, showFace },
      randomSelections,
      optLabels
    );
    
    onGenerate(prompt);
  }, [settingsComplete, disabled, gender, jewelryType, aspectRatio, showFace, onGenerate]);

  if (!settingsComplete) {
    return (
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 text-center">
        <p className="text-[11px] text-amber-400">Configure Generation Settings first</p>
        <p className="mt-1 text-[9px] text-amber-400/70">Gender, Jewelry Type, Face visibility required</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Reset Button */}
      {hasSelections && (
        <button onClick={resetAll} className="flex w-full items-center justify-center gap-1.5 rounded-md border border-white/10 py-1.5 text-[10px] text-white/50 hover:bg-white/5 hover:text-white/70">
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      )}

      {/* Style */}
      <CollapsibleSection title={t.presets.style} isOpen={openSections.style} onToggle={() => toggleSection('style')} badge={selections.style ? '1' : undefined}>
        <div className="grid grid-cols-2 gap-1">
          {STYLE_OPTIONS.map(o => (
            <OptionButton key={o.id} label={o.label} description={o.description} isSelected={selections.style === o.id} onClick={() => updateSelection('style', o.id)} />
          ))}
        </div>
      </CollapsibleSection>

      {/* Model Pose */}
      <CollapsibleSection title={t.presets.modelPose} isOpen={openSections.model} onToggle={() => toggleSection('model')} badge={selections.modelPose ? '1' : undefined}>
        <div className="grid grid-cols-2 gap-1">
          {filteredModelPoses.map(o => (
            <OptionButton key={o.id} label={o.label} description={o.description} isSelected={selections.modelPose === o.id} onClick={() => updateSelection('modelPose', o.id)} />
          ))}
        </div>
      </CollapsibleSection>

      {/* Model Appearance */}
      {selections.modelPose && selections.modelPose !== 'product-only' && (
        <CollapsibleSection 
          title={t.presets.modelAppearance} 
          isOpen={openSections.appearance} 
          onToggle={() => toggleSection('appearance')}
          badge={gender === 'women' 
            ? [selections.hairType, selections.hairColor, selections.nailType, selections.nailColor, selections.skinTone, selections.makeup].filter(Boolean).length.toString() 
            : [selections.hairStyleM, selections.hairColorM, selections.facialHair, selections.skinTone].filter(Boolean).length.toString()
          }
        >
          {gender === 'women' ? (
            <>
              <SubSection title={t.presets.hairType}>
                <div className="grid grid-cols-2 gap-1">
                  {HAIR_TYPE_WOMEN.map(o => (
                    <OptionButton key={o.id} label={o.label} isSelected={selections.hairType === o.id} onClick={() => updateSelection('hairType', o.id)} />
                  ))}
                </div>
              </SubSection>

              <SubSection title={t.presets.hairColor}>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map(c => (
                    <ColorDot key={c.id} color={c.hex} label={c.label} isSelected={selections.hairColor === c.id} onClick={() => updateSelection('hairColor', c.id)} />
                  ))}
                </div>
              </SubSection>

              <SubSection title={t.presets.nailType}>
                <div className="grid grid-cols-2 gap-1">
                  {NAIL_TYPES.map(o => (
                    <OptionButton key={o.id} label={o.label} isSelected={selections.nailType === o.id} onClick={() => updateSelection('nailType', o.id)} />
                  ))}
                </div>
              </SubSection>

              <SubSection title={t.presets.nailColor}>
                <div className="flex flex-wrap gap-2">
                  {NAIL_COLORS.map(c => (
                    <ColorDot key={c.id} color={c.hex} label={c.label} isSelected={selections.nailColor === c.id} onClick={() => updateSelection('nailColor', c.id)} />
                  ))}
                </div>
              </SubSection>

              <SubSection title={t.presets.makeup}>
                <div className="grid grid-cols-2 gap-1">
                  {MAKEUP_STYLES.map(o => (
                    <OptionButton key={o.id} label={o.label} isSelected={selections.makeup === o.id} onClick={() => updateSelection('makeup', o.id)} />
                  ))}
                </div>
              </SubSection>
            </>
          ) : (
            <>
              <SubSection title={t.presets.hairStyle}>
                <div className="grid grid-cols-2 gap-1">
                  {HAIR_TYPE_MEN.map(o => (
                    <OptionButton key={o.id} label={o.label} isSelected={selections.hairStyleM === o.id} onClick={() => updateSelection('hairStyleM', o.id)} />
                  ))}
                </div>
              </SubSection>

              <SubSection title={t.presets.hairColor}>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map(c => (
                    <ColorDot key={c.id} color={c.hex} label={c.label} isSelected={selections.hairColorM === c.id} onClick={() => updateSelection('hairColorM', c.id)} />
                  ))}
                </div>
              </SubSection>

              <SubSection title={t.presets.facialHair}>
                <div className="grid grid-cols-2 gap-1">
                  {FACIAL_HAIR.map(o => (
                    <OptionButton key={o.id} label={o.label} isSelected={selections.facialHair === o.id} onClick={() => updateSelection('facialHair', o.id)} />
                  ))}
                </div>
              </SubSection>
            </>
          )}

          <SubSection title={t.presets.skinTone}>
            <div className="flex flex-wrap gap-2">
              {SKIN_TONES.map(c => (
                <ColorDot key={c.id} color={c.hex} label={c.label} isSelected={selections.skinTone === c.id} onClick={() => updateSelection('skinTone', c.id)} />
              ))}
            </div>
          </SubSection>
        </CollapsibleSection>
      )}

      {/* Setting */}
      <CollapsibleSection title={t.presets.setting} isOpen={openSections.setting} onToggle={() => toggleSection('setting')} badge={selections.setting ? '1' : undefined} disabled={!selections.style}>
        <div className="grid grid-cols-2 gap-1">
          {filteredSettings.map(o => (
            <OptionButton key={o.id} label={o.label} description={o.description} isSelected={selections.setting === o.id} onClick={() => updateSelection('setting', o.id)} />
          ))}
        </div>
      </CollapsibleSection>

      {/* Mood */}
      <CollapsibleSection title={t.presets.mood} isOpen={openSections.mood} onToggle={() => toggleSection('mood')} badge={selections.mood ? '1' : undefined}>
        <div className="grid grid-cols-2 gap-1">
          {filteredMoods.map(o => (
            <OptionButton key={o.id} label={o.label} description={o.description} isSelected={selections.mood === o.id} onClick={() => updateSelection('mood', o.id)} />
          ))}
        </div>
      </CollapsibleSection>

      {/* Camera Settings */}
      <CollapsibleSection 
        title={t.presets.camera} 
        isOpen={openSections.camera} 
        onToggle={() => toggleSection('camera')}
        badge={[selections.cameraAngle, selections.depthOfField, selections.focalLength].filter(Boolean).length.toString() || undefined}
      >
        <SubSection title={t.presets.angle}>
          <div className="grid grid-cols-2 gap-1">
            {CAMERA_ANGLES.map(o => (
              <OptionButton key={o.id} label={o.label} isSelected={selections.cameraAngle === o.id} onClick={() => updateSelection('cameraAngle', o.id)} />
            ))}
          </div>
        </SubSection>

        <SubSection title={t.presets.depthOfField}>
          <div className="grid grid-cols-2 gap-1">
            {DEPTH_OF_FIELD.map(o => (
              <OptionButton key={o.id} label={o.label} description={o.description} isSelected={selections.depthOfField === o.id} onClick={() => updateSelection('depthOfField', o.id)} />
            ))}
          </div>
        </SubSection>

        <SubSection title={t.presets.focalLength}>
          <div className="grid grid-cols-2 gap-1">
            {FOCAL_LENGTHS.map(o => (
              <OptionButton key={o.id} label={o.label} description={o.description} isSelected={selections.focalLength === o.id} onClick={() => updateSelection('focalLength', o.id)} />
            ))}
          </div>
        </SubSection>
      </CollapsibleSection>

      {/* Lighting */}
      <CollapsibleSection 
        title={t.presets.lighting} 
        isOpen={openSections.lighting} 
        onToggle={() => toggleSection('lighting')}
        badge={[selections.lightingType, selections.lightingDirection, selections.lightingIntensity].filter(Boolean).length.toString() || undefined}
      >
        <SubSection title={t.presets.lightingType}>
          <div className="grid grid-cols-2 gap-1">
            {LIGHTING_TYPES.map(o => (
              <OptionButton key={o.id} label={o.label} isSelected={selections.lightingType === o.id} onClick={() => updateSelection('lightingType', o.id)} />
            ))}
          </div>
        </SubSection>

        <SubSection title={t.presets.lightingDirection}>
          <div className="grid grid-cols-2 gap-1">
            {LIGHTING_DIRECTIONS.map(o => (
              <OptionButton key={o.id} label={o.label} isSelected={selections.lightingDirection === o.id} onClick={() => updateSelection('lightingDirection', o.id)} />
            ))}
          </div>
        </SubSection>

        <SubSection title={t.presets.lightingIntensity}>
          <div className="grid grid-cols-2 gap-1">
            {LIGHTING_INTENSITY.map(o => (
              <OptionButton key={o.id} label={o.label} isSelected={selections.lightingIntensity === o.id} onClick={() => updateSelection('lightingIntensity', o.id)} />
            ))}
          </div>
        </SubSection>
      </CollapsibleSection>

      {/* Color Grading */}
      <CollapsibleSection 
        title={t.presets.colorGrading} 
        isOpen={openSections.color} 
        onToggle={() => toggleSection('color')}
        badge={selections.colorTemperature ? '1' : undefined}
      >
        <SubSection title={t.presets.temperature}>
          <div className="grid grid-cols-2 gap-1">
            {COLOR_TEMPERATURES.map(o => (
              <OptionButton key={o.id} label={o.label} description={o.description} isSelected={selections.colorTemperature === o.id} onClick={() => updateSelection('colorTemperature', o.id)} />
            ))}
          </div>
        </SubSection>
      </CollapsibleSection>

      {/* Action Buttons */}
      <div className="mt-3 flex gap-2">
        {/* Random Button */}
        <button
          onClick={handleRandomize}
          disabled={disabled}
          title={t.studio.randomize}
          className={`flex items-center justify-center rounded-lg px-3 py-2.5 transition-all ${
            !disabled
              ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
          }`}
        >
          <Shuffle className="h-4 w-4" />
        </button>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!hasSelections || disabled}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all ${
            hasSelections && !disabled
              ? 'bg-white/10 text-white hover:bg-white/15 border border-white/20'
              : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          {t.studio.generate}
        </button>

        {/* Random Generate Button */}
        <button
          onClick={handleRandomGenerate}
          disabled={disabled}
          title={t.studio.randomGenerate}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
            !disabled
              ? 'bg-white/10 text-white hover:bg-white/15 border border-white/20'
              : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
          }`}
        >
          <Shuffle className="h-3.5 w-3.5" />
          <Sparkles className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default AdvancedPresetsPanel;
