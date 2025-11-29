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
// AGGREGATE ALL MEN BLOCKS
// ============================================

export const MEN_ALL_BLOCKS: MicroBlock[] = [
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

// Export all categories
export const MEN_ALL_CATEGORIES: BlockCategory[] = [
  ...MEN_UNIVERSAL_CATEGORIES,
];

