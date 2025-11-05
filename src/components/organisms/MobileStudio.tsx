/**
 * MobileStudio Component
 *
 * Simplified mobile-friendly studio interface with:
 * - Full-screen canvas
 * - Floating action buttons
 * - Bottom sheet for filters/styles
 * - Touch-optimized controls
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  Download,
  X,
  Sliders,
  Camera,
  Share2,
} from 'lucide-react';
import { useImageEdit } from '@/hooks/useImageEdit';
import { logger } from '@/lib/logger';
import { presetPrompts } from '@/lib/preset-prompts';
import { saveImageToGallery } from '@/lib/gallery-storage';
import MobileNav from '@/components/molecules/MobileNav';

const STORAGE_KEY = 'jewelshot_mobile_image';

export function MobileStudio() {
  // Load image from localStorage with lazy initialization
  const [image, setImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const savedImage = localStorage.getItem(STORAGE_KEY);
      if (savedImage) {
        logger.info('[MobileStudio] Loaded image from storage');
        return savedImage;
      }
    }
    return null;
  });

  const [showStyleSheet, setShowStyleSheet] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(STORAGE_KEY);
    }
    return false;
  });
  const [smoothProgress, setSmoothProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { edit, isEditing, progress } = useImageEdit({
    onSuccess: async (result) => {
      if (result.images && result.images.length > 0) {
        const newImage = result.images[0].url;
        setImage(newImage);
        setHasUnsavedChanges(true);
        logger.info('[MobileStudio] AI edit successful');

        // Auto-save to gallery (Supabase)
        try {
          await saveImageToGallery(
            newImage,
            `mobile-${Date.now()}.jpg`,
            'ai-edited'
            // Note: prompt and style metadata not available from FalOutput
            // Could be added in future if needed
          );
          logger.info('[MobileStudio] Image auto-saved to gallery');

          // Trigger gallery refresh event
          window.dispatchEvent(new CustomEvent('gallery-updated'));
        } catch (saveError) {
          logger.error(
            '[MobileStudio] Failed to auto-save to gallery:',
            saveError
          );
          // Don't block user, just log the error
        }
      }
    },
    onError: (error) => {
      logger.error('[MobileStudio] AI edit failed:', error);
      alert(`Edit failed: ${error.message}`);
    },
  });

  // Save image to localStorage whenever it changes
  useEffect(() => {
    if (image) {
      localStorage.setItem(STORAGE_KEY, image);
      logger.info('[MobileStudio] Image saved to storage');
    }
  }, [image]);

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && image) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, image]);

  // Reset progress when editing starts or ends
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => setSmoothProgress(0), 0);
    return () => clearTimeout(timer);
  }, [isEditing]);

  // Smooth progress animation (0% → 95% over ~50 seconds, realistic for FAL.AI)
  useEffect(() => {
    if (!isEditing) {
      return;
    }

    // Increment every 500ms
    progressTimerRef.current = setInterval(() => {
      setSmoothProgress((prev) => {
        // Check if complete
        if (progress.includes('complete') || progress.includes('success')) {
          return 100;
        }

        // Slow progression to 95% over ~50 seconds (100 ticks * 500ms = 50s)
        // Uses logarithmic curve for realistic feel
        if (prev < 95) {
          const increment = (95 - prev) * 0.02; // Slower as it approaches 95
          return Math.min(prev + Math.max(increment, 0.5), 95);
        }

        return prev; // Stay at 95 until complete
      });
    }, 500);

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [isEditing, progress]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImage(result);
      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    if (hasUnsavedChanges) {
      const confirmed = confirm(
        'You have unsaved changes. Are you sure you want to clear the image?'
      );
      if (!confirmed) return;
    }

    setImage(null);
    setHasUnsavedChanges(false);
    localStorage.removeItem(STORAGE_KEY);
    logger.info('[MobileStudio] Image cleared');
  };

  const handleStyleApply = async (presetId: string) => {
    if (!image) return;

    setShowStyleSheet(false);

    try {
      // Use the same preset prompts as desktop Quick Mode
      const preset = presetPrompts[presetId];
      if (!preset) {
        logger.error('[MobileStudio] Unknown preset:', presetId);
        return;
      }

      // Build the full professional prompt
      // Default to 'ring' as jewelry type, '9:16' aspect ratio for mobile
      const prompt = preset.buildPrompt('ring', undefined, '9:16');

      logger.info('[MobileStudio] Applying preset:', presetId);

      await edit({
        image_url: image,
        prompt,
      });
    } catch (error) {
      logger.error('[MobileStudio] Style application failed:', error);
    }
  };

  const handleDownload = async () => {
    if (!image) return;

    try {
      // Fetch image as blob to force download (works with CORS and data URLs)
      const response = await fetch(image);
      const blob = await response.blob();

      // Create blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `jewelshot-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      // Mark as saved after download
      setHasUnsavedChanges(false);
      logger.info('[MobileStudio] Image downloaded successfully');
    } catch (error) {
      logger.error('[MobileStudio] Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const handleShare = async () => {
    if (!image) return;

    try {
      // Check if Web Share API is supported
      if (!navigator.share) {
        logger.warn(
          '[MobileStudio] Web Share API not supported, falling back to download'
        );
        alert(
          'Sharing is not supported on this device. The image will be downloaded instead.'
        );
        await handleDownload();
        return;
      }

      // Fetch image as blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Create File object for sharing
      const file = new File([blob], `jewelshot-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      // Check if files can be shared
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        logger.warn(
          '[MobileStudio] File sharing not supported, falling back to download'
        );
        alert(
          'File sharing is not supported on this device. The image will be downloaded instead.'
        );
        await handleDownload();
        return;
      }

      // Share via native share sheet
      await navigator.share({
        files: [file],
        title: 'Jewelshot AI-Edited Image',
        text: 'Check out this image I created with Jewelshot!',
      });

      logger.info('[MobileStudio] Image shared successfully');
      setHasUnsavedChanges(false); // Mark as saved after sharing
    } catch (error) {
      // User cancelled or error occurred
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info('[MobileStudio] Share cancelled by user');
      } else {
        logger.error('[MobileStudio] Share failed:', error);
        alert('Failed to share image. Please try again.');
      }
    }
  };

  // Use smooth progress for realistic animation
  const getProgressPercentage = () => {
    return Math.round(smoothProgress);
  };

  const getProgressMessage = () => {
    const percentage = smoothProgress;
    if (percentage >= 100) return 'Complete! ✨';
    if (percentage > 90) return 'Almost there...';
    if (percentage > 70) return 'Polishing details...';
    if (percentage > 50) return 'Creating magic...';
    if (percentage > 30) return 'AI is working...';
    if (percentage > 10) return 'Processing image...';
    if (percentage > 0) return 'Starting AI...';
    return 'Initializing...';
  };

  // Use same presets as desktop Quick Mode
  const styles = [
    {
      id: 'e-commerce',
      name: 'White Background',
      emoji: '⚪',
      description: 'E-commerce catalog',
    },
    {
      id: 'still-life',
      name: 'Still Life',
      emoji: '🌸',
      description: 'Minimalist pastel',
    },
    {
      id: 'on-model',
      name: 'On Model',
      emoji: '👤',
      description: 'Product focused',
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle',
      emoji: '☕',
      description: 'Natural everyday',
    },
    {
      id: 'luxury',
      name: 'Luxury',
      emoji: '💎',
      description: 'High-fashion editorial',
    },
    {
      id: 'close-up',
      name: 'Close Up',
      emoji: '🔍',
      description: 'Macro detail',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      {/* Aurora Background Effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-1/4 -top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-600/20 blur-[100px]"
          style={{ animationDuration: '8s' }}
        ></div>
        <div
          className="absolute -right-1/4 top-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-600/15 blur-[100px]"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        ></div>
        <div
          className="absolute -bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-blue-600/10 blur-[100px]"
          style={{ animationDuration: '12s', animationDelay: '4s' }}
        ></div>
      </div>

      {/* Hidden file inputs */}
      {/* Gallery picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      {/* Camera capture - ALWAYS rear camera */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Take photo with rear camera"
      />

      {/* Top Bar - Compact */}
      <div className="relative z-10 m-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-base font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md shadow-purple-500/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-white">Studio</span>
          </h1>

          <div className="flex items-center gap-1.5">
            {image && (
              <>
                {/* Share Button - Compact */}
                <button
                  onClick={handleShare}
                  disabled={isEditing}
                  className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-blue-500/10 backdrop-blur-xl transition-all hover:border-blue-400/30 hover:bg-blue-500/20 active:scale-90 disabled:opacity-50"
                  aria-label="Share image"
                >
                  <Share2 className="h-4 w-4 text-blue-300 transition-colors group-hover:text-white" />
                </button>

                {/* Download Button - Compact */}
                <button
                  onClick={handleDownload}
                  disabled={isEditing}
                  className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-purple-500/10 backdrop-blur-xl transition-all hover:border-purple-400/30 hover:bg-purple-500/20 active:scale-90 disabled:opacity-50"
                  aria-label="Download image"
                >
                  <Download className="h-4 w-4 text-purple-300 transition-colors group-hover:text-white" />
                </button>

                {/* Clear Button - Compact */}
                <button
                  onClick={handleClearImage}
                  disabled={isEditing}
                  className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-red-400/30 hover:bg-red-500/10 active:scale-90 disabled:opacity-50"
                  aria-label="Clear image"
                >
                  <X className="h-4 w-4 text-white/50 transition-colors group-hover:text-red-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 overflow-hidden">
        {!image ? (
          // Upload State - Compact Card
          <div className="flex h-full flex-col items-center justify-center p-4">
            {/* Main Card */}
            <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-xl backdrop-blur-xl">
              {/* Subtle Glow */}
              <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 animate-pulse rounded-full bg-purple-500/15 blur-2xl" />
              <div
                className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 animate-pulse rounded-full bg-pink-500/15 blur-2xl"
                style={{ animationDelay: '1s' }}
              />

              {/* Icon Container */}
              <div className="relative mb-5 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/10 backdrop-blur-xl">
                  <Camera className="h-8 w-8 text-purple-300" />
                </div>
              </div>

              {/* Text */}
              <h2 className="relative mb-1.5 text-center text-lg font-bold text-white">
                Add Your Photo
              </h2>

              <p className="relative mb-6 text-center text-xs text-white/50">
                Take a photo or choose from your gallery
              </p>

              {/* Action Buttons */}
              <div className="relative flex w-full flex-col gap-2">
                {/* Take Photo (Camera) - Gradient */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] transition-all hover:shadow-md hover:shadow-purple-500/40 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-sm font-medium text-white transition-all group-hover:from-purple-600 group-hover:to-pink-600">
                    <Camera className="h-4 w-4" />
                    Take Photo
                  </div>
                </button>

                {/* Choose from Gallery - Glassmorphic */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    Choose from Gallery
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Image Display */
          <div className="flex h-full items-center justify-center p-4">
            {/* Enhanced Interactive Progress Overlay */}
            {isEditing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70">
                <div className="mx-auto max-w-sm space-y-8 p-6 text-center">
                  {/* Animated Circular Progress with Glow */}
                  <div className="relative mx-auto h-40 w-40">
                    {/* Pulsing Glow Background */}
                    <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/20 blur-xl"></div>

                    {/* Rotating Gradient Ring */}
                    <div
                      className="absolute inset-0 animate-spin rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-30 blur-sm"
                      style={{ animationDuration: '3s' }}
                    ></div>

                    {/* SVG Progress Circle */}
                    <svg className="relative h-full w-full -rotate-90 transform">
                      {/* Background Circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="rgba(147, 51, 234, 0.1)"
                        strokeWidth="4"
                        fill="none"
                      />
                      {/* Gradient Progress Circle */}
                      <defs>
                        <linearGradient
                          id="progressGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#9333ea" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#9333ea" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="url(#progressGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - getProgressPercentage() / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                        style={{
                          filter:
                            'drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))',
                        }}
                      />
                    </svg>

                    {/* Percentage with Animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-pulse text-4xl font-bold text-white">
                          {getProgressPercentage()}
                          <span className="text-2xl text-purple-400">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Orbiting Sparkles */}
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{ animationDuration: '4s' }}
                    >
                      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-purple-400 shadow-lg shadow-purple-500/50"></div>
                    </div>
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{
                        animationDuration: '5s',
                        animationDirection: 'reverse',
                      }}
                    >
                      <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-pink-400 shadow-lg shadow-pink-500/50"></div>
                    </div>
                  </div>

                  {/* Progress Messages with Fade Animation */}
                  <div className="animate-pulse space-y-3">
                    <h3 className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
                      {getProgressMessage()}
                    </h3>
                    <p className="text-sm font-medium text-white/80">
                      {progress || 'Processing your image...'}
                    </p>
                  </div>

                  {/* Wave Loading Animation */}
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-1 w-1 animate-bounce rounded-full bg-gradient-to-t from-purple-500 to-pink-500"
                        style={{
                          animationDelay: `${i * 100}ms`,
                          animationDuration: '1s',
                        }}
                      ></div>
                    ))}
                  </div>

                  {/* Tip with Icon */}
                  <div className="flex items-center justify-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 backdrop-blur-sm">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400"></div>
                    <p className="text-xs font-medium text-purple-300">
                      {smoothProgress < 95
                        ? `Estimated: ${Math.round((95 - smoothProgress) / 1.9)} seconds remaining`
                        : 'Finalizing...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Uploaded jewelry image for editing"
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* Floating Action Buttons - Compact */}
      {image && !isEditing && (
        <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2">
          <div className="relative">
            {/* Subtle Background Glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 animate-pulse rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl" />

            {/* Compact Buttons */}
            <div className="flex gap-2">
              {/* Upload New - Compact */}
              <button
                onClick={() => setShowUploadOptions(true)}
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.12] active:scale-90"
                aria-label="Add new image"
              >
                <Upload className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
              </button>

              {/* Styles - Gradient */}
              <button
                onClick={() => setShowStyleSheet(true)}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] shadow-md shadow-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/50 active:scale-90"
              >
                <div className="flex h-[42px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 text-sm font-semibold text-white transition-all group-hover:from-purple-600 group-hover:to-pink-600">
                  <Sparkles className="h-4 w-4" />
                  Styles
                </div>
              </button>

              {/* Filters - Compact */}
              <button
                onClick={() => alert('Filters coming soon!')}
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.12] active:scale-90"
                aria-label="Filters"
              >
                <Sliders className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet - AI Styles - Compact */}
      {showStyleSheet && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowStyleSheet(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-white/[0.08] p-4 shadow-xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle Glow */}
            <div className="pointer-events-none absolute -top-16 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/5 to-transparent" />

            {/* Handle */}
            <div className="relative mb-4 flex justify-center">
              <div className="h-1 w-12 rounded-full bg-white/30" />
            </div>

            {/* Header */}
            <h3 className="relative mb-4 text-center text-lg font-bold text-white">
              Choose Style
            </h3>

            {/* Styles Grid - Compact Cards */}
            <div className="relative grid grid-cols-2 gap-2">
              {styles.map((style, index) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleApply(style.id)}
                  disabled={isEditing}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-3 text-center backdrop-blur-xl transition-all hover:border-purple-400/30 hover:bg-white/[0.08] active:scale-95 disabled:opacity-50"
                  style={{
                    animation: `fadeInUp 0.25s ease-out ${index * 0.04}s backwards`,
                  }}
                >
                  {/* Content */}
                  <div className="relative">
                    <div className="mb-1.5 text-3xl">{style.emoji}</div>
                    <div className="mb-0.5 text-sm font-semibold text-white">
                      {style.name}
                    </div>
                    <div className="text-[10px] text-white/40">
                      {style.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Cancel - Compact */}
            <button
              onClick={() => setShowStyleSheet(false)}
              className="relative mt-4 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet - Upload Options - Compact */}
      {showUploadOptions && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowUploadOptions(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-white/10 bg-white/[0.08] p-4 shadow-xl backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle Glow */}
            <div className="pointer-events-none absolute -top-16 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/5 to-transparent" />

            {/* Handle */}
            <div className="relative mb-4 flex justify-center">
              <div className="h-1 w-12 rounded-full bg-white/30" />
            </div>

            {/* Header */}
            <h3 className="relative mb-4 text-center text-lg font-bold text-white">
              Add New Photo
            </h3>

            {/* Options - Compact Cards */}
            <div className="relative space-y-2">
              {/* Take Photo - Compact */}
              <button
                onClick={() => {
                  setShowUploadOptions(false);
                  cameraInputRef.current?.click();
                }}
                className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl transition-all hover:border-purple-400/30 hover:bg-white/[0.08] active:scale-95"
              >
                {/* Icon Container */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <Camera className="h-5 w-5 text-purple-300" />
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-white">
                    Take Photo
                  </div>
                  <div className="text-[11px] text-white/40">
                    Use your camera to capture
                  </div>
                </div>
              </button>

              {/* Choose from Gallery - Compact */}
              <button
                onClick={() => {
                  setShowUploadOptions(false);
                  fileInputRef.current?.click();
                }}
                className="group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl transition-all hover:border-blue-400/30 hover:bg-white/[0.08] active:scale-95"
              >
                {/* Icon Container */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <Upload className="h-5 w-5 text-blue-300" />
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-white">
                    Choose from Gallery
                  </div>
                  <div className="text-[11px] text-white/40">
                    Select from your photos
                  </div>
                </div>
              </button>
            </div>

            {/* Cancel - Compact */}
            <button
              onClick={() => setShowUploadOptions(false)}
              className="relative mt-4 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <MobileNav />
    </div>
  );
}

export default MobileStudio;
