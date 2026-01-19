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
import { OrbitControls, Center, Environment, Grid, GizmoHelper, GizmoViewport, Lightformer } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import * as THREE from 'three';
import { LoopSubdivision } from 'three-subdivide';
import {
  Upload,
  Box,
  RotateCcw,
  Camera,
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
import { Accordion } from '@/components/atoms/Accordion';

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
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={material.color}
        metalness={material.metalness}
        roughness={material.roughness}
        envMapIntensity={material.envMapIntensity}
        wireframe={wireframe}
      />
    </mesh>
  );
}

// Layer Model component with advanced materials and selection support
function LayerModel({ 
  layer,
  material,
  wireframe = false,
  onMeshRef,
}: { 
  layer: ModelLayer;
  material: MaterialPreset;
  wireframe?: boolean;
  onMeshRef?: (mesh: THREE.Mesh | null, layerId: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Register mesh ref for picking
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.layerId = layer.id;
      meshRef.current.userData.selectable = true;
      onMeshRef?.(meshRef.current, layer.id);
    }
    return () => {
      onMeshRef?.(null, layer.id);
    };
  }, [layer.id, onMeshRef]);
  
  if (!layer.visible) return null;
  
  // Determine if this is a stone/gem material
  const isGem = layer.category === 'stone';
  
  // NO emissive changes - keep original material colors
  // Selection is handled by OutlinePass (orange edge line only)
  
  return (
    <mesh 
      ref={meshRef} 
      geometry={layer.geometry} 
      castShadow 
      receiveShadow
      userData={{ layerId: layer.id, selectable: true }}
    >
      {isGem ? (
        // Enhanced gem material with transparency and refraction
        <meshPhysicalMaterial
          color={material.color}
          metalness={0}
          roughness={material.roughness}
          transmission={0.95}
          thickness={0.5}
          ior={2.42} // Diamond IOR
          envMapIntensity={2.5}
          clearcoat={1}
          clearcoatRoughness={0}
          wireframe={wireframe}
        />
      ) : (
        // Metal material - keeps original color
        <meshStandardMaterial
          color={material.color}
          metalness={material.metalness}
          roughness={material.roughness}
          envMapIntensity={material.envMapIntensity}
          wireframe={wireframe}
        />
      )}
    </mesh>
  );
}

// Adaptive Resolution Controller - Handles progressive rendering
function AdaptiveResolutionController({ 
  enabled = true,
  onResolutionChange,
}: { 
  enabled?: boolean;
  onResolutionChange?: (ratio: number, isRefining: boolean) => void;
}) {
  const { gl, camera } = useThree();
  const prevCameraMatrix = useRef(new THREE.Matrix4());
  const lastMovementTime = useRef(Date.now());
  const refinementStartTime = useRef<number | null>(null);
  const currentRatio = useRef(1);
  
  const minRatio = 0.3;
  const maxRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 2;
  const idleDelay = 80; // ms before starting refinement
  const refinementDuration = 400; // ms for full refinement
  
  useFrame(() => {
    if (!enabled) return;
    
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

// Object Picker Controller - Click to select, orange outline on selected object only
function ObjectSelectionController({
  enabled = true,
  selectedLayerId,
  onSelect,
  meshRegistry,
}: {
  enabled?: boolean;
  selectedLayerId: string | null;
  onSelect: (layerId: string | null) => void;
  meshRegistry: Map<string, THREE.Mesh>;
}) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  
  // Mouse event handlers - ONLY click, no hover effect
  useEffect(() => {
    if (!enabled) return;
    
    const canvas = gl.domElement;
    
    // Only change cursor on hover, no visual effect
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.current.setFromCamera(mouse.current, camera);
      
      const meshes = Array.from(meshRegistry.values());
      const intersects = raycaster.current.intersectObjects(meshes, false);
      
      canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    };
    
    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.current.setFromCamera(mouse.current, camera);
      
      const meshes = Array.from(meshRegistry.values());
      const intersects = raycaster.current.intersectObjects(meshes, false);
      
      if (intersects.length > 0) {
        const layerId = intersects[0].object.userData.layerId;
        onSelect(layerId === selectedLayerId ? null : layerId);
      } else {
        onSelect(null);
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      canvas.style.cursor = 'default';
    };
  }, [enabled, gl, camera, meshRegistry, selectedLayerId, onSelect]);
  
  return null;
}

// Outline Effect - Renders orange outline around selected object
function SelectionOutlineEffect({
  selectedLayerId,
  meshRegistry,
}: {
  selectedLayerId: string | null;
  meshRegistry: Map<string, THREE.Mesh>;
}) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer | null>(null);
  const outlinePass = useRef<OutlinePass | null>(null);
  
  // Setup composer once
  useEffect(() => {
    const effectComposer = new EffectComposer(gl);
    
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    
    const outline = new OutlinePass(
      new THREE.Vector2(size.width, size.height),
      scene,
      camera
    );
    outline.edgeStrength = 5;
    outline.edgeGlow = 0.3;
    outline.edgeThickness = 1.5;
    outline.pulsePeriod = 0;
    outline.visibleEdgeColor.set('#ff6600');
    outline.hiddenEdgeColor.set('#ff660033');
    outlinePass.current = outline;
    effectComposer.addPass(outline);
    
    composer.current = effectComposer;
    
    return () => {
      effectComposer.dispose();
    };
  }, [gl, scene, camera, size]);
  
  // Update outline target when selection changes
  useEffect(() => {
    if (!outlinePass.current) return;
    
    if (selectedLayerId) {
      const mesh = meshRegistry.get(selectedLayerId);
      outlinePass.current.selectedObjects = mesh ? [mesh] : [];
    } else {
      outlinePass.current.selectedObjects = [];
    }
  }, [selectedLayerId, meshRegistry]);
  
  // Resize handler
  useEffect(() => {
    composer.current?.setSize(size.width, size.height);
  }, [size]);
  
  // Only render with composer when there's a selection
  useFrame(() => {
    if (selectedLayerId && composer.current) {
      composer.current.render();
    }
  }, 1);
  
  return null;
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
  modelRotation,
  lighting,
  lightIntensity,
  onControlsReady,
  onFitToView,
  selectedLayerId,
  onSelectLayer,
  meshRegistry,
  adaptiveResolution,
  onResolutionChange,
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
  modelRotation: [number, number, number];
  lighting: LightingPreset;
  lightIntensity: number;
  onControlsReady: (controls: any) => void;
  onFitToView: (fitFn: () => void) => void;
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  meshRegistry: Map<string, THREE.Mesh>;
  adaptiveResolution: boolean;
  onResolutionChange?: (ratio: number, isRefining: boolean) => void;
}) {
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  
  // Mesh registry callback
  const handleMeshRef = useCallback((mesh: THREE.Mesh | null, layerId: string) => {
    if (mesh) {
      meshRegistry.set(layerId, mesh);
    } else {
      meshRegistry.delete(layerId);
    }
  }, [meshRegistry]);
  const [modelTransform, setModelTransform] = useState<{
    position: THREE.Vector3;
    scale: number;
  } | null>(null);

  useEffect(() => {
    if (controlsRef.current) {
      onControlsReady(controlsRef.current);
    }
  }, [onControlsReady]);

  // Fit camera to model
  const fitToView = useCallback(() => {
    if (!controlsRef.current) return;
    
    // Calculate bounding box
    const box = new THREE.Box3();
    
    if (geometry) {
      const tempGeom = geometry.clone();
      tempGeom.computeBoundingBox();
      if (tempGeom.boundingBox) {
        box.copy(tempGeom.boundingBox);
      }
    }
    
    if (box.isEmpty()) return;
    
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Position camera to see the whole model
    const fov = 50 * (Math.PI / 180);
    const cameraDistance = (maxDim / 2) / Math.tan(fov / 2) * 2.5;
    
    camera.position.set(cameraDistance, cameraDistance * 0.7, cameraDistance);
    camera.lookAt(0, 0, 0);
    
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, [geometry, camera]);

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
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 2 / maxDim : 1;
        
        setModelTransform({
          position: new THREE.Vector3(-center.x, -center.y, -center.z),
          scale: scale,
        });
        
        // Auto fit to view after loading
        setTimeout(() => {
          camera.position.set(4, 3, 4);
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }, 100);
      }
    } else {
      setModelTransform(null);
    }
  }, [geometry, camera]);

  // Center and scale layers (3DM)
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

      const center = new THREE.Vector3();
      combinedBox.getCenter(center);
      
      const size = new THREE.Vector3();
      combinedBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 2 / maxDim : 1;

      // Apply transform to group
      groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      groupRef.current.scale.set(scale, scale, scale);

      camera.position.set(4, 3, 4);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  }, [layers, camera]);

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

      {/* Scene Background Color */}
      <color attach="background" args={[backgroundColor]} />
      
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

      {/* STL Model */}
      {geometry && modelTransform && (
        <group rotation={modelRotation}>
          <group
            position={[
              modelTransform.position.x * modelTransform.scale,
              modelTransform.position.y * modelTransform.scale,
              modelTransform.position.z * modelTransform.scale,
            ]}
            scale={[modelTransform.scale, modelTransform.scale, modelTransform.scale]}
          >
            <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
              <meshStandardMaterial
                color={material.color}
                metalness={material.metalness}
                roughness={material.roughness}
                envMapIntensity={material.envMapIntensity}
                wireframe={wireframe}
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
              onMeshRef={handleMeshRef}
            />
          ))}
        </group>
      )}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        enablePan
        enableZoom
        enableRotate
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        minDistance={0.5}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      
      {/* Axis Gizmo in corner - hide during snapshot */}
      {showGrid && (
        <GizmoHelper alignment="bottom-right" margin={[60, 60]}>
          <GizmoViewport 
            axisColors={['#cc6666', '#66aa66', '#6688bb']}  // Softer, muted colors
            labelColor="#888888"
            hideNegativeAxes
            font="12px Inter, system-ui, sans-serif"
          />
        </GizmoHelper>
      )}
      
      {/* Adaptive Resolution - Progressive rendering for smooth interaction */}
      <AdaptiveResolutionController 
        enabled={adaptiveResolution}
        onResolutionChange={onResolutionChange}
      />
      
      {/* Object Selection - Click to select */}
      {layers.length > 0 && (
        <ObjectSelectionController
          enabled={true}
          selectedLayerId={selectedLayerId}
          onSelect={onSelectLayer}
          meshRegistry={meshRegistry}
        />
      )}
      
      {/* Orange Outline Effect - Only on selected object */}
      {layers.length > 0 && selectedLayerId && (
        <SelectionOutlineEffect
          selectedLayerId={selectedLayerId}
          meshRegistry={meshRegistry}
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
  const [showGrid, setShowGrid] = useState(true);
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
  
  // Layer state (for future 3DM support)
  const [layers, setLayers] = useState<ModelLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [layerMaterials, setLayerMaterials] = useState<Record<string, MaterialPreset>>({});
  
  // Progressive rendering & selection state
  const [adaptiveResolution, setAdaptiveResolution] = useState(true);
  const [currentResolution, setCurrentResolution] = useState(1);
  const [isRefining, setIsRefining] = useState(false);
  const [layersAccordionOpen, setLayersAccordionOpen] = useState(true);
  const meshRegistryRef = useRef<Map<string, THREE.Mesh>>(new Map());
  
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
  const processFile = useCallback((file: File) => {
    console.log('[ProcessFile] ========================================');
    console.log('[ProcessFile] File received:', file.name);
    console.log('[ProcessFile] File type:', file.type);
    console.log('[ProcessFile] File size:', file.size, 'bytes');
    console.log('[ProcessFile] File name lowercase:', file.name.toLowerCase());
    
    const fileName = file.name.toLowerCase();
    const isSTL = fileName.endsWith('.stl');
    const is3DM = fileName.endsWith('.3dm');
    
    console.log('[ProcessFile] Is STL?', isSTL);
    console.log('[ProcessFile] Is 3DM?', is3DM);
    console.log('[ProcessFile] ========================================');
    
    setIsLoading(true);
    setLoadingStatus('Reading file...');
    setFileName(file.name);
    setLayers([]);
    setLoadedGeometry(null);
    setOriginalGeometry(null);
    setSubdivisionLevel(0);
    setModelInfo(null);

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
      alert('Unsupported file format. Please use STL or 3DM files.');
      setIsLoading(false);
      setLoadingStatus('');
    }
  }, []);

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

  // Clear model
  const handleClearModel = useCallback(() => {
    setLoadedGeometry(null);
    setFileName(null);
    setLayers([]);
    setLayerMaterials({});
    setSelectedLayerId(null);
    setModelInfo(null);
  }, []);

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
            gl={{ 
              preserveDrawingBuffer: true, 
              antialias: true,
              failIfMajorPerformanceCaveat: false,
              powerPreference: 'default',
            }}
            style={{ background: backgroundColor }}
            onCreated={(state) => {
              // Ensure WebGL context is properly initialized
              state.gl.setClearColor(backgroundColor);
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
                modelRotation={modelRotation}
                lighting={selectedLighting}
                lightIntensity={lightIntensity}
                onControlsReady={(controls) => { controlsRef.current = controls; }}
                onFitToView={(fn) => setFitToViewFn(() => fn)}
                selectedLayerId={selectedLayerId}
                onSelectLayer={setSelectedLayerId}
                meshRegistry={meshRegistryRef.current}
                adaptiveResolution={adaptiveResolution}
                onResolutionChange={handleResolutionChange}
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
              {layers.length > 0 && (
                <> &nbsp;<span className="text-white/60">Click object:</span> Select</>
              )}
            </div>
          )}
          
          {/* Resolution indicator */}
          {adaptiveResolution && (loadedGeometry || layers.length > 0) && (
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
        </div>

        {/* Right Panel Toggle Button (matching Studio style) */}
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="fixed right-0 top-1/2 z-50 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-l-md border border-r-0 border-white/10 bg-[#0a0a0a] text-white/50 transition-all hover:text-white"
          style={{
            right: rightOpen ? '280px' : '0',
            transition: 'right 800ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        >
          {rightOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Right Panel */}
        <div 
          className="fixed right-0 top-0 bottom-0 z-40 flex flex-col border-l border-white/5 bg-[#0a0a0a]"
          style={{
            width: rightOpen ? '280px' : '0',
            opacity: rightOpen ? 1 : 0,
            transition: 'width 800ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 400ms ease',
          }}
        >
          {rightOpen && (
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              {/* Snapshot Preview - ALWAYS AT TOP */}
              {snapshotPreview && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                    Snapshot Preview
                  </h3>
                  <div className="relative overflow-hidden rounded-lg border border-white/10">
                    <img 
                      src={snapshotPreview} 
                      alt="Snapshot" 
                      className="w-full"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 opacity-0 transition-opacity hover:opacity-100">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={handleDownloadSnapshot}
                          className="flex items-center gap-1 rounded-lg bg-purple-500 px-3 py-2 text-xs font-medium text-white hover:bg-purple-600"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </button>
                        <button
                          onClick={handleSaveToGallery}
                          className="flex items-center gap-1 rounded-lg bg-white/15 px-3 py-2 text-xs font-medium text-white hover:bg-white/25"
                        >
                          <Image className="h-3.5 w-3.5" />
                          Gallery
                        </button>
                        <button
                          onClick={() => handleOpenInStudio(snapshotPreview)}
                          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-2 text-xs font-medium text-white hover:from-rose-600 hover:to-orange-600"
                        >
                          <Palette className="h-3.5 w-3.5" />
                          Studio
                        </button>
                      </div>
                      <button
                        onClick={() => setSnapshotPreview(null)}
                        className="mt-1 text-[10px] text-white/50 hover:text-white/70"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* File Upload */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Model
                </h3>
                {loadedGeometry ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-white/70 truncate max-w-[120px]">
                          {fileName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                          title="Replace"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={handleClearModel}
                          className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-red-400"
                          title="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {/* Model Info */}
                    {modelInfo && (
                      <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-[10px] text-white/40">
                        <Info className="h-3 w-3 text-white/30" />
                        <span>{modelInfo.vertices.toLocaleString()} vertices</span>
                        <span>{modelInfo.faces.toLocaleString()} faces</span>
                      </div>
                    )}
                    
                    {/* Subdivision Control */}
                    {originalGeometry && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/40">Subdivision</span>
                          <span className="text-[10px] text-white/60">{subdivisionLevel}x</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="3"
                            step="1"
                            value={subdivisionLevel}
                            onChange={(e) => setSubdivisionLevel(parseInt(e.target.value))}
                            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                          />
                        </div>
                        <p className="text-[9px] text-white/30">
                          Higher = smoother (slower)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 py-4 text-sm text-white/50 hover:border-white/30 hover:bg-white/10"
                  >
                    <Upload className="h-4 w-4" />
                    Upload STL File
                  </button>
                )}
              </div>

              {/* Lighting */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Lighting
                </h3>
                {/* Lighting Presets */}
                <div className="grid grid-cols-3 gap-1 mb-3">
                  {LIGHTING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedLighting(preset)}
                      className={`rounded-md py-2 text-xs transition-all ${
                        selectedLighting.id === preset.id
                          ? 'bg-purple-500/30 text-purple-300 ring-1 ring-purple-500/50'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                {/* Intensity Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40">Intensity</span>
                    <span className="text-[10px] text-white/60">{Math.round(lightIntensity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={lightIntensity}
                    onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Environment */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Environment
                </h3>
                
                {/* Environment Type Toggle */}
                <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 mb-3">
                  <button
                    onClick={() => setUseHDR(false)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                      !useHDR
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Studio
                  </button>
                  <button
                    onClick={() => {
                      setUseHDR(true);
                      if (!selectedHDR && HDR_PRESETS.length > 0) {
                        setSelectedHDR(HDR_PRESETS[0]);
                      }
                    }}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                      useHDR
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    HDR
                  </button>
                </div>
                
                {/* HDR Presets */}
                {useHDR ? (
                  <div className="space-y-2">
                    {HDR_PRESETS.length > 0 ? (
                      <>
                        {HDR_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => setSelectedHDR(preset)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                              selectedHDR?.id === preset.id
                                ? 'bg-purple-500/20 ring-1 ring-purple-500/50'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            {/* HDR Preview */}
                            <div 
                              className="w-10 h-10 rounded-md flex-shrink-0 ring-1 ring-white/10"
                              style={{ background: preset.preview }}
                            />
                            <div className="text-left flex-1 min-w-0">
                              <p className={`text-xs font-medium truncate ${
                                selectedHDR?.id === preset.id ? 'text-purple-300' : 'text-white/80'
                              }`}>
                                {preset.name}
                              </p>
                              <p className="text-[10px] text-white/40 truncate">
                                {preset.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <p className="text-[10px] text-white/40 text-center py-4">
                        No HDR files available. Add .hdr or .exr files to /public/environments/
                      </p>
                    )}
                    <p className="text-[10px] text-white/30 mt-2">
                      HDR environments provide realistic reflections.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Studio Presets */}
                    <div className="grid grid-cols-3 gap-1 mb-3">
                      {STUDIO_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedStudio(preset)}
                          className={`rounded-md py-1.5 text-[10px] transition-all ${
                            selectedStudio.id === preset.id
                              ? 'bg-purple-500/30 text-purple-300 ring-1 ring-purple-500/50'
                              : 'bg-white/5 text-white/50 hover:bg-white/10'
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/30">
                      Built-in studio lighting - no external files needed.
                    </p>
                  </>
                )}
                
                </div>

              {/* Background */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Background
                </h3>
                <div className="flex gap-2">
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setBackgroundColor(preset.color)}
                      className={`h-6 w-6 rounded border-2 transition-all ${
                        backgroundColor === preset.color
                          ? 'border-purple-500 ring-1 ring-purple-500/30'
                          : 'border-transparent hover:border-white/30'
                      }`}
                      style={{ background: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* Tessellation Quality (only for 3DM files) */}
              {raw3DMBuffer && (
                <div className="mb-4">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                    Mesh Quality
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/70">Quality</span>
                      <span className="text-xs font-mono text-purple-400">{tessellationQuality.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.25"
                      max="5"
                      step="0.25"
                      value={tessellationQuality}
                      onChange={(e) => setTessellationQuality(parseFloat(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[10px] text-white/40">
                      <span>Fast (Low)</span>
                      <span>Balanced</span>
                      <span>HD (High)</span>
                    </div>
                    <button
                      onClick={() => reTessellate(tessellationQuality)}
                      disabled={isLoading}
                      className="w-full py-2 px-3 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Apply Quality'}
                    </button>
                    {modelInfo && (
                      <p className="text-[10px] text-white/40 text-center">
                        {modelInfo.vertices.toLocaleString()} vertices • {modelInfo.faces.toLocaleString()} faces
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Display Options */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Display Options
                </h3>
                <div className="space-y-2">
                  {/* Grid Toggle */}
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-xs text-white/70">
                      <Grid3X3 className="h-4 w-4" />
                      Show Grid
                    </span>
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${
                        showGrid ? 'bg-purple-500' : 'bg-white/20'
                      }`}
                    >
                      <span 
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          showGrid ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </label>
                  
                  {/* Wireframe Toggle */}
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-xs text-white/70">
                      <Box className="h-4 w-4" />
                      Wireframe Mode
                    </span>
                    <button
                      onClick={() => setWireframe(!wireframe)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${
                        wireframe ? 'bg-purple-500' : 'bg-white/20'
                      }`}
                    >
                      <span 
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          wireframe ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </label>
                  
                  {/* Auto Rotate Toggle */}
                  <label className="flex items-center justify-between cursor-pointer py-1">
                    <span className="flex items-center gap-2 text-xs text-white/70">
                      <RefreshCw className="h-4 w-4" />
                      Auto Rotate
                    </span>
                    <button
                      onClick={() => setAutoRotate(!autoRotate)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${
                        autoRotate ? 'bg-purple-500' : 'bg-white/20'
                      }`}
                    >
                      <span 
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                          autoRotate ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              {/* Material Type Toggle */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Material Type
                </h3>
                <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setMaterialType('metal')}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                      materialType === 'metal'
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Metal
                  </button>
                  <button
                    onClick={() => setMaterialType('stone')}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                      materialType === 'stone'
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Stone
                  </button>
                  <button
                    onClick={() => setMaterialType('matte')}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                      materialType === 'matte'
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Matte
                  </button>
                </div>
              </div>

              {/* Material Presets */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  {materialType === 'metal' ? 'Metal' : materialType === 'stone' ? 'Stone' : 'Matte / Resin'} Presets
                </h3>
                <div className="space-y-2">
                  {currentPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedMaterial(preset)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
                        selectedMaterial.id === preset.id
                          ? 'border-purple-500/50 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div 
                        className="h-6 w-6 rounded-full shadow-inner"
                        style={{ 
                          background: `linear-gradient(135deg, ${preset.color} 0%, ${preset.color}88 100%)`,
                          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)`
                        }}
                      />
                      <span className="text-sm text-white/70">{preset.name}</span>
                      {selectedMaterial.id === preset.id && (
                        <Check className="ml-auto h-4 w-4 text-purple-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layers Accordion (for 3DM files) */}
              <Accordion
                title="Objects"
                count={layers.length > 0 ? layers.length : undefined}
                defaultOpen={layersAccordionOpen}
                headerAction={
                  layers.length > 0 && selectedLayerId ? (
                    <button
                      onClick={() => setSelectedLayerId(null)}
                      className="text-[10px] text-orange-400 hover:text-orange-300 px-2"
                    >
                      Deselect
                    </button>
                  ) : null
                }
              >
                {layers.length > 0 ? (
                  <div className="space-y-1">
                    {layers.map((layer) => (
                      <div
                        key={layer.id}
                        className={`rounded-lg border p-2 transition-all cursor-pointer ${
                          selectedLayerId === layer.id
                            ? 'border-orange-500/50 bg-orange-500/10 ring-1 ring-orange-500/30'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                        onClick={() => setSelectedLayerId(selectedLayerId === layer.id ? null : layer.id)}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setLayers(prev => prev.map(l => 
                                l.id === layer.id ? { ...l, visible: !l.visible } : l
                              ));
                            }}
                            className={`rounded p-1 transition-colors ${
                              layer.visible 
                                ? 'text-white/70 hover:bg-white/10' 
                                : 'text-white/30 hover:bg-white/10'
                            }`}
                          >
                            {layer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                          </button>
                          <div
                            className="h-3 w-3 rounded-full ring-1 ring-white/20"
                            style={{ backgroundColor: layerMaterials[layer.id]?.color || layer.color }}
                          />
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-white/70 truncate">{layer.name}</span>
                              {selectedLayerId === layer.id && (
                                <MousePointer2 className="h-3 w-3 text-orange-400 flex-shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                              <span className={`px-1 py-0.5 rounded text-[9px] ${
                                layer.category === 'metal' || layer.category === 'setting'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : layer.category === 'stone'
                                  ? 'bg-cyan-500/20 text-cyan-400'
                                  : 'bg-white/10 text-white/40'
                              }`}>
                                {layer.category || 'unknown'}
                              </span>
                              {layer.volumeInfo && (
                                <span>
                                  {layer.category === 'stone'
                                    ? `${layer.volumeInfo.carats?.toFixed(2) || '0.00'} ct`
                                    : `${layer.volumeInfo.weight?.toFixed(2) || '0.00'} g`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Layer Material Selection - Expand when selected */}
                        {selectedLayerId === layer.id && (
                          <div className="mt-2 border-t border-white/10 pt-2">
                            <p className="mb-2 text-[10px] text-white/40">Assign Material:</p>
                            <div className="grid grid-cols-5 gap-1">
                              {(layer.category === 'stone' ? STONE_PRESETS : METAL_PRESETS).map((preset) => (
                                <button
                                  key={preset.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLayerMaterials(prev => ({
                                      ...prev,
                                      [layer.id]: preset
                                    }));
                                  }}
                                  className={`aspect-square rounded-md border transition-all ${
                                    layerMaterials[layer.id]?.id === preset.id
                                      ? 'border-purple-500 ring-1 ring-purple-500'
                                      : 'border-white/10 hover:border-white/30'
                                  }`}
                                  style={{ 
                                    background: layer.category === 'stone'
                                      ? `radial-gradient(circle at 30% 30%, white 0%, ${preset.color} 50%)`
                                      : `linear-gradient(135deg, ${preset.color} 0%, ${preset.color}88 100%)`
                                  }}
                                  title={preset.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Weight Summary for 3DM */}
                    {layers.some(l => l.volumeInfo) && (
                      <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                        <h4 className="text-[10px] font-medium uppercase tracking-wider text-white/50 mb-2">Weight Summary</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded bg-yellow-500/10 border border-yellow-500/20 p-2">
                            <div className="text-[10px] text-yellow-400/70">Metal</div>
                            <div className="text-sm font-semibold text-yellow-300">
                              {layers
                                .filter(l => l.category !== 'stone' && l.volumeInfo)
                                .reduce((acc, l) => acc + (l.volumeInfo?.weight || 0), 0)
                                .toFixed(2)} g
                            </div>
                          </div>
                          <div className="rounded bg-cyan-500/10 border border-cyan-500/20 p-2">
                            <div className="text-[10px] text-cyan-400/70">Gemstones</div>
                            <div className="text-sm font-semibold text-cyan-300">
                              {layers
                                .filter(l => l.category === 'stone' && l.volumeInfo)
                                .reduce((acc, l) => acc + (l.volumeInfo?.carats || 0), 0)
                                .toFixed(2)} ct
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                    <Layers className="mx-auto h-6 w-6 text-white/20" />
                    <p className="mt-2 text-xs text-white/40">
                      {loadedGeometry 
                        ? 'STL files have a single layer'
                        : 'Load a 3DM file to see layers'}
                    </p>
                  </div>
                )}
              </Accordion>


              {/* Quick Guide */}
              <div className="mt-auto">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Supported Formats
                </h3>
                <div className="space-y-2 text-xs text-white/40">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    <span>STL - Single mesh models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    <span>3DM - Rhino with layers</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.3dm"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}

