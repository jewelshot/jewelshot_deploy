/**
 * useImageToVideo Hook
 *
 * Handles image-to-video conversion using Fal.ai Veo 2
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('useImageToVideo');

export interface VideoGenerationInput {
  image_url: string;
  prompt?: string;
  duration?: '5s' | '6s' | '7s' | '8s';
  aspect_ratio?: 'auto' | 'auto_prefer_portrait' | '16:9' | '9:16';
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
            'Elegant hand gently rotating and showcasing the ring with natural movements. Soft turns left and right to display the jewelry from different angles. Graceful gestures, natural lighting, cinematic quality.',
          duration: input.duration || '8s',
          aspect_ratio: input.aspect_ratio || 'auto', // auto adapts to image aspect ratio
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `Server error: ${response.status} ${response.statusText}`;
        logger.error('Video generation API error - DETAILED:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          debug: errorData.debug,
          fullResponse: JSON.stringify(errorData),
        });

        // Log the full error for debugging
        console.error('[useImageToVideo] Full error response:', errorData);

        throw new Error(errorMessage);
      }

      setProgress('Generating video... This may take a few minutes.');

      const result = await response.json();
      logger.info('Video generation API response:', result);

      if (result.success && result.video?.url) {
        setVideoUrl(result.video.url);
        setProgress('Video generated successfully!');
        logger.info('Video generation completed successfully', {
          videoUrl: result.video.url,
          requestId: result.requestId,
        });
      } else {
        logger.error('Invalid video generation response:', result);
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
