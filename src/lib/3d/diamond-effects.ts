/**
 * Diamond/Stone Effects Configuration
 * 
 * Realistic gemstone rendering parameters
 * Dispersion, Brilliance, Fire, Scintillation
 */

import * as THREE from 'three';

// ============================================
// TYPES
// ============================================

export interface DiamondEffectConfig {
  // Dispersion (Fire) - Rainbow effect
  dispersion: number; // 0-1, how much light separates into colors
  dispersionStrength: number; // 0-5, intensity of dispersion
  
  // Brilliance - White light return
  brilliance: number; // 0-1, amount of white light reflected
  
  // Fire - Colored light flashes
  fire: number; // 0-1, intensity of colored flashes
  
  // Scintillation - Sparkle pattern
  scintillation: number; // 0-1, amount of sparkle
  scintillationSpeed: number; // Animation speed
  
  // Transparency/Clarity
  clarity: number; // 0-1, how clear the stone is (1 = flawless)
  
  // Internal reflections
  internalReflections: number; // Number of bounces
  
  // Cut quality affects all above
  cutQuality: 'poor' | 'fair' | 'good' | 'very_good' | 'excellent' | 'ideal';
}

export interface StoneCutPreset {
  id: string;
  name: string;
  nameTr: string;
  description: string;
  // Optimal settings for this cut
  defaultEffects: Partial<DiamondEffectConfig>;
  // Visual preview
  icon: string; // SVG path or emoji
}

// ============================================
// CUT QUALITY MULTIPLIERS
// ============================================

export const CUT_QUALITY_MULTIPLIERS: Record<DiamondEffectConfig['cutQuality'], number> = {
  poor: 0.4,
  fair: 0.6,
  good: 0.75,
  very_good: 0.85,
  excellent: 0.95,
  ideal: 1.0,
};

// ============================================
// STONE CUT PRESETS
// ============================================

export const STONE_CUT_PRESETS: StoneCutPreset[] = [
  {
    id: 'round-brilliant',
    name: 'Round Brilliant',
    nameTr: 'Yuvarlak Parlak',
    description: '58 facets, maximum brilliance and fire',
    icon: '💎',
    defaultEffects: {
      dispersion: 0.8,
      brilliance: 0.9,
      fire: 0.85,
      scintillation: 0.8,
      internalReflections: 5,
    },
  },
  {
    id: 'princess',
    name: 'Princess',
    nameTr: 'Prenses',
    description: 'Square cut with brilliant faceting',
    icon: '◆',
    defaultEffects: {
      dispersion: 0.75,
      brilliance: 0.85,
      fire: 0.8,
      scintillation: 0.75,
      internalReflections: 4,
    },
  },
  {
    id: 'cushion',
    name: 'Cushion',
    nameTr: 'Yastık',
    description: 'Soft, pillow-like shape with large facets',
    icon: '▢',
    defaultEffects: {
      dispersion: 0.85,
      brilliance: 0.8,
      fire: 0.9,
      scintillation: 0.7,
      internalReflections: 4,
    },
  },
  {
    id: 'oval',
    name: 'Oval',
    nameTr: 'Oval',
    description: 'Elongated round with similar brilliance',
    icon: '⬭',
    defaultEffects: {
      dispersion: 0.75,
      brilliance: 0.85,
      fire: 0.8,
      scintillation: 0.75,
      internalReflections: 4,
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    nameTr: 'Zümrüt',
    description: 'Step cut with hall-of-mirrors effect',
    icon: '▭',
    defaultEffects: {
      dispersion: 0.5,
      brilliance: 0.7,
      fire: 0.6,
      scintillation: 0.5,
      internalReflections: 3,
    },
  },
  {
    id: 'marquise',
    name: 'Marquise',
    nameTr: 'Markiz',
    description: 'Boat-shaped with pointed ends',
    icon: '◇',
    defaultEffects: {
      dispersion: 0.7,
      brilliance: 0.8,
      fire: 0.75,
      scintillation: 0.7,
      internalReflections: 4,
    },
  },
  {
    id: 'pear',
    name: 'Pear',
    nameTr: 'Armut',
    description: 'Teardrop shape combining round and marquise',
    icon: '🫐',
    defaultEffects: {
      dispersion: 0.75,
      brilliance: 0.82,
      fire: 0.78,
      scintillation: 0.72,
      internalReflections: 4,
    },
  },
  {
    id: 'radiant',
    name: 'Radiant',
    nameTr: 'Işıltılı',
    description: 'Rectangular with brilliant faceting',
    icon: '▣',
    defaultEffects: {
      dispersion: 0.8,
      brilliance: 0.85,
      fire: 0.82,
      scintillation: 0.78,
      internalReflections: 5,
    },
  },
  {
    id: 'asscher',
    name: 'Asscher',
    nameTr: 'Asscher',
    description: 'Square step cut with cropped corners',
    icon: '⬜',
    defaultEffects: {
      dispersion: 0.55,
      brilliance: 0.72,
      fire: 0.65,
      scintillation: 0.55,
      internalReflections: 3,
    },
  },
  {
    id: 'heart',
    name: 'Heart',
    nameTr: 'Kalp',
    description: 'Romantic heart shape',
    icon: '💗',
    defaultEffects: {
      dispersion: 0.7,
      brilliance: 0.78,
      fire: 0.75,
      scintillation: 0.68,
      internalReflections: 4,
    },
  },
];

// ============================================
// DEFAULT EFFECTS
// ============================================

export const DEFAULT_DIAMOND_EFFECTS: DiamondEffectConfig = {
  dispersion: 0.8,
  dispersionStrength: 1.0,
  brilliance: 0.9,
  fire: 0.85,
  scintillation: 0.8,
  scintillationSpeed: 1.0,
  clarity: 0.95,
  internalReflections: 5,
  cutQuality: 'excellent',
};

// ============================================
// SHADER UNIFORMS GENERATOR
// ============================================

export function generateDiamondUniforms(config: DiamondEffectConfig): Record<string, THREE.IUniform> {
  const qualityMultiplier = CUT_QUALITY_MULTIPLIERS[config.cutQuality];
  
  return {
    uDispersion: { value: config.dispersion * qualityMultiplier },
    uDispersionStrength: { value: config.dispersionStrength },
    uBrilliance: { value: config.brilliance * qualityMultiplier },
    uFire: { value: config.fire * qualityMultiplier },
    uScintillation: { value: config.scintillation * qualityMultiplier },
    uScintillationSpeed: { value: config.scintillationSpeed },
    uClarity: { value: config.clarity },
    uInternalReflections: { value: config.internalReflections },
    uTime: { value: 0 },
  };
}

// ============================================
// GEMSTONE TYPE CONFIGURATIONS
// ============================================

export interface GemstoneTypeConfig {
  id: string;
  name: string;
  nameTr: string;
  // Physical properties
  ior: number; // Index of refraction
  dispersion: number; // Dispersion coefficient
  hardness: number; // Mohs scale
  // Visual properties
  baseColor: string;
  transmission: number;
  absorption: THREE.Vector3; // RGB absorption
  // Effect multipliers
  effectMultipliers: Partial<DiamondEffectConfig>;
}

export const GEMSTONE_TYPES: GemstoneTypeConfig[] = [
  {
    id: 'diamond',
    name: 'Diamond',
    nameTr: 'Pırlanta',
    ior: 2.417,
    dispersion: 0.044,
    hardness: 10,
    baseColor: '#FFFFFF',
    transmission: 0.95,
    absorption: new THREE.Vector3(0.01, 0.01, 0.01),
    effectMultipliers: {
      dispersion: 1.0,
      fire: 1.0,
      brilliance: 1.0,
    },
  },
  {
    id: 'ruby',
    name: 'Ruby',
    nameTr: 'Yakut',
    ior: 1.77,
    dispersion: 0.018,
    hardness: 9,
    baseColor: '#E0115F',
    transmission: 0.75,
    absorption: new THREE.Vector3(0.8, 0.1, 0.15),
    effectMultipliers: {
      dispersion: 0.4,
      fire: 0.6,
      brilliance: 0.85,
    },
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    nameTr: 'Safir',
    ior: 1.77,
    dispersion: 0.018,
    hardness: 9,
    baseColor: '#0F52BA',
    transmission: 0.8,
    absorption: new THREE.Vector3(0.1, 0.2, 0.7),
    effectMultipliers: {
      dispersion: 0.4,
      fire: 0.55,
      brilliance: 0.88,
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    nameTr: 'Zümrüt',
    ior: 1.58,
    dispersion: 0.014,
    hardness: 7.5,
    baseColor: '#50C878',
    transmission: 0.7,
    absorption: new THREE.Vector3(0.15, 0.6, 0.2),
    effectMultipliers: {
      dispersion: 0.3,
      fire: 0.4,
      brilliance: 0.75,
    },
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    nameTr: 'Ametist',
    ior: 1.544,
    dispersion: 0.013,
    hardness: 7,
    baseColor: '#9966CC',
    transmission: 0.85,
    absorption: new THREE.Vector3(0.3, 0.1, 0.5),
    effectMultipliers: {
      dispersion: 0.3,
      fire: 0.35,
      brilliance: 0.82,
    },
  },
  {
    id: 'aquamarine',
    name: 'Aquamarine',
    nameTr: 'Akuamarin',
    ior: 1.577,
    dispersion: 0.014,
    hardness: 7.5,
    baseColor: '#7FFFD4',
    transmission: 0.9,
    absorption: new THREE.Vector3(0.05, 0.2, 0.3),
    effectMultipliers: {
      dispersion: 0.35,
      fire: 0.4,
      brilliance: 0.88,
    },
  },
  {
    id: 'topaz',
    name: 'Topaz',
    nameTr: 'Topaz',
    ior: 1.63,
    dispersion: 0.014,
    hardness: 8,
    baseColor: '#FFC87C',
    transmission: 0.9,
    absorption: new THREE.Vector3(0.4, 0.3, 0.1),
    effectMultipliers: {
      dispersion: 0.35,
      fire: 0.45,
      brilliance: 0.9,
    },
  },
  {
    id: 'opal',
    name: 'Opal',
    nameTr: 'Opal',
    ior: 1.45,
    dispersion: 0.01,
    hardness: 6,
    baseColor: '#A8C3BC',
    transmission: 0.3,
    absorption: new THREE.Vector3(0.1, 0.1, 0.1),
    effectMultipliers: {
      dispersion: 0.2,
      fire: 0.8, // Play of color
      brilliance: 0.5,
      scintillation: 0.9,
    },
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getGemstoneById(id: string): GemstoneTypeConfig | undefined {
  return GEMSTONE_TYPES.find((g) => g.id === id);
}

export function getCutPresetById(id: string): StoneCutPreset | undefined {
  return STONE_CUT_PRESETS.find((c) => c.id === id);
}

export function calculateEffectiveEffects(
  baseEffects: DiamondEffectConfig,
  gemstone: GemstoneTypeConfig,
  cutPreset: StoneCutPreset
): DiamondEffectConfig {
  const gemMultipliers = gemstone.effectMultipliers;
  const cutDefaults = cutPreset.defaultEffects;
  
  return {
    ...baseEffects,
    dispersion: (cutDefaults.dispersion || baseEffects.dispersion) * (gemMultipliers.dispersion || 1),
    brilliance: (cutDefaults.brilliance || baseEffects.brilliance) * (gemMultipliers.brilliance || 1),
    fire: (cutDefaults.fire || baseEffects.fire) * (gemMultipliers.fire || 1),
    scintillation: (cutDefaults.scintillation || baseEffects.scintillation) * (gemMultipliers.scintillation || 1),
    internalReflections: cutDefaults.internalReflections || baseEffects.internalReflections,
  };
}

export default {
  DEFAULT_DIAMOND_EFFECTS,
  STONE_CUT_PRESETS,
  GEMSTONE_TYPES,
  CUT_QUALITY_MULTIPLIERS,
  generateDiamondUniforms,
  getGemstoneById,
  getCutPresetById,
  calculateEffectiveEffects,
};
