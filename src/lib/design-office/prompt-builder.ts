/**
 * Design Office - Prompt Builder
 * Builds AI prompts from selected design parameters
 * Only includes parameters that user has selected
 */

import type { DesignConfig, StoneConfig, MetalConfig, StyleConfig, RingConfig, ChainConfig, EarringConfig, DetailConfig, TargetConfig } from './types';
import * as params from './jewelry-parameters';

// ============================================
// MAIN PROMPT BUILDER
// ============================================
export function buildPrompt(config: Partial<DesignConfig>): string {
  const parts: string[] = [];
  
  // MODE-SPECIFIC PREFIX
  if (config.mode === 'variation' && config.sourceImageDescription) {
    parts.push(`Create a variation of this jewelry piece: ${config.sourceImageDescription}.`);
    if (config.variationType) {
      const variationLabel = params.VARIATION_TYPES.find(v => v.value === config.variationType)?.label;
      parts.push(`Variation type: ${variationLabel}.`);
    }
  } else if (config.mode === 'set' && config.sourceImageDescription) {
    parts.push(`Create a matching ${config.setType?.replace('-', ' ')} for this jewelry piece: ${config.sourceImageDescription}.`);
  } else {
    parts.push('Design a');
  }
  
  // JEWELRY TYPE
  if (config.jewelryType) {
    const typeLabel = params.JEWELRY_TYPES.find(t => t.value === config.jewelryType)?.label;
    parts.push(`${typeLabel?.toLowerCase()}`);
    
    // SUBTYPE
    if (config.subType) {
      const subtypeOptions = params.getSubtypeOptions(config.jewelryType);
      const subtypeLabel = subtypeOptions.find(s => s.value === config.subType)?.label;
      if (subtypeLabel) {
        parts.push(`(${subtypeLabel})`);
      }
    }
  }
  
  // STYLE
  if (config.style) {
    parts.push(buildStylePrompt(config.style));
  }
  
  // METAL
  if (config.metal) {
    parts.push(buildMetalPrompt(config.metal));
  }
  
  // STONES
  if (config.stone) {
    parts.push(buildStonePrompt(config.stone));
  }
  
  // RING SPECIFIC
  if (config.jewelryType === 'ring' && config.ring) {
    parts.push(buildRingPrompt(config.ring));
  }
  
  // CHAIN/NECKLACE SPECIFIC
  if ((config.jewelryType === 'necklace' || config.jewelryType === 'bracelet') && config.chain) {
    parts.push(buildChainPrompt(config.chain));
  }
  
  // EARRING SPECIFIC
  if (config.jewelryType === 'earring' && config.earring) {
    parts.push(buildEarringPrompt(config.earring));
  }
  
  // DETAILS
  if (config.detail) {
    parts.push(buildDetailPrompt(config.detail));
  }
  
  // TARGET AUDIENCE
  if (config.target) {
    parts.push(buildTargetPrompt(config.target));
  }
  
  // ADDITIONAL NOTES
  if (config.additionalNotes) {
    parts.push(config.additionalNotes);
  }
  
  // QUALITY SUFFIX
  parts.push('Professional jewelry photography, studio lighting, high-end product shot, 4K quality, clean background.');
  
  return parts.filter(p => p.trim()).join(' ');
}

// ============================================
// STYLE PROMPT
// ============================================
function buildStylePrompt(style: StyleConfig): string {
  const parts: string[] = [];
  
  if (style.designStyle) {
    const label = params.DESIGN_STYLES.find(s => s.value === style.designStyle)?.label;
    if (label) parts.push(`${label} style`);
  }
  
  if (style.culturalStyle) {
    const label = params.CULTURAL_STYLES.find(s => s.value === style.culturalStyle)?.label;
    if (label) parts.push(`with ${label} influences`);
  }
  
  if (style.thematicMotif) {
    const themeLabel = params.THEMATIC_MOTIFS.find(m => m.value === style.thematicMotif)?.label;
    if (themeLabel) parts.push(`featuring ${themeLabel.toLowerCase()} motif`);
  }
  
  if (style.specificMotif) {
    const specificMotifs = style.thematicMotif ? params.getSpecificMotifs(style.thematicMotif) : [];
    const label = specificMotifs.find(m => m.value === style.specificMotif)?.label;
    if (label) parts.push(`(${label.toLowerCase()})`);
  }
  
  if (style.motifRealism) {
    const label = params.MOTIF_REALISM.find(r => r.value === style.motifRealism)?.label;
    if (label) parts.push(`${label.toLowerCase()} rendering`);
  }
  
  return parts.join(' ');
}

// ============================================
// METAL PROMPT
// ============================================
function buildMetalPrompt(metal: MetalConfig): string {
  const parts: string[] = [];
  
  if (metal.primaryMetal) {
    const label = params.METAL_TYPES.find(m => m.value === metal.primaryMetal)?.label;
    if (label) parts.push(`made of ${label}`);
  }
  
  if (metal.primaryPurity) {
    const label = params.METAL_PURITIES.find(p => p.value === metal.primaryPurity)?.label;
    if (label) parts.push(`(${label})`);
  }
  
  if (metal.primaryFinish) {
    const label = params.METAL_FINISHES.find(f => f.value === metal.primaryFinish)?.label;
    if (label) parts.push(`with ${label.toLowerCase()} finish`);
  }
  
  if (metal.twoTone && metal.secondaryMetal) {
    const label = params.METAL_TYPES.find(m => m.value === metal.secondaryMetal)?.label;
    if (label) parts.push(`two-tone with ${label}`);
  }
  
  if (metal.triColor) {
    parts.push('tri-color design');
  }
  
  return parts.join(' ');
}

// ============================================
// STONE PROMPT
// ============================================
function buildStonePrompt(stone: StoneConfig): string {
  if (!stone.hasStones) {
    return 'without gemstones, solid metal design';
  }
  
  const parts: string[] = [];
  
  if (stone.stoneType) {
    const label = params.STONE_TYPES.find(s => s.value === stone.stoneType)?.label;
    if (label) parts.push(`set with ${label}`);
  }
  
  if (stone.cut) {
    const label = params.DIAMOND_CUTS.find(c => c.value === stone.cut)?.label;
    if (label) parts.push(`(${label} cut)`);
  }
  
  if (stone.setting) {
    const label = params.SETTING_TYPES.find(s => s.value === stone.setting)?.label;
    if (label) parts.push(`in ${label.toLowerCase()} setting`);
  }
  
  if (stone.arrangement) {
    const label = params.STONE_ARRANGEMENTS.find(a => a.value === stone.arrangement)?.label;
    if (label) parts.push(`${label.toLowerCase()} arrangement`);
  }
  
  if (stone.stoneCount && stone.stoneCount !== 'single') {
    const label = params.STONE_COUNTS.find(c => c.value === stone.stoneCount)?.label;
    if (label) parts.push(`(${label.toLowerCase()})`);
  }
  
  if (stone.stoneSize) {
    const label = params.STONE_SIZES.find(s => s.value === stone.stoneSize)?.label;
    if (label) parts.push(`${label.toLowerCase()} stones`);
  }
  
  if (stone.stoneSizeMm) {
    parts.push(`${stone.stoneSizeMm}mm`);
  }
  
  return parts.join(' ');
}

// ============================================
// RING PROMPT
// ============================================
function buildRingPrompt(ring: RingConfig): string {
  const parts: string[] = [];
  
  if (ring.profile) {
    const label = params.RING_PROFILES.find(p => p.value === ring.profile)?.label;
    if (label) parts.push(`${label} profile band`);
  }
  
  if (ring.width) {
    const label = params.RING_WIDTHS.find(w => w.value === ring.width)?.label;
    if (label) parts.push(`${label.toLowerCase()} width`);
  }
  
  if (ring.widthMm) {
    parts.push(`(${ring.widthMm}mm)`);
  }
  
  if (ring.shankStones) {
    parts.push('with stones on the shank');
    if (ring.shankStoneStyle) {
      parts.push(`(${ring.shankStoneStyle} style)`);
    }
  }
  
  if (ring.comfortFit) {
    parts.push('comfort fit interior');
  }
  
  return parts.join(' ');
}

// ============================================
// CHAIN PROMPT
// ============================================
function buildChainPrompt(chain: ChainConfig): string {
  const parts: string[] = [];
  
  if (chain.chainType) {
    const label = params.CHAIN_TYPES.find(c => c.value === chain.chainType)?.label;
    if (label) parts.push(`on ${label}`);
  }
  
  if (chain.length) {
    const label = params.NECKLACE_LENGTHS.find(l => l.value === chain.length)?.label;
    if (label) parts.push(`${label.toLowerCase()} length`);
  }
  
  if (chain.lengthCm) {
    parts.push(`(${chain.lengthCm}cm)`);
  }
  
  if (chain.thickness) {
    parts.push(`${chain.thickness} thickness`);
  }
  
  if (chain.clasp) {
    const label = params.CLASP_TYPES.find(c => c.value === chain.clasp)?.label;
    if (label) parts.push(`with ${label.toLowerCase()} clasp`);
  }
  
  return parts.join(' ');
}

// ============================================
// EARRING PROMPT
// ============================================
function buildEarringPrompt(earring: EarringConfig): string {
  const parts: string[] = [];
  
  if (earring.backType) {
    const label = params.EARRING_BACKS.find(b => b.value === earring.backType)?.label;
    if (label) parts.push(`with ${label.toLowerCase()} backing`);
  }
  
  if (earring.drop && earring.dropLength) {
    parts.push(`${earring.dropLength} drop length`);
  }
  
  if (earring.hoopDiameter) {
    parts.push(`${earring.hoopDiameter} hoop size`);
  }
  
  return parts.join(' ');
}

// ============================================
// DETAIL PROMPT
// ============================================
function buildDetailPrompt(detail: DetailConfig): string {
  const parts: string[] = [];
  
  if (detail.edgeDetail && detail.edgeDetail !== 'plain') {
    const label = params.EDGE_DETAILS.find(e => e.value === detail.edgeDetail)?.label;
    if (label) parts.push(`${label.toLowerCase()} edge detail`);
  }
  
  if (detail.filigree) {
    parts.push('with filigree work');
  }
  
  if (detail.openwork) {
    parts.push('openwork design');
  }
  
  if (detail.engraving && detail.engravingText) {
    parts.push(`with engraved text "${detail.engravingText}"`);
  }
  
  return parts.join(' ');
}

// ============================================
// TARGET PROMPT
// ============================================
function buildTargetPrompt(target: TargetConfig): string {
  const parts: string[] = [];
  
  if (target.occasion) {
    const label = params.OCCASIONS.find(o => o.value === target.occasion)?.label;
    if (label) parts.push(`suitable for ${label.toLowerCase()}`);
  }
  
  if (target.gender) {
    const label = params.GENDERS.find(g => g.value === target.gender)?.label;
    if (label) parts.push(`${label.toLowerCase()} aesthetic`);
  }
  
  if (target.pricePoint) {
    const label = params.PRICE_POINTS.find(p => p.value === target.pricePoint)?.label;
    if (label) parts.push(`${label.toLowerCase()} market positioning`);
  }
  
  return parts.join(', ');
}

// ============================================
// SHUFFLE / RANDOM GENERATOR
// ============================================
export function generateRandomConfig(baseType?: string): Partial<DesignConfig> {
  const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  
  const jewelryType = baseType || random(params.JEWELRY_TYPES).value;
  const subtypeOptions = params.getSubtypeOptions(jewelryType);
  
  const config: Partial<DesignConfig> = {
    mode: 'create',
    jewelryType: jewelryType as any,
    subType: subtypeOptions.length > 0 ? random(subtypeOptions).value : undefined,
    metal: {
      primaryMetal: random(params.METAL_TYPES).value as any,
      primaryFinish: random(params.METAL_FINISHES).value as any,
    },
    style: {
      designStyle: random(params.DESIGN_STYLES).value as any,
    },
    target: {
      gender: random(params.GENDERS).value as any,
    },
  };
  
  // 70% chance of having stones
  if (Math.random() > 0.3) {
    config.stone = {
      hasStones: true,
      stoneType: random(params.STONE_TYPES).value as any,
      setting: random(params.SETTING_TYPES).value as any,
      arrangement: random(params.STONE_ARRANGEMENTS).value as any,
      stoneSize: random(params.STONE_SIZES).value as any,
    };
  } else {
    config.stone = { hasStones: false };
  }
  
  // 40% chance of having a motif
  if (Math.random() > 0.6) {
    const theme = random(params.THEMATIC_MOTIFS).value;
    const specificMotifs = params.getSpecificMotifs(theme);
    config.style!.thematicMotif = theme as any;
    if (specificMotifs.length > 0) {
      config.style!.specificMotif = random(specificMotifs).value as any;
    }
    config.style!.motifRealism = random(params.MOTIF_REALISM).value as any;
  }
  
  // Add type-specific config
  if (jewelryType === 'ring') {
    config.ring = {
      profile: random(params.RING_PROFILES).value as any,
      width: random(params.RING_WIDTHS).value as any,
    };
  }
  
  if (jewelryType === 'necklace' || jewelryType === 'bracelet') {
    config.chain = {
      chainType: random(params.CHAIN_TYPES).value as any,
    };
    if (jewelryType === 'necklace') {
      config.chain.length = random(params.NECKLACE_LENGTHS).value as any;
    }
  }
  
  if (jewelryType === 'earring') {
    config.earring = {
      backType: random(params.EARRING_BACKS).value as any,
    };
  }
  
  return config;
}

// ============================================
// SHUFFLE SPECIFIC PARAMETER
// ============================================
export function shuffleParameter<T>(
  currentValue: T | undefined,
  options: { value: T }[]
): T {
  const filtered = options.filter(o => o.value !== currentValue);
  if (filtered.length === 0) return options[0].value;
  return filtered[Math.floor(Math.random() * filtered.length)].value;
}
