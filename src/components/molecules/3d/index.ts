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
export { MaterialEditor, type MaterialProperties } from './MaterialEditor';

// Weight Summary
export { WeightSummaryCard } from './WeightSummaryCard';

// Settings Panel
export { ViewerSettingsPanel } from './ViewerSettingsPanel';

// Orientation Modal
export { OrientationModal, type OrientationConfig } from './OrientationModal';

// Environment
export { EnvironmentPicker, type SelectedEnvironment, type EnvironmentType } from './EnvironmentPicker';

// Diamond Effects
export { DiamondEffectsPanel } from './DiamondEffectsPanel';

// Post-Processing
export { PostProcessingPanel } from './PostProcessingPanel';
