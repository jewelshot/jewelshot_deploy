/**
 * Preset Type Definitions
 * Defines the structure for AI image generation presets
 */

export type PresetGender = 'women' | 'men' | 'all';
export type PresetJewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | 'all';
export type PresetTab = 'women' | 'men' | 'studio';

export interface Preset {
  id: string;
  title: string;
  description?: string;
  imagePath: string;
  categoryId: string;
  prompt?: string; // The AI prompt associated with this preset
  negativePrompt?: string; // Negative prompt to avoid unwanted elements
  gender?: PresetGender; // 'women', 'men', or 'all' (default: 'all')
  jewelryType?: PresetJewelryType; // 'ring', 'necklace', 'earring', 'bracelet', or 'all' (default: 'all')
  tab?: PresetTab; // 'women' (on-model female), 'men' (on-model male), 'studio' (product only)
}

export interface PresetCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  presets: Preset[];
}

export interface SelectedPreset {
  presetId: string;
  categoryId: string;
  addedAt: number;
}

export interface UserPresetLibrary {
  selectedPresets: SelectedPreset[];
  maxPresets: number; // Limit for free/premium users
}
