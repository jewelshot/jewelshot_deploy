/**
 * Weight Calculator
 * 
 * Calculates weight for 3D jewelry models:
 * - Metal weight in grams
 * - Stone weight in carats
 * - Volume calculation using signed tetrahedron method
 */

import * as THREE from 'three';
import { MaterialInfo, getMaterialById } from './materials-database';

// ============================================
// TYPES
// ============================================

export interface VolumeResult {
  volumeMm3: number;
  volumeCm3: number;
  boundingBox: {
    x: number;
    y: number;
    z: number;
  };
  triangleCount: number;
}

export interface WeightResult {
  volumeMm3: number;
  volumeCm3: number;
  weightGrams: number;
  weightCarats?: number; // For stones only
  weightOunces?: number; // Troy ounces for precious metals
  material: MaterialInfo;
  priceEstimate?: {
    metalPrice: number; // Price per gram
    totalPrice: number;
    currency: string;
  };
}

export interface LayerWeightResult {
  layerId: string;
  layerName: string;
  category: 'metal' | 'stone' | 'unknown';
  material: MaterialInfo;
  weight: WeightResult;
}

export interface TotalWeightSummary {
  totalMetalGrams: number;
  totalStoneCarats: number;
  layers: LayerWeightResult[];
  breakdown: {
    metals: Array<{ materialId: string; name: string; grams: number }>;
    stones: Array<{ materialId: string; name: string; carats: number }>;
  };
}

// ============================================
// VOLUME CALCULATION
// ============================================

/**
 * Calculate signed volume of a tetrahedron formed by a triangle and the origin.
 * Formula: V = (v1 · (v2 × v3)) / 6
 */
function signedVolumeOfTriangle(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  v3: THREE.Vector3
): number {
  const cross = new THREE.Vector3().crossVectors(v2, v3);
  return v1.dot(cross) / 6.0;
}

/**
 * Calculate the volume of a mesh using the signed tetrahedron volume method.
 * This is the same algorithm used by professional CAD software (Rhino, SolidWorks).
 * 
 * For each triangle in the mesh, calculate the signed volume of the tetrahedron
 * formed with the origin. The sum of all signed volumes gives the total volume.
 * 
 * @param geometry - THREE.BufferGeometry mesh
 * @returns Volume in mm³ (assuming model is in mm units)
 */
export function calculateMeshVolume(geometry: THREE.BufferGeometry): VolumeResult {
  const position = geometry.attributes.position;
  
  if (!position) {
    return {
      volumeMm3: 0,
      volumeCm3: 0,
      boundingBox: { x: 0, y: 0, z: 0 },
      triangleCount: 0,
    };
  }

  let totalVolume = 0;
  let triangleCount = 0;
  
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();
  const v3 = new THREE.Vector3();

  // Check if geometry has indices
  if (geometry.index) {
    const indices = geometry.index.array;
    triangleCount = indices.length / 3;
    
    for (let i = 0; i < indices.length; i += 3) {
      v1.fromBufferAttribute(position, indices[i]);
      v2.fromBufferAttribute(position, indices[i + 1]);
      v3.fromBufferAttribute(position, indices[i + 2]);
      
      totalVolume += signedVolumeOfTriangle(v1, v2, v3);
    }
  } else {
    // Non-indexed geometry
    triangleCount = position.count / 3;
    
    for (let i = 0; i < position.count; i += 3) {
      v1.fromBufferAttribute(position, i);
      v2.fromBufferAttribute(position, i + 1);
      v3.fromBufferAttribute(position, i + 2);
      
      totalVolume += signedVolumeOfTriangle(v1, v2, v3);
    }
  }

  // Ensure positive volume
  const volumeMm3 = Math.abs(totalVolume);
  const volumeCm3 = volumeMm3 / 1000; // mm³ to cm³

  // Calculate bounding box for dimensions
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const boundingBox = box ? {
    x: box.max.x - box.min.x,
    y: box.max.y - box.min.y,
    z: box.max.z - box.min.z,
  } : { x: 0, y: 0, z: 0 };

  return {
    volumeMm3,
    volumeCm3,
    boundingBox,
    triangleCount,
  };
}

// ============================================
// WEIGHT CALCULATION
// ============================================

/**
 * Calculate weight from volume and material density.
 * 
 * For metals: Weight (g) = Volume (cm³) × Density (g/cm³)
 * For stones: Weight (ct) = Weight (g) / 0.2 (1 carat = 0.2 grams)
 */
export function calculateWeight(
  volumeMm3: number,
  material: MaterialInfo
): WeightResult {
  const volumeCm3 = volumeMm3 / 1000; // mm³ → cm³
  const weightGrams = volumeCm3 * material.density;
  
  const result: WeightResult = {
    volumeMm3,
    volumeCm3,
    weightGrams,
    material,
  };
  
  // Add carat calculation for stones
  if (material.type === 'stone' || material.type === 'organic') {
    result.weightCarats = weightGrams / 0.2; // 1 carat = 0.2g
  }
  
  // Add troy ounce for precious metals
  if (material.type === 'metal') {
    result.weightOunces = weightGrams / 31.1035; // 1 troy oz = 31.1035g
  }
  
  return result;
}

/**
 * Calculate weight for a geometry with a specific material ID.
 */
export function calculateGeometryWeight(
  geometry: THREE.BufferGeometry,
  materialId: string
): WeightResult | null {
  const material = getMaterialById(materialId);
  if (!material) {
    console.warn(`[WeightCalculator] Material not found: ${materialId}`);
    return null;
  }
  
  const volumeResult = calculateMeshVolume(geometry);
  return calculateWeight(volumeResult.volumeMm3, material);
}

// ============================================
// MULTI-LAYER WEIGHT SUMMARY
// ============================================

export interface LayerInput {
  layerId: string;
  layerName: string;
  geometry: THREE.BufferGeometry;
  materialId: string;
  category: 'metal' | 'stone' | 'unknown';
}

/**
 * Calculate weights for multiple layers and generate a summary.
 */
export function calculateTotalWeight(layers: LayerInput[]): TotalWeightSummary {
  const results: LayerWeightResult[] = [];
  
  let totalMetalGrams = 0;
  let totalStoneCarats = 0;
  
  const metalBreakdown: Map<string, { name: string; grams: number }> = new Map();
  const stoneBreakdown: Map<string, { name: string; carats: number }> = new Map();
  
  for (const layer of layers) {
    const material = getMaterialById(layer.materialId);
    if (!material) {
      console.warn(`[WeightCalculator] Skipping layer "${layer.layerName}": material not found`);
      continue;
    }
    
    const volumeResult = calculateMeshVolume(layer.geometry);
    const weightResult = calculateWeight(volumeResult.volumeMm3, material);
    
    results.push({
      layerId: layer.layerId,
      layerName: layer.layerName,
      category: layer.category,
      material,
      weight: weightResult,
    });
    
    // Aggregate totals
    if (material.type === 'metal') {
      totalMetalGrams += weightResult.weightGrams;
      
      const existing = metalBreakdown.get(material.id);
      if (existing) {
        existing.grams += weightResult.weightGrams;
      } else {
        metalBreakdown.set(material.id, {
          name: material.name,
          grams: weightResult.weightGrams,
        });
      }
    } else if (material.type === 'stone' || material.type === 'organic') {
      const carats = weightResult.weightCarats || 0;
      totalStoneCarats += carats;
      
      const existing = stoneBreakdown.get(material.id);
      if (existing) {
        existing.carats += carats;
      } else {
        stoneBreakdown.set(material.id, {
          name: material.name,
          carats,
        });
      }
    }
  }
  
  return {
    totalMetalGrams,
    totalStoneCarats,
    layers: results,
    breakdown: {
      metals: Array.from(metalBreakdown.entries()).map(([materialId, data]) => ({
        materialId,
        name: data.name,
        grams: data.grams,
      })),
      stones: Array.from(stoneBreakdown.entries()).map(([materialId, data]) => ({
        materialId,
        name: data.name,
        carats: data.carats,
      })),
    },
  };
}

// ============================================
// UNIT CONVERSION UTILITIES
// ============================================

export const UNIT_CONVERSIONS = {
  // Volume
  mm3ToCm3: (mm3: number) => mm3 / 1000,
  cm3ToMm3: (cm3: number) => cm3 * 1000,
  mm3ToInch3: (mm3: number) => mm3 / 16387.064,
  
  // Weight
  gramsToOz: (g: number) => g / 31.1035, // Troy ounce
  gramsToCarats: (g: number) => g / 0.2,
  caratsToGrams: (ct: number) => ct * 0.2,
  gramsToGrains: (g: number) => g * 15.4324, // For precision weighing
  
  // Length
  mmToInch: (mm: number) => mm / 25.4,
  inchToMm: (inch: number) => inch * 25.4,
};

/**
 * Format weight for display
 */
export function formatWeight(grams: number, precision: number = 2): string {
  if (grams < 0.001) {
    return '< 0.001 g';
  }
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(precision)} kg`;
  }
  return `${grams.toFixed(precision)} g`;
}

/**
 * Format carats for display
 */
export function formatCarats(carats: number, precision: number = 2): string {
  if (carats < 0.001) {
    return '< 0.001 ct';
  }
  if (carats < 0.01) {
    // Use points for small stones (1 point = 0.01 carat)
    const points = Math.round(carats * 100);
    return `${points} pt`;
  }
  return `${carats.toFixed(precision)} ct`;
}

/**
 * Format volume for display
 */
export function formatVolume(mm3: number, precision: number = 2): string {
  if (mm3 < 0.001) {
    return '< 0.001 mm³';
  }
  if (mm3 >= 1000) {
    return `${(mm3 / 1000).toFixed(precision)} cm³`;
  }
  return `${mm3.toFixed(precision)} mm³`;
}

/**
 * Format dimensions for display
 */
export function formatDimensions(
  dims: { x: number; y: number; z: number },
  precision: number = 2
): string {
  return `${dims.x.toFixed(precision)} × ${dims.y.toFixed(precision)} × ${dims.z.toFixed(precision)} mm`;
}

export default {
  calculateMeshVolume,
  calculateWeight,
  calculateGeometryWeight,
  calculateTotalWeight,
  formatWeight,
  formatCarats,
  formatVolume,
  formatDimensions,
  UNIT_CONVERSIONS,
};
