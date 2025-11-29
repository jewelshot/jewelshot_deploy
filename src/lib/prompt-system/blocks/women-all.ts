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
    id: 'clothing-type',
    name: 'Clothing Type',
    icon: '👗',
    description: 'Base clothing style (affects neckline/sleeve options)',
    order: 1,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: true, // CRITICAL - must be selected first
  },
  
  {
    id: 'skin-tone',
    name: 'Skin Tone',
    icon: '🤎',
    description: 'Skin complexion',
    order: 2,
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
    order: 3,
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
    order: 4,
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
    order: 5,
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
    order: 6,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace', 'earring'],
    },
    required: false,
  },
  
  {
    id: 'hair-length',
    name: 'Hair Length',
    icon: '📏',
    description: 'Length of hair',
    order: 7,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'hair-style',
    name: 'Hair Style',
    icon: '💇',
    description: 'Hairstyle and arrangement',
    order: 8,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'hair-texture',
    name: 'Hair Texture',
    icon: '🌊',
    description: 'Hair texture pattern',
    order: 9,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'hair-color',
    name: 'Hair Color',
    icon: '🎨',
    description: 'Hair color tone',
    order: 10,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'hair-volume',
    name: 'Hair Volume',
    icon: '✨',
    description: 'Hair thickness and volume',
    order: 11,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
];

// ============================================
// FACE DETAILS CATEGORIES (Conditional/Toggle)
// ============================================

export const WOMEN_FACE_CATEGORIES: BlockCategory[] = [
  {
    id: 'race-ethnicity',
    name: 'Race/Ethnicity',
    icon: '🌍',
    description: 'Ethnic background',
    order: 12,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true, // Hidden until toggled
    autoShowTriggers: [], // Can be populated with hand poses that show face
  },
  
  {
    id: 'face-shape',
    name: 'Face Shape',
    icon: '👤',
    description: 'Overall face structure',
    order: 13,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'eye-color',
    name: 'Eye Color',
    icon: '👁️',
    description: 'Eye color tone',
    order: 14,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'eye-type',
    name: 'Eye Type',
    icon: '👀',
    description: 'Eye shape and structure',
    order: 15,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'eyebrow-style',
    name: 'Eyebrow Style',
    icon: '✏️',
    description: 'Eyebrow shape',
    order: 16,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'eyelash',
    name: 'Eyelash',
    icon: '👁️',
    description: 'Eyelash style',
    order: 17,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'nose-type',
    name: 'Nose Type',
    icon: '👃',
    description: 'Nose shape and structure',
    order: 18,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'lip-type',
    name: 'Lip Type',
    icon: '💋',
    description: 'Lip shape and fullness',
    order: 19,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'lip-color',
    name: 'Lip Color',
    icon: '💄',
    description: 'Lipstick or natural lip color',
    order: 20,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'cheekbones',
    name: 'Cheekbones',
    icon: '✨',
    description: 'Cheekbone prominence',
    order: 21,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
  },
  
  {
    id: 'chin-type',
    name: 'Chin Type',
    icon: '🗿',
    description: 'Chin shape and structure',
    order: 22,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
    conditional: true,
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
    order: 30,
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
    order: 31,
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
    order: 40,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: true,
  },
  
  {
    id: 'neckline',
    name: 'Neckline Type',
    icon: '👗',
    description: 'Clothing neckline style',
    order: 41,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: true,
  },
  
  {
    id: 'decolletage',
    name: 'Décolletage',
    icon: '✨',
    description: 'Chest area visibility',
    order: 42,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: false,
  },
  
  {
    id: 'shoulder-position',
    name: 'Shoulder Position',
    icon: '👚',
    description: 'Shoulder coverage',
    order: 43,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: false,
  },
  
  {
    id: 'collarbone',
    name: 'Collarbone',
    icon: '💎',
    description: 'Collarbone prominence',
    order: 44,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['necklace'],
    },
    required: false,
  },
];

// ============================================
// BLOCKS - UNIVERSAL
// ============================================

// Clothing Type Blocks (with constraints)
const CLOTHING_TYPE_BLOCKS: MicroBlock[] = [
  // CASUAL - Basic tops
  { 
    id: 'clothing-tshirt-crew', 
    name: 'T-Shirt (Crew Neck)', 
    categoryId: 'clothing-type', 
    icon: '👕', 
    promptFragment: 't-shirt crew neck casual', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['casual', 't-shirt'], 
    level: 'advanced',
    conflictsWith: ['neckline-v-deep', 'neckline-off-shoulder', 'neckline-strapless', 'sleeve-sleeveless']
  },
  { 
    id: 'clothing-tshirt-v', 
    name: 'T-Shirt (V-Neck)', 
    categoryId: 'clothing-type', 
    icon: '👕', 
    promptFragment: 't-shirt v-neck casual', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['casual', 't-shirt', 'v-neck'], 
    level: 'advanced',
    conflictsWith: ['neckline-off-shoulder', 'neckline-strapless', 'neckline-sweetheart']
  },
  { 
    id: 'clothing-tank', 
    name: 'Tank Top', 
    categoryId: 'clothing-type', 
    icon: '🎽', 
    promptFragment: 'tank top sleeveless', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['casual', 'tank', 'sleeveless'], 
    level: 'advanced',
    conflictsWith: ['sleeve-short', 'sleeve-three-quarter', 'sleeve-long-rolled', 'sleeve-long-pushed']
  },
  { 
    id: 'clothing-blouse-casual', 
    name: 'Blouse (Casual)', 
    categoryId: 'clothing-type', 
    icon: '👚', 
    promptFragment: 'casual blouse', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['casual', 'blouse'], 
    level: 'advanced',
    conflictsWith: []
  },
  
  // WARM/LAYERED - Sweaters, cardigans
  { 
    id: 'clothing-sweater', 
    name: 'Sweater/Kazak', 
    categoryId: 'clothing-type', 
    icon: '🧶', 
    promptFragment: 'knit sweater', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['warm', 'sweater', 'knit'], 
    level: 'advanced',
    conflictsWith: ['neckline-off-shoulder', 'neckline-strapless', 'neckline-halter', 'sleeve-sleeveless', 'sleeve-tank', 'sleeve-short']
  },
  { 
    id: 'clothing-cardigan', 
    name: 'Cardigan/Hırka', 
    categoryId: 'clothing-type', 
    icon: '🧥', 
    promptFragment: 'cardigan open layered', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['cardigan', 'layered'], 
    level: 'advanced',
    conflictsWith: []
  },
  { 
    id: 'clothing-vest', 
    name: 'Vest/Yelek', 
    categoryId: 'clothing-type', 
    icon: '🦺', 
    promptFragment: 'sleeveless vest over shirt', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['vest', 'layered'], 
    level: 'advanced',
    conflictsWith: ['sleeve-long-rolled', 'sleeve-long-pushed']
  },
  { 
    id: 'clothing-hoodie', 
    name: 'Hoodie/Sweatshirt', 
    categoryId: 'clothing-type', 
    icon: '🎽', 
    promptFragment: 'hoodie sweatshirt casual', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['hoodie', 'sporty'], 
    level: 'advanced',
    conflictsWith: ['neckline-v-deep', 'neckline-off-shoulder', 'neckline-strapless', 'neckline-sweetheart', 'sleeve-sleeveless']
  },
  
  // FORMAL/ELEGANT - Dresses, formal tops
  { 
    id: 'clothing-blouse-formal', 
    name: 'Blouse (Formal)', 
    categoryId: 'clothing-type', 
    icon: '👔', 
    promptFragment: 'formal elegant blouse', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['formal', 'blouse', 'elegant'], 
    level: 'advanced',
    conflictsWith: []
  },
  { 
    id: 'clothing-dress-casual', 
    name: 'Dress (Casual)', 
    categoryId: 'clothing-type', 
    icon: '👗', 
    promptFragment: 'casual dress', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['dress', 'casual'], 
    level: 'advanced',
    conflictsWith: []
  },
  { 
    id: 'clothing-dress-formal', 
    name: 'Dress (Formal)', 
    categoryId: 'clothing-type', 
    icon: '👗', 
    promptFragment: 'formal elegant dress', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['dress', 'formal', 'elegant'], 
    level: 'advanced',
    conflictsWith: []
  },
  { 
    id: 'clothing-silk', 
    name: 'Silk/Satin Top', 
    categoryId: 'clothing-type', 
    icon: '✨', 
    promptFragment: 'silk satin top luxury', 
    applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, 
    tags: ['silk', 'satin', 'luxury'], 
    level: 'advanced',
    conflictsWith: []
  },
  
  // MINIMAL - Bare/minimal clothing
  { 
    id: 'clothing-bare-shoulders', 
    name: 'Bare Shoulders', 
    categoryId: 'clothing-type', 
    icon: '💫', 
    promptFragment: 'bare shoulders minimal clothing', 
    applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, 
    tags: ['bare', 'minimal'], 
    level: 'advanced',
    conflictsWith: ['neckline-round', 'neckline-boat', 'shoulder-covered']
  },
  { 
    id: 'clothing-strapless', 
    name: 'Strapless Top/Dress', 
    categoryId: 'clothing-type', 
    icon: '👗', 
    promptFragment: 'strapless top shoulders fully exposed', 
    applicableTo: { gender: ['women'], jewelryTypes: ['necklace', 'earring'] }, 
    tags: ['strapless', 'formal'], 
    level: 'advanced',
    conflictsWith: ['neckline-round', 'neckline-v-shallow', 'neckline-boat', 'shoulder-covered', 'shoulder-strap']
  },
];

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
  { id: 'neck-straight', name: 'Straight Forward', categoryId: 'neck-pose', icon: '⬆️', promptFragment: 'neck straight forward head centered', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['straight', 'centered'], level: 'advanced' },
  { id: 'neck-turn-left', name: 'Slight Turn Left', categoryId: 'neck-pose', icon: '↖️', promptFragment: 'head slight turn left neck angled', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['turn', 'left'], level: 'advanced' },
  { id: 'neck-turn-right', name: 'Slight Turn Right', categoryId: 'neck-pose', icon: '↗️', promptFragment: 'head slight turn right neck angled', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['turn', 'right'], level: 'advanced' },
  { id: 'neck-chin-up', name: 'Chin Up', categoryId: 'neck-pose', icon: '⬆️', promptFragment: 'chin lifted upward neck elongated', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['chin-up', 'elongated'], level: 'advanced' },
  { id: 'neck-chin-down', name: 'Chin Down', categoryId: 'neck-pose', icon: '⬇️', promptFragment: 'chin tilted down gentle angle', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['chin-down', 'intimate'], level: 'advanced' },
];

// ============================================
// NECKLACE STYLING BLOCKS
// ============================================

// Neckline Type Blocks
const NECKLINE_BLOCKS: MicroBlock[] = [
  { id: 'neckline-v-shallow', name: 'V-Neck (Shallow)', categoryId: 'neckline', icon: 'Ⓥ', promptFragment: 'shallow v-neck modest', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['v-neck', 'shallow'], level: 'advanced' },
  { id: 'neckline-v-deep', name: 'V-Neck (Deep)', categoryId: 'neckline', icon: 'Ⓥ', promptFragment: 'deep v-neck plunging', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['v-neck', 'deep'], level: 'advanced' },
  { id: 'neckline-round', name: 'Round/Crew', categoryId: 'neckline', icon: '⭕', promptFragment: 'round crew neckline classic', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['round', 'crew'], level: 'advanced' },
  { id: 'neckline-scoop', name: 'Scoop Neck', categoryId: 'neckline', icon: '🌙', promptFragment: 'scoop neckline curved', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['scoop', 'curved'], level: 'advanced' },
  { id: 'neckline-off-shoulder', name: 'Off-Shoulder', categoryId: 'neckline', icon: '👚', promptFragment: 'off-shoulder neckline bare shoulders', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['off-shoulder', 'bare'], level: 'advanced' },
  { id: 'neckline-strapless', name: 'Strapless', categoryId: 'neckline', icon: '👗', promptFragment: 'strapless neckline shoulders exposed', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['strapless', 'exposed'], level: 'advanced' },
  { id: 'neckline-boat', name: 'Boat Neck', categoryId: 'neckline', icon: '⛵', promptFragment: 'boat neck wide horizontal', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['boat', 'wide'], level: 'advanced' },
  { id: 'neckline-sweetheart', name: 'Sweetheart', categoryId: 'neckline', icon: '💕', promptFragment: 'sweetheart neckline heart shaped', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['sweetheart', 'heart'], level: 'advanced' },
  { id: 'neckline-halter', name: 'Halter', categoryId: 'neckline', icon: '🎀', promptFragment: 'halter neckline neck tie', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['halter', 'tie'], level: 'advanced' },
  { id: 'neckline-square', name: 'Square Neck', categoryId: 'neckline', icon: '⬜', promptFragment: 'square neckline structured', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['square', 'structured'], level: 'advanced' },
];

// Décolletage Visibility Blocks
const DECOLLETAGE_BLOCKS: MicroBlock[] = [
  { id: 'decol-visible', name: 'Fully Visible', categoryId: 'decolletage', icon: '✨', promptFragment: 'décolletage fully visible prominent', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['visible', 'prominent'], level: 'advanced' },
  { id: 'decol-partial', name: 'Partially Visible', categoryId: 'decolletage', icon: '◐', promptFragment: 'décolletage partially visible subtle', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['partial', 'subtle'], level: 'advanced' },
  { id: 'decol-covered', name: 'Covered', categoryId: 'decolletage', icon: '⬛', promptFragment: 'décolletage covered modest', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['covered', 'modest'], level: 'advanced' },
];

// Shoulder Position Blocks
const SHOULDER_POSITION_BLOCKS: MicroBlock[] = [
  { id: 'shoulder-both', name: 'Both Visible', categoryId: 'shoulder-position', icon: '👚', promptFragment: 'both shoulders visible exposed', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['both', 'visible'], level: 'advanced' },
  { id: 'shoulder-one', name: 'One Shoulder', categoryId: 'shoulder-position', icon: '💃', promptFragment: 'one shoulder exposed asymmetric', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['one', 'asymmetric'], level: 'advanced' },
  { id: 'shoulder-covered', name: 'Covered', categoryId: 'shoulder-position', icon: '👔', promptFragment: 'shoulders covered modest', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['covered', 'modest'], level: 'advanced' },
  { id: 'shoulder-strap', name: 'Thin Straps', categoryId: 'shoulder-position', icon: '🎀', promptFragment: 'thin shoulder straps delicate', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['straps', 'delicate'], level: 'advanced' },
];

// Collarbone Prominence Blocks
const COLLARBONE_BLOCKS: MicroBlock[] = [
  { id: 'collarbone-prominent', name: 'Prominent', categoryId: 'collarbone', icon: '💎', promptFragment: 'prominent defined collarbone', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['prominent', 'defined'], level: 'advanced' },
  { id: 'collarbone-subtle', name: 'Subtle', categoryId: 'collarbone', icon: '✨', promptFragment: 'subtle collarbone soft', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['subtle', 'soft'], level: 'advanced' },
  { id: 'collarbone-hidden', name: 'Hidden', categoryId: 'collarbone', icon: '⬛', promptFragment: 'collarbone hidden covered', applicableTo: { gender: ['women'], jewelryTypes: ['necklace'] }, tags: ['hidden', 'covered'], level: 'advanced' },
];

// Hair Length Blocks
const HAIR_LENGTH_BLOCKS: MicroBlock[] = [
  { id: 'hair-length-pixie', name: 'Pixie/Very Short', categoryId: 'hair-length', icon: '✂️', promptFragment: 'pixie cut very short', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['short', 'pixie'], level: 'advanced' },
  { id: 'hair-length-short', name: 'Short (Chin)', categoryId: 'hair-length', icon: '📏', promptFragment: 'chin length', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['short', 'bob'], level: 'advanced' },
  { id: 'hair-length-shoulder', name: 'Shoulder Length', categoryId: 'hair-length', icon: '📐', promptFragment: 'shoulder length', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['medium', 'shoulder'], level: 'advanced' },
  { id: 'hair-length-mid-back', name: 'Mid-Back', categoryId: 'hair-length', icon: '📏', promptFragment: 'mid-back length', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['long', 'mid-back'], level: 'advanced' },
  { id: 'hair-length-waist', name: 'Waist Length', categoryId: 'hair-length', icon: '📏', promptFragment: 'waist length', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['very-long', 'waist'], level: 'advanced' },
];

// Hair Style Blocks (Expanded)
const HAIR_STYLE_BLOCKS: MicroBlock[] = [
  { id: 'hair-loose-down', name: 'Loose & Down', categoryId: 'hair-style', icon: '💁', promptFragment: 'loose flowing down', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['loose', 'down'], level: 'advanced' },
  { id: 'hair-updo-bun', name: 'Updo Bun', categoryId: 'hair-style', icon: '👱', promptFragment: 'elegant updo bun', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['updo', 'bun'], level: 'advanced' },
  { id: 'hair-messy-bun', name: 'Messy Bun', categoryId: 'hair-style', icon: '🙆', promptFragment: 'casual messy bun', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['messy', 'bun'], level: 'advanced' },
  { id: 'hair-ponytail-high', name: 'High Ponytail', categoryId: 'hair-style', icon: '🎀', promptFragment: 'high ponytail', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['ponytail', 'high'], level: 'advanced' },
  { id: 'hair-ponytail-low', name: 'Low Ponytail', categoryId: 'hair-style', icon: '🎀', promptFragment: 'low ponytail', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['ponytail', 'low'], level: 'advanced' },
  { id: 'hair-side-swept', name: 'Side Swept', categoryId: 'hair-style', icon: '💇', promptFragment: 'side-swept', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['side-swept', 'romantic'], level: 'advanced' },
  { id: 'hair-behind', name: 'Behind Shoulders', categoryId: 'hair-style', icon: '🙋', promptFragment: 'behind shoulders', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['behind', 'clear'], level: 'advanced' },
  { id: 'hair-half-up', name: 'Half-Up Half-Down', categoryId: 'hair-style', icon: '💆', promptFragment: 'half-up half-down', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['half-up', 'mixed'], level: 'advanced' },
  { id: 'hair-braided', name: 'Braided', categoryId: 'hair-style', icon: '🌾', promptFragment: 'braided', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['braided', 'intricate'], level: 'advanced' },
  { id: 'hair-sleek-straight', name: 'Sleek Straight', categoryId: 'hair-style', icon: '✨', promptFragment: 'sleek straight styled', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['sleek', 'straight'], level: 'advanced' },
  { id: 'hair-bob', name: 'Bob Cut', categoryId: 'hair-style', icon: '💇', promptFragment: 'bob cut', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['bob', 'short'], level: 'advanced' },
  { id: 'hair-layered', name: 'Layered', categoryId: 'hair-style', icon: '🌊', promptFragment: 'layered cut', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['layered', 'textured'], level: 'advanced' },
];

// Hair Texture Blocks (NEW)
const HAIR_TEXTURE_BLOCKS: MicroBlock[] = [
  { id: 'hair-tex-straight', name: 'Straight', categoryId: 'hair-texture', icon: '📏', promptFragment: 'straight texture', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['straight', 'smooth'], level: 'advanced' },
  { id: 'hair-tex-wavy', name: 'Wavy', categoryId: 'hair-texture', icon: '🌊', promptFragment: 'wavy texture', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['wavy', 'medium'], level: 'advanced' },
  { id: 'hair-tex-curly', name: 'Curly', categoryId: 'hair-texture', icon: '🌀', promptFragment: 'curly texture', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['curly', 'bouncy'], level: 'advanced' },
  { id: 'hair-tex-coily', name: 'Coily/Kinky', categoryId: 'hair-texture', icon: '🌪️', promptFragment: 'coily kinky texture', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['coily', 'kinky'], level: 'advanced' },
];

// Hair Color Blocks (Expanded)
const HAIR_COLOR_BLOCKS: MicroBlock[] = [
  { id: 'hair-black', name: 'Jet Black', categoryId: 'hair-color', icon: '⬛', promptFragment: 'jet black', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['black', 'dark'], level: 'advanced' },
  { id: 'hair-dark-brown', name: 'Dark Brown', categoryId: 'hair-color', icon: '🟫', promptFragment: 'dark brown', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown', 'dark'], level: 'advanced' },
  { id: 'hair-brown', name: 'Medium Brown', categoryId: 'hair-color', icon: '🟤', promptFragment: 'medium brown', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown', 'medium'], level: 'advanced' },
  { id: 'hair-light-brown', name: 'Light Brown', categoryId: 'hair-color', icon: '🤎', promptFragment: 'light brown', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown', 'light'], level: 'advanced' },
  { id: 'hair-honey-blonde', name: 'Honey Blonde', categoryId: 'hair-color', icon: '🍯', promptFragment: 'honey blonde', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['blonde', 'honey'], level: 'advanced' },
  { id: 'hair-platinum', name: 'Platinum Blonde', categoryId: 'hair-color', icon: '⚪', promptFragment: 'platinum blonde', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['blonde', 'platinum'], level: 'advanced' },
  { id: 'hair-auburn', name: 'Auburn', categoryId: 'hair-color', icon: '🟠', promptFragment: 'auburn', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['red', 'auburn'], level: 'advanced' },
  { id: 'hair-red', name: 'Vibrant Red', categoryId: 'hair-color', icon: '🔴', promptFragment: 'vibrant red', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['red', 'vibrant'], level: 'advanced' },
  { id: 'hair-burgundy', name: 'Burgundy', categoryId: 'hair-color', icon: '🍷', promptFragment: 'burgundy wine', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['burgundy', 'wine'], level: 'advanced' },
  { id: 'hair-highlights', name: 'Highlighted', categoryId: 'hair-color', icon: '✨', promptFragment: 'highlighted with streaks', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['highlights', 'mixed'], level: 'advanced' },
];

// Hair Volume Blocks (NEW)
const HAIR_VOLUME_BLOCKS: MicroBlock[] = [
  { id: 'hair-vol-flat', name: 'Flat/Sleek', categoryId: 'hair-volume', icon: '📉', promptFragment: 'flat sleek', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['flat', 'sleek'], level: 'advanced' },
  { id: 'hair-vol-normal', name: 'Normal Volume', categoryId: 'hair-volume', icon: '📊', promptFragment: 'normal volume', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['normal', 'medium'], level: 'advanced' },
  { id: 'hair-vol-voluminous', name: 'Voluminous', categoryId: 'hair-volume', icon: '📈', promptFragment: 'voluminous bouncy', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['voluminous', 'thick'], level: 'advanced' },
];

// ============================================
// FACE DETAILS BLOCKS (Conditional)
// ============================================

// Race/Ethnicity Blocks
const RACE_ETHNICITY_BLOCKS: MicroBlock[] = [
  { id: 'race-caucasian', name: 'Caucasian', categoryId: 'race-ethnicity', icon: '👱', promptFragment: 'caucasian european features', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['caucasian', 'european'], level: 'advanced' },
  { id: 'race-asian', name: 'Asian', categoryId: 'race-ethnicity', icon: '👩', promptFragment: 'asian east asian features', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['asian', 'east-asian'], level: 'advanced' },
  { id: 'race-african', name: 'African', categoryId: 'race-ethnicity', icon: '👩🏿', promptFragment: 'african features', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['african', 'black'], level: 'advanced' },
  { id: 'race-middle-eastern', name: 'Middle Eastern', categoryId: 'race-ethnicity', icon: '🧕', promptFragment: 'middle eastern features', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['middle-eastern', 'arab'], level: 'advanced' },
  { id: 'race-hispanic', name: 'Hispanic/Latina', categoryId: 'race-ethnicity', icon: '👩🏽', promptFragment: 'hispanic latina features', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['hispanic', 'latina'], level: 'advanced' },
  { id: 'race-mixed', name: 'Mixed/Multiracial', categoryId: 'race-ethnicity', icon: '🌈', promptFragment: 'mixed multiracial features', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['mixed', 'multiracial'], level: 'advanced' },
];

// Face Shape Blocks
const FACE_SHAPE_BLOCKS: MicroBlock[] = [
  { id: 'face-oval', name: 'Oval', categoryId: 'face-shape', icon: '⭕', promptFragment: 'oval face shape', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['oval', 'balanced'], level: 'advanced' },
  { id: 'face-round', name: 'Round', categoryId: 'face-shape', icon: '⚫', promptFragment: 'round face shape', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['round', 'soft'], level: 'advanced' },
  { id: 'face-square', name: 'Square', categoryId: 'face-shape', icon: '⬜', promptFragment: 'square face shape', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['square', 'angular'], level: 'advanced' },
  { id: 'face-heart', name: 'Heart', categoryId: 'face-shape', icon: '❤️', promptFragment: 'heart shaped face', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['heart', 'tapered'], level: 'advanced' },
  { id: 'face-diamond', name: 'Diamond', categoryId: 'face-shape', icon: '💎', promptFragment: 'diamond face shape', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['diamond', 'angular'], level: 'advanced' },
  { id: 'face-long', name: 'Long/Oblong', categoryId: 'face-shape', icon: '📏', promptFragment: 'long oblong face', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['long', 'oblong'], level: 'advanced' },
];

// Eye Color Blocks
const EYE_COLOR_BLOCKS: MicroBlock[] = [
  { id: 'eye-brown', name: 'Brown', categoryId: 'eye-color', icon: '🟤', promptFragment: 'brown eyes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown', 'dark'], level: 'advanced' },
  { id: 'eye-blue', name: 'Blue', categoryId: 'eye-color', icon: '🔵', promptFragment: 'blue eyes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['blue', 'light'], level: 'advanced' },
  { id: 'eye-green', name: 'Green', categoryId: 'eye-color', icon: '🟢', promptFragment: 'green eyes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['green'], level: 'advanced' },
  { id: 'eye-hazel', name: 'Hazel', categoryId: 'eye-color', icon: '🟡', promptFragment: 'hazel eyes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['hazel', 'mixed'], level: 'advanced' },
  { id: 'eye-gray', name: 'Gray', categoryId: 'eye-color', icon: '⚪', promptFragment: 'gray eyes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['gray', 'cool'], level: 'advanced' },
  { id: 'eye-amber', name: 'Amber', categoryId: 'eye-color', icon: '🟠', promptFragment: 'amber eyes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['amber', 'golden'], level: 'advanced' },
];

// Eye Type Blocks
const EYE_TYPE_BLOCKS: MicroBlock[] = [
  { id: 'eye-almond', name: 'Almond', categoryId: 'eye-type', icon: '👁️', promptFragment: 'almond shaped', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['almond', 'classic'], level: 'advanced' },
  { id: 'eye-round', name: 'Round', categoryId: 'eye-type', icon: '⚫', promptFragment: 'round large', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['round', 'large'], level: 'advanced' },
  { id: 'eye-hooded', name: 'Hooded', categoryId: 'eye-type', icon: '👁️', promptFragment: 'hooded', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['hooded', 'deep'], level: 'advanced' },
  { id: 'eye-monolid', name: 'Monolid', categoryId: 'eye-type', icon: '👁️', promptFragment: 'monolid', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['monolid', 'asian'], level: 'advanced' },
  { id: 'eye-upturned', name: 'Upturned', categoryId: 'eye-type', icon: '👁️', promptFragment: 'upturned cat-eye', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['upturned', 'cat-eye'], level: 'advanced' },
];

// Eyebrow Style Blocks
const EYEBROW_STYLE_BLOCKS: MicroBlock[] = [
  { id: 'brow-arched', name: 'Arched', categoryId: 'eyebrow-style', icon: '✏️', promptFragment: 'arched eyebrows', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['arched', 'dramatic'], level: 'advanced' },
  { id: 'brow-straight', name: 'Straight', categoryId: 'eyebrow-style', icon: '➖', promptFragment: 'straight eyebrows', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['straight', 'bold'], level: 'advanced' },
  { id: 'brow-rounded', name: 'Rounded', categoryId: 'eyebrow-style', icon: '🌙', promptFragment: 'rounded soft eyebrows', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['rounded', 'soft'], level: 'advanced' },
  { id: 'brow-angled', name: 'Angled', categoryId: 'eyebrow-style', icon: '📐', promptFragment: 'angled defined eyebrows', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['angled', 'defined'], level: 'advanced' },
  { id: 'brow-natural', name: 'Natural/Bushy', categoryId: 'eyebrow-style', icon: '🌿', promptFragment: 'natural bushy eyebrows', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'bushy'], level: 'advanced' },
];

// Eyelash Blocks
const EYELASH_BLOCKS: MicroBlock[] = [
  { id: 'lash-natural', name: 'Natural', categoryId: 'eyelash', icon: '👁️', promptFragment: 'natural eyelashes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'subtle'], level: 'advanced' },
  { id: 'lash-thick', name: 'Thick/Voluminous', categoryId: 'eyelash', icon: '💫', promptFragment: 'thick voluminous lashes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['thick', 'volume'], level: 'advanced' },
  { id: 'lash-mascara', name: 'Mascara Enhanced', categoryId: 'eyelash', icon: '✨', promptFragment: 'mascara enhanced lashes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['mascara', 'enhanced'], level: 'advanced' },
  { id: 'lash-false', name: 'False Lashes', categoryId: 'eyelash', icon: '🦋', promptFragment: 'dramatic false lashes', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['false', 'dramatic'], level: 'advanced' },
];

// Nose Type Blocks
const NOSE_TYPE_BLOCKS: MicroBlock[] = [
  { id: 'nose-button', name: 'Button', categoryId: 'nose-type', icon: '👃', promptFragment: 'button nose small', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['button', 'small'], level: 'advanced' },
  { id: 'nose-straight', name: 'Straight', categoryId: 'nose-type', icon: '📏', promptFragment: 'straight nose', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['straight', 'classic'], level: 'advanced' },
  { id: 'nose-aquiline', name: 'Aquiline/Roman', categoryId: 'nose-type', icon: '🏛️', promptFragment: 'aquiline roman nose', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['aquiline', 'prominent'], level: 'advanced' },
  { id: 'nose-broad', name: 'Broad', categoryId: 'nose-type', icon: '👃', promptFragment: 'broad wide nose', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['broad', 'wide'], level: 'advanced' },
  { id: 'nose-narrow', name: 'Narrow/Petite', categoryId: 'nose-type', icon: '📍', promptFragment: 'narrow petite nose', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['narrow', 'petite'], level: 'advanced' },
];

// Lip Type Blocks
const LIP_TYPE_BLOCKS: MicroBlock[] = [
  { id: 'lip-full', name: 'Full', categoryId: 'lip-type', icon: '💋', promptFragment: 'full lips', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['full', 'plump'], level: 'advanced' },
  { id: 'lip-thin', name: 'Thin', categoryId: 'lip-type', icon: '💄', promptFragment: 'thin lips', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['thin', 'delicate'], level: 'advanced' },
  { id: 'lip-heart', name: 'Heart-Shaped', categoryId: 'lip-type', icon: '❤️', promptFragment: 'heart shaped cupids bow lips', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['heart', 'cupids-bow'], level: 'advanced' },
  { id: 'lip-bow', name: 'Bow-Shaped', categoryId: 'lip-type', icon: '🎀', promptFragment: 'bow shaped lips', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['bow', 'curved'], level: 'advanced' },
  { id: 'lip-wide', name: 'Wide', categoryId: 'lip-type', icon: '💋', promptFragment: 'wide lips', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['wide', 'broad'], level: 'advanced' },
];

// Lip Color Blocks
const LIP_COLOR_BLOCKS: MicroBlock[] = [
  { id: 'lip-natural', name: 'Natural', categoryId: 'lip-color', icon: '🌸', promptFragment: 'natural lip color', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'bare'], level: 'advanced' },
  { id: 'lip-nude', name: 'Nude', categoryId: 'lip-color', icon: '🤎', promptFragment: 'nude lipstick', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['nude', 'neutral'], level: 'advanced' },
  { id: 'lip-pink', name: 'Pink', categoryId: 'lip-color', icon: '🌷', promptFragment: 'pink lipstick', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['pink', 'soft'], level: 'advanced' },
  { id: 'lip-red', name: 'Red', categoryId: 'lip-color', icon: '🔴', promptFragment: 'red lipstick bold', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['red', 'bold'], level: 'advanced' },
  { id: 'lip-berry', name: 'Berry/Plum', categoryId: 'lip-color', icon: '🍇', promptFragment: 'berry plum lipstick', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['berry', 'plum'], level: 'advanced' },
];

// Cheekbones Blocks
const CHEEKBONES_BLOCKS: MicroBlock[] = [
  { id: 'cheek-high', name: 'High', categoryId: 'cheekbones', icon: '✨', promptFragment: 'high prominent cheekbones', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['high', 'prominent'], level: 'advanced' },
  { id: 'cheek-defined', name: 'Defined', categoryId: 'cheekbones', icon: '💎', promptFragment: 'defined sculpted cheekbones', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['defined', 'sculpted'], level: 'advanced' },
  { id: 'cheek-soft', name: 'Soft/Subtle', categoryId: 'cheekbones', icon: '🌸', promptFragment: 'soft subtle cheekbones', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['soft', 'subtle'], level: 'advanced' },
];

// Chin Type Blocks
const CHIN_TYPE_BLOCKS: MicroBlock[] = [
  { id: 'chin-rounded', name: 'Rounded', categoryId: 'chin-type', icon: '⚫', promptFragment: 'rounded chin', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['rounded', 'soft'], level: 'advanced' },
  { id: 'chin-pointed', name: 'Pointed', categoryId: 'chin-type', icon: '🔺', promptFragment: 'pointed chin', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['pointed', 'sharp'], level: 'advanced' },
  { id: 'chin-square', name: 'Square', categoryId: 'chin-type', icon: '⬜', promptFragment: 'square chin', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['square', 'angular'], level: 'advanced' },
  { id: 'chin-dimpled', name: 'Dimpled', categoryId: 'chin-type', icon: '🕳️', promptFragment: 'dimpled chin cleft', applicableTo: { gender: ['women'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['dimpled', 'cleft'], level: 'advanced' },
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
    order: 50,
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
    order: 51,
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
    order: 60,
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
    order: 61,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['bracelet'],
    },
    required: false,
  },
  
  {
    id: 'sleeve-type',
    name: 'Sleeve Type',
    icon: '👕',
    description: 'Clothing sleeve style',
    order: 62,
    applicableTo: {
      gender: ['women'],
      jewelryTypes: ['bracelet'],
    },
    required: true,
  },
  
  {
    id: 'wrist-exposure',
    name: 'Wrist Exposure',
    icon: '✨',
    description: 'Bracelet visibility level',
    order: 63,
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
  ...WOMEN_FACE_CATEGORIES, // Conditional (toggle)
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
  { id: 'arm-vertical', name: 'Vertical Down', categoryId: 'arm-position', icon: '⬇️', promptFragment: 'arm vertical down natural hanging', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['vertical', 'down'], level: 'advanced' },
  { id: 'arm-horizontal', name: 'Horizontal', categoryId: 'arm-position', icon: '↔️', promptFragment: 'arm horizontal across extended', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['horizontal', 'across'], level: 'advanced' },
  { id: 'arm-diagonal', name: 'Diagonal', categoryId: 'arm-position', icon: '↗️', promptFragment: 'arm diagonal angle dynamic', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['diagonal', 'dynamic'], level: 'advanced' },
];

// ============================================
// BRACELET STYLING BLOCKS
// ============================================

// Sleeve Type Blocks
const SLEEVE_TYPE_BLOCKS: MicroBlock[] = [
  { id: 'sleeve-sleeveless', name: 'Sleeveless', categoryId: 'sleeve-type', icon: '💪', promptFragment: 'sleeveless bare arms', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['sleeveless', 'bare'], level: 'advanced' },
  { id: 'sleeve-tank', name: 'Tank Top', categoryId: 'sleeve-type', icon: '🎽', promptFragment: 'tank top straps shoulders exposed', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['tank', 'straps'], level: 'advanced' },
  { id: 'sleeve-short', name: 'Short Sleeve', categoryId: 'sleeve-type', icon: '👕', promptFragment: 'short sleeve upper arm covered', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['short', 'casual'], level: 'advanced' },
  { id: 'sleeve-three-quarter', name: '3/4 Sleeve', categoryId: 'sleeve-type', icon: '👚', promptFragment: 'three-quarter sleeve forearm exposed', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['three-quarter', 'forearm'], level: 'advanced' },
  { id: 'sleeve-long-rolled', name: 'Long (Rolled Up)', categoryId: 'sleeve-type', icon: '📜', promptFragment: 'long sleeve rolled up wrist visible', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['rolled', 'casual'], level: 'advanced' },
  { id: 'sleeve-long-pushed', name: 'Long (Pushed Up)', categoryId: 'sleeve-type', icon: '⬆️', promptFragment: 'long sleeve pushed up forearm showing', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['pushed', 'relaxed'], level: 'advanced' },
  { id: 'sleeve-bare', name: 'Bare Arm', categoryId: 'sleeve-type', icon: '✨', promptFragment: 'completely bare arm no clothing', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['bare', 'nude'], level: 'advanced' },
];

// Wrist Exposure Blocks
const WRIST_EXPOSURE_BLOCKS: MicroBlock[] = [
  { id: 'wrist-full', name: 'Fully Visible', categoryId: 'wrist-exposure', icon: '✨', promptFragment: 'wrist fully visible bracelet prominent', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['full', 'prominent'], level: 'advanced' },
  { id: 'wrist-partial', name: 'Partially Visible', categoryId: 'wrist-exposure', icon: '◐', promptFragment: 'wrist partially visible sleeve edge near', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['partial', 'edge'], level: 'advanced' },
  { id: 'wrist-contrast', name: 'Sleeve Contrast', categoryId: 'wrist-exposure', icon: '🎨', promptFragment: 'bracelet contrasting with sleeve edge', applicableTo: { gender: ['women'], jewelryTypes: ['bracelet'] }, tags: ['contrast', 'edge'], level: 'advanced' },
];

export const WOMEN_ALL_BLOCKS: MicroBlock[] = [
  // Universal blocks
  ...CLOTHING_TYPE_BLOCKS,
  ...SKIN_TONE_BLOCKS,
  ...NAIL_TYPE_BLOCKS,
  ...NAIL_COLOR_BLOCKS,
  ...MAKEUP_BLOCKS,
  ...EXPRESSION_BLOCKS,
  ...HAIR_LENGTH_BLOCKS,
  ...HAIR_STYLE_BLOCKS,
  ...HAIR_TEXTURE_BLOCKS,
  ...HAIR_COLOR_BLOCKS,
  ...HAIR_VOLUME_BLOCKS,
  
  // Face Details blocks (Conditional/Toggle)
  ...RACE_ETHNICITY_BLOCKS,
  ...FACE_SHAPE_BLOCKS,
  ...EYE_COLOR_BLOCKS,
  ...EYE_TYPE_BLOCKS,
  ...EYEBROW_STYLE_BLOCKS,
  ...EYELASH_BLOCKS,
  ...NOSE_TYPE_BLOCKS,
  ...LIP_TYPE_BLOCKS,
  ...LIP_COLOR_BLOCKS,
  ...CHEEKBONES_BLOCKS,
  ...CHIN_TYPE_BLOCKS,
  
  // Ring-specific blocks
  ...HAND_POSE_BLOCKS,
  ...HAND_STRUCTURE_BLOCKS,
  
  // Necklace-specific blocks
  ...NECK_POSE_BLOCKS,
  ...NECKLINE_BLOCKS,
  ...DECOLLETAGE_BLOCKS,
  ...SHOULDER_POSITION_BLOCKS,
  ...COLLARBONE_BLOCKS,
  
  // Earring-specific blocks
  ...HEAD_POSITION_BLOCKS,
  ...HAIR_POSITION_BLOCKS,
  
  // Bracelet-specific blocks
  ...WRIST_POSE_BLOCKS,
  ...ARM_POSITION_BLOCKS,
  ...SLEEVE_TYPE_BLOCKS,
  ...WRIST_EXPOSURE_BLOCKS,
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


