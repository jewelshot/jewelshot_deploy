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
// EXPORT ALL MEN CATEGORIES & BLOCKS
// ============================================

export const MEN_ALL_CATEGORIES: BlockCategory[] = [
  ...MEN_UNIVERSAL_CATEGORIES,
  ...MEN_STYLING_CATEGORIES,
];

export const MEN_ALL_BLOCKS: MicroBlock[] = [
  ...MEN_UNIVERSAL_BLOCKS,
  ...MEN_STYLING_BLOCKS,
];

