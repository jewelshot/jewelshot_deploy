/**
 * useRemoveBackground Hook
 *
 * Handles background removal using Fal.ai rembg
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

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
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const removeBackground = useCallback(async (input: RemoveBackgroundInput) => {
    setIsProcessing(true);
    setProgress('Preparing background removal...');
    setError(null);
    setProcessedImageUrl(null);

    try {
      logger.info('Starting background removal', input);

      setProgress('Uploading image...');

      const response = await fetch('/api/ai/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: input.image_url,
          crop_to_bbox: input.crop_to_bbox || false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `Server error: ${response.status} ${response.statusText}`;
        logger.error('Remove background API error - DETAILED:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          debug: errorData.debug,
          fullResponse: JSON.stringify(errorData),
        });

        // Log the full error for debugging
        console.error('[useRemoveBackground] Full error response:', errorData);

        throw new Error(errorMessage);
      }

      setProgress('Removing background... This may take a few moments.');

      const result = await response.json();
      logger.info('Remove background API response:', result);

      if (result.success && result.image?.url) {
        setProcessedImageUrl(result.image.url);
        setProgress('Background removed successfully!');
        logger.info('Background removal completed successfully', {
          imageUrl: result.image.url,
          width: result.image.width,
          height: result.image.height,
          requestId: result.requestId,
        });
      } else {
        logger.error('Invalid remove background response:', result);
        throw new Error('Invalid response from background removal API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Background removal failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsProcessing(false);
    }
  }, []);

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
