/**
 * Block Registry
 * 
 * Central registry for all micro blocks and categories
 */

import { BlockCategory, MicroBlock, BlockContext } from './types';
import { WOMEN_RING_CATEGORIES, WOMEN_RING_BLOCKS } from './blocks/women-ring';
import { MEN_RING_CATEGORIES, MEN_RING_BLOCKS } from './blocks/men-ring';
import { WOMEN_NECKLACE_CATEGORIES, WOMEN_NECKLACE_BLOCKS } from './blocks/women-necklace';

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
    // Women + Ring
    WOMEN_RING_CATEGORIES.forEach(c => this.categories.set(c.id, c));
    WOMEN_RING_BLOCKS.forEach(b => this.blocks.set(b.id, b));
    
    // Men + Ring
    MEN_RING_CATEGORIES.forEach(c => this.categories.set(c.id, c));
    MEN_RING_BLOCKS.forEach(b => this.blocks.set(b.id, b));
    
    // Women + Necklace
    WOMEN_NECKLACE_CATEGORIES.forEach(c => this.categories.set(c.id, c));
    WOMEN_NECKLACE_BLOCKS.forEach(b => this.blocks.set(b.id, b));
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

