/**
 * useImageToVideo Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Handles image-to-video conversion using Fal.ai Veo 2
 * NOW USES: Atomic credit system + queue
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

const logger = createScopedLogger('useImageToVideo');

export interface VideoGenerationInput {
  image_url: string;
  prompt?: string;
  duration?: '8s';
  resolution?: '720p' | '1080p';
}

export interface VideoOutput {
  url: string;
  content_type?: string;
  file_name?: string;
  file_size?: number;
}

interface UseImageToVideoResult {
  generateVideo: (input: VideoGenerationInput) => Promise<void>;
  isGenerating: boolean;
  progress: string;
  videoUrl: string | null;
  error: string | null;
  reset: () => void;
}

export function useImageToVideo(): UseImageToVideoResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { submitAndWait } = useAIQueue();

  const generateVideo = useCallback(async (input: VideoGenerationInput) => {
    setIsGenerating(true);
    setProgress('Preparing video generation...');
    setError(null);
    setVideoUrl(null);

    try {
      logger.info('Starting video generation (via queue)', input);

      const result = await submitAndWait({
        operation: 'video',
        params: {
          image_url: input.image_url,
          prompt: input.prompt || 'Hand gently rotating ring, showcasing from different angles with natural movements.',
          duration: input.duration || '8s',
          resolution: input.resolution || '720p',
        },
        priority: 'normal', // Video is slower, use normal queue
      }, {
        onProgress: (status) => {
          if (status.state === 'waiting') setProgress('Waiting in queue...');
          else if (status.state === 'active') setProgress('Generating video... This may take 1-2 minutes.');
        },
      });

      if (!result?.data?.videoUrl) {
        throw new Error('No video returned from queue');
      }

      setVideoUrl(result.data.videoUrl);
      setProgress('Video generated successfully!');
      logger.info('Video generation completed (via queue)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Video generation failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  }, [submitAndWait]);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress('');
    setVideoUrl(null);
    setError(null);
  }, []);

  return {
    generateVideo,
    isGenerating,
    progress,
    videoUrl,
    error,
    reset,
  };
}
