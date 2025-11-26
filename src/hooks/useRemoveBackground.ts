/**
 * useRemoveBackground Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Handles background removal using Fal.ai rembg
 * NOW USES: Atomic credit system + queue
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

const logger = createScopedLogger('useRemoveBackground');

export interface RemoveBackgroundInput {
  image_url: string;
  crop_to_bbox?: boolean;
}

export interface ProcessedImageOutput {
  url: string;
  content_type?: string;
  width?: number;
  height?: number;
  file_size?: number;
}

interface UseRemoveBackgroundResult {
  removeBackground: (input: RemoveBackgroundInput) => Promise<void>;
  isProcessing: boolean;
  progress: string;
  processedImageUrl: string | null;
  error: string | null;
  reset: () => void;
}

export function useRemoveBackground(): UseRemoveBackgroundResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { submitAndWait } = useAIQueue();

  const removeBackground = useCallback(async (input: RemoveBackgroundInput) => {
    setIsProcessing(true);
    setProgress('Preparing background removal...');
    setError(null);
    setProcessedImageUrl(null);

    try {
      logger.info('Starting background removal (via queue)', input);

      const result = await submitAndWait({
        operation: 'remove-bg',
        params: {
          image_url: input.image_url,
          crop_to_bbox: input.crop_to_bbox || false,
        },
        priority: 'urgent',
      }, {
        onProgress: (status) => {
          if (status.state === 'waiting') setProgress('Waiting in queue...');
          else if (status.state === 'active') setProgress('Removing background... This may take a few moments.');
        },
      });

      if (!result?.data?.imageUrl) {
        throw new Error('No image returned from queue');
      }

      setProcessedImageUrl(result.data.imageUrl);
      setProgress('Background removed successfully!');
      logger.info('Background removal completed (via queue)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Background removal failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsProcessing(false);
    }
  }, [submitAndWait]);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress('');
    setProcessedImageUrl(null);
    setError(null);
  }, []);

  return {
    removeBackground,
    isProcessing,
    progress,
    processedImageUrl,
    error,
    reset,
  };
}
