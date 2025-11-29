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

