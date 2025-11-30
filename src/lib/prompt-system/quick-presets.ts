/**
 * Quick Presets
 * 
 * Ready-made prompt combinations for specific use cases
 */

import type { Gender, JewelryType, BlockSelections } from './types';

export interface QuickPreset {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: 'editorial' | 'ecommerce' | 'lifestyle' | 'luxury' | 'closeup' | 'casual';
  gender: Gender;
  jewelryType: JewelryType;
  selections: BlockSelections;
  tags: string[];
}

// ============================================
// WOMEN RING PRESETS
// ============================================

export const WOMEN_RING_PRESETS: QuickPreset[] = [
  {
    id: 'women-ring-classic-wedding',
    name: 'Classic Wedding Band',
    description: 'Traditional wedding ring on ring finger, elegant and timeless',
    category: 'ecommerce',
    gender: 'women',
    jewelryType: 'ring',
    selections: {
      'race-ethnicity': 'race-caucasian',
      'skin-tone': 'skin-light',
      'hand-selection': 'hand-left',
      'finger-selection': 'finger-ring',
      'hand-pose': 'hand-elegant',
      'hand-structure': 'hand-delicate',
      'nail-type': 'nail-french',
      'nail-color': 'nail-nude',
      'upper-clothing': 'upper-plain',
      'upper-color': 'upper-white',
      'location-background': 'loc-studio-white',
      'lighting': 'light-studio-softbox',
      'jewelry-framing': 'frame-closeup',
      'viewing-angle': 'angle-eye-level',
      'focus-depth': 'focus-sharp-jewelry',
      'composition-rules': 'comp-rule-thirds',
      'post-processing-level': 'proc-catalog',
      'color-grading': 'grade-natural',
      'presentation-intent': 'intent-ecommerce',
      'mood-atmosphere': 'mood-elegant',
      'jewelry-context': 'context-hero',
    },
    tags: ['wedding', 'traditional', 'classic', 'elegant'],
  },
  
  {
    id: 'women-ring-luxury-editorial',
    name: 'Luxury Editorial',
    description: 'High-fashion editorial style with dramatic lighting',
    category: 'editorial',
    gender: 'women',
    jewelryType: 'ring',
    selections: {
      'race-ethnicity': 'race-mixed',
      'skin-tone': 'skin-olive',
      'hand-selection': 'hand-right',
      'finger-selection': 'finger-index',
      'hand-pose': 'hand-touching-face',
      'hand-structure': 'hand-graceful-wrist',
      'nail-type': 'nail-stiletto',
      'nail-color': 'nail-burgundy',
      'makeup': 'makeup-bold-lips',
      'upper-clothing': 'upper-plain',
      'upper-color': 'upper-black',
      'location-background': 'loc-studio-black',
      'lighting': 'light-dramatic-low-key',
      'jewelry-framing': 'frame-medium-context',
      'viewing-angle': 'angle-side-profile',
      'focus-depth': 'focus-jewelry-model',
      'composition-rules': 'comp-golden-ratio',
      'post-processing-level': 'proc-professional',
      'color-grading': 'grade-high-contrast',
      'presentation-intent': 'intent-editorial',
      'mood-atmosphere': 'mood-dramatic',
      'jewelry-context': 'context-balanced',
    },
    tags: ['luxury', 'editorial', 'dramatic', 'fashion'],
  },
  
  {
    id: 'women-ring-lifestyle-coffee',
    name: 'Lifestyle Café Moment',
    description: 'Casual lifestyle shot with coffee cup, warm and inviting',
    category: 'lifestyle',
    gender: 'women',
    jewelryType: 'ring',
    selections: {
      'race-ethnicity': 'race-hispanic',
      'skin-tone': 'skin-tan',
      'hand-selection': 'hand-right',
      'finger-selection': 'finger-ring',
      'hand-pose': 'hand-holding-cup',
      'hand-structure': 'hand-youthful',
      'nail-type': 'nail-round',
      'nail-color': 'nail-pink-soft',
      'upper-clothing': 'upper-plain',
      'upper-color': 'upper-cream',
      'location-background': 'loc-lifestyle-cafe',
      'lighting': 'light-natural-window',
      'jewelry-framing': 'frame-lifestyle',
      'viewing-angle': 'angle-eye-level',
      'focus-depth': 'focus-jewelry-context-sharp',
      'composition-rules': 'comp-rule-thirds',
      'post-processing-level': 'proc-natural',
      'color-grading': 'grade-warm',
      'presentation-intent': 'intent-lifestyle',
      'mood-atmosphere': 'mood-romantic',
      'jewelry-context': 'context-lifestyle',
      'props-accessories': 'props-coffee',
    },
    tags: ['lifestyle', 'casual', 'coffee', 'warm'],
  },
  
  {
    id: 'women-ring-stacked-boho',
    name: 'Stacked Boho Rings',
    description: 'Multiple rings on different fingers, bohemian style',
    category: 'casual',
    gender: 'women',
    jewelryType: 'ring',
    selections: {
      'race-ethnicity': 'race-caucasian',
      'skin-tone': 'skin-fair',
      'hand-selection': 'hand-right',
      'finger-selection': 'finger-multiple',
      'hand-pose': 'hand-spread',
      'hand-structure': 'hand-long-fingers',
      'nail-type': 'nail-natural-short',
      'nail-color': 'nail-nude',
      'upper-clothing': 'upper-plain',
      'upper-color': 'upper-beige',
      'location-background': 'loc-outdoor-garden',
      'lighting': 'light-natural-golden',
      'jewelry-framing': 'frame-closeup',
      'viewing-angle': 'angle-eye-level',
      'focus-depth': 'focus-sharp-jewelry',
      'composition-rules': 'comp-centered',
      'post-processing-level': 'proc-light',
      'color-grading': 'grade-warm',
      'presentation-intent': 'intent-lifestyle',
      'mood-atmosphere': 'mood-playful',
      'jewelry-context': 'context-detail',
      'props-accessories': 'props-flowers',
    },
    tags: ['boho', 'stacked', 'multiple', 'casual'],
  },
  
  {
    id: 'women-ring-minimalist-catalog',
    name: 'Minimalist Catalog',
    description: 'Clean, simple catalog shot on white background',
    category: 'ecommerce',
    gender: 'women',
    jewelryType: 'ring',
    selections: {
      'race-ethnicity': 'race-asian',
      'skin-tone': 'skin-light',
      'hand-selection': 'hand-left',
      'finger-selection': 'finger-ring',
      'hand-pose': 'hand-relaxed',
      'hand-structure': 'hand-petite',
      'nail-type': 'nail-oval',
      'nail-color': 'nail-nude',
      'upper-clothing': 'upper-plain',
      'upper-color': 'upper-white',
      'location-background': 'loc-studio-white',
      'lighting': 'light-studio-key-fill',
      'jewelry-framing': 'frame-detail',
      'viewing-angle': 'angle-eye-level',
      'focus-depth': 'focus-sharp-jewelry',
      'composition-rules': 'comp-centered',
      'post-processing-level': 'proc-catalog',
      'color-grading': 'grade-natural',
      'presentation-intent': 'intent-catalog',
      'mood-atmosphere': 'mood-minimalist',
      'jewelry-context': 'context-hero',
    },
    tags: ['minimalist', 'catalog', 'clean', 'white'],
  },
  
  {
    id: 'women-ring-extreme-closeup',
    name: 'Extreme Detail Close-Up',
    description: 'Ultra-close macro shot showing ring details',
    category: 'closeup',
    gender: 'women',
    jewelryType: 'ring',
    selections: {
      'skin-tone': 'skin-medium',
      'hand-selection': 'hand-right',
      'finger-selection': 'finger-ring',
      'hand-pose': 'hand-relaxed',
      'hand-structure': 'hand-smooth',
      'nail-type': 'nail-french',
      'nail-color': 'nail-pink-baby',
      'location-background': 'loc-abstract-bokeh',
      'lighting': 'light-studio-ring',
      'jewelry-framing': 'frame-extreme-closeup',
      'viewing-angle': 'angle-eye-level',
      'focus-depth': 'focus-sharp-jewelry',
      'composition-rules': 'comp-centered',
      'post-processing-level': 'proc-professional',
      'color-grading': 'grade-natural',
      'presentation-intent': 'intent-catalog',
      'jewelry-context': 'context-detail',
    },
    tags: ['closeup', 'macro', 'detail', 'jewelry-focused'],
  },
];

// ============================================
// EXPORT ALL PRESETS BY TYPE
// ============================================

export const QUICK_PRESETS_BY_TYPE = {
  women: {
    ring: WOMEN_RING_PRESETS,
    necklace: [], // TODO
    earring: [], // TODO
    bracelet: [], // TODO
  },
  men: {
    ring: [], // TODO
    necklace: [], // TODO
    earring: [], // TODO
    bracelet: [], // TODO
  },
};

export function getQuickPresets(gender: Gender, jewelryType: JewelryType): QuickPreset[] {
  return QUICK_PRESETS_BY_TYPE[gender]?.[jewelryType] || [];
}

