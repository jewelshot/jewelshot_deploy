/**
 * useImageUpscale Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Handles image upscaling using Fal.ai SeedVR2
 * NOW USES: Atomic credit system + queue
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

const logger = createScopedLogger('useImageUpscale');

export interface UpscaleInput {
  image_url: string;
  upscale_mode?: 'factor' | 'target';
  upscale_factor?: number;
  target_resolution?: '720p' | '1080p' | '1440p' | '2160p';
  output_format?: 'png' | 'jpg' | 'webp';
  noise_scale?: number;
}

export interface UpscaledImageOutput {
  url: string;
  content_type?: string;
  width?: number;
  height?: number;
  file_size?: number;
}

interface UseImageUpscaleResult {
  upscaleImage: (input: UpscaleInput) => Promise<void>;
  isUpscaling: boolean;
  progress: string;
  upscaledImageUrl: string | null;
  error: string | null;
  reset: () => void;
}

export function useImageUpscale(): UseImageUpscaleResult {
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [progress, setProgress] = useState('');
  const [upscaledImageUrl, setUpscaledImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: Use queue system
  const { submitAndWait } = useAIQueue();

  const upscaleImage = useCallback(async (input: UpscaleInput) => {
    setIsUpscaling(true);
    setProgress('Preparing upscale...');
    setError(null);
    setUpscaledImageUrl(null);

    try {
      logger.info('Starting image upscale (via queue)', input);

      setProgress('Submitting to queue...');

      // NEW: Use queue system instead of direct API call
      const result = await submitAndWait({
        operation: 'upscale',
        params: {
          image_url: input.image_url,
          upscale_mode: input.upscale_mode || 'target',
          upscale_factor: input.upscale_factor,
          target_resolution: input.target_resolution || '2160p',
          output_format: input.output_format || 'jpg',
          noise_scale: input.noise_scale || 0.1,
        },
        priority: 'urgent',
      }, {
        onProgress: (status) => {
          if (status.state === 'waiting') {
            setProgress('Waiting in queue...');
          } else if (status.state === 'active') {
            setProgress('Upscaling image... This may take a few moments.');
          }
        },
      });

      if (!result?.data?.imageUrl) {
        throw new Error('No image returned from queue');
      }

      setUpscaledImageUrl(result.data.imageUrl);
      setProgress('Image upscaled successfully!');
      logger.info('Image upscale completed successfully (via queue)', {
        imageUrl: result.data.imageUrl,
        width: result.data.width,
        height: result.data.height,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Image upscale failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsUpscaling(false);
    }
  }, [submitAndWait]);

  const reset = useCallback(() => {
    setIsUpscaling(false);
    setProgress('');
    setUpscaledImageUrl(null);
    setError(null);
  }, []);

  return {
    upscaleImage,
    isUpscaling,
    progress,
    upscaledImageUrl,
    error,
    reset,
  };
}
