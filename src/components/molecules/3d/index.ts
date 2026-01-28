/**
 * 3D Components Barrel Export
 * 
 * Atomic Architecture: Exports all 3D-related molecule components
 */

// Transform Controls
export { TransformControls } from './TransformControls';

// Layer Management
export { LayerPanel } from './LayerPanel';
export { LayerGroupPanel, type LayerItem, type LayerCategory } from './LayerGroupPanel';

// Material Picker & Editor
export { MaterialPicker } from './MaterialPicker';
export { MaterialEditor, type MaterialConfig, METAL_PRESETS, FINISH_PRESETS, PRINTING_PRESETS } from './MaterialEditor';

// Weight Summary
export { WeightSummaryCard } from './WeightSummaryCard';

// Settings Panel
export { ViewerSettingsPanel } from './ViewerSettingsPanel';

// Orientation Modal
export { OrientationModal, type OrientationConfig } from './OrientationModal';

// Environment
export { EnvironmentPicker, type SelectedEnvironment, type EnvironmentType } from './EnvironmentPicker';

// Ground Plane
export { GroundPlane, GroundPlaneControls, type GroundPlaneConfig, DEFAULT_GROUND_CONFIG, GROUND_PRESETS } from './GroundPlane';

// Lighting
export { LightingPanel, type LightingConfig, type Light3D, DEFAULT_LIGHTING_CONFIG, LIGHTING_PRESETS } from './LightingPanel';

// Background
export { BackgroundPanel, type BackgroundConfig, DEFAULT_BACKGROUND_CONFIG, COLOR_PRESETS, GRADIENT_PRESETS } from './BackgroundPanel';

// Edge Smoothing
export { EdgeSmoothingPanel, type EdgeSmoothingConfig, DEFAULT_EDGE_SMOOTHING_CONFIG, QUALITY_PRESETS } from './EdgeSmoothingPanel';

// HDR & Environment
export { HDRPanel, type HDRConfig, type HDRPreset, type LightformerPreset, DEFAULT_HDR_CONFIG, HDR_PRESETS, LIGHTFORMER_PRESETS } from './HDRPanel';

// Diamond Effects (New)
export { DiamondPanel, type DiamondConfig, DEFAULT_DIAMOND_CONFIG, GEMSTONE_PRESETS } from './DiamondPanel';

// Diamond Effects (Legacy)
export { DiamondEffectsPanel } from './DiamondEffectsPanel';

// Post-Processing
export { PostProcessingPanel as PostProcessingPanelNew, type PostProcessingConfig, DEFAULT_POST_PROCESSING_CONFIG, POST_PROCESSING_PRESETS } from './PostProcessingPanel';
export { PostProcessingEffects } from './PostProcessingEffects';

// Video Export
export { VideoExportPanel, type VideoExportConfig, type RecordingState, DEFAULT_VIDEO_CONFIG } from './VideoExportPanel';

// Turntable Controller
export { TurntableControls, TurntableAnimator, TurntableButton, type TurntableConfig, DEFAULT_TURNTABLE_CONFIG } from './TurntableController';

// Batch Export
export { BatchExportPanel, type BatchExportConfig, type BatchExportProgress, type ViewAngle, DEFAULT_BATCH_CONFIG, PRESET_ANGLES, ANGLE_QUICK_SETS } from './BatchExportPanel';
