/**
 * useCameraControl Hook
 *
 * Manages camera control operations (rotation, close-up)
 * Returns single image URL directly - no gallery modal
 */

import { useState } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('useCameraControl');

export type CameraOperation = 'rotate_left' | 'rotate_right' | 'closeup';
export type CameraStyle = 'product' | 'lifestyle';

interface CameraControlResult {
  url: string;
  width?: number;
  height?: number;
}

interface CameraControlResponse {
  success: boolean;
  image?: CameraControlResult;
  operation: string;
  requestId: string;
  error?: string;
  details?: string;
}

export function useCameraControl() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<CameraControlResult | null>(
    null
  );
  const [operation, setOperation] = useState<CameraOperation | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      logger.info('[CameraControl] Starting operation:', {
        cameraOperation,
        style,
      });

      const response = await fetch('/api/ai/camera-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          operation: cameraOperation,
          style,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data: CameraControlResponse = await response.json();

      if (!data.success || !data.image) {
        throw new Error(data.error || 'No image generated');
      }

      logger.info('[CameraControl] Operation completed:', {
        operation: data.operation,
        has_image: !!data.image,
      });

      setResultImage(data.image);
      return data.image;
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
