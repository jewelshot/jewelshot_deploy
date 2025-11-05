/**
 * ============================================================================
 * USE IMAGE EDIT HOOK - CLEAN IMPLEMENTATION
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import { editImage, type EditInput, type FalOutput } from '@/lib/ai/fal-client';
import { aiRateLimiter } from '@/lib/rate-limiter';
import { proxyImageToSupabase } from '@/lib/image-proxy';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('useImageEdit');

interface UseImageEditOptions {
  onSuccess?: (result: FalOutput) => void;
  onError?: (error: Error) => void;
}

export function useImageEdit(options?: UseImageEditOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<FalOutput | null>(null);

  const edit = useCallback(
    async (input: EditInput) => {
      // Rate limit check
      if (!aiRateLimiter.canMakeRequest()) {
        const timeUntilReset = aiRateLimiter.getTimeUntilReset();
        const waitSeconds = Math.ceil(timeUntilReset / 1000);
        const error = new Error(
          `Rate limit exceeded. Please wait ${waitSeconds}s before trying again.`
        );
        setError(error);
        setIsEditing(false);
        options?.onError?.(error);
        throw error;
      }

      setIsEditing(true);
      setProgress('Initializing...');
      setError(null);
      setResult(null);

      try {
        aiRateLimiter.recordRequest();

        const output = await editImage(input, (status, message) => {
          setProgress(message || status);
        });

        // 🔒 SECURITY: Proxy external URLs through our own domain
        // Completely hides all external service usage (FAL.ai, Supabase, etc.)
        setProgress('Securing image...');

        try {
          // Get the first image URL from FAL.ai response
          const originalUrl = output.images[0]?.url;
          if (!originalUrl) {
            throw new Error('No image URL in response');
          }

          // Returns: /api/images/{id} (our own domain)
          const customUrl = await proxyImageToSupabase(originalUrl);

          // Convert relative URL to absolute for better compatibility
          const absoluteUrl = customUrl.startsWith('http')
            ? customUrl
            : `${window.location.origin}${customUrl}`;

          logger.info('Image secured with custom URL');

          // Replace external URL with our custom URL
          const securedOutput: FalOutput = {
            ...output,
            images: [
              {
                ...output.images[0],
                url: absoluteUrl,
              },
            ],
          };

          setResult(securedOutput);
          setProgress('Edit complete!');
          options?.onSuccess?.(securedOutput);

          return securedOutput;
        } catch (proxyError) {
          // If proxy fails, fallback to original URL
          logger.error('Failed to secure image, using original:', proxyError);
          setResult(output);
          setProgress('Edit complete!');
          options?.onSuccess?.(output);
          return output;
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        setProgress('');
        options?.onError?.(error);
        throw error;
      } finally {
        setIsEditing(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setIsEditing(false);
    setProgress('');
    setError(null);
    setResult(null);
  }, []);

  return {
    edit,
    reset,
    isEditing,
    progress,
    error,
    result,
  };
}
