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
  // Hair group (Men & Women)
  'hair-length': 'hair',
  'hair-style': 'hair',
  'hair-texture': 'hair',
  'hair-color': 'hair',
  'hair-volume': 'hair',
  
  // Facial Hair group (Men only)
  'beard-style': 'facial-hair',
  'beard-length': 'facial-hair',
  'beard-color': 'facial-hair',
  'mustache-style': 'facial-hair',
  
  // Body Hair group (Men only)
  'chest-hair': 'body-hair',
  'arm-hair': 'body-hair',
  
  // Masculine Features group (Men only)
  'jawline': 'masculine-features',
  'adams-apple': 'masculine-features',
  'cheekbones-men': 'masculine-features',
  'brow-ridge': 'masculine-features',
  
  // Hand Details (Men)
  'vein-prominence': 'hand-details',
  'hand-structure-men': 'hand-details',
  'hand-texture': 'hand-details',
  
  // Nails group
  'nail-type': 'nails',
  'nail-color': 'nails',
  'nail-type-men': 'nails',
  
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
  'ear-visibility': 'head',
  
  // Arm group (bracelet-specific)
  'wrist-pose': 'arm',
  'arm-position': 'arm',
  
  // Necklace styling group
  'neckline': 'necklace-styling',
  'decolletage': 'necklace-styling',
  'shoulder-position': 'necklace-styling',
  'collarbone': 'necklace-styling',
  'chest-presentation': 'necklace-styling',
  'chain-positioning': 'necklace-styling',
  
  // Bracelet styling group
  'sleeve-type': 'bracelet-styling',
  'wrist-exposure': 'bracelet-styling',
  
  // Styling groups (Women)
  'clothing-type': 'clothing-type',
  'upper-clothing': 'styling-upper',
  'upper-color': 'styling-upper',
  'lower-clothing': 'styling-lower',
  'lower-color': 'styling-lower',
  
  // Styling groups (Men)
  'upper-clothing-men': 'styling-upper',
  'neckline-opening-men': 'styling-upper',
  'collar-type-men': 'styling-upper',
  'fit-style-men': 'styling-upper',
  'sleeve-style-men': 'styling-upper',
  'upper-pattern-men': 'styling-upper',
  'upper-color-men': 'styling-upper',
  'lower-clothing-men': 'styling-lower',
  'lower-color-men': 'styling-lower',
  
  // Environment groups (Women)
  'location-background': 'location',
  'lighting': 'lighting',
  
  // Environment groups (Men)
  'location-background-men': 'location',
  'lighting-men': 'lighting',
  
  // Camera groups (Women)
  'jewelry-framing': 'framing',
  'viewing-angle': 'angle',
  'focus-depth': 'focus',
  'composition-rules': 'composition',
  
  // Camera groups (Men)
  'jewelry-framing-men': 'framing',
  'viewing-angle-men': 'angle',
  'focus-depth-men': 'focus',
  'composition-rules-men': 'composition',
  
  // Post-production groups (Women)
  'post-processing-level': 'processing',
  'color-grading': 'grading',
  
  // Post-production groups (Men)
  'post-processing-level-men': 'processing',
  'color-grading-men': 'grading',
  
  // Creative direction groups (Women)
  'presentation-intent': 'intent',
  'mood-atmosphere': 'mood',
  'jewelry-context': 'context',
  
  // Creative direction groups (Men)
  'presentation-intent-men': 'intent',
  'mood-atmosphere-men': 'mood',
  'jewelry-context-men': 'context',
  
  // Lifestyle extras (Women)
  'props-accessories': 'props',
  
  // Lifestyle extras (Men)
  'props-accessories-men': 'props',
  
  // Singular categories (no grouping)
  'skin-tone': 'skin',
  'makeup': 'makeup',
  'expression': 'expression',
  'expression-men': 'expression',
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
 * New structure: Gender → Model → Styling → Jewelry Type → Jewelry-Specific
 */
export function buildGroupedJSON(
  context: BlockContext,
  selections: BlockSelections,
  allBlocks: MicroBlock[]
): Record<string, any> {
  const json: Record<string, any> = {
    gender: context.gender,
    model: {},
    styling: {},
    environment: {},
    camera: {},
    'post-production': {},
    'creative-direction': {},
    'lifestyle-extras': {},
    jewelryType: context.jewelryType,
    'jewelry-specific': {},
  };
  
  // Define which groups belong to which top-level category
  const MODEL_GROUPS = ['skin', 'hair', 'nails', 'makeup', 'expression', 'face', 'facial-hair', 'body-hair', 'masculine-features', 'hand-details'];
  const STYLING_GROUPS = ['clothing-type', 'styling-upper', 'styling-lower'];
  const ENVIRONMENT_GROUPS = ['location', 'lighting'];
  const CAMERA_GROUPS = ['framing', 'angle', 'focus', 'composition'];
  const POST_PRODUCTION_GROUPS = ['processing', 'grading'];
  const CREATIVE_DIRECTION_GROUPS = ['intent', 'mood', 'context'];
  const LIFESTYLE_EXTRAS_GROUPS = ['props'];
  const JEWELRY_GROUPS = ['hand', 'neck', 'head', 'arm', 'necklace-styling', 'bracelet-styling'];
  
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
  
  // Combine grouped fragments and assign to appropriate top-level category
  Object.entries(groups).forEach(([groupName, fragments]) => {
    const value = fragments.length === 1 ? fragments[0] : fragments.join(', ');
    
    if (MODEL_GROUPS.includes(groupName)) {
      json.model[groupName] = value;
    } else if (STYLING_GROUPS.includes(groupName)) {
      json.styling[groupName] = value;
    } else if (ENVIRONMENT_GROUPS.includes(groupName)) {
      json.environment[groupName] = value;
    } else if (CAMERA_GROUPS.includes(groupName)) {
      json.camera[groupName] = value;
    } else if (POST_PRODUCTION_GROUPS.includes(groupName)) {
      json['post-production'][groupName] = value;
    } else if (CREATIVE_DIRECTION_GROUPS.includes(groupName)) {
      json['creative-direction'][groupName] = value;
    } else if (LIFESTYLE_EXTRAS_GROUPS.includes(groupName)) {
      json['lifestyle-extras'][groupName] = value;
    } else if (JEWELRY_GROUPS.includes(groupName)) {
      json['jewelry-specific'][groupName] = value;
    } else {
      // Fallback for uncategorized items
      json.model[groupName] = value;
    }
  });
  
  // Clean up empty objects
  if (Object.keys(json.model).length === 0) delete json.model;
  if (Object.keys(json.styling).length === 0) delete json.styling;
  if (Object.keys(json.environment).length === 0) delete json.environment;
  if (Object.keys(json.camera).length === 0) delete json.camera;
  if (Object.keys(json['post-production']).length === 0) delete json['post-production'];
  if (Object.keys(json['creative-direction']).length === 0) delete json['creative-direction'];
  if (Object.keys(json['lifestyle-extras']).length === 0) delete json['lifestyle-extras'];
  if (Object.keys(json['jewelry-specific']).length === 0) delete json['jewelry-specific'];
  
  return json;
}

