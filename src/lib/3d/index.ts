/**
 * 3D Library Index
 * 
 * Central export for all 3D-related utilities:
 * - Rhino3dm loader for 3DM files
 * - Layer detection and categorization
 * - Weight calculation (metals in grams, stones in carats)
 * - Material database and creators
 */

// ============================================
// RHINO3DM LOADER (Types only - actual loader is dynamically imported)
// ============================================
export type {
  RhinoLayer,
  RhinoObject,
  Rhino3dmDocument,
} from './rhino-loader';

// Re-export functions that will be dynamically imported at runtime
export {
  getSupportedExtensions,
  is3DMFile,
} from './rhino-loader';

// These functions should be dynamically imported:
// import { parse3DMFile, initRhino3dm } from '@/lib/3d/rhino-loader';

// ============================================
// LAYER DETECTION
// ============================================
export {
  detectLayerType,
  detectAllLayerTypes,
  getCategoryLabel,
  type LayerCategory,
  type DetectionResult,
} from './layer-detector';

// ============================================
// WEIGHT CALCULATION
// ============================================
export {
  calculateMeshVolume,
  calculateWeight,
  calculateGeometryWeight,
  calculateTotalWeight,
  formatWeight,
  formatCarats,
  formatVolume,
  formatDimensions,
  UNIT_CONVERSIONS,
  type VolumeResult,
  type WeightResult,
  type LayerWeightResult,
  type TotalWeightSummary,
  type LayerInput,
} from './weight-calculator';

// ============================================
// MATERIALS DATABASE
// ============================================
export {
  METALS,
  GEMSTONES,
  SYNTHETIC_MATERIALS,
  getMaterialById,
  getMaterialsByType,
  getMetals,
  getGemstones,
  getAllMaterials,
  getMetalsByCategory,
  getGemstonesByCategory,
  type MaterialInfo,
  type MaterialType,
} from './materials-database';

// ============================================
// GEMSTONE MATERIALS
// ============================================
export {
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
  type GemMaterialOptions,
} from './materials/gem-materials';

// ============================================
// METAL MATERIALS
// ============================================
export {
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
  type MetalMaterialOptions,
} from './materials/metal-materials';

// ============================================
// UTILITY: Create material by ID (auto-detect type)
// ============================================
import { 
  getMaterialById as getMaterial,
  getMaterialById,
  getAllMaterials,
  getMetals,
  getGemstones,
} from './materials-database';
import { createMetalMaterialById } from './materials/metal-materials';
import { createGemMaterialById } from './materials/gem-materials';
import { is3DMFile } from './rhino-loader';
import { detectLayerType, detectAllLayerTypes } from './layer-detector';
import { 
  calculateMeshVolume,
  calculateWeight,
  calculateTotalWeight,
  formatWeight,
  formatCarats,
} from './weight-calculator';
import * as THREE from 'three';

/**
 * Create a Three.js material from a material ID.
 * Automatically detects whether it's a metal or gemstone.
 */
export function createMaterialById(materialId: string): THREE.Material | null {
  const info = getMaterial(materialId);
  if (!info) {
    console.warn(`[3D] Material not found: ${materialId}`);
    return null;
  }
  
  if (info.type === 'metal') {
    return createMetalMaterialById(materialId);
  } else if (info.type === 'stone' || info.type === 'organic') {
    return createGemMaterialById(materialId);
  } else {
    // Synthetic/matte materials - use standard material
    return new THREE.MeshStandardMaterial({
      color: info.color,
      metalness: info.metalness,
      roughness: info.roughness,
      envMapIntensity: info.envMapIntensity,
    });
  }
}

// ============================================
// DEFAULT EXPORT
// ============================================
export default {
  // Loader - use dynamic import: import('@/lib/3d/rhino-loader')
  is3DMFile,
  
  // Detection
  detectLayerType,
  detectAllLayerTypes,
  
  // Weight
  calculateMeshVolume,
  calculateWeight,
  calculateTotalWeight,
  formatWeight,
  formatCarats,
  
  // Materials
  getMaterialById,
  getAllMaterials,
  getMetals,
  getGemstones,
  createMaterialById,
};
