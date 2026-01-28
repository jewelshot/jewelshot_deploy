/**
 * Camera Presets for 3D Viewer
 * 
 * Pre-defined camera positions for common views
 */

import * as THREE from 'three';

// ============================================
// TYPES
// ============================================

export interface CameraViewPreset {
  id: string;
  name: string;
  nameTr: string;
  icon: string;
  // Position relative to model center
  position: THREE.Vector3;
  // Target (look-at) point
  target: THREE.Vector3;
  // Camera settings
  fov?: number;
  zoom?: number;
  // Description
  description: string;
  descriptionTr: string;
}

export interface CameraSettings {
  fov: number;
  near: number;
  far: number;
  zoom: number;
  // Limits
  minDistance: number;
  maxDistance: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  // Damping
  enableDamping: boolean;
  dampingFactor: number;
  // Pan
  enablePan: boolean;
  panSpeed: number;
  // Zoom
  enableZoom: boolean;
  zoomSpeed: number;
  // Rotate
  enableRotate: boolean;
  rotateSpeed: number;
}

// ============================================
// CAMERA VIEW PRESETS
// ============================================

export const CAMERA_VIEW_PRESETS: CameraViewPreset[] = [
  {
    id: 'front',
    name: 'Front',
    nameTr: 'Ön',
    icon: '⬛',
    position: new THREE.Vector3(0, 0, 5),
    target: new THREE.Vector3(0, 0, 0),
    description: 'View from the front',
    descriptionTr: 'Önden görünüm',
  },
  {
    id: 'back',
    name: 'Back',
    nameTr: 'Arka',
    icon: '⬜',
    position: new THREE.Vector3(0, 0, -5),
    target: new THREE.Vector3(0, 0, 0),
    description: 'View from the back',
    descriptionTr: 'Arkadan görünüm',
  },
  {
    id: 'left',
    name: 'Left',
    nameTr: 'Sol',
    icon: '◀',
    position: new THREE.Vector3(-5, 0, 0),
    target: new THREE.Vector3(0, 0, 0),
    description: 'View from the left',
    descriptionTr: 'Soldan görünüm',
  },
  {
    id: 'right',
    name: 'Right',
    nameTr: 'Sağ',
    icon: '▶',
    position: new THREE.Vector3(5, 0, 0),
    target: new THREE.Vector3(0, 0, 0),
    description: 'View from the right',
    descriptionTr: 'Sağdan görünüm',
  },
  {
    id: 'top',
    name: 'Top',
    nameTr: 'Üst',
    icon: '🔼',
    position: new THREE.Vector3(0, 5, 0),
    target: new THREE.Vector3(0, 0, 0),
    description: 'View from above',
    descriptionTr: 'Üstten görünüm',
  },
  {
    id: 'bottom',
    name: 'Bottom',
    nameTr: 'Alt',
    icon: '🔽',
    position: new THREE.Vector3(0, -5, 0),
    target: new THREE.Vector3(0, 0, 0),
    description: 'View from below',
    descriptionTr: 'Alttan görünüm',
  },
  {
    id: 'three-quarter',
    name: '3/4 View',
    nameTr: '3/4 Görünüm',
    icon: '◢',
    position: new THREE.Vector3(3.5, 2.5, 3.5),
    target: new THREE.Vector3(0, 0, 0),
    description: 'Classic 3/4 view',
    descriptionTr: 'Klasik 3/4 görünüm',
  },
  {
    id: 'hero',
    name: 'Hero Shot',
    nameTr: 'Kahraman Çekim',
    icon: '🌟',
    position: new THREE.Vector3(2.5, 1.5, 4),
    target: new THREE.Vector3(0, 0.3, 0),
    fov: 35,
    description: 'Dramatic hero angle',
    descriptionTr: 'Dramatik kahraman açısı',
  },
  {
    id: 'low-angle',
    name: 'Low Angle',
    nameTr: 'Alçak Açı',
    icon: '📐',
    position: new THREE.Vector3(3, -1, 3),
    target: new THREE.Vector3(0, 0.5, 0),
    description: 'Looking up at the model',
    descriptionTr: 'Modele aşağıdan bakış',
  },
  {
    id: 'close-up',
    name: 'Close-up',
    nameTr: 'Yakın Çekim',
    icon: '🔍',
    position: new THREE.Vector3(0, 0, 2),
    target: new THREE.Vector3(0, 0, 0),
    fov: 30,
    description: 'Detailed close-up view',
    descriptionTr: 'Detaylı yakın görünüm',
  },
];

// ============================================
// DEFAULT CAMERA SETTINGS
// ============================================

export const DEFAULT_CAMERA_SETTINGS: CameraSettings = {
  fov: 50,
  near: 0.01,
  far: 1000,
  zoom: 1,
  minDistance: 0.5,
  maxDistance: 100,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI,
  enableDamping: true,
  dampingFactor: 0.05,
  enablePan: true,
  panSpeed: 0.5,
  enableZoom: true,
  zoomSpeed: 0.8,
  enableRotate: true,
  rotateSpeed: 0.5,
};

// ============================================
// FOCAL LENGTH PRESETS (for photography-like feel)
// ============================================

export interface FocalLengthPreset {
  id: string;
  name: string;
  focalLength: number; // in mm
  fov: number; // equivalent FOV in degrees
  description: string;
}

export const FOCAL_LENGTH_PRESETS: FocalLengthPreset[] = [
  { id: 'ultra-wide', name: '14mm Ultra Wide', focalLength: 14, fov: 104, description: 'Dramatic wide angle' },
  { id: 'wide', name: '24mm Wide', focalLength: 24, fov: 84, description: 'Wide angle' },
  { id: 'standard', name: '35mm Standard', focalLength: 35, fov: 63, description: 'Standard view' },
  { id: 'normal', name: '50mm Normal', focalLength: 50, fov: 47, description: 'Natural perspective' },
  { id: 'portrait', name: '85mm Portrait', focalLength: 85, fov: 28, description: 'Classic portrait' },
  { id: 'tele', name: '135mm Telephoto', focalLength: 135, fov: 18, description: 'Compressed perspective' },
  { id: 'macro', name: '200mm Macro', focalLength: 200, fov: 12, description: 'Tight detail shot' },
];

/**
 * Convert focal length to FOV
 * Based on 35mm full-frame sensor (36mm x 24mm)
 */
export function focalLengthToFOV(focalLength: number): number {
  // Diagonal of 35mm sensor
  const diagonal = Math.sqrt(36 * 36 + 24 * 24);
  // Calculate FOV
  return 2 * Math.atan(diagonal / (2 * focalLength)) * (180 / Math.PI);
}

/**
 * Convert FOV to focal length
 */
export function fovToFocalLength(fov: number): number {
  const diagonal = Math.sqrt(36 * 36 + 24 * 24);
  return diagonal / (2 * Math.tan((fov * Math.PI / 180) / 2));
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getCameraPresetById(id: string): CameraViewPreset | undefined {
  return CAMERA_VIEW_PRESETS.find((p) => p.id === id);
}

export function getFocalLengthPresetById(id: string): FocalLengthPreset | undefined {
  return FOCAL_LENGTH_PRESETS.find((p) => p.id === id);
}

/**
 * Calculate camera position for a given model bounding box
 * Ensures the entire model fits in view
 */
export function calculateCameraPositionForModel(
  boundingBox: THREE.Box3,
  preset: CameraViewPreset,
  fov: number = 50
): THREE.Vector3 {
  const size = boundingBox.getSize(new THREE.Vector3());
  const center = boundingBox.getCenter(new THREE.Vector3());
  
  // Calculate max dimension
  const maxDim = Math.max(size.x, size.y, size.z);
  
  // Calculate distance needed to fit model in view
  const fovRad = (fov * Math.PI) / 180;
  const distance = (maxDim / 2) / Math.tan(fovRad / 2) * 1.5; // 1.5x for padding
  
  // Scale preset position to distance
  const direction = preset.position.clone().normalize();
  const position = direction.multiplyScalar(distance).add(center);
  
  return position;
}

export default {
  CAMERA_VIEW_PRESETS,
  DEFAULT_CAMERA_SETTINGS,
  FOCAL_LENGTH_PRESETS,
  focalLengthToFOV,
  fovToFocalLength,
  getCameraPresetById,
  getFocalLengthPresetById,
  calculateCameraPositionForModel,
};
