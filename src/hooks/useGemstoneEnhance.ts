/**
 * useGemstoneEnhance Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Handles gemstone quality enhancement using Fal.ai Nano-Banana
 * NOW USES: Atomic credit system + queue
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

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
  
  const { submitAndWait } = useAIQueue();

  const enhanceGemstones = useCallback(async (input: GemstoneEnhanceInput) => {
    setIsEnhancing(true);
    setProgress('Preparing gemstone enhancement...');
    setError(null);
    setEnhancedImageUrl(null);

    try {
      logger.info('Starting gemstone enhancement (via queue)', input);

      const result = await submitAndWait({
        operation: 'gemstone',
        params: { image_url: input.image_url },
        priority: 'urgent',
      }, {
        onProgress: (status) => {
          if (status.state === 'waiting') setProgress('Waiting in queue...');
          else if (status.state === 'active') setProgress('Enhancing gemstone clarity and brilliance...');
        },
      });

      if (!result?.data?.imageUrl) {
        throw new Error('No image returned from queue');
      }

      setEnhancedImageUrl(result.data.imageUrl);
      setProgress('Gemstones enhanced successfully!');
      logger.info('Gemstone enhancement completed (via queue)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Gemstone enhancement failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsEnhancing(false);
    }
  }, [submitAndWait]);

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
