/**
 * useTurntableVideo Hook
 *
 * Manages 360° turntable video generation
 * Creates smooth rotation videos for product showcase
 *
 * Features:
 * - Smooth 360-degree rotation
 * - Product centered and close-up
 * - No frame cropping
 * - Natural fluid motion
 * - Loop-ready seamless video
 *
 * @returns {object} Turntable video state and functions
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('hooks:turntable-video');

interface TurntableVideoParams {
  image_url: string;
}

interface TurntableVideoResult {
  url: string;
  content_type?: string;
}

interface TurntableVideoResponse {
  success: boolean;
  video: TurntableVideoResult;
  credits_remaining: number;
}

export function useTurntableVideo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate 360° turntable video
   */
  const generateVideo = useCallback(async (params: TurntableVideoParams) => {
    logger.info('[useTurntableVideo] Starting generation:', params);
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/ai/turntable-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: params.image_url,
        }),
      });

      const data: TurntableVideoResponse = await response.json();

      if (!response.ok) {
        const errorMessage =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (data as any).error ||
          `HTTP ${response.status}: ${response.statusText}`;
        logger.error('[useTurntableVideo] API error:', errorMessage);
        throw new Error(errorMessage);
      }

      if (!data.success || !data.video?.url) {
        logger.error('[useTurntableVideo] Invalid response:', data);
        throw new Error('Invalid response from turntable video API');
      }

      logger.info(
        '[useTurntableVideo] Generated successfully:',
        data.video.url
      );
      setVideoUrl(data.video.url);

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('[useTurntableVideo] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Reset state
   */
  const resetVideo = useCallback(() => {
    logger.info('[useTurntableVideo] Resetting state');
    setIsGenerating(false);
    setVideoUrl(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    videoUrl,
    error,
    generateVideo,
    resetVideo,
  };
}
