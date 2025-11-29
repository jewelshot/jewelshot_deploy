/**
 * Prompt System Types
 * 
 * Core type definitions for atomic block system
 * Used in experimental Advanced Mode
 */

export type Gender = 'women' | 'men';
export type JewelryType = 'ring' | 'necklace' | 'bracelet' | 'earring';

export type PromptLevel = 'selective' | 'advanced';

/**
 * Context for block filtering
 */
export interface BlockContext {
  gender: Gender;
  jewelryType: JewelryType;
  selectedBlocks?: string[];
}

/**
 * Block Category (high-level grouping)
 * Example: "Hand Pose", "Nail Type", "Lighting"
 */
/**
 * Clothing constraints - what each clothing type allows/disallows
 */
export interface ClothingConstraints {
  // Allowed neckline IDs for this clothing
  allowedNecklines?: string[];
  // Disallowed neckline IDs
  disallowedNecklines?: string[];
  // Allowed sleeve IDs
  allowedSleeves?: string[];
  // Forced sleeve type (auto-selected, user can't change)
  forcedSleeve?: string;
  // Allowed shoulder positions
  allowedShoulders?: string[];
  // Disallowed shoulder positions
  disallowedShoulders?: string[];
}

export interface BlockCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  
  // When is this category applicable?
  applicableTo: {
    gender: Gender[];
    jewelryTypes: JewelryType[];
  };
  
  // Is this category required or optional?
  required?: boolean;
  
  // Is this category conditional (hidden until user toggles)?
  conditional?: boolean;
  
  // Which block IDs trigger auto-show for this conditional category?
  autoShowTriggers?: string[];
  
  // Is this a face detail category? (for toggle grouping)
  isFaceDetail?: boolean;
  
  // Parent group for JSON output (e.g., 'hair', 'face', 'necklace-styling')
  parentGroup?: string;
}

/**
 * MicroBlock with conflict detection support
 */
export interface MicroBlockWithConstraints extends MicroBlock {
  // Clothing constraints (only for clothing-type blocks)
  constraints?: ClothingConstraints;
}

/**
 * Individual Micro Block (selectable option)
 * Example: "Elegant Hand Pose", "French Manicure"
 */
export interface MicroBlock {
  id: string;
  name: string;
  description?: string;
  
  // Which category does this belong to?
  categoryId: string;
  
  // Visual representation
  thumbnail?: string;
  icon?: string;
  
  // The actual prompt fragment
  promptFragment: string;
  
  // When is this block applicable?
  applicableTo: {
    gender: Gender[];
    jewelryTypes: JewelryType[];
  };
  
  // Conflicts with other blocks (mutual exclusion)
  conflictsWith?: string[];
  
  // Tags for search/filter
  tags: string[];
  
  // Complexity level
  level: PromptLevel;
}

/**
 * User's block selections
 */
export interface BlockSelections {
  [categoryId: string]: string; // categoryId -> blockId
}

/**
 * Custom preset created from blocks
 */
export interface CustomPreset {
  id: string;
  name: string;
  thumbnail?: string;
  
  // Context
  gender: Gender;
  jewelryType: JewelryType;
  
  // Block selections
  selections: BlockSelections;
  
  // Metadata
  createdAt: number;
  updatedAt?: number;
  usageCount: number;
  isFavorite: boolean;
}

