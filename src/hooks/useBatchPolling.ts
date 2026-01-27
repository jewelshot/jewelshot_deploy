/**
 * useBatchPolling Hook
 * Handles background polling for batch processing status
 * Continues polling even when user navigates away from batch page
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useBatchStore, type BatchImageItem } from '@/store/batchStore';
import { createScopedLogger } from '@/lib/logger';
import { toast } from 'sonner';

const logger = createScopedLogger('BatchPolling');

// Polling interval in milliseconds
const POLL_INTERVAL = 3000;

// Maximum polling time (30 minutes)
const MAX_POLL_TIME = 30 * 60 * 1000;

interface UseBatchPollingOptions {
  onComplete?: (projectId: string, completedCount: number, failedCount: number) => void;
  onImageComplete?: (projectId: string, image: BatchImageItem) => void;
  showToasts?: boolean;
}

export function useBatchPolling(options: UseBatchPollingOptions = {}) {
  const { 
    onComplete, 
    onImageComplete,
    showToasts = true 
  } = options;
  
  const {
    activeBatches,
    updateBatch,
    updateBatchImages,
    removeBatch,
    setPolling,
    hasProcessingBatches,
  } = useBatchStore();
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const previousImagesRef = useRef<Map<string, Map<string, BatchImageItem>>>(new Map());

  // Poll a single batch project
  const pollBatch = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/batch/${projectId}/process-next`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        logger.error('Poll failed for batch:', projectId);
        return false; // Continue polling
      }

      const data = await response.json();
      
      // Update progress
      if (data.progress) {
        const { total, completed, failed, processing } = data.progress;
        updateBatch(projectId, {
          totalImages: total,
          completedImages: completed,
          failedImages: failed,
          processingImages: processing,
        });
      }

      // Update images with results
      if (data.images && Array.isArray(data.images)) {
        const updatedImages: BatchImageItem[] = data.images.map((apiImg: {
          id: string;
          filename: string;
          status: string;
          resultUrl?: string;
          originalUrl?: string;
          error?: string;
        }) => ({
          id: apiImg.id,
          localId: apiImg.id,
          filename: apiImg.filename,
          originalUrl: apiImg.originalUrl || null,
          resultUrl: apiImg.resultUrl || null,
          thumbnailUrl: apiImg.resultUrl || null, // Use result as thumbnail
          status: apiImg.status as BatchImageItem['status'],
          error: apiImg.error,
          progress: apiImg.status === 'completed' ? 100 : 
                   apiImg.status === 'processing' ? 50 : 0,
        }));

        // Check for newly completed images
        const previousImages = previousImagesRef.current.get(projectId) || new Map();
        updatedImages.forEach(img => {
          const prevImg = previousImages.get(img.id);
          if (img.status === 'completed' && prevImg?.status !== 'completed') {
            // Image just completed!
            onImageComplete?.(projectId, img);
            if (showToasts) {
              toast.success(`Image completed: ${img.filename}`, {
                description: 'Click to view result',
                duration: 3000,
              });
            }
          }
        });

        // Store current state for next comparison
        const newPreviousMap = new Map<string, BatchImageItem>();
        updatedImages.forEach(img => newPreviousMap.set(img.id, img));
        previousImagesRef.current.set(projectId, newPreviousMap);

        updateBatchImages(projectId, updatedImages);
      }

      // Check if batch is done
      if (data.done) {
        const completedCount = data.progress?.completed || 0;
        const failedCount = data.progress?.failed || 0;
        
        onComplete?.(projectId, completedCount, failedCount);
        
        if (showToasts) {
          if (failedCount > 0) {
            toast.success(`Batch completed! ${completedCount} successful, ${failedCount} failed`);
          } else {
            toast.success(`Batch completed! All ${completedCount} images processed`);
          }
        }
        
        return true; // Done
      }

      return false; // Continue polling
    } catch (error) {
      logger.error('Polling error:', error);
      return false; // Continue polling on error
    }
  }, [updateBatch, updateBatchImages, onComplete, onImageComplete, showToasts]);

  // Main polling loop
  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) return; // Already polling
    
    startTimeRef.current = Date.now();
    setPolling(true);
    
    logger.debug('Starting batch polling...');

    pollIntervalRef.current = setInterval(async () => {
      // Check timeout
      if (startTimeRef.current && Date.now() - startTimeRef.current > MAX_POLL_TIME) {
        logger.warn('Polling timeout reached, stopping...');
        stopPolling();
        return;
      }

      // Get active batches (those still processing)
      const { activeBatches } = useBatchStore.getState();
      const processingBatches = activeBatches.filter(b => 
        b.completedImages + b.failedImages < b.totalImages
      );

      if (processingBatches.length === 0) {
        logger.debug('No processing batches, stopping polling');
        stopPolling();
        return;
      }

      // Poll each active batch
      const results = await Promise.all(
        processingBatches.map(batch => pollBatch(batch.projectId))
      );

      // Remove completed batches from active list (optional - keep for history)
      // results.forEach((done, index) => {
      //   if (done) removeBatch(processingBatches[index].projectId);
      // });
    }, POLL_INTERVAL);
  }, [pollBatch, setPolling]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setPolling(false);
    startTimeRef.current = null;
    logger.debug('Batch polling stopped');
  }, [setPolling]);

  // Auto-start polling if there are processing batches
  useEffect(() => {
    if (hasProcessingBatches() && !pollIntervalRef.current) {
      startPolling();
    }
    
    return () => {
      // Don't stop polling on unmount - let it continue in background
      // Only stop if there are no more processing batches
    };
  }, [hasProcessingBatches, startPolling]);

  // Handle visibility change - resume polling when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (hasProcessingBatches() && !pollIntervalRef.current) {
          logger.debug('Tab became visible, resuming polling');
          startPolling();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasProcessingBatches, startPolling]);

  return {
    startPolling,
    stopPolling,
    isPolling: pollIntervalRef.current !== null,
  };
}
