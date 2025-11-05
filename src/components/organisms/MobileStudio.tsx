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

import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Download, X, Sliders } from 'lucide-react';
import { useImageEdit } from '@/hooks/useImageEdit';
import { logger } from '@/lib/logger';
import { presetPrompts } from '@/lib/preset-prompts';

interface MobileStudioProps {
  onBack?: () => void;
}

export function MobileStudio({ onBack }: MobileStudioProps) {
  const [image, setImage] = useState<string | null>(null);
  const [showStyleSheet, setShowStyleSheet] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { edit, isEditing } = useImageEdit({
    onSuccess: (result) => {
      if (result.images && result.images.length > 0) {
        setImage(result.images[0].url);
        logger.info('[MobileStudio] AI edit successful');
      }
    },
    onError: (error) => {
      logger.error('[MobileStudio] AI edit failed:', error);
      alert(`Edit failed: ${error.message}`);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImage(result);
    };
    reader.readAsDataURL(file);
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
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/50 p-4 backdrop-blur-xl">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Sparkles className="h-5 w-5 text-purple-400" />
          Jewelshot Studio
        </h1>

        {image && (
          <button
            onClick={handleDownload}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white transition-all hover:bg-purple-600 active:scale-95"
            aria-label="Download image"
          >
            <Download className="h-5 w-5" />
          </button>
        )}

        {!image && <div className="h-10 w-10" />}
      </div>

      {/* Canvas Area */}
      <div className="relative flex-1 overflow-hidden">
        {!image ? (
          /* Upload State */
          <div className="flex h-full flex-col items-center justify-center p-6">
            <div className="mb-6 rounded-2xl bg-purple-500/20 p-6">
              <Upload className="h-16 w-16 text-purple-400" />
            </div>

            <h2 className="mb-2 text-xl font-bold text-white">
              Upload Your Image
            </h2>

            <p className="mb-6 text-center text-white/70">
              Tap the button below to select a jewelry photo from your device
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-purple-500 px-8 py-4 font-medium text-white transition-all hover:bg-purple-600 active:scale-95"
            >
              Choose Photo
            </button>
          </div>
        ) : (
          /* Image Display */
          <div className="flex h-full items-center justify-center p-4">
            {isEditing && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                  <p className="text-sm text-white">Applying AI magic...</p>
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
        <div className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2">
          <div className="flex gap-4">
            {/* Upload New */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-xl transition-all hover:bg-white/10 active:scale-95"
              aria-label="Upload new image"
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
    </div>
  );
}

export default MobileStudio;
