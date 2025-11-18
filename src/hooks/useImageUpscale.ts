/**
 * useImageUpscale Hook
 *
 * Handles image upscaling using Fal.ai SeedVR2
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

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

  const upscaleImage = useCallback(async (input: UpscaleInput) => {
    setIsUpscaling(true);
    setProgress('Preparing upscale...');
    setError(null);
    setUpscaledImageUrl(null);

    try {
      logger.info('Starting image upscale', input);

      setProgress('Uploading image...');

      const response = await fetch('/api/ai/upscale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: input.image_url,
          upscale_mode: input.upscale_mode || 'factor',
          upscale_factor: input.upscale_factor || 2,
          target_resolution: input.target_resolution || '1080p',
          output_format: input.output_format || 'jpg',
          noise_scale: input.noise_scale || 0.1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `Server error: ${response.status} ${response.statusText}`;
        logger.error('Upscale API error - DETAILED:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          debug: errorData.debug,
          fullResponse: JSON.stringify(errorData),
        });

        // Log the full error for debugging
        console.error('[useImageUpscale] Full error response:', errorData);

        throw new Error(errorMessage);
      }

      setProgress('Upscaling image... This may take a few moments.');

      const result = await response.json();
      logger.info('Upscale API response:', result);

      if (result.success && result.image?.url) {
        setUpscaledImageUrl(result.image.url);
        setProgress('Image upscaled successfully!');
        logger.info('Image upscale completed successfully', {
          imageUrl: result.image.url,
          width: result.image.width,
          height: result.image.height,
          seed: result.seed,
          requestId: result.requestId,
        });
      } else {
        logger.error('Invalid upscale response:', result);
        throw new Error('Invalid response from upscale API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Image upscale failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsUpscaling(false);
    }
  }, []);

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
