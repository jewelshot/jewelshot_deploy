/**
 * Block Registry
 * 
 * Central registry for all micro blocks and categories
 */

import { BlockCategory, MicroBlock, BlockContext } from './types';
import { 
  WOMEN_ALL_CATEGORIES,
  WOMEN_UNIVERSAL_CATEGORIES,
  WOMEN_RING_CATEGORIES,
  WOMEN_NECKLACE_CATEGORIES,
  WOMEN_EARRING_CATEGORIES,
  WOMEN_BRACELET_CATEGORIES,
  WOMEN_ALL_BLOCKS 
} from './blocks/women-all';
import {
  MEN_ALL_CATEGORIES,
  MEN_ALL_BLOCKS
} from './blocks/men-all';

// ============================================
// REGISTRY
// ============================================

export class BlockRegistry {
  private categories: Map<string, BlockCategory> = new Map();
  private blocks: Map<string, MicroBlock> = new Map();
  
  constructor() {
    this.registerAll();
  }
  
  private registerAll() {
    // Register all women blocks
    WOMEN_ALL_CATEGORIES.forEach(c => this.categories.set(c.id, c));
    WOMEN_ALL_BLOCKS.forEach(b => this.blocks.set(b.id, b));
    
    // Register all men blocks
    MEN_ALL_CATEGORIES.forEach(c => this.categories.set(c.id, c));
    MEN_ALL_BLOCKS.forEach(b => this.blocks.set(b.id, b));
  }
  
  /**
   * Get all categories (no filtering)
   */
  getAllCategories(): BlockCategory[] {
    return Array.from(this.categories.values())
      .sort((a, b) => a.order - b.order);
  }
  
  /**
   * Get all categories applicable to context
   */
  getCategories(context: BlockContext): BlockCategory[] {
    return Array.from(this.categories.values())
      .filter(category => this.isCategoryApplicable(category, context))
      .sort((a, b) => a.order - b.order);
  }
  
  /**
   * Get all blocks applicable to context
   */
  getBlocks(context: BlockContext): MicroBlock[] {
    return Array.from(this.blocks.values())
      .filter(block => this.isBlockApplicable(block, context));
  }
  
  /**
   * Get blocks for a specific category
   */
  getBlocksByCategory(categoryId: string, context: BlockContext): MicroBlock[] {
    return this.getBlocks(context).filter(block => block.categoryId === categoryId);
  }
  
  /**
   * Get a single block by ID
   */
  getBlock(id: string): MicroBlock | undefined {
    return this.blocks.get(id);
  }
  
  /**
   * Check if category is applicable
   */
  private isCategoryApplicable(category: BlockCategory, context: BlockContext): boolean {
    const genderMatch = category.applicableTo.gender.includes(context.gender);
    const jewelryMatch = category.applicableTo.jewelryTypes.includes(context.jewelryType);
    return genderMatch && jewelryMatch;
  }
  
  /**
   * Check if block is applicable
   */
  private isBlockApplicable(block: MicroBlock, context: BlockContext): boolean {
    const genderMatch = block.applicableTo.gender.includes(context.gender);
    const jewelryMatch = block.applicableTo.jewelryTypes.includes(context.jewelryType);
    
    // Check conflicts
    if (context.selectedBlocks && block.conflictsWith) {
      const hasConflict = context.selectedBlocks.some(
        selected => block.conflictsWith?.includes(selected)
      );
      if (hasConflict) return false;
    }
    
    return genderMatch && jewelryMatch;
  }
}

// Global registry instance
export const BLOCK_REGISTRY = new BlockRegistry();

