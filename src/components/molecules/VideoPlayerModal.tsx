/**
 * Video Player Modal
 *
 * Displays generated video with download functionality
 */

import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Play } from 'lucide-react';

interface VideoPlayerModalProps {
  videoUrl: string;
  onClose: () => void;
}

export function VideoPlayerModal({ videoUrl, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl font-bold text-transparent">
            Generated Video
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-purple-700"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative overflow-hidden rounded-xl bg-black">
          {videoError ? (
            /* Error State */
            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Video Load Error
                </h3>
                <p className="text-sm text-gray-400">{videoError}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Video URL: {videoUrl}
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                Reload Page
              </button>
            </div>
          ) : (
            /* Video Player */
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                loop
                muted
                className="h-auto w-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
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

              {/* Play/Pause Overlay (appears when video is paused) */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity hover:bg-black/40"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/80 shadow-lg transition-transform hover:scale-110">
                    <Play className="h-10 w-10 text-white" />
                  </div>
                </button>
              )}
            </>
          )}
        </div>

        {/* Info */}
        <p className="mt-4 text-center text-sm text-gray-400">
          Video generated using Google Veo 2 • 720p • Auto aspect ratio • Muted
        </p>
      </div>
    </div>
  );
}
