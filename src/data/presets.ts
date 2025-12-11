import { PresetCategory, Preset, PresetGender, PresetJewelryType, PresetTab } from '@/types/preset';

/**
 * Master Preset Library
 * All available presets organized by category
 * ONLY includes presets with actual images in public/presets/
 * 
 * tab: 'women' (kadın mankenli), 'men' (erkek mankenli), 'studio' (sadece ürün)
 * gender: 'women' | 'men' | 'all' (default: 'all')
 * jewelryType: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'all' (default: 'all')
 */
export const PRESET_CATEGORIES: PresetCategory[] = [
  // Presets will be added here
];

/**
 * Helper function to get a preset by ID
 */
export function getPresetById(presetId: string): Preset | undefined {
  for (const category of PRESET_CATEGORIES) {
    const preset = category.presets.find((p) => p.id === presetId);
    if (preset) return preset;
  }
  return undefined;
}

/**
 * Filter presets by gender and jewelry type
 * 
 * @param gender - 'women' | 'men' | undefined (undefined = show all)
 * @param jewelryType - 'ring' | 'necklace' | 'earring' | 'bracelet' | undefined
 * @returns Filtered preset categories with matching presets
 */
export function filterPresets(
  gender?: PresetGender,
  jewelryType?: PresetJewelryType
): PresetCategory[] {
  return PRESET_CATEGORIES.map((category) => ({
    ...category,
    presets: category.presets.filter((preset) => {
      // Gender filter
      const genderMatch = 
        !gender || // No filter = show all
        !preset.gender || // Preset has no gender = show for all
        preset.gender === 'all' || // Preset is for all genders
        preset.gender === gender; // Exact match

      // Jewelry type filter
      const jewelryMatch = 
        !jewelryType || // No filter = show all
        !preset.jewelryType || // Preset has no type = show for all
        preset.jewelryType === 'all' || // Preset is for all types
        preset.jewelryType === jewelryType; // Exact match

      return genderMatch && jewelryMatch;
    }),
  })).filter((category) => category.presets.length > 0); // Remove empty categories
}

/**
 * Get all presets as flat array (filtered)
 */
export function getAllPresets(
  gender?: PresetGender,
  jewelryType?: PresetJewelryType
): Preset[] {
  const filtered = filterPresets(gender, jewelryType);
  return filtered.flatMap((category) => category.presets);
}

/**
 * Check if a preset matches the given filters
 */
export function presetMatchesFilter(
  preset: Preset,
  gender?: PresetGender,
  jewelryType?: PresetJewelryType
): boolean {
  const genderMatch = 
    !gender || 
    !preset.gender || 
    preset.gender === 'all' || 
    preset.gender === gender;

  const jewelryMatch = 
    !jewelryType || 
    !preset.jewelryType || 
    preset.jewelryType === 'all' || 
    preset.jewelryType === jewelryType;

  return genderMatch && jewelryMatch;
}

/**
 * Filter presets by tab (women, men, studio)
 */
export function filterPresetsByTab(tab: PresetTab): PresetCategory[] {
  return PRESET_CATEGORIES.map((category) => ({
    ...category,
    presets: category.presets.filter((preset) => {
      // If preset has no tab, default behavior:
      // - 'studio' tab shows presets without tab or with tab='studio'
      // - 'women'/'men' tabs only show presets with matching tab
      if (!preset.tab) {
        return tab === 'studio'; // Default to studio if no tab specified
      }
      return preset.tab === tab;
    }),
  })).filter((category) => category.presets.length > 0);
}

/**
 * Get default tab based on generation settings gender
 */
export function getDefaultTab(gender?: PresetGender | null): PresetTab {
  if (gender === 'women') return 'women';
  if (gender === 'men') return 'men';
  return 'studio';
}
