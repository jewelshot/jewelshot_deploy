/**
 * useMetalPolish Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Manages metal polishing state and API calls
 * Enhances metal surfaces with mirror-like reflections and high luster
 * NOW USES: Atomic credit system + queue
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

const logger = createScopedLogger('hooks:metal-polish');

interface MetalPolishParams {
  image_url: string;
}

export function useMetalPolish() {
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedImageUrl, setPolishedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { submitAndWait } = useAIQueue();

  const polishMetal = useCallback(async (params: MetalPolishParams) => {
    logger.info('[useMetalPolish] Starting metal polish (via queue):', params);
    setIsPolishing(true);
    setError(null);
    setPolishedImageUrl(null);

    try {
      const result = await submitAndWait({
        operation: 'metal-polish',
        params: { image_url: params.image_url },
        priority: 'urgent',
      });

      if (!result?.data?.imageUrl) {
        throw new Error('No image returned from queue');
      }

      logger.info('[useMetalPolish] Metal polished successfully (via queue)');
      setPolishedImageUrl(result.data.imageUrl);
      
      return { success: true, image: { url: result.data.imageUrl } };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('[useMetalPolish] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsPolishing(false);
    }
  }, [submitAndWait]);

  const resetPolish = useCallback(() => {
    logger.info('[useMetalPolish] Resetting state');
    setIsPolishing(false);
    setPolishedImageUrl(null);
    setError(null);
  }, []);

  return {
    isPolishing,
    polishedImageUrl,
    error,
    polishMetal,
    resetPolish,
  };
}
