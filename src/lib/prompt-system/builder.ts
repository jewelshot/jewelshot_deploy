/**
 * Prompt Builder
 * 
 * Builds final prompt from selected micro blocks
 */

import { MicroBlock, BlockSelections, BlockContext } from './types';

/**
 * Category to Group Mapping
 * Maps individual categories to their parent groups for compact JSON output
 */
export const CATEGORY_GROUPS: Record<string, string> = {
  // Hair group
  'hair-length': 'hair',
  'hair-style': 'hair',
  'hair-texture': 'hair',
  'hair-color': 'hair',
  'hair-volume': 'hair',
  
  // Nails group
  'nail-type': 'nails',
  'nail-color': 'nails',
  
  // Face group (all facial features)
  'race-ethnicity': 'face',
  'face-shape': 'face',
  'eye-color': 'face',
  'eye-type': 'face',
  'eyebrow-style': 'face',
  'eyelash': 'face',
  'nose-type': 'face',
  'lip-type': 'face',
  'lip-color': 'face',
  'cheekbones': 'face',
  'chin-type': 'face',
  
  // Hand group (ring-specific)
  'hand-pose': 'hand',
  'hand-structure': 'hand',
  
  // Head group (earring-specific)
  'head-position': 'head',
  'hair-position': 'head',
  
  // Arm group (bracelet-specific)
  'wrist-pose': 'arm',
  'arm-position': 'arm',
  
  // Necklace styling group
  'neckline': 'necklace-styling',
  'decolletage': 'necklace-styling',
  'shoulder-position': 'necklace-styling',
  'collarbone': 'necklace-styling',
  
  // Bracelet styling group
  'sleeve-type': 'bracelet-styling',
  'wrist-exposure': 'bracelet-styling',
  
  // Singular categories (no grouping)
  'skin-tone': 'skin',
  'makeup': 'makeup',
  'expression': 'expression',
  'neck-pose': 'neck',
};

export class PromptBuilder {
  private fragments: string[] = [];
  
  /**
   * Add core subject
   */
  addCore(subject: string): this {
    this.fragments.push(subject);
    return this;
  }
  
  /**
   * Add preservation rules (always included)
   */
  addPreservation(): this {
    this.fragments.push(
      `CRITICAL PRESERVATION - ZERO TOLERANCE:
EXACT jewelry structure geometry shape form UNCHANGED pixel-perfect
EXACT gemstone count size position cut NO additions NO removals NO moves
EXACT setting prongs bezels channels metal work UNCHANGED
ONLY lighting background context change JEWELRY DESIGN 100% UNTOUCHED`
    );
    return this;
  }
  
  /**
   * Add a single block's prompt fragment
   */
  addBlock(block: MicroBlock): this {
    if (block.promptFragment) {
      this.fragments.push(block.promptFragment);
    }
    return this;
  }
  
  /**
   * Add multiple blocks
   */
  addBlocks(blocks: MicroBlock[]): this {
    blocks.forEach(block => this.addBlock(block));
    return this;
  }
  
  /**
   * Add quality and technical specs
   */
  addQuality(aspectRatio: string = '9:16'): this {
    this.fragments.push(
      `Quality: Ultra-sharp 300DPI professional catalog-grade
Aspect ratio: ${aspectRatio}`
    );
    return this;
  }
  
  /**
   * Build final prompt
   */
  build(): string {
    return this.fragments.filter(Boolean).join('\n\n');
  }
  
  /**
   * Reset builder
   */
  reset(): this {
    this.fragments = [];
    return this;
  }
}

/**
 * Build prompt from block selections
 */
export function buildPromptFromSelections(
  context: BlockContext,
  selections: BlockSelections,
  allBlocks: MicroBlock[],
  aspectRatio: string = '9:16'
): string {
  const builder = new PromptBuilder();
  
  // Core subject
  builder.addCore(
    `Professional ${context.gender}'s ${context.jewelryType} photography`
  );
  
  // Preservation rules
  builder.addPreservation();
  
  // Add selected blocks
  Object.values(selections).forEach(blockId => {
    const block = allBlocks.find(b => b.id === blockId);
    if (block) {
      builder.addBlock(block);
    }
  });
  
  // Quality
  builder.addQuality(aspectRatio);
  
  return builder.build();
}

/**
 * Build grouped JSON from block selections
 * Groups related categories together (e.g., all hair-* → "hair")
 */
export function buildGroupedJSON(
  context: BlockContext,
  selections: BlockSelections,
  allBlocks: MicroBlock[]
): Record<string, any> {
  const grouped: Record<string, any> = {
    context: {
      gender: context.gender,
      jewelryType: context.jewelryType,
    },
  };
  
  // Group prompt fragments by their parent group
  const groups: Record<string, string[]> = {};
  
  Object.entries(selections).forEach(([categoryId, blockId]) => {
    const block = allBlocks.find(b => b.id === blockId);
    if (!block) return;
    
    // Get the group name for this category
    const groupName = CATEGORY_GROUPS[categoryId] || categoryId;
    
    // Initialize group array if needed
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    
    // Add prompt fragment to group
    groups[groupName].push(block.promptFragment);
  });
  
  // Combine grouped fragments
  Object.entries(groups).forEach(([groupName, fragments]) => {
    if (fragments.length === 1) {
      // Single fragment - just use it
      grouped[groupName] = fragments[0];
    } else {
      // Multiple fragments - join with comma
      grouped[groupName] = fragments.join(', ');
    }
  });
  
  return grouped;
}

