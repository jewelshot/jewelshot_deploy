import { PresetCategory, Preset, PresetGender, PresetJewelryType, PresetTab } from '@/types/preset';
import { WOMEN_PRESET_CATEGORIES, WOMEN_PRESET_COUNT } from './presets/women';

/**
 * Master Preset Library
 * All available presets organized by category
 * 
 * STRUCTURE:
 * - Women On-Model: 150+ presets (All Jewelry Types)
 * - Men On-Model: Coming soon
 * - Still Life: Coming soon
 * 
 * tab: 'women' (kadın mankenli), 'men' (erkek mankenli), 'studio' (sadece ürün)
 * gender: 'women' | 'men' | 'all' (default: 'all')
 * jewelryType: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'all' (default: 'all')
 */

// Legacy presets (with actual images)
const LEGACY_PRESETS: PresetCategory[] = [
  // ========================================
  // ON MODEL - Women
  // ========================================
  {
    id: 'on-model',
    name: 'On Model',
    emoji: '',
    description: 'Professional model photography showcasing how jewelry looks when worn',
    presets: [
      // RINGS - Women
      {
        id: 'on-model-ring-women-elegant-hand',
        title: 'Elegant Hand - Soft Light',
        description: 'Clean lifestyle shot with relaxed hand pose on cream fabric',
        imagePath: '/presets/on-model-ring-elegant.webp',
        categoryId: 'on-model',
        tab: 'women',
        gender: 'women',
        jewelryType: 'ring',
        prompt: `Jewelry Photography, Clean, Soft Light, Lifestyle, Detail-Oriented, High Fidelity Replication, Constraint-Based style.

Subject: Gold ring with thin zig-zag band. MANDATORY: Worn STRICTLY on the ring finger (4th digit) of the model's right hand. CRITICAL: Snug and perfect fit with ZERO visible gap between the ring metal and the skin. STRICTLY PRESERVE the exact zig-zag band design - NO alteration, deformation, or modification to the ring's pattern is allowed. Pin-sharp focus on the hand and ring.

Model: Woman's hand and lower forearm (cropped), light/fair skin tone, oval shape nails, short to medium length, natural light pink/nude polish manicure, hand slightly relaxed, fingers gently spread, viewed from the back/side with knuckles visible.

Lighting: Softbox/Natural diffused light, side/top-side direction, high key bright and airy, very soft minimal shadows, elegant gentle high-end mood.

Background: Off-white/cream linen or soft cotton fabric (jacket/blazer lapel area), monochromatic light tones (gold, cream, nude), shallow depth of field with bokeh effect blurring the fabric background slightly.

Composition: Close-up macro/detail shot, hand occupying the central/lower portion of the frame.

Technical: Macro or short telephoto lens for shallow DoF, slightly warm color grading, high contrast but not harsh, desaturated except for gold and skin tones, high resolution professional quality.`,
        negativePrompt: 'ring on wrong finger, loose ring, gap between ring and skin, altered ring design, deformed pattern, modified zig-zag, harsh shadows, dark background, cluttered composition, busy patterns, oversaturated colors, cold tones, blurry ring, unfocused jewelry, chipped nail polish, dirty nails, wrinkled skin, visible veins, low quality, grainy, noisy',
      },
      // RINGS - Women - Gold Wrap Ring
      {
        id: 'on-model-ring-women-gold-wrap',
        title: 'Gold Wrap Ring - Macro Detail',
        description: 'Close-up macro shot with realistic skin indentation and snug fit',
        imagePath: '/presets/on-model-ring-gold-wrap.webp',
        categoryId: 'on-model',
        tab: 'women',
        gender: 'women',
        jewelryType: 'ring',
        prompt: `close-up macro shot of young woman's hand, elegant youthful hand pose slightly turned, relaxed fingers gently curled, thumb resting by the index finger, wearing the input gold wrap-style jewelry ring with teardrop ends specifically on the fourth ring finger (proximal phalanx), smooth soft skin texture, airbrushed skin finish, slender fingers, well-manicured short nails, pale neutral nude nail polish, ring has a perfect snug fit, visible realistic skin indentation and compression around the thick ring band, heavy metal weight simulation, no gaps between ring and finger, soft diffused studio lighting from the left, warm neutral light tones, cinematic atmosphere, shallow depth of field, sharp focus on the ring and surrounding skin, blurred soft cream beige fabric folds background, creamy bokeh, high resolution, 8k detail, photorealistic, vertical composition, luxury jewelry photography`,
        negativePrompt: 'straight fingers, open palm, flat hand, fingers spread apart, fist, holding object, ring on middle finger, ring on index finger, ring on thumb, ring on pinky finger, jewelry on wrong finger, floating ring, loose fit, gap between finger and ring, oversized ring, changing ring design, altering jewelry shape, generic ring, thin ring band, old hands, aged hands, wrinkled skin, prominent veins, dry skin, textured skin, hairy skin, masculine hands, thick fingers, sausage fingers, chubby hands, deformed hands, bad anatomy, unnatural pose, dirty nails, bright nail polish, messy background, harsh lighting, deep shadows, overexposed, grainy, noise, low resolution, cartoon, cgi, sketch',
      },
    ],
  },
  // ========================================
  // HIGH-KEY - Women
  // ========================================
  {
    id: 'high-key',
    name: 'High-Key',
    emoji: '',
    description: 'Bright, clean high-key studio photography with pure white backgrounds',
    presets: [
      {
        id: 'high-key-ring-women-gentle-smile',
        title: 'Gentle Smile - Ring Finger',
        description: 'Elegant hand near jawline with gentle smile, pure white background',
        imagePath: '/presets/high-key-ring-gentle-smile.webp',
        categoryId: 'high-key',
        tab: 'women',
        gender: 'women',
        jewelryType: 'ring',
        prompt: `(masterpiece, best quality, 8k, photorealistic:1.3), commercial jewelry photography, high-key studio lighting, pure white background, anonymous cropped shot, focus on female hand and lower face, elegant hand holding empty ring finger up near jawline, chin and lower lip visible with a gentle smile, wearing white silk blouse, natural clean skin texture, minimalist, sharp focus on finger, clean manicure, soft happy mood`,
        negativePrompt: '(full face shot:1.6), eyes, nose, complete face visible, portrait, (naked:1.5), topless, cleavage, (ring:1.7), (jewelry:1.6), (wearing ring:1.6), bracelet, watch, (Nano Banana marker icon:1.7), watermark, text, logo, branding, heavy makeup, strange hairstyles, bald, bad anatomy, bad hands, missing fingers, extra fingers, strong shadows, dark background, grainy, cartoon, 3d render, plastic skin, robot, serious expression, frowning',
      },
    ],
  },
];

// ============================================================================
// COMBINED PRESET CATEGORIES
// Merges legacy presets with new modular presets
// ============================================================================
export const PRESET_CATEGORIES: PresetCategory[] = [
  ...LEGACY_PRESETS,
  ...WOMEN_PRESET_CATEGORIES,
];

// Export counts for stats
export { WOMEN_PRESET_COUNT };
export const TOTAL_PRESET_COUNT = LEGACY_PRESETS.reduce((sum, cat) => sum + cat.presets.length, 0) + WOMEN_PRESET_COUNT;

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
