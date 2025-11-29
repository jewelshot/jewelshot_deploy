/**
 * Men-Specific Blocks
 * All categories and blocks for male models across all jewelry types
 */

import { BlockCategory, MicroBlock } from '../types';

// ============================================
// UNIVERSAL MEN CATEGORIES (All jewelry types)
// ============================================

export const MEN_UNIVERSAL_CATEGORIES: BlockCategory[] = [
  // Race/Ethnicity
  {
    id: 'race-ethnicity',
    name: 'Race/Ethnicity',
    icon: '🌍',
    description: 'Ethnic background and features',
    order: 1,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Skin Tone
  {
    id: 'skin-tone',
    name: 'Skin Tone',
    icon: '🎨',
    description: 'Skin color and undertone',
    order: 2,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Facial Hair - Beard Style
  {
    id: 'beard-style',
    name: 'Beard Style',
    icon: '🧔',
    description: 'Beard and facial hair style',
    order: 3,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Facial Hair - Beard Length
  {
    id: 'beard-length',
    name: 'Beard Length',
    icon: '📏',
    description: 'Length of facial hair',
    order: 4,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Facial Hair - Beard Color
  {
    id: 'beard-color',
    name: 'Beard Color',
    icon: '🎨',
    description: 'Facial hair color',
    order: 5,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Facial Hair - Mustache
  {
    id: 'mustache-style',
    name: 'Mustache Style',
    icon: '👨',
    description: 'Mustache styling',
    order: 6,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Masculine Facial Structure - Jawline
  {
    id: 'jawline',
    name: 'Jawline',
    icon: '💪',
    description: 'Jaw structure and definition',
    order: 7,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Masculine Facial Structure - Adam's Apple
  {
    id: 'adams-apple',
    name: "Adam's Apple",
    icon: '🫁',
    description: 'Prominence of laryngeal prominence',
    order: 8,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Masculine Facial Structure - Cheekbones
  {
    id: 'cheekbones-men',
    name: 'Cheekbones',
    icon: '💎',
    description: 'Cheekbone prominence and structure',
    order: 9,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Masculine Facial Structure - Brow Ridge
  {
    id: 'brow-ridge',
    name: 'Brow Ridge',
    icon: '👁️',
    description: 'Eyebrow bone prominence',
    order: 10,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Hair Length
  {
    id: 'hair-length',
    name: 'Hair Length',
    icon: '✂️',
    description: 'Hair length',
    order: 11,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Hair Style
  {
    id: 'hair-style',
    name: 'Hair Style',
    icon: '💈',
    description: 'Hairstyle and cut',
    order: 12,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Hair Texture
  {
    id: 'hair-texture',
    name: 'Hair Texture',
    icon: '〰️',
    description: 'Natural hair texture pattern',
    order: 13,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Hair Color
  {
    id: 'hair-color',
    name: 'Hair Color',
    icon: '🎨',
    description: 'Hair color shade',
    order: 14,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Hair Volume
  {
    id: 'hair-volume',
    name: 'Hair Volume',
    icon: '📊',
    description: 'Hair thickness and density',
    order: 15,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Body Hair - Chest
  {
    id: 'chest-hair',
    name: 'Chest Hair',
    icon: '🫁',
    description: 'Chest hair density',
    order: 16,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Body Hair - Arm
  {
    id: 'arm-hair',
    name: 'Arm Hair',
    icon: '💪',
    description: 'Arm hair density',
    order: 17,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Hand Details - Vein Prominence
  {
    id: 'vein-prominence',
    name: 'Vein Prominence',
    icon: '🫀',
    description: 'Visible veins on hands',
    order: 18,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Hand Details - Hand Structure
  {
    id: 'hand-structure-men',
    name: 'Hand Structure',
    icon: '✋',
    description: 'Hand size and build',
    order: 19,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Hand Details - Hand Texture
  {
    id: 'hand-texture',
    name: 'Hand Texture',
    icon: '🖐️',
    description: 'Skin texture on hands',
    order: 20,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Nails (Men)
  {
    id: 'nail-type-men',
    name: 'Nail Type',
    icon: '💅',
    description: 'Nail grooming style',
    order: 21,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Expression
  {
    id: 'expression-men',
    name: 'Expression',
    icon: '😐',
    description: 'Facial expression and mood',
    order: 22,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
];

// ============================================
// UNIVERSAL MEN BLOCKS
// ============================================

// Race/Ethnicity Blocks (Same as women)
const RACE_ETHNICITY_BLOCKS_MEN: MicroBlock[] = [
  { id: 'race-caucasian-men', name: 'Caucasian/European', categoryId: 'race-ethnicity', icon: '👨🏻', promptFragment: 'Caucasian European features', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['caucasian', 'european'], level: 'advanced' },
  { id: 'race-african-men', name: 'African/Black', categoryId: 'race-ethnicity', icon: '👨🏿', promptFragment: 'African Black features', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['african', 'black'], level: 'advanced' },
  { id: 'race-asian-men', name: 'East Asian', categoryId: 'race-ethnicity', icon: '👨', promptFragment: 'East Asian features', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['asian', 'east-asian'], level: 'advanced' },
  { id: 'race-south-asian-men', name: 'South Asian', categoryId: 'race-ethnicity', icon: '👨🏾', promptFragment: 'South Asian Indian features', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['south-asian', 'indian'], level: 'advanced' },
  { id: 'race-middle-eastern-men', name: 'Middle Eastern', categoryId: 'race-ethnicity', icon: '👨🏽', promptFragment: 'Middle Eastern Arab features', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['middle-eastern', 'arab'], level: 'advanced' },
  { id: 'race-latino-men', name: 'Latino/Hispanic', categoryId: 'race-ethnicity', icon: '👨🏽', promptFragment: 'Latino Hispanic features', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['latino', 'hispanic'], level: 'advanced' },
  { id: 'race-mediterranean-men', name: 'Mediterranean', categoryId: 'race-ethnicity', icon: '👨🏻', promptFragment: 'Mediterranean features', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['mediterranean'], level: 'advanced' },
  { id: 'race-mixed-men', name: 'Mixed/Multiracial', categoryId: 'race-ethnicity', icon: '👨', promptFragment: 'mixed multiracial features', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['mixed', 'multiracial'], level: 'advanced' },
];

// Skin Tone Blocks (Same as women)
const SKIN_TONE_BLOCKS_MEN: MicroBlock[] = [
  { id: 'skin-fair-men', name: 'Fair/Porcelain', categoryId: 'skin-tone', icon: '🤍', promptFragment: 'fair porcelain skin tone', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['fair', 'light'], level: 'advanced' },
  { id: 'skin-light-men', name: 'Light', categoryId: 'skin-tone', icon: '🏻', promptFragment: 'light skin tone', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['light'], level: 'advanced' },
  { id: 'skin-medium-men', name: 'Medium/Beige', categoryId: 'skin-tone', icon: '🏼', promptFragment: 'medium beige skin tone', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['medium', 'beige'], level: 'advanced' },
  { id: 'skin-olive-men', name: 'Olive', categoryId: 'skin-tone', icon: '🫒', promptFragment: 'olive skin tone Mediterranean complexion', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['olive', 'mediterranean'], level: 'advanced' },
  { id: 'skin-tan-men', name: 'Tan/Golden', categoryId: 'skin-tone', icon: '🏽', promptFragment: 'tan golden skin tone', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['tan', 'golden'], level: 'advanced' },
  { id: 'skin-deep-men', name: 'Deep/Dark', categoryId: 'skin-tone', icon: '🏾', promptFragment: 'deep dark skin tone', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['deep', 'dark'], level: 'advanced' },
  { id: 'skin-rich-men', name: 'Rich/Ebony', categoryId: 'skin-tone', icon: '🏿', promptFragment: 'rich ebony skin tone', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['rich', 'ebony'], level: 'advanced' },
];

// Beard Style Blocks
const BEARD_STYLE_BLOCKS: MicroBlock[] = [
  { id: 'beard-clean-shaven', name: 'Clean Shaven', categoryId: 'beard-style', icon: '🪒', promptFragment: 'clean shaven smooth face', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['clean', 'shaven'], level: 'advanced' },
  { id: 'beard-stubble', name: 'Stubble', categoryId: 'beard-style', icon: '🧔', promptFragment: 'light stubble shadow', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['stubble', 'shadow'], level: 'advanced' },
  { id: 'beard-short', name: 'Short Beard', categoryId: 'beard-style', icon: '🧔‍♂️', promptFragment: 'short trimmed beard neat', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['short', 'trimmed'], level: 'advanced' },
  { id: 'beard-full', name: 'Full Beard', categoryId: 'beard-style', icon: '🧔', promptFragment: 'full thick beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['full', 'thick'], level: 'advanced' },
  { id: 'beard-goatee', name: 'Goatee', categoryId: 'beard-style', icon: '🐐', promptFragment: 'goatee chin beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['goatee', 'chin'], level: 'advanced' },
  { id: 'beard-van-dyke', name: 'Van Dyke', categoryId: 'beard-style', icon: '🎭', promptFragment: 'Van Dyke mustache goatee combination', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['van-dyke', 'styled'], level: 'advanced' },
  { id: 'beard-circle', name: 'Circle Beard', categoryId: 'beard-style', icon: '⭕', promptFragment: 'circle beard around mouth', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['circle', 'round'], level: 'advanced' },
  { id: 'beard-balbo', name: 'Balbo', categoryId: 'beard-style', icon: '✂️', promptFragment: 'Balbo beard without sideburns', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['balbo', 'styled'], level: 'advanced' },
  { id: 'beard-corporate', name: 'Corporate Beard', categoryId: 'beard-style', icon: '💼', promptFragment: 'corporate professional beard trimmed', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['corporate', 'professional'], level: 'advanced' },
  { id: 'beard-designer-stubble', name: 'Designer Stubble', categoryId: 'beard-style', icon: '✨', promptFragment: 'designer stubble sculpted groomed', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['designer', 'groomed'], level: 'advanced' },
];

// Beard Length Blocks
const BEARD_LENGTH_BLOCKS: MicroBlock[] = [
  { id: 'beard-len-none', name: 'Clean (0mm)', categoryId: 'beard-length', icon: '🪒', promptFragment: 'completely clean shaven', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['none', 'clean'], level: 'advanced' },
  { id: 'beard-len-stubble', name: '1-3mm Stubble', categoryId: 'beard-length', icon: '📏', promptFragment: '1-3mm stubble shadow', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['stubble', 'short'], level: 'advanced' },
  { id: 'beard-len-short', name: '5-10mm Short', categoryId: 'beard-length', icon: '📐', promptFragment: '5-10mm short beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['short'], level: 'advanced' },
  { id: 'beard-len-medium', name: '2-5cm Medium', categoryId: 'beard-length', icon: '📊', promptFragment: '2-5cm medium length beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['medium'], level: 'advanced' },
  { id: 'beard-len-long', name: '5cm+ Long', categoryId: 'beard-length', icon: '📏', promptFragment: '5cm+ long beard full', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['long'], level: 'advanced' },
];

// Beard Color Blocks
const BEARD_COLOR_BLOCKS: MicroBlock[] = [
  { id: 'beard-color-black', name: 'Black', categoryId: 'beard-color', icon: '⬛', promptFragment: 'black beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['black', 'dark'], level: 'advanced' },
  { id: 'beard-color-dark-brown', name: 'Dark Brown', categoryId: 'beard-color', icon: '🟫', promptFragment: 'dark brown beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['dark-brown'], level: 'advanced' },
  { id: 'beard-color-brown', name: 'Brown', categoryId: 'beard-color', icon: '🤎', promptFragment: 'brown beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown'], level: 'advanced' },
  { id: 'beard-color-light-brown', name: 'Light Brown', categoryId: 'beard-color', icon: '🟤', promptFragment: 'light brown beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['light-brown'], level: 'advanced' },
  { id: 'beard-color-ginger', name: 'Red/Ginger', categoryId: 'beard-color', icon: '🟧', promptFragment: 'red ginger beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['red', 'ginger'], level: 'advanced' },
  { id: 'beard-color-blonde', name: 'Blonde', categoryId: 'beard-color', icon: '🟡', promptFragment: 'blonde beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['blonde'], level: 'advanced' },
  { id: 'beard-color-gray', name: 'Gray', categoryId: 'beard-color', icon: '⬜', promptFragment: 'gray beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['gray'], level: 'advanced' },
  { id: 'beard-color-white', name: 'White', categoryId: 'beard-color', icon: '⚪', promptFragment: 'white beard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['white'], level: 'advanced' },
  { id: 'beard-color-salt-pepper', name: 'Salt & Pepper', categoryId: 'beard-color', icon: '🧂', promptFragment: 'salt and pepper beard gray mixed', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['salt-pepper', 'mixed'], level: 'advanced' },
];

// Mustache Style Blocks
const MUSTACHE_STYLE_BLOCKS: MicroBlock[] = [
  { id: 'mustache-none', name: 'No Mustache', categoryId: 'mustache-style', icon: '🚫', promptFragment: 'no mustache clean upper lip', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['none'], level: 'advanced' },
  { id: 'mustache-pencil', name: 'Pencil Thin', categoryId: 'mustache-style', icon: '✏️', promptFragment: 'pencil thin mustache delicate', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['pencil', 'thin'], level: 'advanced' },
  { id: 'mustache-handlebar', name: 'Handlebar', categoryId: 'mustache-style', icon: '🚴', promptFragment: 'handlebar mustache curled ends', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['handlebar', 'curled'], level: 'advanced' },
  { id: 'mustache-chevron', name: 'Chevron', categoryId: 'mustache-style', icon: '📐', promptFragment: 'chevron mustache thick wide', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['chevron', 'thick'], level: 'advanced' },
  { id: 'mustache-walrus', name: 'Walrus', categoryId: 'mustache-style', icon: '🦭', promptFragment: 'walrus mustache bushy drooping', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['walrus', 'bushy'], level: 'advanced' },
  { id: 'mustache-horseshoe', name: 'Horseshoe', categoryId: 'mustache-style', icon: '🐴', promptFragment: 'horseshoe mustache full downward', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['horseshoe'], level: 'advanced' },
];

// Jawline Blocks
const JAWLINE_BLOCKS: MicroBlock[] = [
  { id: 'jaw-sharp-defined', name: 'Sharp Defined', categoryId: 'jawline', icon: '◆', promptFragment: 'sharp defined jawline chiseled', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['sharp', 'defined'], level: 'advanced' },
  { id: 'jaw-square-strong', name: 'Square Strong', categoryId: 'jawline', icon: '◼️', promptFragment: 'square strong jawline masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['square', 'strong'], level: 'advanced' },
  { id: 'jaw-soft-rounded', name: 'Soft Rounded', categoryId: 'jawline', icon: '⬜', promptFragment: 'soft rounded jawline gentle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['soft', 'rounded'], level: 'advanced' },
  { id: 'jaw-angular-chiseled', name: 'Angular Chiseled', categoryId: 'jawline', icon: '◇', promptFragment: 'angular chiseled jawline sculpted', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['angular', 'chiseled'], level: 'advanced' },
];

// Adam's Apple Blocks
const ADAMS_APPLE_BLOCKS: MicroBlock[] = [
  { id: 'adams-prominent', name: 'Prominent Visible', categoryId: 'adams-apple', icon: '🫁', promptFragment: "prominent visible Adam's apple", applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['prominent', 'visible'], level: 'advanced' },
  { id: 'adams-subtle', name: 'Subtle', categoryId: 'adams-apple', icon: '⚫', promptFragment: "subtle Adam's apple moderate", applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['subtle', 'moderate'], level: 'advanced' },
  { id: 'adams-not-visible', name: 'Not Visible', categoryId: 'adams-apple', icon: '⬛', promptFragment: "Adam's apple not visible smooth throat", applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['not-visible', 'smooth'], level: 'advanced' },
];

// Cheekbones (Men) Blocks
const CHEEKBONES_MEN_BLOCKS: MicroBlock[] = [
  { id: 'cheek-high-men', name: 'High Prominent', categoryId: 'cheekbones-men', icon: '💎', promptFragment: 'high prominent cheekbones defined', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['high', 'prominent'], level: 'advanced' },
  { id: 'cheek-moderate-men', name: 'Moderate', categoryId: 'cheekbones-men', icon: '⬜', promptFragment: 'moderate cheekbones balanced', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['moderate'], level: 'advanced' },
  { id: 'cheek-soft-men', name: 'Soft Low', categoryId: 'cheekbones-men', icon: '⬛', promptFragment: 'soft low cheekbones gentle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['soft', 'low'], level: 'advanced' },
];

// Brow Ridge Blocks
const BROW_RIDGE_BLOCKS: MicroBlock[] = [
  { id: 'brow-prominent', name: 'Prominent Strong', categoryId: 'brow-ridge', icon: '💪', promptFragment: 'prominent strong brow ridge masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['prominent', 'strong'], level: 'advanced' },
  { id: 'brow-moderate', name: 'Moderate', categoryId: 'brow-ridge', icon: '⬜', promptFragment: 'moderate brow ridge balanced', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['moderate'], level: 'advanced' },
  { id: 'brow-subtle', name: 'Subtle Soft', categoryId: 'brow-ridge', icon: '⬛', promptFragment: 'subtle soft brow ridge gentle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['subtle', 'soft'], level: 'advanced' },
];

// Hair Length Blocks (Men)
const HAIR_LENGTH_BLOCKS_MEN: MicroBlock[] = [
  { id: 'hair-len-buzz-men', name: 'Buzz Cut', categoryId: 'hair-length', icon: '✂️', promptFragment: 'buzz cut very short', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['buzz', 'very-short'], level: 'advanced' },
  { id: 'hair-len-short-crop-men', name: 'Short Crop', categoryId: 'hair-length', icon: '📏', promptFragment: 'short crop neat trim', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['short', 'crop'], level: 'advanced' },
  { id: 'hair-len-medium-men', name: 'Medium', categoryId: 'hair-length', icon: '📐', promptFragment: 'medium length', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['medium'], level: 'advanced' },
  { id: 'hair-len-shoulder-men', name: 'Shoulder Length', categoryId: 'hair-length', icon: '📊', promptFragment: 'shoulder length', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['shoulder'], level: 'advanced' },
  { id: 'hair-len-long-men', name: 'Long', categoryId: 'hair-length', icon: '💇', promptFragment: 'long flowing hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['long'], level: 'advanced' },
  { id: 'hair-len-bald-men', name: 'Bald/Shaved', categoryId: 'hair-length', icon: '🪒', promptFragment: 'bald shaved head', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['bald', 'shaved'], level: 'advanced' },
];

// Hair Style Blocks (Men)
const HAIR_STYLE_BLOCKS_MEN: MicroBlock[] = [
  { id: 'hair-slicked-back', name: 'Slicked Back', categoryId: 'hair-style', icon: '💼', promptFragment: 'slicked back hair polished', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['slicked', 'polished'], level: 'advanced' },
  { id: 'hair-side-part', name: 'Side Part', categoryId: 'hair-style', icon: '📐', promptFragment: 'side part classic professional', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['side-part', 'classic'], level: 'advanced' },
  { id: 'hair-messy-textured', name: 'Messy Textured', categoryId: 'hair-style', icon: '🌪️', promptFragment: 'messy textured hair casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['messy', 'casual'], level: 'advanced' },
  { id: 'hair-quiff', name: 'Quiff', categoryId: 'hair-style', icon: '📈', promptFragment: 'quiff voluminous swept up', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['quiff', 'voluminous'], level: 'advanced' },
  { id: 'hair-pompadour', name: 'Pompadour', categoryId: 'hair-style', icon: '🎩', promptFragment: 'pompadour high volume classic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['pompadour', 'classic'], level: 'advanced' },
  { id: 'hair-undercut', name: 'Undercut', categoryId: 'hair-style', icon: '✂️', promptFragment: 'undercut short sides long top', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['undercut', 'modern'], level: 'advanced' },
  { id: 'hair-fade', name: 'Fade', categoryId: 'hair-style', icon: '📉', promptFragment: 'fade haircut gradient', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['fade', 'gradient'], level: 'advanced' },
  { id: 'hair-man-bun', name: 'Man Bun', categoryId: 'hair-style', icon: '🥖', promptFragment: 'man bun tied back', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['man-bun', 'tied'], level: 'advanced' },
  { id: 'hair-dreadlocks', name: 'Dreadlocks', categoryId: 'hair-style', icon: '🌾', promptFragment: 'dreadlocks braided textured', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['dreadlocks'], level: 'advanced' },
  { id: 'hair-crew-cut', name: 'Crew Cut', categoryId: 'hair-style', icon: '💈', promptFragment: 'crew cut military short', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['crew-cut', 'military'], level: 'advanced' },
  { id: 'hair-comb-over', name: 'Comb Over', categoryId: 'hair-style', icon: '🪮', promptFragment: 'comb over swept side', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['comb-over'], level: 'advanced' },
  { id: 'hair-faux-hawk', name: 'Faux Hawk', categoryId: 'hair-style', icon: '🦅', promptFragment: 'faux hawk center ridge edgy', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['faux-hawk', 'edgy'], level: 'advanced' },
];

// Hair Texture Blocks (Same as women)
const HAIR_TEXTURE_BLOCKS_MEN: MicroBlock[] = [
  { id: 'hair-tex-straight-men', name: 'Straight', categoryId: 'hair-texture', icon: '➖', promptFragment: 'straight hair texture', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['straight'], level: 'advanced' },
  { id: 'hair-tex-wavy-men', name: 'Wavy', categoryId: 'hair-texture', icon: '〰️', promptFragment: 'wavy hair texture', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['wavy'], level: 'advanced' },
  { id: 'hair-tex-curly-men', name: 'Curly', categoryId: 'hair-texture', icon: '🌀', promptFragment: 'curly hair texture', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['curly'], level: 'advanced' },
  { id: 'hair-tex-coily-men', name: 'Coily/Kinky', categoryId: 'hair-texture', icon: '🌪️', promptFragment: 'coily kinky hair texture', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['coily', 'kinky'], level: 'advanced' },
];

// Hair Color Blocks (Same as women)
const HAIR_COLOR_BLOCKS_MEN: MicroBlock[] = [
  { id: 'hair-col-black-men', name: 'Black', categoryId: 'hair-color', icon: '⬛', promptFragment: 'black hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['black'], level: 'advanced' },
  { id: 'hair-col-dark-brown-men', name: 'Dark Brown', categoryId: 'hair-color', icon: '🟫', promptFragment: 'dark brown hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['dark-brown'], level: 'advanced' },
  { id: 'hair-col-brown-men', name: 'Brown', categoryId: 'hair-color', icon: '🤎', promptFragment: 'brown hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown'], level: 'advanced' },
  { id: 'hair-col-light-brown-men', name: 'Light Brown', categoryId: 'hair-color', icon: '🟤', promptFragment: 'light brown hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['light-brown'], level: 'advanced' },
  { id: 'hair-col-blonde-men', name: 'Blonde', categoryId: 'hair-color', icon: '🟡', promptFragment: 'blonde hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['blonde'], level: 'advanced' },
  { id: 'hair-col-gray-men', name: 'Gray', categoryId: 'hair-color', icon: '⬜', promptFragment: 'gray hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['gray'], level: 'advanced' },
  { id: 'hair-col-white-men', name: 'White', categoryId: 'hair-color', icon: '⚪', promptFragment: 'white hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['white'], level: 'advanced' },
  { id: 'hair-col-salt-pepper-men', name: 'Salt & Pepper', categoryId: 'hair-color', icon: '🧂', promptFragment: 'salt and pepper hair gray mixed', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['salt-pepper'], level: 'advanced' },
];

// Hair Volume Blocks (Same as women)
const HAIR_VOLUME_BLOCKS_MEN: MicroBlock[] = [
  { id: 'hair-vol-thin-men', name: 'Thin/Fine', categoryId: 'hair-volume', icon: '📉', promptFragment: 'thin fine hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['thin', 'fine'], level: 'advanced' },
  { id: 'hair-vol-normal-men', name: 'Normal Density', categoryId: 'hair-volume', icon: '➖', promptFragment: 'normal density hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['normal'], level: 'advanced' },
  { id: 'hair-vol-thick-men', name: 'Thick/Dense', categoryId: 'hair-volume', icon: '📈', promptFragment: 'thick dense hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['thick', 'dense'], level: 'advanced' },
  { id: 'hair-vol-voluminous-men', name: 'Voluminous', categoryId: 'hair-volume', icon: '💨', promptFragment: 'voluminous full hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['voluminous'], level: 'advanced' },
];

// Chest Hair Blocks
const CHEST_HAIR_BLOCKS: MicroBlock[] = [
  { id: 'chest-hairless', name: 'Hairless Smooth', categoryId: 'chest-hair', icon: '🪒', promptFragment: 'hairless smooth chest clean', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['hairless', 'smooth'], level: 'advanced' },
  { id: 'chest-light', name: 'Light Sparse', categoryId: 'chest-hair', icon: '💨', promptFragment: 'light sparse chest hair subtle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['light', 'sparse'], level: 'advanced' },
  { id: 'chest-moderate', name: 'Moderate Natural', categoryId: 'chest-hair', icon: '🫁', promptFragment: 'moderate natural chest hair', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['moderate', 'natural'], level: 'advanced' },
  { id: 'chest-dense', name: 'Dense Full', categoryId: 'chest-hair', icon: '🐻', promptFragment: 'dense full chest hair masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['dense', 'full'], level: 'advanced' },
];

// Arm Hair Blocks
const ARM_HAIR_BLOCKS: MicroBlock[] = [
  { id: 'arm-hairless', name: 'Hairless', categoryId: 'arm-hair', icon: '🪒', promptFragment: 'hairless arms smooth', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['hairless'], level: 'advanced' },
  { id: 'arm-light', name: 'Light', categoryId: 'arm-hair', icon: '💨', promptFragment: 'light arm hair subtle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['light'], level: 'advanced' },
  { id: 'arm-moderate', name: 'Moderate', categoryId: 'arm-hair', icon: '💪', promptFragment: 'moderate arm hair natural', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['moderate'], level: 'advanced' },
  { id: 'arm-dense', name: 'Dense', categoryId: 'arm-hair', icon: '🦾', promptFragment: 'dense arm hair full masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['dense'], level: 'advanced' },
];

// Vein Prominence Blocks
const VEIN_PROMINENCE_BLOCKS: MicroBlock[] = [
  { id: 'vein-prominent', name: 'Veiny Prominent', categoryId: 'vein-prominence', icon: '🫀', promptFragment: 'prominent veiny hands visible veins athletic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['veiny', 'prominent'], level: 'advanced' },
  { id: 'vein-moderate', name: 'Visible Moderate', categoryId: 'vein-prominence', icon: '💉', promptFragment: 'visible veins moderate natural', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['visible', 'moderate'], level: 'advanced' },
  { id: 'vein-subtle', name: 'Subtle Minimal', categoryId: 'vein-prominence', icon: '⚫', promptFragment: 'subtle minimal veins', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['subtle', 'minimal'], level: 'advanced' },
  { id: 'vein-none', name: 'Smooth No Veins', categoryId: 'vein-prominence', icon: '⬛', promptFragment: 'smooth hands no visible veins', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['smooth', 'none'], level: 'advanced' },
];

// Hand Structure (Men) Blocks
const HAND_STRUCTURE_MEN_BLOCKS: MicroBlock[] = [
  { id: 'hand-muscular-men', name: 'Muscular Broad', categoryId: 'hand-structure-men', icon: '💪', promptFragment: 'muscular broad hands strong powerful', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['muscular', 'broad'], level: 'advanced' },
  { id: 'hand-athletic-men', name: 'Athletic Strong', categoryId: 'hand-structure-men', icon: '🏋️', promptFragment: 'athletic strong hands fit', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['athletic', 'strong'], level: 'advanced' },
  { id: 'hand-rugged-men', name: 'Rugged Worker', categoryId: 'hand-structure-men', icon: '🔨', promptFragment: 'rugged worker hands calloused strong', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['rugged', 'worker'], level: 'advanced' },
  { id: 'hand-refined-men', name: 'Refined Elegant', categoryId: 'hand-structure-men', icon: '✨', promptFragment: 'refined elegant hands groomed', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['refined', 'elegant'], level: 'advanced' },
  { id: 'hand-large-men', name: 'Large Powerful', categoryId: 'hand-structure-men', icon: '🤚', promptFragment: 'large powerful hands masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['large', 'powerful'], level: 'advanced' },
  { id: 'hand-slender-men', name: 'Slender Artistic', categoryId: 'hand-structure-men', icon: '🎨', promptFragment: 'slender artistic hands long fingers', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['slender', 'artistic'], level: 'advanced' },
];

// Hand Texture Blocks
const HAND_TEXTURE_BLOCKS: MicroBlock[] = [
  { id: 'hand-tex-smooth', name: 'Smooth', categoryId: 'hand-texture', icon: '✨', promptFragment: 'smooth hand skin polished', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['smooth'], level: 'advanced' },
  { id: 'hand-tex-callused', name: 'Callused Rugged', categoryId: 'hand-texture', icon: '🔨', promptFragment: 'callused rugged hand texture worn', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['callused', 'rugged'], level: 'advanced' },
  { id: 'hand-tex-weathered', name: 'Weathered Worn', categoryId: 'hand-texture', icon: '🌤️', promptFragment: 'weathered worn hand texture aged', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['weathered', 'worn'], level: 'advanced' },
  { id: 'hand-tex-groomed', name: 'Polished Groomed', categoryId: 'hand-texture', icon: '💅', promptFragment: 'polished groomed hand texture refined', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['polished', 'groomed'], level: 'advanced' },
];

// Nail Type (Men) Blocks - NO NAIL POLISH
const NAIL_TYPE_MEN_BLOCKS: MicroBlock[] = [
  { id: 'nail-natural-short-men', name: 'Natural Short', categoryId: 'nail-type-men', icon: '✂️', promptFragment: 'natural short nails trimmed clean', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'short'], level: 'advanced' },
  { id: 'nail-manicured-men', name: 'Manicured Clean', categoryId: 'nail-type-men', icon: '✨', promptFragment: 'manicured clean nails groomed professional', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['manicured', 'clean'], level: 'advanced' },
  { id: 'nail-rugged-men', name: 'Rugged Worn', categoryId: 'nail-type-men', icon: '🔨', promptFragment: 'rugged worn nails working hands', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['rugged', 'worn'], level: 'advanced' },
  { id: 'nail-athletic-men', name: 'Athletic Trimmed', categoryId: 'nail-type-men', icon: '💪', promptFragment: 'athletic trimmed nails practical', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['athletic', 'trimmed'], level: 'advanced' },
];

// Expression (Men) Blocks
const EXPRESSION_MEN_BLOCKS: MicroBlock[] = [
  { id: 'expr-confident-men', name: 'Confident', categoryId: 'expression-men', icon: '😎', promptFragment: 'confident expression assured', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['confident'], level: 'advanced' },
  { id: 'expr-serious-men', name: 'Serious', categoryId: 'expression-men', icon: '😐', promptFragment: 'serious expression focused', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['serious'], level: 'advanced' },
  { id: 'expr-relaxed-men', name: 'Relaxed', categoryId: 'expression-men', icon: '😌', promptFragment: 'relaxed expression calm', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['relaxed'], level: 'advanced' },
  { id: 'expr-intense-men', name: 'Intense', categoryId: 'expression-men', icon: '😠', promptFragment: 'intense expression powerful', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['intense'], level: 'advanced' },
  { id: 'expr-friendly-men', name: 'Friendly', categoryId: 'expression-men', icon: '😊', promptFragment: 'friendly expression approachable', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['friendly'], level: 'advanced' },
  { id: 'expr-contemplative-men', name: 'Contemplative', categoryId: 'expression-men', icon: '🤔', promptFragment: 'contemplative expression thoughtful', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['contemplative'], level: 'advanced' },
];

// ============================================
// AGGREGATE ALL MEN BLOCKS (Universal Features)
// ============================================

const MEN_UNIVERSAL_BLOCKS: MicroBlock[] = [
  ...RACE_ETHNICITY_BLOCKS_MEN,
  ...SKIN_TONE_BLOCKS_MEN,
  ...BEARD_STYLE_BLOCKS,
  ...BEARD_LENGTH_BLOCKS,
  ...BEARD_COLOR_BLOCKS,
  ...MUSTACHE_STYLE_BLOCKS,
  ...JAWLINE_BLOCKS,
  ...ADAMS_APPLE_BLOCKS,
  ...CHEEKBONES_MEN_BLOCKS,
  ...BROW_RIDGE_BLOCKS,
  ...HAIR_LENGTH_BLOCKS_MEN,
  ...HAIR_STYLE_BLOCKS_MEN,
  ...HAIR_TEXTURE_BLOCKS_MEN,
  ...HAIR_COLOR_BLOCKS_MEN,
  ...HAIR_VOLUME_BLOCKS_MEN,
  ...CHEST_HAIR_BLOCKS,
  ...ARM_HAIR_BLOCKS,
  ...VEIN_PROMINENCE_BLOCKS,
  ...HAND_STRUCTURE_MEN_BLOCKS,
  ...HAND_TEXTURE_BLOCKS,
  ...NAIL_TYPE_MEN_BLOCKS,
  ...EXPRESSION_MEN_BLOCKS,
];

// ============================================
// MEN STYLING CATEGORIES
// ============================================

export const MEN_STYLING_CATEGORIES: BlockCategory[] = [
  // Upper Clothing Type
  {
    id: 'upper-clothing-men',
    name: 'Upper Clothing Type',
    icon: '👔',
    description: 'Type of upper body clothing',
    order: 100,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Neckline/Opening Type
  {
    id: 'neckline-opening-men',
    name: 'Neckline/Opening',
    icon: '👕',
    description: 'Neckline and shirt opening style',
    order: 101,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Collar Type
  {
    id: 'collar-type-men',
    name: 'Collar Type',
    icon: '🎽',
    description: 'Shirt collar style',
    order: 102,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Fit & Style
  {
    id: 'fit-style-men',
    name: 'Fit & Style',
    icon: '📐',
    description: 'Clothing fit and silhouette',
    order: 103,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Sleeve Style
  {
    id: 'sleeve-style-men',
    name: 'Sleeve Style',
    icon: '🦾',
    description: 'Sleeve length and styling',
    order: 104,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Upper Clothing Pattern
  {
    id: 'upper-pattern-men',
    name: 'Upper Clothing Pattern',
    icon: '🔲',
    description: 'Pattern on upper clothing',
    order: 105,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Upper Color
  {
    id: 'upper-color-men',
    name: 'Upper Color',
    icon: '🎨',
    description: 'Color of upper clothing',
    order: 106,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Lower Clothing
  {
    id: 'lower-clothing-men',
    name: 'Lower Clothing',
    icon: '👖',
    description: 'Type of lower body clothing',
    order: 107,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Lower Color
  {
    id: 'lower-color-men',
    name: 'Lower Color',
    icon: '🎨',
    description: 'Color of lower clothing',
    order: 108,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
];

// ============================================
// MEN STYLING BLOCKS
// ============================================

// Upper Clothing Type Blocks
const UPPER_CLOTHING_MEN_BLOCKS: MicroBlock[] = [
  // Casual
  { id: 'upper-tshirt-men', name: 'T-Shirt', categoryId: 'upper-clothing-men', icon: '👕', promptFragment: 'wearing t-shirt casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 't-shirt'], level: 'advanced', conflictsWith: ['upper-dress-shirt-men', 'upper-blazer-men', 'upper-suit-men'] },
  { id: 'upper-polo-men', name: 'Polo Shirt', categoryId: 'upper-clothing-men', icon: '👔', promptFragment: 'wearing polo shirt smart casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'polo'], level: 'advanced', conflictsWith: ['upper-blazer-men', 'upper-suit-men'] },
  { id: 'upper-henley-men', name: 'Henley', categoryId: 'upper-clothing-men', icon: '👕', promptFragment: 'wearing henley buttoned neckline casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'henley'], level: 'advanced' },
  { id: 'upper-long-sleeve-tee-men', name: 'Long Sleeve Tee', categoryId: 'upper-clothing-men', icon: '👕', promptFragment: 'wearing long sleeve t-shirt', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual'], level: 'advanced' },
  
  // Smart Casual
  { id: 'upper-dress-shirt-men', name: 'Dress Shirt', categoryId: 'upper-clothing-men', icon: '👔', promptFragment: 'wearing dress shirt formal', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['formal', 'dress-shirt'], level: 'advanced', conflictsWith: ['upper-tshirt-men', 'upper-hoodie-men'] },
  { id: 'upper-oxford-men', name: 'Oxford Shirt', categoryId: 'upper-clothing-men', icon: '👔', promptFragment: 'wearing oxford button-down shirt', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['smart-casual', 'oxford'], level: 'advanced' },
  { id: 'upper-flannel-men', name: 'Flannel', categoryId: 'upper-clothing-men', icon: '🪵', promptFragment: 'wearing flannel shirt rugged', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'flannel'], level: 'advanced' },
  { id: 'upper-denim-shirt-men', name: 'Denim Shirt', categoryId: 'upper-clothing-men', icon: '👕', promptFragment: 'wearing denim shirt casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'denim'], level: 'advanced' },
  
  // Formal
  { id: 'upper-blazer-men', name: 'Blazer', categoryId: 'upper-clothing-men', icon: '🧥', promptFragment: 'wearing blazer jacket formal', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['formal', 'blazer'], level: 'advanced', conflictsWith: ['upper-tshirt-men', 'upper-hoodie-men', 'upper-sweater-men'] },
  { id: 'upper-suit-men', name: 'Suit Jacket', categoryId: 'upper-clothing-men', icon: '🤵', promptFragment: 'wearing suit jacket formal business', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['formal', 'suit'], level: 'advanced', conflictsWith: ['upper-tshirt-men', 'upper-hoodie-men'] },
  { id: 'upper-vest-men', name: 'Vest/Waistcoat', categoryId: 'upper-clothing-men', icon: '🦺', promptFragment: 'wearing vest waistcoat formal', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['formal', 'vest'], level: 'advanced' },
  { id: 'upper-tuxedo-men', name: 'Tuxedo', categoryId: 'upper-clothing-men', icon: '🎩', promptFragment: 'wearing tuxedo black tie formal', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['formal', 'tuxedo'], level: 'advanced' },
  
  // Outerwear
  { id: 'upper-sweater-men', name: 'Sweater', categoryId: 'upper-clothing-men', icon: '🧶', promptFragment: 'wearing sweater cozy', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'sweater'], level: 'advanced' },
  { id: 'upper-cardigan-men', name: 'Cardigan', categoryId: 'upper-clothing-men', icon: '🧥', promptFragment: 'wearing cardigan open front', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'cardigan'], level: 'advanced' },
  { id: 'upper-hoodie-men', name: 'Hoodie', categoryId: 'upper-clothing-men', icon: '🎽', promptFragment: 'wearing hoodie casual streetwear', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'hoodie'], level: 'advanced', conflictsWith: ['upper-dress-shirt-men', 'upper-blazer-men', 'upper-suit-men'] },
  { id: 'upper-bomber-men', name: 'Bomber Jacket', categoryId: 'upper-clothing-men', icon: '🧥', promptFragment: 'wearing bomber jacket casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'jacket'], level: 'advanced' },
  { id: 'upper-leather-jacket-men', name: 'Leather Jacket', categoryId: 'upper-clothing-men', icon: '🧥', promptFragment: 'wearing leather jacket edgy', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual', 'leather'], level: 'advanced' },
];

// Neckline/Opening Type Blocks
const NECKLINE_OPENING_MEN_BLOCKS: MicroBlock[] = [
  // Basic Necklines
  { id: 'neck-crew-men', name: 'Crew Neck', categoryId: 'neckline-opening-men', icon: '⭕', promptFragment: 'crew neck round neckline', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['crew', 'round'], level: 'advanced' },
  { id: 'neck-vneck-men', name: 'V-Neck', categoryId: 'neckline-opening-men', icon: '🔻', promptFragment: 'V-neck showing upper chest', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['v-neck'], level: 'advanced' },
  { id: 'neck-henley-buttons-men', name: 'Henley Buttons', categoryId: 'neckline-opening-men', icon: '🔘', promptFragment: 'henley button placket neckline', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['henley', 'buttons'], level: 'advanced' },
  
  // Shirt Opening Styles
  { id: 'neck-fully-buttoned-men', name: 'Fully Buttoned', categoryId: 'neckline-opening-men', icon: '🔒', promptFragment: 'shirt fully buttoned formal closed', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['formal', 'closed'], level: 'advanced' },
  { id: 'neck-top-unbuttoned-men', name: 'Top Button Unbuttoned', categoryId: 'neckline-opening-men', icon: '🔓', promptFragment: 'shirt top button unbuttoned relaxed', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['relaxed'], level: 'advanced' },
  { id: 'neck-two-unbuttoned-men', name: '2 Buttons Unbuttoned', categoryId: 'neckline-opening-men', icon: '⬇️', promptFragment: 'shirt two buttons unbuttoned casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['casual'], level: 'advanced' },
  { id: 'neck-three-unbuttoned-men', name: '3 Buttons Unbuttoned', categoryId: 'neckline-opening-men', icon: '⬇️⬇️', promptFragment: 'shirt three buttons unbuttoned open chest visible', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['relaxed', 'open'], level: 'advanced' },
  { id: 'neck-open-collar-men', name: 'Open Collar', categoryId: 'neckline-opening-men', icon: '📖', promptFragment: 'shirt open collar relaxed casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['open', 'casual'], level: 'advanced' },
];

// Collar Type Blocks
const COLLAR_TYPE_MEN_BLOCKS: MicroBlock[] = [
  { id: 'collar-spread-men', name: 'Spread Collar', categoryId: 'collar-type-men', icon: '📐', promptFragment: 'spread collar wide formal', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['spread', 'formal'], level: 'advanced' },
  { id: 'collar-point-men', name: 'Point Collar', categoryId: 'collar-type-men', icon: '📍', promptFragment: 'point collar classic standard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['point', 'classic'], level: 'advanced' },
  { id: 'collar-button-down-men', name: 'Button-Down', categoryId: 'collar-type-men', icon: '🔘', promptFragment: 'button-down collar casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['button-down', 'casual'], level: 'advanced' },
  { id: 'collar-mandarin-men', name: 'Mandarin/Band', categoryId: 'collar-type-men', icon: '🎎', promptFragment: 'mandarin collar band collar minimalist', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['mandarin', 'minimal'], level: 'advanced' },
  { id: 'collar-cutaway-men', name: 'Cutaway Collar', categoryId: 'collar-type-men', icon: '✂️', promptFragment: 'cutaway collar wide spread modern', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['cutaway', 'modern'], level: 'advanced' },
];

// Fit & Style Blocks
const FIT_STYLE_MEN_BLOCKS: MicroBlock[] = [
  { id: 'fit-slim-men', name: 'Slim Fit', categoryId: 'fit-style-men', icon: '📏', promptFragment: 'slim fit tailored close to body', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['slim', 'tailored'], level: 'advanced' },
  { id: 'fit-tailored-men', name: 'Tailored Fit', categoryId: 'fit-style-men', icon: '✂️', promptFragment: 'tailored fit custom fitted sharp', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['tailored', 'fitted'], level: 'advanced' },
  { id: 'fit-regular-men', name: 'Regular Fit', categoryId: 'fit-style-men', icon: '📐', promptFragment: 'regular fit classic standard', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['regular', 'classic'], level: 'advanced' },
  { id: 'fit-relaxed-men', name: 'Relaxed Fit', categoryId: 'fit-style-men', icon: '🌊', promptFragment: 'relaxed fit comfortable loose', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['relaxed', 'loose'], level: 'advanced' },
  { id: 'fit-oversized-men', name: 'Oversized', categoryId: 'fit-style-men', icon: '⬜', promptFragment: 'oversized fit baggy streetwear', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['oversized', 'baggy'], level: 'advanced' },
];

// Sleeve Style Blocks
const SLEEVE_STYLE_MEN_BLOCKS: MicroBlock[] = [
  { id: 'sleeve-short-men', name: 'Short Sleeve', categoryId: 'sleeve-style-men', icon: '👕', promptFragment: 'short sleeves', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['short'], level: 'advanced' },
  { id: 'sleeve-long-men', name: 'Long Sleeve', categoryId: 'sleeve-style-men', icon: '👔', promptFragment: 'long sleeves', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['long'], level: 'advanced' },
  { id: 'sleeve-rolled-men', name: 'Rolled Sleeves', categoryId: 'sleeve-style-men', icon: '🔄', promptFragment: 'sleeves rolled up casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['rolled', 'casual'], level: 'advanced' },
  { id: 'sleeve-three-quarter-men', name: '3/4 Sleeve', categoryId: 'sleeve-style-men', icon: '📏', promptFragment: 'three-quarter sleeves', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['three-quarter'], level: 'advanced' },
];

// Upper Pattern Blocks
const UPPER_PATTERN_MEN_BLOCKS: MicroBlock[] = [
  { id: 'pattern-solid-men', name: 'Solid/Plain', categoryId: 'upper-pattern-men', icon: '⬛', promptFragment: 'solid color no pattern', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['solid', 'plain'], level: 'advanced' },
  { id: 'pattern-striped-men', name: 'Striped', categoryId: 'upper-pattern-men', icon: '🦓', promptFragment: 'striped pattern vertical lines', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['striped'], level: 'advanced' },
  { id: 'pattern-checkered-men', name: 'Checkered', categoryId: 'upper-pattern-men', icon: '🏁', promptFragment: 'checkered pattern gingham', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['checkered', 'gingham'], level: 'advanced' },
  { id: 'pattern-plaid-men', name: 'Plaid', categoryId: 'upper-pattern-men', icon: '🟫', promptFragment: 'plaid pattern tartan', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['plaid', 'tartan'], level: 'advanced' },
  { id: 'pattern-herringbone-men', name: 'Herringbone', categoryId: 'upper-pattern-men', icon: '〰️', promptFragment: 'herringbone pattern chevron weave', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['herringbone'], level: 'advanced' },
  { id: 'pattern-windowpane-men', name: 'Windowpane', categoryId: 'upper-pattern-men', icon: '🪟', promptFragment: 'windowpane check pattern', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['windowpane'], level: 'advanced' },
  { id: 'pattern-pinstripe-men', name: 'Pinstripe', categoryId: 'upper-pattern-men', icon: '📏', promptFragment: 'pinstripe pattern formal', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['pinstripe', 'formal'], level: 'advanced' },
];

// Upper Color Blocks
const UPPER_COLOR_MEN_BLOCKS: MicroBlock[] = [
  // Classic
  { id: 'upper-col-black-men', name: 'Black', categoryId: 'upper-color-men', icon: '⬛', promptFragment: 'black upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['black', 'classic'], level: 'advanced' },
  { id: 'upper-col-white-men', name: 'White', categoryId: 'upper-color-men', icon: '⬜', promptFragment: 'white upper clothing crisp', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['white', 'classic'], level: 'advanced' },
  { id: 'upper-col-navy-men', name: 'Navy Blue', categoryId: 'upper-color-men', icon: '🔵', promptFragment: 'navy blue upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['navy', 'classic'], level: 'advanced' },
  { id: 'upper-col-charcoal-men', name: 'Charcoal Gray', categoryId: 'upper-color-men', icon: '⬛', promptFragment: 'charcoal gray upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['gray', 'classic'], level: 'advanced' },
  { id: 'upper-col-gray-men', name: 'Light Gray', categoryId: 'upper-color-men', icon: '⬜', promptFragment: 'light gray upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['gray'], level: 'advanced' },
  
  // Earth Tones
  { id: 'upper-col-tan-men', name: 'Tan/Khaki', categoryId: 'upper-color-men', icon: '🟫', promptFragment: 'tan khaki upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['tan', 'earth'], level: 'advanced' },
  { id: 'upper-col-beige-men', name: 'Beige', categoryId: 'upper-color-men', icon: '🟤', promptFragment: 'beige upper clothing neutral', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['beige', 'earth'], level: 'advanced' },
  { id: 'upper-col-olive-men', name: 'Olive Green', categoryId: 'upper-color-men', icon: '🫒', promptFragment: 'olive green upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['olive', 'earth'], level: 'advanced' },
  { id: 'upper-col-brown-men', name: 'Brown', categoryId: 'upper-color-men', icon: '🤎', promptFragment: 'brown upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown', 'earth'], level: 'advanced' },
  { id: 'upper-col-burgundy-men', name: 'Burgundy/Wine', categoryId: 'upper-color-men', icon: '🍷', promptFragment: 'burgundy wine red upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['burgundy', 'rich'], level: 'advanced' },
  
  // Bold Colors
  { id: 'upper-col-red-men', name: 'Red', categoryId: 'upper-color-men', icon: '🔴', promptFragment: 'red upper clothing bold', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['red', 'bold'], level: 'advanced' },
  { id: 'upper-col-blue-men', name: 'Blue', categoryId: 'upper-color-men', icon: '🔵', promptFragment: 'blue upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['blue'], level: 'advanced' },
  { id: 'upper-col-green-men', name: 'Green', categoryId: 'upper-color-men', icon: '🟢', promptFragment: 'green upper clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['green'], level: 'advanced' },
];

// Lower Clothing Blocks
const LOWER_CLOTHING_MEN_BLOCKS: MicroBlock[] = [
  // Jeans
  { id: 'lower-dark-jeans-men', name: 'Dark Jeans', categoryId: 'lower-clothing-men', icon: '👖', promptFragment: 'wearing dark denim jeans', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['jeans', 'casual'], level: 'advanced' },
  { id: 'lower-light-jeans-men', name: 'Light Jeans', categoryId: 'lower-clothing-men', icon: '👖', promptFragment: 'wearing light blue jeans', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['jeans', 'casual'], level: 'advanced' },
  { id: 'lower-distressed-jeans-men', name: 'Distressed Jeans', categoryId: 'lower-clothing-men', icon: '🪡', promptFragment: 'wearing distressed ripped jeans', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['jeans', 'distressed'], level: 'advanced' },
  { id: 'lower-black-jeans-men', name: 'Black Jeans', categoryId: 'lower-clothing-men', icon: '⬛', promptFragment: 'wearing black jeans', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['jeans', 'black'], level: 'advanced' },
  
  // Casual Pants
  { id: 'lower-chinos-men', name: 'Chinos', categoryId: 'lower-clothing-men', icon: '👖', promptFragment: 'wearing chino pants smart casual', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['chinos', 'smart-casual'], level: 'advanced' },
  { id: 'lower-cargo-men', name: 'Cargo Pants', categoryId: 'lower-clothing-men', icon: '👖', promptFragment: 'wearing cargo pants utility pockets', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['cargo', 'casual'], level: 'advanced' },
  { id: 'lower-joggers-men', name: 'Joggers', categoryId: 'lower-clothing-men', icon: '🏃', promptFragment: 'wearing jogger pants athletic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['joggers', 'athletic'], level: 'advanced' },
  { id: 'lower-shorts-men', name: 'Shorts', categoryId: 'lower-clothing-men', icon: '🩳', promptFragment: 'wearing shorts casual summer', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['shorts', 'casual'], level: 'advanced' },
  
  // Formal Pants
  { id: 'lower-dress-pants-men', name: 'Dress Pants', categoryId: 'lower-clothing-men', icon: '👔', promptFragment: 'wearing dress pants formal', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['formal', 'dress-pants'], level: 'advanced' },
  { id: 'lower-suit-trousers-men', name: 'Suit Trousers', categoryId: 'lower-clothing-men', icon: '🤵', promptFragment: 'wearing suit trousers formal business', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['formal', 'suit'], level: 'advanced' },
];

// Lower Color Blocks
const LOWER_COLOR_MEN_BLOCKS: MicroBlock[] = [
  { id: 'lower-col-black-men', name: 'Black', categoryId: 'lower-color-men', icon: '⬛', promptFragment: 'black lower clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['black'], level: 'advanced' },
  { id: 'lower-col-navy-men', name: 'Navy', categoryId: 'lower-color-men', icon: '🔵', promptFragment: 'navy lower clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['navy'], level: 'advanced' },
  { id: 'lower-col-gray-men', name: 'Gray', categoryId: 'lower-color-men', icon: '⬜', promptFragment: 'gray lower clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['gray'], level: 'advanced' },
  { id: 'lower-col-khaki-men', name: 'Khaki/Tan', categoryId: 'lower-color-men', icon: '🟫', promptFragment: 'khaki tan lower clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['khaki', 'tan'], level: 'advanced' },
  { id: 'lower-col-beige-men', name: 'Beige', categoryId: 'lower-color-men', icon: '🟤', promptFragment: 'beige lower clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['beige'], level: 'advanced' },
  { id: 'lower-col-olive-men', name: 'Olive', categoryId: 'lower-color-men', icon: '🫒', promptFragment: 'olive green lower clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['olive'], level: 'advanced' },
  { id: 'lower-col-brown-men', name: 'Brown', categoryId: 'lower-color-men', icon: '🤎', promptFragment: 'brown lower clothing', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['brown'], level: 'advanced' },
  { id: 'lower-col-denim-men', name: 'Denim Blue', categoryId: 'lower-color-men', icon: '🔵', promptFragment: 'denim blue jeans', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['denim', 'blue'], level: 'advanced' },
];

// ============================================
// AGGREGATE MEN STYLING BLOCKS
// ============================================

const MEN_STYLING_BLOCKS: MicroBlock[] = [
  ...UPPER_CLOTHING_MEN_BLOCKS,
  ...NECKLINE_OPENING_MEN_BLOCKS,
  ...COLLAR_TYPE_MEN_BLOCKS,
  ...FIT_STYLE_MEN_BLOCKS,
  ...SLEEVE_STYLE_MEN_BLOCKS,
  ...UPPER_PATTERN_MEN_BLOCKS,
  ...UPPER_COLOR_MEN_BLOCKS,
  ...LOWER_CLOTHING_MEN_BLOCKS,
  ...LOWER_COLOR_MEN_BLOCKS,
];

// ============================================
// MEN ENVIRONMENT CATEGORIES
// ============================================

export const MEN_ENVIRONMENT_CATEGORIES: BlockCategory[] = [
  // Location & Background
  {
    id: 'location-background-men',
    name: 'Location & Background',
    icon: '🌍',
    description: 'Setting and background environment',
    order: 200,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  // Lighting
  {
    id: 'lighting-men',
    name: 'Lighting',
    icon: '💡',
    description: 'Light source and quality',
    order: 201,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
];

// ============================================
// MEN ENVIRONMENT BLOCKS
// ============================================

// Location & Background Blocks
const LOCATION_BACKGROUND_MEN_BLOCKS: MicroBlock[] = [
  // Universal/Shared Locations
  { id: 'loc-studio-white-men', name: 'Studio White', categoryId: 'location-background-men', icon: '⬜', promptFragment: 'clean white studio background minimalist', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['studio', 'white'], level: 'advanced' },
  { id: 'loc-studio-black-men', name: 'Studio Black', categoryId: 'location-background-men', icon: '⬛', promptFragment: 'dramatic black studio background dark', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['studio', 'black'], level: 'advanced' },
  { id: 'loc-studio-gray-men', name: 'Studio Gray', categoryId: 'location-background-men', icon: '◻️', promptFragment: 'neutral gray studio background', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['studio', 'gray'], level: 'advanced' },
  { id: 'loc-natural-window-men', name: 'Natural Window Light', categoryId: 'location-background-men', icon: '🪟', promptFragment: 'natural window light indoor soft', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'window'], level: 'advanced' },
  { id: 'loc-outdoor-garden-men', name: 'Outdoor Garden', categoryId: 'location-background-men', icon: '🌳', promptFragment: 'outdoor garden natural greenery', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['outdoor', 'garden'], level: 'advanced' },
  { id: 'loc-minimalist-interior-men', name: 'Minimalist Interior', categoryId: 'location-background-men', icon: '🏠', promptFragment: 'minimalist modern interior clean lines', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['minimalist', 'interior'], level: 'advanced' },
  
  // Masculine Locations
  { id: 'loc-industrial-loft-men', name: 'Industrial Loft', categoryId: 'location-background-men', icon: '🏭', promptFragment: 'industrial loft exposed brick concrete masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['industrial', 'masculine'], level: 'advanced' },
  { id: 'loc-workshop-garage-men', name: 'Workshop/Garage', categoryId: 'location-background-men', icon: '🔧', promptFragment: 'workshop garage tools workbench masculine rugged', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['workshop', 'rugged'], level: 'advanced' },
  { id: 'loc-boxing-gym-men', name: 'Boxing Gym', categoryId: 'location-background-men', icon: '🥊', promptFragment: 'boxing gym athletic gritty masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['gym', 'athletic'], level: 'advanced' },
  { id: 'loc-man-cave-men', name: 'Man Cave', categoryId: 'location-background-men', icon: '🎮', promptFragment: 'man cave leather furniture wood paneling masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['man-cave', 'masculine'], level: 'advanced' },
  { id: 'loc-cigar-lounge-men', name: 'Cigar Lounge', categoryId: 'location-background-men', icon: '🚬', promptFragment: 'cigar lounge leather chairs dark wood sophisticated', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['lounge', 'sophisticated'], level: 'advanced' },
  { id: 'loc-whiskey-bar-men', name: 'Whiskey Bar', categoryId: 'location-background-men', icon: '🥃', promptFragment: 'whiskey bar dark wood bottles backlit masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['bar', 'sophisticated'], level: 'advanced' },
  { id: 'loc-barbershop-men', name: 'Barbershop', categoryId: 'location-background-men', icon: '💈', promptFragment: 'classic barbershop vintage chairs mirrors masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['barbershop', 'vintage'], level: 'advanced' },
  { id: 'loc-rooftop-urban-men', name: 'Rooftop Urban', categoryId: 'location-background-men', icon: '🏙️', promptFragment: 'rooftop cityscape urban skyline masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['urban', 'rooftop'], level: 'advanced' },
  { id: 'loc-concrete-architecture-men', name: 'Concrete Architecture', categoryId: 'location-background-men', icon: '🏗️', promptFragment: 'concrete brutalist architecture industrial modern', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['concrete', 'modern'], level: 'advanced' },
  { id: 'loc-warehouse-men', name: 'Warehouse', categoryId: 'location-background-men', icon: '📦', promptFragment: 'warehouse industrial raw space masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['warehouse', 'industrial'], level: 'advanced' },
  { id: 'loc-leather-study-men', name: 'Leather Study', categoryId: 'location-background-men', icon: '📚', promptFragment: 'leather study library books wood paneling sophisticated', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['study', 'sophisticated'], level: 'advanced' },
  { id: 'loc-outdoor-rugged-men', name: 'Outdoor Rugged', categoryId: 'location-background-men', icon: '⛰️', promptFragment: 'outdoor rugged natural wilderness masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['outdoor', 'rugged'], level: 'advanced' },
];

// Lighting Blocks
const LIGHTING_MEN_BLOCKS: MicroBlock[] = [
  // Universal/Shared Lighting
  { id: 'light-natural-soft-men', name: 'Natural Soft', categoryId: 'lighting-men', icon: '☀️', promptFragment: 'natural soft daylight even gentle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'soft'], level: 'advanced' },
  { id: 'light-golden-hour-men', name: 'Golden Hour', categoryId: 'lighting-men', icon: '🌅', promptFragment: 'golden hour warm sunset glow', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['golden', 'warm'], level: 'advanced' },
  { id: 'light-studio-flash-men', name: 'Studio Flash', categoryId: 'lighting-men', icon: '📸', promptFragment: 'studio strobe flash photography lighting', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['studio', 'flash'], level: 'advanced' },
  { id: 'light-overcast-diffused-men', name: 'Overcast Diffused', categoryId: 'lighting-men', icon: '☁️', promptFragment: 'overcast cloudy diffused soft shadowless', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['overcast', 'diffused'], level: 'advanced' },
  { id: 'light-rim-backlight-men', name: 'Rim/Backlight', categoryId: 'lighting-men', icon: '🔆', promptFragment: 'rim lighting backlit edge glow dramatic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['rim', 'backlight'], level: 'advanced' },
  
  // Masculine Lighting
  { id: 'light-harsh-industrial-men', name: 'Harsh Industrial', categoryId: 'lighting-men', icon: '💡', promptFragment: 'harsh industrial fluorescent lighting hard shadows masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['industrial', 'harsh'], level: 'advanced' },
  { id: 'light-dramatic-shadows-men', name: 'Dramatic Hard Shadows', categoryId: 'lighting-men', icon: '🌑', promptFragment: 'dramatic hard shadows high contrast masculine moody', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['dramatic', 'shadows'], level: 'advanced' },
  { id: 'light-moody-dark-men', name: 'Moody Dark', categoryId: 'lighting-men', icon: '🌚', promptFragment: 'moody dark low-key lighting mysterious masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['moody', 'dark'], level: 'advanced' },
  { id: 'light-garage-fluorescent-men', name: 'Garage Fluorescent', categoryId: 'lighting-men', icon: '🔦', promptFragment: 'garage workshop fluorescent cool harsh industrial', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['garage', 'fluorescent'], level: 'advanced' },
  { id: 'light-workshop-task-men', name: 'Workshop Task Light', categoryId: 'lighting-men', icon: '🔧', promptFragment: 'workshop task lighting focused work light utilitarian', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['workshop', 'task'], level: 'advanced' },
  { id: 'light-masculine-warm-men', name: 'Masculine Warm', categoryId: 'lighting-men', icon: '🔥', promptFragment: 'masculine warm amber lighting rich deep tones', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['warm', 'masculine'], level: 'advanced' },
  { id: 'light-neon-urban-men', name: 'Neon Urban', categoryId: 'lighting-men', icon: '🌃', promptFragment: 'neon urban night lighting colorful edgy', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['neon', 'urban'], level: 'advanced' },
  { id: 'light-firelight-men', name: 'Firelight/Candlelight', categoryId: 'lighting-men', icon: '🕯️', promptFragment: 'firelight candlelight warm flickering intimate', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['fire', 'warm'], level: 'advanced' },
  { id: 'light-spotlight-men', name: 'Spotlight Dramatic', categoryId: 'lighting-men', icon: '🎭', promptFragment: 'spotlight dramatic single source theatrical', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['spotlight', 'dramatic'], level: 'advanced' },
];

// ============================================
// AGGREGATE MEN ENVIRONMENT BLOCKS
// ============================================

const MEN_ENVIRONMENT_BLOCKS: MicroBlock[] = [
  ...LOCATION_BACKGROUND_MEN_BLOCKS,
  ...LIGHTING_MEN_BLOCKS,
];

// ============================================
// MEN CAMERA CATEGORIES (Jewelry-Centric - Same as Women)
// ============================================

export const MEN_CAMERA_CATEGORIES: BlockCategory[] = [
  {
    id: 'jewelry-framing-men',
    name: 'Jewelry Framing',
    icon: '📷',
    description: 'How jewelry is framed in shot',
    order: 300,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'viewing-angle-men',
    name: 'Viewing Angle',
    icon: '📐',
    description: 'Camera angle relative to jewelry',
    order: 301,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'focus-depth-men',
    name: 'Focus & Depth',
    icon: '🎯',
    description: 'Focus point and depth of field',
    order: 302,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'composition-rules-men',
    name: 'Composition Rules',
    icon: '📐',
    description: 'Compositional guidelines',
    order: 303,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
];

// Camera Blocks (Jewelry-Centric - Same as Women)
const JEWELRY_FRAMING_MEN_BLOCKS: MicroBlock[] = [
  { id: 'frame-extreme-closeup-men', name: 'Extreme Close-Up', categoryId: 'jewelry-framing-men', icon: '🔍', promptFragment: 'extreme close-up jewelry fills frame macro detail', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['close-up', 'macro'], level: 'advanced' },
  { id: 'frame-closeup-men', name: 'Close-Up', categoryId: 'jewelry-framing-men', icon: '📷', promptFragment: 'close-up jewelry prominent sharp focus', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['close-up'], level: 'advanced' },
  { id: 'frame-medium-men', name: 'Medium Shot', categoryId: 'jewelry-framing-men', icon: '📸', promptFragment: 'medium shot jewelry clearly visible with context', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['medium'], level: 'advanced' },
  { id: 'frame-full-men', name: 'Full Context', categoryId: 'jewelry-framing-men', icon: '🖼️', promptFragment: 'full context jewelry in lifestyle setting', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['full', 'context'], level: 'advanced' },
  { id: 'frame-detail-men', name: 'Detail Hero', categoryId: 'jewelry-framing-men', icon: '💎', promptFragment: 'jewelry detail hero shot isolated focused', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['detail', 'hero'], level: 'advanced' },
  { id: 'frame-lifestyle-men', name: 'Lifestyle Wide', categoryId: 'jewelry-framing-men', icon: '🌅', promptFragment: 'lifestyle wide shot jewelry subtle accent', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['lifestyle', 'wide'], level: 'advanced' },
];

const VIEWING_ANGLE_MEN_BLOCKS: MicroBlock[] = [
  { id: 'angle-straight-men', name: 'Straight On', categoryId: 'viewing-angle-men', icon: '➡️', promptFragment: 'straight on eye-level jewelry centered', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['straight', 'eye-level'], level: 'advanced' },
  { id: 'angle-top-down-men', name: 'Top-Down', categoryId: 'viewing-angle-men', icon: '⬇️', promptFragment: 'top-down overhead jewelry flat lay', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['top-down', 'overhead'], level: 'advanced' },
  { id: 'angle-side-profile-men', name: 'Side Profile', categoryId: 'viewing-angle-men', icon: '↔️', promptFragment: 'side profile angle jewelry dimension visible', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['side', 'profile'], level: 'advanced' },
  { id: 'angle-low-angle-men', name: 'Low Angle', categoryId: 'viewing-angle-men', icon: '⬆️', promptFragment: 'low angle looking up jewelry elevated heroic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['low', 'heroic'], level: 'advanced' },
  { id: 'angle-high-angle-men', name: 'High Angle', categoryId: 'viewing-angle-men', icon: '⬇️', promptFragment: 'high angle looking down jewelry featured', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['high'], level: 'advanced' },
  { id: 'angle-three-quarter-men', name: 'Three-Quarter', categoryId: 'viewing-angle-men', icon: '↗️', promptFragment: 'three-quarter angle jewelry dynamic perspective', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['three-quarter', 'dynamic'], level: 'advanced' },
];

const FOCUS_DEPTH_MEN_BLOCKS: MicroBlock[] = [
  { id: 'focus-sharp-jewelry-men', name: 'Sharp Jewelry Only', categoryId: 'focus-depth-men', icon: '🎯', promptFragment: 'jewelry razor sharp focus background blurred', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['sharp', 'jewelry'], level: 'advanced' },
  { id: 'focus-shallow-dof-men', name: 'Shallow DOF', categoryId: 'focus-depth-men', icon: '📷', promptFragment: 'shallow depth of field jewelry sharp background soft bokeh', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['shallow', 'bokeh'], level: 'advanced' },
  { id: 'focus-medium-dof-men', name: 'Medium DOF', categoryId: 'focus-depth-men', icon: '📸', promptFragment: 'medium depth of field jewelry and immediate context sharp', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['medium'], level: 'advanced' },
  { id: 'focus-deep-dof-men', name: 'Deep DOF', categoryId: 'focus-depth-men', icon: '🌄', promptFragment: 'deep depth of field everything sharp jewelry and background', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['deep', 'sharp'], level: 'advanced' },
  { id: 'focus-tack-sharp-men', name: 'Tack Sharp All', categoryId: 'focus-depth-men', icon: '💎', promptFragment: 'tack sharp focus jewelry perfectly crisp detailed', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['tack-sharp'], level: 'advanced' },
  { id: 'focus-selective-men', name: 'Selective Focus', categoryId: 'focus-depth-men', icon: '🔍', promptFragment: 'selective focus jewelry element highlighted rest soft', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['selective'], level: 'advanced' },
];

const COMPOSITION_RULES_MEN_BLOCKS: MicroBlock[] = [
  { id: 'comp-rule-thirds-men', name: 'Rule of Thirds', categoryId: 'composition-rules-men', icon: '⊞', promptFragment: 'jewelry at rule of thirds intersection balanced grid', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['thirds', 'balanced'], level: 'advanced' },
  { id: 'comp-golden-ratio-men', name: 'Golden Ratio', categoryId: 'composition-rules-men', icon: '🌀', promptFragment: 'jewelry positioned golden ratio fibonacci spiral natural flow', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['golden', 'fibonacci'], level: 'advanced' },
  { id: 'comp-centered-men', name: 'Centered Symmetry', categoryId: 'composition-rules-men', icon: '⊕', promptFragment: 'jewelry perfectly centered symmetrical balanced', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['centered', 'symmetry'], level: 'advanced' },
  { id: 'comp-negative-space-men', name: 'Negative Space', categoryId: 'composition-rules-men', icon: '⬜', promptFragment: 'minimalist negative space jewelry breathing room', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['negative', 'minimal'], level: 'advanced' },
  { id: 'comp-leading-lines-men', name: 'Leading Lines', categoryId: 'composition-rules-men', icon: '↗️', promptFragment: 'leading lines directing eye to jewelry compositional flow', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['leading', 'lines'], level: 'advanced' },
  { id: 'comp-frame-within-men', name: 'Frame within Frame', categoryId: 'composition-rules-men', icon: '🖼️', promptFragment: 'frame within frame jewelry naturally framed compositional depth', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['frame', 'depth'], level: 'advanced' },
  { id: 'comp-diagonal-men', name: 'Diagonal Composition', categoryId: 'composition-rules-men', icon: '⟋', promptFragment: 'diagonal composition jewelry dynamic angled flow', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['diagonal', 'dynamic'], level: 'advanced' },
  { id: 'comp-balanced-asym-men', name: 'Balanced Asymmetry', categoryId: 'composition-rules-men', icon: '⚖️', promptFragment: 'balanced asymmetry jewelry off-center visual equilibrium', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['asymmetry', 'balanced'], level: 'advanced' },
];

// ============================================
// MEN POST-PRODUCTION CATEGORIES (Same as Women)
// ============================================

export const MEN_POST_PRODUCTION_CATEGORIES: BlockCategory[] = [
  {
    id: 'post-processing-level-men',
    name: 'Processing Level',
    icon: '✨',
    description: 'Image processing intensity',
    order: 400,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'color-grading-men',
    name: 'Color Grading',
    icon: '🎨',
    description: 'Color tone and grading style',
    order: 401,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
];

const PROCESSING_LEVEL_MEN_BLOCKS: MicroBlock[] = [
  { id: 'proc-natural-men', name: 'Natural/RAW', categoryId: 'post-processing-level-men', icon: '🌿', promptFragment: 'natural RAW minimal processing authentic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'raw'], level: 'advanced' },
  { id: 'proc-light-retouch-men', name: 'Light Retouch', categoryId: 'post-processing-level-men', icon: '✏️', promptFragment: 'light retouch basic color correction subtle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['light', 'retouch'], level: 'advanced' },
  { id: 'proc-professional-men', name: 'Professional Edit', categoryId: 'post-processing-level-men', icon: '⚡', promptFragment: 'professional editing polished refined', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['professional'], level: 'advanced' },
  { id: 'proc-catalog-men', name: 'Catalog Perfect', categoryId: 'post-processing-level-men', icon: '💎', promptFragment: 'catalog perfect heavy editing flawless commercial', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['catalog', 'perfect'], level: 'advanced' },
  { id: 'proc-hdr-men', name: 'HDR Enhanced', categoryId: 'post-processing-level-men', icon: '🌟', promptFragment: 'HDR enhanced high dynamic range dramatic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['hdr', 'dramatic'], level: 'advanced' },
];

const COLOR_GRADING_MEN_BLOCKS: MicroBlock[] = [
  { id: 'grade-natural-men', name: 'Natural Balanced', categoryId: 'color-grading-men', icon: '⚖️', promptFragment: 'natural balanced color grading true-to-life', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'balanced'], level: 'advanced' },
  { id: 'grade-warm-men', name: 'Warm Golden', categoryId: 'color-grading-men', icon: '🔥', promptFragment: 'warm golden color grading cozy amber tones', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['warm', 'golden'], level: 'advanced' },
  { id: 'grade-cool-men', name: 'Cool Blue', categoryId: 'color-grading-men', icon: '❄️', promptFragment: 'cool blue color grading crisp cyan tones', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['cool', 'blue'], level: 'advanced' },
  { id: 'grade-vintage-men', name: 'Vintage Film', categoryId: 'color-grading-men', icon: '📷', promptFragment: 'vintage film color grading nostalgic desaturated', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['vintage', 'film'], level: 'advanced' },
  { id: 'grade-faded-men', name: 'Faded Pastel', categoryId: 'color-grading-men', icon: '🌸', promptFragment: 'faded pastel color grading soft muted dreamy', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['faded', 'pastel'], level: 'advanced' },
  { id: 'grade-high-contrast-men', name: 'High Contrast', categoryId: 'color-grading-men', icon: '⚫⚪', promptFragment: 'high contrast color grading bold dramatic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['contrast', 'bold'], level: 'advanced' },
  { id: 'grade-matte-men', name: 'Matte Finish', categoryId: 'color-grading-men', icon: '🎬', promptFragment: 'matte finish color grading cinematic lifted blacks', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['matte', 'cinematic'], level: 'advanced' },
  { id: 'grade-vibrant-men', name: 'Vibrant Rich', categoryId: 'color-grading-men', icon: '🌈', promptFragment: 'vibrant rich color grading saturated bold', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['vibrant', 'saturated'], level: 'advanced' },
];

// ============================================
// MEN CREATIVE DIRECTION CATEGORIES
// ============================================

export const MEN_CREATIVE_DIRECTION_CATEGORIES: BlockCategory[] = [
  {
    id: 'presentation-intent-men',
    name: 'Presentation Intent',
    icon: '🎯',
    description: 'Photography purpose and style',
    order: 500,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'mood-atmosphere-men',
    name: 'Mood & Atmosphere',
    icon: '🎭',
    description: 'Emotional tone and feel',
    order: 501,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
  
  {
    id: 'jewelry-context-men',
    name: 'Jewelry Context',
    icon: '💎',
    description: 'How jewelry is featured',
    order: 502,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
];

const PRESENTATION_INTENT_MEN_BLOCKS: MicroBlock[] = [
  { id: 'intent-catalog-men', name: 'Catalog Product', categoryId: 'presentation-intent-men', icon: '📋', promptFragment: 'catalog product photography clean commercial white background', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['catalog', 'commercial'], level: 'advanced' },
  { id: 'intent-ecommerce-men', name: 'E-commerce Clean', categoryId: 'presentation-intent-men', icon: '🛍️', promptFragment: 'e-commerce clean web-ready neutral background', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['ecommerce', 'web'], level: 'advanced' },
  { id: 'intent-editorial-men', name: 'Editorial Creative', categoryId: 'presentation-intent-men', icon: '📰', promptFragment: 'editorial creative magazine artistic storytelling', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['editorial', 'artistic'], level: 'advanced' },
  { id: 'intent-lifestyle-men', name: 'Lifestyle Natural', categoryId: 'presentation-intent-men', icon: '🌟', promptFragment: 'lifestyle natural real-life moments authentic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['lifestyle', 'authentic'], level: 'advanced' },
  { id: 'intent-luxury-men', name: 'Luxury Campaign', categoryId: 'presentation-intent-men', icon: '👑', promptFragment: 'luxury campaign high-end aspirational sophisticated', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['luxury', 'high-end'], level: 'advanced' },
];

const MOOD_ATMOSPHERE_MEN_BLOCKS: MicroBlock[] = [
  { id: 'mood-powerful-men', name: 'Powerful Bold', categoryId: 'mood-atmosphere-men', icon: '💪', promptFragment: 'powerful bold atmosphere strong commanding', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['powerful', 'bold'], level: 'advanced' },
  { id: 'mood-confident-men', name: 'Confident Assured', categoryId: 'mood-atmosphere-men', icon: '😎', promptFragment: 'confident assured atmosphere self-assured masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['confident', 'assured'], level: 'advanced' },
  { id: 'mood-sophisticated-men', name: 'Sophisticated Refined', categoryId: 'mood-atmosphere-men', icon: '🎩', promptFragment: 'sophisticated refined atmosphere elegant timeless', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['sophisticated', 'elegant'], level: 'advanced' },
  { id: 'mood-rugged-men', name: 'Rugged Adventurous', categoryId: 'mood-atmosphere-men', icon: '⛰️', promptFragment: 'rugged adventurous atmosphere masculine outdoorsy', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['rugged', 'adventurous'], level: 'advanced' },
  { id: 'mood-minimalist-men', name: 'Minimalist Clean', categoryId: 'mood-atmosphere-men', icon: '🧘', promptFragment: 'minimalist clean atmosphere serene peaceful simple', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['minimalist', 'clean'], level: 'advanced' },
  { id: 'mood-edgy-men', name: 'Edgy Contemporary', categoryId: 'mood-atmosphere-men', icon: '⚡', promptFragment: 'edgy contemporary atmosphere modern rebellious', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['edgy', 'modern'], level: 'advanced' },
];

const JEWELRY_CONTEXT_MEN_BLOCKS: MicroBlock[] = [
  { id: 'context-hero-men', name: 'Jewelry Hero', categoryId: 'jewelry-context-men', icon: '💎', promptFragment: 'jewelry hero product dominates minimal model presence', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['hero', 'product'], level: 'advanced' },
  { id: 'context-balanced-men', name: 'Balanced Product+Model', categoryId: 'jewelry-context-men', icon: '⚖️', promptFragment: 'balanced product and model equal visual weight harmonious', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['balanced'], level: 'advanced' },
  { id: 'context-lifestyle-men', name: 'Lifestyle Moment', categoryId: 'jewelry-context-men', icon: '📸', promptFragment: 'lifestyle moment natural story context jewelry subtle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['lifestyle', 'story'], level: 'advanced' },
  { id: 'context-detail-men', name: 'Detail Showcase', categoryId: 'jewelry-context-men', icon: '🔍', promptFragment: 'detail showcase craftsmanship highlighted jewelry precision', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['detail', 'craftsmanship'], level: 'advanced' },
];

// ============================================
// MEN LIFESTYLE EXTRAS CATEGORIES
// ============================================

export const MEN_LIFESTYLE_EXTRAS_CATEGORIES: BlockCategory[] = [
  {
    id: 'props-accessories-men',
    name: 'Props & Accessories',
    icon: '🌸',
    description: 'Additional props and lifestyle elements',
    order: 600,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'],
    },
    required: false,
  },
];

const PROPS_ACCESSORIES_MEN_BLOCKS: MicroBlock[] = [
  // Masculine Props
  { id: 'prop-whiskey-men', name: 'Whiskey/Spirits', categoryId: 'props-accessories-men', icon: '🥃', promptFragment: 'whiskey glass spirits bottle masculine prop', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['whiskey', 'masculine'], level: 'advanced' },
  { id: 'prop-cigar-men', name: 'Cigar', categoryId: 'props-accessories-men', icon: '🚬', promptFragment: 'cigar smoke masculine sophisticated prop', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['cigar', 'sophisticated'], level: 'advanced' },
  { id: 'prop-watch-men', name: 'Luxury Watch', categoryId: 'props-accessories-men', icon: '⌚', promptFragment: 'luxury watch timepiece masculine accessory', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['watch', 'luxury'], level: 'advanced' },
  { id: 'prop-leather-men', name: 'Leather Goods', categoryId: 'props-accessories-men', icon: '👜', promptFragment: 'leather wallet briefcase bag masculine accessories', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['leather', 'accessories'], level: 'advanced' },
  { id: 'prop-tools-men', name: 'Tools/Workshop', categoryId: 'props-accessories-men', icon: '🔧', promptFragment: 'tools workshop equipment masculine rugged props', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['tools', 'rugged'], level: 'advanced' },
  { id: 'prop-books-men', name: 'Books/Reading', categoryId: 'props-accessories-men', icon: '📚', promptFragment: 'books reading material intellectual sophisticated', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['books', 'intellectual'], level: 'advanced' },
  { id: 'prop-car-keys-men', name: 'Car Keys/Auto', categoryId: 'props-accessories-men', icon: '🔑', promptFragment: 'car keys automotive elements masculine lifestyle', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['automotive', 'lifestyle'], level: 'advanced' },
  { id: 'prop-coffee-men', name: 'Coffee/Espresso', categoryId: 'props-accessories-men', icon: '☕', promptFragment: 'coffee espresso cup morning routine prop', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['coffee', 'morning'], level: 'advanced' },
  { id: 'prop-geometric-men', name: 'Minimal Geometric', categoryId: 'props-accessories-men', icon: '◇', promptFragment: 'minimal geometric shapes modern clean props', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['geometric', 'minimal'], level: 'advanced' },
  { id: 'prop-natural-men', name: 'Natural Elements', categoryId: 'props-accessories-men', icon: '🪨', promptFragment: 'natural elements stone wood earthy organic', applicableTo: { gender: ['men'], jewelryTypes: ['ring', 'necklace', 'earring', 'bracelet'] }, tags: ['natural', 'organic'], level: 'advanced' },
];

// ============================================
// AGGREGATE ALL CAMERA, POST, CREATIVE, LIFESTYLE BLOCKS
// ============================================

const MEN_CAMERA_BLOCKS: MicroBlock[] = [
  ...JEWELRY_FRAMING_MEN_BLOCKS,
  ...VIEWING_ANGLE_MEN_BLOCKS,
  ...FOCUS_DEPTH_MEN_BLOCKS,
  ...COMPOSITION_RULES_MEN_BLOCKS,
];

const MEN_POST_PRODUCTION_BLOCKS: MicroBlock[] = [
  ...PROCESSING_LEVEL_MEN_BLOCKS,
  ...COLOR_GRADING_MEN_BLOCKS,
];

const MEN_CREATIVE_DIRECTION_BLOCKS: MicroBlock[] = [
  ...PRESENTATION_INTENT_MEN_BLOCKS,
  ...MOOD_ATMOSPHERE_MEN_BLOCKS,
  ...JEWELRY_CONTEXT_MEN_BLOCKS,
];

const MEN_LIFESTYLE_EXTRAS_BLOCKS: MicroBlock[] = [
  ...PROPS_ACCESSORIES_MEN_BLOCKS,
];

// ============================================
// MEN JEWELRY-SPECIFIC CATEGORIES
// ============================================

// ===== RING-SPECIFIC =====
export const MEN_RING_CATEGORIES: BlockCategory[] = [
  {
    id: 'hand-pose-men-ring',
    name: 'Hand Pose',
    icon: '✋',
    description: 'Hand positioning for ring display',
    order: 700,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring'],
    },
    required: true,
  },
  
  {
    id: 'hand-structure-ring-men',
    name: 'Hand Structure',
    icon: '🤚',
    description: 'Hand size and build for ring',
    order: 701,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['ring'],
    },
    required: false,
  },
];

// Ring-Specific Hand Pose Blocks (Masculine)
const HAND_POSE_MEN_RING_BLOCKS: MicroBlock[] = [
  { id: 'hand-fist-men', name: 'Fist Clenched', categoryId: 'hand-pose-men-ring', icon: '✊', promptFragment: 'fist clenched powerful ring prominent masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['fist', 'powerful'], level: 'advanced' },
  { id: 'hand-relaxed-men', name: 'Relaxed Open', categoryId: 'hand-pose-men-ring', icon: '🖐️', promptFragment: 'hand relaxed open fingers spread ring visible', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['relaxed', 'open'], level: 'advanced' },
  { id: 'hand-pointing-men', name: 'Pointing Gesture', categoryId: 'hand-pose-men-ring', icon: '👉', promptFragment: 'pointing gesture index finger extended ring displayed', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['pointing', 'gesture'], level: 'advanced' },
  { id: 'hand-grip-men', name: 'Power Grip', categoryId: 'hand-pose-men-ring', icon: '💪', promptFragment: 'power grip hand gripping object ring visible strong', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['grip', 'strong'], level: 'advanced' },
  { id: 'hand-interlaced-men', name: 'Fingers Interlaced', categoryId: 'hand-pose-men-ring', icon: '🙏', promptFragment: 'fingers interlaced hands clasped rings visible', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['interlaced', 'clasped'], level: 'advanced' },
  { id: 'hand-steering-men', name: 'Steering Wheel Grip', categoryId: 'hand-pose-men-ring', icon: '🚗', promptFragment: 'hand gripping steering wheel ring visible masculine lifestyle', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['steering', 'lifestyle'], level: 'advanced' },
  { id: 'hand-chin-men', name: 'Hand to Chin', categoryId: 'hand-pose-men-ring', icon: '🤔', promptFragment: 'hand touching chin contemplative ring near face', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['chin', 'contemplative'], level: 'advanced' },
  { id: 'hand-pocket-men', name: 'Hand in Pocket', categoryId: 'hand-pose-men-ring', icon: '👖', promptFragment: 'hand in pocket casual ring visible relaxed', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['pocket', 'casual'], level: 'advanced' },
  { id: 'hand-watch-adjust-men', name: 'Adjusting Watch', categoryId: 'hand-pose-men-ring', icon: '⌚', promptFragment: 'hand adjusting watch ring and watch together luxury', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['watch', 'luxury'], level: 'advanced' },
  { id: 'hand-glass-hold-men', name: 'Holding Glass', categoryId: 'hand-pose-men-ring', icon: '🥃', promptFragment: 'hand holding whiskey glass ring visible sophisticated', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['glass', 'sophisticated'], level: 'advanced' },
  { id: 'hand-tool-grip-men', name: 'Tool Grip', categoryId: 'hand-pose-men-ring', icon: '🔧', promptFragment: 'hand gripping tool working hands ring visible rugged', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['tool', 'rugged'], level: 'advanced' },
  { id: 'hand-steepled-men', name: 'Steepled Fingers', categoryId: 'hand-pose-men-ring', icon: '🙇', promptFragment: 'steepled fingers contemplative ring visible powerful', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['steepled', 'powerful'], level: 'advanced' },
  { id: 'hand-cigar-men', name: 'Holding Cigar', categoryId: 'hand-pose-men-ring', icon: '🚬', promptFragment: 'hand holding cigar ring visible sophisticated masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['cigar', 'sophisticated'], level: 'advanced' },
  { id: 'hand-keys-men', name: 'Holding Keys', categoryId: 'hand-pose-men-ring', icon: '🔑', promptFragment: 'hand holding car keys ring visible lifestyle', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['keys', 'lifestyle'], level: 'advanced' },
  { id: 'hand-crossed-arms-men', name: 'Arms Crossed', categoryId: 'hand-pose-men-ring', icon: '🙅', promptFragment: 'arms crossed hands visible ring confident pose', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['crossed', 'confident'], level: 'advanced' },
];

const HAND_STRUCTURE_RING_MEN_BLOCKS: MicroBlock[] = [
  { id: 'hand-struct-large-men', name: 'Large Masculine', categoryId: 'hand-structure-ring-men', icon: '🤚', promptFragment: 'large masculine hands broad powerful', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['large', 'masculine'], level: 'advanced' },
  { id: 'hand-struct-athletic-men', name: 'Athletic Strong', categoryId: 'hand-structure-ring-men', icon: '💪', promptFragment: 'athletic strong hands defined muscular', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['athletic', 'strong'], level: 'advanced' },
  { id: 'hand-struct-refined-men', name: 'Refined Elegant', categoryId: 'hand-structure-ring-men', icon: '✨', promptFragment: 'refined elegant hands groomed sophisticated', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['refined', 'elegant'], level: 'advanced' },
  { id: 'hand-struct-rugged-men', name: 'Rugged Working', categoryId: 'hand-structure-ring-men', icon: '🔨', promptFragment: 'rugged working hands calloused strong masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['rugged', 'working'], level: 'advanced' },
  { id: 'hand-struct-veiny-men', name: 'Veiny Athletic', categoryId: 'hand-structure-ring-men', icon: '🫀', promptFragment: 'veiny athletic hands prominent veins masculine', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['veiny', 'athletic'], level: 'advanced' },
  { id: 'hand-struct-slender-men', name: 'Slender Artistic', categoryId: 'hand-structure-ring-men', icon: '🎨', promptFragment: 'slender artistic hands long fingers refined', applicableTo: { gender: ['men'], jewelryTypes: ['ring'] }, tags: ['slender', 'artistic'], level: 'advanced' },
];

// ===== NECKLACE-SPECIFIC =====
export const MEN_NECKLACE_CATEGORIES: BlockCategory[] = [
  {
    id: 'neck-pose-men-necklace',
    name: 'Neck/Head Pose',
    icon: '👤',
    description: 'Neck and head positioning',
    order: 710,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['necklace'],
    },
    required: true,
  },
  
  {
    id: 'chest-presentation-men',
    name: 'Chest Presentation',
    icon: '🫁',
    description: 'Chest area styling and visibility',
    order: 711,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['necklace'],
    },
    required: false,
  },
  
  {
    id: 'shirt-opening-men',
    name: 'Shirt Opening',
    icon: '👔',
    description: 'How shirt is worn/opened',
    order: 712,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['necklace'],
    },
    required: false,
  },
];

const NECK_POSE_MEN_NECKLACE_BLOCKS: MicroBlock[] = [
  { id: 'neck-straight-men', name: 'Straight Forward', categoryId: 'neck-pose-men-necklace', icon: '⬆️', promptFragment: 'neck straight forward head level necklace centered', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['straight', 'forward'], level: 'advanced' },
  { id: 'neck-tilted-men', name: 'Head Tilted', categoryId: 'neck-pose-men-necklace', icon: '↗️', promptFragment: 'head tilted angle neck visible necklace displayed', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['tilted', 'angle'], level: 'advanced' },
  { id: 'neck-profile-men', name: 'Profile Side', categoryId: 'neck-pose-men-necklace', icon: '↔️', promptFragment: 'profile side view neck line visible necklace prominent', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['profile', 'side'], level: 'advanced' },
  { id: 'neck-looking-down-men', name: 'Looking Down', categoryId: 'neck-pose-men-necklace', icon: '⬇️', promptFragment: 'looking down neck curved necklace falls naturally', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['down', 'curved'], level: 'advanced' },
  { id: 'neck-looking-up-men', name: 'Looking Up', categoryId: 'neck-pose-men-necklace', icon: '⬆️', promptFragment: 'looking up neck extended necklace stretched visible', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['up', 'extended'], level: 'advanced' },
];

const CHEST_PRESENTATION_MEN_BLOCKS: MicroBlock[] = [
  { id: 'chest-bare-men', name: 'Bare Chest', categoryId: 'chest-presentation-men', icon: '🫁', promptFragment: 'bare chest shirtless necklace on skin masculine', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['bare', 'shirtless'], level: 'advanced' },
  { id: 'chest-hair-visible-men', name: 'Chest Hair Visible', categoryId: 'chest-presentation-men', icon: '🐻', promptFragment: 'chest hair visible masculine necklace resting on hair', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['chest-hair', 'masculine'], level: 'advanced' },
  { id: 'chest-smooth-men', name: 'Smooth Chest', categoryId: 'chest-presentation-men', icon: '✨', promptFragment: 'smooth chest hairless clean necklace on skin', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['smooth', 'clean'], level: 'advanced' },
  { id: 'chest-athletic-men', name: 'Athletic Defined', categoryId: 'chest-presentation-men', icon: '💪', promptFragment: 'athletic defined chest muscular necklace on pecs', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['athletic', 'muscular'], level: 'advanced' },
  { id: 'chest-covered-men', name: 'Fully Covered', categoryId: 'chest-presentation-men', icon: '👔', promptFragment: 'chest fully covered shirt buttoned necklace over clothing', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['covered', 'formal'], level: 'advanced' },
];

const SHIRT_OPENING_MEN_BLOCKS: MicroBlock[] = [
  { id: 'shirt-fully-open-men', name: 'Fully Open', categoryId: 'shirt-opening-men', icon: '📖', promptFragment: 'shirt fully open unbuttoned chest exposed necklace visible', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['open', 'unbuttoned'], level: 'advanced' },
  { id: 'shirt-half-open-men', name: 'Half Unbuttoned', categoryId: 'shirt-opening-men', icon: '🔓', promptFragment: 'shirt half unbuttoned 3-4 buttons open necklace partially visible', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['half-open', 'casual'], level: 'advanced' },
  { id: 'shirt-top-button-men', name: 'Top Button Open', categoryId: 'shirt-opening-men', icon: '🔘', promptFragment: 'shirt top button unbuttoned relaxed necklace peek', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['top-button', 'relaxed'], level: 'advanced' },
  { id: 'shirt-vneck-men', name: 'V-Neck Tee', categoryId: 'shirt-opening-men', icon: '🔻', promptFragment: 'V-neck t-shirt deep V necklace visible casual', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['v-neck', 'casual'], level: 'advanced' },
  { id: 'shirt-tank-men', name: 'Tank Top', categoryId: 'shirt-opening-men', icon: '🎽', promptFragment: 'tank top athletic wear necklace fully visible', applicableTo: { gender: ['men'], jewelryTypes: ['necklace'] }, tags: ['tank', 'athletic'], level: 'advanced' },
];

// ===== EARRING-SPECIFIC =====
export const MEN_EARRING_CATEGORIES: BlockCategory[] = [
  {
    id: 'head-position-men-earring',
    name: 'Head Position',
    icon: '👤',
    description: 'Head angle for earring visibility',
    order: 720,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['earring'],
    },
    required: true,
  },
  
  {
    id: 'hair-position-men-earring',
    name: 'Hair Position',
    icon: '💈',
    description: 'Hair arrangement around ears',
    order: 721,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['earring'],
    },
    required: false,
  },
];

const HEAD_POSITION_MEN_EARRING_BLOCKS: MicroBlock[] = [
  { id: 'head-straight-earring-men', name: 'Straight Forward', categoryId: 'head-position-men-earring', icon: '⬆️', promptFragment: 'head straight forward both ears visible earrings displayed', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['straight', 'forward'], level: 'advanced' },
  { id: 'head-profile-left-men', name: 'Profile Left', categoryId: 'head-position-men-earring', icon: '⬅️', promptFragment: 'head profile left side single ear prominent earring visible', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['profile', 'left'], level: 'advanced' },
  { id: 'head-profile-right-men', name: 'Profile Right', categoryId: 'head-position-men-earring', icon: '➡️', promptFragment: 'head profile right side single ear prominent earring visible', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['profile', 'right'], level: 'advanced' },
  { id: 'head-three-quarter-men', name: 'Three-Quarter', categoryId: 'head-position-men-earring', icon: '↗️', promptFragment: 'three-quarter view angle showing ear earring displayed', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['three-quarter'], level: 'advanced' },
];

const HAIR_POSITION_MEN_EARRING_BLOCKS: MicroBlock[] = [
  { id: 'hair-short-crop-men', name: 'Short Crop', categoryId: 'hair-position-men-earring', icon: '✂️', promptFragment: 'short cropped hair ears fully exposed earring visible', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['short', 'exposed'], level: 'advanced' },
  { id: 'hair-buzz-cut-men', name: 'Buzz Cut', categoryId: 'hair-position-men-earring', icon: '🪒', promptFragment: 'buzz cut very short ears completely visible earring prominent', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['buzz', 'exposed'], level: 'advanced' },
  { id: 'hair-slicked-back-men', name: 'Slicked Back', categoryId: 'hair-position-men-earring', icon: '💼', promptFragment: 'hair slicked back ears exposed earring visible clean', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['slicked', 'clean'], level: 'advanced' },
  { id: 'hair-undercut-men', name: 'Undercut', categoryId: 'hair-position-men-earring', icon: '✂️', promptFragment: 'undercut short sides ears visible earring displayed', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['undercut', 'visible'], level: 'advanced' },
  { id: 'hair-bald-men', name: 'Bald/Shaved', categoryId: 'hair-position-men-earring', icon: '🪒', promptFragment: 'bald shaved head ears fully visible earring prominent', applicableTo: { gender: ['men'], jewelryTypes: ['earring'] }, tags: ['bald', 'exposed'], level: 'advanced' },
];

// ===== BRACELET-SPECIFIC =====
export const MEN_BRACELET_CATEGORIES: BlockCategory[] = [
  {
    id: 'wrist-pose-men-bracelet',
    name: 'Wrist Pose',
    icon: '🤚',
    description: 'Wrist positioning and gestures',
    order: 730,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['bracelet'],
    },
    required: true,
  },
  
  {
    id: 'arm-position-men-bracelet',
    name: 'Arm Position',
    icon: '💪',
    description: 'Overall arm positioning',
    order: 731,
    applicableTo: {
      gender: ['men'],
      jewelryTypes: ['bracelet'],
    },
    required: false,
  },
];

const WRIST_POSE_MEN_BRACELET_BLOCKS: MicroBlock[] = [
  { id: 'wrist-steering-men', name: 'Steering Wheel', categoryId: 'wrist-pose-men-bracelet', icon: '🚗', promptFragment: 'wrist on steering wheel driving bracelet visible masculine', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['steering', 'driving'], level: 'advanced' },
  { id: 'wrist-watch-check-men', name: 'Checking Watch', categoryId: 'wrist-pose-men-bracelet', icon: '⌚', promptFragment: 'wrist raised checking watch bracelet and watch together', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['watch', 'checking'], level: 'advanced' },
  { id: 'wrist-relaxed-men', name: 'Relaxed Down', categoryId: 'wrist-pose-men-bracelet', icon: '🤚', promptFragment: 'wrist relaxed down arm hanging naturally bracelet visible', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['relaxed', 'natural'], level: 'advanced' },
  { id: 'wrist-crossed-arms-men', name: 'Arms Crossed', categoryId: 'wrist-pose-men-bracelet', icon: '🙅', promptFragment: 'arms crossed wrists visible bracelet displayed confident', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['crossed', 'confident'], level: 'advanced' },
  { id: 'wrist-pocket-men', name: 'Hand in Pocket', categoryId: 'wrist-pose-men-bracelet', icon: '👖', promptFragment: 'hand in pocket wrist edge visible bracelet peek casual', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['pocket', 'casual'], level: 'advanced' },
  { id: 'wrist-grip-men', name: 'Power Grip', categoryId: 'wrist-pose-men-bracelet', icon: '💪', promptFragment: 'wrist gripping object power grip bracelet visible strong', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['grip', 'strong'], level: 'advanced' },
  { id: 'wrist-tool-hold-men', name: 'Holding Tool', categoryId: 'wrist-pose-men-bracelet', icon: '🔧', promptFragment: 'wrist holding tool working hands bracelet visible rugged', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['tool', 'rugged'], level: 'advanced' },
  { id: 'wrist-glass-hold-men', name: 'Holding Glass', categoryId: 'wrist-pose-men-bracelet', icon: '🥃', promptFragment: 'wrist holding whiskey glass bracelet visible sophisticated', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['glass', 'sophisticated'], level: 'advanced' },
  { id: 'wrist-extended-men', name: 'Extended Forward', categoryId: 'wrist-pose-men-bracelet', icon: '👉', promptFragment: 'wrist extended forward arm outstretched bracelet displayed', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['extended', 'forward'], level: 'advanced' },
  { id: 'wrist-flexed-men', name: 'Wrist Flexed', categoryId: 'wrist-pose-men-bracelet', icon: '💪', promptFragment: 'wrist flexed hand up bracelet sliding down forearm', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['flexed', 'muscular'], level: 'advanced' },
];

const ARM_POSITION_MEN_BRACELET_BLOCKS: MicroBlock[] = [
  { id: 'arm-vertical-men', name: 'Vertical Down', categoryId: 'arm-position-men-bracelet', icon: '⬇️', promptFragment: 'arm vertical down natural hanging bracelet visible', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['vertical', 'down'], level: 'advanced' },
  { id: 'arm-horizontal-men', name: 'Horizontal Extended', categoryId: 'arm-position-men-bracelet', icon: '↔️', promptFragment: 'arm horizontal extended across bracelet displayed', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['horizontal'], level: 'advanced' },
  { id: 'arm-bent-90-men', name: 'Bent 90°', categoryId: 'arm-position-men-bracelet', icon: '💪', promptFragment: 'arm bent 90 degrees wrist at chest level bracelet visible', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['bent', '90-degree'], level: 'advanced' },
  { id: 'arm-overhead-men', name: 'Overhead Raised', categoryId: 'arm-position-men-bracelet', icon: '🙌', promptFragment: 'arm raised overhead wrist elevated bracelet sliding', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['overhead', 'raised'], level: 'advanced' },
  { id: 'arm-resting-men', name: 'Resting on Surface', categoryId: 'arm-position-men-bracelet', icon: '🪑', promptFragment: 'arm resting on table surface wrist relaxed bracelet visible', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['resting', 'surface'], level: 'advanced' },
  { id: 'arm-behind-head-men', name: 'Behind Head', categoryId: 'arm-position-men-bracelet', icon: '🙆', promptFragment: 'arm behind head relaxed pose wrist visible bracelet displayed', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['behind', 'relaxed'], level: 'advanced' },
  { id: 'arm-flexed-men', name: 'Flexed Muscular', categoryId: 'arm-position-men-bracelet', icon: '💪', promptFragment: 'arm flexed muscles visible bracelet on forearm athletic', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['flexed', 'muscular'], level: 'advanced' },
  { id: 'arm-leaning-men', name: 'Leaning on Wall', categoryId: 'arm-position-men-bracelet', icon: '🧱', promptFragment: 'arm leaning on wall casual pose wrist visible bracelet', applicableTo: { gender: ['men'], jewelryTypes: ['bracelet'] }, tags: ['leaning', 'casual'], level: 'advanced' },
];

// ============================================
// AGGREGATE JEWELRY-SPECIFIC BLOCKS
// ============================================

const MEN_RING_BLOCKS: MicroBlock[] = [
  ...HAND_POSE_MEN_RING_BLOCKS,
  ...HAND_STRUCTURE_RING_MEN_BLOCKS,
];

const MEN_NECKLACE_BLOCKS: MicroBlock[] = [
  ...NECK_POSE_MEN_NECKLACE_BLOCKS,
  ...CHEST_PRESENTATION_MEN_BLOCKS,
  ...SHIRT_OPENING_MEN_BLOCKS,
];

const MEN_EARRING_BLOCKS: MicroBlock[] = [
  ...HEAD_POSITION_MEN_EARRING_BLOCKS,
  ...HAIR_POSITION_MEN_EARRING_BLOCKS,
];

const MEN_BRACELET_BLOCKS: MicroBlock[] = [
  ...WRIST_POSE_MEN_BRACELET_BLOCKS,
  ...ARM_POSITION_MEN_BRACELET_BLOCKS,
];

// ============================================
// EXPORT ALL MEN CATEGORIES & BLOCKS
// ============================================

export const MEN_ALL_CATEGORIES: BlockCategory[] = [
  ...MEN_UNIVERSAL_CATEGORIES,
  ...MEN_STYLING_CATEGORIES,
  ...MEN_ENVIRONMENT_CATEGORIES,
  ...MEN_CAMERA_CATEGORIES,
  ...MEN_POST_PRODUCTION_CATEGORIES,
  ...MEN_CREATIVE_DIRECTION_CATEGORIES,
  ...MEN_LIFESTYLE_EXTRAS_CATEGORIES,
  ...MEN_RING_CATEGORIES,
  ...MEN_NECKLACE_CATEGORIES,
  ...MEN_EARRING_CATEGORIES,
  ...MEN_BRACELET_CATEGORIES,
];

export const MEN_ALL_BLOCKS: MicroBlock[] = [
  ...MEN_UNIVERSAL_BLOCKS,
  ...MEN_STYLING_BLOCKS,
  ...MEN_ENVIRONMENT_BLOCKS,
  ...MEN_CAMERA_BLOCKS,
  ...MEN_POST_PRODUCTION_BLOCKS,
  ...MEN_CREATIVE_DIRECTION_BLOCKS,
  ...MEN_LIFESTYLE_EXTRAS_BLOCKS,
  ...MEN_RING_BLOCKS,
  ...MEN_NECKLACE_BLOCKS,
  ...MEN_EARRING_BLOCKS,
  ...MEN_BRACELET_BLOCKS,
];

