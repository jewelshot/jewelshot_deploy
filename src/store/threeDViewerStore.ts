/**
 * 3D Viewer Store
 * 
 * Global state management for 3D viewer using Zustand
 * Manages: transform, layers, background, quality, etc.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  TransformState,
  FlipState,
  BackgroundConfig,
  GroundPlaneConfig,
  QualityConfig,
  AutoRotateConfig,
  LightConfig,
} from '@/lib/3d/types';
import {
  DEFAULT_TRANSFORM,
  DEFAULT_FLIP,
  DEFAULT_BACKGROUND,
  DEFAULT_GROUND_PLANE,
  DEFAULT_QUALITY,
  DEFAULT_AUTO_ROTATE,
} from '@/lib/3d/types';

// ============================================
// LAYER TYPES (specific to store)
// ============================================

export interface StoredLayer {
  id: string;
  name: string;
  visible: boolean;
  materialId: string;
  category: 'metal' | 'stone' | 'setting' | 'other' | 'unknown';
  color: string;
}

export interface LayerGroup {
  id: string;
  name: string;
  category: 'metal' | 'stone' | 'other';
  expanded: boolean;
  visible: boolean;
  layerIds: string[];
}

// ============================================
// STORE STATE
// ============================================

interface ThreeDViewerState {
  // Model Info
  fileName: string | null;
  format: string | null;
  
  // Transform
  transform: TransformState;
  flip: FlipState;
  
  // Layers
  layers: StoredLayer[];
  layerGroups: LayerGroup[];
  selectedLayerId: string | null;
  
  // Visual Settings
  background: BackgroundConfig;
  groundPlane: GroundPlaneConfig;
  quality: QualityConfig;
  autoRotate: AutoRotateConfig;
  
  // Lighting
  lights: LightConfig[];
  
  // UI State
  showGrid: boolean;
  showGizmo: boolean;
  
  // Actions - Model
  setFileName: (name: string | null) => void;
  setFormat: (format: string | null) => void;
  clearModel: () => void;
  
  // Actions - Transform
  setTransform: (transform: TransformState) => void;
  setPosition: (x: number, y: number, z: number) => void;
  setRotation: (x: number, y: number, z: number) => void;
  setScale: (x: number, y: number, z: number) => void;
  setFlip: (flip: FlipState) => void;
  toggleFlipAxis: (axis: keyof FlipState) => void;
  resetTransform: () => void;
  
  // Actions - Layers
  setLayers: (layers: StoredLayer[]) => void;
  setLayerGroups: (groups: LayerGroup[]) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleGroupVisibility: (groupId: string) => void;
  toggleGroupExpanded: (groupId: string) => void;
  setLayerMaterial: (layerId: string, materialId: string) => void;
  selectLayer: (layerId: string | null) => void;
  
  // Actions - Visual
  setBackground: (background: Partial<BackgroundConfig>) => void;
  setGroundPlane: (config: Partial<GroundPlaneConfig>) => void;
  setQuality: (config: Partial<QualityConfig>) => void;
  setAutoRotate: (config: Partial<AutoRotateConfig>) => void;
  
  // Actions - Lighting
  setLights: (lights: LightConfig[]) => void;
  addLight: (light: LightConfig) => void;
  updateLight: (id: string, updates: Partial<LightConfig>) => void;
  removeLight: (id: string) => void;
  
  // Actions - UI
  setShowGrid: (show: boolean) => void;
  setShowGizmo: (show: boolean) => void;
  
  // Reset
  resetAll: () => void;
}

// ============================================
// DEFAULT LIGHTS
// ============================================

const DEFAULT_LIGHTS: LightConfig[] = [
  {
    id: 'key',
    type: 'directional',
    color: '#ffffff',
    intensity: 1,
    position: { x: 5, y: 10, z: 5 },
    castShadow: true,
  },
  {
    id: 'fill',
    type: 'directional',
    color: '#ffffff',
    intensity: 0.5,
    position: { x: -5, y: 5, z: -5 },
    castShadow: false,
  },
  {
    id: 'ambient',
    type: 'ambient',
    color: '#ffffff',
    intensity: 0.3,
    position: { x: 0, y: 0, z: 0 },
    castShadow: false,
  },
];

// ============================================
// STORE
// ============================================

export const useThreeDViewerStore = create<ThreeDViewerState>()(
  persist(
    (set, get) => ({
      // Initial State
      fileName: null,
      format: null,
      transform: DEFAULT_TRANSFORM,
      flip: DEFAULT_FLIP,
      layers: [],
      layerGroups: [],
      selectedLayerId: null,
      background: DEFAULT_BACKGROUND,
      groundPlane: DEFAULT_GROUND_PLANE,
      quality: DEFAULT_QUALITY,
      autoRotate: DEFAULT_AUTO_ROTATE,
      lights: DEFAULT_LIGHTS,
      showGrid: false,
      showGizmo: true,

      // Model Actions
      setFileName: (name) => set({ fileName: name }),
      setFormat: (format) => set({ format }),
      clearModel: () => set({
        fileName: null,
        format: null,
        layers: [],
        layerGroups: [],
        selectedLayerId: null,
        transform: DEFAULT_TRANSFORM,
        flip: DEFAULT_FLIP,
      }),

      // Transform Actions
      setTransform: (transform) => set({ transform }),
      setPosition: (x, y, z) => set((state) => ({
        transform: { ...state.transform, position: { x, y, z } },
      })),
      setRotation: (x, y, z) => set((state) => ({
        transform: { ...state.transform, rotation: { x, y, z } },
      })),
      setScale: (x, y, z) => set((state) => ({
        transform: { ...state.transform, scale: { x, y, z } },
      })),
      setFlip: (flip) => set({ flip }),
      toggleFlipAxis: (axis) => set((state) => ({
        flip: { ...state.flip, [axis]: !state.flip[axis] },
      })),
      resetTransform: () => set({
        transform: DEFAULT_TRANSFORM,
        flip: DEFAULT_FLIP,
      }),

      // Layer Actions
      setLayers: (layers) => set({ layers }),
      setLayerGroups: (groups) => set({ layerGroups: groups }),
      toggleLayerVisibility: (layerId) => set((state) => ({
        layers: state.layers.map((l) =>
          l.id === layerId ? { ...l, visible: !l.visible } : l
        ),
      })),
      toggleGroupVisibility: (groupId) => set((state) => {
        const group = state.layerGroups.find((g) => g.id === groupId);
        if (!group) return state;
        
        const newVisible = !group.visible;
        return {
          layerGroups: state.layerGroups.map((g) =>
            g.id === groupId ? { ...g, visible: newVisible } : g
          ),
          layers: state.layers.map((l) =>
            group.layerIds.includes(l.id) ? { ...l, visible: newVisible } : l
          ),
        };
      }),
      toggleGroupExpanded: (groupId) => set((state) => ({
        layerGroups: state.layerGroups.map((g) =>
          g.id === groupId ? { ...g, expanded: !g.expanded } : g
        ),
      })),
      setLayerMaterial: (layerId, materialId) => set((state) => ({
        layers: state.layers.map((l) =>
          l.id === layerId ? { ...l, materialId } : l
        ),
      })),
      selectLayer: (layerId) => set({ selectedLayerId: layerId }),

      // Visual Actions
      setBackground: (background) => set((state) => ({
        background: { ...state.background, ...background },
      })),
      setGroundPlane: (config) => set((state) => ({
        groundPlane: { ...state.groundPlane, ...config },
      })),
      setQuality: (config) => set((state) => ({
        quality: { ...state.quality, ...config },
      })),
      setAutoRotate: (config) => set((state) => ({
        autoRotate: { ...state.autoRotate, ...config },
      })),

      // Lighting Actions
      setLights: (lights) => set({ lights }),
      addLight: (light) => set((state) => ({
        lights: [...state.lights, light],
      })),
      updateLight: (id, updates) => set((state) => ({
        lights: state.lights.map((l) =>
          l.id === id ? { ...l, ...updates } : l
        ),
      })),
      removeLight: (id) => set((state) => ({
        lights: state.lights.filter((l) => l.id !== id),
      })),

      // UI Actions
      setShowGrid: (show) => set({ showGrid: show }),
      setShowGizmo: (show) => set({ showGizmo: show }),

      // Reset All
      resetAll: () => set({
        fileName: null,
        format: null,
        transform: DEFAULT_TRANSFORM,
        flip: DEFAULT_FLIP,
        layers: [],
        layerGroups: [],
        selectedLayerId: null,
        background: DEFAULT_BACKGROUND,
        groundPlane: DEFAULT_GROUND_PLANE,
        quality: DEFAULT_QUALITY,
        autoRotate: DEFAULT_AUTO_ROTATE,
        lights: DEFAULT_LIGHTS,
        showGrid: false,
        showGizmo: true,
      }),
    }),
    {
      name: 'jewelshot-3d-viewer',
      partialize: (state) => ({
        // Only persist settings, not model data
        background: state.background,
        groundPlane: state.groundPlane,
        quality: state.quality,
        autoRotate: state.autoRotate,
        lights: state.lights,
        showGrid: state.showGrid,
        showGizmo: state.showGizmo,
      }),
    }
  )
);

export default useThreeDViewerStore;
