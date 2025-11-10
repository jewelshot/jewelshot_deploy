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

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Sparkles, Download, X, Camera, Share2 } from 'lucide-react';
import { useImageEdit } from '@/hooks/useImageEdit';
import { logger } from '@/lib/logger';
import { presetPrompts } from '@/lib/preset-prompts';
import { saveImageToGallery } from '@/lib/gallery-storage';
import MobileNav from '@/components/molecules/MobileNav';
import { CreditCounter } from '@/components/molecules/CreditCounter';
import { useCreditStore } from '@/store/creditStore';

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
  const [aspectRatio, setAspectRatio] = useState<string>('9:16'); // Default mobile aspect
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Credit store
  const { deductCredit, fetchCredits } = useCreditStore();

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

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

  // Smooth progress animation
  useEffect(() => {
    if (!isEditing) {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      return;
    }

    const progressNum = parseFloat(progress) || 0;
    const targetProgress = Math.min(progressNum, 95);
    const diff = targetProgress - smoothProgress;

    if (diff > 0) {
      const increment = diff / 10;
      progressTimerRef.current = setInterval(() => {
        setSmoothProgress((prev) => {
          const next = prev + increment;
          return next >= targetProgress ? targetProgress : next;
        });
      }, 50);
    }

    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, [isEditing, progress, smoothProgress]);

  // Reset progress when editing completes
  useEffect(() => {
    if (!isEditing) {
      const timer = setTimeout(() => setSmoothProgress(0), 300);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
      localStorage.setItem(STORAGE_KEY, dataUrl);
      setHasUnsavedChanges(true);
      setShowUploadOptions(false);
      logger.info('[MobileStudio] File uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleStyleApply = useCallback(
    async (presetId: string) => {
      if (!image) return;

      setShowStyleSheet(false);

      let creditDeducted = false;

      try {
        // Try to deduct credit (but don't block if it fails)
        const success = await deductCredit({
          prompt: presetId,
          style: presetId,
        });

        if (success) {
          creditDeducted = true;
          logger.info('[MobileStudio] Credit deducted successfully');
        } else {
          logger.warn(
            '[MobileStudio] Credit deduction failed, continuing anyway'
          );
        }

        // Use the same preset prompts as desktop Quick Mode
        const preset = presetPrompts[presetId];
        if (!preset) {
          logger.error('[MobileStudio] Unknown preset:', presetId);
          // Refund credit if preset invalid
          logger.warn('[MobileStudio] Refunding credit due to invalid preset');
          await fetch('/api/credits/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: 1,
              type: 'refund',
              description: 'Refund: Invalid preset',
              metadata: { presetId },
            }),
          });
          return;
        }

        // Build the full professional prompt with selected aspect ratio
        const prompt = preset.buildPrompt('ring', undefined, aspectRatio);

        logger.info(
          '[MobileStudio] Applying preset:',
          presetId,
          'aspect:',
          aspectRatio
        );

        await edit({
          image_url: image,
          prompt,
          aspect_ratio: aspectRatio as
            | '1:1'
            | '4:5'
            | '3:4'
            | '2:3'
            | '9:16'
            | '16:9'
            | undefined,
        });
      } catch (error) {
        logger.error('[MobileStudio] Style application failed:', error);

        // Refund credit if generation failed AFTER deduction
        if (creditDeducted) {
          logger.warn(
            '[MobileStudio] Refunding credit due to generation failure'
          );
          try {
            await fetch('/api/credits/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: 1,
                type: 'refund',
                description: 'Refund: Generation failed',
                metadata: {
                  error: error instanceof Error ? error.message : 'Unknown',
                  presetId,
                },
              }),
            });
            const { fetchCredits } = useCreditStore.getState();
            await fetchCredits();
          } catch (refundError) {
            logger.error(
              '[MobileStudio] Failed to refund credit:',
              refundError
            );
          }
        }
      }
    },
    [image, deductCredit, edit, aspectRatio]
  );

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement('a');
    link.href = image;
    link.download = `jewelshot-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logger.info('[MobileStudio] Image downloaded');
  };

  const handleShare = async () => {
    if (!image) return;

    try {
      // Convert data URL to blob
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], 'jewelshot.jpg', { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'JewelShot Creation',
          text: 'Check out my AI-edited jewelry photo!',
        });
        logger.info('[MobileStudio] Image shared via Web Share API');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/jpeg': blob,
          }),
        ]);
        alert('Image copied to clipboard!');
        logger.info('[MobileStudio] Image copied to clipboard');
      }
    } catch (error) {
      logger.error('[MobileStudio] Share failed:', error);
      alert('Unable to share image. Please try downloading instead.');
    }
  };

  const handleClear = () => {
    if (hasUnsavedChanges) {
      const confirmed = confirm(
        'Are you sure you want to clear this image? This action cannot be undone.'
      );
      if (!confirmed) return;
    }

    setImage(null);
    setHasUnsavedChanges(false);
    localStorage.removeItem(STORAGE_KEY);
    logger.info('[MobileStudio] Image cleared');
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b border-white/5 bg-gray-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
            Studio
          </h1>
          <CreditCounter />
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex flex-1 items-center justify-center p-4 pb-24">
        {!image && !isEditing ? (
          /* Empty State */
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-white">Create Magic</h2>
            <p className="mb-8 text-gray-400">
              Upload a jewelry photo to begin
            </p>
            <div className="space-y-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all active:scale-95"
              >
                <Camera className="h-5 w-5" />
                Take Photo
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all active:scale-95"
              >
                <Upload className="h-5 w-5" />
                Upload from Gallery
              </button>
            </div>
          </div>
        ) : isEditing ? (
          /* Loading State */
          <div className="w-full max-w-sm">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50" />
              <p className="text-lg font-medium text-white">
                Applying AI magic...
              </p>
              <p className="text-sm text-gray-400">
                {Math.round(smoothProgress)}%
              </p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                style={{ width: `${smoothProgress}%` }}
              />
            </div>
          </div>
        ) : (
          /* Image Display */
          <div className="relative w-full max-w-2xl">
            {hasUnsavedChanges && (
              <div className="absolute left-4 top-4 z-10 rounded-lg bg-yellow-500/20 px-3 py-1.5 text-xs font-medium text-yellow-200 backdrop-blur-sm">
                Unsaved changes
              </div>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image || ''}
              alt="Uploaded jewelry image for editing"
              className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            />
          </div>
        )}
      </div>

      {/* Aspect Ratio Selector */}
      {image && !isEditing && (
        <div className="absolute bottom-32 left-1/2 z-10 -translate-x-1/2">
          <div className="flex gap-1 rounded-xl border border-white/10 bg-gray-900/80 p-1 backdrop-blur-xl">
            {['1:1', '4:5', '9:16', '16:9'].map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  aspectRatio === ratio
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      {image && !isEditing && (
        <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2">
          <div className="relative">
            {/* Compact Buttons */}
            <div className="flex gap-2">
              {/* Upload New */}
              <button
                onClick={() => setShowUploadOptions(true)}
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.12] active:scale-90"
                aria-label="Add new image"
              >
                <Upload className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
              </button>

              {/* Styles */}
              <button
                onClick={() => setShowStyleSheet(true)}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 p-[1px] shadow-md shadow-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/50 active:scale-90"
              >
                <div className="flex h-[42px] items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 text-sm font-semibold text-white transition-all group-hover:from-purple-600 group-hover:to-pink-600">
                  <Sparkles className="h-4 w-4" />
                  Styles
                </div>
              </button>

              {/* Download */}
              <button
                onClick={handleDownload}
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.12] active:scale-90"
                aria-label="Download"
              >
                <Download className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.12] active:scale-90"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Options Bottom Sheet */}
      {showUploadOptions && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={() => setShowUploadOptions(false)}
        >
          <div
            className="animate-slide-up fixed bottom-0 left-0 right-0 z-[70] rounded-t-3xl border-t border-white/10 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20" />
            <h3 className="mb-4 text-lg font-bold text-white">Add Image</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  cameraInputRef.current?.click();
                  setShowUploadOptions(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all active:scale-95"
              >
                <Camera className="h-5 w-5" />
                Take Photo
              </button>
              <button
                onClick={() => {
                  fileInputRef.current?.click();
                  setShowUploadOptions(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-all active:scale-95"
              >
                <Upload className="h-5 w-5" />
                Upload from Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style Selection Bottom Sheet */}
      {showStyleSheet && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={() => setShowStyleSheet(false)}
        >
          <div
            className="animate-slide-up fixed bottom-0 left-0 right-0 z-[70] max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-gray-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20" />
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Choose Style</h3>
              <button
                onClick={() => setShowStyleSheet(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: 'e-commerce',
                  name: 'White Background',
                  desc: 'Clean product shot',
                  gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)',
                },
                {
                  id: 'still-life',
                  name: 'Still Life',
                  desc: 'Minimal aesthetic',
                  gradient: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)',
                },
                {
                  id: 'on-model',
                  name: 'On Model',
                  desc: 'Professional studio',
                  gradient: 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)',
                },
                {
                  id: 'lifestyle',
                  name: 'Lifestyle',
                  desc: 'Natural everyday',
                  gradient: 'linear-gradient(135deg, #FFE5B4 0%, #FFA07A 100%)',
                },
                {
                  id: 'luxury',
                  name: 'Luxury',
                  desc: 'High-end editorial',
                  gradient: 'linear-gradient(135deg, #1A1A1A 0%, #4A4A4A 100%)',
                },
                {
                  id: 'close-up',
                  name: 'Close Up',
                  desc: 'Detail showcase',
                  gradient: 'linear-gradient(135deg, #C9ADA7 0%, #9A8C98 100%)',
                },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleApply(style.id)}
                  className="group overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all hover:border-purple-500/50 hover:bg-white/10 active:scale-95"
                >
                  <div
                    className="mb-2 h-16 rounded-lg"
                    style={{ background: style.gradient }}
                  />
                  <h4 className="font-semibold text-white">{style.name}</h4>
                  <p className="text-xs text-gray-400">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <MobileNav />
    </div>
  );
}

export default MobileStudio;
