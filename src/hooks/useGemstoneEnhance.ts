/**
 * useGemstoneEnhance Hook
 *
 * Handles gemstone quality enhancement using Fal.ai Nano-Banana
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('useGemstoneEnhance');

export interface GemstoneEnhanceInput {
  image_url: string;
}

export interface EnhancedImageOutput {
  url: string;
  content_type?: string;
  width?: number;
  height?: number;
  file_size?: number;
}

interface UseGemstoneEnhanceResult {
  enhanceGemstones: (input: GemstoneEnhanceInput) => Promise<void>;
  isEnhancing: boolean;
  progress: string;
  enhancedImageUrl: string | null;
  error: string | null;
  reset: () => void;
}

export function useGemstoneEnhance(): UseGemstoneEnhanceResult {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [progress, setProgress] = useState('');
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enhanceGemstones = useCallback(async (input: GemstoneEnhanceInput) => {
    setIsEnhancing(true);
    setProgress('Preparing gemstone enhancement...');
    setError(null);
    setEnhancedImageUrl(null);

    try {
      logger.info('Starting gemstone enhancement', input);

      setProgress('Analyzing gemstones...');

      const response = await fetch('/api/ai/gemstone-enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: input.image_url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `Server error: ${response.status} ${response.statusText}`;
        logger.error('Gemstone enhance API error:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
        });

        throw new Error(errorMessage);
      }

      setProgress('Enhancing gemstone clarity and brilliance...');

      const result = await response.json();
      logger.info('Gemstone enhance API response:', result);

      if (result.success && result.image?.url) {
        setEnhancedImageUrl(result.image.url);
        setProgress('Gemstones enhanced successfully!');
        logger.info('Gemstone enhancement completed', {
          imageUrl: result.image.url,
          width: result.image.width,
          height: result.image.height,
          requestId: result.requestId,
        });
      } else {
        logger.error('Invalid gemstone enhance response:', result);
        throw new Error('Invalid response from gemstone enhance API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Gemstone enhancement failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsEnhancing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsEnhancing(false);
    setProgress('');
    setEnhancedImageUrl(null);
    setError(null);
  }, []);

  return {
    enhanceGemstones,
    isEnhancing,
    progress,
    enhancedImageUrl,
    error,
    reset,
  };
}
