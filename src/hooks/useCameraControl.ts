/**
 * useCameraControl Hook
 *
 * Handles camera angle control using Qwen Multiple Angles
 */

import { useState, useCallback } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('useCameraControl');

export type CameraOperation = 'rotate' | 'closeup' | 'top_view' | 'wide_angle';
export type CameraStyle = 'product' | 'lifestyle';

export interface CameraControlInput {
  image_url: string;
  operation: CameraOperation;
  style?: CameraStyle;
}

export interface CameraControlImage {
  url: string;
  width?: number;
  height?: number;
  angle?: number; // For rotate operation
}

interface UseCameraControlResult {
  applyCamera: (input: CameraControlInput) => Promise<void>;
  isProcessing: boolean;
  progress: string;
  resultImages: CameraControlImage[];
  operation: CameraOperation | null;
  error: string | null;
  reset: () => void;
}

export function useCameraControl(): UseCameraControlResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [resultImages, setResultImages] = useState<CameraControlImage[]>([]);
  const [operation, setOperation] = useState<CameraOperation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyCamera = useCallback(async (input: CameraControlInput) => {
    setIsProcessing(true);
    setProgress('Preparing camera control...');
    setError(null);
    setResultImages([]);
    setOperation(input.operation);

    try {
      logger.info('Starting camera control', input);

      // Set operation-specific progress message
      switch (input.operation) {
        case 'rotate':
          setProgress('Generating 3 rotation angles...');
          break;
        case 'closeup':
          setProgress('Creating close-up view...');
          break;
        case 'top_view':
          setProgress('Generating top view...');
          break;
        case 'wide_angle':
          setProgress('Creating wide angle view...');
          break;
      }

      const response = await fetch('/api/ai/camera-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: input.image_url,
          operation: input.operation,
          style: input.style || 'product',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.details ||
          errorData.error ||
          `Server error: ${response.status} ${response.statusText}`;
        logger.error('Camera control API error - DETAILED:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData,
          debug: errorData.debug,
          fullResponse: JSON.stringify(errorData),
        });

        console.error('[useCameraControl] Full error response:', errorData);

        throw new Error(errorMessage);
      }

      setProgress('Processing complete...');

      const result = await response.json();
      logger.info('Camera control API response:', result);

      if (result.success && result.images && result.images.length > 0) {
        setResultImages(result.images);
        setProgress('Camera control applied successfully!');
        logger.info('Camera control completed successfully', {
          operation: result.operation,
          numImages: result.images.length,
          requestId: result.requestId,
        });
      } else {
        logger.error('Invalid camera control response:', result);
        throw new Error('Invalid response from camera control API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Camera control failed:', err);
      setError(errorMessage);
      setProgress('');
      setResultImages([]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress('');
    setResultImages([]);
    setOperation(null);
    setError(null);
  }, []);

  return {
    applyCamera,
    isProcessing,
    progress,
    resultImages,
    operation,
    error,
    reset,
  };
}
