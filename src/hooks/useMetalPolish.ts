/**
 * useMetalPolish Hook
 *
 * Manages metal polishing state and API calls
 * Enhances metal surfaces with mirror-like reflections and high luster
 *
 * Features:
 * - Mirror-finish surface quality
 * - Realistic reflections
 * - Professional polish appearance
 * - High luster and brilliance
 *
 * @returns {object} Metal polish state and functions
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('hooks:metal-polish');

interface MetalPolishParams {
  image_url: string;
}

interface MetalPolishResult {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
}

interface MetalPolishResponse {
  success: boolean;
  image: MetalPolishResult;
  credits_remaining: number;
}

export function useMetalPolish() {
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedImageUrl, setPolishedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Polish metal surfaces in the image
   */
  const polishMetal = useCallback(async (params: MetalPolishParams) => {
    logger.info('[useMetalPolish] Starting metal polish:', params);
    setIsPolishing(true);
    setError(null);
    setPolishedImageUrl(null);

    try {
      const response = await fetch('/api/ai/metal-polish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: params.image_url,
        }),
      });

      const data: MetalPolishResponse = await response.json();

      if (!response.ok) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).error ||
          `HTTP ${response.status}: ${response.statusText}`;
        logger.error('[useMetalPolish] API error:', errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.success || !data.image?.url) {
        logger.error('[useMetalPolish] Invalid response:', data);
        throw new Error('Invalid response from metal polish API');
      }

      logger.info(
        '[useMetalPolish] Metal polished successfully:',
        data.image.url
      );
      setPolishedImageUrl(data.image.url);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('[useMetalPolish] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsPolishing(false);
    }
  }, []);

  /**
   * Reset polish state
   */
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
