/**
 * Video Player Modal
 *
 * Displays generated video with download functionality
 * Matches Canvas UI design system
 */

import React, { useRef, useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface VideoPlayerModalProps {
  videoUrl: string;
  onClose: () => void;
}

export function VideoPlayerModal({ videoUrl, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Mark as client-side on mount
  useEffect(() => {
    // This is intentional for hydration safety
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Log video URL for debugging (only on client)
  useEffect(() => {
    if (isClient) {
      console.log('[VideoPlayerModal] Opening with URL:', videoUrl);
    }
  }, [videoUrl, isClient]);

  // Only render on client side (prevents hydration errors)
  if (!isClient) return null;

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const error = (e.target as HTMLVideoElement).error;
    const errorMessage = error
      ? `Video error: ${error.code} - ${error.message}`
      : 'Unknown video error';
    console.error('[VideoPlayerModal] Video error:', errorMessage);
    setVideoError(errorMessage);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jewelshot-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-xl border border-[rgba(139,92,246,0.2)] bg-[#1a1625] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white/90">Video Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.1)] px-4 py-2 text-sm font-medium text-purple-300 transition-all hover:border-[rgba(139,92,246,0.6)] hover:bg-[rgba(139,92,246,0.2)] hover:text-purple-200"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(139,92,246,0.05)] text-white/60 transition-all hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(139,92,246,0.1)] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative overflow-hidden rounded-lg border border-[rgba(139,92,246,0.15)] bg-black/50">
          {videoError ? (
            /* Error State */
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white/90">
                  Video Load Error
                </h3>
                <p className="text-sm text-white/60">{videoError}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.1)] px-4 py-2 text-sm font-medium text-purple-300 transition-all hover:border-[rgba(139,92,246,0.6)] hover:bg-[rgba(139,92,246,0.2)]"
              >
                Reload Page
              </button>
            </div>
          ) : (
            /* Video Player */
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              loop
              muted
              className="h-auto w-full"
              onError={handleVideoError}
              onLoadStart={() =>
                console.log('[VideoPlayerModal] Video loading started')
              }
              onLoadedData={() =>
                console.log('[VideoPlayerModal] Video loaded successfully')
              }
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
