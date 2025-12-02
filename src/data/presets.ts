import { PresetCategory, Preset } from '@/types/preset';

/**
 * Master Preset Library
 * All available presets organized by category
 * ONLY includes presets with actual images in public/presets/
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
