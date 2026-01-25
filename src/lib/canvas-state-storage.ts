/**
 * Canvas State Persistence
 * 
 * Saves and restores canvas state across page navigation
 * Prevents losing work when switching between Studio/Gallery/Batch
 */

import { createScopedLogger } from './logger';
import type { 
  AdjustFilters, 
  ColorFilters, 
  FilterEffects 
} from '@/hooks/useImageFilters';
import type { BackgroundType } from '@/components/molecules/BackgroundSelector';

const logger = createScopedLogger('CanvasState');

const CANVAS_STATE_KEY = 'jewelshot_canvas_state';
const STATE_VERSION = 2; // Bumped for imageScale support

export interface CanvasState {
  version: number;
  timestamp: number;
  uploadedImage: string | null;
  originalImage: string | null;
  fileName: string;
  fileSize: number;
  // Transform
  scale: number;
  position: { x: number; y: number };
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  imageScale?: number; // Image content scale (0.1 - 2.0)
  // Filters
  adjustFilters: AdjustFilters;
  colorFilters: ColorFilters;
  filterEffects: FilterEffects;
  // Background
  background: BackgroundType;
}

/**
 * Save canvas state to localStorage
 */
export function saveCanvasState(state: Partial<CanvasState>): void {
  try {
    // Don't save blob URLs (they become invalid on refresh)
    const uploadedImage = state.uploadedImage;
    if (uploadedImage && uploadedImage.startsWith('blob:')) {
      logger.warn('Skipping blob URL save (will become invalid)');
      return;
    }

    const fullState: CanvasState = {
      version: STATE_VERSION,
      timestamp: Date.now(),
      uploadedImage: state.uploadedImage || null,
      originalImage: state.originalImage || null,
      fileName: state.fileName || '',
      fileSize: state.fileSize || 0,
      scale: state.scale || 1,
      position: state.position || { x: 0, y: 0 },
      rotation: state.rotation || 0,
      flipHorizontal: state.flipHorizontal || false,
      flipVertical: state.flipVertical || false,
      adjustFilters: state.adjustFilters || {
        brightness: 0,
        contrast: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
        clarity: 0,
        sharpness: 0,
        dehaze: 0,
      },
      colorFilters: state.colorFilters || {
        temperature: 0,
        tint: 0,
        saturation: 0,
        vibrance: 0,
      },
      filterEffects: state.filterEffects || {
        vignetteAmount: 0,
        vignetteSize: 50,
        vignetteFeather: 50,
        grainAmount: 0,
        grainSize: 1,
        fadeAmount: 0,
      },
      background: state.background || 'gray', // Default background
    };

    localStorage.setItem(CANVAS_STATE_KEY, JSON.stringify(fullState));
    logger.info('Canvas state saved', { 
      hasImage: !!fullState.uploadedImage,
      fileName: fullState.fileName,
    });
  } catch (error) {
    logger.error('Failed to save canvas state:', error);
  }
}

/**
 * Load canvas state from localStorage
 */
export function loadCanvasState(): CanvasState | null {
  try {
    const stored = localStorage.getItem(CANVAS_STATE_KEY);
    if (!stored) {
      logger.info('No saved canvas state found');
      return null;
    }

    const state: CanvasState = JSON.parse(stored);

    // Check version compatibility
    if (state.version !== STATE_VERSION) {
      logger.warn('Canvas state version mismatch, clearing');
      clearCanvasState();
      return null;
    }

    // Check if state is too old (> 7 days)
    const now = Date.now();
    const age = now - state.timestamp;
    const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

    if (age > MAX_AGE) {
      logger.warn('Canvas state too old, clearing');
      clearCanvasState();
      return null;
    }

    logger.info('Canvas state loaded', {
      hasImage: !!state.uploadedImage,
      fileName: state.fileName,
      age: Math.round(age / 1000 / 60) + ' minutes',
    });

    return state;
  } catch (error) {
    logger.error('Failed to load canvas state:', error);
    return null;
  }
}

/**
 * Clear canvas state from localStorage
 */
export function clearCanvasState(): void {
  try {
    localStorage.removeItem(CANVAS_STATE_KEY);
    logger.info('Canvas state cleared');
  } catch (error) {
    logger.error('Failed to clear canvas state:', error);
  }
}

/**
 * Check if there's a saved canvas state
 */
export function hasCanvasState(): boolean {
  return !!localStorage.getItem(CANVAS_STATE_KEY);
}

