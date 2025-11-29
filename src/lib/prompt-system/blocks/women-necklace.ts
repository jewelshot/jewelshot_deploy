/**
 * Women + Necklace Micro Blocks
 * 
 * Necklace-specific blocks focusing on neck/chest area
 */

import { BlockCategory, MicroBlock } from '../types';

// ============================================
// CATEGORIES
// ============================================

export const WOMEN_NECKLACE_CATEGORIES: BlockCategory[] = [
  {
    id: 'neck-pose',
    name: 'Neck Pose',
    icon: '👤',
    description: 'Neck and head positioning',
    order: 1,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: true,
  },
  
  {
    id: 'neckline-style',
    name: 'Neckline',
    icon: '👗',
    description: 'Clothing neckline style',
    order: 2,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: true,
  },
  
  {
    id: 'hair-style',
    name: 'Hair Style',
    icon: '💇',
    description: 'Hair arrangement around neck',
    order: 3,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: false,
  },
];

// ============================================
// BLOCKS
// ============================================

export const WOMEN_NECKLACE_BLOCKS: MicroBlock[] = [
  // ========== NECK POSE ==========
  {
    id: 'neck-straight-forward',
    name: 'Straight Forward',
    description: 'Head facing forward, neck straight',
    categoryId: 'neck-pose',
    icon: '⬆️',
    promptFragment: 'neck straight forward, head centered, elegant posture, necklace fully visible',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['straight', 'centered', 'elegant', 'frontal'],
    level: 'advanced',
  },
  
  {
    id: 'neck-slight-turn',
    name: 'Slight Turn',
    description: 'Head turned slightly to side',
    categoryId: 'neck-pose',
    icon: '↗️',
    promptFragment: 'head slight turn, neck gracefully angled, elegant profile, necklace chain visible',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['turn', 'angled', 'graceful', 'profile'],
    level: 'advanced',
  },
  
  {
    id: 'neck-chin-up',
    name: 'Chin Up',
    description: 'Chin lifted, neck elongated',
    categoryId: 'neck-pose',
    icon: '⬆️',
    promptFragment: 'chin lifted upward, neck elongated graceful, necklace draped beautifully, elegant swan-like posture',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['chin-up', 'elongated', 'graceful', 'elegant'],
    level: 'advanced',
  },
  
  // ========== NECKLINE ==========
  {
    id: 'neckline-v-neck',
    name: 'V-Neck',
    description: 'Deep V-neck, decollete visible',
    categoryId: 'neckline-style',
    icon: '📐',
    promptFragment: 'deep V-neck neckline, decollete visible, necklace centered on chest, elegant drape',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['v-neck', 'deep', 'decollete', 'elegant'],
    level: 'advanced',
  },
  
  {
    id: 'neckline-scoop',
    name: 'Scoop Neck',
    description: 'Rounded scoop neckline',
    categoryId: 'neckline-style',
    icon: '⚪',
    promptFragment: 'scoop neck rounded neckline, collarbone visible, necklace resting naturally, soft feminine style',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['scoop', 'rounded', 'collarbone', 'feminine'],
    level: 'advanced',
  },
  
  {
    id: 'neckline-off-shoulder',
    name: 'Off Shoulder',
    description: 'Shoulders exposed, elegant drape',
    categoryId: 'neckline-style',
    icon: '👗',
    promptFragment: 'off-shoulder neckline, shoulders elegantly exposed, necklace sits on bare skin, romantic elegant',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['off-shoulder', 'exposed', 'elegant', 'romantic'],
    level: 'advanced',
  },
  
  // ========== HAIR STYLE ==========
  {
    id: 'hair-updo',
    name: 'Updo',
    description: 'Hair pulled up, neck exposed',
    categoryId: 'hair-style',
    icon: '💁',
    promptFragment: 'hair styled updo, neck fully exposed, necklace unobstructed view, elegant bun or twist',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['updo', 'exposed', 'elegant', 'bun'],
    level: 'advanced',
  },
  
  {
    id: 'hair-side-swept',
    name: 'Side Swept',
    description: 'Hair swept to one side',
    categoryId: 'hair-style',
    icon: '💇',
    promptFragment: 'hair side-swept over shoulder, neck partially visible, necklace focal point, romantic asymmetric',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['side-swept', 'asymmetric', 'romantic', 'shoulder'],
    level: 'advanced',
  },
  
  {
    id: 'hair-behind-shoulders',
    name: 'Behind Shoulders',
    description: 'Hair pulled behind both shoulders',
    categoryId: 'hair-style',
    icon: '🙋',
    promptFragment: 'hair pulled behind shoulders, neck and chest clear, necklace fully visible, clean elegant presentation',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    tags: ['behind', 'clear', 'visible', 'clean'],
    level: 'advanced',
  },
];

