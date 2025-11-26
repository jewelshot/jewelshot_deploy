/**
 * useCameraControl Hook - MIGRATED TO QUEUE SYSTEM
 *
 * Manages camera control operations (rotation, close-up)
 * Returns single image URL directly - no gallery modal
 * NOW USES: Atomic credit system + queue
 */

import { useState } from 'react';
import { createScopedLogger } from '@/lib/logger';
import { useAIQueue } from './useAIQueue';

const logger = createScopedLogger('useCameraControl');

export type CameraOperation = 'rotate_left' | 'rotate_right' | 'closeup';
export type CameraStyle = 'product' | 'lifestyle';

interface CameraControlResult {
  url: string;
  width?: number;
  height?: number;
}

export function useCameraControl() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<CameraControlResult | null>(
    null
  );
  const [operation, setOperation] = useState<CameraOperation | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: Use queue system
  const { submitAndWait } = useAIQueue();

  const applyCamera = async (
    imageUrl: string,
    cameraOperation: CameraOperation,
    style: CameraStyle = 'product'
  ) => {
    setIsProcessing(true);
    setError(null);
    setOperation(cameraOperation);
    setResultImage(null);

    try {
      logger.info('[CameraControl] Starting operation (via queue):', {
        cameraOperation,
        style,
      });

      // NEW: Use queue system instead of direct API call
      const result = await submitAndWait({
        operation: 'camera-control',
        params: {
          image_url: imageUrl,
          operation: cameraOperation,
          style,
        },
        priority: 'urgent', // Camera control is user-facing, needs fast response
      });

      if (!result?.data?.imageUrl) {
        throw new Error('No image returned from queue');
      }

      const imageResult: CameraControlResult = {
        url: result.data.imageUrl,
        width: result.data.width,
        height: result.data.height,
      };

      logger.info('[CameraControl] Operation completed (via queue):', {
        operation: cameraOperation,
        has_image: true,
      });

      setResultImage(imageResult);
      return imageResult;
    } catch (err) {
      logger.error('[CameraControl] Operation failed:', err);
      const errorMessage =
        err instanceof Error ? err.message : 'Camera control failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setResultImage(null);
    setOperation(null);
    setError(null);
    setIsProcessing(false);
  };

  return {
    applyCamera,
    isProcessing,
    resultImage,
    operation,
    error,
    reset,
  };
}
