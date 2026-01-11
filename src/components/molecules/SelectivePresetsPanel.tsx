/**
 * SelectivePresetsPanel Component
 * 
 * Build custom presets by selecting individual parameters
 * Style, Model, Setting, Mood - dynamically filtered by jewelry type AND gender
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { FaceVisibility } from '@/lib/generation-settings-storage';
import { buildSelectivePrompt } from '@/lib/prompt-builder';

// ============================================
// TYPES
// ============================================

export interface SelectivePresetOptions {
  style: string | null;
  modelType: string | null;
  setting: string | null;
  mood: string | null;
}

type Gender = 'women' | 'men';
type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet';

interface OptionItem {
  id: string;
  label: string;
  description?: string;
  forJewelry?: JewelryType[];
  forStyles?: string[];
  forGender?: Gender[];
}

// ============================================
// OPTION DEFINITIONS
// ============================================

const STYLE_OPTIONS: OptionItem[] = [
  { id: 'editorial', label: 'Editorial', description: 'Magazine quality' },
  { id: 'ecommerce', label: 'E-Commerce', description: 'Clean catalog' },
  { id: 'lifestyle', label: 'Lifestyle', description: 'Natural candid' },
  { id: 'luxury', label: 'Luxury', description: 'Premium dramatic' },
  { id: 'minimalist', label: 'Minimalist', description: 'Simple clean' },
  { id: 'artistic', label: 'Artistic', description: 'Creative experimental' },
];

const MODEL_OPTIONS: OptionItem[] = [
  // Universal
  { id: 'product-only', label: 'Product Only', description: 'No model, jewelry focus' },
  { id: 'half-body', label: 'Half Body', description: 'Waist up shot' },
  { id: 'full-body', label: 'Full Body', description: 'Complete figure' },
  
  // Ring & Bracelet - Women
  { id: 'hand-elegant-f', label: 'Elegant Hand', description: 'Graceful feminine pose', forJewelry: ['ring', 'bracelet'], forGender: ['women'] },
  { id: 'hand-natural-f', label: 'Natural Hand', description: 'Soft relaxed pose', forJewelry: ['ring', 'bracelet'], forGender: ['women'] },
  { id: 'hand-gesture-f', label: 'Delicate Gesture', description: 'Gentle movement', forJewelry: ['ring', 'bracelet'], forGender: ['women'] },
  { id: 'hands-together-f', label: 'Hands Together', description: 'Feminine interlaced', forJewelry: ['ring', 'bracelet'], forGender: ['women'] },
  { id: 'hand-face-f', label: 'Hand on Face', description: 'Touching cheek gently', forJewelry: ['ring', 'bracelet'], forGender: ['women'] },
  { id: 'hand-hair-f', label: 'Playing with Hair', description: 'Running through hair', forJewelry: ['ring', 'bracelet'], forGender: ['women'] },
  
  // Ring & Bracelet - Men
  { id: 'hand-confident-m', label: 'Confident Hand', description: 'Strong masculine pose', forJewelry: ['ring', 'bracelet'], forGender: ['men'] },
  { id: 'hand-relaxed-m', label: 'Relaxed Hand', description: 'Casual natural pose', forJewelry: ['ring', 'bracelet'], forGender: ['men'] },
  { id: 'hand-grip-m', label: 'Grip/Hold', description: 'Holding object', forJewelry: ['ring', 'bracelet'], forGender: ['men'] },
  { id: 'hands-clasped-m', label: 'Hands Clasped', description: 'Business/confident', forJewelry: ['ring', 'bracelet'], forGender: ['men'] },
  { id: 'hand-chin-m', label: 'Hand on Chin', description: 'Thoughtful pose', forJewelry: ['ring', 'bracelet'], forGender: ['men'] },
  { id: 'wrist-watch-m', label: 'Watch Style', description: 'Wrist display pose', forJewelry: ['bracelet'], forGender: ['men'] },
  
  // Necklace - Women
  { id: 'neck-closeup-f', label: 'Neck Close-up', description: 'Delicate framing', forJewelry: ['necklace'], forGender: ['women'] },
  { id: 'decollete-f', label: 'Decollete', description: 'Elegant collarbone', forJewelry: ['necklace'], forGender: ['women'] },
  { id: 'shoulder-bare-f', label: 'Bare Shoulders', description: 'Off-shoulder elegance', forJewelry: ['necklace'], forGender: ['women'] },
  { id: 'layered-f', label: 'Layered Chains', description: 'Multiple necklaces', forJewelry: ['necklace'], forGender: ['women'] },
  
  // Necklace - Men
  { id: 'neck-closeup-m', label: 'Neck Close-up', description: 'Strong neckline', forJewelry: ['necklace'], forGender: ['men'] },
  { id: 'chest-open-m', label: 'Open Collar', description: 'Shirt unbuttoned', forJewelry: ['necklace'], forGender: ['men'] },
  { id: 'chain-pendant-m', label: 'Chain Focus', description: 'Bold chain/pendant', forJewelry: ['necklace'], forGender: ['men'] },
  { id: 'casual-neck-m', label: 'Casual Neck', description: 'T-shirt neckline', forJewelry: ['necklace'], forGender: ['men'] },
  
  // Earring - Women
  { id: 'ear-closeup-f', label: 'Ear Close-up', description: 'Delicate detail', forJewelry: ['earring'], forGender: ['women'] },
  { id: 'profile-elegant-f', label: 'Elegant Profile', description: 'Graceful side view', forJewelry: ['earring'], forGender: ['women'] },
  { id: 'three-quarter-f', label: '3/4 View', description: 'Feminine angle', forJewelry: ['earring'], forGender: ['women'] },
  { id: 'hair-up-f', label: 'Hair Up', description: 'Updo showing earrings', forJewelry: ['earring'], forGender: ['women'] },
  { id: 'hair-tucked-f', label: 'Hair Tucked', description: 'Behind ear reveal', forJewelry: ['earring'], forGender: ['women'] },
  
  // Earring - Men
  { id: 'ear-closeup-m', label: 'Ear Close-up', description: 'Clean detail shot', forJewelry: ['earring'], forGender: ['men'] },
  { id: 'profile-strong-m', label: 'Strong Profile', description: 'Bold jawline view', forJewelry: ['earring'], forGender: ['men'] },
  { id: 'three-quarter-m', label: '3/4 View', description: 'Masculine angle', forJewelry: ['earring'], forGender: ['men'] },
  { id: 'stud-focus-m', label: 'Stud Focus', description: 'Minimal stud style', forJewelry: ['earring'], forGender: ['men'] },
];

const SETTING_OPTIONS: OptionItem[] = [
  { id: 'studio-white', label: 'Studio White', description: 'Pure white seamless', forStyles: ['ecommerce', 'minimalist', 'editorial'] },
  { id: 'studio-gray', label: 'Studio Gray', description: 'Neutral backdrop', forStyles: ['ecommerce', 'minimalist', 'editorial', 'luxury'] },
  { id: 'studio-black', label: 'Studio Black', description: 'Dark dramatic', forStyles: ['luxury', 'editorial', 'artistic'] },
  { id: 'gradient-soft', label: 'Soft Gradient', description: 'Subtle color fade', forStyles: ['editorial', 'minimalist', 'luxury'] },
  { id: 'living-room', label: 'Living Room', description: 'Modern home interior', forStyles: ['lifestyle'] },
  { id: 'bedroom', label: 'Bedroom', description: 'Intimate setting', forStyles: ['lifestyle'] },
  { id: 'vanity-mirror', label: 'Vanity Mirror', description: 'Getting ready moment', forStyles: ['lifestyle', 'editorial'] },
  { id: 'cafe-restaurant', label: 'Cafe', description: 'Cozy public space', forStyles: ['lifestyle'] },
  { id: 'garden-nature', label: 'Garden', description: 'Natural greenery', forStyles: ['lifestyle', 'artistic'] },
  { id: 'beach-coastal', label: 'Beach', description: 'Coastal golden hour', forStyles: ['lifestyle', 'artistic'] },
  { id: 'urban-city', label: 'Urban Street', description: 'City backdrop', forStyles: ['lifestyle', 'editorial'] },
  { id: 'abstract-bokeh', label: 'Abstract Bokeh', description: 'Blurred light play', forStyles: ['artistic', 'luxury'] },
  { id: 'textured-surface', label: 'Textured Surface', description: 'Marble, velvet, etc.', forStyles: ['luxury', 'editorial', 'artistic'] },
  { id: 'dramatic-shadows', label: 'Dramatic Shadows', description: 'Chiaroscuro lighting', forStyles: ['artistic', 'luxury'] },
];

const MOOD_OPTIONS: OptionItem[] = [
  { id: 'elegant', label: 'Elegant', description: 'Refined sophisticated' },
  { id: 'dramatic', label: 'Dramatic', description: 'Bold high contrast' },
  { id: 'fresh', label: 'Fresh', description: 'Bright natural light' },
  { id: 'luxurious', label: 'Luxurious', description: 'Rich opulent feel' },
  { id: 'romantic', label: 'Romantic', description: 'Soft warm dreamy', forGender: ['women'] },
  { id: 'ethereal', label: 'Ethereal', description: 'Dreamy magical', forGender: ['women'] },
  { id: 'sensual', label: 'Sensual', description: 'Intimate alluring', forGender: ['women'] },
  { id: 'playful', label: 'Playful', description: 'Fun energetic vibe', forGender: ['women'] },
  { id: 'bold', label: 'Bold', description: 'Strong confident', forGender: ['men'] },
  { id: 'rugged', label: 'Rugged', description: 'Raw masculine', forGender: ['men'] },
  { id: 'sleek', label: 'Sleek', description: 'Modern minimal', forGender: ['men'] },
  { id: 'edgy', label: 'Edgy', description: 'Alternative cool', forGender: ['men'] },
  { id: 'warm', label: 'Warm', description: 'Golden cozy tones' },
  { id: 'cool', label: 'Cool', description: 'Modern blue tones' },
  { id: 'mysterious', label: 'Mysterious', description: 'Dark moody allure' },
  { id: 'serene', label: 'Serene', description: 'Calm peaceful zen' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function filterOptions(
  options: OptionItem[], 
  jewelryType: JewelryType | null, 
  gender: Gender | null,
  style: string | null
): OptionItem[] {
  return options.filter(opt => {
    if (opt.forJewelry && opt.forJewelry.length > 0) {
      if (!jewelryType || !opt.forJewelry.includes(jewelryType)) return false;
    }
    if (opt.forGender && opt.forGender.length > 0) {
      if (!gender || !opt.forGender.includes(gender)) return false;
    }
    if (opt.forStyles && opt.forStyles.length > 0) {
      if (!style || !opt.forStyles.includes(style)) return false;
    }
    return true;
  });
}

// ============================================
// COLLAPSIBLE SECTION
// ============================================

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedLabel?: string;
  disabled?: boolean;
  disabledMessage?: string;
  children: React.ReactNode;
}

function CollapsibleSection({ 
  title, 
  isOpen, 
  onToggle, 
  selectedLabel,
  disabled,
  disabledMessage,
  children 
}: CollapsibleSectionProps) {
  return (
    <div className={`rounded-lg border overflow-hidden transition-all ${
      disabled ? 'border-white/5 bg-white/[0.01] opacity-50' : 'border-white/10 bg-white/[0.02]'
    }`}>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`flex w-full items-center justify-between px-3 py-2.5 transition-colors ${
          disabled ? 'cursor-not-allowed' : 'hover:bg-white/[0.03]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/80">{title}</span>
          {selectedLabel && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
              {selectedLabel}
            </span>
          )}
          {disabled && disabledMessage && (
            <span className="text-[9px] text-amber-400/70">{disabledMessage}</span>
          )}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <div className={`overflow-hidden transition-all duration-200 ${isOpen && !disabled ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-white/5 p-2">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// OPTION BUTTON
// ============================================

function OptionButton({ option, isSelected, onClick }: { option: OptionItem; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-0.5 rounded-md border p-2 text-left transition-all ${
        isSelected
          ? 'border-white/30 bg-white/10 text-white'
          : 'border-white/5 bg-white/[0.02] text-white/60 hover:border-white/15 hover:bg-white/[0.04] hover:text-white/80'
      }`}
    >
      <span className="text-[11px] font-medium">{option.label}</span>
      {option.description && <span className="text-[9px] text-white/40">{option.description}</span>}
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
  const [selections, setSelections] = useState<SelectivePresetOptions>({
    style: null,
    modelType: null,
    setting: null,
    mood: null,
  });

  const [openSections, setOpenSections] = useState({
    style: true,
    model: true,
    setting: true,
    mood: true,
  });

  const filteredModelOptions = useMemo(() => filterOptions(MODEL_OPTIONS, jewelryType, gender, null), [jewelryType, gender]);
  const filteredSettingOptions = useMemo(() => filterOptions(SETTING_OPTIONS, null, null, selections.style), [selections.style]);
  const filteredMoodOptions = useMemo(() => filterOptions(MOOD_OPTIONS, null, gender, null), [gender]);

  useEffect(() => {
    if (selections.modelType) {
      const validOptions = filterOptions(MODEL_OPTIONS, jewelryType, gender, null);
      if (!validOptions.some(o => o.id === selections.modelType)) {
        setSelections(prev => ({ ...prev, modelType: null }));
      }
    }
  }, [jewelryType, gender, selections.modelType]);

  useEffect(() => {
    if (selections.mood) {
      const validOptions = filterOptions(MOOD_OPTIONS, null, gender, null);
      if (!validOptions.some(o => o.id === selections.mood)) {
        setSelections(prev => ({ ...prev, mood: null }));
      }
    }
  }, [gender, selections.mood]);

  const updateSelection = useCallback((key: keyof SelectivePresetOptions, value: string) => {
    setSelections(prev => {
      const newValue = prev[key] === value ? null : value;
      if (key === 'style') {
        const newSettings = filterOptions(SETTING_OPTIONS, null, null, newValue);
        return {
          ...prev,
          style: newValue,
          setting: prev.setting && newSettings.some(s => s.id === prev.setting) ? prev.setting : null,
        };
      }
      return { ...prev, [key]: newValue };
    });
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getSelectedLabel = (options: OptionItem[], selectedId: string | null): string | undefined => {
    if (!selectedId) return undefined;
    return options.find(o => o.id === selectedId)?.label;
  };

  const hasMinimumSelection = selections.style !== null;

  const handleGenerate = useCallback(() => {
    if (!hasMinimumSelection || disabled || !jewelryType || !gender) return;
    
    const { prompt } = buildSelectivePrompt(
      { gender, jewelryType, aspectRatio, showFace },
      selections
    );
    
    onGenerate(prompt);
  }, [hasMinimumSelection, disabled, jewelryType, gender, aspectRatio, showFace, selections, onGenerate]);

  const settingsComplete = Boolean(gender && jewelryType && aspectRatio && showFace);

  return (
    <div className="space-y-2">
      {!settingsComplete && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-center">
          <p className="text-[10px] text-amber-400">Configure Generation Settings first</p>
        </div>
      )}

      <CollapsibleSection
        title="Style"
        isOpen={openSections.style}
        onToggle={() => toggleSection('style')}
        selectedLabel={getSelectedLabel(STYLE_OPTIONS, selections.style)}
        disabled={!settingsComplete}
      >
        <div className="grid grid-cols-2 gap-1.5">
          {STYLE_OPTIONS.map(option => (
            <OptionButton key={option.id} option={option} isSelected={selections.style === option.id} onClick={() => updateSelection('style', option.id)} />
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Model"
        isOpen={openSections.model}
        onToggle={() => toggleSection('model')}
        selectedLabel={getSelectedLabel(filteredModelOptions, selections.modelType)}
        disabled={!settingsComplete}
        disabledMessage={!jewelryType ? 'Select jewelry type' : undefined}
      >
        {filteredModelOptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5">
            {filteredModelOptions.map(option => (
              <OptionButton key={option.id} option={option} isSelected={selections.modelType === option.id} onClick={() => updateSelection('modelType', option.id)} />
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-white/40 text-center py-2">Select jewelry type to see options</p>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Setting"
        isOpen={openSections.setting}
        onToggle={() => toggleSection('setting')}
        selectedLabel={getSelectedLabel(filteredSettingOptions, selections.setting)}
        disabled={!settingsComplete || !selections.style}
        disabledMessage={!selections.style ? 'Select style first' : undefined}
      >
        {filteredSettingOptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5">
            {filteredSettingOptions.map(option => (
              <OptionButton key={option.id} option={option} isSelected={selections.setting === option.id} onClick={() => updateSelection('setting', option.id)} />
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-white/40 text-center py-2">Select a style to see settings</p>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Mood"
        isOpen={openSections.mood}
        onToggle={() => toggleSection('mood')}
        selectedLabel={getSelectedLabel(filteredMoodOptions, selections.mood)}
        disabled={!settingsComplete}
      >
        {filteredMoodOptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5">
            {filteredMoodOptions.map(option => (
              <OptionButton key={option.id} option={option} isSelected={selections.mood === option.id} onClick={() => updateSelection('mood', option.id)} />
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-white/40 text-center py-2">No moods available</p>
        )}
      </CollapsibleSection>

      <button
        onClick={handleGenerate}
        disabled={!hasMinimumSelection || disabled || !settingsComplete}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all ${
          hasMinimumSelection && !disabled && settingsComplete
            ? 'bg-white/10 text-white hover:bg-white/15 border border-white/20'
            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        Generate with Selection
      </button>

      {settingsComplete && !hasMinimumSelection && (
        <p className="text-center text-[9px] text-white/40">Select at least a Style to generate</p>
      )}
    </div>
  );
}

export default SelectivePresetsPanel;
