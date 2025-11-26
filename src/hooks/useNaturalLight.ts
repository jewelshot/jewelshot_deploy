/**
 * useNaturalLight Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Manages natural light and reflections enhancement
 * Adds realistic, subtle lighting to jewelry images
 * NOW USES: Atomic credit system + queue
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

const logger = createScopedLogger('hooks:natural-light');

interface NaturalLightParams {
  image_url: string;
}

export function useNaturalLight() {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { submitAndWait } = useAIQueue();

  const enhanceLight = useCallback(async (params: NaturalLightParams) => {
    logger.info('[useNaturalLight] Starting enhancement (via queue):', params);
    setIsEnhancing(true);
    setError(null);
    setEnhancedImageUrl(null);

    try {
      const result = await submitAndWait({
        operation: 'natural-light',
        params: { image_url: params.image_url },
        priority: 'urgent',
      });

      if (!result?.data?.imageUrl) {
        throw new Error('No image returned from queue');
      }

      logger.info('[useNaturalLight] Enhanced successfully (via queue)');
      setEnhancedImageUrl(result.data.imageUrl);
      
      return { success: true, image: { url: result.data.imageUrl } };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('[useNaturalLight] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsEnhancing(false);
    }
  }, [submitAndWait]);

  const resetEnhancement = useCallback(() => {
    logger.info('[useNaturalLight] Resetting state');
    setIsEnhancing(false);
    setEnhancedImageUrl(null);
    setError(null);
  }, []);

  return {
    isEnhancing,
    enhancedImageUrl,
    error,
    enhanceLight,
    resetEnhancement,
  };
}
