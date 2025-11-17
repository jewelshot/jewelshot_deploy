/**
 * useMetalRecolor Hook
 *
 * Handles metal color changes for jewelry
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('useMetalRecolor');

export type MetalType = '14k' | '18k' | '22k' | 'rose' | 'white';

export interface MetalRecolorInput {
  image_url: string;
  metal_type: MetalType;
}

export interface MetalColor {
  name: string;
  rgb: string;
  hex: string;
  description: string;
}

export interface RecoloredImageOutput {
  url: string;
  width?: number;
  height?: number;
}

interface UseMetalRecolorResult {
  recolorMetal: (input: MetalRecolorInput) => Promise<void>;
  isRecoloring: boolean;
  progress: string;
  recoloredImageUrl: string | null;
  appliedMetalType: MetalType | null;
  appliedMetalColor: MetalColor | null;
  error: string | null;
  reset: () => void;
}

export function useMetalRecolor(): UseMetalRecolorResult {
  const [isRecoloring, setIsRecoloring] = useState(false);
  const [progress, setProgress] = useState('');
  const [recoloredImageUrl, setRecoloredImageUrl] = useState<string | null>(
    null
  );
  const [appliedMetalType, setAppliedMetalType] = useState<MetalType | null>(
    null
  );
  const [appliedMetalColor, setAppliedMetalColor] = useState<MetalColor | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const recolorMetal = useCallback(async (input: MetalRecolorInput) => {
    setIsRecoloring(true);
    setProgress(`Changing to ${input.metal_type}...`);
    setError(null);
    setRecoloredImageUrl(null);
    setAppliedMetalType(null);
    setAppliedMetalColor(null);

    try {
      logger.info('Starting metal recolor', input);

      const response = await fetch('/api/ai/metal-recolor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: input.image_url,
          metal_type: input.metal_type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `Server error: ${response.status}`;
        logger.error('Metal recolor API error:', errorData);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      logger.info('Metal recolor response:', result);

      if (result.success && result.image?.url) {
        setRecoloredImageUrl(result.image.url);
        setAppliedMetalType(result.metal_type);
        setAppliedMetalColor(result.metal_color);
        setProgress('Metal color changed successfully!');
        logger.info('Metal recolor completed', {
          imageUrl: result.image.url,
          metalType: result.metal_type,
          metalColor: result.metal_color,
        });
      } else {
        throw new Error('Invalid response from metal recolor API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Metal recolor failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsRecoloring(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsRecoloring(false);
    setProgress('');
    setRecoloredImageUrl(null);
    setAppliedMetalType(null);
    setAppliedMetalColor(null);
    setError(null);
  }, []);

  return {
    recolorMetal,
    isRecoloring,
    progress,
    recoloredImageUrl,
    appliedMetalType,
    appliedMetalColor,
    error,
    reset,
  };
}
