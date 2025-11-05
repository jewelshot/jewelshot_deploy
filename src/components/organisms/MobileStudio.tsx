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
import { Upload, Sparkles, Download, X, Sliders, Camera } from 'lucide-react';
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
            'ai-edited',
            {
              prompt: result.prompt,
              style: result.style,
            }
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
      {/* Camera capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Top Bar - Glassmorphic */}
      <div className="relative z-10 m-3 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-white/[0.08] via-white/[0.05] to-white/[0.08] p-4 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-lg font-bold">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg shadow-purple-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Studio
            </span>
          </h1>

          <div className="flex items-center gap-2">
            {image && (
              <>
                {/* Download Button - Glassmorphic */}
                <button
                  onClick={handleDownload}
                  disabled={isEditing}
                  className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-purple-500/20 backdrop-blur-xl transition-all hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/30 active:scale-90 disabled:opacity-50"
                  aria-label="Download image"
                >
                  <Download className="relative z-10 h-5 w-5 text-purple-300 transition-colors group-hover:text-white" />
                </button>

                {/* Clear Button - Glassmorphic */}
                <button
                  onClick={handleClearImage}
                  disabled={isEditing}
                  className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl transition-all hover:border-red-400/50 hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/20 active:scale-90 disabled:opacity-50"
                  aria-label="Clear image"
                >
                  <X className="relative z-10 h-5 w-5 text-white/60 transition-colors group-hover:text-red-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 overflow-hidden">
        {!image ? (
          // Upload State - Premium Glassmorphic Card
          <div className="flex h-full flex-col items-center justify-center p-6">
            {/* Main Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-white/[0.08] p-8 shadow-2xl backdrop-blur-2xl">
              {/* Glow Effect */}
              <div className="absolute -left-10 -top-10 h-32 w-32 animate-pulse rounded-full bg-purple-500/20 blur-3xl"></div>
              <div
                className="absolute -bottom-10 -right-10 h-32 w-32 animate-pulse rounded-full bg-pink-500/20 blur-3xl"
                style={{ animationDelay: '1s' }}
              ></div>

              {/* Icon Container */}
              <div className="relative mb-6 flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-purple-500/30 shadow-xl shadow-purple-500/20 backdrop-blur-xl">
                  <Camera className="h-12 w-12 text-purple-300" />
                </div>
              </div>

              {/* Text */}
              <h2 className="relative mb-2 text-center text-2xl font-bold">
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Add Your Photo
                </span>
              </h2>

              <p className="relative mb-8 text-center text-sm text-white/60">
                Take a photo or choose from your gallery
              </p>

              {/* Action Buttons */}
              <div className="relative flex w-full flex-col gap-3">
                {/* Take Photo (Camera) - Premium Gradient */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-[1px] transition-all hover:shadow-lg hover:shadow-purple-500/50 active:scale-95"
                >
                  <div className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 px-8 py-4 font-semibold text-white transition-all group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-purple-600">
                    <Camera className="h-5 w-5" />
                    Take Photo
                  </div>
                </button>

                {/* Choose from Gallery - Glassmorphic */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/10 hover:shadow-lg active:scale-95"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Upload className="h-5 w-5" />
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

      {/* Floating Action Buttons (when image is loaded) - Premium Glassmorphic */}
      {image && !isEditing && (
        <div className="absolute bottom-28 left-1/2 z-20 -translate-x-1/2">
          {/* Container with Aurora Glow */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 blur-2xl"></div>

            {/* Buttons */}
            <div className="flex gap-3">
              {/* Upload New - Glassmorphic */}
              <button
                onClick={() => setShowUploadOptions(true)}
                className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-lg active:scale-90"
                aria-label="Add new image"
              >
                <Upload className="h-6 w-6 text-white/80 transition-colors group-hover:text-white" />
              </button>

              {/* Styles - Premium Gradient */}
              <button
                onClick={() => setShowStyleSheet(true)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-[1px] shadow-xl shadow-purple-500/40 transition-all hover:shadow-2xl hover:shadow-purple-500/60 active:scale-90"
              >
                <div className="flex h-14 items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 px-6 font-bold text-white transition-all group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-purple-600">
                  <Sparkles className="h-5 w-5" />
                  Styles
                </div>
              </button>

              {/* Filters - Glassmorphic */}
              <button
                onClick={() => alert('Filters coming soon!')}
                className="group flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-lg active:scale-90"
                aria-label="Filters"
              >
                <Sliders className="h-6 w-6 text-white/80 transition-colors group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet - AI Styles (Premium Glassmorphic) */}
      {showStyleSheet && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md"
          onClick={() => setShowStyleSheet(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[75vh] overflow-y-auto rounded-t-[2rem] border-t border-white/20 bg-gradient-to-b from-white/[0.12] via-white/[0.08] to-white/[0.12] p-6 shadow-2xl backdrop-blur-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Aurora Glow */}
            <div className="pointer-events-none absolute -top-20 left-0 right-0 h-40 bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-transparent"></div>

            {/* Handle */}
            <div className="relative mb-5 flex justify-center">
              <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-white/30 via-white/50 to-white/30 shadow-lg" />
            </div>

            {/* Header */}
            <h3 className="relative mb-5 text-center text-2xl font-bold">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Choose Style
              </span>
            </h3>

            {/* Styles Grid - Premium Cards */}
            <div className="relative grid grid-cols-2 gap-3">
              {styles.map((style, index) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleApply(style.id)}
                  disabled={isEditing}
                  className="group relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-4 text-center backdrop-blur-xl transition-all hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 disabled:opacity-50"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`,
                  }}
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <div className="mb-2 text-4xl">{style.emoji}</div>
                    <div className="mb-1 font-bold text-white">
                      {style.name}
                    </div>
                    <div className="text-[11px] text-white/50">
                      {style.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Cancel - Glassmorphic */}
            <button
              onClick={() => setShowStyleSheet(false)}
              className="relative mt-5 w-full overflow-hidden rounded-2xl border border-white/20 bg-white/5 py-4 font-bold text-white backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/10 active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet - Upload Options (Premium Glassmorphic) */}
      {showUploadOptions && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-md"
          onClick={() => setShowUploadOptions(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-[2rem] border-t border-white/20 bg-gradient-to-b from-white/[0.12] via-white/[0.08] to-white/[0.12] p-6 shadow-2xl backdrop-blur-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Aurora Glow */}
            <div className="pointer-events-none absolute -top-20 left-0 right-0 h-40 bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-transparent"></div>

            {/* Handle */}
            <div className="relative mb-5 flex justify-center">
              <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-white/30 via-white/50 to-white/30 shadow-lg" />
            </div>

            {/* Header */}
            <h3 className="relative mb-5 text-center text-2xl font-bold">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Add New Photo
              </span>
            </h3>

            {/* Options - Premium Cards */}
            <div className="relative space-y-3">
              {/* Take Photo - Glassmorphic with Gradient */}
              <button
                onClick={() => {
                  setShowUploadOptions(false);
                  cameraInputRef.current?.click();
                }}
                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-4 backdrop-blur-xl transition-all hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent"></div>
                </div>

                {/* Icon Container */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-purple-500/30 shadow-lg shadow-purple-500/10">
                  <Camera className="h-7 w-7 text-purple-300" />
                </div>

                {/* Text */}
                <div className="relative flex-1 text-left">
                  <div className="font-bold text-white">Take Photo</div>
                  <div className="text-sm text-white/50">
                    Use your camera to capture
                  </div>
                </div>
              </button>

              {/* Choose from Gallery - Glassmorphic with Gradient */}
              <button
                onClick={() => {
                  setShowUploadOptions(false);
                  fileInputRef.current?.click();
                }}
                className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 p-4 backdrop-blur-xl transition-all hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent"></div>
                </div>

                {/* Icon Container */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-blue-500/30 shadow-lg shadow-blue-500/10">
                  <Upload className="h-7 w-7 text-blue-300" />
                </div>

                {/* Text */}
                <div className="relative flex-1 text-left">
                  <div className="font-bold text-white">
                    Choose from Gallery
                  </div>
                  <div className="text-sm text-white/50">
                    Select from your photos
                  </div>
                </div>
              </button>
            </div>

            {/* Cancel - Glassmorphic */}
            <button
              onClick={() => setShowUploadOptions(false)}
              className="relative mt-5 w-full overflow-hidden rounded-2xl border border-white/20 bg-white/5 py-4 font-bold text-white backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/10 active:scale-95"
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
