/**
 * Gemstone Materials for Three.js
 * 
 * Creates realistic gemstone materials with proper optical properties:
 * - Diamond: High IOR (2.42), dispersion, brilliance
 * - Colored stones: Ruby, Sapphire, Emerald with accurate colors and IOR
 * - Transmission and refraction for realistic transparency
 */

import * as THREE from 'three';
import { getMaterialById, MaterialInfo } from '../materials-database';

// ============================================
// TYPES
// ============================================

export interface GemMaterialOptions {
  color?: THREE.ColorRepresentation;
  transmission?: number;
  thickness?: number;
  ior?: number;
  roughness?: number;
  envMapIntensity?: number;
  clearcoat?: number;
  attenuationColor?: THREE.ColorRepresentation;
  attenuationDistance?: number;
}

// ============================================
// DIAMOND MATERIAL
// ============================================

/**
 * Create a realistic diamond material using MeshPhysicalMaterial.
 * 
 * Diamond optical properties:
 * - Refractive Index (IOR): 2.42 (highest of all gemstones)
 * - Dispersion: 0.044 (causes "fire" - rainbow colors)
 * - Brilliance: Total internal reflection due to critical angle
 */
export function createDiamondMaterial(options: GemMaterialOptions = {}): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? 0xffffff,
    metalness: 0,
    roughness: options.roughness ?? 0,
    
    // Transmission for transparency
    transmission: options.transmission ?? 1,
    thickness: options.thickness ?? 2.5,
    
    // Diamond's high refractive index
    ior: options.ior ?? 2.42,
    
    // Surface coating (pavilion facets)
    clearcoat: options.clearcoat ?? 1,
    clearcoatRoughness: 0,
    
    // Environment reflections
    envMapIntensity: options.envMapIntensity ?? 3.0,
    
    // Light absorption in the gem
    attenuationColor: new THREE.Color(options.attenuationColor ?? 0xf0f8ff),
    attenuationDistance: options.attenuationDistance ?? 0.5,
    
    // Rendering
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/**
 * Create a fancy colored diamond material.
 */
export function createFancyDiamondMaterial(
  fancyColor: 'yellow' | 'pink' | 'blue' | 'champagne' | 'black'
): THREE.MeshPhysicalMaterial {
  const colorMap: Record<string, { color: number; attenuation: number; transmission: number }> = {
    yellow: { color: 0xffeb3b, attenuation: 0xfff8dc, transmission: 0.95 },
    pink: { color: 0xffb6c1, attenuation: 0xffc0cb, transmission: 0.95 },
    blue: { color: 0x87ceeb, attenuation: 0xb0e0e6, transmission: 0.95 },
    champagne: { color: 0xf5deb3, attenuation: 0xffefd5, transmission: 0.92 },
    black: { color: 0x1a1a1a, attenuation: 0x000000, transmission: 0.1 },
  };
  
  const config = colorMap[fancyColor] || colorMap.yellow;
  
  return createDiamondMaterial({
    color: config.color,
    transmission: config.transmission,
    attenuationColor: config.attenuation,
  });
}

// ============================================
// COLORED GEMSTONE MATERIALS
// ============================================

/**
 * Create a Ruby material.
 * Ruby is red corundum with IOR 1.77
 */
export function createRubyMaterial(options: GemMaterialOptions = {}): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? 0xe0115f,
    metalness: 0,
    roughness: options.roughness ?? 0.05,
    transmission: options.transmission ?? 0.9,
    thickness: options.thickness ?? 1.5,
    ior: options.ior ?? 1.77,
    envMapIntensity: options.envMapIntensity ?? 2.5,
    attenuationColor: new THREE.Color(options.attenuationColor ?? 0xe0115f),
    attenuationDistance: options.attenuationDistance ?? 1.0,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/**
 * Create a Sapphire material.
 * Sapphire is corundum (same as ruby) with IOR 1.77
 */
export function createSapphireMaterial(
  variant: 'blue' | 'pink' | 'yellow' | 'white' = 'blue',
  options: GemMaterialOptions = {}
): THREE.MeshPhysicalMaterial {
  const colorMap: Record<string, number> = {
    blue: 0x0f52ba,
    pink: 0xff69b4,
    yellow: 0xffd700,
    white: 0xf8f8ff,
  };
  
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? colorMap[variant],
    metalness: 0,
    roughness: options.roughness ?? 0.05,
    transmission: options.transmission ?? 0.9,
    thickness: options.thickness ?? 1.5,
    ior: options.ior ?? 1.77,
    envMapIntensity: options.envMapIntensity ?? 2.5,
    attenuationColor: new THREE.Color(options.attenuationColor ?? colorMap[variant]),
    attenuationDistance: options.attenuationDistance ?? 1.0,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/**
 * Create an Emerald material.
 * Emerald is beryl with IOR 1.58
 */
export function createEmeraldMaterial(options: GemMaterialOptions = {}): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? 0x50c878,
    metalness: 0,
    roughness: options.roughness ?? 0.08, // Slightly rougher due to inclusions
    transmission: options.transmission ?? 0.85,
    thickness: options.thickness ?? 1.8,
    ior: options.ior ?? 1.58,
    envMapIntensity: options.envMapIntensity ?? 2.0,
    attenuationColor: new THREE.Color(options.attenuationColor ?? 0x228b22),
    attenuationDistance: options.attenuationDistance ?? 0.8,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/**
 * Create an Aquamarine material.
 * Aquamarine is beryl (same as emerald) with IOR 1.57
 */
export function createAquamarineMaterial(options: GemMaterialOptions = {}): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? 0x7fffd4,
    metalness: 0,
    roughness: options.roughness ?? 0.05,
    transmission: options.transmission ?? 0.92,
    thickness: options.thickness ?? 1.5,
    ior: options.ior ?? 1.57,
    envMapIntensity: options.envMapIntensity ?? 2.2,
    attenuationColor: new THREE.Color(options.attenuationColor ?? 0x00ced1),
    attenuationDistance: options.attenuationDistance ?? 1.2,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/**
 * Create an Amethyst material.
 * Amethyst is quartz with IOR 1.55
 */
export function createAmethystMaterial(options: GemMaterialOptions = {}): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? 0x9966cc,
    metalness: 0,
    roughness: options.roughness ?? 0.05,
    transmission: options.transmission ?? 0.9,
    thickness: options.thickness ?? 1.5,
    ior: options.ior ?? 1.55,
    envMapIntensity: options.envMapIntensity ?? 2.0,
    attenuationColor: new THREE.Color(options.attenuationColor ?? 0x8b008b),
    attenuationDistance: options.attenuationDistance ?? 1.0,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/**
 * Create a Topaz material.
 * Topaz has IOR 1.63
 */
export function createTopazMaterial(
  variant: 'blue' | 'imperial' | 'white' = 'blue',
  options: GemMaterialOptions = {}
): THREE.MeshPhysicalMaterial {
  const colorMap: Record<string, number> = {
    blue: 0x00bfff,
    imperial: 0xff8c00,
    white: 0xf5f5f5,
  };
  
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? colorMap[variant],
    metalness: 0,
    roughness: options.roughness ?? 0.03,
    transmission: options.transmission ?? 0.95,
    thickness: options.thickness ?? 1.5,
    ior: options.ior ?? 1.63,
    envMapIntensity: options.envMapIntensity ?? 2.3,
    attenuationColor: new THREE.Color(options.attenuationColor ?? colorMap[variant]),
    attenuationDistance: options.attenuationDistance ?? 1.5,
    transparent: true,
    side: THREE.DoubleSide,
  });
}

/**
 * Create a Pearl material.
 * Pearls are not transparent but have iridescence.
 */
export function createPearlMaterial(
  variant: 'white' | 'black' | 'gold' | 'pink' = 'white',
  options: GemMaterialOptions = {}
): THREE.MeshPhysicalMaterial {
  const colorMap: Record<string, { color: number; sheen: number }> = {
    white: { color: 0xfffaf0, sheen: 0xfff5ee },
    black: { color: 0x1c1c1c, sheen: 0x2f4f4f },
    gold: { color: 0xffd700, sheen: 0xdaa520 },
    pink: { color: 0xffb6c1, sheen: 0xffc0cb },
  };
  
  const config = colorMap[variant];
  
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? config.color,
    metalness: variant === 'black' ? 0.2 : 0.1,
    roughness: options.roughness ?? 0.2,
    
    // Pearls have sheen, not transmission
    sheen: 1,
    sheenRoughness: 0.3,
    sheenColor: new THREE.Color(config.sheen),
    
    envMapIntensity: options.envMapIntensity ?? 1.5,
    
    // Slight iridescence effect
    iridescence: 0.3,
    iridescenceIOR: 1.53,
    iridescenceThicknessRange: [100, 400],
  });
}

/**
 * Create an Opal material.
 * Opals have play of color (iridescence).
 */
export function createOpalMaterial(options: GemMaterialOptions = {}): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: options.color ?? 0xffffff,
    metalness: 0,
    roughness: options.roughness ?? 0.1,
    transmission: options.transmission ?? 0.3,
    thickness: options.thickness ?? 2.0,
    ior: options.ior ?? 1.45,
    envMapIntensity: options.envMapIntensity ?? 1.5,
    
    // Opal's signature play of color
    iridescence: 1.0,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [200, 800],
    
    sheen: 0.5,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(0xffffff),
    
    transparent: true,
    side: THREE.DoubleSide,
  });
}

// ============================================
// MATERIAL FACTORY
// ============================================

/**
 * Create a gemstone material from a material ID.
 */
export function createGemMaterialById(materialId: string): THREE.MeshPhysicalMaterial | null {
  const materialInfo = getMaterialById(materialId);
  if (!materialInfo) {
    console.warn(`[GemMaterials] Material not found: ${materialId}`);
    return null;
  }
  
  // Route to appropriate material creator
  switch (materialId) {
    // Diamonds
    case 'diamond':
      return createDiamondMaterial();
    case 'diamond-fancy-yellow':
      return createFancyDiamondMaterial('yellow');
    case 'diamond-fancy-pink':
      return createFancyDiamondMaterial('pink');
    
    // Corundum family
    case 'ruby':
      return createRubyMaterial();
    case 'sapphire-blue':
      return createSapphireMaterial('blue');
    case 'sapphire-pink':
      return createSapphireMaterial('pink');
    case 'sapphire-yellow':
      return createSapphireMaterial('yellow');
    
    // Beryl family
    case 'emerald':
      return createEmeraldMaterial();
    case 'aquamarine':
      return createAquamarineMaterial();
    case 'morganite':
      return createAquamarineMaterial({ color: 0xffb6c1 });
    
    // Quartz family
    case 'amethyst':
      return createAmethystMaterial();
    case 'citrine':
      return createAmethystMaterial({ color: 0xe4d00a });
    case 'rose-quartz':
      return createAmethystMaterial({ color: 0xffb7c5, roughness: 0.08, transmission: 0.8 });
    case 'smoky-quartz':
      return createAmethystMaterial({ color: 0x7b6f5d, transmission: 0.75 });
    
    // Topaz
    case 'topaz-blue':
      return createTopazMaterial('blue');
    case 'topaz-imperial':
      return createTopazMaterial('imperial');
    
    // Pearls
    case 'pearl-white':
      return createPearlMaterial('white');
    case 'pearl-black':
      return createPearlMaterial('black');
    case 'pearl-gold':
      return createPearlMaterial('gold');
    
    // Opal
    case 'opal':
      return createOpalMaterial();
    
    // Generic gemstone fallback using material info
    default:
      return createGenericGemMaterial(materialInfo);
  }
}

/**
 * Create a generic gemstone material from MaterialInfo.
 */
function createGenericGemMaterial(info: MaterialInfo): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: info.color,
    metalness: info.metalness,
    roughness: info.roughness,
    transmission: info.transmission ?? 0.9,
    thickness: 1.5,
    ior: info.ior ?? 1.55,
    envMapIntensity: info.envMapIntensity,
    attenuationColor: new THREE.Color(info.color),
    attenuationDistance: 1.0,
    transparent: info.transmission ? info.transmission > 0 : false,
    side: THREE.DoubleSide,
  });
}

export default {
  createDiamondMaterial,
  createFancyDiamondMaterial,
  createRubyMaterial,
  createSapphireMaterial,
  createEmeraldMaterial,
  createAquamarineMaterial,
  createAmethystMaterial,
  createTopazMaterial,
  createPearlMaterial,
  createOpalMaterial,
  createGemMaterialById,
};
