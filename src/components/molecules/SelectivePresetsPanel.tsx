/**
 * SelectivePresetsPanel Component
 * 
 * Build custom presets by selecting individual parameters
 * Style, Model, Setting, Mood - each collapsible
 */

'use client';

import React, { useState, useCallback } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { FaceVisibility } from '@/lib/generation-settings-storage';

// ============================================
// TYPES & OPTIONS
// ============================================

export interface SelectivePresetOptions {
  style: string | null;
  modelType: string | null;
  setting: string | null;
  mood: string | null;
}

interface OptionItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}

// Style Options
const STYLE_OPTIONS: OptionItem[] = [
  { id: 'editorial', label: 'Editorial', description: 'Magazine quality', icon: '📸' },
  { id: 'ecommerce', label: 'E-Commerce', description: 'Clean catalog', icon: '🛒' },
  { id: 'lifestyle', label: 'Lifestyle', description: 'Natural candid', icon: '☕' },
  { id: 'luxury', label: 'Luxury', description: 'Premium dramatic', icon: '💎' },
  { id: 'minimalist', label: 'Minimalist', description: 'Simple clean', icon: '◻️' },
  { id: 'vintage', label: 'Vintage', description: 'Classic nostalgic', icon: '📷' },
  { id: 'modern', label: 'Modern', description: 'Contemporary fresh', icon: '🔷' },
  { id: 'artistic', label: 'Artistic', description: 'Creative experimental', icon: '🎨' },
];

// Model Type Options
const MODEL_OPTIONS: OptionItem[] = [
  { id: 'none', label: 'Product Only', description: 'No model', icon: '💍' },
  { id: 'hand', label: 'Hand Only', description: 'For rings/bracelets', icon: '🤚' },
  { id: 'neck', label: 'Neck/Chest', description: 'For necklaces', icon: '👤' },
  { id: 'ear', label: 'Ear/Profile', description: 'For earrings', icon: '👂' },
  { id: 'half', label: 'Half Body', description: 'Waist up', icon: '🧍' },
  { id: 'full', label: 'Full Body', description: 'Complete figure', icon: '🧍‍♀️' },
];

// Setting Options
const SETTING_OPTIONS: OptionItem[] = [
  { id: 'studio-white', label: 'Studio White', description: 'Pure white BG', icon: '⬜' },
  { id: 'studio-gray', label: 'Studio Gray', description: 'Neutral gray BG', icon: '🔲' },
  { id: 'studio-black', label: 'Studio Black', description: 'Dark dramatic', icon: '⬛' },
  { id: 'indoor-living', label: 'Living Room', description: 'Home interior', icon: '🛋️' },
  { id: 'indoor-vanity', label: 'Vanity/Mirror', description: 'Makeup setting', icon: '🪞' },
  { id: 'outdoor-garden', label: 'Garden', description: 'Natural greenery', icon: '🌿' },
  { id: 'outdoor-urban', label: 'Urban/City', description: 'Street style', icon: '🏙️' },
  { id: 'outdoor-beach', label: 'Beach', description: 'Coastal vibes', icon: '🏖️' },
  { id: 'cafe', label: 'Café', description: 'Cozy ambiance', icon: '☕' },
  { id: 'abstract', label: 'Abstract', description: 'Blur/bokeh BG', icon: '🌈' },
];

// Mood Options
const MOOD_OPTIONS: OptionItem[] = [
  { id: 'elegant', label: 'Elegant', description: 'Sophisticated refined', icon: '✨' },
  { id: 'romantic', label: 'Romantic', description: 'Soft warm tones', icon: '💕' },
  { id: 'dramatic', label: 'Dramatic', description: 'High contrast', icon: '🎭' },
  { id: 'fresh', label: 'Fresh', description: 'Bright natural', icon: '🌸' },
  { id: 'warm', label: 'Warm', description: 'Golden cozy', icon: '🌅' },
  { id: 'cool', label: 'Cool', description: 'Blue modern', icon: '❄️' },
  { id: 'luxurious', label: 'Luxurious', description: 'Rich opulent', icon: '👑' },
  { id: 'playful', label: 'Playful', description: 'Fun vibrant', icon: '🎉' },
  { id: 'mysterious', label: 'Mysterious', description: 'Dark moody', icon: '🌙' },
  { id: 'serene', label: 'Serene', description: 'Calm peaceful', icon: '🕊️' },
];

// ============================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedLabel?: string;
  children: React.ReactNode;
}

function CollapsibleSection({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  selectedLabel,
  children 
}: CollapsibleSectionProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-medium text-white/80">{title}</span>
          {selectedLabel && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
              {selectedLabel}
            </span>
          )}
        </div>
        <ChevronDown 
          className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-200 ${
        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-white/5 p-2">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPTION BUTTON COMPONENT
// ============================================

interface OptionButtonProps {
  option: OptionItem;
  isSelected: boolean;
  onClick: () => void;
}

function OptionButton({ option, isSelected, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-0.5 rounded-md border p-2 text-left transition-all ${
        isSelected
          ? 'border-white/30 bg-white/10 text-white'
          : 'border-white/5 bg-white/[0.02] text-white/60 hover:border-white/15 hover:bg-white/[0.04] hover:text-white/80'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs">{option.icon}</span>
        <span className="text-[11px] font-medium">{option.label}</span>
      </div>
      {option.description && (
        <span className="text-[9px] text-white/40">{option.description}</span>
      )}
    </button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface SelectivePresetsPanelProps {
  gender: 'women' | 'men' | null;
  jewelryType: 'ring' | 'necklace' | 'earring' | 'bracelet' | null;
  aspectRatio: string;
  showFace: FaceVisibility;
  onGenerate: (prompt: string) => void;
  disabled?: boolean;
}

export function SelectivePresetsPanel({
  gender,
  jewelryType,
  aspectRatio,
  showFace,
  onGenerate,
  disabled = false,
}: SelectivePresetsPanelProps) {
  // Selection state
  const [selections, setSelections] = useState<SelectivePresetOptions>({
    style: null,
    modelType: null,
    setting: null,
    mood: null,
  });

  // Accordion state - all open by default
  const [openSections, setOpenSections] = useState({
    style: true,
    model: true,
    setting: true,
    mood: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateSelection = (key: keyof SelectivePresetOptions, value: string) => {
    setSelections(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value, // Toggle on re-click
    }));
  };

  const getSelectedLabel = (options: OptionItem[], selectedId: string | null): string | undefined => {
    if (!selectedId) return undefined;
    return options.find(o => o.id === selectedId)?.label;
  };

  const hasAnySelection = Object.values(selections).some(v => v !== null);

  // Build prompt from selections
  const buildPrompt = useCallback(() => {
    const parts: string[] = [];
    
    // Header with generation settings
    parts.push('[GENERATION SETTINGS]');
    parts.push(`Gender: ${gender || 'not specified'}`);
    parts.push(`Jewelry Type: ${jewelryType || 'ring'}`);
    parts.push(`Aspect Ratio: ${aspectRatio}`);
    parts.push(`Model Face: ${showFace === 'hide' ? 'HIDDEN' : 'VISIBLE'}`);
    parts.push('');
    parts.push('[SELECTIVE PRESET]');
    
    // Style
    if (selections.style) {
      const style = STYLE_OPTIONS.find(s => s.id === selections.style);
      parts.push(`Style: ${style?.label} - ${style?.description}`);
    }
    
    // Model Type
    if (selections.modelType) {
      const model = MODEL_OPTIONS.find(m => m.id === selections.modelType);
      parts.push(`Model: ${model?.label} - ${model?.description}`);
    }
    
    // Setting
    if (selections.setting) {
      const setting = SETTING_OPTIONS.find(s => s.id === selections.setting);
      parts.push(`Setting: ${setting?.label} - ${setting?.description}`);
    }
    
    // Mood
    if (selections.mood) {
      const mood = MOOD_OPTIONS.find(m => m.id === selections.mood);
      parts.push(`Mood: ${mood?.label} - ${mood?.description}`);
    }
    
    parts.push('');
    parts.push('[PROMPT]');
    
    // Build detailed prompt
    const promptParts: string[] = [];
    
    promptParts.push(`Professional ${jewelryType || 'jewelry'} photography.`);
    
    if (selections.style) {
      const stylePrompts: Record<string, string> = {
        editorial: 'High-end editorial magazine style, sophisticated composition, refined aesthetics.',
        ecommerce: 'Clean e-commerce catalog photography, pure white background, product-focused.',
        lifestyle: 'Natural lifestyle photography, candid authentic moment, relatable aesthetic.',
        luxury: 'Luxury premium photography, dramatic lighting, exclusive high-end feel.',
        minimalist: 'Minimalist clean aesthetic, negative space, simple elegant composition.',
        vintage: 'Vintage nostalgic style, classic film aesthetic, warm tones, timeless.',
        modern: 'Contemporary modern style, geometric clean lines, fresh innovative look.',
        artistic: 'Creative artistic photography, experimental composition, unique perspective.',
      };
      promptParts.push(stylePrompts[selections.style] || '');
    }
    
    if (selections.modelType && selections.modelType !== 'none') {
      const modelPrompts: Record<string, string> = {
        hand: `${gender || 'Model'} hand elegantly posed, fingers naturally positioned, jewelry prominently displayed.`,
        neck: `${gender || 'Model'} neck and upper chest area, ${showFace === 'hide' ? 'face cropped out at chin level' : 'natural expression'}, jewelry as focal point.`,
        ear: `${gender || 'Model'} profile view showing ear, ${showFace === 'hide' ? 'face partially cropped' : 'elegant side profile'}, earring prominently visible.`,
        half: `${gender || 'Model'} from waist up, ${showFace === 'hide' ? 'cropped above neck' : 'elegant pose with natural expression'}.`,
        full: `Full body ${gender || 'model'} shot, ${showFace === 'hide' ? 'face not visible' : 'complete elegant pose'}, jewelry integrated into outfit.`,
      };
      promptParts.push(modelPrompts[selections.modelType] || '');
    } else if (selections.modelType === 'none') {
      promptParts.push('Product-only shot, no model, jewelry as sole subject.');
    }
    
    if (selections.setting) {
      const settingPrompts: Record<string, string> = {
        'studio-white': 'Pure white seamless studio background, clean professional lighting.',
        'studio-gray': 'Neutral gray studio backdrop, balanced professional lighting.',
        'studio-black': 'Deep black dramatic background, accent lighting on jewelry.',
        'indoor-living': 'Elegant living room interior, soft natural light from windows.',
        'indoor-vanity': 'Vanity mirror setting, warm ambient lighting, intimate atmosphere.',
        'outdoor-garden': 'Natural garden setting, soft dappled sunlight through leaves.',
        'outdoor-urban': 'Urban city street background, modern architectural elements.',
        'outdoor-beach': 'Beach coastal setting, soft golden hour light, ocean in background.',
        'cafe': 'Cozy café ambiance, warm interior lighting, lifestyle context.',
        'abstract': 'Abstract blurred background, beautiful bokeh, soft color gradients.',
      };
      promptParts.push(settingPrompts[selections.setting] || '');
    }
    
    if (selections.mood) {
      const moodPrompts: Record<string, string> = {
        elegant: 'Elegant sophisticated mood, refined color palette, graceful presentation.',
        romantic: 'Romantic soft atmosphere, warm pink tones, dreamy quality.',
        dramatic: 'Dramatic high-contrast mood, bold shadows, intense presence.',
        fresh: 'Fresh bright mood, clean whites, natural daylight feel.',
        warm: 'Warm golden mood, amber tones, cozy inviting atmosphere.',
        cool: 'Cool modern mood, blue undertones, crisp contemporary feel.',
        luxurious: 'Luxurious opulent mood, rich deep tones, premium aesthetic.',
        playful: 'Playful vibrant mood, dynamic colors, fun energetic feel.',
        mysterious: 'Mysterious moody atmosphere, dark tones, intriguing shadows.',
        serene: 'Serene peaceful mood, soft pastel tones, calming presence.',
      };
      promptParts.push(moodPrompts[selections.mood] || '');
    }
    
    promptParts.push('CRITICAL: Preserve exact jewelry design unchanged. Ultra-sharp 300dpi professional quality.');
    
    parts.push(promptParts.join(' '));
    
    return parts.join('\n');
  }, [selections, gender, jewelryType, aspectRatio, showFace]);

  const handleGenerate = () => {
    if (!hasAnySelection || disabled) return;
    const prompt = buildPrompt();
    onGenerate(prompt);
  };

  return (
    <div className="space-y-2">
      {/* Style Section */}
      <CollapsibleSection
        title="Style"
        icon="🎨"
        isOpen={openSections.style}
        onToggle={() => toggleSection('style')}
        selectedLabel={getSelectedLabel(STYLE_OPTIONS, selections.style)}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {STYLE_OPTIONS.map(option => (
            <OptionButton
              key={option.id}
              option={option}
              isSelected={selections.style === option.id}
              onClick={() => updateSelection('style', option.id)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Model Section */}
      <CollapsibleSection
        title="Model"
        icon="👤"
        isOpen={openSections.model}
        onToggle={() => toggleSection('model')}
        selectedLabel={getSelectedLabel(MODEL_OPTIONS, selections.modelType)}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {MODEL_OPTIONS.map(option => (
            <OptionButton
              key={option.id}
              option={option}
              isSelected={selections.modelType === option.id}
              onClick={() => updateSelection('modelType', option.id)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Setting Section */}
      <CollapsibleSection
        title="Setting"
        icon="📍"
        isOpen={openSections.setting}
        onToggle={() => toggleSection('setting')}
        selectedLabel={getSelectedLabel(SETTING_OPTIONS, selections.setting)}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {SETTING_OPTIONS.map(option => (
            <OptionButton
              key={option.id}
              option={option}
              isSelected={selections.setting === option.id}
              onClick={() => updateSelection('setting', option.id)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Mood Section */}
      <CollapsibleSection
        title="Mood"
        icon="💫"
        isOpen={openSections.mood}
        onToggle={() => toggleSection('mood')}
        selectedLabel={getSelectedLabel(MOOD_OPTIONS, selections.mood)}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {MOOD_OPTIONS.map(option => (
            <OptionButton
              key={option.id}
              option={option}
              isSelected={selections.mood === option.id}
              onClick={() => updateSelection('mood', option.id)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!hasAnySelection || disabled || !jewelryType}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all ${
          hasAnySelection && !disabled && jewelryType
            ? 'bg-white/10 text-white hover:bg-white/15 border border-white/20'
            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Generate with Selection
      </button>

      {/* Helper text */}
      {!jewelryType && (
        <p className="text-center text-[9px] text-amber-400/70">
          Configure settings to enable generation
        </p>
      )}
    </div>
  );
}

export default SelectivePresetsPanel;
