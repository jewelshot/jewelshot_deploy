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
  // ========================================
  // WHITE BACKGROUNDS - Studio Product Shots
  // ========================================
  {
    id: 'white-backgrounds',
    name: 'White Backgrounds',
    emoji: '',
    description: 'Clean, professional white background shots perfect for e-commerce',
    presets: [
      {
        id: 'e-commerce',
        title: 'E-commerce Standard',
        description: 'Amazon/eBay style white background',
        imagePath: '/presets/e-commerce.webp',
        categoryId: 'white-backgrounds',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'e-commerce product photo, white background, centered composition, even lighting',
      },
      {
        id: '18k-yellow-gold',
        title: '18K Yellow Gold',
        description: 'Luxurious deep 18k yellow gold with rich warm tones',
        imagePath: '/presets/18k-yellow-gold.webp',
        categoryId: 'white-backgrounds',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'commercial jewelry photography, luxury product master shot, close-up macro, luxurious deep 18k yellow gold, rich warm tones, highly saturated gold, vibrant golden hue, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt: 'pale gold, desaturated color, flat color, cold color tone, greenish gold, brassy gold, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
      {
        id: '14k-yellow-gold',
        title: '14K Yellow Gold',
        description: 'Vibrant rich 14k yellow gold with bright warm tones',
        imagePath: '/presets/14k-yellow-gold.webp',
        categoryId: 'white-backgrounds',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'commercial jewelry photography, luxury product master shot, close-up macro, luxurious rich 14k yellow gold, vibrant warm tones, highly saturated gold, bright golden hue, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt: 'deep orange gold, reddish gold, copper tone, bronze tone, pale gold, desaturated color, flat color, cold color tone, greenish gold, brassy gold, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
      {
        id: '22k-yellow-gold',
        title: '22K Yellow Gold',
        description: 'Intense deep 22k yellow gold with majestic golden hue',
        imagePath: '/presets/22k-yellow-gold.webp',
        categoryId: 'white-backgrounds',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'commercial jewelry photography, luxury product master shot, close-up macro, luxurious deep 22k yellow gold, intense yellow-orange tones, deepest saturated gold, rich majestic golden hue, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt: 'pale yellow, light gold, faint saturation, greenish gold, brassy gold, desaturated color, flat color, cold color tone, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
      {
        id: 'white-gold',
        title: 'White Gold',
        description: 'Luxurious 14k white gold with chrome-like rhodium finish',
        imagePath: '/presets/white-gold.webp',
        categoryId: 'white-backgrounds',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'commercial jewelry photography, luxury product master shot, close-up macro, luxurious 14k white gold, bright neutral silver tones, high polish rhodium finish, chrome-like luster, clean white metal, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt: 'yellow gold, brassy tone, warm color cast, sepia tone, tarnished silver, black oxidation, dull grey metal, matte finish, pale gold, greenish tint, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
      {
        id: 'rose-gold',
        title: 'Rose Gold',
        description: 'Elegant 18k rose gold with vibrant coppery pink tones',
        imagePath: '/presets/rose-gold.webp',
        categoryId: 'white-backgrounds',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'commercial jewelry photography, luxury product master shot, close-up macro, luxurious rich 18k rose gold, vibrant coppery pink tones, soft warm blush hue, elegant rose lustre, highly saturated rose gold, accurate material rendering, realistic metal shading, preserved inner shank gradients, deep ambient occlusion, three-dimensional depth, soft shadow transitions on metal curve, structural integrity, preserved intricate motifs, high polish finish with depth, distinct stone facets, gemstone brilliance, light dispersion, fire and scintillation, realistic diamond rendering (if present), soft diffused studio lighting, controlled highlights, invisible photographer, pure white background, soft drop shadow, 8k, ultra detailed, pristine, high fidelity',
        negativePrompt: 'yellow gold, silver, white gold, intense red, rusty copper, oxidised copper, orange tone, brassy tone, pale pink, desaturated color, flat color, cold color tone, greenish tint, wrong metal color, flat lighting, loss of shadow detail, over-smoothed metal, plastic look, dead stones, cloudy stones, windowing in gems, black stones, photographer reflection, camera reflection, overexposed, blown out highlights, washed out, harsh glare, blurry, noisy, grainy, low resolution, melting details, altered design, added stones',
      },
    ],
  },
  // ========================================
  // STILL LIFE - Artistic Product Shots
  // ========================================
  {
    id: 'still-life',
    name: 'Still Life',
    emoji: '',
    description: 'Artistic still life compositions with natural props and lighting',
    presets: [
      {
        id: 'still-life',
        title: 'Classic Still Life',
        description: 'Traditional still life with natural elements',
        imagePath: '/presets/still-life.webp',
        categoryId: 'still-life',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'still life product photography, natural elements, soft natural lighting, artistic composition',
      },
    ],
  },
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
        id: 'on-model-ring-women-elegant',
        title: 'Elegant Ring Shot',
        description: 'Elegant hand pose showcasing ring',
        imagePath: '/presets/on-model.webp',
        categoryId: 'on-model',
        tab: 'women',
        gender: 'women',
        jewelryType: 'ring',
        prompt: 'professional female model wearing ring, elegant hand pose, soft studio lighting, neutral background, close-up on hand',
      },
      // NECKLACES - Women
      {
        id: 'on-model-necklace-women-portrait',
        title: 'Necklace Portrait',
        description: 'Portrait shot highlighting necklace',
        imagePath: '/presets/on-model.webp',
        categoryId: 'on-model',
        tab: 'women',
        gender: 'women',
        jewelryType: 'necklace',
        prompt: 'professional female model wearing necklace, portrait shot, soft studio lighting, focus on neckline and jewelry',
      },
      // EARRINGS - Women
      {
        id: 'on-model-earring-women-profile',
        title: 'Earring Profile',
        description: 'Side profile showcasing earrings',
        imagePath: '/presets/on-model.webp',
        categoryId: 'on-model',
        tab: 'women',
        gender: 'women',
        jewelryType: 'earring',
        prompt: 'professional female model wearing earrings, side profile, elegant pose, soft studio lighting, focus on ear and jewelry',
      },
      // BRACELETS - Women
      {
        id: 'on-model-bracelet-women-wrist',
        title: 'Bracelet on Wrist',
        description: 'Wrist shot showcasing bracelet',
        imagePath: '/presets/on-model.webp',
        categoryId: 'on-model',
        tab: 'women',
        gender: 'women',
        jewelryType: 'bracelet',
        prompt: 'professional female model wearing bracelet, elegant wrist pose, soft studio lighting, focus on wrist and jewelry',
      },
      // ALL JEWELRY - Women (generic)
      {
        id: 'on-model-women-classic',
        title: 'Classic On Model',
        description: 'Professional model shot with jewelry',
        imagePath: '/presets/on-model.webp',
        categoryId: 'on-model',
        tab: 'women',
        gender: 'women',
        jewelryType: 'all',
        prompt: 'professional female model wearing jewelry, elegant pose, soft studio lighting, neutral background',
      },
    ],
  },
  // ========================================
  // LIFESTYLE - Women
  // ========================================
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    emoji: '',
    description: 'Natural, candid moments showing jewelry in everyday contexts',
    presets: [
      // RINGS - Women Lifestyle
      {
        id: 'lifestyle-ring-women-coffee',
        title: 'Coffee Moment',
        description: 'Ring on hand holding coffee cup',
        imagePath: '/presets/lifestyle.webp',
        categoryId: 'lifestyle',
        tab: 'women',
        gender: 'women',
        jewelryType: 'ring',
        prompt: 'lifestyle jewelry photography, female hand wearing ring holding coffee cup, natural setting, authentic moment, soft natural light',
      },
      // NECKLACES - Women Lifestyle
      {
        id: 'lifestyle-necklace-women-outdoor',
        title: 'Outdoor Elegance',
        description: 'Necklace in outdoor natural setting',
        imagePath: '/presets/lifestyle.webp',
        categoryId: 'lifestyle',
        tab: 'women',
        gender: 'women',
        jewelryType: 'necklace',
        prompt: 'lifestyle jewelry photography, female model wearing necklace, outdoor natural setting, golden hour light, candid moment',
      },
      // EARRINGS - Women Lifestyle  
      {
        id: 'lifestyle-earring-women-casual',
        title: 'Casual Chic',
        description: 'Earrings in casual setting',
        imagePath: '/presets/lifestyle.webp',
        categoryId: 'lifestyle',
        tab: 'women',
        gender: 'women',
        jewelryType: 'earring',
        prompt: 'lifestyle jewelry photography, female model wearing earrings, casual setting, natural expression, soft window light',
      },
      // BRACELETS - Women Lifestyle
      {
        id: 'lifestyle-bracelet-women-desk',
        title: 'Work Elegance',
        description: 'Bracelet in professional setting',
        imagePath: '/presets/lifestyle.webp',
        categoryId: 'lifestyle',
        tab: 'women',
        gender: 'women',
        jewelryType: 'bracelet',
        prompt: 'lifestyle jewelry photography, female wrist wearing bracelet on desk, professional setting, elegant composition, natural light',
      },
      // ALL - Women Lifestyle (generic)
      {
        id: 'lifestyle-women-natural',
        title: 'Natural Lifestyle',
        description: 'Natural daily life setting',
        imagePath: '/presets/lifestyle.webp',
        categoryId: 'lifestyle',
        tab: 'women',
        gender: 'women',
        jewelryType: 'all',
        prompt: 'lifestyle jewelry photography, female model, natural setting, authentic moment, soft natural light',
      },
    ],
  },
  // ========================================
  // LUXURY - Studio
  // ========================================
  {
    id: 'luxury',
    name: 'Luxury',
    emoji: '',
    description: 'Premium, sophisticated imagery emphasizing high-end appeal',
    presets: [
      {
        id: 'luxury',
        title: 'Classic Luxury',
        description: 'Timeless luxury aesthetic',
        imagePath: '/presets/luxury.webp',
        categoryId: 'luxury',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'luxury product photography, premium materials, elegant composition, soft dramatic lighting',
      },
      {
        id: 'luxury-editorial',
        title: 'Luxury Editorial',
        description: 'High-fashion editorial luxury style',
        imagePath: '/presets/luxury-editorial.webp',
        categoryId: 'luxury',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'luxury editorial photography, high-fashion styling, dramatic lighting, premium aesthetic',
      },
      // RING specific luxury
      {
        id: 'luxury-ring-velvet',
        title: 'Velvet Ring Display',
        description: 'Ring on luxury velvet cushion',
        imagePath: '/presets/luxury.webp',
        categoryId: 'luxury',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'ring',
        prompt: 'luxury ring photography, ring on deep velvet cushion, dramatic spotlight, premium aesthetic, soft shadows',
      },
      // NECKLACE specific luxury
      {
        id: 'luxury-necklace-display',
        title: 'Necklace Display Stand',
        description: 'Necklace on premium display',
        imagePath: '/presets/luxury.webp',
        categoryId: 'luxury',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'necklace',
        prompt: 'luxury necklace photography, necklace on elegant display bust, dramatic lighting, premium aesthetic',
      },
    ],
  },
  // ========================================
  // CLOSE-UP - Studio Macro
  // ========================================
  {
    id: 'close-up',
    name: 'Close-Up Details',
    emoji: '',
    description: 'Macro photography highlighting craftsmanship and details',
    presets: [
      {
        id: 'close-up',
        title: 'Detail Close-Up',
        description: 'Sharp focus on details',
        imagePath: '/presets/close-up.webp',
        categoryId: 'close-up',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'all',
        prompt: 'macro close-up product photography, sharp focus, detailed craftsmanship, clean background',
      },
      // Ring close-up
      {
        id: 'close-up-ring-stone',
        title: 'Stone Detail',
        description: 'Macro shot of ring stone',
        imagePath: '/presets/close-up.webp',
        categoryId: 'close-up',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'ring',
        prompt: 'macro jewelry photography, extreme close-up of ring stone, sharp focus on facets, light dispersion, clean background',
      },
      // Necklace close-up
      {
        id: 'close-up-necklace-clasp',
        title: 'Chain Detail',
        description: 'Macro shot of chain links',
        imagePath: '/presets/close-up.webp',
        categoryId: 'close-up',
        tab: 'studio',
        gender: 'all',
        jewelryType: 'necklace',
        prompt: 'macro jewelry photography, extreme close-up of necklace chain links, craftsmanship detail, clean background',
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
