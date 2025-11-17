/**
 * CameraControlModal Component
 *
 * Gallery view for camera control results
 * Shows multiple angle options (especially for rotate operation)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import type {
  CameraControlImage,
  CameraOperation,
} from '@/hooks/useCameraControl';

interface CameraControlModalProps {
  isVisible: boolean;
  images: CameraControlImage[];
  operation: CameraOperation | null;
  onSelect: (imageUrl: string) => void;
  onClose: () => void;
}

export const CameraControlModal: React.FC<CameraControlModalProps> = ({
  isVisible,
  images,
  operation,
  onSelect,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  // Ensure client-side rendering to prevent hydration errors
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Reset selection when images change
  useEffect(() => {
    if (images.length > 0) {
      // For rotate, select middle image (index 1) by default
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIndex(operation === 'rotate' && images.length === 3 ? 1 : 0);
    }
  }, [images, operation]);

  if (!isVisible || !isClient) {
    return null;
  }

  const getOperationTitle = () => {
    switch (operation) {
      case 'rotate':
        return 'Select Rotation Angle';
      case 'closeup':
        return 'Close-Up Result';
      case 'top_view':
        return 'Top View Result';
      case 'wide_angle':
        return 'Wide Angle Result';
      default:
        return 'Camera Control Results';
    }
  };

  const getAngleLabel = (angle?: number) => {
    if (angle === undefined) return '';
    if (angle < 0) return `${Math.abs(angle)}° Left`;
    if (angle > 0) return `${angle}° Right`;
    return 'Center';
  };

  const handleSelect = () => {
    if (images[selectedIndex]) {
      onSelect(images[selectedIndex].url);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getOperationTitle()}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Image Gallery */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`group relative overflow-hidden rounded-xl transition-all ${
                selectedIndex === index
                  ? 'ring-4 ring-purple-500 ring-offset-2 dark:ring-offset-gray-800'
                  : 'ring-2 ring-gray-200 hover:ring-gray-300 dark:ring-gray-700 dark:hover:ring-gray-600'
              }`}
            >
              {/* Image */}
              <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={`Result ${index + 1}`}
                  className="h-full w-full object-contain transition-transform group-hover:scale-105"
                />
              </div>

              {/* Angle Label (for rotate operation) */}
              {operation === 'rotate' && image.angle !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-center text-sm font-semibold text-white">
                    {getAngleLabel(image.angle)}
                  </p>
                </div>
              )}

              {/* Selected Indicator */}
              {selectedIndex === index && (
                <div className="absolute right-2 top-2 rounded-full bg-purple-500 p-1 shadow-lg">
                  <CheckIcon className="h-5 w-5 text-white" />
                </div>
              )}

              {/* Hover Overlay */}
              <div
                className={`absolute inset-0 bg-purple-500/10 transition-opacity ${
                  selectedIndex === index
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Info Text */}
        {operation === 'rotate' && images.length === 3 && (
          <p className="mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Choose the angle that best showcases your jewelry piece
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 font-medium text-white shadow-lg transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-xl"
          >
            Select & Apply
          </button>
        </div>

        {/* Image Info */}
        {images[selectedIndex] && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            <div className="grid grid-cols-2 gap-2">
              {images[selectedIndex].width && (
                <div>
                  <span className="font-semibold">Size:</span>{' '}
                  {images[selectedIndex].width} × {images[selectedIndex].height}
                </div>
              )}
              <div>
                <span className="font-semibold">Operation:</span>{' '}
                {operation?.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
