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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { edit, isEditing, progress } = useImageEdit({
    onSuccess: (result) => {
      if (result.images && result.images.length > 0) {
        const newImage = result.images[0].url;
        setImage(newImage);
        setHasUnsavedChanges(true);
        logger.info('[MobileStudio] AI edit successful');
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

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement('a');
    link.href = image;
    link.download = `jewelshot-${Date.now()}.jpg`;
    link.click();

    // Mark as saved after download
    setHasUnsavedChanges(false);
    logger.info('[MobileStudio] Image downloaded');
  };

  // Simulate progress percentage for better UX
  const getProgressPercentage = () => {
    if (!isEditing) return 0;
    if (progress.includes('complete') || progress.includes('success'))
      return 100;
    if (progress.includes('Uploading') || progress.includes('Initializing'))
      return 15;
    if (progress.includes('Processing') || progress.includes('Generating'))
      return 45;
    if (progress.includes('Finalizing') || progress.includes('Downloading'))
      return 85;
    return 30; // Default
  };

  const getProgressMessage = () => {
    const percentage = getProgressPercentage();
    if (percentage === 100) return 'Complete! ✨';
    if (percentage > 80) return 'Almost there...';
    if (percentage > 40) return 'Creating magic...';
    if (percentage > 10) return 'Starting AI...';
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
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
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

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/50 p-4 backdrop-blur-xl">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Jewelshot Studio
        </h1>

        <div className="flex items-center gap-2">
          {image && (
            <>
              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={isEditing}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white transition-all hover:bg-purple-600 active:scale-95 disabled:opacity-50"
                aria-label="Download image"
              >
                <Download className="h-5 w-5" />
              </button>

              {/* Clear Button */}
              <button
                onClick={handleClearImage}
                disabled={isEditing}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
                aria-label="Clear image"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 overflow-hidden">
        {!image ? (
          /* Upload State */
          <div className="flex h-full flex-col items-center justify-center p-6">
            <div className="mb-6 rounded-2xl bg-purple-500/20 p-6">
              <Camera className="h-16 w-16 text-purple-400" />
            </div>

            <h2 className="mb-2 text-xl font-bold text-white">
              Add Your Photo
            </h2>

            <p className="mb-8 text-center text-white/70">
              Take a photo or choose from your gallery
            </p>

            {/* Action Buttons */}
            <div className="flex w-full max-w-sm flex-col gap-3">
              {/* Take Photo (Camera) */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center justify-center gap-3 rounded-xl bg-purple-500 px-8 py-4 font-medium text-white transition-all hover:bg-purple-600 active:scale-95"
              >
                <Camera className="h-5 w-5" />
                Take Photo
              </button>

              {/* Choose from Gallery */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-medium text-white backdrop-blur-xl transition-all hover:bg-white/10 active:scale-95"
              >
                <Upload className="h-5 w-5" />
                Choose from Gallery
              </button>
            </div>
          </div>
        ) : (
          /* Image Display */
          <div className="flex h-full items-center justify-center p-4">
            {/* Enhanced Progress Overlay */}
            {isEditing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-md">
                <div className="mx-auto max-w-sm space-y-6 p-6 text-center">
                  {/* Circular Progress */}
                  <div className="relative mx-auto h-32 w-32">
                    {/* Background Circle */}
                    <svg className="h-full w-full -rotate-90 transform">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(147, 51, 234, 0.2)"
                        strokeWidth="8"
                        fill="none"
                      />
                      {/* Progress Circle */}
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#9333ea"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - getProgressPercentage() / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    </svg>
                    {/* Percentage */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {getProgressPercentage()}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Messages */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">
                      {getProgressMessage()}
                    </h3>
                    <p className="text-sm text-white/70">
                      {progress || 'Processing your image...'}
                    </p>
                  </div>

                  {/* Animated Dots */}
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-purple-500"
                      style={{ animationDelay: '0ms' }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-purple-500"
                      style={{ animationDelay: '150ms' }}
                    ></div>
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-purple-500"
                      style={{ animationDelay: '300ms' }}
                    ></div>
                  </div>

                  {/* Tip */}
                  <p className="text-xs text-white/50">
                    💡 This may take 30-60 seconds
                  </p>
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

      {/* Floating Action Buttons (when image is loaded) */}
      {image && !isEditing && (
        <div className="absolute bottom-28 left-1/2 z-20 -translate-x-1/2">
          <div className="flex gap-4">
            {/* Upload New */}
            <button
              onClick={() => setShowUploadOptions(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-xl transition-all hover:bg-white/10 active:scale-95"
              aria-label="Add new image"
            >
              <Upload className="h-6 w-6" />
            </button>

            {/* AI Styles */}
            <button
              onClick={() => setShowStyleSheet(true)}
              className="flex h-14 items-center gap-2 rounded-full bg-purple-500 px-6 font-medium text-white shadow-lg transition-all hover:bg-purple-600 active:scale-95"
            >
              <Sparkles className="h-5 w-5" />
              AI Styles
            </button>

            {/* Filters */}
            <button
              onClick={() => alert('Filters coming soon!')}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-xl transition-all hover:bg-white/10 active:scale-95"
              aria-label="Filters"
            >
              <Sliders className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet - AI Styles */}
      {showStyleSheet && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowStyleSheet(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="mb-4 flex justify-center">
              <div className="h-1 w-12 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <h3 className="mb-4 text-xl font-bold text-white">
              Choose AI Style
            </h3>

            {/* Styles Grid */}
            <div className="grid grid-cols-2 gap-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleApply(style.id)}
                  disabled={isEditing}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:bg-white/10 active:scale-95 disabled:opacity-50"
                >
                  <span className="text-3xl">{style.emoji}</span>
                  <span className="font-medium text-white">{style.name}</span>
                  <span className="text-[10px] text-white/50">
                    {style.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Cancel */}
            <button
              onClick={() => setShowStyleSheet(false)}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition-colors hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom Sheet - Upload Options (Camera or Gallery) */}
      {showUploadOptions && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowUploadOptions(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl border-t border-white/10 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="mb-4 flex justify-center">
              <div className="h-1 w-12 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <h3 className="mb-4 text-xl font-bold text-white">Add New Photo</h3>

            {/* Options */}
            <div className="space-y-3">
              {/* Take Photo */}
              <button
                onClick={() => {
                  setShowUploadOptions(false);
                  cameraInputRef.current?.click();
                }}
                className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 active:scale-95"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                  <Camera className="h-6 w-6 text-purple-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">Take Photo</div>
                  <div className="text-sm text-white/50">
                    Use your camera to capture
                  </div>
                </div>
              </button>

              {/* Choose from Gallery */}
              <button
                onClick={() => {
                  setShowUploadOptions(false);
                  fileInputRef.current?.click();
                }}
                className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 active:scale-95"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                  <Upload className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">
                    Choose from Gallery
                  </div>
                  <div className="text-sm text-white/50">
                    Select from your photos
                  </div>
                </div>
              </button>
            </div>

            {/* Cancel */}
            <button
              onClick={() => setShowUploadOptions(false)}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition-colors hover:bg-white/10"
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
