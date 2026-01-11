/**
 * Generation Settings Storage
 * 
 * Manages localStorage for generation settings (gender, jewelry type, aspect ratio, face visibility)
 * Supports "apply to all uploads" functionality
 */

export type Gender = 'women' | 'men' | null;
export type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | null;
export type FaceVisibility = 'show' | 'hide' | null;

export interface GenerationSettings {
  gender: Gender;
  jewelryType: JewelryType;
  aspectRatio: string;
  showFace: FaceVisibility;
  applyToAll: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'jewelshot_generation_settings';

/**
 * Save generation settings to localStorage
 */
export function saveGenerationSettings(settings: GenerationSettings): void {
  try {
    const data = {
      ...settings,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save generation settings:', error);
  }
}

/**
 * Load generation settings from localStorage
 */
export function loadGenerationSettings(): GenerationSettings | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const settings = JSON.parse(data) as GenerationSettings;
    
    // Validate data structure
    if (
      typeof settings === 'object' &&
      'gender' in settings &&
      'jewelryType' in settings &&
      'aspectRatio' in settings
    ) {
      return settings;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to load generation settings:', error);
    return null;
  }
}

/**
 * Clear generation settings from localStorage
 */
export function clearGenerationSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear generation settings:', error);
  }
}

/**
 * Check if settings are complete (all required fields filled)
 */
export function areSettingsComplete(settings: Partial<GenerationSettings>): boolean {
  return !!(
    settings.gender &&
    settings.jewelryType &&
    settings.aspectRatio
  );
}

