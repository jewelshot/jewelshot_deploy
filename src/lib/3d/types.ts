/**
 * 3D Viewer Types
 * 
 * Atomic Architecture: Shared types for 3D viewer components
 */

import * as THREE from 'three';

// ============================================
// TRANSFORM TYPES
// ============================================

export interface Vector3Values {
  x: number;
  y: number;
  z: number;
}

export interface TransformState {
  position: Vector3Values;
  rotation: Vector3Values; // in degrees
  scale: Vector3Values;
}

export interface FlipState {
  x: boolean;
  y: boolean;
  z: boolean;
  normals: boolean;
}

// ============================================
// LAYER TYPES
// ============================================

export type LayerCategory = 'metal' | 'stone' | 'setting' | 'other' | 'unknown';

export interface ModelLayer {
  id: string;
  name: string;
  visible: boolean;
  geometry: THREE.BufferGeometry;
  materialId: string;
  color: string;
  category: LayerCategory;
  confidence: number;
  volumeInfo?: {
    volume: number;
    weight: number;
    carats?: number;
  } | null;
  // Transform per layer (optional)
  transform?: TransformState;
}

export interface LayerGroup {
  id: string;
  name: string;
  category: LayerCategory;
  layers: ModelLayer[];
  expanded: boolean;
  visible: boolean;
}

// ============================================
// MATERIAL TYPES
// ============================================

export interface MaterialPreset {
  id: string;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  transmission?: number;
  ior?: number;
  thickness?: number;
  dispersion?: number;
}

export type MaterialCategory = 'metal' | 'stone' | 'matte' | 'custom';

// ============================================
// LIGHTING TYPES
// ============================================

export interface LightConfig {
  id: string;
  type: 'point' | 'spot' | 'directional' | 'ambient';
  color: string;
  intensity: number;
  position: Vector3Values;
  castShadow: boolean;
  // Spot-specific
  angle?: number;
  penumbra?: number;
  // Shadow settings
  shadowIntensity?: number;
  shadowBlur?: number;
}

export interface StudioPreset {
  id: string;
  name: string;
  backgroundColor: string;
  lights: LightConfig[];
}

// ============================================
// GROUND PLANE TYPES
// ============================================

export interface GroundPlaneConfig {
  visible: boolean;
  color: string;
  opacity: number;
  reflection: boolean;
  reflectionIntensity: number;
  grid: boolean;
  gridColor: string;
  receiveShadow: boolean;
}

// ============================================
// BACKGROUND TYPES
// ============================================

export type BackgroundType = 'color' | 'gradient' | 'hdri' | 'transparent';

export interface BackgroundConfig {
  type: BackgroundType;
  color: string;
  gradientStart?: string;
  gradientEnd?: string;
  hdriPath?: string;
  hdriIntensity?: number;
  hdriRotation?: number;
  hdriBlur?: number;
}

// ============================================
// CAMERA TYPES
// ============================================

export type CameraPreset = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | '3/4' | 'custom';

export interface CameraConfig {
  fov: number;
  near: number;
  far: number;
  position: Vector3Values;
  target: Vector3Values;
  orthographic: boolean;
}

// ============================================
// QUALITY TYPES
// ============================================

export type QualityLevel = 'low' | 'medium' | 'high' | 'ultra';

export interface QualityConfig {
  level: QualityLevel;
  pixelRatio: number;
  shadowMapSize: number;
  antiAliasing: boolean;
  subdivision: number; // 0-4
  preserveQualityDuringInteraction: boolean;
}

// ============================================
// AUTO-ROTATE TYPES
// ============================================

export interface AutoRotateConfig {
  enabled: boolean;
  speed: number; // degrees per second
  axis: 'x' | 'y' | 'z';
  oscillation: boolean;
  pauseOnHover: boolean;
}

// ============================================
// VIEWER STATE
// ============================================

export interface ViewerState {
  // Model
  modelLoaded: boolean;
  fileName: string | null;
  format: string | null;
  
  // Transform
  transform: TransformState;
  flip: FlipState;
  
  // Layers
  layers: ModelLayer[];
  layerGroups: LayerGroup[];
  selectedLayerId: string | null;
  
  // Visual
  background: BackgroundConfig;
  groundPlane: GroundPlaneConfig;
  quality: QualityConfig;
  autoRotate: AutoRotateConfig;
  
  // Camera
  camera: CameraConfig;
  
  // Lights
  lights: LightConfig[];
  
  // UI
  showGrid: boolean;
  showGizmo: boolean;
  fullscreen: boolean;
}

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_TRANSFORM: TransformState = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
};

export const DEFAULT_FLIP: FlipState = {
  x: false,
  y: false,
  z: false,
  normals: false,
};

export const DEFAULT_GROUND_PLANE: GroundPlaneConfig = {
  visible: false,
  color: '#1a1a1a',
  opacity: 1,
  reflection: true,
  reflectionIntensity: 0.5,
  grid: false,
  gridColor: '#333333',
  receiveShadow: true,
};

export const DEFAULT_BACKGROUND: BackgroundConfig = {
  type: 'color',
  color: '#1a1a1a',
};

export const DEFAULT_QUALITY: QualityConfig = {
  level: 'high',
  pixelRatio: 1.5,
  shadowMapSize: 2048,
  antiAliasing: true,
  subdivision: 0,
  preserveQualityDuringInteraction: true,
};

export const DEFAULT_AUTO_ROTATE: AutoRotateConfig = {
  enabled: false,
  speed: 30,
  axis: 'y',
  oscillation: false,
  pauseOnHover: true,
};

export const DEFAULT_CAMERA: CameraConfig = {
  fov: 50,
  near: 0.1,
  far: 1000,
  position: { x: 0, y: 0, z: 10 },
  target: { x: 0, y: 0, z: 0 },
  orthographic: false,
};

// ============================================
// PRESET COLORS
// ============================================

export const BACKGROUND_PRESET_COLORS = [
  { id: 'black', color: '#000000', name: 'Black' },
  { id: 'dark-gray', color: '#1a1a1a', name: 'Dark Gray' },
  { id: 'gray', color: '#333333', name: 'Gray' },
  { id: 'medium-gray', color: '#666666', name: 'Medium Gray' },
  { id: 'light-gray', color: '#999999', name: 'Light Gray' },
  { id: 'off-white', color: '#e0e0e0', name: 'Off White' },
  { id: 'white', color: '#ffffff', name: 'White' },
  { id: 'cream', color: '#faf5f0', name: 'Cream' },
  { id: 'warm-white', color: '#fff8e8', name: 'Warm White' },
  { id: 'cool-white', color: '#f0f5fa', name: 'Cool White' },
  { id: 'navy', color: '#0a1628', name: 'Navy' },
  { id: 'burgundy', color: '#2d1a1a', name: 'Burgundy' },
  { id: 'forest', color: '#1a2d1a', name: 'Forest' },
];

export const GROUND_PRESET_COLORS = [
  { id: 'dark', color: '#1a1a1a', name: 'Dark' },
  { id: 'gray', color: '#333333', name: 'Gray' },
  { id: 'light', color: '#e0e0e0', name: 'Light' },
  { id: 'white', color: '#ffffff', name: 'White' },
  { id: 'mirror', color: '#000000', name: 'Mirror' },
];
