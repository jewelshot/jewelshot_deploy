import { PresetCategory, Preset, PresetGender, PresetJewelryType } from '@/types/preset';

/**
 * Master Preset Library
 * All available presets organized by category
 * ONLY includes presets with actual images in public/presets/
 * 
 * gender: 'women' | 'men' | 'all' (default: 'all' - uygulanabilir tüm cinsiyetler)
 * jewelryType: 'ring' | 'necklace' | 'earring' | 'bracelet' | 'all' (default: 'all')
 */
export const PRESET_CATEGORIES: PresetCategory[] = [
  {
    id: 'white-backgrounds',
    name: 'White Backgrounds',
    emoji: '⚪',
    description:
      'Clean, professional white background shots perfect for e-commerce',
    presets: [
      {
        id: 'e-commerce',
        title: 'E-commerce Standard',
        description: 'Amazon/eBay style white background',
        imagePath: '/presets/e-commerce.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'e-commerce product photo, white background, centered composition, even lighting',
      },
      {
        id: '18k-yellow-gold',
        title: '18K Yellow Gold',
        description: 'Luxurious deep 18k yellow gold with rich warm tones',
        imagePath: '/presets/18k-yellow-gold.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'commercial jewelry photography, luxury product master shot, close-up macro, luxurious deep 18k yellow gold, rich warm tones, highly saturated gold, vibrant golden hue, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt:
          'pale gold, desaturated color, flat color, cold color tone, greenish gold, brassy gold, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
      {
        id: '14k-yellow-gold',
        title: '14K Yellow Gold',
        description: 'Vibrant rich 14k yellow gold with bright warm tones',
        imagePath: '/presets/14k-yellow-gold.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'commercial jewelry photography, luxury product master shot, close-up macro, luxurious rich 14k yellow gold, vibrant warm tones, highly saturated gold, bright golden hue, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt:
          'deep orange gold, reddish gold, copper tone, bronze tone, pale gold, desaturated color, flat color, cold color tone, greenish gold, brassy gold, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
      {
        id: '22k-yellow-gold',
        title: '22K Yellow Gold',
        description: 'Intense deep 22k yellow gold with majestic golden hue',
        imagePath: '/presets/22k-yellow-gold.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'commercial jewelry photography, luxury product master shot, close-up macro, luxurious deep 22k yellow gold, intense yellow-orange tones, deepest saturated gold, rich majestic golden hue, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt:
          'pale yellow, light gold, faint saturation, greenish gold, brassy gold, desaturated color, flat color, cold color tone, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
      {
        id: 'white-gold',
        title: 'White Gold',
        description: 'Luxurious 14k white gold with chrome-like rhodium finish',
        imagePath: '/presets/white-gold.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'commercial jewelry photography, luxury product master shot, close-up macro, luxurious 14k white gold, bright neutral silver tones, high polish rhodium finish, chrome-like luster, clean white metal, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt:
          'yellow gold, brassy tone, warm color cast, sepia tone, tarnished silver, black oxidation, dull grey metal, matte finish, pale gold, greenish tint, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
      {
        id: 'rose-gold',
        title: 'Rose Gold',
        description: 'Elegant 18k rose gold with vibrant coppery pink tones',
        imagePath: '/presets/rose-gold.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'commercial jewelry photography, luxury product master shot, close-up macro, luxurious rich 18k rose gold, vibrant coppery pink tones, soft warm blush hue, elegant rose lustre, highly saturated rose gold, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt:
          'yellow gold, silver, white gold, intense red, rusty copper, oxidised copper, orange tone, brassy tone, pale pink, desaturated color, flat color, cold color tone, greenish tint, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
    ],
  },
  {
    id: 'still-life',
    name: 'Still Life',
    emoji: '🎨',
    description:
      'Artistic still life compositions with natural props and lighting',
    presets: [
      {
        id: 'still-life',
        title: 'Classic Still Life',
        description: 'Traditional still life with natural elements',
        imagePath: '/presets/still-life.webp',
        categoryId: 'still-life',
        prompt:
          'still life product photography, natural elements, soft natural lighting, artistic composition',
      },
    ],
  },
  {
    id: 'on-model',
    name: 'On Model',
    emoji: '👤',
    description: 'Professional model photography showcasing how jewelry looks when worn',
    presets: [
      {
        id: 'on-model',
        title: 'Classic On Model',
        description: 'Professional model shot with jewelry',
        imagePath: '/presets/on-model.webp',
        categoryId: 'on-model',
        prompt:
          'professional model wearing jewelry, elegant pose, soft studio lighting, neutral background',
      },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    emoji: '🌿',
    description: 'Natural, candid moments showing jewelry in everyday contexts',
    presets: [
      {
        id: 'lifestyle',
        title: 'Natural Lifestyle',
        description: 'Natural daily life setting',
        imagePath: '/presets/lifestyle.webp',
        categoryId: 'lifestyle',
        prompt:
          'lifestyle product photography, natural setting, authentic moment, soft natural light',
      },
    ],
  },
  {
    id: 'luxury',
    name: 'Luxury',
    emoji: '💎',
    description: 'Premium, sophisticated imagery emphasizing high-end appeal',
    presets: [
      {
        id: 'luxury',
        title: 'Classic Luxury',
        description: 'Timeless luxury aesthetic',
        imagePath: '/presets/luxury.webp',
        categoryId: 'luxury',
        prompt:
          'luxury product photography, premium materials, elegant composition, soft dramatic lighting',
      },
      {
        id: 'luxury-editorial',
        title: 'Luxury Editorial',
        description: 'High-fashion editorial luxury style',
        imagePath: '/presets/luxury-editorial.webp',
        categoryId: 'luxury',
        prompt:
          'luxury editorial photography, high-fashion styling, dramatic lighting, premium aesthetic',
      },
    ],
  },
  {
    id: 'close-up',
    name: 'Close-Up Details',
    emoji: '🔍',
    description: 'Macro photography highlighting craftsmanship and details',
    presets: [
      {
        id: 'close-up',
        title: 'Detail Close-Up',
        description: 'Sharp focus on details',
        imagePath: '/presets/close-up.webp',
        categoryId: 'close-up',
        prompt:
          'macro close-up product photography, sharp focus, detailed craftsmanship, clean background',
      },
    ],
  },
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
