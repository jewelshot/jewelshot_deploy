/**
 * VideoGeneratingModal Component
 *
 * Shows a persistent loading indicator while video is being generated
 */

import React, { useEffect, useState } from 'react';
import { Film, Loader2, AlertCircle } from 'lucide-react';

interface VideoGeneratingModalProps {
  isVisible: boolean;
  error?: string | null;
}

export function VideoGeneratingModal({
  isVisible,
  error,
}: VideoGeneratingModalProps) {
  const [dots, setDots] = useState('');

  // Animate dots
  useEffect(() => {
    if (!isVisible || error) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible, error]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6 px-6">
        {error ? (
          /* Error State */
          <>
            {/* Error Icon */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>

            {/* Error Text */}
            <div className="max-w-md text-center">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Video Generation Failed
              </h3>
              <p className="text-sm text-gray-400">{error}</p>
              <p className="mt-3 text-xs text-gray-500">
                This modal will close automatically...
              </p>
            </div>
          </>
        ) : (
          /* Loading State */
          <>
            {/* Animated Icon */}
            <div className="relative">
              {/* Spinning outer ring */}
              <div className="absolute inset-0 animate-spin">
                <div className="h-24 w-24 rounded-full border-4 border-transparent border-r-purple-400 border-t-purple-500"></div>
              </div>

              {/* Inner icon */}
              <div className="flex h-24 w-24 items-center justify-center">
                <Film className="h-12 w-12 text-purple-400" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center">
              <h3 className="mb-2 text-xl font-semibold text-white">
                Generating Video{dots}
              </h3>
              <p className="text-sm text-gray-400">This may take 2-3 minutes</p>
              <p className="mt-1 text-xs text-gray-500">
                Please do not close this window
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-64">
              <div className="h-1 overflow-hidden rounded-full bg-gray-800">
                <div className="h-full animate-pulse bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%]"></div>
              </div>
            </div>

            {/* Status indicators */}
            <div className="flex flex-col gap-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
                <span>Processing image</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
                <span>Generating video frames</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-purple-400" />
                <span>Rendering final video</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
