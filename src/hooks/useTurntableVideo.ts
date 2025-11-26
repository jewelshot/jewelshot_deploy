/**
 * useTurntableVideo Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Manages 360° turntable video generation
 * Creates smooth rotation videos for product showcase
 * NOW USES: Atomic credit system + queue
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

const logger = createScopedLogger('hooks:turntable-video');

interface TurntableVideoParams {
  image_url: string;
}

export function useTurntableVideo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { submitAndWait } = useAIQueue();

  const generateVideo = useCallback(async (params: TurntableVideoParams) => {
    logger.info('[useTurntableVideo] Starting generation (via queue):', params);
    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const result = await submitAndWait({
        operation: 'turntable',
        params: { image_url: params.image_url },
        priority: 'normal', // Video is slower, use normal queue
      });

      if (!result?.data?.videoUrl) {
        throw new Error('No video returned from queue');
      }

      logger.info('[useTurntableVideo] Generated successfully (via queue)');
      setVideoUrl(result.data.videoUrl);
      
      return { success: true, video: { url: result.data.videoUrl } };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('[useTurntableVideo] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [submitAndWait]);

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
