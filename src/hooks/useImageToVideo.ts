/**
 * useImageToVideo Hook
 *
 * Handles image-to-video conversion using Fal.ai Veo 3.1
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

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

  const generateVideo = useCallback(async (input: VideoGenerationInput) => {
    setIsGenerating(true);
    setProgress('Preparing video generation...');
    setError(null);
    setVideoUrl(null);

    try {
      logger.info('Starting video generation', input);

      setProgress('Uploading image...');

      const response = await fetch('/api/ai/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: input.image_url,
          prompt:
            input.prompt ||
            'Smooth camera movement, natural motion, cinematic lighting, professional jewelry showcase',
          duration: input.duration || '8s',
          resolution: input.resolution || '720p',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || errorData.error || 'Video generation failed'
        );
      }

      setProgress('Generating video... This may take a few minutes.');

      const result = await response.json();

      if (result.success && result.video?.url) {
        setVideoUrl(result.video.url);
        setProgress('Video generated successfully!');
        logger.info('Video generation completed', result);
      } else {
        throw new Error('Invalid response from video generation API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Video generation failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsGenerating(false);
    }
  }, []);

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
