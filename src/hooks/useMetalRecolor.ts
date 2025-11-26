/**
 * useMetalRecolor Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Handles metal color changes for jewelry
 * NOW USES: Atomic credit system + queue
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

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
  const [recoloredImageUrl, setRecoloredImageUrl] = useState<string | null>(null);
  const [appliedMetalType, setAppliedMetalType] = useState<MetalType | null>(null);
  const [appliedMetalColor, setAppliedMetalColor] = useState<MetalColor | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { submitAndWait } = useAIQueue();

  const recolorMetal = useCallback(async (input: MetalRecolorInput) => {
    setIsRecoloring(true);
    setProgress(`Changing to ${input.metal_type}...`);
    setError(null);
    setRecoloredImageUrl(null);
    setAppliedMetalType(null);
    setAppliedMetalColor(null);

    try {
      logger.info('Starting metal recolor (via queue)', input);

      const result = await submitAndWait({
        operation: 'metal-recolor',
        params: {
          image_url: input.image_url,
          metal_type: input.metal_type,
        },
        priority: 'urgent',
      }, {
        onProgress: (status) => {
          if (status.state === 'active') setProgress(`Recoloring to ${input.metal_type}...`);
        },
      });

      if (!result?.data?.imageUrl) {
        throw new Error('No image returned from queue');
      }

      setRecoloredImageUrl(result.data.imageUrl);
      setAppliedMetalType(input.metal_type);
      setProgress('Metal color changed successfully!');
      logger.info('Metal recolor completed (via queue)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Metal recolor failed:', err);
      setError(errorMessage);
      setProgress('');
    } finally {
      setIsRecoloring(false);
    }
  }, [submitAndWait]);

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
