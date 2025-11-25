import { PresetCategory } from '@/types/preset';

/**
 * Master Preset Library
 * All available presets organized by category
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
        id: 'white-bg-minimal',
        title: 'Minimal White',
        description: 'Pure white background with soft shadows',
        imagePath: '/presets/white-minimal.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'product photography on pure white background, soft shadows, minimal lighting',
      },
      {
        id: 'white-bg-studio',
        title: 'Studio White',
        description: 'Professional studio lighting on white',
        imagePath: '/presets/white-studio.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'professional studio product photography, white background, multiple light sources, clean shadows',
      },
      {
        id: 'white-bg-jewelry',
        title: 'Jewelry White',
        description: 'High-key white perfect for jewelry',
        imagePath: '/presets/white-jewelry.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'jewelry product photography, pure white background, high-key lighting, reflective surface',
      },
      {
        id: 'e-commerce',
        title: 'E-commerce Standard',
        description: 'Amazon/eBay style white background',
        imagePath: '/presets/e-commerce.webp',
        categoryId: 'white-backgrounds',
        prompt:
          'e-commerce product photo, white background, centered composition, even lighting',
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
      {
        id: 'still-life-botanical',
        title: 'Botanical Still Life',
        description: 'Surrounded by flowers and plants',
        imagePath: '/presets/still-life-botanical.webp',
        categoryId: 'still-life',
        prompt:
          'botanical still life, product with fresh flowers and leaves, natural daylight, soft shadows',
      },
      {
        id: 'still-life-luxury',
        title: 'Luxury Still Life',
        description: 'Premium materials and textures',
        imagePath: '/presets/still-life-luxury.webp',
        categoryId: 'still-life',
        prompt:
          'luxury still life, marble surface, gold accents, premium materials, dramatic lighting',
      },
      {
        id: 'still-life-moody',
        title: 'Moody Still Life',
        description: 'Dark, dramatic atmospheric setup',
        imagePath: '/presets/still-life-moody.webp',
        categoryId: 'still-life',
        prompt:
          'moody still life, dark background, dramatic side lighting, atmospheric smoke or mist',
      },
    ],
  },
  {
    id: 'on-model',
    name: 'On Model',
    emoji: '👤',
    description: 'Jewelry and accessories shown on models',
    presets: [
      {
        id: 'on-model',
        title: 'Model Portrait',
        description: 'Professional model shot with jewelry',
        imagePath: '/presets/on-model.webp',
        categoryId: 'on-model',
        prompt:
          'jewelry on professional model, studio portrait, clean background, beauty lighting',
      },
      {
        id: 'e-commerce-neck-closeup',
        title: 'Neck Close-Up',
        description: 'Close-up of necklace on model',
        imagePath: '/presets/neck-closeup.webp',
        categoryId: 'on-model',
        prompt:
          'close-up of necklace on model neck, soft focus background, natural skin tones, elegant pose',
      },
      {
        id: 'on-model-lifestyle',
        title: 'Lifestyle Model',
        description: 'Casual lifestyle setting with model',
        imagePath: '/presets/on-model-lifestyle.webp',
        categoryId: 'on-model',
        prompt:
          'jewelry on model in lifestyle setting, natural environment, candid pose, soft natural light',
      },
      {
        id: 'on-model-editorial',
        title: 'Editorial Fashion',
        description: 'High-fashion editorial style',
        imagePath: '/presets/on-model-editorial.webp',
        categoryId: 'on-model',
        prompt:
          'editorial fashion photography, jewelry on model, dramatic pose, high-contrast lighting, artistic composition',
      },
    ],
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    emoji: '☀️',
    description: 'Natural, everyday settings and scenarios',
    presets: [
      {
        id: 'lifestyle',
        title: 'Everyday Lifestyle',
        description: 'Natural daily life setting',
        imagePath: '/presets/lifestyle.webp',
        categoryId: 'lifestyle',
        prompt:
          'lifestyle product photography, natural setting, soft window light, casual composition',
      },
      {
        id: 'lifestyle-outdoor',
        title: 'Outdoor Lifestyle',
        description: 'Natural outdoor environment',
        imagePath: '/presets/lifestyle-outdoor.webp',
        categoryId: 'lifestyle',
        prompt:
          'outdoor lifestyle shot, natural environment, golden hour lighting, organic composition',
      },
      {
        id: 'lifestyle-table',
        title: 'Tabletop Scene',
        description: 'On a styled table or desk',
        imagePath: '/presets/lifestyle-table.webp',
        categoryId: 'lifestyle',
        prompt:
          'lifestyle tabletop photography, styled surface, natural props, window light',
      },
      {
        id: 'lifestyle-travel',
        title: 'Travel Lifestyle',
        description: 'Travel and adventure theme',
        imagePath: '/presets/lifestyle-travel.webp',
        categoryId: 'lifestyle',
        prompt:
          'travel lifestyle photography, adventure setting, map or travel elements, natural lighting',
      },
    ],
  },
  {
    id: 'luxury',
    name: 'Luxury',
    emoji: '💎',
    description: 'High-end, premium photography style',
    presets: [
      {
        id: 'luxury',
        title: 'Classic Luxury',
        description: 'Timeless luxury aesthetic',
        imagePath: '/presets/luxury.webp',
        categoryId: 'luxury',
        prompt:
          'luxury product photography, premium materials, elegant composition, sophisticated lighting',
      },
      {
        id: 'luxury-velvet',
        title: 'Velvet Luxury',
        description: 'Rich velvet background',
        imagePath: '/presets/luxury-velvet.webp',
        categoryId: 'luxury',
        prompt:
          'luxury jewelry on velvet, rich deep colors, dramatic lighting, premium feel',
      },
      {
        id: 'luxury-marble',
        title: 'Marble Elegance',
        description: 'Marble and gold accents',
        imagePath: '/presets/luxury-marble.webp',
        categoryId: 'luxury',
        prompt:
          'luxury product on marble surface, gold accents, sophisticated styling, high-end lighting',
      },
      {
        id: 'luxury-dark',
        title: 'Dark Luxury',
        description: 'Dramatic dark luxury style',
        imagePath: '/presets/luxury-dark.webp',
        categoryId: 'luxury',
        prompt:
          'dark luxury photography, black background, dramatic lighting, gold and silver reflections',
      },
    ],
  },
  {
    id: 'close-up',
    name: 'Close-Up',
    emoji: '🔍',
    description: 'Detailed macro and close-up shots',
    presets: [
      {
        id: 'close-up',
        title: 'Detail Focus',
        description: 'Sharp focus on details',
        imagePath: '/presets/close-up.webp',
        categoryId: 'close-up',
        prompt:
          'macro close-up photography, sharp focus on product details, shallow depth of field, clean background',
      },
      {
        id: 'close-up-macro',
        title: 'Extreme Macro',
        description: 'Ultra close-up detail shot',
        imagePath: '/presets/close-up-macro.webp',
        categoryId: 'close-up',
        prompt:
          'extreme macro photography, intricate details visible, shallow depth of field, artistic blur',
      },
      {
        id: 'close-up-texture',
        title: 'Texture Detail',
        description: 'Emphasizing textures and materials',
        imagePath: '/presets/close-up-texture.webp',
        categoryId: 'close-up',
        prompt:
          'close-up texture photography, material details, side lighting to show texture, artistic composition',
      },
      {
        id: 'close-up-sparkle',
        title: 'Sparkle & Shine',
        description: 'Highlighting brilliance and sparkle',
        imagePath: '/presets/close-up-sparkle.webp',
        categoryId: 'close-up',
        prompt:
          'close-up jewelry photography, diamonds or gemstones sparkling, dramatic lighting for brilliance',
      },
    ],
  },
  {
    id: 'etsy-optimized',
    name: 'Etsy Optimized',
    emoji: '🏪',
    description: 'Specifically optimized for Etsy marketplace',
    presets: [
      {
        id: 'etsy-hero',
        title: 'Etsy Hero Shot',
        description: 'Perfect main listing image',
        imagePath: '/presets/etsy-hero.webp',
        categoryId: 'etsy-optimized',
        prompt:
          'etsy main listing photo, clean composition, product centered, soft shadows, approachable style',
      },
      {
        id: 'etsy-lifestyle',
        title: 'Etsy Lifestyle',
        description: 'Warm, handmade feel',
        imagePath: '/presets/etsy-lifestyle.webp',
        categoryId: 'etsy-optimized',
        prompt:
          'etsy lifestyle photo, handmade aesthetic, natural props, warm lighting, authentic feel',
      },
      {
        id: 'etsy-flat-lay',
        title: 'Etsy Flat Lay',
        description: 'Top-down styled shot',
        imagePath: '/presets/etsy-flatlay.webp',
        categoryId: 'etsy-optimized',
        prompt:
          'etsy flat lay photography, overhead view, styled with natural elements, cohesive color palette',
      },
      {
        id: 'etsy-detail',
        title: 'Etsy Detail Shot',
        description: 'Showing craftsmanship details',
        imagePath: '/presets/etsy-detail.webp',
        categoryId: 'etsy-optimized',
        prompt:
          'etsy detail photography, showing craftsmanship, close-up of materials and construction, authentic lighting',
      },
    ],
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    emoji: '🎄',
    description: 'Holiday and seasonal themed photography',
    presets: [
      {
        id: 'seasonal-christmas',
        title: 'Christmas',
        description: 'Festive Christmas styling',
        imagePath: '/presets/seasonal-christmas.webp',
        categoryId: 'seasonal',
        prompt:
          'christmas product photography, festive decorations, warm holiday lighting, red and green accents',
      },
      {
        id: 'seasonal-valentine',
        title: 'Valentine',
        description: 'Romantic Valentine theme',
        imagePath: '/presets/seasonal-valentine.webp',
        categoryId: 'seasonal',
        prompt:
          'valentines day photography, romantic styling, roses and hearts, soft pink lighting',
      },
      {
        id: 'seasonal-summer',
        title: 'Summer',
        description: 'Bright summer vibes',
        imagePath: '/presets/seasonal-summer.webp',
        categoryId: 'seasonal',
        prompt:
          'summer product photography, bright sunny setting, beach or tropical elements, vibrant colors',
      },
      {
        id: 'seasonal-autumn',
        title: 'Autumn',
        description: 'Warm autumn tones',
        imagePath: '/presets/seasonal-autumn.webp',
        categoryId: 'seasonal',
        prompt:
          'autumn product photography, warm fall colors, leaves and seasonal elements, cozy lighting',
      },
    ],
  },
];

/**
 * Get a specific preset by ID
 */
export function getPresetById(presetId: string) {
  for (const category of PRESET_CATEGORIES) {
    const preset = category.presets.find((p) => p.id === presetId);
    if (preset) return preset;
  }
  return null;
}

/**
 * Get a specific category by ID
 */
export function getCategoryById(categoryId: string) {
  return PRESET_CATEGORIES.find((cat) => cat.id === categoryId);
}

/**
 * Get all presets from specific categories
 */
export function getPresetsByCategories(categoryIds: string[]) {
  return PRESET_CATEGORIES.filter((cat) =>
    categoryIds.includes(cat.id)
  ).flatMap((cat) => cat.presets);
}
