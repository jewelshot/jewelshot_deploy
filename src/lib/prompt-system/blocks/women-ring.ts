/**
 * Women + Ring Micro Blocks
 * 
 * Experimental block definitions for testing
 * Start small: 5-6 blocks across 2-3 categories
 */

import { BlockCategory, MicroBlock } from '../types';

// ============================================
// CATEGORIES
// ============================================

export const WOMEN_RING_CATEGORIES: BlockCategory[] = [
  {
    id: 'hand-pose',
    name: 'Hand Pose',
    icon: '✋',
    description: 'How the hand is positioned',
    order: 1,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    required: true,
  },
  
  {
    id: 'nail-type',
    name: 'Nail Style',
    icon: '💅',
    description: 'Nail shape and manicure style',
    order: 2,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'nail-color',
    name: 'Nail Color',
    icon: '🎨',
    description: 'Nail polish color',
    order: 3,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    required: false,
  },
];

// ============================================
// BLOCKS
// ============================================

export const WOMEN_RING_BLOCKS: MicroBlock[] = [
  // ========== HAND POSE ==========
  {
    id: 'hand-elegant-extended',
    name: 'Elegant Extended',
    description: 'Hand gracefully extended with fingers spread',
    categoryId: 'hand-pose',
    icon: '✋',
    promptFragment: 'hand elegantly extended, fingers gracefully spread, natural feminine gesture, relaxed positioning',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['elegant', 'graceful', 'feminine', 'extended'],
    level: 'advanced',
  },
  
  {
    id: 'hand-relaxed-natural',
    name: 'Relaxed Natural',
    description: 'Hand in natural resting position',
    categoryId: 'hand-pose',
    icon: '🤚',
    promptFragment: 'hand relaxed natural position, fingers gently curved, soft comfortable gesture, effortless pose',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['natural', 'relaxed', 'comfortable', 'soft'],
    level: 'advanced',
  },
  
  {
    id: 'hand-holding-object',
    name: 'Holding Object',
    description: 'Hand holding an object (cup, phone, etc.)',
    categoryId: 'hand-pose',
    icon: '☕',
    promptFragment: 'hand holding object naturally, casual everyday gesture, lifestyle context, authentic moment',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['lifestyle', 'casual', 'natural', 'holding'],
    level: 'advanced',
  },
  
  // ========== NAIL TYPE ==========
  {
    id: 'nail-french-manicure',
    name: 'French Manicure',
    description: 'Classic white tips with natural base',
    categoryId: 'nail-type',
    icon: '💅',
    promptFragment: 'French manicure, white tips, natural nail bed, elegant professional finish, classic style',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['french', 'classic', 'professional', 'elegant'],
    level: 'advanced',
  },
  
  {
    id: 'nail-natural-short',
    name: 'Natural Short',
    description: 'Short natural nails, clean look',
    categoryId: 'nail-type',
    icon: '✨',
    promptFragment: 'short natural nails, clean manicured appearance, minimal polish, professional grooming',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['natural', 'short', 'minimal', 'clean'],
    level: 'advanced',
  },
  
  {
    id: 'nail-long-almond',
    name: 'Long Almond',
    description: 'Long almond-shaped nails',
    categoryId: 'nail-type',
    icon: '💎',
    promptFragment: 'long almond-shaped nails, sculpted elegant style, sophisticated manicure, refined appearance',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['long', 'almond', 'elegant', 'sophisticated'],
    level: 'advanced',
  },
  
  // ========== NAIL COLOR ==========
  {
    id: 'nail-color-nude',
    name: 'Nude',
    description: 'Natural nude/beige tones',
    categoryId: 'nail-color',
    icon: '🤎',
    promptFragment: 'nude neutral nail polish, natural beige tone, subtle elegant finish',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['nude', 'neutral', 'natural', 'subtle'],
    level: 'advanced',
  },
  
  {
    id: 'nail-color-red',
    name: 'Classic Red',
    description: 'Bold classic red polish',
    categoryId: 'nail-color',
    icon: '🔴',
    promptFragment: 'classic red nail polish, glossy rich finish, bold confident color',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['red', 'bold', 'classic', 'vibrant'],
    level: 'advanced',
  },
  
  {
    id: 'nail-color-pink',
    name: 'Soft Pink',
    description: 'Soft pink feminine polish',
    categoryId: 'nail-color',
    icon: '🌸',
    promptFragment: 'soft pink nail polish, feminine delicate tone, gentle romantic finish',
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['pink', 'soft', 'feminine', 'romantic'],
    level: 'advanced',
  },
];

