/**
 * Men + Ring Micro Blocks
 * 
 * Masculine-specific blocks for ring photography
 */

import { BlockCategory, MicroBlock } from '../types';

// ============================================
// CATEGORIES
// ============================================

export const MEN_RING_CATEGORIES: BlockCategory[] = [
  {
    id: 'hand-pose',
    name: 'Hand Pose',
    icon: '✋',
    description: 'Masculine hand positioning',
    order: 1,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    required: true,
  },
  
  {
    id: 'hand-structure',
    name: 'Hand Structure',
    icon: '💪',
    description: 'Hand shape and build',
    order: 2,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'hand-hair',
    name: 'Hand Hair',
    icon: '🦾',
    description: 'Visible hand/arm hair',
    order: 3,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    required: false,
  },
];

// ============================================
// BLOCKS
// ============================================

export const MEN_RING_BLOCKS: MicroBlock[] = [
  // ========== HAND POSE ==========
  {
    id: 'hand-firm-confident',
    name: 'Firm & Confident',
    description: 'Strong masculine hand position',
    categoryId: 'hand-pose',
    icon: '✊',
    promptFragment: 'hand firm confident position, strong masculine presence, powerful gesture, defined knuckles',
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['firm', 'confident', 'strong', 'masculine'],
    level: 'advanced',
  },
  
  {
    id: 'hand-relaxed-natural',
    name: 'Relaxed Natural',
    description: 'Natural resting position',
    categoryId: 'hand-pose',
    icon: '🤚',
    promptFragment: 'hand relaxed natural masculine pose, casual confident gesture, effortless positioning',
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['relaxed', 'natural', 'casual', 'confident'],
    level: 'advanced',
  },
  
  {
    id: 'hand-holding-glass',
    name: 'Holding Glass',
    description: 'Holding whiskey glass or similar',
    categoryId: 'hand-pose',
    icon: '🥃',
    promptFragment: 'hand holding whiskey glass, sophisticated masculine gesture, refined lifestyle context',
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['lifestyle', 'sophisticated', 'holding', 'glass'],
    level: 'advanced',
  },
  
  // ========== HAND STRUCTURE ==========
  {
    id: 'hand-athletic',
    name: 'Athletic',
    description: 'Strong athletic build',
    categoryId: 'hand-structure',
    icon: '💪',
    promptFragment: 'athletic hand structure, defined tendons, strong build, muscular appearance',
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['athletic', 'strong', 'muscular', 'defined'],
    level: 'advanced',
  },
  
  {
    id: 'hand-refined',
    name: 'Refined',
    description: 'Elegant refined structure',
    categoryId: 'hand-structure',
    icon: '🤵',
    promptFragment: 'refined hand structure, elegant proportions, sophisticated appearance, well-groomed',
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['refined', 'elegant', 'sophisticated', 'groomed'],
    level: 'advanced',
  },
  
  // ========== HAND HAIR ==========
  {
    id: 'hand-hair-visible',
    name: 'Visible Hair',
    description: 'Natural visible hand/arm hair',
    categoryId: 'hand-hair',
    icon: '🦾',
    promptFragment: 'visible hand arm hair, natural masculine appearance, authentic texture',
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['hair', 'natural', 'masculine', 'visible'],
    level: 'advanced',
  },
  
  {
    id: 'hand-hair-minimal',
    name: 'Minimal Hair',
    description: 'Minimal or groomed hair',
    categoryId: 'hand-hair',
    icon: '✨',
    promptFragment: 'minimal hand hair, clean groomed appearance, smooth skin texture',
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'bracelet'],
    },
    tags: ['minimal', 'groomed', 'clean', 'smooth'],
    level: 'advanced',
  },
];

