/**
 * ThreeDViewContent - 3D Model Viewer
 * 
 * Features:
 * - STL and 3DM file support
 * - Mouse controls (orbit, pan, zoom)
 * - Layer management for 3DM files
 * - Material assignment (metals, stones)
 * - Snapshot export
 * - Progressive resolution rendering (KeyShot-like)
 * - Object picking with orange outline selection
 */

'use client';

import React, { useState, useRef, useCallback, Suspense, useEffect, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Environment, Grid, GizmoHelper, GizmoViewport, Lightformer, TransformControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import { LoopSubdivision } from 'three-subdivide';
import {
  Upload,
  Box,
  RotateCcw,
  Camera,
  Compass,
  Download,
  Layers,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RefreshCw,
  Trash2,
  Grid3X3,
  Loader2,
  X,
  Check,
  Circle,
  ZoomIn,
  ZoomOut,
  Image,
  Sun,
  Moon,
  Palette,
  Info,
  Focus,
  Maximize2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  MousePointer2,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useObjectPicker } from '@/hooks/useObjectPicker';
import { SelectionOutline } from '@/components/organisms/canvas/SelectionOutline';
import { Accordion } from '@/components/atoms/Accordion';
import { ExportPanel } from '@/components/molecules/3d/ExportPanel';
import { 
  type ScreenshotConfig, 
  type VideoConfig, 
  type MultiAngleConfig,
  downloadBlob,
  generateFilename,
} from '@/lib/3d/export-utils';
import { 
  exportTurntableVideo,
  type FrameCaptureProgress,
} from '@/lib/3d/video-export';

// New organized right panel
import { ThreeDRightPanel } from '@/components/organisms/ThreeDRightPanel';
import { GroundPlane, DEFAULT_GROUND_CONFIG, type GroundPlaneConfig } from '@/components/molecules/3d/GroundPlane';
import { DEFAULT_LIGHTING_CONFIG, type LightingConfig } from '@/components/molecules/3d/LightingPanel';
import { DEFAULT_BACKGROUND_CONFIG, type BackgroundConfig } from '@/components/molecules/3d/BackgroundPanel';
import { DEFAULT_EDGE_SMOOTHING_CONFIG, type EdgeSmoothingConfig } from '@/components/molecules/3d/EdgeSmoothingPanel';
import { DEFAULT_HDR_CONFIG, type HDRConfig } from '@/components/molecules/3d/HDRPanel';
import { DEFAULT_DIAMOND_CONFIG, type DiamondConfig } from '@/components/molecules/3d/DiamondPanel';
import { DEFAULT_POST_PROCESSING_CONFIG, type PostProcessingConfig, PostProcessingEffects } from '@/components/molecules/3d';
import { METAL_PRESETS as MATERIAL_METAL_PRESETS, type MaterialConfig } from '@/components/molecules/3d/MaterialEditor';
import { DEFAULT_VIDEO_CONFIG, type VideoExportConfig, type RecordingState } from '@/components/molecules/3d/VideoExportPanel';
import { DEFAULT_TURNTABLE_CONFIG, type TurntableConfig } from '@/components/molecules/3d/TurntableController';
import { DEFAULT_BATCH_CONFIG, type BatchExportConfig, type BatchExportProgress } from '@/components/molecules/3d/BatchExportPanel';
// NEW panels
import { DEFAULT_MEASUREMENT_CONFIG, type MeasurementConfig, type Dimensions3D } from '@/components/molecules/3d/MeasurementPanel';
import { DEFAULT_VIEW_CONFIG, type ViewConfig, type CameraPreset } from '@/components/molecules/3d/ViewPanel';
import { DEFAULT_FOCUS_CONFIG, type FocusConfig } from '@/components/molecules/3d/FocusPanel';
import { DEFAULT_ANNOTATION_CONFIG, type AnnotationConfig, type AnnotationType } from '@/components/molecules/3d/AnnotationPanel';
import { DEFAULT_TRANSFORM_ADVANCED_CONFIG, type TransformAdvancedConfig } from '@/components/molecules/3d/TransformPanelAdvanced';
import { DEFAULT_TRANSFORM, DEFAULT_FLIP, type TransformState, type FlipState } from '@/lib/3d/types';
import { DEFAULT_CAMERA_SETTINGS, type CameraSettings, type CameraViewPreset, CAMERA_VIEW_PRESETS } from '@/lib/3d/camera-presets';
import { type LayerItem, type LayerCategory } from '@/components/molecules/3d/LayerGroupPanel';
import { type SelectedEnvironment } from '@/components/molecules/3d/EnvironmentPicker';
import { type OrientationConfig } from '@/components/molecules/3d/OrientationModal';
import { DEFAULT_DIAMOND_EFFECTS, type DiamondEffectConfig } from '@/lib/3d/diamond-effects';

// Rhino3dm - Will be loaded dynamically when needed
// Note: 3DM support requires additional setup due to WASM complexity

// Types
interface ModelLayer {
  id: string;
  name: string;
  visible: boolean;
  geometry: THREE.BufferGeometry;
  materialId: string;
  color: string;
  category?: 'metal' | 'stone' | 'setting' | 'unknown';
  confidence?: number;
  volumeInfo?: {
    volume: number;
    weight: number;
    carats?: number;
  } | null;
}

interface MaterialPreset {
  id: string;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
  // Advanced properties (optional for backwards compatibility)
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  thickness?: number;
  ior?: number;
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: string;
  anisotropy?: number;
  anisotropyRotation?: number;
  iridescence?: number;
  iridescenceIOR?: number;
  specularIntensity?: number;
  specularColor?: string;
  emissive?: string;
  emissiveIntensity?: number;
  flatShading?: boolean;
  wireframe?: boolean;
  transparent?: boolean;
  opacity?: number;
}

// Metal material presets
const METAL_PRESETS: MaterialPreset[] = [
  { id: 'yellow-gold', name: 'Yellow Gold', color: '#D4AF37', metalness: 1, roughness: 0.15, envMapIntensity: 1.5 },
  { id: 'white-gold', name: 'White Gold', color: '#E8E8E8', metalness: 1, roughness: 0.1, envMapIntensity: 1.5 },
  { id: 'rose-gold', name: 'Rose Gold', color: '#B76E79', metalness: 1, roughness: 0.15, envMapIntensity: 1.5 },
  { id: 'platinum', name: 'Platinum', color: '#E5E4E2', metalness: 1, roughness: 0.08, envMapIntensity: 1.8 },
  { id: 'silver', name: 'Silver', color: '#C0C0C0', metalness: 1, roughness: 0.12, envMapIntensity: 1.6 },
];

// Stone material presets
const STONE_PRESETS: MaterialPreset[] = [
  { id: 'diamond', name: 'Diamond', color: '#E8F4F8', metalness: 0, roughness: 0, envMapIntensity: 2.5 },
  { id: 'ruby', name: 'Ruby', color: '#E0115F', metalness: 0, roughness: 0.05, envMapIntensity: 2 },
  { id: 'sapphire', name: 'Sapphire', color: '#0F52BA', metalness: 0, roughness: 0.05, envMapIntensity: 2 },
  { id: 'emerald', name: 'Emerald', color: '#50C878', metalness: 0, roughness: 0.08, envMapIntensity: 1.8 },
  { id: 'amethyst', name: 'Amethyst', color: '#9966CC', metalness: 0, roughness: 0.05, envMapIntensity: 1.8 },
];

// Matte / Resin material presets (for 3D printing visualization)
const MATTE_PRESETS: MaterialPreset[] = [
  { id: 'matte-gray', name: 'Matte Gray', color: '#808080', metalness: 0, roughness: 1, envMapIntensity: 0.3 },
  { id: 'matte-white', name: 'Matte White', color: '#E0E0E0', metalness: 0, roughness: 1, envMapIntensity: 0.3 },
  { id: 'resin-green', name: 'Resin Green', color: '#2E7D32', metalness: 0, roughness: 0.7, envMapIntensity: 0.5 },
  { id: 'resin-purple', name: 'Resin Purple', color: '#6A1B9A', metalness: 0, roughness: 0.7, envMapIntensity: 0.5 },
  { id: 'resin-blue', name: 'Resin Blue', color: '#1565C0', metalness: 0, roughness: 0.7, envMapIntensity: 0.5 },
  { id: 'resin-red', name: 'Resin Red', color: '#C62828', metalness: 0, roughness: 0.7, envMapIntensity: 0.5 },
  { id: 'wax-beige', name: 'Wax (Castable)', color: '#D4A574', metalness: 0, roughness: 0.85, envMapIntensity: 0.4 },
];

// HDR Environment presets
interface HDRPreset {
  id: string;
  name: string;
  file: string; // Path to HDR file in public/environments
  preview: string; // Preview color/gradient
  description: string;
}

const HDR_PRESETS: HDRPreset[] = [
  {
    id: 'env-metal-1',
    name: 'Metal Studio',
    file: '/environments/env_metal_1.hdr',
    preview: 'linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 50%, #1a1a1a 100%)',
    description: 'Optimized for metal reflections',
  },
  // Add more HDR presets here as files are added
];

// Studio environment presets - custom lightformer setups (no external HDR needed)
interface StudioPreset {
  id: string;
  name: string;
  backgroundColor: string;
  lights: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
    scale: [number, number, number];
    rotation?: [number, number, number];
  }>;
}

// 360° Spherical Studio Presets - lights distributed around the sphere
const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: 'white-studio',
    name: 'White Studio',
    backgroundColor: '#ffffff',
    lights: [
      // Top dome
      { color: '#ffffff', intensity: 2, position: [0, 8, 0], scale: [20, 20, 1], rotation: [Math.PI / 2, 0, 0] },
      // 360° ring at eye level (6 panels)
      { color: '#ffffff', intensity: 1.5, position: [0, 2, -6], scale: [8, 4, 1] },
      { color: '#ffffff', intensity: 1.5, position: [5.2, 2, -3], scale: [8, 4, 1], rotation: [0, Math.PI / 3, 0] },
      { color: '#ffffff', intensity: 1.5, position: [5.2, 2, 3], scale: [8, 4, 1], rotation: [0, 2 * Math.PI / 3, 0] },
      { color: '#ffffff', intensity: 1.5, position: [0, 2, 6], scale: [8, 4, 1], rotation: [0, Math.PI, 0] },
      { color: '#ffffff', intensity: 1.5, position: [-5.2, 2, 3], scale: [8, 4, 1], rotation: [0, -2 * Math.PI / 3, 0] },
      { color: '#ffffff', intensity: 1.5, position: [-5.2, 2, -3], scale: [8, 4, 1], rotation: [0, -Math.PI / 3, 0] },
      // Bottom fill
      { color: '#f0f0f0', intensity: 0.8, position: [0, -4, 0], scale: [15, 15, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'soft-box',
    name: 'Soft Box',
    backgroundColor: '#f8f8f8',
    lights: [
      // Large soft top
      { color: '#ffffff', intensity: 2.5, position: [0, 10, 0], scale: [25, 25, 1], rotation: [Math.PI / 2, 0, 0] },
      // Soft walls (cube-like)
      { color: '#fafafa', intensity: 1.2, position: [0, 3, -8], scale: [16, 8, 1] },
      { color: '#fafafa', intensity: 1.2, position: [8, 3, 0], scale: [16, 8, 1], rotation: [0, -Math.PI / 2, 0] },
      { color: '#fafafa', intensity: 1.2, position: [0, 3, 8], scale: [16, 8, 1], rotation: [0, Math.PI, 0] },
      { color: '#fafafa', intensity: 1.2, position: [-8, 3, 0], scale: [16, 8, 1], rotation: [0, Math.PI / 2, 0] },
      // Ground reflection
      { color: '#f0f0f0', intensity: 0.6, position: [0, -3, 0], scale: [20, 20, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'warm-studio',
    name: 'Warm Gold',
    backgroundColor: '#faf5f0',
    lights: [
      // Warm dome
      { color: '#fff8e8', intensity: 2, position: [0, 8, 0], scale: [20, 20, 1], rotation: [Math.PI / 2, 0, 0] },
      // 360° warm ring
      { color: '#ffe8cc', intensity: 1.5, position: [0, 2, -6], scale: [8, 4, 1] },
      { color: '#ffd9b3', intensity: 1.5, position: [5.2, 2, -3], scale: [8, 4, 1], rotation: [0, Math.PI / 3, 0] },
      { color: '#ffe8cc', intensity: 1.5, position: [5.2, 2, 3], scale: [8, 4, 1], rotation: [0, 2 * Math.PI / 3, 0] },
      { color: '#ffd9b3', intensity: 1.5, position: [0, 2, 6], scale: [8, 4, 1], rotation: [0, Math.PI, 0] },
      { color: '#ffe8cc', intensity: 1.5, position: [-5.2, 2, 3], scale: [8, 4, 1], rotation: [0, -2 * Math.PI / 3, 0] },
      { color: '#ffd9b3', intensity: 1.5, position: [-5.2, 2, -3], scale: [8, 4, 1], rotation: [0, -Math.PI / 3, 0] },
      // Warm floor
      { color: '#fff0e0', intensity: 0.8, position: [0, -4, 0], scale: [15, 15, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'cool-studio',
    name: 'Cool Silver',
    backgroundColor: '#f0f5fa',
    lights: [
      // Cool dome
      { color: '#e8f0ff', intensity: 2, position: [0, 8, 0], scale: [20, 20, 1], rotation: [Math.PI / 2, 0, 0] },
      // 360° cool ring
      { color: '#d0e8ff', intensity: 1.5, position: [0, 2, -6], scale: [8, 4, 1] },
      { color: '#c0d8ff', intensity: 1.5, position: [5.2, 2, -3], scale: [8, 4, 1], rotation: [0, Math.PI / 3, 0] },
      { color: '#d0e8ff', intensity: 1.5, position: [5.2, 2, 3], scale: [8, 4, 1], rotation: [0, 2 * Math.PI / 3, 0] },
      { color: '#c0d8ff', intensity: 1.5, position: [0, 2, 6], scale: [8, 4, 1], rotation: [0, Math.PI, 0] },
      { color: '#d0e8ff', intensity: 1.5, position: [-5.2, 2, 3], scale: [8, 4, 1], rotation: [0, -2 * Math.PI / 3, 0] },
      { color: '#c0d8ff', intensity: 1.5, position: [-5.2, 2, -3], scale: [8, 4, 1], rotation: [0, -Math.PI / 3, 0] },
      // Cool floor
      { color: '#e0f0ff', intensity: 0.8, position: [0, -4, 0], scale: [15, 15, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    backgroundColor: '#0a0a0a',
    lights: [
      // Strong key light
      { color: '#ffffff', intensity: 4, position: [4, 6, -4], scale: [5, 5, 1], rotation: [0.3, Math.PI / 4, 0] },
      // Blue rim/back
      { color: '#4488ff', intensity: 2, position: [-5, 3, 4], scale: [4, 3, 1], rotation: [0, -2 * Math.PI / 3, 0] },
      // Orange accent
      { color: '#ff8844', intensity: 1.5, position: [5, 1, 4], scale: [3, 2, 1], rotation: [0, 2 * Math.PI / 3, 0] },
      // Subtle fill
      { color: '#222233', intensity: 0.5, position: [0, 8, 0], scale: [15, 15, 1], rotation: [Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'product',
    name: 'Product 360',
    backgroundColor: '#ffffff',
    lights: [
      // Large overhead softbox
      { color: '#ffffff', intensity: 3, position: [0, 10, 0], scale: [20, 20, 1], rotation: [Math.PI / 2, 0, 0] },
      // 8-point 360° ring for even reflections
      { color: '#ffffff', intensity: 1.8, position: [0, 3, -7], scale: [6, 4, 1] },
      { color: '#ffffff', intensity: 1.8, position: [5, 3, -5], scale: [6, 4, 1], rotation: [0, Math.PI / 4, 0] },
      { color: '#ffffff', intensity: 1.8, position: [7, 3, 0], scale: [6, 4, 1], rotation: [0, Math.PI / 2, 0] },
      { color: '#ffffff', intensity: 1.8, position: [5, 3, 5], scale: [6, 4, 1], rotation: [0, 3 * Math.PI / 4, 0] },
      { color: '#ffffff', intensity: 1.8, position: [0, 3, 7], scale: [6, 4, 1], rotation: [0, Math.PI, 0] },
      { color: '#ffffff', intensity: 1.8, position: [-5, 3, 5], scale: [6, 4, 1], rotation: [0, -3 * Math.PI / 4, 0] },
      { color: '#ffffff', intensity: 1.8, position: [-7, 3, 0], scale: [6, 4, 1], rotation: [0, -Math.PI / 2, 0] },
      { color: '#ffffff', intensity: 1.8, position: [-5, 3, -5], scale: [6, 4, 1], rotation: [0, -Math.PI / 4, 0] },
      // Bright floor for bottom reflections
      { color: '#ffffff', intensity: 1, position: [0, -3, 0], scale: [18, 18, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
];

type StudioPresetId = typeof STUDIO_PRESETS[number]['id'];

// Background presets
const BACKGROUND_PRESETS = [
  { id: 'black', name: 'Black', color: '#000000' },
  { id: 'dark', name: 'Dark', color: '#0a0a0a' },
  { id: 'charcoal', name: 'Charcoal', color: '#1a1a1a' },
  { id: 'slate', name: 'Slate', color: '#2d2d2d' },
  { id: 'gray', name: 'Gray', color: '#4a4a4a' },
  { id: 'light-gray', name: 'Light Gray', color: '#808080' },
  { id: 'silver', name: 'Silver', color: '#c0c0c0' },
  { id: 'white', name: 'White', color: '#ffffff' },
];

// Lighting presets
interface LightingPreset {
  id: string;
  name: string;
  ambient: number;
  main: { intensity: number; color: string; position: [number, number, number] };
  fill: { intensity: number; color: string; position: [number, number, number] };
  back: { intensity: number; color: string; position: [number, number, number] };
}

const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'studio',
    name: 'Studio',
    ambient: 1.5,
    main: { intensity: 4.0, color: '#ffffff', position: [5, 8, 5] },
    fill: { intensity: 2.5, color: '#e0e8ff', position: [-5, 3, -3] },
    back: { intensity: 2.0, color: '#fff5e0', position: [0, 5, -8] },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    ambient: 0.8,
    main: { intensity: 5.0, color: '#ffffff', position: [8, 10, 2] },
    fill: { intensity: 1.0, color: '#4488ff', position: [-8, 2, -5] },
    back: { intensity: 3.0, color: '#ff8844', position: [-3, 8, -10] },
  },
  {
    id: 'soft',
    name: 'Soft',
    ambient: 2.5,
    main: { intensity: 3.0, color: '#fff8f0', position: [3, 6, 4] },
    fill: { intensity: 2.0, color: '#f0f8ff', position: [-4, 4, 2] },
    back: { intensity: 1.5, color: '#ffffff', position: [0, 3, -5] },
  },
  {
    id: 'warm',
    name: 'Warm',
    ambient: 1.5,
    main: { intensity: 4.0, color: '#ffddaa', position: [5, 7, 5] },
    fill: { intensity: 2.0, color: '#ffcc88', position: [-5, 4, 0] },
    back: { intensity: 1.5, color: '#ff9966', position: [0, 5, -6] },
  },
  {
    id: 'cool',
    name: 'Cool',
    ambient: 1.5,
    main: { intensity: 4.0, color: '#e0f0ff', position: [5, 7, 5] },
    fill: { intensity: 2.0, color: '#aaccff', position: [-5, 4, 0] },
    back: { intensity: 1.5, color: '#88aaff', position: [0, 5, -6] },
  },
  {
    id: 'product',
    name: 'Product',
    ambient: 2.0,
    main: { intensity: 4.0, color: '#ffffff', position: [0, 10, 5] },
    fill: { intensity: 3.0, color: '#ffffff', position: [-6, 5, 3] },
    back: { intensity: 3.0, color: '#ffffff', position: [6, 5, 3] },
  },
];

// 3D Model component
function Model({ 
  geometry, 
  material,
  wireframe = false,
}: { 
  geometry: THREE.BufferGeometry;
  material: MaterialPreset;
  wireframe?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow userData={{ selectable: true, id: 'main-mesh' }}>
      <meshPhysicalMaterial
        color={material.color}
        metalness={material.metalness}
        roughness={material.roughness}
        envMapIntensity={material.envMapIntensity}
        wireframe={wireframe}
        clearcoat={material.clearcoat ?? 0}
        clearcoatRoughness={material.clearcoatRoughness ?? 0}
        sheen={material.sheen ?? 0}
        sheenRoughness={material.sheenRoughness ?? 0}
        sheenColor={material.sheenColor || '#ffffff'}
        anisotropy={material.anisotropy ?? 0}
        specularIntensity={material.specularIntensity ?? 1}
      />
    </mesh>
  );
}

// Layer Model component with advanced materials
function LayerModel({ 
  layer,
  material,
  wireframe = false,
  diamondConfig,
}: { 
  layer: ModelLayer;
  material: MaterialPreset;
  wireframe?: boolean;
  diamondConfig?: DiamondConfig;
}) {
  if (!layer.visible) return null;
  
  // Determine if this is a stone/gem material
  const isGem = layer.category === 'stone';
  
  return (
    <mesh 
      geometry={layer.geometry} 
      castShadow 
      receiveShadow
      userData={{ selectable: true, layerId: layer.id, layerName: layer.name }}
    >
      {isGem && diamondConfig?.enabled ? (
        // Enhanced gem material using full diamondConfig
        <meshPhysicalMaterial
          color={diamondConfig.color || material.color}
          metalness={0}
          roughness={0.02} // Gems are very smooth
          transmission={diamondConfig.transmission}
          thickness={diamondConfig.thickness}
          ior={diamondConfig.ior}
          envMapIntensity={diamondConfig.envMapIntensity}
          clearcoat={diamondConfig.clearcoat}
          clearcoatRoughness={diamondConfig.clearcoatRoughness}
          // Use brilliance and fire for sheen
          sheen={diamondConfig.brilliance || 0}
          sheenRoughness={0.3}
          sheenColor={diamondConfig.color || '#ffffff'}
          // Use dispersion for iridescence (rainbow effect)
          iridescence={diamondConfig.dispersion || 0}
          iridescenceIOR={diamondConfig.ior || 2.42}
          iridescenceThicknessRange={[100, 400]}
          // Scintillation affects specular
          specularIntensity={1 + (diamondConfig.scintillation || 0)}
          wireframe={wireframe}
          transparent
          opacity={1}
        />
      ) : isGem ? (
        // Default gem material (no config)
        <meshPhysicalMaterial
          color={material.color}
          metalness={0}
          roughness={material.roughness}
          transmission={0.95}
          thickness={0.5}
          ior={2.42}
          envMapIntensity={2.5}
          clearcoat={1}
          clearcoatRoughness={0}
          wireframe={wireframe}
        />
      ) : (
        // Metal material (gold, silver, platinum, etc.) with advanced properties
        <meshPhysicalMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          envMapIntensity={material.envMapIntensity}
          wireframe={wireframe}
          // Advanced properties
          clearcoat={material.clearcoat ?? 0}
          clearcoatRoughness={material.clearcoatRoughness ?? 0}
          sheen={material.sheen ?? 0}
          sheenRoughness={material.sheenRoughness ?? 0}
          sheenColor={material.sheenColor || '#ffffff'}
          anisotropy={material.anisotropy ?? 0}
          specularIntensity={material.specularIntensity ?? 1}
        />
      )}
    </mesh>
  );
}

// Adaptive Resolution Controller - Handles progressive rendering
function AdaptiveResolutionController({ 
  enabled = true,
  autoRotate = false, // NEW: Skip adaptive resolution during auto-rotate
  onResolutionChange,
}: { 
  enabled?: boolean;
  autoRotate?: boolean;
  onResolutionChange?: (ratio: number, isRefining: boolean) => void;
}) {
  const { gl, camera } = useThree();
  const prevCameraMatrix = useRef(new THREE.Matrix4());
  const lastMovementTime = useRef(Date.now());
  const refinementStartTime = useRef<number | null>(null);
  const currentRatio = useRef(1);
  
  // FIXED: Previous minRatio=0.3 caused smudge/muddy effect
  // Now using 0.75 for much better quality during movement
  const minRatio = 0.75;
  const maxRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2;
  const idleDelay = 50; // ms before starting refinement (faster)
  const refinementDuration = 200; // ms for full refinement (faster)
  
  useFrame(() => {
    if (!enabled) return;
    
    // NEW: If auto-rotate is enabled, always use max resolution
    // This prevents quality loss during auto-rotation
    if (autoRotate) {
      if (currentRatio.current !== maxRatio) {
        currentRatio.current = maxRatio;
        gl.setPixelRatio(maxRatio);
        onResolutionChange?.(maxRatio, false);
      }
      return;
    }
    
    const now = Date.now();
    const currentMatrix = camera.matrixWorld;
    
    // Check camera movement
    let totalDiff = 0;
    for (let i = 0; i < 16; i++) {
      totalDiff += Math.abs(currentMatrix.elements[i] - prevCameraMatrix.current.elements[i]);
    }
    prevCameraMatrix.current.copy(currentMatrix);
    
    const isMoving = totalDiff > 0.005;
    
    if (isMoving) {
      // Camera moving - drop resolution
      lastMovementTime.current = now;
      refinementStartTime.current = null;
      
      if (currentRatio.current !== minRatio) {
        currentRatio.current = minRatio;
        gl.setPixelRatio(minRatio);
        onResolutionChange?.(minRatio, false);
      }
    } else {
      const timeSinceMovement = now - lastMovementTime.current;
      
      if (timeSinceMovement > idleDelay) {
        if (refinementStartTime.current === null) {
          refinementStartTime.current = now;
        }
        
        const progress = Math.min(1, (now - refinementStartTime.current) / refinementDuration);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const newRatio = minRatio + (maxRatio - minRatio) * easedProgress;
        
        if (Math.abs(currentRatio.current - newRatio) > 0.02) {
          currentRatio.current = newRatio;
          gl.setPixelRatio(newRatio);
          onResolutionChange?.(newRatio, progress < 1);
        }
      }
    }
  });
  
  useEffect(() => {
    if (enabled) {
      gl.setPixelRatio(maxRatio);
      prevCameraMatrix.current.copy(camera.matrixWorld);
    }
  }, [enabled, gl, camera, maxRatio]);
  
  return null;
}

// Selection Manager - handles object picking and selection outline
function SelectionManager({
  onSelect,
  selectedObject,
  enabled = true,
}: {
  onSelect: (objectId: string | null, mesh: THREE.Object3D | null) => void;
  selectedObject: THREE.Object3D | null;
  enabled?: boolean;
}) {
  // Use the object picker hook
  useObjectPicker({
    onSelect,
    enabled,
    hoverCursor: 'pointer',
  });

  // Render selection outline for selected object
  const selectedObjects = useMemo(() => {
    return selectedObject ? [selectedObject] : [];
  }, [selectedObject]);

  return (
    <SelectionOutline
      selectedObjects={selectedObjects}
      color="#ff6600"
      thickness={0.004}
      enabled={enabled && selectedObjects.length > 0}
    />
  );
}

// Scene content component
function SceneContent({
  geometry,
  material,
  layers,
  layerMaterials,
  autoRotate,
  showGrid,
  wireframe,
  studioPreset,
  hdrPreset,
  useHDR,
  backgroundColor,
  backgroundType,
  modelRotation,
  lighting,
  lightIntensity,
  onControlsReady,
  onFitToView,
  envRotation,
  adaptiveResolution,
  onResolutionChange,
  // New configs
  groundConfig,
  postProcessingConfig,
  diamondConfig,
  onBoundingBoxChange,
  // Turntable
  turntableConfig,
  isTurntablePlaying,
  // Focus
  focusConfig,
  // Selection
  onSelectObject,
  selectedMesh,
  selectionEnabled = true,
}: {
  geometry: THREE.BufferGeometry | null;
  material: MaterialPreset;
  layers: ModelLayer[];
  layerMaterials: Record<string, MaterialPreset>;
  autoRotate: boolean;
  showGrid: boolean;
  wireframe: boolean;
  studioPreset: StudioPreset;
  hdrPreset: HDRPreset | null;
  useHDR: boolean;
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient' | 'transparent';
  modelRotation: [number, number, number];
  lighting: LightingPreset;
  lightIntensity: number;
  onControlsReady: (controls: any) => void;
  onFitToView: (fitFn: () => void) => void;
  envRotation: [number, number, number];
  adaptiveResolution: boolean;
  onResolutionChange?: (ratio: number, isRefining: boolean) => void;
  // New configs
  groundConfig: GroundPlaneConfig;
  postProcessingConfig: PostProcessingConfig;
  diamondConfig: DiamondConfig;
  onBoundingBoxChange?: (box: THREE.Box3 | null) => void;
  // Turntable
  turntableConfig?: TurntableConfig;
  isTurntablePlaying?: boolean;
  // Focus
  focusConfig?: FocusConfig;
  // Selection
  onSelectObject?: (objectId: string | null, mesh: THREE.Object3D | null) => void;
  selectedMesh?: THREE.Object3D | null;
  selectionEnabled?: boolean;
}) {
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [modelTransform, setModelTransform] = useState<{
    position: THREE.Vector3;
    scale: number;
  } | null>(null);
  const [modelBoundingBox, setModelBoundingBox] = useState<THREE.Box3 | null>(null);

  useEffect(() => {
    if (controlsRef.current) {
      onControlsReady(controlsRef.current);
    }
  }, [onControlsReady]);
  
  // Calculate bounding box for ground plane
  useEffect(() => {
    if (geometry) {
      const tempGeom = geometry.clone();
      tempGeom.computeBoundingBox();
      if (tempGeom.boundingBox) {
        setModelBoundingBox(tempGeom.boundingBox.clone());
        onBoundingBoxChange?.(tempGeom.boundingBox.clone());
      }
    } else if (layers.length > 0) {
      // Calculate combined bounding box from layers
      const combinedBox = new THREE.Box3();
      layers.forEach(layer => {
        if (layer.visible && layer.geometry) {
          layer.geometry.computeBoundingBox();
          if (layer.geometry.boundingBox) {
            combinedBox.union(layer.geometry.boundingBox);
          }
        }
      });
      if (!combinedBox.isEmpty()) {
        setModelBoundingBox(combinedBox);
        onBoundingBoxChange?.(combinedBox);
      }
    } else {
      setModelBoundingBox(null);
      onBoundingBoxChange?.(null);
    }
  }, [geometry, layers, onBoundingBoxChange]);

  // Fit camera to model
  const fitToView = useCallback(() => {
    if (!controlsRef.current) return;
    
    // Calculate bounding box
    const box = new THREE.Box3();
    
    // Handle single geometry (STL, OBJ, etc.)
    if (geometry) {
      const tempGeom = geometry.clone();
      tempGeom.computeBoundingBox();
      if (tempGeom.boundingBox) {
        box.copy(tempGeom.boundingBox);
      }
    }
    
    // Handle layers (3DM files)
    if (layers.length > 0) {
      layers.forEach(layer => {
        if (layer.visible && layer.geometry) {
          layer.geometry.computeBoundingBox();
          if (layer.geometry.boundingBox) {
            box.union(layer.geometry.boundingBox);
          }
        }
      });
    }
    
    if (box.isEmpty()) return;
    
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Position camera to see the whole model
    // Use camera's actual FOV if available (PerspectiveCamera)
    const cameraFov = 'fov' in camera ? (camera as THREE.PerspectiveCamera).fov : 50;
    const fov = cameraFov * (Math.PI / 180);
    const cameraDistance = (maxDim / 2) / Math.tan(fov / 2) * 2.5;
    
    camera.position.set(cameraDistance, cameraDistance * 0.7, cameraDistance);
    camera.lookAt(center.x, center.y, center.z);
    
    controlsRef.current.target.copy(center);
    controlsRef.current.update();
  }, [geometry, layers, camera]);

  // Expose fitToView function
  useEffect(() => {
    onFitToView(fitToView);
  }, [fitToView, onFitToView]);

  // Center and scale model when loaded (STL)
  useEffect(() => {
    if (geometry) {
      // Clone geometry to avoid modifying original
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      
      const boundingBox = geometry.boundingBox;
      if (boundingBox) {
        // The model is rotated by modelRotation (default: [-PI/2, 0, 0] for Z-up to Y-up)
        // We need to calculate the bounding box AFTER rotation to place on ground correctly
        
        // Apply the rotation matrix to the bounding box corners
        const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
          new THREE.Euler(modelRotation[0], modelRotation[1], modelRotation[2])
        );
        
        // Get all 8 corners of the bounding box
        const corners = [
          new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z),
          new THREE.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.max.z),
          new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.min.z),
          new THREE.Vector3(boundingBox.min.x, boundingBox.max.y, boundingBox.max.z),
          new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z),
          new THREE.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.max.z),
          new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.min.z),
          new THREE.Vector3(boundingBox.max.x, boundingBox.max.y, boundingBox.max.z),
        ];
        
        // Rotate all corners and compute new bounding box
        const rotatedBox = new THREE.Box3();
        corners.forEach(corner => {
          corner.applyMatrix4(rotationMatrix);
          rotatedBox.expandByPoint(corner);
        });
        
        const center = new THREE.Vector3();
        rotatedBox.getCenter(center);
        
        const size = new THREE.Vector3();
        rotatedBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 2 / maxDim : 1;
        
        // minY in the rotated coordinate system
        const minY = rotatedBox.min.y;
        
        setModelTransform({
          // Center horizontally (X and Z), but place on ground (Y)
          position: new THREE.Vector3(
            -center.x,           // Center X
            -minY,               // Place bottom on ground (y=0)
            -center.z            // Center Z
          ),
          scale: scale,
        });
        
        // Update bounding box for other uses (ground plane, etc.)
        const scaledBox = rotatedBox.clone();
        scaledBox.min.sub(new THREE.Vector3(center.x, minY, center.z)).multiplyScalar(scale);
        scaledBox.max.sub(new THREE.Vector3(center.x, minY, center.z)).multiplyScalar(scale);
        setModelBoundingBox(scaledBox);
        onBoundingBoxChange?.(scaledBox);
        
        // Auto fit to view after loading - look at the center height of the model
        setTimeout(() => {
          const modelHeight = size.y * scale;
          const lookAtY = modelHeight / 2; // Look at center of model
          camera.position.set(4, 2 + lookAtY, 4);
          if (controlsRef.current) {
            controlsRef.current.target.set(0, lookAtY, 0);
            controlsRef.current.update();
          }
        }, 100);
      }
    } else {
      setModelTransform(null);
    }
  }, [geometry, camera, modelRotation, onBoundingBoxChange]);

  // Center and scale layers (3DM) - place on ground
  useEffect(() => {
    if (layers.length > 0 && groupRef.current) {
      // Compute combined bounding box
      const combinedBox = new THREE.Box3();
      
      layers.forEach(layer => {
        layer.geometry.computeBoundingBox();
        if (layer.geometry.boundingBox) {
          combinedBox.union(layer.geometry.boundingBox);
        }
      });

      // Apply the rotation matrix to the bounding box corners (for Z-up to Y-up)
      const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(modelRotation[0], modelRotation[1], modelRotation[2])
      );
      
      // Get all 8 corners of the bounding box
      const corners = [
        new THREE.Vector3(combinedBox.min.x, combinedBox.min.y, combinedBox.min.z),
        new THREE.Vector3(combinedBox.min.x, combinedBox.min.y, combinedBox.max.z),
        new THREE.Vector3(combinedBox.min.x, combinedBox.max.y, combinedBox.min.z),
        new THREE.Vector3(combinedBox.min.x, combinedBox.max.y, combinedBox.max.z),
        new THREE.Vector3(combinedBox.max.x, combinedBox.min.y, combinedBox.min.z),
        new THREE.Vector3(combinedBox.max.x, combinedBox.min.y, combinedBox.max.z),
        new THREE.Vector3(combinedBox.max.x, combinedBox.max.y, combinedBox.min.z),
        new THREE.Vector3(combinedBox.max.x, combinedBox.max.y, combinedBox.max.z),
      ];
      
      // Rotate all corners and compute new bounding box
      const rotatedBox = new THREE.Box3();
      corners.forEach(corner => {
        corner.applyMatrix4(rotationMatrix);
        rotatedBox.expandByPoint(corner);
      });

      const center = new THREE.Vector3();
      rotatedBox.getCenter(center);
      
      const size = new THREE.Vector3();
      rotatedBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 2 / maxDim : 1;
      
      // Get minY for ground placement (in rotated space)
      const minY = rotatedBox.min.y;

      // Apply transform to group - center X/Z, place on ground Y
      groupRef.current.position.set(
        -center.x * scale,    // Center X
        -minY * scale,        // Place bottom on ground (y=0)
        -center.z * scale     // Center Z
      );
      groupRef.current.scale.set(scale, scale, scale);

      // Look at the center height of the model
      const modelHeight = size.y * scale;
      const lookAtY = modelHeight / 2;
      camera.position.set(4, 2 + lookAtY, 4);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, lookAtY, 0);
        controlsRef.current.update();
      }
    }
  }, [layers, camera, modelRotation]);

  // Calculate final intensities with global multiplier
  const intensityMultiplier = lightIntensity;

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={lighting.ambient * intensityMultiplier} />
      
      {/* Main Key Light */}
      <directionalLight
        position={lighting.main.position}
        intensity={lighting.main.intensity * intensityMultiplier}
        color={lighting.main.color}
        castShadow
        shadow-mapSize={2048}
      />
      
      {/* Fill Light */}
      <directionalLight
        position={lighting.fill.position}
        intensity={lighting.fill.intensity * intensityMultiplier}
        color={lighting.fill.color}
      />
      
      {/* Back/Rim Light */}
      <directionalLight
        position={lighting.back.position}
        intensity={lighting.back.intensity * intensityMultiplier}
        color={lighting.back.color}
      />
      
      {/* Hemisphere light for better ambient */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#444444"
        intensity={0.4 * intensityMultiplier}
      />

      {/* Scene Background Color - Only for solid backgrounds, transparent uses CSS */}
      {backgroundType !== 'transparent' && (
        <color attach="background" args={[backgroundColor]} />
      )}
      
      {/* Environment: HDR or Lightformer - ONLY for reflections, never as visible background */}
      {useHDR && hdrPreset ? (
        <Environment 
          files={hdrPreset.file}
          background={false}
          environmentIntensity={lightIntensity}
        />
      ) : (
        <Environment 
          background={false}
          resolution={256}
        >
          {/* Studio Lightformers for reflections */}
          {studioPreset.lights.map((light, index) => (
            <Lightformer
              key={index}
              form="rect"
              color={light.color}
              intensity={light.intensity * lightIntensity}
              position={light.position}
              scale={light.scale}
              rotation={light.rotation || [0, 0, 0]}
            />
          ))}
        </Environment>
      )}
      
      {/* Contact shadows removed per user request */}

      {/* Grid */}
      {showGrid && (
        <Grid
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#444"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#666"
          fadeDistance={15}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      )}
      
      {/* Ground Plane */}
      {groundConfig.enabled && (
        <GroundPlane 
          config={groundConfig}
          modelBoundingBox={modelBoundingBox}
        />
      )}

      {/* STL Model */}
      {geometry && modelTransform && (
        <group
          position={[
            modelTransform.position.x * modelTransform.scale,
            modelTransform.position.y * modelTransform.scale,
            modelTransform.position.z * modelTransform.scale,
          ]}
        >
          <group 
            rotation={modelRotation}
            scale={[modelTransform.scale, modelTransform.scale, modelTransform.scale]}
          >
            <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow userData={{ selectable: true, id: 'stl-mesh' }}>
              <meshPhysicalMaterial
                color={material.color}
                metalness={material.metalness}
                roughness={material.roughness}
                envMapIntensity={material.envMapIntensity}
                wireframe={material.wireframe || wireframe}
                // Advanced properties from materialConfig
                clearcoat={material.clearcoat ?? 0}
                clearcoatRoughness={material.clearcoatRoughness ?? 0}
                transmission={material.transmission ?? 0}
                thickness={material.thickness ?? 0}
                ior={material.ior ?? 1.5}
                sheen={material.sheen ?? 0}
                sheenRoughness={material.sheenRoughness ?? 0}
                sheenColor={material.sheenColor || '#ffffff'}
                anisotropy={material.anisotropy ?? 0}
                anisotropyRotation={material.anisotropyRotation ?? 0}
                iridescence={material.iridescence ?? 0}
                iridescenceIOR={material.iridescenceIOR ?? 1.3}
                specularIntensity={material.specularIntensity ?? 1}
                specularColor={material.specularColor || '#ffffff'}
                emissive={material.emissive || '#000000'}
                emissiveIntensity={material.emissiveIntensity ?? 0}
                flatShading={material.flatShading ?? false}
                transparent={material.transparent ?? false}
                opacity={material.opacity ?? 1}
              />
            </mesh>
          </group>
        </group>
      )}

      {/* 3DM Layers */}
      {layers.length > 0 && (
        <group ref={groupRef}>
          {layers.map(layer => (
            <LayerModel
              key={layer.id}
              layer={layer}
              material={layerMaterials[layer.id] || METAL_PRESETS[0]}
              wireframe={wireframe}
              diamondConfig={diamondConfig}
            />
          ))}
        </group>
      )}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.1}
        enablePan
        enableZoom
        enableRotate
        rotateSpeed={3}
        zoomSpeed={3}
        panSpeed={3}
        autoRotate={autoRotate || isTurntablePlaying}
        autoRotateSpeed={turntableConfig?.speed || 2}
        minDistance={0.5}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      
      {/* Axis Gizmo in corner - always visible for orientation reference */}
      <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
        <GizmoViewport 
          axisColors={['#ff4444', '#44ff44', '#4488ff']}
          labelColor="#ffffff"
          hideNegativeAxes={false}
          font="bold 12px Inter, system-ui, sans-serif"
        />
      </GizmoHelper>
      
      {/* Adaptive Resolution - Progressive rendering for smooth interaction */}
      {/* Disabled during auto-rotate to maintain full quality */}
      <AdaptiveResolutionController 
        enabled={adaptiveResolution}
        autoRotate={autoRotate}
        onResolutionChange={onResolutionChange}
      />
      
      {/* Post-Processing Effects */}
      {postProcessingConfig.enabled && (
        <PostProcessingEffects config={postProcessingConfig} focusConfig={focusConfig} />
      )}
      
      {/* Selection Manager - handles object picking and outline */}
      {onSelectObject && (
        <SelectionManager
          onSelect={onSelectObject}
          selectedObject={selectedMesh || null}
          enabled={selectionEnabled}
        />
      )}
    </>
  );
}

// Snapshot component
function SnapshotHelper({ 
  onSnapshot 
}: { 
  onSnapshot: (dataUrl: string) => void;
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const handleSnapshot = () => {
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL('image/png');
      onSnapshot(dataUrl);
    };

    window.addEventListener('take-3d-snapshot', handleSnapshot);
    return () => window.removeEventListener('take-3d-snapshot', handleSnapshot);
  }, [gl, scene, camera, onSnapshot]);

  return null;
}

export default function ThreeDViewContent() {
  // Layout state from global store (matching Studio)
  const { leftOpen, rightOpen, setRightOpen } = useSidebarStore();
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [loadedGeometry, setLoadedGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialPreset>(METAL_PRESETS[0]);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(false); // Default OFF for cleaner view
  const [wireframe, setWireframe] = useState(false);
  const [materialType, setMaterialType] = useState<'metal' | 'stone' | 'matte'>('metal');
  const [snapshotPreview, setSnapshotPreview] = useState<string | null>(null);
  const [selectedStudio, setSelectedStudio] = useState<StudioPreset>(STUDIO_PRESETS[0]); // White Studio
  const [selectedHDR, setSelectedHDR] = useState<HDRPreset | null>(null); // HDR environment
  const [useHDR, setUseHDR] = useState(false); // Toggle between HDR and Lightformer
  const [backgroundColor, setBackgroundColor] = useState('#0a0a0a');
  const [snapshotScale, setSnapshotScale] = useState<1 | 2 | 4>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [modelInfo, setModelInfo] = useState<{ vertices: number; faces: number } | null>(null);
  const [fitToViewFn, setFitToViewFn] = useState<(() => void) | null>(null);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([-Math.PI / 2, 0, 0]); // Default Z-up to Y-up
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]); // Studio default
  const [lightIntensity, setLightIntensity] = useState(1.0); // Global intensity multiplier
  const [isSnapshotMode, setIsSnapshotMode] = useState(false); // Hide grid during snapshot
  // HDR is used for reflections only, not as visible background
  const [subdivisionLevel, setSubdivisionLevel] = useState(0); // 0 = original, 1-3 = smoother
  const [originalGeometry, setOriginalGeometry] = useState<THREE.BufferGeometry | null>(null); // Store original for subdivision
  const [tessellationQuality, setTessellationQuality] = useState(1.0); // 0.25 = low, 1.0 = medium, 5.0 = high
  const [raw3DMBuffer, setRaw3DMBuffer] = useState<ArrayBuffer | null>(null); // Store raw file for re-tessellation
  const [raw3DMFileName, setRaw3DMFileName] = useState<string | null>(null);
  
  // Layer state (for 3DM support)
  const [layers, setLayers] = useState<ModelLayer[]>([]);
  const [layerMaterials, setLayerMaterials] = useState<Record<string, MaterialPreset>>({});
  const [layersAccordionOpen, setLayersAccordionOpen] = useState(true);
  
  // Progressive rendering state - disabled by default for better responsiveness
  const [adaptiveResolution, setAdaptiveResolution] = useState(false);
  const [currentResolution, setCurrentResolution] = useState(1);
  const [isRefining, setIsRefining] = useState(false);
  const meshRegistryRef = useRef<Map<string, THREE.Mesh>>(new Map());
  
  // Environment rotation (X, Y, Z in degrees)
  const [envRotation, setEnvRotation] = useState<[number, number, number]>([0, 0, 0]);
  
  // Edge smoothing (0 = sharp, 1 = smooth)
  const [edgeSmoothing, setEdgeSmoothing] = useState(0);
  
  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<FrameCaptureProgress | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const initialRotation = useRef<[number, number, number]>(modelRotation);
  
  // ===== NEW PANEL STATES =====
  // Ground config
  const [groundConfig, setGroundConfig] = useState<GroundPlaneConfig>(DEFAULT_GROUND_CONFIG);
  
  // Lighting config (uses new system)
  const [lightingConfig, setLightingConfig] = useState<LightingConfig>(DEFAULT_LIGHTING_CONFIG);
  
  // Background config
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig>(DEFAULT_BACKGROUND_CONFIG);
  
  // Edge smoothing config
  const [edgeSmoothingConfig, setEdgeSmoothingConfig] = useState<EdgeSmoothingConfig>(DEFAULT_EDGE_SMOOTHING_CONFIG);
  const [isProcessingEdges, setIsProcessingEdges] = useState(false);
  
  // HDR config
  const [hdrConfig, setHDRConfig] = useState<HDRConfig>(DEFAULT_HDR_CONFIG);
  
  // Diamond config
  const [diamondConfig, setDiamondConfig] = useState<DiamondConfig>(DEFAULT_DIAMOND_CONFIG);
  
  // Post-processing config
  const [postProcessingConfig, setPostProcessingConfig] = useState<PostProcessingConfig>(DEFAULT_POST_PROCESSING_CONFIG);
  
  // Material config (new format)
  const [materialConfig, setMaterialConfig] = useState<MaterialConfig>(MATERIAL_METAL_PRESETS[0]);
  
  // Video export config
  const [videoConfig, setVideoConfig] = useState<VideoExportConfig>(DEFAULT_VIDEO_CONFIG);
  const [recordingState, setRecordingState] = useState<RecordingState>({ 
    isRecording: false, 
    isPaused: false, 
    progress: 0,
    currentFrame: 0,
    totalFrames: 0,
    elapsedTime: 0,
    estimatedTimeRemaining: 0
  });
  
  // Turntable config
  const [turntableConfig, setTurntableConfig] = useState<TurntableConfig>(DEFAULT_TURNTABLE_CONFIG);
  const [isTurntablePlaying, setIsTurntablePlaying] = useState(false);
  
  // Batch export config
  const [batchConfig, setBatchConfig] = useState<BatchExportConfig>(DEFAULT_BATCH_CONFIG);
  const [batchProgress, setBatchProgress] = useState<BatchExportProgress>({ 
    isExporting: false, 
    currentAngle: 0, 
    totalAngles: 0, 
    completedImages: [],
    currentAngleName: ''
  });
  
  // ===== SELECTION STATE =====
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [selectedMeshRef, setSelectedMeshRef] = useState<THREE.Object3D | null>(null);
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [isTransforming, setIsTransforming] = useState(false);
  
  // ===== SINGLE GEOMETRY WEIGHT STATE (for STL files) =====
  const [singleGeometryWeight, setSingleGeometryWeight] = useState<number | undefined>(undefined);
  const [singleGeometryVolume, setSingleGeometryVolume] = useState<number | undefined>(undefined);
  
  // NEW panel states
  const [measurementConfig, setMeasurementConfig] = useState<MeasurementConfig>(DEFAULT_MEASUREMENT_CONFIG);
  const [viewConfig, setViewConfig] = useState<ViewConfig>(DEFAULT_VIEW_CONFIG);
  const [focusConfig, setFocusConfig] = useState<FocusConfig>(DEFAULT_FOCUS_CONFIG);
  const [annotationConfig, setAnnotationConfig] = useState<AnnotationConfig>(DEFAULT_ANNOTATION_CONFIG);
  const [transformAdvancedConfig, setTransformAdvancedConfig] = useState<TransformAdvancedConfig>(DEFAULT_TRANSFORM_ADVANCED_CONFIG);
  
  // Product Transform (Position, Rotation, Scale, Flip)
  const [productTransform, setProductTransform] = useState<TransformState>(DEFAULT_TRANSFORM);
  const [productFlip, setProductFlip] = useState<FlipState>(DEFAULT_FLIP);
  
  // Camera Settings
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>(DEFAULT_CAMERA_SETTINGS);
  const [currentCameraPresetId, setCurrentCameraPresetId] = useState<string | null>(null);
  
  // Layer selection
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  
  // Material Picker Modal
  const [materialPickerOpen, setMaterialPickerOpen] = useState(false);
  const [materialPickerLayerId, setMaterialPickerLayerId] = useState<string | null>(null);
  const [materialPickerCategory, setMaterialPickerCategory] = useState<'metal' | 'stone' | 'setting' | 'unknown'>('metal');
  
  // Environment Picker
  const [selectedEnvironment, setSelectedEnvironment] = useState<SelectedEnvironment>({
    type: 'hdri',
    hdriPreset: undefined,
    studioPresetId: undefined,
    customPath: undefined,
    customName: undefined,
    intensity: 1,
    blur: 0,
    rotation: 0,
    backgroundVisible: true,
  });
  
  // Diamond Effects (Legacy)
  const [diamondEffects, setDiamondEffects] = useState<DiamondEffectConfig>(DEFAULT_DIAMOND_EFFECTS);
  const [selectedGemstone, setSelectedGemstone] = useState('diamond');
  const [selectedCut, setSelectedCut] = useState('round-brilliant');
  
  // Orientation Modal
  const [orientationModalOpen, setOrientationModalOpen] = useState(false);
  
  // Model dimensions for measurement
  const [modelDimensions, setModelDimensions] = useState<Dimensions3D | null>(null);
  
  // ===== SYNC NEW CONFIGS TO OLD SCENE VARIABLES =====
  // Sync backgroundConfig with backgroundColor
  useEffect(() => {
    if (backgroundConfig.type === 'solid' && backgroundConfig.solidColor) {
      setBackgroundColor(backgroundConfig.solidColor);
    } else if (backgroundConfig.type === 'transparent') {
      // For transparent, use a dark color for WebGL but CSS will handle actual transparency
      setBackgroundColor('#000000');
    } else if (backgroundConfig.type === 'gradient') {
      // For gradient, use the first gradient color for WebGL (CSS will overlay the gradient)
      setBackgroundColor(backgroundConfig.gradientColors[0]);
    }
  }, [backgroundConfig]);
  
  // Compute CSS background style based on backgroundConfig
  const canvasBackgroundStyle = useMemo(() => {
    if (backgroundConfig.type === 'transparent') {
      // Transparent - checkerboard pattern for preview
      return {
        background: `
          repeating-conic-gradient(
            #808080 0% 25%,
            #404040 0% 50%
          ) 50% / 20px 20px
        `,
        opacity: backgroundConfig.opacity,
      };
    } else if (backgroundConfig.type === 'gradient') {
      // Generate CSS gradient
      const colors = backgroundConfig.gradientColors;
      const dir = backgroundConfig.gradientDirection;
      let gradientCSS = '';
      
      switch (dir) {
        case 'vertical':
          gradientCSS = `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`;
          break;
        case 'horizontal':
          gradientCSS = `linear-gradient(to right, ${colors[0]}, ${colors[1]})`;
          break;
        case 'diagonal':
          gradientCSS = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
          break;
        case 'radial':
          gradientCSS = `radial-gradient(circle, ${colors[0]}, ${colors[1]})`;
          break;
        default:
          gradientCSS = `linear-gradient(to bottom, ${colors[0]}, ${colors[1]})`;
      }
      
      return { background: gradientCSS };
    }
    // Solid color
    return { background: backgroundConfig.solidColor };
  }, [backgroundConfig]);
  
  // Sync hdrConfig with useHDR and environment settings
  useEffect(() => {
    setUseHDR(hdrConfig.enabled);
    setLightIntensity(hdrConfig.intensity);
    // Sync environment rotation
    setEnvRotation([
      hdrConfig.rotation.x * (Math.PI / 180),
      hdrConfig.rotation.y * (Math.PI / 180),
      hdrConfig.rotation.z * (Math.PI / 180)
    ]);
  }, [hdrConfig]);
  
  // Sync lightingConfig with lighting settings
  useEffect(() => {
    // Map new lighting config to old format
    if (lightingConfig.lights.length > 0) {
      const keyLight = lightingConfig.lights.find(l => l.name.toLowerCase().includes('key')) || lightingConfig.lights[0];
      const fillLight = lightingConfig.lights.find(l => l.name.toLowerCase().includes('fill'));
      const backLight = lightingConfig.lights.find(l => l.name.toLowerCase().includes('back') || l.name.toLowerCase().includes('rim'));
      
      // Helper to convert position to tuple
      const posToTuple = (pos: { x: number; y: number; z: number } | undefined, fallback: [number, number, number]): [number, number, number] => {
        if (!pos) return fallback;
        return [pos.x, pos.y, pos.z];
      };
      
      // Create a compatible lighting preset from new config
      const syncedLighting: LightingPreset = {
        id: 'synced',
        name: 'Custom',
        ambient: lightingConfig.ambientIntensity,
        main: {
          intensity: keyLight?.intensity || 4.0,
          color: keyLight?.color || '#ffffff',
          position: posToTuple(keyLight?.position, [5, 8, 5]),
        },
        fill: {
          intensity: fillLight?.intensity || 2.5,
          color: fillLight?.color || '#e0e8ff',
          position: posToTuple(fillLight?.position, [-5, 3, -3]),
        },
        back: {
          intensity: backLight?.intensity || 2.0,
          color: backLight?.color || '#fff5e0',
          position: posToTuple(backLight?.position, [0, 5, -8]),
        },
      };
      setSelectedLighting(syncedLighting);
    }
  }, [lightingConfig]);
  
  // Sync materialConfig with selectedMaterial - using available properties
  useEffect(() => {
    // Map new material config to old format
    const syncedMaterial: MaterialPreset = {
      id: materialConfig.id || 'custom',
      name: materialConfig.name || 'Custom',
      color: materialConfig.color,
      metalness: materialConfig.metalness,
      roughness: materialConfig.roughness,
      envMapIntensity: materialConfig.envMapIntensity || 1.5,
      // Advanced properties from MaterialConfig
      clearcoat: materialConfig.clearcoat,
      clearcoatRoughness: materialConfig.clearcoatRoughness,
      transmission: materialConfig.transmission,
      thickness: materialConfig.thickness,
      ior: materialConfig.ior,
      sheen: materialConfig.sheen ?? (materialConfig.sheenRoughness ? 1 : 0),
      sheenRoughness: materialConfig.sheenRoughness,
      sheenColor: materialConfig.sheenColor,
      anisotropy: materialConfig.anisotropy,
      anisotropyRotation: materialConfig.anisotropyRotation,
      iridescence: materialConfig.iridescence ?? (materialConfig.iridescenceIOR ? 1 : 0),
      iridescenceIOR: materialConfig.iridescenceIOR,
      specularIntensity: materialConfig.specularIntensity,
      specularColor: materialConfig.specularColor,
    };
    setSelectedMaterial(syncedMaterial);
  }, [materialConfig]);
  
  // Calculate model dimensions when geometry changes
  useEffect(() => {
    if (loadedGeometry) {
      loadedGeometry.computeBoundingBox();
      const box = loadedGeometry.boundingBox;
      if (box) {
        const size = new THREE.Vector3();
        box.getSize(size);
        setModelDimensions({
          width: size.x * 10, // Convert to mm (assuming 1 unit = 1cm)
          height: size.y * 10,
          depth: size.z * 10,
        });
      }
    } else {
      setModelDimensions(null);
    }
  }, [loadedGeometry]);
  
  // Sync viewConfig with wireframe and showGrid
  useEffect(() => {
    // Debug view sets wireframe
    if (viewConfig.debugView === 'wireframe') {
      setWireframe(true);
    } else if (viewConfig.debugView === 'none') {
      setWireframe(false);
    }
    
    // Show axes when enabled in view config
    if (viewConfig.showAxes) {
      setShowGrid(true);
    }
  }, [viewConfig.debugView, viewConfig.showAxes]);
  
  // Resolution change callback
  const handleResolutionChange = useCallback((ratio: number, refining: boolean) => {
    setCurrentResolution(ratio);
    setIsRefining(refining);
  }, []);

  // Apply subdivision when level changes
  useEffect(() => {
    if (!originalGeometry) return;
    
    if (subdivisionLevel === 0) {
      setLoadedGeometry(originalGeometry.clone());
    } else {
      try {
        // Apply Loop Subdivision
        const params = {
          split: true,
          uvSmooth: false,
          preserveEdges: false,
          flatOnly: false,
        };
        const subdivided = LoopSubdivision.modify(originalGeometry, subdivisionLevel, params);
        setLoadedGeometry(subdivided);
        
        // Update model info
        const positionAttribute = subdivided.getAttribute('position');
        const vertices = positionAttribute ? positionAttribute.count : 0;
        const faces = Math.floor(vertices / 3);
        setModelInfo({ vertices, faces });
      } catch (error) {
        console.error('Subdivision error:', error);
      }
    }
  }, [subdivisionLevel, originalGeometry]);
  
  // Calculate weight for single STL geometry (not 3DM with layers)
  useEffect(() => {
    if (!loadedGeometry || layers.length > 0) {
      // Don't calculate for 3DM files with layers - they have their own weight calculation
      setSingleGeometryWeight(undefined);
      setSingleGeometryVolume(undefined);
      return;
    }
    
    const calculateSTLWeight = async () => {
      try {
        const { calculateMeshVolume, calculateGeometryWeight } = await import('@/lib/3d/weight-calculator');
        const volResult = calculateMeshVolume(loadedGeometry);
        
        // Use selected material's id for weight calculation
        const materialId = selectedMaterial?.id || 'gold-18k';
        const weightResult = calculateGeometryWeight(loadedGeometry, materialId);
        
        setSingleGeometryVolume(volResult.volumeMm3);
        if (weightResult) {
          setSingleGeometryWeight(weightResult.weightGrams);
        }
      } catch (error) {
        console.error('Weight calculation error:', error);
        setSingleGeometryWeight(undefined);
        setSingleGeometryVolume(undefined);
      }
    };
    
    calculateSTLWeight();
  }, [loadedGeometry, selectedMaterial, layers.length]);

  // Re-tessellate 3DM when quality changes
  const reTessellate = useCallback(async (newQuality: number) => {
    if (!raw3DMBuffer || !raw3DMFileName) {
      console.log('[Tessellation] No 3DM buffer to re-tessellate');
      return;
    }
    
    console.log(`[Tessellation] Re-tessellating with quality: ${newQuality}`);
    setIsLoading(true);
    setLoadingStatus(`Re-tessellating (quality: ${newQuality.toFixed(2)})...`);
    setTessellationQuality(newQuality);
    
    try {
      const rhinoLoader = await import('@/lib/3d/rhino-loader');
      const { parse3DMFile, setTessellationQuality: setRhinoQuality } = rhinoLoader;
      const { detectLayerType } = await import('@/lib/3d/layer-detector');
      const { calculateMeshVolume, calculateWeight } = await import('@/lib/3d/weight-calculator');
      const { getMaterialById } = await import('@/lib/3d/materials-database');
      
      // Set quality before parsing
      setRhinoQuality(newQuality);
      
      const doc = await parse3DMFile(raw3DMBuffer, raw3DMFileName, newQuality);
      
      // Convert to layers
      const processedLayers: ModelLayer[] = doc.objects.map((obj, index) => {
        const layer = doc.layers.find(l => l.id === obj.layerId) || doc.layers[0];
        const detection = detectLayerType(layer?.name || `Object ${index}`, layer?.color || '#808080');
        
        let volumeInfo = null;
        if (detection.suggestedMaterialId) {
          const volResult = calculateMeshVolume(obj.geometry);
          const material = getMaterialById(detection.suggestedMaterialId);
          if (material) {
            const weightResult = calculateWeight(volResult.volumeMm3, material);
            volumeInfo = {
              volume: volResult.volumeMm3,
              weight: weightResult.weightGrams,
              carats: weightResult.weightCarats,
            };
          }
        }
        
        return {
          id: obj.id || `layer-${index}`,
          name: layer?.name || `Object ${index + 1}`,
          visible: layer?.visible ?? true,
          geometry: obj.geometry,
          materialId: detection.suggestedMaterialId || 'gold-18k',
          color: obj.color || layer?.color || '#808080',
          category: detection.category,
          confidence: detection.confidence,
          volumeInfo,
        };
      });
      
      setLayers(processedLayers);
      
      // Update model info
      let totalVertices = 0;
      let totalFaces = 0;
      processedLayers.forEach(layer => {
        const pos = layer.geometry.getAttribute('position');
        if (pos) {
          totalVertices += pos.count;
          totalFaces += Math.floor(pos.count / 3);
        }
      });
      setModelInfo({ vertices: totalVertices, faces: totalFaces });
      
      console.log(`[Tessellation] Re-tessellation complete: ${processedLayers.length} objects, ${totalVertices} vertices`);
    } catch (error) {
      console.error('[Tessellation] Re-tessellation error:', error);
      alert('Re-tessellation failed. See console for details.');
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
    }
  }, [raw3DMBuffer, raw3DMFileName]);

  // Process file (shared between click and drag&drop)
  const processFile = useCallback(async (file: File) => {
    console.log('[ProcessFile] ========================================');
    console.log('[ProcessFile] File received:', file.name);
    console.log('[ProcessFile] File type:', file.type);
    console.log('[ProcessFile] File size:', file.size, 'bytes');
    console.log('[ProcessFile] File name lowercase:', file.name.toLowerCase());
    
    const fileName = file.name.toLowerCase();
    const isSTL = fileName.endsWith('.stl');
    const is3DM = fileName.endsWith('.3dm');
    const isGLTF = fileName.endsWith('.gltf') || fileName.endsWith('.glb');
    const isFBX = fileName.endsWith('.fbx');
    const isOBJ = fileName.endsWith('.obj');
    
    console.log('[ProcessFile] Format detection:', { isSTL, is3DM, isGLTF, isFBX, isOBJ });
    console.log('[ProcessFile] ========================================');
    
    setIsLoading(true);
    setLoadingStatus('Reading file...');
    setFileName(file.name);
    setLayers([]);
    setLoadedGeometry(null);
    setOriginalGeometry(null);
    setSubdivisionLevel(0);
    setModelInfo(null);

    // Handle GLTF/GLB/FBX/OBJ using unified model loader
    if (isGLTF || isFBX || isOBJ) {
      try {
        setLoadingStatus(`Loading ${isGLTF ? 'GLTF/GLB' : isFBX ? 'FBX' : 'OBJ'} file...`);
        const modelLoader = await import('@/lib/3d/model-loader');
        const { loadModel } = modelLoader;
        
        const result = await loadModel(file, (progress) => {
          setLoadingStatus(progress.status || `Loading... ${progress.percentage}%`);
        });
        
        if (result.scene) {
          // Extract geometries from the scene
          const geometries: THREE.BufferGeometry[] = [];
          result.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry) {
              // Clone and apply world matrix
              const geo = child.geometry.clone();
              geo.applyMatrix4(child.matrixWorld);
              geometries.push(geo);
            }
          });
          
          if (geometries.length > 0) {
            // Merge all geometries into one
            const { mergeGeometries } = await import('three/examples/jsm/utils/BufferGeometryUtils.js');
            const mergedGeometry = mergeGeometries(geometries, false) || geometries[0];
            
            setOriginalGeometry(mergedGeometry.clone());
            setLoadedGeometry(mergedGeometry);
            setLayers([]);
            
            // Calculate model info
            const positionAttribute = mergedGeometry.getAttribute('position');
            const vertices = positionAttribute ? positionAttribute.count : 0;
            const faces = Math.floor(vertices / 3);
            setModelInfo({ vertices, faces });
            
            console.log(`[${isGLTF ? 'GLTF' : isFBX ? 'FBX' : 'OBJ'}] Loaded ${geometries.length} meshes, ${vertices} vertices`);
          } else {
            alert('No meshes found in the model file.');
          }
        } else if (result.geometry) {
          setOriginalGeometry(result.geometry.clone());
          setLoadedGeometry(result.geometry);
          setLayers([]);
          
          const positionAttribute = result.geometry.getAttribute('position');
          const vertices = positionAttribute ? positionAttribute.count : 0;
          const faces = Math.floor(vertices / 3);
          setModelInfo({ vertices, faces });
        }
      } catch (error) {
        console.error('Error loading model:', error);
        alert(`Error loading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      setIsLoading(false);
      setLoadingStatus('');
      return;
    }

    const reader = new FileReader();
    
    if (isSTL) {
      reader.onload = (event) => {
        const contents = event.target?.result;
        if (contents) {
          const loader = new STLLoader();
          try {
            setLoadingStatus('Parsing STL...');
            const geometry = loader.parse(contents as ArrayBuffer);
            setOriginalGeometry(geometry.clone()); // Store original for subdivision
            setLoadedGeometry(geometry);
            setLayers([]);
            
            // Calculate model info
            const positionAttribute = geometry.getAttribute('position');
            const vertices = positionAttribute ? positionAttribute.count : 0;
            const faces = Math.floor(vertices / 3);
            setModelInfo({ vertices, faces });
          } catch (error) {
            console.error('Error parsing STL:', error);
            alert('Error loading STL file');
          }
        }
        setIsLoading(false);
        setLoadingStatus('');
      };
      reader.readAsArrayBuffer(file);
    } else if (is3DM) {
      // 3DM File Support
      console.log('[3DM] Starting 3DM file processing:', file.name);
      reader.onload = async (event) => {
        const contents = event.target?.result;
        console.log('[3DM] File read complete, size:', contents ? (contents as ArrayBuffer).byteLength : 0);
        if (contents) {
          // Store raw buffer for potential re-tessellation
          const buffer = contents as ArrayBuffer;
          setRaw3DMBuffer(buffer.slice(0)); // Clone the buffer
          setRaw3DMFileName(file.name);
          
          try {
            setLoadingStatus('Loading rhino3dm...');
            console.log('[3DM] Importing rhino-loader module...');
            
            // Dynamic import of rhino3dm loader (separate from index to avoid SSR issues)
            const rhinoLoader = await import('@/lib/3d/rhino-loader');
            console.log('[3DM] rhino-loader imported:', Object.keys(rhinoLoader));
            const { parse3DMFile } = rhinoLoader;
            
            const layerDetector = await import('@/lib/3d/layer-detector');
            const { detectLayerType } = layerDetector;
            
            const weightCalc = await import('@/lib/3d/weight-calculator');
            const { calculateMeshVolume, calculateWeight } = weightCalc;
            
            const materialsDb = await import('@/lib/3d/materials-database');
            const { getMaterialById } = materialsDb;
            
            console.log('[3DM] All modules imported successfully');
            
            setLoadingStatus(`Parsing 3DM file (quality: ${tessellationQuality})...`);
            console.log('[3DM] Calling parse3DMFile with quality:', tessellationQuality);
            const doc = await parse3DMFile(buffer, file.name, tessellationQuality);
            console.log('[3DM] parse3DMFile returned:', doc ? `${doc.objects.length} objects, ${doc.layers.length} layers` : 'null');
            
            setLoadingStatus('Processing layers...');
            
            // Convert to our layer format with auto-detection
            const processedLayers: ModelLayer[] = doc.objects.map((obj, index) => {
              const layer = doc.layers.find(l => l.id === obj.layerId) || doc.layers[0];
              const detection = detectLayerType(layer?.name || `Object ${index}`, layer?.color || '#808080');
              
              // Calculate volume and weight if material detected
              let volumeInfo = null;
              if (detection.suggestedMaterialId) {
                const volResult = calculateMeshVolume(obj.geometry);
                const material = getMaterialById(detection.suggestedMaterialId);
                if (material) {
                  const weightResult = calculateWeight(volResult.volumeMm3, material);
                  volumeInfo = {
                    volume: volResult.volumeMm3,
                    weight: weightResult.weightGrams,
                    carats: weightResult.weightCarats,
                  };
                }
              }
              
              return {
                id: obj.id || `layer-${index}`,
                name: layer?.name || `Object ${index + 1}`,
                visible: layer?.visible ?? true,
                geometry: obj.geometry,
                materialId: detection.suggestedMaterialId || 'gold-18k',
                color: obj.color || layer?.color || '#808080',
                category: detection.category,
                confidence: detection.confidence,
                volumeInfo,
              };
            });
            
            setLayers(processedLayers);
            setLoadedGeometry(null);
            setOriginalGeometry(null);
            
            // Calculate model info
            let totalVertices = 0;
            let totalFaces = 0;
            processedLayers.forEach(layer => {
              const pos = layer.geometry.getAttribute('position');
              if (pos) {
                totalVertices += pos.count;
                totalFaces += Math.floor(pos.count / 3);
              }
            });
            setModelInfo({ vertices: totalVertices, faces: totalFaces });
            
            console.log(`[3DM] Loaded ${processedLayers.length} layers from ${file.name}`);
            
            // Warn if no meshable objects found
            if (processedLayers.length === 0) {
              alert(`No displayable objects found in ${file.name}.\n\nPossible reasons:\n- File contains only curves, points, or annotations\n- Geometry could not be converted to mesh\n- File might be from an unsupported Rhino version\n\nCheck browser console (F12) for details.`);
            }
          } catch (error) {
            console.error('Error parsing 3DM:', error);
            alert(`Error loading 3DM file: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
        setIsLoading(false);
        setLoadingStatus('');
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file format. Supported formats: STL, 3DM, GLTF, GLB, FBX, OBJ');
      setIsLoading(false);
      setLoadingStatus('');
    }
  }, [tessellationQuality]);

  // Handle file input change
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[FileUpload] Input change event triggered');
    const file = e.target.files?.[0];
    console.log('[FileUpload] File from input:', file?.name, file?.size);
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  }, [processFile]);

  // Handle drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    console.log('[DragDrop] Drop event triggered');
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    console.log('[DragDrop] File from drop:', file?.name, file?.size);
    if (file) {
      processFile(file);
    } else {
      console.warn('[DragDrop] No file in dataTransfer');
    }
  }, [processFile]);

  // Reset view
  const handleResetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(0.8);
      controlsRef.current.update();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(1.25);
      controlsRef.current.update();
    }
  }, []);

  // Rotate model 90 degrees
  const handleRotateX = useCallback(() => {
    setModelRotation(prev => [prev[0] + Math.PI / 2, prev[1], prev[2]]);
  }, []);

  const handleRotateY = useCallback(() => {
    setModelRotation(prev => [prev[0], prev[1] + Math.PI / 2, prev[2]]);
  }, []);

  const handleRotateZ = useCallback(() => {
    setModelRotation(prev => [prev[0], prev[1], prev[2] + Math.PI / 2]);
  }, []);
  
  // Auto-orient model to correct X/Y/Z axis (detect Z-up and convert to Y-up)
  const handleAutoOrient = useCallback(() => {
    // For Rhino/CAD files, models are typically Z-up
    // We need to rotate -90 degrees around X to convert to Y-up (Three.js convention)
    // This is the most common case for jewelry 3D models
    setModelRotation([-Math.PI / 2, 0, 0]);
    
    // Fit to view after orientation change
    setTimeout(() => {
      fitToViewFn?.();
    }, 100);
  }, [fitToViewFn]);

  // Take snapshot
  const handleSnapshot = useCallback(() => {
    // Hide grid and gizmo during snapshot
    setIsSnapshotMode(true);
    
    // Wait for next frame to render without grid, then take snapshot
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('take-3d-snapshot', { detail: { scale: snapshotScale } }));
        // Restore grid after snapshot
        setTimeout(() => setIsSnapshotMode(false), 100);
      });
    });
  }, [snapshotScale]);

  // Handle snapshot result
  const handleSnapshotResult = useCallback((dataUrl: string) => {
    setSnapshotPreview(dataUrl);
  }, []);

  // Download snapshot
  const handleDownloadSnapshot = useCallback(() => {
    if (snapshotPreview) {
      const link = document.createElement('a');
      link.download = `${fileName?.replace(/\.[^/.]+$/, '') || 'model'}_snapshot.png`;
      link.href = snapshotPreview;
      link.click();
    }
  }, [snapshotPreview, fileName]);

  // Open in Studio - saves to gallery first, then redirects
  const handleOpenInStudio = useCallback(async (imageData: string) => {
    try {
      // 1. Save to gallery first
      const { saveImageToGallery } = await import('@/lib/gallery-storage');
      await saveImageToGallery(
        imageData, 
        `3D View: ${fileName || 'Model Snapshot'}`,
        'manual',
        {
          prompt: `3D View snapshot of ${fileName || 'model'}`,
        }
      );
      
      // 2. Dispatch gallery update event
      window.dispatchEvent(new Event('gallery-updated'));
      
      // 3. Store image in sessionStorage for Studio to pick up
      sessionStorage.setItem('studio-import-image', imageData);
      sessionStorage.setItem('studio-import-source', '3d-view');
      sessionStorage.setItem('studio-import-timestamp', Date.now().toString());
      
      // 4. Navigate to studio with a small delay to ensure storage is written
      setTimeout(() => {
        window.location.href = '/studio';
      }, 100);
    } catch (error) {
      console.error('Error saving to gallery:', error);
      // Still try to open in studio even if gallery save fails
      sessionStorage.setItem('studio-import-image', imageData);
      sessionStorage.setItem('studio-import-source', '3d-view');
      window.location.href = '/studio';
    }
  }, [fileName]);

  // Take snapshot and open directly in Studio (shutter button)
  const handleShutterClick = useCallback(() => {
    setIsSnapshotMode(true);
    
    // Wait for grid/gizmo to hide, then take snapshot
    setTimeout(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        // Render one more frame
        requestAnimationFrame(() => {
          const dataUrl = canvas.toDataURL('image/png');
          
          // Set preview
          setSnapshotPreview(dataUrl);
          
          // Save to gallery and open in studio
          handleOpenInStudio(dataUrl);
          
          // Restore snapshot mode after a delay
          setTimeout(() => setIsSnapshotMode(false), 200);
        });
      } else {
        setIsSnapshotMode(false);
      }
    }, 100);
  }, [handleOpenInStudio]);

  // Save snapshot to gallery
  const handleSaveToGallery = useCallback(async () => {
    if (!snapshotPreview) return;
    
    try {
      const { saveImageToGallery } = await import('@/lib/gallery-storage');
      await saveImageToGallery(
        snapshotPreview, 
        `3D View: ${fileName || 'Unknown'}`,
        'manual',
        {
          prompt: `3D View snapshot of ${fileName || 'model'}`,
        }
      );
      
      // Dispatch event to update gallery count
      window.dispatchEvent(new Event('gallery-updated'));
      alert('Saved to gallery!');
    } catch (error) {
      console.error('Error saving to gallery:', error);
      alert('Error saving to gallery');
    }
  }, [snapshotPreview, fileName]);

  // Clear model - properly dispose geometries to prevent memory leaks
  const handleClearModel = useCallback(() => {
    // Dispose single geometry
    if (loadedGeometry) {
      loadedGeometry.dispose();
    }
    
    // Dispose all layer geometries
    layers.forEach(layer => {
      if (layer.geometry) {
        layer.geometry.dispose();
      }
    });
    
    setLoadedGeometry(null);
    setFileName(null);
    setLayers([]);
    setLayerMaterials({});
    setModelInfo(null);
  }, [loadedGeometry, layers]);

  // Export: Screenshot with config
  const handleExportScreenshot = useCallback(async (config: ScreenshotConfig) => {
    setIsExporting(true);
    
    // Hide grid/gizmo during export
    setIsSnapshotMode(true);
    
    await new Promise(resolve => setTimeout(resolve, 150)); // Wait for re-render
    
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      
      // Create offscreen canvas at target resolution
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = config.resolution.width;
      offscreenCanvas.height = config.resolution.height;
      const ctx = offscreenCanvas.getContext('2d');
      
      if (!ctx) throw new Error('Failed to get 2D context');
      
      // Handle background
      if (!config.transparentBackground || config.format !== 'png') {
        ctx.fillStyle = config.format === 'jpeg' ? '#ffffff' : backgroundColor;
        ctx.fillRect(0, 0, config.resolution.width, config.resolution.height);
      }
      
      // Draw the WebGL canvas to offscreen canvas
      ctx.drawImage(canvas, 0, 0, config.resolution.width, config.resolution.height);
      
      // Convert to blob and download
      const mimeType = config.format === 'png' ? 'image/png' : config.format === 'jpeg' ? 'image/jpeg' : 'image/webp';
      const blob = await new Promise<Blob>((resolve, reject) => {
        offscreenCanvas.toBlob(
          (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
          mimeType,
          config.quality
        );
      });
      
      const filename = generateFilename(fileName?.replace(/\.[^/.]+$/, '') || 'model', config.format);
      downloadBlob(blob, filename);
      
      // Also set as preview
      setSnapshotPreview(offscreenCanvas.toDataURL(mimeType, config.quality));
    } catch (error) {
      console.error('Screenshot export error:', error);
      alert('Failed to export screenshot');
    } finally {
      setIsSnapshotMode(false);
      setIsExporting(false);
    }
  }, [backgroundColor, fileName]);

  // Export: Video/GIF
  const handleExportVideo = useCallback(async (config: VideoConfig) => {
    setIsExporting(true);
    setExportProgress({ currentFrame: 0, totalFrames: config.fps * config.duration, phase: 'capturing' });
    
    // Store initial rotation
    initialRotation.current = [...modelRotation];
    
    // Hide UI during capture
    setIsSnapshotMode(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      
      // Function to rotate model during capture
      const rotateModelForCapture = (angleDegrees: number) => {
        const angleRad = (angleDegrees * Math.PI) / 180;
        setModelRotation([
          initialRotation.current[0],
          initialRotation.current[1] + angleRad,
          initialRotation.current[2],
        ]);
      };
      
      await exportTurntableVideo({
        canvas,
        config,
        rotateModel: rotateModelForCapture,
        onProgress: setExportProgress,
        hideUI: () => setIsSnapshotMode(true),
        restoreUI: () => {
          setIsSnapshotMode(false);
          // Restore original rotation
          setModelRotation(initialRotation.current);
        },
      });
      
    } catch (error) {
      console.error('Video export error:', error);
      alert(`Video export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSnapshotMode(false);
      setIsExporting(false);
      setExportProgress(null);
      // Restore original rotation
      setModelRotation(initialRotation.current);
    }
  }, [modelRotation]);

  // Export: Multi-angle
  const handleExportMultiAngle = useCallback(async (config: MultiAngleConfig) => {
    setIsExporting(true);
    
    // Hide UI during capture
    setIsSnapshotMode(true);
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) throw new Error('Canvas not found');
      
      const exportedImages: { name: string; dataUrl: string }[] = [];
      
      // Save current camera position
      const currentRotation = [...modelRotation] as [number, number, number];
      
      // Camera angle mappings (simplified Y-axis rotations for demo)
      const angleMap: Record<string, [number, number, number]> = {
        'front': [currentRotation[0], 0, currentRotation[2]],
        'back': [currentRotation[0], Math.PI, currentRotation[2]],
        'left': [currentRotation[0], -Math.PI / 2, currentRotation[2]],
        'right': [currentRotation[0], Math.PI / 2, currentRotation[2]],
        'top': [-Math.PI / 2, 0, currentRotation[2]],
        'bottom': [Math.PI / 2, 0, currentRotation[2]],
        'three-quarter': [currentRotation[0] - 0.3, Math.PI / 4, currentRotation[2]],
        'hero': [currentRotation[0] - 0.2, Math.PI / 5, currentRotation[2]],
        'low-angle': [currentRotation[0] + 0.3, Math.PI / 4, currentRotation[2]],
        'close-up': [currentRotation[0], 0, currentRotation[2]],
      };
      
      for (let i = 0; i < config.angles.length; i++) {
        const angleId = config.angles[i];
        const rotation = angleMap[angleId] || currentRotation;
        
        // Set rotation
        setModelRotation(rotation);
        
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 200));
        await new Promise(resolve => requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        }));
        
        // Create offscreen canvas at target resolution
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = config.resolution.width;
        offscreenCanvas.height = config.resolution.height;
        const ctx = offscreenCanvas.getContext('2d');
        
        if (!ctx) throw new Error('Failed to get 2D context');
        
        // Handle background
        if (config.format === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, config.resolution.width, config.resolution.height);
        }
        
        // Draw canvas
        ctx.drawImage(canvas, 0, 0, config.resolution.width, config.resolution.height);
        
        const mimeType = config.format === 'png' ? 'image/png' : config.format === 'jpeg' ? 'image/jpeg' : 'image/webp';
        const dataUrl = offscreenCanvas.toDataURL(mimeType, config.quality);
        
        exportedImages.push({
          name: `${fileName?.replace(/\.[^/.]+$/, '') || 'model'}_${angleId}.${config.format}`,
          dataUrl,
        });
        
        setExportProgress({
          currentFrame: i + 1,
          totalFrames: config.angles.length,
          phase: 'capturing',
        });
      }
      
      // Restore rotation
      setModelRotation(currentRotation);
      
      // Download all images
      setExportProgress({
        currentFrame: config.angles.length,
        totalFrames: config.angles.length,
        phase: 'encoding',
      });
      
      // Download each image with a small delay
      for (let i = 0; i < exportedImages.length; i++) {
        const { name, dataUrl } = exportedImages[i];
        const link = document.createElement('a');
        link.download = name;
        link.href = dataUrl;
        link.click();
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setExportProgress({
        currentFrame: config.angles.length,
        totalFrames: config.angles.length,
        phase: 'complete',
      });
      
    } catch (error) {
      console.error('Multi-angle export error:', error);
      alert(`Multi-angle export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSnapshotMode(false);
      setIsExporting(false);
      setExportProgress(null);
    }
  }, [modelRotation, fileName]);

  // Get current material presets
  const currentPresets = materialType === 'metal' 
    ? METAL_PRESETS 
    : materialType === 'stone' 
      ? STONE_PRESETS 
      : MATTE_PRESETS;

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-[#0a0a0a]"
      style={{
        left: leftOpen ? '256px' : '56px',
        right: rightOpen ? '280px' : '0',
        transition: 'left 800ms cubic-bezier(0.4, 0.0, 0.2, 1), right 800ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      }}
    >
      {/* Top Bar */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-black/40 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Box className="h-5 w-5 text-white/60" />
          <h1 className="text-sm font-medium text-white/80">3D View</h1>
          {fileName && (
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/50">
              {fileName}
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomIn}
            disabled={!loadedGeometry && layers.length === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={!loadedGeometry && layers.length === 0}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* View Toggles */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-all ${
              autoRotate
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            title="Auto Rotate"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-all ${
              showGrid
                ? 'bg-white/15 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            title="Toggle Grid"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-all ${
              wireframe
                ? 'bg-white/15 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            title="Toggle Wireframe"
          >
            <Box className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* Rotation Controls */}
          <div className="flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1">
            <button
              onClick={handleRotateX}
              disabled={!loadedGeometry && layers.length === 0}
              className="flex h-7 w-7 items-center justify-center rounded text-white/60 hover:bg-white/10 disabled:opacity-30"
              title="Rotate X (90°)"
            >
              <span className="text-[10px] font-medium">X</span>
            </button>
            <button
              onClick={handleRotateY}
              disabled={!loadedGeometry && layers.length === 0}
              className="flex h-7 w-7 items-center justify-center rounded text-white/60 hover:bg-white/10 disabled:opacity-30"
              title="Rotate Y (90°)"
            >
              <span className="text-[10px] font-medium">Y</span>
            </button>
            <button
              onClick={handleRotateZ}
              disabled={!loadedGeometry && layers.length === 0}
              className="flex h-7 w-7 items-center justify-center rounded text-white/60 hover:bg-white/10 disabled:opacity-30"
              title="Rotate Z (90°)"
            >
              <span className="text-[10px] font-medium">Z</span>
            </button>
            <button
              onClick={handleAutoOrient}
              disabled={!loadedGeometry && layers.length === 0}
              className="flex h-7 items-center justify-center rounded px-2 text-white/60 hover:bg-white/10 disabled:opacity-30 border-l border-white/10"
              title="Auto Orient (Z-up to Y-up)"
            >
              <Compass className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mx-1 h-4 w-px bg-white/10" />

          <button
            onClick={() => fitToViewFn?.()}
            disabled={!loadedGeometry && layers.length === 0}
            className="flex h-8 items-center gap-1.5 rounded-md bg-white/5 px-2.5 text-xs text-white/60 hover:bg-white/10 disabled:opacity-30"
            title="Fit to View (Center model)"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleResetView}
            className="flex h-8 items-center gap-1.5 rounded-md bg-white/5 px-2.5 text-xs text-white/60 hover:bg-white/10"
            title="Reset View"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* Snapshot with scale selector */}
          <div className="flex items-center rounded-md border border-white/10 bg-white/5">
            <select
              value={snapshotScale}
              onChange={(e) => setSnapshotScale(Number(e.target.value) as 1 | 2 | 4)}
              className="h-8 appearance-none bg-transparent px-2 text-xs text-white/60 outline-none"
            >
              <option value={1} className="bg-black">1x</option>
              <option value={2} className="bg-black">2x</option>
              <option value={4} className="bg-black">4x</option>
            </select>
          </div>
          
          <button
            onClick={handleSnapshot}
            disabled={!loadedGeometry && layers.length === 0}
            className="flex h-8 items-center gap-1.5 rounded-md bg-purple-500 px-3 text-xs font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera className="h-3.5 w-3.5" />
            Snapshot
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* Shutter Button - Take snapshot and open in Studio */}
          <button
            onClick={handleShutterClick}
            disabled={!loadedGeometry && layers.length === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-lg hover:from-rose-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:scale-105"
            title="Capture & Open in Studio"
          >
            <div className="h-5 w-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-white" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas */}
        <div 
          className="relative flex-1"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-purple-500/20 backdrop-blur-sm">
              <div className="rounded-2xl border-2 border-dashed border-purple-400 bg-purple-500/10 p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-purple-400" />
                <p className="mt-4 text-lg font-medium text-white">Drop 3D model here</p>
                <p className="mt-2 text-sm text-purple-300">STL or 3DM format</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-400" />
                <p className="mt-2 text-sm text-white/60">{loadingStatus || 'Loading model...'}</p>
              </div>
            </div>
          )}

          {!loadedGeometry && layers.length === 0 && !isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="text-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  <Upload className="h-12 w-12 text-white/30" />
                  <span className="mt-4 text-lg font-medium text-white/60">
                    Upload 3D Model
                  </span>
                  <span className="mt-2 text-sm text-white/40">
                    Supports STL and 3DM formats
                  </span>
                </button>
                <p className="text-xs text-white/30">
                  Or drag and drop a file here
                </p>
              </div>
            </div>
          )}

          <Canvas
            shadows
            camera={{ position: [3, 2, 3], fov: 50 }}
            frameloop="always"
            gl={{ 
              preserveDrawingBuffer: true, 
              antialias: true,
              failIfMajorPerformanceCaveat: false,
              powerPreference: 'high-performance',
              alpha: true, // Enable alpha channel for transparent backgrounds
            }}
            style={canvasBackgroundStyle}
            onCreated={(state) => {
              // Handle transparent background
              if (backgroundConfig.type === 'transparent') {
                state.gl.setClearColor(0x000000, 0); // Fully transparent
              } else {
                state.gl.setClearColor(backgroundColor, 1);
              }
            }}
          >
            <Suspense fallback={null}>
              <SceneContent
                geometry={loadedGeometry}
                material={selectedMaterial}
                layers={layers}
                layerMaterials={layerMaterials}
                autoRotate={autoRotate}
                showGrid={showGrid && !isSnapshotMode}
                wireframe={wireframe}
                studioPreset={selectedStudio}
                hdrPreset={selectedHDR}
                useHDR={useHDR}
                backgroundColor={backgroundColor}
                backgroundType={backgroundConfig.type}
                modelRotation={modelRotation}
                lighting={selectedLighting}
                lightIntensity={lightIntensity}
                onControlsReady={(controls) => { controlsRef.current = controls; }}
                onFitToView={(fn) => setFitToViewFn(() => fn)}
                envRotation={envRotation}
                adaptiveResolution={adaptiveResolution}
                onResolutionChange={handleResolutionChange}
                // New configs
                groundConfig={groundConfig}
                postProcessingConfig={postProcessingConfig}
                diamondConfig={diamondConfig}
                // Turntable
                turntableConfig={turntableConfig}
                isTurntablePlaying={isTurntablePlaying}
                // Focus
                focusConfig={focusConfig}
                // Selection
                onSelectObject={(objectId, mesh) => {
                  setSelectedObjectId(objectId);
                  setSelectedMeshRef(mesh);
                }}
                selectedMesh={selectedMeshRef}
                selectionEnabled={!isTransforming}
              />
              <SnapshotHelper onSnapshot={handleSnapshotResult} />
            </Suspense>
          </Canvas>

          {/* Controls hint */}
          {(loadedGeometry || layers.length > 0) && (
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 text-xs text-white/40 backdrop-blur-sm">
              <span className="text-white/60">Left:</span> Rotate &nbsp;
              <span className="text-white/60">Right:</span> Pan &nbsp;
              <span className="text-white/60">Scroll:</span> Zoom
            </div>
          )}
          
          {/* Resolution indicator */}
          {adaptiveResolution && (loadedGeometry || layers.length > 0) && !exportProgress && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm">
              <div className={`h-2 w-2 rounded-full ${isRefining ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-[10px] text-white/50">
                {isRefining ? 'Refining...' : 'HD'}
              </span>
              <span className="text-[10px] font-mono text-white/30">
                {Math.round(currentResolution * 100)}%
              </span>
            </div>
          )}
          
          {/* Export Progress Indicator */}
          {exportProgress && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="rounded-2xl border border-white/10 bg-black/80 p-6 text-center shadow-2xl">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-400" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  {exportProgress.phase === 'capturing' ? 'Capturing Frames...' : 
                   exportProgress.phase === 'encoding' ? 'Encoding Video...' : 'Complete!'}
                </h3>
                <p className="mt-2 text-sm text-white/60">
                  Frame {exportProgress.currentFrame} / {exportProgress.totalFrames}
                </p>
                <div className="mt-4 h-2 w-48 overflow-hidden rounded-full bg-white/10">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-150"
                    style={{ width: `${(exportProgress.currentFrame / exportProgress.totalFrames) * 100}%` }}
                  />
                </div>
                {exportProgress.estimatedSize && (
                  <p className="mt-2 text-xs text-white/40">
                    Size: {exportProgress.estimatedSize}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel Toggle Button */}
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="fixed right-0 top-1/2 z-50 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-l-md border border-r-0 border-white/10 bg-[#0a0a0a] text-white/50 transition-all hover:text-white"
          style={{
            right: rightOpen ? '320px' : '0',
            transition: 'right 500ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        >
          {rightOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Right Panel - NEW ORGANIZED VERSION */}
        <div 
          className="fixed right-0 top-0 bottom-0 z-40 flex flex-col border-l border-white/5 bg-[#0a0a0a]"
          style={{
            width: rightOpen ? '320px' : '0',
            opacity: rightOpen ? 1 : 0,
            transition: 'width 500ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 300ms ease',
          }}
        >
          {rightOpen && (
            <ThreeDRightPanel
              isOpen={rightOpen}
              onToggle={() => setRightOpen(false)}
              fileName={fileName}
              modelInfo={modelInfo}
              has3DMFile={!!raw3DMBuffer}
              layers={layers.map(l => ({
                id: l.id,
                name: l.name,
                visible: l.visible,
                color: l.color,
                category: l.category === 'setting' ? 'metal' as const : 
                         l.category === 'unknown' ? 'other' as const : 
                         l.category as 'metal' | 'stone' | 'other' | undefined,
              }))}
              onLayerVisibilityChange={(id, visible) => {
                setLayers(prev => prev.map(l => l.id === id ? { ...l, visible } : l));
              }}
              onLayerMaterialChange={(id, materialId) => {
                const preset = METAL_PRESETS.find(p => p.id === materialId) || STONE_PRESETS.find(p => p.id === materialId);
                if (preset) {
                  setLayerMaterials(prev => ({ ...prev, [id]: preset }));
                }
              }}
              showGrid={showGrid}
              onShowGridChange={setShowGrid}
              wireframe={wireframe}
              onWireframeChange={setWireframe}
              autoRotate={autoRotate}
              onAutoRotateChange={setAutoRotate}
              selectedMaterial={materialConfig}
              onMaterialChange={(updates) => setMaterialConfig(prev => ({ ...prev, ...updates }))}
              lightingConfig={lightingConfig}
              onLightingChange={(updates) => setLightingConfig(prev => ({ ...prev, ...updates }))}
              hdrConfig={hdrConfig}
              onHDRChange={(updates) => setHDRConfig(prev => ({ ...prev, ...updates }))}
              backgroundConfig={backgroundConfig}
              onBackgroundChange={(updates) => setBackgroundConfig(prev => ({ ...prev, ...updates }))}
              groundConfig={groundConfig}
              onGroundChange={(updates) => setGroundConfig(prev => ({ ...prev, ...updates }))}
              diamondConfig={diamondConfig}
              onDiamondChange={(updates) => setDiamondConfig(prev => ({ ...prev, ...updates }))}
              postProcessingConfig={postProcessingConfig}
              onPostProcessingChange={(updates) => setPostProcessingConfig(prev => ({ ...prev, ...updates }))}
              edgeSmoothingConfig={edgeSmoothingConfig}
              onEdgeSmoothingChange={(updates) => setEdgeSmoothingConfig(prev => ({ ...prev, ...updates }))}
              onApplyEdgeSmoothing={() => {
                // Apply subdivision
                if (!originalGeometry) return;
                setIsProcessingEdges(true);
                try {
                  const params = { split: true, uvSmooth: false, preserveEdges: false, flatOnly: false };
                  const subdivided = LoopSubdivision.modify(originalGeometry, edgeSmoothingConfig.subdivisionLevel, params);
                  setLoadedGeometry(subdivided);
                  const positionAttribute = subdivided.getAttribute('position');
                  const vertices = positionAttribute ? positionAttribute.count : 0;
                  const faces = Math.floor(vertices / 3);
                  setModelInfo({ vertices, faces });
                } catch (e) {
                  console.error('Edge smoothing error:', e);
                } finally {
                  setIsProcessingEdges(false);
                }
              }}
              isProcessingEdges={isProcessingEdges}
              turntableConfig={turntableConfig}
              onTurntableChange={(updates) => setTurntableConfig(prev => ({ ...prev, ...updates }))}
              isTurntablePlaying={isTurntablePlaying}
              onTurntableToggle={() => setIsTurntablePlaying(!isTurntablePlaying)}
              onTurntableReset={() => setModelRotation([-Math.PI / 2, 0, 0])}
              videoConfig={videoConfig}
              onVideoConfigChange={(updates) => setVideoConfig(prev => ({ ...prev, ...updates }))}
              recordingState={recordingState}
              onStartRecording={() => {
                // Convert videoConfig to VideoConfig format and export
                const config: VideoConfig = {
                  format: videoConfig.format === 'gif' ? 'gif' : 'webm',
                  quality: videoConfig.quality === 'high' ? 0.95 : videoConfig.quality === 'medium' ? 0.8 : 0.6,
                  fps: videoConfig.fps,
                  duration: videoConfig.duration,
                  resolution: { 
                    id: 'custom',
                    name: `${videoConfig.width}x${videoConfig.height}`,
                    width: videoConfig.width, 
                    height: videoConfig.height,
                    aspectRatio: `${videoConfig.width}:${videoConfig.height}`,
                  },
                  rotationType: 'turntable',
                  rotationDegrees: 360,
                };
                handleExportVideo(config);
              }}
              onStopRecording={() => {
                setIsExporting(false);
                setExportProgress(null);
              }}
              onPauseRecording={() => console.log('Pause not supported')}
              onTakeScreenshot={handleSnapshot}
              batchConfig={batchConfig}
              onBatchConfigChange={(updates) => setBatchConfig(prev => ({ ...prev, ...updates }))}
              batchProgress={batchProgress}
              onStartBatchExport={() => {
                // Convert batchConfig angles to MultiAngleConfig format
                const config: MultiAngleConfig = {
                  angles: batchConfig.angles.map(a => a.id),
                  format: batchConfig.format === 'png' ? 'png' : 'jpeg',
                  resolution: { 
                    id: 'custom',
                    name: `${batchConfig.width}x${batchConfig.height}`,
                    width: batchConfig.width, 
                    height: batchConfig.height,
                    aspectRatio: `${batchConfig.width}:${batchConfig.height}`,
                  },
                  quality: batchConfig.quality,
                  namingPattern: batchConfig.namingPattern === 'angle' ? 'preset-name' : 'numbered',
                };
                handleExportMultiAngle(config);
              }}
              onCancelBatchExport={() => {
                setIsExporting(false);
              }}
              onPreviewAngle={(angle) => {
                // Preview angle - apply rotation to model
                if (angle.rotation) {
                  setModelRotation([
                    THREE.MathUtils.degToRad(angle.rotation.x) - Math.PI / 2,
                    THREE.MathUtils.degToRad(angle.rotation.y),
                    THREE.MathUtils.degToRad(angle.rotation.z),
                  ]);
                }
              }}
              snapshotPreview={snapshotPreview}
              onDownloadSnapshot={handleDownloadSnapshot}
              onSaveToGallery={handleSaveToGallery}
              onOpenInStudio={() => snapshotPreview && handleOpenInStudio(snapshotPreview)}
              onClearSnapshot={() => setSnapshotPreview(null)}
              onFileUpload={() => fileInputRef.current?.click()}
              onClearModel={handleClearModel}
              // NEW panel props
              measurementConfig={measurementConfig}
              onMeasurementChange={(updates) => setMeasurementConfig(prev => ({ ...prev, ...updates }))}
              modelDimensions={modelDimensions}
              onRecalculateDimensions={() => {
                // Recalculate dimensions from bounding box
                if (loadedGeometry) {
                  loadedGeometry.computeBoundingBox();
                  const box = loadedGeometry.boundingBox;
                  if (box) {
                    const size = new THREE.Vector3();
                    box.getSize(size);
                    setModelDimensions({
                      width: size.x * 10, // Convert to mm
                      height: size.y * 10,
                      depth: size.z * 10,
                    });
                  }
                }
              }}
              viewConfig={viewConfig}
              onViewChange={(updates) => setViewConfig(prev => ({ ...prev, ...updates }))}
              onCameraPreset={(preset) => {
                if (controlsRef.current) {
                  // Apply camera preset
                  controlsRef.current.object.position.set(...preset.position);
                  controlsRef.current.target.set(...preset.target);
                  controlsRef.current.object.fov = preset.fov;
                  controlsRef.current.object.updateProjectionMatrix();
                  controlsRef.current.update();
                }
              }}
              onViewAngle={(angleId) => {
                // Apply view angle preset
                const anglePresets: Record<string, [number, number, number]> = {
                  front: [0, 0, 3],
                  back: [0, 0, -3],
                  left: [-3, 0, 0],
                  right: [3, 0, 0],
                  top: [0, 3, 0.01],
                  bottom: [0, -3, 0.01],
                  iso: [2, 2, 2],
                };
                const position = anglePresets[angleId];
                if (position && controlsRef.current) {
                  controlsRef.current.object.position.set(...position);
                  controlsRef.current.target.set(0, 0, 0);
                  controlsRef.current.update();
                }
              }}
              onResetCamera={() => {
                if (controlsRef.current) {
                  controlsRef.current.object.position.set(3, 2, 3);
                  controlsRef.current.target.set(0, 0, 0);
                  controlsRef.current.update();
                }
              }}
              focusConfig={focusConfig}
              onFocusChange={(updates) => setFocusConfig(prev => ({ ...prev, ...updates }))}
              annotationConfig={annotationConfig}
              onAnnotationChange={(updates) => setAnnotationConfig(prev => ({ ...prev, ...updates }))}
              onAddAnnotation={(type) => {
                console.log('Add annotation:', type);
                // Annotation functionality - add to state
              }}
              transformConfig={transformAdvancedConfig}
              onTransformChange={(updates) => setTransformAdvancedConfig(prev => ({ ...prev, ...updates }))}
              onTransformReset={() => {
                setTransformAdvancedConfig(DEFAULT_TRANSFORM_ADVANCED_CONFIG);
                setModelRotation([-Math.PI / 2, 0, 0]);
              }}
              // Product Transform props
              productTransform={productTransform}
              productFlip={productFlip}
              onProductTransformChange={(transform) => {
                setProductTransform(transform);
                // Apply rotation to modelRotation
                setModelRotation([
                  THREE.MathUtils.degToRad(transform.rotation.x) - Math.PI / 2,
                  THREE.MathUtils.degToRad(transform.rotation.y),
                  THREE.MathUtils.degToRad(transform.rotation.z),
                ]);
              }}
              onProductFlipChange={setProductFlip}
              // Camera Controls props
              cameraSettings={cameraSettings}
              currentCameraPresetId={currentCameraPresetId}
              onCameraSettingsChange={(settings) => {
                setCameraSettings(settings);
                // Apply FOV to camera
                if (controlsRef.current) {
                  controlsRef.current.object.fov = settings.fov;
                  controlsRef.current.object.updateProjectionMatrix();
                  controlsRef.current.enableDamping = settings.enableDamping;
                  controlsRef.current.dampingFactor = settings.dampingFactor;
                  controlsRef.current.enablePan = settings.enablePan;
                  controlsRef.current.panSpeed = settings.panSpeed;
                  controlsRef.current.enableZoom = settings.enableZoom;
                  controlsRef.current.zoomSpeed = settings.zoomSpeed;
                  controlsRef.current.enableRotate = settings.enableRotate;
                  controlsRef.current.rotateSpeed = settings.rotateSpeed;
                  controlsRef.current.minDistance = settings.minDistance;
                  controlsRef.current.maxDistance = settings.maxDistance;
                  controlsRef.current.update();
                }
              }}
              onCameraPresetSelect={(preset) => {
                setCurrentCameraPresetId(preset.id);
                if (controlsRef.current) {
                  controlsRef.current.object.position.set(...preset.position);
                  controlsRef.current.target.set(...preset.target);
                  controlsRef.current.object.fov = preset.fov;
                  controlsRef.current.object.updateProjectionMatrix();
                  controlsRef.current.update();
                }
              }}
              onFitToView={() => fitToViewFn?.()}
              // Layer Group Panel
              layerItems={layers.map(l => ({
                id: l.id,
                name: l.name,
                visible: l.visible,
                color: l.color,
                category: (l.category === 'setting' ? 'metal' : l.category || 'unknown') as LayerCategory,
                materialId: layerMaterials[l.id]?.id || null,
              }))}
              selectedLayerId={selectedLayerId}
              onSelectLayer={setSelectedLayerId}
              onToggleLayerVisibility={(id) => {
                setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
              }}
              onToggleAllLayerVisibility={(category, visible) => {
                setLayers(prev => prev.map(l => 
                  (l.category === category || (category === 'metal' && l.category === 'setting'))
                    ? { ...l, visible }
                    : l
                ));
              }}
              // Material Picker
              materialPickerOpen={materialPickerOpen}
              materialPickerLayerId={materialPickerLayerId}
              materialPickerCategory={materialPickerCategory}
              onMaterialPickerClose={() => setMaterialPickerOpen(false)}
              onMaterialPickerOpen={(layerId) => {
                const layer = layers.find(l => l.id === layerId);
                if (layer) {
                  setMaterialPickerLayerId(layerId);
                  setMaterialPickerCategory(
                    layer.category === 'stone' ? 'stone' : 
                    layer.category === 'setting' ? 'setting' : 'metal'
                  );
                  setMaterialPickerOpen(true);
                }
              }}
              onMaterialSelect={(materialId) => {
                if (materialPickerLayerId) {
                  const preset = METAL_PRESETS.find(p => p.id === materialId) || STONE_PRESETS.find(p => p.id === materialId);
                  if (preset) {
                    setLayerMaterials(prev => ({ ...prev, [materialPickerLayerId]: preset }));
                  }
                }
                setMaterialPickerOpen(false);
              }}
              // Environment Picker
              selectedEnvironment={selectedEnvironment}
              onEnvironmentChange={(env) => {
                setSelectedEnvironment(env);
                // Sync with HDR settings
                if (env.type === 'hdri') {
                  setUseHDR(true);
                  setLightIntensity(env.intensity);
                  setSelectedHDR(HDR_PRESETS.find(p => p.id === env.hdriPreset) || null);
                } else if (env.type === 'custom' && env.customPath) {
                  // Custom HDR/EXR file from public/environments
                  setUseHDR(true);
                  setLightIntensity(env.intensity);
                  // Set custom HDR preset with the file path
                  setSelectedHDR({
                    id: 'custom',
                    name: env.customName || 'Custom',
                    file: env.customPath,
                    preview: 'linear-gradient(135deg, #3a3a5a 0%, #5a5a7a 50%, #2a2a4a 100%)',
                    description: 'Custom HDR/EXR environment',
                  });
                } else if (env.type === 'studio') {
                  setUseHDR(false);
                }
              }}
              // Export Panel
              onScreenshot={async (config) => {
                await handleSnapshot();
              }}
              onVideoExport={async (config) => {
                await handleExportVideo(config);
              }}
              onMultiAngleExport={async (config) => {
                await handleExportMultiAngle(config);
              }}
              // Diamond Effects
              diamondEffects={diamondEffects}
              onDiamondEffectsChange={setDiamondEffects}
              selectedGemstone={selectedGemstone}
              onGemstoneChange={setSelectedGemstone}
              selectedCut={selectedCut}
              onCutChange={setSelectedCut}
              // Orientation Modal
              orientationModalOpen={orientationModalOpen}
              onOrientationModalClose={() => setOrientationModalOpen(false)}
              onOrientationConfirm={(config) => {
                // Apply orientation to model
                const rotX = THREE.MathUtils.degToRad(config.rotationX);
                const rotY = THREE.MathUtils.degToRad(config.rotationY);
                const rotZ = THREE.MathUtils.degToRad(config.rotationZ);
                setModelRotation([rotX - Math.PI / 2, rotY, rotZ]);
                setOrientationModalOpen(false);
              }}
              orientationGeometry={loadedGeometry || undefined}
              orientationScene={undefined}
              // Single geometry weight (for STL files)
              singleGeometryWeight={singleGeometryWeight}
              singleGeometryVolume={singleGeometryVolume}
              singleGeometryMaterial={selectedMaterial?.name}
            />
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.3dm,.gltf,.glb,.fbx,.obj"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}

