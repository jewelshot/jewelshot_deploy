/**
 * 3D Viewer Store (Zustand)
 * 
 * Global state for the 3D viewer:
 * - Loaded model layers
 * - Material assignments per layer
 * - Weight calculations
 * - View settings
 */

import { create } from 'zustand';
import * as THREE from 'three';
import type { MaterialInfo } from '@/lib/3d/materials-database';
import type { LayerCategory, DetectionResult } from '@/lib/3d/layer-detector';
import type { WeightResult } from '@/lib/3d/weight-calculator';

// ============================================
// TYPES
// ============================================

export interface ViewerLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string; // Original layer color from 3DM
  category: LayerCategory;
  detection: DetectionResult;
  materialId: string | null;
  geometry: THREE.BufferGeometry | null;
  weight: WeightResult | null;
  objectCount: number;
}

export interface WeightSummary {
  totalMetalGrams: number;
  totalStoneCarats: number;
  breakdown: {
    metals: Array<{ materialId: string; name: string; grams: number }>;
    stones: Array<{ materialId: string; name: string; carats: number }>;
  };
}

export interface ViewerSettings {
  autoRotate: boolean;
  showGrid: boolean;
  wireframe: boolean;
  showEnvironmentBackground: boolean;
  studioPresetId: string;
  lightingPresetId: string;
  lightIntensity: number;
  backgroundColor: string;
  subdivisionLevel: number;
}

interface Viewer3DState {
  // Model info
  fileName: string | null;
  fileType: 'stl' | '3dm' | null;
  units: string;
  isLoading: boolean;
  loadingStatus: string;
  error: string | null;
  
  // Layers
  layers: ViewerLayer[];
  selectedLayerId: string | null;
  
  // Materials (cache)
  materialsCache: Map<string, THREE.Material>;
  
  // Weight summary
  weightSummary: WeightSummary | null;
  
  // View settings
  settings: ViewerSettings;
  
  // Snapshot
  snapshotPreview: string | null;
  
  // Actions
  setFileName: (name: string | null) => void;
  setFileType: (type: 'stl' | '3dm' | null) => void;
  setUnits: (units: string) => void;
  setLoading: (loading: boolean, status?: string) => void;
  setError: (error: string | null) => void;
  
  // Layer actions
  setLayers: (layers: ViewerLayer[]) => void;
  addLayer: (layer: ViewerLayer) => void;
  updateLayer: (layerId: string, updates: Partial<ViewerLayer>) => void;
  removeLayer: (layerId: string) => void;
  selectLayer: (layerId: string | null) => void;
  toggleLayerVisibility: (layerId: string) => void;
  setLayerMaterial: (layerId: string, materialId: string) => void;
  setLayerWeight: (layerId: string, weight: WeightResult) => void;
  reorderLayers: (sourceIndex: number, destinationIndex: number) => void;
  renameLayer: (layerId: string, newName: string) => void;
  
  // Weight actions
  updateWeightSummary: () => void;
  
  // Settings actions
  updateSettings: (settings: Partial<ViewerSettings>) => void;
  resetSettings: () => void;
  
  // Snapshot
  setSnapshotPreview: (preview: string | null) => void;
  
  // Reset
  resetViewer: () => void;
}

// ============================================
// DEFAULT VALUES
// ============================================

const DEFAULT_SETTINGS: ViewerSettings = {
  autoRotate: false,
  showGrid: true,
  wireframe: false,
  showEnvironmentBackground: true,
  studioPresetId: 'white-studio',
  lightingPresetId: 'studio',
  lightIntensity: 1.0,
  backgroundColor: '#0a0a0a',
  subdivisionLevel: 0,
};

const INITIAL_WEIGHT_SUMMARY: WeightSummary = {
  totalMetalGrams: 0,
  totalStoneCarats: 0,
  breakdown: {
    metals: [],
    stones: [],
  },
};

// ============================================
// STORE
// ============================================

export const useViewer3DStore = create<Viewer3DState>((set, get) => ({
  // Initial state
  fileName: null,
  fileType: null,
  units: 'mm',
  isLoading: false,
  loadingStatus: '',
  error: null,
  
  layers: [],
  selectedLayerId: null,
  
  materialsCache: new Map(),
  
  weightSummary: null,
  
  settings: { ...DEFAULT_SETTINGS },
  
  snapshotPreview: null,
  
  // Actions
  setFileName: (name) => set({ fileName: name }),
  setFileType: (type) => set({ fileType: type }),
  setUnits: (units) => set({ units }),
  setLoading: (loading, status = '') => set({ isLoading: loading, loadingStatus: status }),
  setError: (error) => set({ error }),
  
  // Layer actions
  setLayers: (layers) => {
    set({ layers });
    get().updateWeightSummary();
  },
  
  addLayer: (layer) => {
    set((state) => ({
      layers: [...state.layers, layer],
    }));
    get().updateWeightSummary();
  },
  
  updateLayer: (layerId, updates) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      ),
    }));
    
    // Update weight summary if material changed
    if (updates.materialId || updates.weight) {
      get().updateWeightSummary();
    }
  },
  
  removeLayer: (layerId) => {
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== layerId),
      selectedLayerId: state.selectedLayerId === layerId ? null : state.selectedLayerId,
    }));
    get().updateWeightSummary();
  },
  
  selectLayer: (layerId) => set({ selectedLayerId: layerId }),
  
  toggleLayerVisibility: (layerId) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ),
    }));
  },
  
  setLayerMaterial: (layerId, materialId) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, materialId } : layer
      ),
    }));
    get().updateWeightSummary();
  },
  
  setLayerWeight: (layerId, weight) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, weight } : layer
      ),
    }));
    get().updateWeightSummary();
  },
  
  reorderLayers: (sourceIndex, destinationIndex) => {
    set((state) => {
      const newLayers = [...state.layers];
      const [removed] = newLayers.splice(sourceIndex, 1);
      newLayers.splice(destinationIndex, 0, removed);
      return { layers: newLayers };
    });
  },
  
  renameLayer: (layerId, newName) => {
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId ? { ...layer, name: newName } : layer
      ),
    }));
  },
  
  // Weight summary calculation
  updateWeightSummary: () => {
    const { layers } = get();
    
    let totalMetalGrams = 0;
    let totalStoneCarats = 0;
    const metalBreakdown = new Map<string, { name: string; grams: number }>();
    const stoneBreakdown = new Map<string, { name: string; carats: number }>();
    
    for (const layer of layers) {
      if (!layer.weight || !layer.materialId) continue;
      
      const { weight } = layer;
      
      if (layer.category === 'metal' || layer.category === 'setting') {
        totalMetalGrams += weight.weightGrams;
        
        const existing = metalBreakdown.get(layer.materialId);
        if (existing) {
          existing.grams += weight.weightGrams;
        } else {
          metalBreakdown.set(layer.materialId, {
            name: weight.material.name,
            grams: weight.weightGrams,
          });
        }
      } else if (layer.category === 'stone') {
        const carats = weight.weightCarats || 0;
        totalStoneCarats += carats;
        
        const existing = stoneBreakdown.get(layer.materialId);
        if (existing) {
          existing.carats += carats;
        } else {
          stoneBreakdown.set(layer.materialId, {
            name: weight.material.name,
            carats,
          });
        }
      }
    }
    
    set({
      weightSummary: {
        totalMetalGrams,
        totalStoneCarats,
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
      },
    });
  },
  
  // Settings
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
  
  resetSettings: () => set({ settings: { ...DEFAULT_SETTINGS } }),
  
  // Snapshot
  setSnapshotPreview: (preview) => set({ snapshotPreview: preview }),
  
  // Reset everything
  resetViewer: () => {
    // Dispose geometries
    const { layers, materialsCache } = get();
    layers.forEach((layer) => {
      if (layer.geometry) {
        layer.geometry.dispose();
      }
    });
    materialsCache.forEach((material) => {
      material.dispose();
    });
    
    set({
      fileName: null,
      fileType: null,
      units: 'mm',
      isLoading: false,
      loadingStatus: '',
      error: null,
      layers: [],
      selectedLayerId: null,
      materialsCache: new Map(),
      weightSummary: null,
      settings: { ...DEFAULT_SETTINGS },
      snapshotPreview: null,
    });
  },
}));

// ============================================
// SELECTORS
// ============================================

export const selectVisibleLayers = (state: Viewer3DState) =>
  state.layers.filter((layer) => layer.visible);

export const selectMetalLayers = (state: Viewer3DState) =>
  state.layers.filter((layer) => layer.category === 'metal' || layer.category === 'setting');

export const selectStoneLayers = (state: Viewer3DState) =>
  state.layers.filter((layer) => layer.category === 'stone');

export const selectSelectedLayer = (state: Viewer3DState) =>
  state.layers.find((layer) => layer.id === state.selectedLayerId);

export const selectHasModel = (state: Viewer3DState) =>
  state.layers.length > 0 || state.fileName !== null;

export default useViewer3DStore;
