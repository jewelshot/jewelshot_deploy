/**
 * Preset Type Definitions
 * Defines the structure for AI image generation presets
 */

export interface Preset {
  id: string;
  title: string;
  description?: string;
  imagePath: string;
  categoryId: string;
  prompt?: string; // The AI prompt associated with this preset
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
