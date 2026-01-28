/**
 * 3D Viewer Store - Global state management for 3D viewer
 * 
 * Manages all viewer configurations and state across components
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import all config types
import type { GroundPlaneConfig } from '@/components/molecules/3d/GroundPlane';
import type { LightingConfig } from '@/components/molecules/3d/LightingPanel';
import type { BackgroundConfig } from '@/components/molecules/3d/BackgroundPanel';
import type { EdgeSmoothingConfig } from '@/components/molecules/3d/EdgeSmoothingPanel';
import type { HDRConfig } from '@/components/molecules/3d/HDRPanel';
import type { DiamondConfig } from '@/components/molecules/3d/DiamondPanel';
import type { PostProcessingConfig } from '@/components/molecules/3d/PostProcessingPanel';
import type { MaterialConfig } from '@/components/molecules/3d/MaterialEditor';
import type { VideoExportConfig, RecordingState } from '@/components/molecules/3d/VideoExportPanel';
import type { TurntableConfig } from '@/components/molecules/3d/TurntableController';
import type { BatchExportConfig, BatchExportProgress, ViewAngle } from '@/components/molecules/3d/BatchExportPanel';

// Import defaults
import { DEFAULT_GROUND_CONFIG } from '@/components/molecules/3d/GroundPlane';
import { DEFAULT_LIGHTING_CONFIG } from '@/components/molecules/3d/LightingPanel';
import { DEFAULT_BACKGROUND_CONFIG } from '@/components/molecules/3d/BackgroundPanel';
import { DEFAULT_EDGE_SMOOTHING_CONFIG } from '@/components/molecules/3d/EdgeSmoothingPanel';
import { DEFAULT_HDR_CONFIG } from '@/components/molecules/3d/HDRPanel';
import { DEFAULT_DIAMOND_CONFIG } from '@/components/molecules/3d/DiamondPanel';
import { DEFAULT_POST_PROCESSING_CONFIG } from '@/components/molecules/3d/PostProcessingPanel';
import { DEFAULT_VIDEO_CONFIG } from '@/components/molecules/3d/VideoExportPanel';
import { DEFAULT_TURNTABLE_CONFIG } from '@/components/molecules/3d/TurntableController';
import { DEFAULT_BATCH_CONFIG } from '@/components/molecules/3d/BatchExportPanel';

// ============================================
// TYPES
// ============================================

export interface Transform3D {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
}

export interface CameraState {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
  near: number;
  far: number;
  zoom: number;
}

export interface ModelInfo {
  filename: string;
  fileSize: number;
  format: string;
  vertices: number;
  faces: number;
  materials: number;
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  } | null;
}

export interface Layer3D {
  id: string;
  name: string;
  type: 'metal' | 'stone' | 'other';
  visible: boolean;
  locked: boolean;
  color: string;
  materialId: string | null;
}

export type ViewMode3D = 'default' | 'wireframe' | 'solid' | 'textured' | 'matcap';
export type ActivePanel = 'none' | 'transform' | 'materials' | 'lighting' | 'environment' | 'effects' | 'export';

// ============================================
// STORE STATE INTERFACE
// ============================================

interface ThreeDViewerState {
  // Model
  modelUrl: string | null;
  modelInfo: ModelInfo | null;
  isModelLoading: boolean;
  modelError: string | null;
  
  // Transform
  transform: Transform3D;
  
  // Camera
  camera: CameraState;
  autoRotate: boolean;
  
  // View
  viewMode: ViewMode3D;
  showGrid: boolean;
  showAxes: boolean;
  showStats: boolean;
  showWireframe: boolean;
  
  // Layers
  layers: Layer3D[];
  selectedLayerId: string | null;
  
  // UI State
  activePanel: ActivePanel;
  sidebarOpen: boolean;
  fullscreen: boolean;
  controlsVisible: boolean;
  
  // Configurations
  groundPlane: GroundPlaneConfig;
  lighting: LightingConfig;
  background: BackgroundConfig;
  edgeSmoothing: EdgeSmoothingConfig;
  hdr: HDRConfig;
  diamond: DiamondConfig;
  postProcessing: PostProcessingConfig;
  turntable: TurntableConfig;
  videoExport: VideoExportConfig;
  batchExport: BatchExportConfig;
  
  // Recording State
  recordingState: RecordingState;
  batchExportProgress: BatchExportProgress;
  
  // Turntable
  isTurntablePlaying: boolean;
  
  // Selected Material (for editing)
  selectedMaterial: MaterialConfig | null;
  
  // Environment rotation
  environmentRotation: { x: number; y: number; z: number };
}

interface ThreeDViewerActions {
  // Model actions
  setModelUrl: (url: string | null) => void;
  setModelInfo: (info: ModelInfo | null) => void;
  setModelLoading: (loading: boolean) => void;
  setModelError: (error: string | null) => void;
  clearModel: () => void;
  
  // Transform actions
  setTransform: (transform: Partial<Transform3D>) => void;
  resetTransform: () => void;
  
  // Camera actions
  setCamera: (camera: Partial<CameraState>) => void;
  resetCamera: () => void;
  setAutoRotate: (autoRotate: boolean) => void;
  
  // View actions
  setViewMode: (mode: ViewMode3D) => void;
  toggleGrid: () => void;
  toggleAxes: () => void;
  toggleStats: () => void;
  toggleWireframe: () => void;
  
  // Layer actions
  setLayers: (layers: Layer3D[]) => void;
  updateLayer: (id: string, updates: Partial<Layer3D>) => void;
  selectLayer: (id: string | null) => void;
  toggleLayerVisibility: (id: string) => void;
  
  // UI actions
  setActivePanel: (panel: ActivePanel) => void;
  toggleSidebar: () => void;
  toggleFullscreen: () => void;
  toggleControls: () => void;
  
  // Configuration actions
  setGroundPlane: (config: Partial<GroundPlaneConfig>) => void;
  setLighting: (config: Partial<LightingConfig>) => void;
  setBackground: (config: Partial<BackgroundConfig>) => void;
  setEdgeSmoothing: (config: Partial<EdgeSmoothingConfig>) => void;
  setHDR: (config: Partial<HDRConfig>) => void;
  setDiamond: (config: Partial<DiamondConfig>) => void;
  setPostProcessing: (config: Partial<PostProcessingConfig>) => void;
  setTurntable: (config: Partial<TurntableConfig>) => void;
  setVideoExport: (config: Partial<VideoExportConfig>) => void;
  setBatchExport: (config: Partial<BatchExportConfig>) => void;
  
  // Recording actions
  setRecordingState: (state: Partial<RecordingState>) => void;
  setBatchExportProgress: (progress: Partial<BatchExportProgress>) => void;
  
  // Turntable actions
  toggleTurntable: () => void;
  setTurntablePlaying: (playing: boolean) => void;
  
  // Material actions
  setSelectedMaterial: (material: MaterialConfig | null) => void;
  
  // Environment actions
  setEnvironmentRotation: (rotation: { x: number; y: number; z: number }) => void;
  
  // Reset all
  resetAll: () => void;
}

// ============================================
// DEFAULT VALUES
// ============================================

const DEFAULT_TRANSFORM: Transform3D = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: 1,
};

const DEFAULT_CAMERA: CameraState = {
  position: { x: 5, y: 5, z: 5 },
  target: { x: 0, y: 0, z: 0 },
  fov: 45,
  near: 0.1,
  far: 1000,
  zoom: 1,
};

const DEFAULT_RECORDING_STATE: RecordingState = {
  isRecording: false,
  isPaused: false,
  progress: 0,
  currentFrame: 0,
  totalFrames: 0,
  elapsedTime: 0,
  estimatedTimeRemaining: 0,
};

const DEFAULT_BATCH_PROGRESS: BatchExportProgress = {
  isExporting: false,
  currentAngle: 0,
  totalAngles: 0,
  completedImages: [],
  currentAngleName: '',
};

// ============================================
// STORE
// ============================================

export const useThreeDViewerStore = create<ThreeDViewerState & ThreeDViewerActions>()(
  persist(
    (set, get) => ({
      // ========== Initial State ==========
      
      // Model
      modelUrl: null,
      modelInfo: null,
      isModelLoading: false,
      modelError: null,
      
      // Transform
      transform: DEFAULT_TRANSFORM,
      
      // Camera
      camera: DEFAULT_CAMERA,
      autoRotate: false,
      
      // View
      viewMode: 'default',
      showGrid: false,
      showAxes: false,
      showStats: false,
      showWireframe: false,
      
      // Layers
      layers: [],
      selectedLayerId: null,
      
      // UI
      activePanel: 'none',
      sidebarOpen: true,
      fullscreen: false,
      controlsVisible: true,
      
      // Configurations
      groundPlane: DEFAULT_GROUND_CONFIG,
      lighting: DEFAULT_LIGHTING_CONFIG,
      background: DEFAULT_BACKGROUND_CONFIG,
      edgeSmoothing: DEFAULT_EDGE_SMOOTHING_CONFIG,
      hdr: DEFAULT_HDR_CONFIG,
      diamond: DEFAULT_DIAMOND_CONFIG,
      postProcessing: DEFAULT_POST_PROCESSING_CONFIG,
      turntable: DEFAULT_TURNTABLE_CONFIG,
      videoExport: DEFAULT_VIDEO_CONFIG,
      batchExport: DEFAULT_BATCH_CONFIG,
      
      // Recording
      recordingState: DEFAULT_RECORDING_STATE,
      batchExportProgress: DEFAULT_BATCH_PROGRESS,
      
      // Turntable
      isTurntablePlaying: false,
      
      // Material
      selectedMaterial: null,
      
      // Environment
      environmentRotation: { x: 0, y: 0, z: 0 },
      
      // ========== Actions ==========
      
      // Model actions
      setModelUrl: (url) => set({ modelUrl: url }),
      setModelInfo: (info) => set({ modelInfo: info }),
      setModelLoading: (loading) => set({ isModelLoading: loading }),
      setModelError: (error) => set({ modelError: error }),
      clearModel: () => set({
        modelUrl: null,
        modelInfo: null,
        modelError: null,
        layers: [],
        selectedLayerId: null,
      }),
      
      // Transform actions
      setTransform: (transform) => set((state) => ({
        transform: { ...state.transform, ...transform },
      })),
      resetTransform: () => set({ transform: DEFAULT_TRANSFORM }),
      
      // Camera actions
      setCamera: (camera) => set((state) => ({
        camera: { ...state.camera, ...camera },
      })),
      resetCamera: () => set({ camera: DEFAULT_CAMERA }),
      setAutoRotate: (autoRotate) => set({ autoRotate }),
      
      // View actions
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleAxes: () => set((state) => ({ showAxes: !state.showAxes })),
      toggleStats: () => set((state) => ({ showStats: !state.showStats })),
      toggleWireframe: () => set((state) => ({ showWireframe: !state.showWireframe })),
      
      // Layer actions
      setLayers: (layers) => set({ layers }),
      updateLayer: (id, updates) => set((state) => ({
        layers: state.layers.map((l) =>
          l.id === id ? { ...l, ...updates } : l
        ),
      })),
      selectLayer: (id) => set({ selectedLayerId: id }),
      toggleLayerVisibility: (id) => set((state) => ({
        layers: state.layers.map((l) =>
          l.id === id ? { ...l, visible: !l.visible } : l
        ),
      })),
      
      // UI actions
      setActivePanel: (panel) => set({ activePanel: panel }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
      toggleControls: () => set((state) => ({ controlsVisible: !state.controlsVisible })),
      
      // Configuration actions
      setGroundPlane: (config) => set((state) => ({
        groundPlane: { ...state.groundPlane, ...config },
      })),
      setLighting: (config) => set((state) => ({
        lighting: { ...state.lighting, ...config },
      })),
      setBackground: (config) => set((state) => ({
        background: { ...state.background, ...config },
      })),
      setEdgeSmoothing: (config) => set((state) => ({
        edgeSmoothing: { ...state.edgeSmoothing, ...config },
      })),
      setHDR: (config) => set((state) => ({
        hdr: { ...state.hdr, ...config },
      })),
      setDiamond: (config) => set((state) => ({
        diamond: { ...state.diamond, ...config },
      })),
      setPostProcessing: (config) => set((state) => ({
        postProcessing: { ...state.postProcessing, ...config },
      })),
      setTurntable: (config) => set((state) => ({
        turntable: { ...state.turntable, ...config },
      })),
      setVideoExport: (config) => set((state) => ({
        videoExport: { ...state.videoExport, ...config },
      })),
      setBatchExport: (config) => set((state) => ({
        batchExport: { ...state.batchExport, ...config },
      })),
      
      // Recording actions
      setRecordingState: (state) => set((prev) => ({
        recordingState: { ...prev.recordingState, ...state },
      })),
      setBatchExportProgress: (progress) => set((prev) => ({
        batchExportProgress: { ...prev.batchExportProgress, ...progress },
      })),
      
      // Turntable actions
      toggleTurntable: () => set((state) => ({
        isTurntablePlaying: !state.isTurntablePlaying,
        turntable: { ...state.turntable, enabled: true },
      })),
      setTurntablePlaying: (playing) => set({ isTurntablePlaying: playing }),
      
      // Material actions
      setSelectedMaterial: (material) => set({ selectedMaterial: material }),
      
      // Environment actions
      setEnvironmentRotation: (rotation) => set({ environmentRotation: rotation }),
      
      // Reset all
      resetAll: () => set({
        modelUrl: null,
        modelInfo: null,
        isModelLoading: false,
        modelError: null,
        transform: DEFAULT_TRANSFORM,
        camera: DEFAULT_CAMERA,
        autoRotate: false,
        viewMode: 'default',
        showGrid: false,
        showAxes: false,
        showStats: false,
        showWireframe: false,
        layers: [],
        selectedLayerId: null,
        activePanel: 'none',
        groundPlane: DEFAULT_GROUND_CONFIG,
        lighting: DEFAULT_LIGHTING_CONFIG,
        background: DEFAULT_BACKGROUND_CONFIG,
        edgeSmoothing: DEFAULT_EDGE_SMOOTHING_CONFIG,
        hdr: DEFAULT_HDR_CONFIG,
        diamond: DEFAULT_DIAMOND_CONFIG,
        postProcessing: DEFAULT_POST_PROCESSING_CONFIG,
        turntable: DEFAULT_TURNTABLE_CONFIG,
        videoExport: DEFAULT_VIDEO_CONFIG,
        batchExport: DEFAULT_BATCH_CONFIG,
        recordingState: DEFAULT_RECORDING_STATE,
        batchExportProgress: DEFAULT_BATCH_PROGRESS,
        isTurntablePlaying: false,
        selectedMaterial: null,
        environmentRotation: { x: 0, y: 0, z: 0 },
      }),
    }),
    {
      name: 'jewelshot-3d-viewer-store',
      partialize: (state) => ({
        // Only persist these settings
        showGrid: state.showGrid,
        showAxes: state.showAxes,
        groundPlane: state.groundPlane,
        lighting: state.lighting,
        background: state.background,
        edgeSmoothing: state.edgeSmoothing,
        hdr: state.hdr,
        postProcessing: state.postProcessing,
        turntable: state.turntable,
        videoExport: state.videoExport,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

export default useThreeDViewerStore;
