/**
 * Women - ALL Blocks
 * 
 * Complete set of all women-specific body feature blocks
 * Organized by: Universal → Ring → Necklace → Earring → Bracelet
 */

import { BlockCategory, MicroBlock, JewelryType } from '../types';

// ============================================
// UNIVERSAL CATEGORIES (All jewelry types)
// ============================================

export const WOMEN_UNIVERSAL_CATEGORIES: BlockCategory[] = [
  {
    id: 'skin-tone',
    name: 'Skin Tone',
    icon: '🤎',
    description: 'Skin complexion',
    order: 1,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'nail-type',
    name: 'Nail Type',
    icon: '💅',
    description: 'Nail shape and style',
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
  
  {
    id: 'makeup',
    name: 'Makeup',
    icon: '💄',
    description: 'Makeup style',
    order: 4,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace', 'earring'],
    },
    required: false,
  },
  
  {
    id: 'expression',
    name: 'Expression',
    icon: '😊',
    description: 'Facial expression',
    order: 5,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace', 'earring'],
    },
    required: false,
  },
  
  {
    id: 'hair-style',
    name: 'Hair Style',
    icon: '💇',
    description: 'Hairstyle and arrangement',
    order: 6,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'], // Universal for all
    },
    required: false,
  },
  
  {
    id: 'hair-color',
    name: 'Hair Color',
    icon: '🎨',
    description: 'Hair color tone',
    order: 7,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'], // Universal for all
    },
    required: false,
  },
];

// ============================================
// RING CATEGORIES
// ============================================

export const WOMEN_RING_CATEGORIES: BlockCategory[] = [
  {
    id: 'hand-pose',
    name: 'Hand Pose',
    icon: '✋',
    description: 'Hand positioning',
    order: 10,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring'],
    },
    required: true,
  },
  
  {
    id: 'hand-structure',
    name: 'Hand Structure',
    icon: '🖐️',
    description: 'Hand physical features',
    order: 11,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring'],
    },
    required: false,
  },
];

// ============================================
// NECKLACE CATEGORIES
// ============================================

export const WOMEN_NECKLACE_CATEGORIES: BlockCategory[] = [
  {
    id: 'neck-pose',
    name: 'Neck/Head Pose',
    icon: '👤',
    description: 'Neck and head positioning',
    order: 20,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: true,
  },
];

// ============================================
// BLOCKS - UNIVERSAL
// ============================================

const SKIN_TONE_BLOCKS: MicroBlock[] = [
  {
    id: 'skin-fair',
    name: 'Fair',
    categoryId: 'skin-tone',
    icon: '🤍',
    promptFragment: 'fair light skin tone, porcelain complexion',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] },
    tags: ['fair', 'light', 'pale'],
    level: 'advanced',
  },
  {
    id: 'skin-light',
    name: 'Light',
    categoryId: 'skin-tone',
    icon: '🤎',
    promptFragment: 'light skin tone, fair complexion',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] },
    tags: ['light', 'fair'],
    level: 'advanced',
  },
  {
    id: 'skin-medium',
    name: 'Medium',
    categoryId: 'skin-tone',
    icon: '🤎',
    promptFragment: 'medium skin tone, warm natural complexion',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] },
    tags: ['medium', 'warm'],
    level: 'advanced',
  },
  {
    id: 'skin-olive',
    name: 'Olive',
    categoryId: 'skin-tone',
    icon: '🫒',
    promptFragment: 'olive skin tone, Mediterranean complexion',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] },
    tags: ['olive', 'mediterranean'],
    level: 'advanced',
  },
  {
    id: 'skin-tan',
    name: 'Tan',
    categoryId: 'skin-tone',
    icon: '🤎',
    promptFragment: 'tan skin tone, sun-kissed complexion',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] },
    tags: ['tan', 'bronze'],
    level: 'advanced',
  },
  {
    id: 'skin-deep',
    name: 'Deep',
    categoryId: 'skin-tone',
    icon: '🤎',
    promptFragment: 'deep rich skin tone, dark complexion',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] },
    tags: ['deep', 'dark', 'rich'],
    level: 'advanced',
  },
];

const NAIL_TYPE_BLOCKS: MicroBlock[] = [
  {
    id: 'nail-french',
    name: 'French Manicure',
    categoryId: 'nail-type',
    icon: '💅',
    promptFragment: 'French manicure, white tips, natural base, classic elegant',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] },
    tags: ['french', 'classic'],
    level: 'advanced',
  },
  {
    id: 'nail-natural-short',
    name: 'Natural Short',
    categoryId: 'nail-type',
    icon: '✨',
    promptFragment: 'natural short nails, clean minimal manicure',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] },
    tags: ['natural', 'short', 'minimal'],
    level: 'advanced',
  },
  {
    id: 'nail-almond',
    name: 'Long Almond',
    categoryId: 'nail-type',
    icon: '💎',
    promptFragment: 'long almond-shaped nails, sculpted elegant',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] },
    tags: ['almond', 'long', 'elegant'],
    level: 'advanced',
  },
  {
    id: 'nail-stiletto',
    name: 'Long Stiletto',
    categoryId: 'nail-type',
    icon: '💅',
    promptFragment: 'long stiletto pointed nails, dramatic bold',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] },
    tags: ['stiletto', 'long', 'dramatic'],
    level: 'advanced',
  },
  {
    id: 'nail-coffin',
    name: 'Coffin',
    categoryId: 'nail-type',
    icon: '⚰️',
    promptFragment: 'coffin ballerina shaped nails, modern trendy',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] },
    tags: ['coffin', 'ballerina', 'trendy'],
    level: 'advanced',
  },
  {
    id: 'nail-square',
    name: 'Square',
    categoryId: 'nail-type',
    icon: '⬜',
    promptFragment: 'square-shaped nails, clean geometric',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] },
    tags: ['square', 'geometric'],
    level: 'advanced',
  },
  {
    id: 'nail-round',
    name: 'Round',
    categoryId: 'nail-type',
    icon: '⚪',
    promptFragment: 'round-shaped nails, soft classic',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] },
    tags: ['round', 'classic'],
    level: 'advanced',
  },
  {
    id: 'nail-oval',
    name: 'Oval',
    categoryId: 'nail-type',
    icon: '🥚',
    promptFragment: 'oval-shaped nails, elegant feminine',
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] },
    tags: ['oval', 'elegant'],
    level: 'advanced',
  },
];

const NAIL_COLOR_BLOCKS: MicroBlock[] = [
  { id: 'nail-nude', name: 'Nude', categoryId: 'nail-color', icon: '🤎', promptFragment: 'nude neutral nail polish', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['nude', 'neutral'], level: 'advanced' },
  { id: 'nail-red', name: 'Classic Red', categoryId: 'nail-color', icon: '🔴', promptFragment: 'classic red nail polish, glossy bold', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['red', 'bold'], level: 'advanced' },
  { id: 'nail-burgundy', name: 'Burgundy', categoryId: 'nail-color', icon: '🍷', promptFragment: 'deep burgundy nail polish, rich elegant', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['burgundy', 'deep'], level: 'advanced' },
  { id: 'nail-pink-soft', name: 'Soft Pink', categoryId: 'nail-color', icon: '🌸', promptFragment: 'soft pink nail polish, feminine gentle', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['pink', 'soft'], level: 'advanced' },
  { id: 'nail-pink-baby', name: 'Baby Pink', categoryId: 'nail-color', icon: '💗', promptFragment: 'baby pink nail polish, delicate sweet', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['pink', 'baby'], level: 'advanced' },
  { id: 'nail-coral', name: 'Coral', categoryId: 'nail-color', icon: '🪸', promptFragment: 'coral nail polish, warm vibrant', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['coral', 'warm'], level: 'advanced' },
  { id: 'nail-plum', name: 'Plum', categoryId: 'nail-color', icon: '🟣', promptFragment: 'plum purple nail polish, sophisticated', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['plum', 'purple'], level: 'advanced' },
  { id: 'nail-white', name: 'White', categoryId: 'nail-color', icon: '⚪', promptFragment: 'white nail polish, clean fresh', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['white', 'clean'], level: 'advanced' },
  { id: 'nail-black', name: 'Black', categoryId: 'nail-color', icon: '⚫', promptFragment: 'black nail polish, bold edgy', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['black', 'bold'], level: 'advanced' },
  { id: 'nail-gold', name: 'Gold', categoryId: 'nail-color', icon: '🥇', promptFragment: 'metallic gold nail polish, luxurious', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['gold', 'metallic'], level: 'advanced' },
  { id: 'nail-silver', name: 'Silver', categoryId: 'nail-color', icon: '🥈', promptFragment: 'metallic silver nail polish, modern sleek', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'bracelet'] }, tags: ['silver', 'metallic'], level: 'advanced' },
];

const MAKEUP_BLOCKS: MicroBlock[] = [
  { id: 'makeup-natural', name: 'Natural Minimal', categoryId: 'makeup', icon: '✨', promptFragment: 'natural minimal makeup, fresh clean appearance', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['natural', 'minimal'], level: 'advanced' },
  { id: 'makeup-bold-lips', name: 'Bold Red Lips', categoryId: 'makeup', icon: '💋', promptFragment: 'bold red lipstick, defined lips, confident', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['bold', 'red', 'lips'], level: 'advanced' },
  { id: 'makeup-nude-lips', name: 'Nude Lips', categoryId: 'makeup', icon: '👄', promptFragment: 'nude natural lips, subtle neutral tone', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['nude', 'natural'], level: 'advanced' },
  { id: 'makeup-smokey', name: 'Smokey Eyes', categoryId: 'makeup', icon: '👁️', promptFragment: 'smokey eye makeup, dramatic elegant eyes', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['smokey', 'dramatic'], level: 'advanced' },
  { id: 'makeup-brows', name: 'Defined Brows', categoryId: 'makeup', icon: '🦋', promptFragment: 'well-defined eyebrows, groomed shaped', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['brows', 'defined'], level: 'advanced' },
  { id: 'makeup-dewy', name: 'Fresh Dewy', categoryId: 'makeup', icon: '💧', promptFragment: 'fresh dewy makeup, glowing skin, luminous', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['dewy', 'fresh'], level: 'advanced' },
];

const EXPRESSION_BLOCKS: MicroBlock[] = [
  { id: 'expr-gentle-smile', name: 'Gentle Smile', categoryId: 'expression', icon: '😊', promptFragment: 'gentle natural smile, warm friendly expression', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['smile', 'gentle'], level: 'advanced' },
  { id: 'expr-bright-smile', name: 'Bright Smile', categoryId: 'expression', icon: '😄', promptFragment: 'bright joyful smile, happy expression', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['smile', 'bright'], level: 'advanced' },
  { id: 'expr-serene', name: 'Serene', categoryId: 'expression', icon: '😌', promptFragment: 'serene calm expression, peaceful tranquil', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['serene', 'calm'], level: 'advanced' },
  { id: 'expr-confident', name: 'Confident', categoryId: 'expression', icon: '😎', promptFragment: 'confident assured expression, strong presence', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['confident', 'strong'], level: 'advanced' },
  { id: 'expr-romantic', name: 'Romantic', categoryId: 'expression', icon: '🥰', promptFragment: 'romantic soft expression, dreamy gentle', applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, tags: ['romantic', 'soft'], level: 'advanced' },
];

// RING SPECIFIC
const HAND_POSE_BLOCKS: MicroBlock[] = [
  { id: 'hand-elegant', name: 'Elegant Extended', categoryId: 'hand-pose', icon: '✋', promptFragment: 'hand elegantly extended, fingers gracefully spread, feminine gesture', applicableTo: { gender: ['women'], jewelryTypes: ['ring'] }, tags: ['elegant', 'graceful'], level: 'advanced' },
  { id: 'hand-relaxed', name: 'Relaxed Natural', categoryId: 'hand-pose', icon: '🤚', promptFragment: 'hand relaxed natural position, soft comfortable gesture', applicableTo: { gender: ['women'], jewelryTypes: ['ring'] }, tags: ['relaxed', 'natural'], level: 'advanced' },
  { id: 'hand-spread', name: 'Fingers Spread', categoryId: 'hand-pose', icon: '🖐️', promptFragment: 'fingers spread open, hand displayed prominently', applicableTo: { gender: ['women'], jewelryTypes: ['ring'] }, tags: ['spread', 'open'], level: 'advanced' },
  { id: 'hand-touching-face', name: 'Touching Face', categoryId: 'hand-pose', icon: '🤗', promptFragment: 'hand gently touching face, intimate delicate gesture', applicableTo: { gender: ['women'], jewelryTypes: ['ring'] }, tags: ['touching', 'intimate'], level: 'advanced' },
  { id: 'hand-holding-cup', name: 'Holding Cup', categoryId: 'hand-pose', icon: '☕', promptFragment: 'hand holding coffee cup, casual lifestyle moment', applicableTo: { gender: ['women'], jewelryTypes: ['ring'] }, tags: ['holding', 'lifestyle'], level: 'advanced' },
];

const HAND_STRUCTURE_BLOCKS: MicroBlock[] = [
  { id: 'hand-delicate', name: 'Delicate Slender', categoryId: 'hand-structure', icon: '🤲', promptFragment: 'delicate slender hands, feminine elegant structure', applicableTo: { gender: ['women'], jewelryTypes: ['ring'] }, tags: ['delicate', 'slender'], level: 'advanced' },
  { id: 'hand-smooth', name: 'Smooth Skin', categoryId: 'hand-structure', icon: '✨', promptFragment: 'smooth soft skin, well-groomed hands', applicableTo: { gender: ['women'], jewelryTypes: ['ring'] }, tags: ['smooth', 'soft'], level: 'advanced' },
];

// NECKLACE SPECIFIC
const NECK_POSE_BLOCKS: MicroBlock[] = [
  { id: 'neck-straight', name: 'Straight Forward', categoryId: 'neck-pose', icon: '⬆️', promptFragment: 'neck straight forward, head centered, elegant posture', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['straight', 'centered'], level: 'advanced' },
  { id: 'neck-turn-left', name: 'Slight Turn Left', categoryId: 'neck-pose', icon: '↖️', promptFragment: 'head slight turn left, neck gracefully angled', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['turn', 'left'], level: 'advanced' },
  { id: 'neck-turn-right', name: 'Slight Turn Right', categoryId: 'neck-pose', icon: '↗️', promptFragment: 'head slight turn right, neck gracefully angled', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['turn', 'right'], level: 'advanced' },
  { id: 'neck-chin-up', name: 'Chin Up', categoryId: 'neck-pose', icon: '⬆️', promptFragment: 'chin lifted upward, neck elongated elegant', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['chin-up', 'elongated'], level: 'advanced' },
  { id: 'neck-chin-down', name: 'Chin Down', categoryId: 'neck-pose', icon: '⬇️', promptFragment: 'chin tilted down, intimate gentle angle', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['chin-down', 'intimate'], level: 'advanced' },
];

const HAIR_STYLE_BLOCKS: MicroBlock[] = [
  { id: 'hair-updo-bun', name: 'Updo Bun', categoryId: 'hair-style', icon: '💁', promptFragment: 'elegant updo bun', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['updo', 'bun'], level: 'advanced' },
  { id: 'hair-side-swept', name: 'Side Swept', categoryId: 'hair-style', icon: '💇', promptFragment: 'side-swept hair', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['side-swept', 'romantic'], level: 'advanced' },
  { id: 'hair-behind', name: 'Behind Shoulders', categoryId: 'hair-style', icon: '🙋', promptFragment: 'hair behind shoulders', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['behind', 'clear'], level: 'advanced' },
  { id: 'hair-long-straight', name: 'Long Straight', categoryId: 'hair-style', icon: '💆', promptFragment: 'long straight hair', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['long', 'straight'], level: 'advanced' },
  { id: 'hair-long-wavy', name: 'Long Wavy', categoryId: 'hair-style', icon: '🌊', promptFragment: 'long wavy hair', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['long', 'wavy'], level: 'advanced' },
];

const HAIR_COLOR_BLOCKS: MicroBlock[] = [
  { id: 'hair-black', name: 'Black', categoryId: 'hair-color', icon: '⬛', promptFragment: 'black hair', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['black', 'dark'], level: 'advanced' },
  { id: 'hair-brown', name: 'Brown', categoryId: 'hair-color', icon: '🟤', promptFragment: 'brown hair', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown', 'warm'], level: 'advanced' },
  { id: 'hair-blonde', name: 'Blonde', categoryId: 'hair-color', icon: '🟡', promptFragment: 'blonde hair', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['blonde', 'light'], level: 'advanced' },
  { id: 'hair-auburn', name: 'Red Auburn', categoryId: 'hair-color', icon: '🟠', promptFragment: 'auburn hair', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['red', 'auburn'], level: 'advanced' },
];

// ============================================
// EARRING CATEGORIES
// ============================================

export const WOMEN_EARRING_CATEGORIES: BlockCategory[] = [
  {
    id: 'head-position',
    name: 'Head Position',
    icon: '👤',
    description: 'Head angle for ear visibility',
    order: 30,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['earring'],
    },
    required: true,
  },
  
  {
    id: 'hair-position',
    name: 'Hair Position',
    icon: '💇',
    description: 'Hair arrangement around ears',
    order: 31,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['earring'],
    },
    required: false,
  },
];

// ============================================
// BRACELET CATEGORIES
// ============================================

export const WOMEN_BRACELET_CATEGORIES: BlockCategory[] = [
  {
    id: 'wrist-pose',
    name: 'Wrist/Arm Pose',
    icon: '🤚',
    description: 'Wrist and arm positioning',
    order: 40,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['bracelet'],
    },
    required: true,
  },
  
  {
    id: 'arm-position',
    name: 'Arm Position',
    icon: '💪',
    description: 'Arm angle and orientation',
    order: 41,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['bracelet'],
    },
    required: false,
  },
];

// ============================================
// ALL CATEGORIES COMBINED
// ============================================

export const WOMEN_ALL_CATEGORIES = [
  ...WOMEN_UNIVERSAL_CATEGORIES,
  ...WOMEN_RING_CATEGORIES,
  ...WOMEN_NECKLACE_CATEGORIES,
  ...WOMEN_EARRING_CATEGORIES,
  ...WOMEN_BRACELET_CATEGORIES,
];

// ============================================
// EARRING BLOCKS
// ============================================

const HEAD_POSITION_BLOCKS: MicroBlock[] = [
  { id: 'head-straight', name: 'Straight Forward', categoryId: 'head-position', icon: '⬆️', promptFragment: 'head straight forward, both ears visible', applicableTo: { gender: ['women'], jewelryTypes: ['earring'] }, tags: ['straight', 'forward'], level: 'advanced' },
  { id: 'head-profile-left', name: 'Profile Left', categoryId: 'head-position', icon: '⬅️', promptFragment: 'head profile left side, single ear prominently visible', applicableTo: { gender: ['women'], jewelryTypes: ['earring'] }, tags: ['profile', 'left'], level: 'advanced' },
  { id: 'head-profile-right', name: 'Profile Right', categoryId: 'head-position', icon: '➡️', promptFragment: 'head profile right side, single ear prominently visible', applicableTo: { gender: ['women'], jewelryTypes: ['earring'] }, tags: ['profile', 'right'], level: 'advanced' },
  { id: 'head-three-quarter', name: 'Three-Quarter', categoryId: 'head-position', icon: '↗️', promptFragment: 'three-quarter view, elegant angle showing ear', applicableTo: { gender: ['women'], jewelryTypes: ['earring'] }, tags: ['three-quarter', 'angle'], level: 'advanced' },
];

const HAIR_POSITION_BLOCKS: MicroBlock[] = [
  { id: 'hair-tucked', name: 'Tucked Behind Ear', categoryId: 'hair-position', icon: '👂', promptFragment: 'hair tucked behind ear, earring fully visible', applicableTo: { gender: ['women'], jewelryTypes: ['earring'] }, tags: ['tucked', 'visible'], level: 'advanced' },
  { id: 'hair-pulled-back', name: 'Pulled Back', categoryId: 'hair-position', icon: '💆', promptFragment: 'hair pulled back fully, ears exposed clean', applicableTo: { gender: ['women'], jewelryTypes: ['earring'] }, tags: ['pulled-back', 'exposed'], level: 'advanced' },
  { id: 'hair-updo-ears', name: 'Updo (Ears Exposed)', categoryId: 'hair-position', icon: '💁', promptFragment: 'hair in elegant updo, ears completely visible', applicableTo: { gender: ['women'], jewelryTypes: ['earring'] }, tags: ['updo', 'exposed'], level: 'advanced' },
];

// ============================================
// BRACELET BLOCKS
// ============================================

const WRIST_POSE_BLOCKS: MicroBlock[] = [
  { id: 'wrist-extended', name: 'Extended Forward', categoryId: 'wrist-pose', icon: '👉', promptFragment: 'wrist extended forward, arm outstretched, bracelet displayed', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['extended', 'forward'], level: 'advanced' },
  { id: 'wrist-relaxed', name: 'Relaxed Down', categoryId: 'wrist-pose', icon: '🤚', promptFragment: 'wrist relaxed down, arm hanging naturally', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['relaxed', 'down'], level: 'advanced' },
  { id: 'wrist-hand-up', name: 'Hand Up', categoryId: 'wrist-pose', icon: '🙋', promptFragment: 'hand raised up, wrist elevated, graceful gesture', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['up', 'raised'], level: 'advanced' },
];

const ARM_POSITION_BLOCKS: MicroBlock[] = [
  { id: 'arm-vertical', name: 'Vertical Down', categoryId: 'arm-position', icon: '⬇️', promptFragment: 'arm vertical down, natural hanging position', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['vertical', 'down'], level: 'advanced' },
  { id: 'arm-horizontal', name: 'Horizontal', categoryId: 'arm-position', icon: '↔️', promptFragment: 'arm horizontal across, elegant extended', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['horizontal', 'across'], level: 'advanced' },
  { id: 'arm-diagonal', name: 'Diagonal', categoryId: 'arm-position', icon: '↗️', promptFragment: 'arm diagonal angle, dynamic positioning', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['diagonal', 'dynamic'], level: 'advanced' },
];

export const WOMEN_ALL_BLOCKS: MicroBlock[] = [
  ...SKIN_TONE_BLOCKS,
  ...NAIL_TYPE_BLOCKS,
  ...NAIL_COLOR_BLOCKS,
  ...MAKEUP_BLOCKS,
  ...EXPRESSION_BLOCKS,
  ...HAND_POSE_BLOCKS,
  ...HAND_STRUCTURE_BLOCKS,
  ...NECK_POSE_BLOCKS,
  ...HAIR_STYLE_BLOCKS,
  ...HAIR_COLOR_BLOCKS,
  ...HEAD_POSITION_BLOCKS,
  ...HAIR_POSITION_BLOCKS,
  ...WRIST_POSE_BLOCKS,
  ...ARM_POSITION_BLOCKS,
];

/**
 * Get block count by jewelry type
 */
export function getWomenBlockCount(jewelryType: JewelryType): number {
  return WOMEN_ALL_BLOCKS.filter(b => 
    b.applicableTo.jewelryTypes.includes(jewelryType)
  ).length;
}

/**
 * Get category count by jewelry type
 */
export function getWomenCategoryCount(jewelryType: JewelryType): number {
  return WOMEN_ALL_CATEGORIES.filter(c =>
    c.applicableTo.jewelryTypes.includes(jewelryType)
  ).length;
}


