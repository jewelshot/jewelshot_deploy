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

        // 🔒 SECURITY: Proxy FAL.ai URLs through Supabase Storage
        // This hides the FAL.ai source and maintains control over assets
        setProgress('Securing image...');

        try {
          const proxiedUrl = await proxyImageToSupabase(output.url);
          logger.info('Image proxied:', {
            original: output.url.substring(0, 50),
            proxied: proxiedUrl.substring(0, 50),
          });

          // Replace FAL URL with Supabase URL
          const proxiedOutput: FalOutput = {
            ...output,
            url: proxiedUrl,
          };

          setResult(proxiedOutput);
          setProgress('Edit complete!');
          options?.onSuccess?.(proxiedOutput);

          return proxiedOutput;
        } catch (proxyError) {
          // If proxy fails, fallback to original URL
          logger.error('Failed to proxy image, using original:', proxyError);
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
