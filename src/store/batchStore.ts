/**
 * Batch Processing Store
 * Global state for batch processing that persists across page navigation
 * Each user has their own batch state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Image status in batch processing
export type BatchImageStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Single image in batch
export interface BatchImageItem {
  id: string;
  localId: string; // Client-side ID for matching
  filename: string;
  originalUrl: string | null;
  resultUrl: string | null;
  thumbnailUrl: string | null; // Small preview for quick display
  status: BatchImageStatus;
  error?: string;
  progress: number; // 0-100
}

// Batch processing state
export type BatchProcessingState = 'idle' | 'processing' | 'paused' | 'completed' | 'cancelled';

// File naming format options
export interface FileNamingFormat {
  pattern: 'original_number' | 'number_original' | 'custom';
  prefix?: string;
  suffix?: string;
  separator: '_' | '-' | '.';
  startNumber: number;
}

// Active batch project
export interface ActiveBatch {
  projectId: string;
  name: string;
  totalImages: number;
  completedImages: number;
  failedImages: number;
  processingImages: number;
  images: BatchImageItem[];
  startedAt: number;
  aspectRatio: string;
  presetName?: string;
  // New fields
  state: BatchProcessingState;
  pausedAt?: number;
  fileNamingFormat?: FileNamingFormat;
  jewelryType?: string;
  gender?: string;
}

interface BatchStore {
  // Active batches (one per user typically)
  activeBatches: ActiveBatch[];
  
  // Currently viewing batch (for UI focus)
  currentBatchId: string | null;
  
  // Global polling state
  isPolling: boolean;
  lastPollTime: number | null;
  
  // Actions
  addBatch: (batch: Omit<ActiveBatch, 'completedImages' | 'failedImages' | 'processingImages' | 'state'>) => void;
  updateBatch: (projectId: string, updates: Partial<ActiveBatch>) => void;
  updateBatchImage: (projectId: string, imageId: string, updates: Partial<BatchImageItem>) => void;
  updateBatchImages: (projectId: string, images: BatchImageItem[]) => void;
  removeBatch: (projectId: string) => void;
  setCurrentBatch: (projectId: string | null) => void;
  setPolling: (isPolling: boolean) => void;
  getBatch: (projectId: string) => ActiveBatch | undefined;
  getActiveBatchCount: () => number;
  hasProcessingBatches: () => boolean;
  clearCompletedBatches: () => void;
  // New actions
  pauseBatch: (projectId: string) => void;
  resumeBatch: (projectId: string) => void;
  cancelBatch: (projectId: string) => void;
  clearAllBatches: () => void;
}

export const useBatchStore = create<BatchStore>()(
  persist(
    (set, get) => ({
      activeBatches: [],
      currentBatchId: null,
      isPolling: false,
      lastPollTime: null,

      addBatch: (batch) => {
        set((state) => ({
          activeBatches: [
            ...state.activeBatches.filter(b => b.projectId !== batch.projectId),
            {
              ...batch,
              completedImages: 0,
              failedImages: 0,
              processingImages: 0,
              state: 'processing' as BatchProcessingState,
            },
          ],
          currentBatchId: batch.projectId,
        }));
      },

      updateBatch: (projectId, updates) => {
        set((state) => ({
          activeBatches: state.activeBatches.map((batch) =>
            batch.projectId === projectId
              ? { ...batch, ...updates }
              : batch
          ),
        }));
      },

      updateBatchImage: (projectId, imageId, updates) => {
        set((state) => ({
          activeBatches: state.activeBatches.map((batch) => {
            if (batch.projectId !== projectId) return batch;
            
            const updatedImages = batch.images.map((img) =>
              img.id === imageId || img.localId === imageId
                ? { ...img, ...updates }
                : img
            );
            
            // Recalculate counts
            const completedImages = updatedImages.filter(i => i.status === 'completed').length;
            const failedImages = updatedImages.filter(i => i.status === 'failed').length;
            const processingImages = updatedImages.filter(i => i.status === 'processing').length;
            
            return {
              ...batch,
              images: updatedImages,
              completedImages,
              failedImages,
              processingImages,
            };
          }),
        }));
      },

      updateBatchImages: (projectId, images) => {
        set((state) => ({
          activeBatches: state.activeBatches.map((batch) => {
            if (batch.projectId !== projectId) return batch;
            
            // Merge new images with existing ones
            const mergedImages = batch.images.map((existingImg) => {
              const newImg = images.find(
                i => i.id === existingImg.id || i.localId === existingImg.localId
              );
              return newImg ? { ...existingImg, ...newImg } : existingImg;
            });
            
            // Recalculate counts
            const completedImages = mergedImages.filter(i => i.status === 'completed').length;
            const failedImages = mergedImages.filter(i => i.status === 'failed').length;
            const processingImages = mergedImages.filter(i => i.status === 'processing').length;
            
            return {
              ...batch,
              images: mergedImages,
              completedImages,
              failedImages,
              processingImages,
            };
          }),
        }));
      },

      removeBatch: (projectId) => {
        set((state) => ({
          activeBatches: state.activeBatches.filter(b => b.projectId !== projectId),
          currentBatchId: state.currentBatchId === projectId ? null : state.currentBatchId,
        }));
      },

      setCurrentBatch: (projectId) => {
        set({ currentBatchId: projectId });
      },

      setPolling: (isPolling) => {
        set({ isPolling, lastPollTime: isPolling ? Date.now() : null });
      },

      getBatch: (projectId) => {
        return get().activeBatches.find(b => b.projectId === projectId);
      },

      getActiveBatchCount: () => {
        return get().activeBatches.filter(b => 
          b.completedImages + b.failedImages < b.totalImages
        ).length;
      },

      hasProcessingBatches: () => {
        return get().activeBatches.some(b => 
          b.completedImages + b.failedImages < b.totalImages
        );
      },

      clearCompletedBatches: () => {
        set((state) => ({
          activeBatches: state.activeBatches.filter(b => 
            b.completedImages + b.failedImages < b.totalImages
          ),
        }));
      },

      pauseBatch: (projectId) => {
        set((state) => ({
          activeBatches: state.activeBatches.map((batch) =>
            batch.projectId === projectId
              ? { ...batch, state: 'paused' as BatchProcessingState, pausedAt: Date.now() }
              : batch
          ),
        }));
      },

      resumeBatch: (projectId) => {
        set((state) => ({
          activeBatches: state.activeBatches.map((batch) =>
            batch.projectId === projectId
              ? { ...batch, state: 'processing' as BatchProcessingState, pausedAt: undefined }
              : batch
          ),
        }));
      },

      cancelBatch: (projectId) => {
        set((state) => ({
          activeBatches: state.activeBatches.map((batch) =>
            batch.projectId === projectId
              ? { ...batch, state: 'cancelled' as BatchProcessingState }
              : batch
          ),
        }));
      },

      clearAllBatches: () => {
        set({ activeBatches: [], currentBatchId: null });
      },
    }),
    {
      name: 'jewelshot-batch-store',
      partialize: (state) => ({
        activeBatches: state.activeBatches,
        currentBatchId: state.currentBatchId,
      }),
    }
  )
);
