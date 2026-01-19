/**
 * Layer Type Detector
 * 
 * Automatically detects whether a layer contains metal or gemstone geometry
 * based on layer name patterns and color analysis.
 */

// ============================================
// TYPES
// ============================================

export type LayerCategory = 'metal' | 'stone' | 'setting' | 'unknown';

export interface DetectionResult {
  category: LayerCategory;
  confidence: number; // 0-1
  suggestedMaterialId: string | null;
  reason: string;
}

// ============================================
// NAME PATTERN MATCHING
// ============================================

const METAL_PATTERNS = [
  /\bgold\b/i,
  /\bsilver\b/i,
  /\bplatinum\b/i,
  /\bpalladium\b/i,
  /\bmetal\b/i,
  /\bband\b/i,
  /\bshank\b/i,
  /\bring\b/i,
  /\bsetting\b/i,
  /\bprong\b/i,
  /\bbezel\b/i,
  /\bframe\b/i,
  /\bbase\b/i,
  /\bbody\b/i,
  /\bchain\b/i,
  /\bpendant\b/i,
  /\bbracelet\b/i,
  /\bearring\b/i,
  /\bbrass\b/i,
  /\bbronze\b/i,
  /\bcopper\b/i,
  /\btitanium\b/i,
  /\bsteel\b/i,
  /\brose\s*gold/i,
  /\bwhite\s*gold/i,
  /\byellow\s*gold/i,
  /\b18k\b/i,
  /\b14k\b/i,
  /\b22k\b/i,
  /\b24k\b/i,
  /\b925\b/i,
  /\b950\b/i,
];

const STONE_PATTERNS = [
  /\bdiamond\b/i,
  /\bstone\b/i,
  /\bgem\b/i,
  /\bruby\b/i,
  /\bsapphire\b/i,
  /\bemerald\b/i,
  /\bamethyst\b/i,
  /\btopaz\b/i,
  /\baquamarine\b/i,
  /\bopal\b/i,
  /\bpearl\b/i,
  /\bgarnet\b/i,
  /\btourmaline\b/i,
  /\bperidot\b/i,
  /\btanzanite\b/i,
  /\bcitrine\b/i,
  /\bquartz\b/i,
  /\bzircon\b/i,
  /\bmoissanite\b/i,
  /\bcz\b/i,
  /\bcubic\b/i,
  /\bbrilliant\b/i,
  /\bpave\b/i,
  /\bpavé\b/i,
  /\baccent\b/i,
  /\bcenter\s*stone/i,
  /\bmain\s*stone/i,
  /\bside\s*stone/i,
  /\bhalo\b/i,
];

const SETTING_PATTERNS = [
  /\bprong\b/i,
  /\bbezel\b/i,
  /\bclaw\b/i,
  /\bsetting\b/i,
  /\bmount\b/i,
  /\bhead\b/i,
  /\bbasket\b/i,
];

// ============================================
// COLOR ANALYSIS
// ============================================

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 128, g: 128, b: 128 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function rgbToHsl(rgb: RGB): { h: number; s: number; l: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Check if color appears metallic (gold, silver, etc.)
 */
function isMetallicColor(hex: string): { isMetallic: boolean; metalType: string | null } {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  
  // Gold colors: Yellow to orange hue (30-55), high saturation
  if (hsl.h >= 30 && hsl.h <= 55 && hsl.s >= 40 && hsl.l >= 40 && hsl.l <= 80) {
    return { isMetallic: true, metalType: 'gold-18k' };
  }
  
  // Silver/White gold: Low saturation, high lightness
  if (hsl.s <= 15 && hsl.l >= 65) {
    return { isMetallic: true, metalType: 'silver-925' };
  }
  
  // Rose gold: Pink/red hue with moderate saturation
  if (hsl.h >= 340 || hsl.h <= 20) {
    if (hsl.s >= 20 && hsl.s <= 60 && hsl.l >= 50 && hsl.l <= 80) {
      return { isMetallic: true, metalType: 'rose-gold-18k' };
    }
  }
  
  // Platinum: Very light gray
  if (hsl.s <= 10 && hsl.l >= 80) {
    return { isMetallic: true, metalType: 'platinum-950' };
  }
  
  // Copper/Bronze: Orange-brown hue
  if (hsl.h >= 15 && hsl.h <= 35 && hsl.s >= 40 && hsl.l >= 30 && hsl.l <= 60) {
    return { isMetallic: true, metalType: 'copper' };
  }
  
  return { isMetallic: false, metalType: null };
}

/**
 * Check if color appears to be a gemstone color
 */
function isGemstoneColor(hex: string): { isGemstone: boolean; gemType: string | null } {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  
  // Diamond: Very light, low saturation (white/colorless)
  if (hsl.s <= 20 && hsl.l >= 85) {
    return { isGemstone: true, gemType: 'diamond' };
  }
  
  // Ruby: Red hue
  if ((hsl.h >= 340 || hsl.h <= 10) && hsl.s >= 60 && hsl.l >= 30 && hsl.l <= 60) {
    return { isGemstone: true, gemType: 'ruby' };
  }
  
  // Sapphire: Blue hue
  if (hsl.h >= 200 && hsl.h <= 250 && hsl.s >= 50 && hsl.l >= 25 && hsl.l <= 55) {
    return { isGemstone: true, gemType: 'sapphire-blue' };
  }
  
  // Emerald: Green hue
  if (hsl.h >= 100 && hsl.h <= 160 && hsl.s >= 40 && hsl.l >= 30 && hsl.l <= 60) {
    return { isGemstone: true, gemType: 'emerald' };
  }
  
  // Amethyst: Purple hue
  if (hsl.h >= 260 && hsl.h <= 300 && hsl.s >= 40 && hsl.l >= 30 && hsl.l <= 60) {
    return { isGemstone: true, gemType: 'amethyst' };
  }
  
  // Aquamarine: Light blue-green
  if (hsl.h >= 170 && hsl.h <= 200 && hsl.s >= 30 && hsl.l >= 60) {
    return { isGemstone: true, gemType: 'aquamarine' };
  }
  
  return { isGemstone: false, gemType: null };
}

// ============================================
// MAIN DETECTION FUNCTION
// ============================================

/**
 * Detect the category and suggested material for a layer
 * based on its name and color.
 */
export function detectLayerType(layerName: string, layerColor: string): DetectionResult {
  const name = layerName.trim();
  
  // 1. Check name patterns (highest priority)
  
  // Check for stone patterns first (they're more specific)
  for (const pattern of STONE_PATTERNS) {
    if (pattern.test(name)) {
      // Try to identify specific stone
      let suggestedMaterialId: string | null = 'diamond';
      
      if (/ruby/i.test(name)) suggestedMaterialId = 'ruby';
      else if (/sapphire/i.test(name)) suggestedMaterialId = 'sapphire-blue';
      else if (/emerald/i.test(name)) suggestedMaterialId = 'emerald';
      else if (/amethyst/i.test(name)) suggestedMaterialId = 'amethyst';
      else if (/topaz/i.test(name)) suggestedMaterialId = 'topaz-blue';
      else if (/aquamarine/i.test(name)) suggestedMaterialId = 'aquamarine';
      else if (/pearl/i.test(name)) suggestedMaterialId = 'pearl-white';
      else if (/opal/i.test(name)) suggestedMaterialId = 'opal';
      
      return {
        category: 'stone',
        confidence: 0.95,
        suggestedMaterialId,
        reason: `Layer name matches stone pattern: "${pattern.source}"`,
      };
    }
  }
  
  // Check for metal patterns
  for (const pattern of METAL_PATTERNS) {
    if (pattern.test(name)) {
      // Try to identify specific metal
      let suggestedMaterialId: string | null = 'gold-18k';
      
      if (/silver|925/i.test(name)) suggestedMaterialId = 'silver-925';
      else if (/platinum|950/i.test(name)) suggestedMaterialId = 'platinum-950';
      else if (/white\s*gold/i.test(name)) suggestedMaterialId = 'white-gold-18k';
      else if (/rose\s*gold/i.test(name)) suggestedMaterialId = 'rose-gold-18k';
      else if (/24k/i.test(name)) suggestedMaterialId = 'gold-24k';
      else if (/22k/i.test(name)) suggestedMaterialId = 'gold-22k';
      else if (/14k/i.test(name)) suggestedMaterialId = 'gold-14k';
      else if (/brass/i.test(name)) suggestedMaterialId = 'brass';
      else if (/bronze/i.test(name)) suggestedMaterialId = 'bronze';
      else if (/copper/i.test(name)) suggestedMaterialId = 'copper';
      else if (/titanium/i.test(name)) suggestedMaterialId = 'titanium';
      
      return {
        category: 'metal',
        confidence: 0.90,
        suggestedMaterialId,
        reason: `Layer name matches metal pattern: "${pattern.source}"`,
      };
    }
  }
  
  // Check for setting patterns (subset of metal)
  for (const pattern of SETTING_PATTERNS) {
    if (pattern.test(name)) {
      return {
        category: 'setting',
        confidence: 0.85,
        suggestedMaterialId: 'gold-18k',
        reason: `Layer name matches setting pattern: "${pattern.source}"`,
      };
    }
  }
  
  // 2. Fall back to color analysis
  if (layerColor) {
    const metallicResult = isMetallicColor(layerColor);
    if (metallicResult.isMetallic) {
      return {
        category: 'metal',
        confidence: 0.60,
        suggestedMaterialId: metallicResult.metalType,
        reason: `Layer color appears metallic: ${layerColor}`,
      };
    }
    
    const gemResult = isGemstoneColor(layerColor);
    if (gemResult.isGemstone) {
      return {
        category: 'stone',
        confidence: 0.55,
        suggestedMaterialId: gemResult.gemType,
        reason: `Layer color appears gem-like: ${layerColor}`,
      };
    }
  }
  
  // 3. Unknown
  return {
    category: 'unknown',
    confidence: 0.20,
    suggestedMaterialId: null,
    reason: 'Could not determine layer type from name or color',
  };
}

/**
 * Batch detect layer types
 */
export function detectAllLayerTypes(
  layers: Array<{ name: string; color: string }>
): Map<string, DetectionResult> {
  const results = new Map<string, DetectionResult>();
  
  for (const layer of layers) {
    results.set(layer.name, detectLayerType(layer.name, layer.color));
  }
  
  return results;
}

/**
 * Get a human-readable category label
 */
export function getCategoryLabel(category: LayerCategory, language: 'en' | 'tr' = 'en'): string {
  const labels: Record<LayerCategory, { en: string; tr: string }> = {
    metal: { en: 'Metal', tr: 'Metal' },
    stone: { en: 'Gemstone', tr: 'Taş' },
    setting: { en: 'Setting', tr: 'Montür' },
    unknown: { en: 'Unknown', tr: 'Bilinmiyor' },
  };
  
  return labels[category][language];
}

export default {
  detectLayerType,
  detectAllLayerTypes,
  getCategoryLabel,
};
