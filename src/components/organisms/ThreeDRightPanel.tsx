/**
 * ThreeDRightPanel - Organized right panel for 3D viewer with tabs
 * 
 * Features:
 * - Tab-based navigation (Model, Materials, Lighting, Effects, Export)
 * - All 3D viewer controls in one organized place
 * - Collapsible sections within each tab
 */

'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Palette,
  Sun,
  Sparkles,
  Download,
  Layers,
  RotateCw,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Image as ImageIcon,
  Diamond,
  Video,
  Camera,
  RefreshCw,
  X,
  Check,
  Move,
} from 'lucide-react';

// Panels
import { GroundPlaneControls, DEFAULT_GROUND_CONFIG, type GroundPlaneConfig } from '@/components/molecules/3d/GroundPlane';
import { LightingPanel, DEFAULT_LIGHTING_CONFIG, type LightingConfig } from '@/components/molecules/3d/LightingPanel';
import { BackgroundPanel, DEFAULT_BACKGROUND_CONFIG, type BackgroundConfig } from '@/components/molecules/3d/BackgroundPanel';
import { EdgeSmoothingPanel, DEFAULT_EDGE_SMOOTHING_CONFIG, type EdgeSmoothingConfig } from '@/components/molecules/3d/EdgeSmoothingPanel';
import { HDRPanel, DEFAULT_HDR_CONFIG, type HDRConfig } from '@/components/molecules/3d/HDRPanel';
import { DiamondPanel, DEFAULT_DIAMOND_CONFIG, type DiamondConfig } from '@/components/molecules/3d/DiamondPanel';
import { PostProcessingPanelNew, DEFAULT_POST_PROCESSING_CONFIG, type PostProcessingConfig } from '@/components/molecules/3d';
import { MaterialEditor, METAL_PRESETS, type MaterialConfig } from '@/components/molecules/3d/MaterialEditor';
import { VideoExportPanel, DEFAULT_VIDEO_CONFIG, type VideoExportConfig, type RecordingState } from '@/components/molecules/3d/VideoExportPanel';
import { TurntableControls, DEFAULT_TURNTABLE_CONFIG, type TurntableConfig } from '@/components/molecules/3d/TurntableController';
import { BatchExportPanel, DEFAULT_BATCH_CONFIG, type BatchExportConfig, type BatchExportProgress } from '@/components/molecules/3d/BatchExportPanel';
// NEW Panels
import { MeasurementPanel, DEFAULT_MEASUREMENT_CONFIG, type MeasurementConfig, type Dimensions3D } from '@/components/molecules/3d/MeasurementPanel';
import { ViewPanel, DEFAULT_VIEW_CONFIG, type ViewConfig, type CameraPreset } from '@/components/molecules/3d/ViewPanel';
import { FocusPanel, DEFAULT_FOCUS_CONFIG, type FocusConfig } from '@/components/molecules/3d/FocusPanel';
import { AnnotationPanel, DEFAULT_ANNOTATION_CONFIG, type AnnotationConfig, type AnnotationType } from '@/components/molecules/3d/AnnotationPanel';
import { TransformPanelAdvanced, DEFAULT_TRANSFORM_ADVANCED_CONFIG, type TransformAdvancedConfig } from '@/components/molecules/3d/TransformPanelAdvanced';
import { TransformControls } from '@/components/molecules/3d/TransformControls';
import { CameraControlsPanel } from '@/components/molecules/3d/CameraControlsPanel';
import { DEFAULT_TRANSFORM, DEFAULT_FLIP, type TransformState, type FlipState } from '@/lib/3d/types';
import { DEFAULT_CAMERA_SETTINGS, type CameraSettings, type CameraViewPreset } from '@/lib/3d/camera-presets';
// NEW: Missing components
import { LayerGroupPanel, type LayerItem, type LayerCategory } from '@/components/molecules/3d/LayerGroupPanel';
import { MaterialPicker } from '@/components/molecules/3d/MaterialPicker';
import { WeightSummaryCard } from '@/components/molecules/3d/WeightSummaryCard';
import { EnvironmentPicker, type SelectedEnvironment } from '@/components/molecules/3d/EnvironmentPicker';
import { ExportPanel } from '@/components/molecules/3d/ExportPanel';
import { DiamondEffectsPanel } from '@/components/molecules/3d/DiamondEffectsPanel';
import { OrientationModal, type OrientationConfig } from '@/components/molecules/3d/OrientationModal';
import { DEFAULT_DIAMOND_EFFECTS, type DiamondEffectConfig } from '@/lib/3d/diamond-effects';
import { type ScreenshotConfig, type VideoConfig, type MultiAngleConfig } from '@/lib/3d/export-utils';

// ============================================
// TYPES
// ============================================

type TabId = 'model' | 'materials' | 'lighting' | 'effects' | 'view' | 'export';

interface TabConfig {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  { id: 'model', label: 'Model', icon: <Box className="h-3.5 w-3.5" /> },
  { id: 'materials', label: 'Malzeme', icon: <Palette className="h-3.5 w-3.5" /> },
  { id: 'lighting', label: 'Işık', icon: <Sun className="h-3.5 w-3.5" /> },
  { id: 'effects', label: 'Efekt', icon: <Sparkles className="h-3.5 w-3.5" /> },
  { id: 'view', label: 'Görünüm', icon: <Eye className="h-3.5 w-3.5" /> },
  { id: 'export', label: 'Export', icon: <Download className="h-3.5 w-3.5" /> },
];

// ============================================
// SECTION COMPONENT
// ============================================

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section = memo(function Section({ title, icon, defaultOpen = false, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={toggleOpen}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          {icon && <span className={isOpen ? 'text-white/70' : 'text-white/40'}>{icon}</span>}
          <span className={`text-xs font-medium ${isOpen ? 'text-white' : 'text-white/60'}`}>
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-white/40" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        )}
      </button>
      
      {/* Use CSS grid for performant height animation - no layout thrashing */}
      <div 
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
});

// ============================================
// MAIN COMPONENT PROPS
// ============================================

interface ThreeDRightPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  
  // Model info
  fileName?: string | null;
  modelInfo?: { vertices: number; faces: number } | null;
  has3DMFile?: boolean;
  
  // Layers
  layers?: Array<{
    id: string;
    name: string;
    visible: boolean;
    color: string;
    category?: 'metal' | 'stone' | 'other';
  }>;
  onLayerVisibilityChange?: (id: string, visible: boolean) => void;
  onLayerMaterialChange?: (id: string, materialId: string) => void;
  
  // View options
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
  wireframe: boolean;
  onWireframeChange: (show: boolean) => void;
  autoRotate: boolean;
  onAutoRotateChange: (auto: boolean) => void;
  
  // Material
  selectedMaterial: MaterialConfig;
  onMaterialChange: (material: Partial<MaterialConfig>) => void;
  
  // Lighting
  lightingConfig: LightingConfig;
  onLightingChange: (config: Partial<LightingConfig>) => void;
  
  // HDR
  hdrConfig: HDRConfig;
  onHDRChange: (config: Partial<HDRConfig>) => void;
  
  // Background
  backgroundConfig: BackgroundConfig;
  onBackgroundChange: (config: Partial<BackgroundConfig>) => void;
  
  // Ground
  groundConfig: GroundPlaneConfig;
  onGroundChange: (config: Partial<GroundPlaneConfig>) => void;
  
  // Diamond
  diamondConfig: DiamondConfig;
  onDiamondChange: (config: Partial<DiamondConfig>) => void;
  
  // Post-processing
  postProcessingConfig: PostProcessingConfig;
  onPostProcessingChange: (config: Partial<PostProcessingConfig>) => void;
  
  // Edge smoothing
  edgeSmoothingConfig: EdgeSmoothingConfig;
  onEdgeSmoothingChange: (config: Partial<EdgeSmoothingConfig>) => void;
  onApplyEdgeSmoothing?: () => void;
  isProcessingEdges?: boolean;
  
  // Turntable
  turntableConfig: TurntableConfig;
  onTurntableChange: (config: Partial<TurntableConfig>) => void;
  isTurntablePlaying: boolean;
  onTurntableToggle: () => void;
  onTurntableReset: () => void;
  
  // Video export
  videoConfig: VideoExportConfig;
  onVideoConfigChange: (config: Partial<VideoExportConfig>) => void;
  recordingState: RecordingState;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onTakeScreenshot: () => void;
  
  // Batch export
  batchConfig: BatchExportConfig;
  onBatchConfigChange: (config: Partial<BatchExportConfig>) => void;
  batchProgress: BatchExportProgress;
  onStartBatchExport: () => void;
  onCancelBatchExport: () => void;
  onPreviewAngle?: (angle: { rotation: { x: number; y: number; z: number } }) => void;
  
  // Snapshot
  snapshotPreview?: string | null;
  onDownloadSnapshot?: () => void;
  onSaveToGallery?: () => void;
  onOpenInStudio?: () => void;
  onClearSnapshot?: () => void;
  
  // File actions
  onFileUpload?: () => void;
  onClearModel?: () => void;
  
  // NEW: Measurement
  measurementConfig: MeasurementConfig;
  onMeasurementChange: (config: Partial<MeasurementConfig>) => void;
  modelDimensions?: Dimensions3D | null;
  onRecalculateDimensions?: () => void;
  
  // NEW: View
  viewConfig: ViewConfig;
  onViewChange: (config: Partial<ViewConfig>) => void;
  onCameraPreset?: (preset: CameraPreset) => void;
  onViewAngle?: (angle: string) => void;
  onResetCamera?: () => void;
  
  // NEW: Focus
  focusConfig: FocusConfig;
  onFocusChange: (config: Partial<FocusConfig>) => void;
  
  // NEW: Annotation
  annotationConfig: AnnotationConfig;
  onAnnotationChange: (config: Partial<AnnotationConfig>) => void;
  onAddAnnotation?: (type: AnnotationType) => void;
  
  // NEW: Transform Advanced
  transformConfig: TransformAdvancedConfig;
  onTransformChange: (config: Partial<TransformAdvancedConfig>) => void;
  onTransformReset?: () => void;
  
  // NEW: Product Transform (Position, Rotation, Scale, Flip)
  productTransform: TransformState;
  productFlip: FlipState;
  onProductTransformChange: (transform: TransformState) => void;
  onProductFlipChange: (flip: FlipState) => void;
  
  // NEW: Camera Controls
  cameraSettings: CameraSettings;
  currentCameraPresetId: string | null;
  onCameraSettingsChange: (settings: CameraSettings) => void;
  onCameraPresetSelect: (preset: CameraViewPreset) => void;
  onFitToView: () => void;
  
  // NEW: Layer Group Panel
  layerItems: LayerItem[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onToggleLayerVisibility: (id: string) => void;
  onToggleAllLayerVisibility: (category: LayerCategory, visible: boolean) => void;
  
  // NEW: Material Picker Modal
  materialPickerOpen: boolean;
  materialPickerLayerId: string | null;
  materialPickerCategory: 'metal' | 'stone' | 'setting' | 'unknown';
  onMaterialPickerClose: () => void;
  onMaterialPickerOpen: (layerId: string) => void;
  onMaterialSelect: (materialId: string) => void;
  
  // NEW: Environment Picker
  selectedEnvironment: SelectedEnvironment;
  onEnvironmentChange: (env: SelectedEnvironment) => void;
  
  // NEW: Export Panel handlers
  onScreenshot: (config: ScreenshotConfig) => Promise<void>;
  onVideoExport?: (config: VideoConfig) => Promise<void>;
  onMultiAngleExport?: (config: MultiAngleConfig) => Promise<void>;
  
  // NEW: Diamond Effects (Legacy with gemstone/cut selection)
  diamondEffects: DiamondEffectConfig;
  onDiamondEffectsChange: (effects: DiamondEffectConfig) => void;
  selectedGemstone: string;
  onGemstoneChange: (id: string) => void;
  selectedCut: string;
  onCutChange: (id: string) => void;
  
  // NEW: Orientation Modal
  orientationModalOpen: boolean;
  onOrientationModalClose: () => void;
  onOrientationConfirm: (config: OrientationConfig) => void;
  orientationGeometry?: THREE.BufferGeometry;
  orientationScene?: THREE.Group;
  
  // NEW: Single geometry weight (for STL files)
  singleGeometryWeight?: number;
  singleGeometryVolume?: number;
  singleGeometryMaterial?: string;
  
  // Force switch to specific tab (from external trigger like clicking ground)
  forceActiveTab?: TabId | null;
  onForceActiveTabHandled?: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ThreeDRightPanel({
  isOpen,
  onToggle,
  fileName,
  modelInfo,
  has3DMFile = false,
  layers = [],
  onLayerVisibilityChange,
  onLayerMaterialChange,
  showGrid,
  onShowGridChange,
  wireframe,
  onWireframeChange,
  autoRotate,
  onAutoRotateChange,
  selectedMaterial,
  onMaterialChange,
  lightingConfig,
  onLightingChange,
  hdrConfig,
  onHDRChange,
  backgroundConfig,
  onBackgroundChange,
  groundConfig,
  onGroundChange,
  diamondConfig,
  onDiamondChange,
  postProcessingConfig,
  onPostProcessingChange,
  edgeSmoothingConfig,
  onEdgeSmoothingChange,
  onApplyEdgeSmoothing,
  isProcessingEdges,
  turntableConfig,
  onTurntableChange,
  isTurntablePlaying,
  onTurntableToggle,
  onTurntableReset,
  videoConfig,
  onVideoConfigChange,
  recordingState,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onTakeScreenshot,
  batchConfig,
  onBatchConfigChange,
  batchProgress,
  onStartBatchExport,
  onCancelBatchExport,
  onPreviewAngle,
  snapshotPreview,
  onDownloadSnapshot,
  onSaveToGallery,
  onOpenInStudio,
  onClearSnapshot,
  onFileUpload,
  onClearModel,
  // NEW panels
  measurementConfig,
  onMeasurementChange,
  modelDimensions,
  onRecalculateDimensions,
  viewConfig,
  onViewChange,
  onCameraPreset,
  onViewAngle,
  onResetCamera,
  focusConfig,
  onFocusChange,
  annotationConfig,
  onAnnotationChange,
  onAddAnnotation,
  transformConfig,
  onTransformChange,
  onTransformReset,
  // Product Transform
  productTransform,
  productFlip,
  onProductTransformChange,
  onProductFlipChange,
  // Camera Controls
  cameraSettings,
  currentCameraPresetId,
  onCameraSettingsChange,
  onCameraPresetSelect,
  onFitToView,
  // Layer Group Panel
  layerItems,
  selectedLayerId,
  onSelectLayer,
  onToggleLayerVisibility,
  onToggleAllLayerVisibility,
  // Material Picker
  materialPickerOpen,
  materialPickerLayerId,
  materialPickerCategory,
  onMaterialPickerClose,
  onMaterialPickerOpen,
  onMaterialSelect,
  // Environment Picker
  selectedEnvironment,
  onEnvironmentChange,
  // Export Panel
  onScreenshot,
  onVideoExport,
  onMultiAngleExport,
  // Diamond Effects
  diamondEffects,
  onDiamondEffectsChange,
  selectedGemstone,
  onGemstoneChange,
  selectedCut,
  onCutChange,
  // Orientation Modal
  orientationModalOpen,
  onOrientationModalClose,
  onOrientationConfirm,
  orientationGeometry,
  orientationScene,
  // Single geometry weight (for STL files)
  singleGeometryWeight,
  singleGeometryVolume,
  singleGeometryMaterial,
  // Force active tab
  forceActiveTab,
  onForceActiveTabHandled,
}: ThreeDRightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('model');

  // Handle forced tab switch (e.g., when clicking on ground)
  useEffect(() => {
    if (forceActiveTab) {
      setActiveTab(forceActiveTab);
      onForceActiveTabHandled?.();
    }
  }, [forceActiveTab, onForceActiveTabHandled]);

  if (!isOpen) return null;

  return (
    <div className="flex h-full flex-col bg-[#0a0a0a]">
      {/* Header with Tabs */}
      <div className="border-b border-white/10">
        {/* Title */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-white">3D Viewer</span>
          <button
            onClick={onToggle}
            className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-t border-white/5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/5 text-white/90 border-b border-white/30'
                  : 'text-white/40 hover:text-white/60 hover:bg-white/[0.02] border-b border-transparent'
              }`}
            >
              {tab.icon}
              <span className="text-[9px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* ========== MODEL TAB ========== */}
        {activeTab === 'model' && (
          <div>
            {/* Model Info */}
            {fileName && (
              <Section title="Model Bilgisi" icon={<Box className="h-3.5 w-3.5" />} defaultOpen>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                    <div>
                      <p className="text-xs text-white/70 truncate max-w-[160px]">{fileName}</p>
                      {modelInfo && (
                        <p className="text-[10px] text-white/40 mt-1">
                          {modelInfo.vertices.toLocaleString()} vertices • {modelInfo.faces.toLocaleString()} faces
                        </p>
                      )}
                    </div>
                    <button
                      onClick={onClearModel}
                      className="rounded p-1.5 text-white/40 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Section>
            )}

            {/* Layers - Using LayerGroupPanel for grouped view */}
            {layerItems.length > 0 && (
              <Section title={`Katmanlar (${layerItems.length})`} icon={<Layers className="h-3.5 w-3.5" />} defaultOpen>
                <LayerGroupPanel
                  layers={layerItems}
                  selectedLayerId={selectedLayerId}
                  onSelectLayer={onSelectLayer}
                  onToggleLayerVisibility={onToggleLayerVisibility}
                  onToggleAllVisibility={onToggleAllLayerVisibility}
                  onOpenMaterialPicker={onMaterialPickerOpen}
                  compact
                />
              </Section>
            )}

            {/* Weight Summary */}
            <Section title="Ağırlık Özeti" icon={<Box className="h-3.5 w-3.5" />}>
              <WeightSummaryCard 
                singleGeometryWeight={singleGeometryWeight}
                singleGeometryVolume={singleGeometryVolume}
                singleGeometryMaterial={singleGeometryMaterial}
              />
            </Section>

            {/* Display Options */}
            <Section title="Görüntü Ayarları" icon={<Settings className="h-3.5 w-3.5" />} defaultOpen>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[11px] text-white/60">Grid</span>
                  <button
                    onClick={() => onShowGridChange(!showGrid)}
                    className={`relative w-7 h-3.5 rounded-full transition-colors ${
                      showGrid ? 'bg-white/40' : 'bg-white/15'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform shadow-sm ${
                      showGrid ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[11px] text-white/60">Wireframe</span>
                  <button
                    onClick={() => onWireframeChange(!wireframe)}
                    className={`relative w-7 h-3.5 rounded-full transition-colors ${
                      wireframe ? 'bg-white/40' : 'bg-white/15'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform shadow-sm ${
                      wireframe ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-[11px] text-white/60">Otomatik Döndür</span>
                  <button
                    onClick={() => onAutoRotateChange(!autoRotate)}
                    className={`relative w-7 h-3.5 rounded-full transition-colors ${
                      autoRotate ? 'bg-white/40' : 'bg-white/15'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform shadow-sm ${
                      autoRotate ? 'translate-x-3.5' : 'translate-x-0'
                    }`} />
                  </button>
                </label>
              </div>
            </Section>

            {/* Turntable */}
            <Section title="Turntable Animasyon" icon={<RotateCw className="h-3.5 w-3.5" />}>
              <TurntableControls
                config={turntableConfig}
                onChange={onTurntableChange}
                isPlaying={isTurntablePlaying}
                onTogglePlay={onTurntableToggle}
                onReset={onTurntableReset}
              />
            </Section>

            {/* Edge Smoothing */}
            <Section title="Mesh Kalitesi" icon={<Settings className="h-3.5 w-3.5" />}>
              <EdgeSmoothingPanel
                config={edgeSmoothingConfig}
                onChange={onEdgeSmoothingChange}
                onApply={onApplyEdgeSmoothing}
                isProcessing={isProcessingEdges}
                modelInfo={modelInfo}
                has3DMFile={has3DMFile}
              />
            </Section>

            {/* Product Transform - Position, Rotation, Scale, Flip */}
            <Section title="Ürün Transform" icon={<Move className="h-3.5 w-3.5" />}>
              <TransformControls
                transform={productTransform}
                flip={productFlip}
                onTransformChange={onProductTransformChange}
                onFlipChange={onProductFlipChange}
                compact
              />
            </Section>

            {/* Camera Controls */}
            <Section title="Kamera Kontrolleri" icon={<Camera className="h-3.5 w-3.5" />}>
              <CameraControlsPanel
                settings={cameraSettings}
                currentPresetId={currentCameraPresetId}
                onChange={onCameraSettingsChange}
                onPresetSelect={onCameraPresetSelect}
                onFitToView={onFitToView}
                onResetCamera={onResetCamera || (() => {})}
                compact
              />
            </Section>
          </div>
        )}

        {/* ========== MATERIALS TAB ========== */}
        {activeTab === 'materials' && (
          <div>
            <Section title="Malzeme Editörü" icon={<Palette className="h-3.5 w-3.5" />} defaultOpen>
              <MaterialEditor
                material={selectedMaterial}
                onChange={onMaterialChange}
              />
            </Section>

            <Section title="Taş Efektleri" icon={<Diamond className="h-3.5 w-3.5" />}>
              <DiamondPanel
                config={diamondConfig}
                onChange={onDiamondChange}
              />
            </Section>

            {/* Legacy Diamond Effects with Gemstone/Cut Selection */}
            <Section title="Taş Kesimi & Türü" icon={<Sparkles className="h-3.5 w-3.5" />}>
              <DiamondEffectsPanel
                effects={diamondEffects}
                onChange={onDiamondEffectsChange}
                selectedGemstone={selectedGemstone}
                onGemstoneChange={onGemstoneChange}
                selectedCut={selectedCut}
                onCutChange={onCutChange}
                compact
              />
            </Section>
          </div>
        )}

        {/* ========== LIGHTING TAB ========== */}
        {activeTab === 'lighting' && (
          <div>
            {/* Quick Environment Picker */}
            <Section title="Hızlı Ortam Seçici" icon={<ImageIcon className="h-3.5 w-3.5" />} defaultOpen>
              <EnvironmentPicker
                selected={selectedEnvironment}
                onChange={onEnvironmentChange}
                compact
              />
            </Section>

            <Section title="Ortam (HDR) Detaylı" icon={<ImageIcon className="h-3.5 w-3.5" />}>
              <HDRPanel
                config={hdrConfig}
                onChange={onHDRChange}
              />
            </Section>

            <Section title="Işık Kaynakları" icon={<Sun className="h-3.5 w-3.5" />}>
              <LightingPanel
                config={lightingConfig}
                onChange={onLightingChange}
              />
            </Section>

            <Section title="Arka Plan" icon={<Layers className="h-3.5 w-3.5" />}>
              <BackgroundPanel
                config={backgroundConfig}
                onChange={onBackgroundChange}
              />
            </Section>

            <Section title="Zemin Düzlemi" icon={<Box className="h-3.5 w-3.5" />}>
              <GroundPlaneControls
                config={groundConfig}
                onChange={onGroundChange}
              />
            </Section>
          </div>
        )}

        {/* ========== EFFECTS TAB ========== */}
        {activeTab === 'effects' && (
          <div>
            <Section title="Post-Processing" icon={<Sparkles className="h-3.5 w-3.5" />} defaultOpen>
              <PostProcessingPanelNew
                config={postProcessingConfig}
                onChange={onPostProcessingChange}
              />
            </Section>

            <Section title="Odak Efektleri (DOF)" icon={<Eye className="h-3.5 w-3.5" />}>
              <FocusPanel
                config={focusConfig}
                onChange={onFocusChange}
              />
            </Section>
          </div>
        )}

        {/* ========== VIEW TAB ========== */}
        {activeTab === 'view' && (
          <div>
            <Section title="Görünüm Modu" icon={<Eye className="h-3.5 w-3.5" />} defaultOpen>
              <ViewPanel
                config={viewConfig}
                onChange={onViewChange}
                onCameraPreset={onCameraPreset}
                onViewAngle={onViewAngle}
                onResetCamera={onResetCamera}
              />
            </Section>

            <Section title="Ölçümler" icon={<Box className="h-3.5 w-3.5" />}>
              <MeasurementPanel
                config={measurementConfig}
                onChange={onMeasurementChange}
                dimensions={modelDimensions}
                onRecalculate={onRecalculateDimensions}
              />
            </Section>

            <Section title="Etiketler" icon={<Layers className="h-3.5 w-3.5" />}>
              <AnnotationPanel
                config={annotationConfig}
                onChange={onAnnotationChange}
                onAddAnnotation={onAddAnnotation}
              />
            </Section>

            <Section title="Transform (Gelişmiş)" icon={<Settings className="h-3.5 w-3.5" />}>
              <TransformPanelAdvanced
                config={transformConfig}
                onChange={onTransformChange}
                onReset={onTransformReset}
              />
            </Section>
          </div>
        )}

        {/* ========== EXPORT TAB ========== */}
        {activeTab === 'export' && (
          <div>
            {/* Snapshot Preview */}
            {snapshotPreview && (
              <Section title="Önizleme" icon={<Camera className="h-3.5 w-3.5" />} defaultOpen>
                <div className="space-y-2">
                  <div className="relative overflow-hidden rounded-lg border border-white/10">
                    <img src={snapshotPreview} alt="Snapshot" className="w-full" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={onDownloadSnapshot}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white/10 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/15 transition-colors"
                    >
                      İndir
                    </button>
                    <button
                      onClick={onSaveToGallery}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-white/10 py-1.5 text-[11px] font-medium text-white/80 hover:bg-white/15 transition-colors"
                    >
                      Galeri
                    </button>
                  </div>
                  <button
                    onClick={onClearSnapshot}
                    className="w-full text-center text-[10px] text-white/40 hover:text-white/60"
                  >
                    Temizle
                  </button>
                </div>
              </Section>
            )}

            {/* General Export Panel */}
            <Section title="Hızlı Export" icon={<Download className="h-3.5 w-3.5" />} defaultOpen>
              <ExportPanel
                onScreenshot={onScreenshot}
                onVideo={onVideoExport}
                onMultiAngle={onMultiAngleExport}
                isExporting={recordingState.isRecording || batchProgress.isExporting}
                compact
              />
            </Section>

            <Section title="Video / GIF / Görsel (Detaylı)" icon={<Video className="h-3.5 w-3.5" />}>
              <VideoExportPanel
                config={videoConfig}
                onChange={onVideoConfigChange}
                recordingState={recordingState}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
                onPauseRecording={onPauseRecording}
                onTakeScreenshot={onTakeScreenshot}
              />
            </Section>

            <Section title="Toplu Export (Çoklu Açı)" icon={<Layers className="h-3.5 w-3.5" />}>
              <BatchExportPanel
                config={batchConfig}
                onChange={onBatchConfigChange}
                progress={batchProgress}
                onStartExport={onStartBatchExport}
                onCancelExport={onCancelBatchExport}
                onPreviewAngle={onPreviewAngle}
              />
            </Section>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-2 text-center">
        <p className="text-[9px] text-white/30">JewelShot 3D Viewer v2.0</p>
      </div>

      {/* Material Picker Modal */}
      <MaterialPicker
        isOpen={materialPickerOpen}
        onClose={onMaterialPickerClose}
        currentMaterialId={materialPickerLayerId}
        layerCategory={materialPickerCategory}
        onSelectMaterial={onMaterialSelect}
      />

      {/* Orientation Modal */}
      <OrientationModal
        isOpen={orientationModalOpen}
        onClose={onOrientationModalClose}
        onConfirm={onOrientationConfirm}
        geometry={orientationGeometry}
        scene={orientationScene}
        fileName={fileName || '3D Model'}
      />
    </div>
  );
}

export default ThreeDRightPanel;
