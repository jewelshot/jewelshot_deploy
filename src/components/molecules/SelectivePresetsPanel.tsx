/**
 * SelectivePresetsPanel Component
 * 
 * Build custom presets by selecting individual parameters
 * Style, Model, Setting, Mood - dynamically filtered by jewelry type
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { FaceVisibility } from '@/lib/generation-settings-storage';

// ============================================
// TYPES
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
  // Which jewelry types this option applies to (empty = all)
  forJewelry?: ('ring' | 'necklace' | 'earring' | 'bracelet')[];
  // Which styles this option applies to (empty = all)
  forStyles?: string[];
}

// ============================================
// OPTION DEFINITIONS
// ============================================

// Style Options - applies to all jewelry types
const STYLE_OPTIONS: OptionItem[] = [
  { id: 'editorial', label: 'Editorial', description: 'Magazine quality', icon: '📸' },
  { id: 'ecommerce', label: 'E-Commerce', description: 'Clean catalog', icon: '🛒' },
  { id: 'lifestyle', label: 'Lifestyle', description: 'Natural candid', icon: '☕' },
  { id: 'luxury', label: 'Luxury', description: 'Premium dramatic', icon: '💎' },
  { id: 'minimalist', label: 'Minimalist', description: 'Simple clean', icon: '◻️' },
  { id: 'artistic', label: 'Artistic', description: 'Creative experimental', icon: '🎨' },
];

// Model Options - filtered by jewelry type
const MODEL_OPTIONS: OptionItem[] = [
  // Product Only - all jewelry types
  { id: 'product-only', label: 'Product Only', description: 'No model, jewelry focus', icon: '💍', forJewelry: ['ring', 'necklace', 'earring', 'bracelet'] },
  
  // Ring & Bracelet - Hand options
  { id: 'hand-elegant', label: 'Elegant Hand', description: 'Graceful hand pose', icon: '🤚', forJewelry: ['ring', 'bracelet'] },
  { id: 'hand-natural', label: 'Natural Hand', description: 'Relaxed casual hand', icon: '✋', forJewelry: ['ring', 'bracelet'] },
  { id: 'hand-gesture', label: 'Hand Gesture', description: 'Dynamic movement', icon: '👌', forJewelry: ['ring', 'bracelet'] },
  { id: 'hands-both', label: 'Both Hands', description: 'Hands together/touching', icon: '🙏', forJewelry: ['ring', 'bracelet'] },
  
  // Necklace - Neck/Chest options
  { id: 'neck-closeup', label: 'Neck Close-up', description: 'Tight framing on necklace', icon: '👤', forJewelry: ['necklace'] },
  { id: 'decollete', label: 'Décolleté', description: 'Collarbone & chest area', icon: '✨', forJewelry: ['necklace'] },
  { id: 'neck-shoulder', label: 'Neck & Shoulders', description: 'Wider framing', icon: '🧍', forJewelry: ['necklace'] },
  
  // Earring - Ear/Face options
  { id: 'ear-closeup', label: 'Ear Close-up', description: 'Tight on ear & earring', icon: '👂', forJewelry: ['earring'] },
  { id: 'profile-side', label: 'Side Profile', description: 'Classic profile view', icon: '🎭', forJewelry: ['earring'] },
  { id: 'three-quarter', label: '3/4 View', description: 'Angled face view', icon: '📐', forJewelry: ['earring'] },
  
  // Half & Full body - Necklace, Earring, Bracelet
  { id: 'half-body', label: 'Half Body', description: 'Waist up shot', icon: '🧍', forJewelry: ['necklace', 'earring', 'bracelet'] },
  { id: 'full-body', label: 'Full Body', description: 'Complete figure', icon: '🧍‍♀️', forJewelry: ['necklace', 'earring'] },
];

// Setting Options - filtered by style
const SETTING_OPTIONS: OptionItem[] = [
  // Studio options - E-commerce, Minimalist, Luxury
  { id: 'studio-white', label: 'Studio White', description: 'Pure white seamless', icon: '⬜', forStyles: ['ecommerce', 'minimalist', 'editorial'] },
  { id: 'studio-gray', label: 'Studio Gray', description: 'Neutral backdrop', icon: '🔲', forStyles: ['ecommerce', 'minimalist', 'editorial', 'luxury'] },
  { id: 'studio-black', label: 'Studio Black', description: 'Dark dramatic', icon: '⬛', forStyles: ['luxury', 'editorial', 'artistic'] },
  { id: 'gradient-soft', label: 'Soft Gradient', description: 'Subtle color fade', icon: '🌅', forStyles: ['editorial', 'minimalist', 'luxury'] },
  
  // Indoor lifestyle options
  { id: 'living-room', label: 'Living Room', description: 'Modern home interior', icon: '🛋️', forStyles: ['lifestyle'] },
  { id: 'bedroom', label: 'Bedroom', description: 'Intimate setting', icon: '🛏️', forStyles: ['lifestyle'] },
  { id: 'vanity-mirror', label: 'Vanity Mirror', description: 'Getting ready moment', icon: '🪞', forStyles: ['lifestyle', 'editorial'] },
  { id: 'cafe-restaurant', label: 'Café', description: 'Cozy public space', icon: '☕', forStyles: ['lifestyle'] },
  
  // Outdoor lifestyle options
  { id: 'garden-nature', label: 'Garden', description: 'Natural greenery', icon: '🌿', forStyles: ['lifestyle', 'artistic'] },
  { id: 'beach-coastal', label: 'Beach', description: 'Coastal golden hour', icon: '🏖️', forStyles: ['lifestyle', 'artistic'] },
  { id: 'urban-city', label: 'Urban Street', description: 'City backdrop', icon: '🏙️', forStyles: ['lifestyle', 'editorial'] },
  
  // Artistic options
  { id: 'abstract-bokeh', label: 'Abstract Bokeh', description: 'Blurred light play', icon: '✨', forStyles: ['artistic', 'luxury'] },
  { id: 'textured-surface', label: 'Textured Surface', description: 'Marble, velvet, etc.', icon: '🪨', forStyles: ['luxury', 'editorial', 'artistic'] },
  { id: 'dramatic-shadows', label: 'Dramatic Shadows', description: 'Chiaroscuro lighting', icon: '🌑', forStyles: ['artistic', 'luxury'] },
];

// Mood Options - some filtered by style
const MOOD_OPTIONS: OptionItem[] = [
  { id: 'elegant', label: 'Elegant', description: 'Refined sophisticated', icon: '✨', forStyles: ['editorial', 'luxury', 'minimalist'] },
  { id: 'romantic', label: 'Romantic', description: 'Soft warm dreamy', icon: '💕', forStyles: ['lifestyle', 'artistic'] },
  { id: 'dramatic', label: 'Dramatic', description: 'Bold high contrast', icon: '🎭', forStyles: ['luxury', 'editorial', 'artistic'] },
  { id: 'fresh', label: 'Fresh', description: 'Bright natural light', icon: '🌸', forStyles: ['lifestyle', 'ecommerce', 'minimalist'] },
  { id: 'warm', label: 'Warm', description: 'Golden cozy tones', icon: '🌅', forStyles: ['lifestyle', 'luxury'] },
  { id: 'cool', label: 'Cool', description: 'Modern blue tones', icon: '❄️', forStyles: ['minimalist', 'editorial'] },
  { id: 'luxurious', label: 'Luxurious', description: 'Rich opulent feel', icon: '👑', forStyles: ['luxury', 'editorial'] },
  { id: 'playful', label: 'Playful', description: 'Fun energetic vibe', icon: '🎉', forStyles: ['lifestyle', 'artistic'] },
  { id: 'mysterious', label: 'Mysterious', description: 'Dark moody allure', icon: '🌙', forStyles: ['artistic', 'luxury'] },
  { id: 'serene', label: 'Serene', description: 'Calm peaceful zen', icon: '🕊️', forStyles: ['minimalist', 'lifestyle'] },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function filterOptionsByJewelry(options: OptionItem[], jewelryType: string | null): OptionItem[] {
  if (!jewelryType) return [];
  return options.filter(opt => {
    if (!opt.forJewelry || opt.forJewelry.length === 0) return true;
    return opt.forJewelry.includes(jewelryType as any);
  });
}

function filterOptionsByStyle(options: OptionItem[], style: string | null): OptionItem[] {
  if (!style) return options; // Show all if no style selected
  return options.filter(opt => {
    if (!opt.forStyles || opt.forStyles.length === 0) return true;
    return opt.forStyles.includes(style);
  });
}

// ============================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedLabel?: string;
  disabled?: boolean;
  disabledMessage?: string;
  children: React.ReactNode;
}

function CollapsibleSection({ 
  title, 
  icon, 
  isOpen, 
  onToggle, 
  selectedLabel,
  disabled,
  disabledMessage,
  children 
}: CollapsibleSectionProps) {
  return (
    <div className={`rounded-lg border overflow-hidden transition-all ${
      disabled 
        ? 'border-white/5 bg-white/[0.01] opacity-50' 
        : 'border-white/10 bg-white/[0.02]'
    }`}>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`flex w-full items-center justify-between px-3 py-2.5 transition-colors ${
          disabled ? 'cursor-not-allowed' : 'hover:bg-white/[0.03]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
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
        <ChevronDown 
          className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-200 ${
        isOpen && !disabled ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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

  // Get filtered options based on jewelry type and style
  const filteredModelOptions = useMemo(() => 
    filterOptionsByJewelry(MODEL_OPTIONS, jewelryType),
    [jewelryType]
  );

  const filteredSettingOptions = useMemo(() => 
    filterOptionsByStyle(SETTING_OPTIONS, selections.style),
    [selections.style]
  );

  const filteredMoodOptions = useMemo(() => 
    filterOptionsByStyle(MOOD_OPTIONS, selections.style),
    [selections.style]
  );

  // Reset dependent selections when parent changes
  const updateSelection = useCallback((key: keyof SelectivePresetOptions, value: string) => {
    setSelections(prev => {
      const newValue = prev[key] === value ? null : value;
      
      // If style changes, clear setting and mood if they're no longer valid
      if (key === 'style') {
        const newSettings = filterOptionsByStyle(SETTING_OPTIONS, newValue);
        const newMoods = filterOptionsByStyle(MOOD_OPTIONS, newValue);
        
        return {
          ...prev,
          style: newValue,
          setting: prev.setting && newSettings.some(s => s.id === prev.setting) ? prev.setting : null,
          mood: prev.mood && newMoods.some(m => m.id === prev.mood) ? prev.mood : null,
        };
      }
      
      return { ...prev, [key]: newValue };
    });
  }, []);

  // Reset model selection when jewelry type changes
  React.useEffect(() => {
    if (jewelryType && selections.modelType) {
      const validOptions = filterOptionsByJewelry(MODEL_OPTIONS, jewelryType);
      if (!validOptions.some(o => o.id === selections.modelType)) {
        setSelections(prev => ({ ...prev, modelType: null }));
      }
    }
  }, [jewelryType, selections.modelType]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getSelectedLabel = (options: OptionItem[], selectedId: string | null): string | undefined => {
    if (!selectedId) return undefined;
    return options.find(o => o.id === selectedId)?.label;
  };

  const hasMinimumSelection = selections.style !== null;
  const hasAnySelection = Object.values(selections).some(v => v !== null);

  // Build prompt from selections
  const buildPrompt = useCallback(() => {
    const parts: string[] = [];
    
    // Header with generation settings
    parts.push('[GENERATION SETTINGS]');
    parts.push(`Gender: ${gender || 'not specified'}`);
    parts.push(`Jewelry Type: ${jewelryType || 'ring'}`);
    parts.push(`Aspect Ratio: ${aspectRatio}`);
    parts.push(`Model Face: ${showFace === 'hide' ? 'HIDDEN (crop at neck/chin, NO face visible)' : 'VISIBLE'}`);
    parts.push('');
    parts.push('[SELECTIVE PRESET]');
    
    // Style
    if (selections.style) {
      const style = STYLE_OPTIONS.find(s => s.id === selections.style);
      parts.push(`Style: ${style?.label}`);
    }
    
    // Model Type
    if (selections.modelType) {
      const model = MODEL_OPTIONS.find(m => m.id === selections.modelType);
      parts.push(`Model: ${model?.label}`);
    }
    
    // Setting
    if (selections.setting) {
      const setting = SETTING_OPTIONS.find(s => s.id === selections.setting);
      parts.push(`Setting: ${setting?.label}`);
    }
    
    // Mood
    if (selections.mood) {
      const mood = MOOD_OPTIONS.find(m => m.id === selections.mood);
      parts.push(`Mood: ${mood?.label}`);
    }
    
    parts.push('');
    parts.push('[PROMPT]');
    
    // Build detailed prompt based on jewelry type
    const promptParts: string[] = [];
    const genderText = gender === 'women' ? 'female' : gender === 'men' ? 'male' : '';
    const jewelryName = jewelryType || 'jewelry';
    
    promptParts.push(`Professional ${jewelryName} photography.`);
    
    // Style-specific prompts
    if (selections.style) {
      const stylePrompts: Record<string, string> = {
        editorial: 'High-end editorial magazine quality, sophisticated composition, refined aesthetics, professional lighting.',
        ecommerce: 'Clean e-commerce catalog photography, pure white background, product-focused, maximum clarity.',
        lifestyle: 'Natural lifestyle photography, candid authentic moment, relatable aesthetic, soft natural light.',
        luxury: 'Luxury premium photography, dramatic lighting, exclusive high-end feel, rich tones.',
        minimalist: 'Minimalist clean aesthetic, negative space, simple elegant composition, refined details.',
        artistic: 'Creative artistic photography, experimental composition, unique perspective, artistic expression.',
      };
      promptParts.push(stylePrompts[selections.style] || '');
    }
    
    // Model-specific prompts based on jewelry type
    if (selections.modelType) {
      const modelPrompts: Record<string, string> = {
        // Product only
        'product-only': `${jewelryName} displayed without model, product as sole subject, elegant presentation.`,
        
        // Hand options (ring, bracelet)
        'hand-elegant': `${genderText} hand elegantly posed, fingers gracefully positioned, ${jewelryName} prominently displayed, refined gesture.`,
        'hand-natural': `${genderText} hand in natural relaxed position, casual authentic pose, ${jewelryName} featured naturally.`,
        'hand-gesture': `${genderText} hand in dynamic gesture, movement and energy, ${jewelryName} catching light.`,
        'hands-both': `Both ${genderText} hands together, touching or interacting, ${jewelryName} as focal point.`,
        
        // Neck options (necklace)
        'neck-closeup': `Tight framing on ${genderText} neck area, ${jewelryName} as hero element, ${showFace === 'hide' ? 'cropped above chin NO face visible' : 'partial face visible'}.`,
        'decollete': `${genderText} décolleté and collarbone area, elegant framing, ${jewelryName} draped perfectly, ${showFace === 'hide' ? 'face cropped out' : 'natural expression'}.`,
        'neck-shoulder': `${genderText} neck and shoulders, wider framing, ${jewelryName} in context, ${showFace === 'hide' ? 'cropped at chin level' : 'relaxed pose'}.`,
        
        // Ear options (earring)
        'ear-closeup': `Tight close-up on ${genderText} ear, ${jewelryName} in perfect detail, ${showFace === 'hide' ? 'cropped to exclude face' : 'partial profile visible'}.`,
        'profile-side': `${genderText} side profile view, classic silhouette, ${jewelryName} prominently featured, ${showFace === 'hide' ? 'cropped or face hidden' : 'elegant profile'}.`,
        'three-quarter': `${genderText} three-quarter angled view, ${jewelryName} visible, ${showFace === 'hide' ? 'face partially hidden or cropped' : 'natural expression'}.`,
        
        // Body options
        'half-body': `${genderText} model from waist up, ${jewelryName} integrated into look, ${showFace === 'hide' ? 'cropped above neck' : 'full pose with expression'}.`,
        'full-body': `Full body ${genderText} model, ${jewelryName} as part of complete styling, ${showFace === 'hide' ? 'face not visible' : 'elegant full pose'}.`,
      };
      promptParts.push(modelPrompts[selections.modelType] || '');
    }
    
    // Setting-specific prompts
    if (selections.setting) {
      const settingPrompts: Record<string, string> = {
        'studio-white': 'Pure white seamless studio background, clean professional lighting, no distractions.',
        'studio-gray': 'Neutral gray studio backdrop, balanced even lighting, sophisticated feel.',
        'studio-black': 'Deep black dramatic background, accent lighting on jewelry, luxury feel.',
        'gradient-soft': 'Soft subtle gradient background, smooth color transition, elegant backdrop.',
        'living-room': 'Modern living room interior, soft natural window light, lifestyle context.',
        'bedroom': 'Intimate bedroom setting, soft ambient lighting, personal moment.',
        'vanity-mirror': 'Vanity mirror setting, getting ready moment, warm lighting, lifestyle.',
        'cafe-restaurant': 'Cozy café ambiance, warm interior lighting, lifestyle context.',
        'garden-nature': 'Natural garden setting, soft dappled sunlight through leaves, organic feel.',
        'beach-coastal': 'Beach coastal setting, golden hour light, ocean in background, summery.',
        'urban-city': 'Urban city street, modern architectural elements, contemporary backdrop.',
        'abstract-bokeh': 'Abstract blurred background, beautiful bokeh lights, dreamy quality.',
        'textured-surface': 'Elegant textured surface (marble, velvet, wood), premium feel.',
        'dramatic-shadows': 'Dramatic shadow play, chiaroscuro lighting, artistic mood.',
      };
      promptParts.push(settingPrompts[selections.setting] || '');
    }
    
    // Mood-specific prompts
    if (selections.mood) {
      const moodPrompts: Record<string, string> = {
        elegant: 'Elegant sophisticated mood, refined color palette, graceful presentation.',
        romantic: 'Romantic soft atmosphere, warm pink tones, dreamy ethereal quality.',
        dramatic: 'Dramatic high-contrast mood, bold shadows, intense visual presence.',
        fresh: 'Fresh bright mood, clean whites, natural daylight feel, uplifting.',
        warm: 'Warm golden mood, amber honey tones, cozy inviting atmosphere.',
        cool: 'Cool modern mood, blue undertones, crisp contemporary feel.',
        luxurious: 'Luxurious opulent mood, rich deep tones, premium exclusive aesthetic.',
        playful: 'Playful vibrant mood, dynamic colors, fun energetic expression.',
        mysterious: 'Mysterious moody atmosphere, dark tones, intriguing shadows.',
        serene: 'Serene peaceful mood, soft pastel tones, calming zen presence.',
      };
      promptParts.push(moodPrompts[selections.mood] || '');
    }
    
    // Critical instructions
    promptParts.push('');
    promptParts.push('CRITICAL: Preserve exact jewelry design unchanged. Ultra-sharp 300dpi professional quality.');
    if (showFace === 'hide') {
      promptParts.push('STRICT: NO face visible. Crop at neck/chin level. NO eyes, nose, mouth in frame.');
    }
    
    parts.push(promptParts.join(' '));
    
    return parts.join('\n');
  }, [selections, gender, jewelryType, aspectRatio, showFace]);

  const handleGenerate = () => {
    if (!hasMinimumSelection || disabled || !jewelryType) return;
    const prompt = buildPrompt();
    onGenerate(prompt);
  };

  // Check if settings are complete
  const settingsComplete = Boolean(gender && jewelryType && aspectRatio && showFace);

  return (
    <div className="space-y-2">
      {/* Settings warning */}
      {!settingsComplete && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-center">
          <p className="text-[10px] text-amber-400">
            Configure Generation Settings first (Gender, Jewelry Type, Face)
          </p>
        </div>
      )}

      {/* Style Section - Always available */}
      <CollapsibleSection
        title="Style"
        icon="🎨"
        isOpen={openSections.style}
        onToggle={() => toggleSection('style')}
        selectedLabel={getSelectedLabel(STYLE_OPTIONS, selections.style)}
        disabled={!settingsComplete}
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

      {/* Model Section - Filtered by jewelry type */}
      <CollapsibleSection
        title="Model"
        icon="👤"
        isOpen={openSections.model}
        onToggle={() => toggleSection('model')}
        selectedLabel={getSelectedLabel(filteredModelOptions, selections.modelType)}
        disabled={!settingsComplete}
        disabledMessage={!jewelryType ? 'Select jewelry type' : undefined}
      >
        {filteredModelOptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5">
            {filteredModelOptions.map(option => (
              <OptionButton
                key={option.id}
                option={option}
                isSelected={selections.modelType === option.id}
                onClick={() => updateSelection('modelType', option.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-white/40 text-center py-2">
            Select jewelry type to see options
          </p>
        )}
      </CollapsibleSection>

      {/* Setting Section - Filtered by style */}
      <CollapsibleSection
        title="Setting"
        icon="📍"
        isOpen={openSections.setting}
        onToggle={() => toggleSection('setting')}
        selectedLabel={getSelectedLabel(filteredSettingOptions, selections.setting)}
        disabled={!settingsComplete || !selections.style}
        disabledMessage={!selections.style ? 'Select style first' : undefined}
      >
        {filteredSettingOptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5">
            {filteredSettingOptions.map(option => (
              <OptionButton
                key={option.id}
                option={option}
                isSelected={selections.setting === option.id}
                onClick={() => updateSelection('setting', option.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-white/40 text-center py-2">
            Select a style to see available settings
          </p>
        )}
      </CollapsibleSection>

      {/* Mood Section - Filtered by style */}
      <CollapsibleSection
        title="Mood"
        icon="💫"
        isOpen={openSections.mood}
        onToggle={() => toggleSection('mood')}
        selectedLabel={getSelectedLabel(filteredMoodOptions, selections.mood)}
        disabled={!settingsComplete || !selections.style}
        disabledMessage={!selections.style ? 'Select style first' : undefined}
      >
        {filteredMoodOptions.length > 0 ? (
          <div className="grid grid-cols-2 gap-1.5">
            {filteredMoodOptions.map(option => (
              <OptionButton
                key={option.id}
                option={option}
                isSelected={selections.mood === option.id}
                onClick={() => updateSelection('mood', option.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-white/40 text-center py-2">
            Select a style to see available moods
          </p>
        )}
      </CollapsibleSection>

      {/* Selection Preview */}
      {hasAnySelection && settingsComplete && (
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
          <p className="text-[9px] text-white/40 mb-1">Current selection:</p>
          <div className="flex flex-wrap gap-1">
            {selections.style && (
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] text-purple-300">
                {STYLE_OPTIONS.find(s => s.id === selections.style)?.label}
              </span>
            )}
            {selections.modelType && (
              <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] text-blue-300">
                {MODEL_OPTIONS.find(m => m.id === selections.modelType)?.label}
              </span>
            )}
            {selections.setting && (
              <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[9px] text-green-300">
                {SETTING_OPTIONS.find(s => s.id === selections.setting)?.label}
              </span>
            )}
            {selections.mood && (
              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[9px] text-orange-300">
                {MOOD_OPTIONS.find(m => m.id === selections.mood)?.label}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Generate Button */}
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

      {/* Helper text */}
      {settingsComplete && !hasMinimumSelection && (
        <p className="text-center text-[9px] text-white/40">
          Select at least a Style to generate
        </p>
      )}
    </div>
  );
}

export default SelectivePresetsPanel;
