/**
 * Metal Materials for Three.js
 * 
 * Creates realistic metal materials with proper PBR properties:
 * - Gold (Yellow, White, Rose) in various karats
 * - Silver (Sterling, Fine)
 * - Platinum
 * - Base metals (Brass, Bronze, Copper)
 */

import * as THREE from 'three';
import { getMaterialById, MaterialInfo } from '../materials-database';

// ============================================
// TYPES
// ============================================

export interface MetalMaterialOptions {
  color?: THREE.ColorRepresentation;
  metalness?: number;
  roughness?: number;
  envMapIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
}

// ============================================
// GOLD MATERIALS
// ============================================

/**
 * Create a Yellow Gold material.
 */
export function createYellowGoldMaterial(
  karat: '24k' | '22k' | '18k' | '14k' | '9k' = '18k',
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  const colorMap: Record<string, number> = {
    '24k': 0xffd700, // Pure gold - bright yellow
    '22k': 0xffcc00, // Slightly less saturated
    '18k': 0xffb800, // Standard jewelry gold
    '14k': 0xdaa520, // More copper tone
    '9k': 0xcd853f,  // Pale gold
  };
  
  const roughnessMap: Record<string, number> = {
    '24k': 0.12,
    '22k': 0.14,
    '18k': 0.15,
    '14k': 0.18,
    '9k': 0.20,
  };
  
  return new THREE.MeshStandardMaterial({
    color: options.color ?? colorMap[karat],
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? roughnessMap[karat],
    envMapIntensity: options.envMapIntensity ?? 1.6,
  });
}

/**
 * Create a White Gold material.
 */
export function createWhiteGoldMaterial(
  karat: '18k' | '14k' = '18k',
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  const colorMap: Record<string, number> = {
    '18k': 0xf0f0f0,
    '14k': 0xe8e8e8,
  };
  
  return new THREE.MeshStandardMaterial({
    color: options.color ?? colorMap[karat],
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.10,
    envMapIntensity: options.envMapIntensity ?? 1.8,
  });
}

/**
 * Create a Rose Gold material.
 */
export function createRoseGoldMaterial(
  karat: '18k' | '14k' = '18k',
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  const colorMap: Record<string, number> = {
    '18k': 0xe8b4b8, // Pink-gold
    '14k': 0xd4a5a5, // Slightly more copper
  };
  
  return new THREE.MeshStandardMaterial({
    color: options.color ?? colorMap[karat],
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.15,
    envMapIntensity: options.envMapIntensity ?? 1.6,
  });
}

// ============================================
// SILVER MATERIALS
// ============================================

/**
 * Create a Sterling Silver (925) material.
 */
export function createSterlingSilverMaterial(
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color ?? 0xc0c0c0,
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.10,
    envMapIntensity: options.envMapIntensity ?? 1.8,
  });
}

/**
 * Create a Fine Silver (999) material.
 */
export function createFineSilverMaterial(
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color ?? 0xe8e8e8,
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.08,
    envMapIntensity: options.envMapIntensity ?? 2.0,
  });
}

// ============================================
// PLATINUM MATERIALS
// ============================================

/**
 * Create a Platinum material.
 */
export function createPlatinumMaterial(
  purity: '950' | '900' = '950',
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  const colorMap: Record<string, number> = {
    '950': 0xe5e4e2, // Bright platinum
    '900': 0xd4d4d4, // Slightly darker
  };
  
  return new THREE.MeshStandardMaterial({
    color: options.color ?? colorMap[purity],
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.08,
    envMapIntensity: options.envMapIntensity ?? 2.0,
  });
}

/**
 * Create a Palladium material.
 */
export function createPalladiumMaterial(
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color ?? 0xced0ce,
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.10,
    envMapIntensity: options.envMapIntensity ?? 1.8,
  });
}

// ============================================
// BASE METAL MATERIALS
// ============================================

/**
 * Create a Brass material.
 */
export function createBrassMaterial(
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color ?? 0xb5a642,
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.20,
    envMapIntensity: options.envMapIntensity ?? 1.4,
  });
}

/**
 * Create a Bronze material.
 */
export function createBronzeMaterial(
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color ?? 0xcd7f32,
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.22,
    envMapIntensity: options.envMapIntensity ?? 1.3,
  });
}

/**
 * Create a Copper material.
 */
export function createCopperMaterial(
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color ?? 0xb87333,
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.18,
    envMapIntensity: options.envMapIntensity ?? 1.5,
  });
}

/**
 * Create a Titanium material.
 */
export function createTitaniumMaterial(
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color ?? 0x878681,
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.25,
    envMapIntensity: options.envMapIntensity ?? 1.2,
  });
}

/**
 * Create a Stainless Steel material.
 */
export function createStainlessSteelMaterial(
  options: MetalMaterialOptions = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color ?? 0x888888,
    metalness: options.metalness ?? 1,
    roughness: options.roughness ?? 0.20,
    envMapIntensity: options.envMapIntensity ?? 1.4,
  });
}

// ============================================
// POLISHED / BRUSHED FINISHES
// ============================================

/**
 * Apply a brushed/satin finish to a metal material.
 */
export function applyBrushedFinish(
  material: THREE.MeshStandardMaterial,
  intensity: 'light' | 'medium' | 'heavy' = 'medium'
): THREE.MeshStandardMaterial {
  const roughnessAdd: Record<string, number> = {
    light: 0.15,
    medium: 0.25,
    heavy: 0.35,
  };
  
  material.roughness = Math.min(1, material.roughness + roughnessAdd[intensity]);
  material.envMapIntensity = Math.max(0.5, material.envMapIntensity - 0.3);
  
  return material;
}

/**
 * Apply a hammered finish to a metal material.
 */
export function applyHammeredFinish(
  material: THREE.MeshStandardMaterial
): THREE.MeshStandardMaterial {
  material.roughness = Math.min(1, material.roughness + 0.3);
  material.envMapIntensity = Math.max(0.5, material.envMapIntensity - 0.4);
  
  return material;
}

/**
 * Apply an antique/oxidized finish.
 */
export function applyAntiqueFinish(
  material: THREE.MeshStandardMaterial,
  metalType: 'gold' | 'silver' | 'bronze' = 'silver'
): THREE.MeshStandardMaterial {
  // Darken the color
  const color = new THREE.Color(material.color);
  color.multiplyScalar(0.7);
  material.color = color;
  
  // Increase roughness
  material.roughness = Math.min(1, material.roughness + 0.2);
  material.envMapIntensity = Math.max(0.3, material.envMapIntensity - 0.5);
  
  return material;
}

// ============================================
// MATERIAL FACTORY
// ============================================

/**
 * Create a metal material from a material ID.
 */
export function createMetalMaterialById(materialId: string): THREE.MeshStandardMaterial | null {
  const materialInfo = getMaterialById(materialId);
  if (!materialInfo) {
    console.warn(`[MetalMaterials] Material not found: ${materialId}`);
    return null;
  }
  
  // Route to appropriate material creator
  switch (materialId) {
    // Yellow Gold
    case 'gold-24k':
      return createYellowGoldMaterial('24k');
    case 'gold-22k':
      return createYellowGoldMaterial('22k');
    case 'gold-18k':
      return createYellowGoldMaterial('18k');
    case 'gold-14k':
      return createYellowGoldMaterial('14k');
    case 'gold-9k':
      return createYellowGoldMaterial('9k');
    
    // White Gold
    case 'white-gold-18k':
      return createWhiteGoldMaterial('18k');
    case 'white-gold-14k':
      return createWhiteGoldMaterial('14k');
    
    // Rose Gold
    case 'rose-gold-18k':
      return createRoseGoldMaterial('18k');
    case 'rose-gold-14k':
      return createRoseGoldMaterial('14k');
    
    // Silver
    case 'silver-925':
      return createSterlingSilverMaterial();
    case 'silver-999':
      return createFineSilverMaterial();
    
    // Platinum
    case 'platinum-950':
      return createPlatinumMaterial('950');
    case 'platinum-900':
      return createPlatinumMaterial('900');
    case 'palladium':
      return createPalladiumMaterial();
    
    // Base Metals
    case 'brass':
      return createBrassMaterial();
    case 'bronze':
      return createBronzeMaterial();
    case 'copper':
      return createCopperMaterial();
    case 'titanium':
      return createTitaniumMaterial();
    case 'stainless-steel':
      return createStainlessSteelMaterial();
    
    // Generic fallback using material info
    default:
      return createGenericMetalMaterial(materialInfo);
  }
}

/**
 * Create a generic metal material from MaterialInfo.
 */
function createGenericMetalMaterial(info: MaterialInfo): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: info.color,
    metalness: info.metalness,
    roughness: info.roughness,
    envMapIntensity: info.envMapIntensity,
  });
}

export default {
  createYellowGoldMaterial,
  createWhiteGoldMaterial,
  createRoseGoldMaterial,
  createSterlingSilverMaterial,
  createFineSilverMaterial,
  createPlatinumMaterial,
  createPalladiumMaterial,
  createBrassMaterial,
  createBronzeMaterial,
  createCopperMaterial,
  createTitaniumMaterial,
  createStainlessSteelMaterial,
  applyBrushedFinish,
  applyHammeredFinish,
  applyAntiqueFinish,
  createMetalMaterialById,
};
