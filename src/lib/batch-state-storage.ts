/**
 * Batch State Persistence
 * 
 * Saves and restores batch processing state across page navigation
 * Prevents losing uploaded images when switching pages
 */

import { createScopedLogger } from './logger';

const logger = createScopedLogger('BatchState');

const BATCH_STATE_KEY = 'jewelshot_batch_state';
const STATE_VERSION = 1;

export interface BatchImageState {
  id: string;
  preview: string; // Data URI (base64) for persistence
  fileName: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: string; // Result URL (permanent URL, not blob)
  error?: string;
}

export interface BatchState {
  version: number;
  timestamp: number;
  images: BatchImageState[];
  batchPrompt: string;
  batchName: string;
  aspectRatio: string;
  isProcessing: boolean;
}

/**
 * Convert File to Data URI for storage
 */
export async function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Save batch state to localStorage
 */
export async function saveBatchState(state: Partial<BatchState>): Promise<void> {
  try {
    const fullState: BatchState = {
      version: STATE_VERSION,
      timestamp: Date.now(),
      images: state.images || [],
      batchPrompt: state.batchPrompt || '',
      batchName: state.batchName || '',
      aspectRatio: state.aspectRatio || 'auto',
      isProcessing: state.isProcessing || false,
    };

    // Check storage size (localStorage has ~5-10MB limit)
    const stateString = JSON.stringify(fullState);
    const sizeInMB = new Blob([stateString]).size / 1024 / 1024;
    
    if (sizeInMB > 4) {
      logger.warn('Batch state too large, skipping save', { sizeMB: sizeInMB.toFixed(2) });
      return;
    }

    localStorage.setItem(BATCH_STATE_KEY, stateString);
    logger.info('Batch state saved', { 
      imageCount: fullState.images.length,
      sizeMB: sizeInMB.toFixed(2),
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      logger.error('localStorage quota exceeded, clearing old data');
      clearBatchState();
    } else {
      logger.error('Failed to save batch state:', error);
    }
  }
}

/**
 * Load batch state from localStorage
 */
export function loadBatchState(): BatchState | null {
  try {
    const stored = localStorage.getItem(BATCH_STATE_KEY);
    if (!stored) {
      logger.info('No saved batch state found');
      return null;
    }

    const state: BatchState = JSON.parse(stored);

    // Check version compatibility
    if (state.version !== STATE_VERSION) {
      logger.warn('Batch state version mismatch, clearing');
      clearBatchState();
      return null;
    }

    // Check if state is too old (> 24 hours)
    const now = Date.now();
    const age = now - state.timestamp;
    const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

    if (age > MAX_AGE) {
      logger.warn('Batch state too old, clearing');
      clearBatchState();
      return null;
    }

    logger.info('Batch state loaded', {
      imageCount: state.images.length,
      isProcessing: state.isProcessing,
      age: Math.round(age / 1000 / 60) + ' minutes',
    });

    return state;
  } catch (error) {
    logger.error('Failed to load batch state:', error);
    clearBatchState();
    return null;
  }
}

/**
 * Clear batch state from localStorage
 */
export function clearBatchState(): void {
  try {
    localStorage.removeItem(BATCH_STATE_KEY);
    logger.info('Batch state cleared');
  } catch (error) {
    logger.error('Failed to clear batch state:', error);
  }
}

/**
 * Check if there's a saved batch state
 */
export function hasBatchState(): boolean {
  return !!localStorage.getItem(BATCH_STATE_KEY);
}

/**
 * Update a specific image in batch state
 */
export async function updateBatchImage(
  imageId: string, 
  updates: Partial<BatchImageState>
): Promise<void> {
  const state = loadBatchState();
  if (!state) return;

  const imageIndex = state.images.findIndex(img => img.id === imageId);
  if (imageIndex === -1) return;

  state.images[imageIndex] = {
    ...state.images[imageIndex],
    ...updates,
  };

  await saveBatchState(state);
}

