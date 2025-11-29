/**
 * Prompt Builder
 * 
 * Builds final prompt from selected micro blocks
 */

import { MicroBlock, BlockSelections, BlockContext } from './types';

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

