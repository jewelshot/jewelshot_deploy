/**
 * useNaturalLight Hook
 *
 * Manages natural light and reflections enhancement
 * Adds realistic, subtle lighting to jewelry images
 *
 * Features:
 * - Soft natural light (not artificial)
 * - Realistic gemstone sparkle
 * - Authentic surface reflections
 * - Ground reflections on dark backgrounds
 * - Physics-accurate behavior
 *
 * @returns {object} Natural light state and functions
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('hooks:natural-light');

interface NaturalLightParams {
  image_url: string;
}

interface NaturalLightResult {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
}

interface NaturalLightResponse {
  success: boolean;
  image: NaturalLightResult;
  credits_remaining: number;
}

export function useNaturalLight() {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Enhance image with natural light and reflections
   */
  const enhanceLight = useCallback(async (params: NaturalLightParams) => {
    logger.info('[useNaturalLight] Starting enhancement:', params);
    setIsEnhancing(true);
    setError(null);
    setEnhancedImageUrl(null);

    try {
      const response = await fetch('/api/ai/natural-light', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: params.image_url,
        }),
      });

      const data: NaturalLightResponse = await response.json();

      if (!response.ok) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).error ||
          `HTTP ${response.status}: ${response.statusText}`;
        logger.error('[useNaturalLight] API error:', errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.success || !data.image?.url) {
        logger.error('[useNaturalLight] Invalid response:', data);
        throw new Error('Invalid response from natural light API');
      }

      logger.info('[useNaturalLight] Enhanced successfully:', data.image.url);
      setEnhancedImageUrl(data.image.url);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('[useNaturalLight] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsEnhancing(false);
    }
  }, []);

  /**
   * Reset state
   */
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
