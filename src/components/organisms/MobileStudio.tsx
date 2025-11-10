/**
 * Premium Mobile Studio Component
 * Native app-inspired mobile interface with dark premium theme
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Sparkles,
  Download,
  Camera,
  Share2,
  Trash2,
  ImagePlus,
} from 'lucide-react';
import { useImageEdit } from '@/hooks/useImageEdit';
import { logger } from '@/lib/logger';
import { presetPrompts } from '@/lib/preset-prompts';
import { saveImageToGallery } from '@/lib/gallery-storage';
import { useCreditStore } from '@/store/creditStore';
import { premiumTheme } from '@/styles/mobile-premium';
import { FloatingActionButton } from '@/components/atoms/FloatingActionButton';
import { PremiumButton } from '@/components/atoms/PremiumButton';
import { GestureSheet } from '@/components/molecules/GestureSheet';
import { StyleCard } from '@/components/atoms/StyleCard';
import { PremiumLoader } from '@/components/atoms/PremiumLoader';
import { PremiumBottomNav } from '@/components/molecules/PremiumBottomNav';

const STORAGE_KEY = 'jewelshot_mobile_image';

// Style presets with gradients
const stylePresets = [
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated and refined look',
    gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Premium gold and dark tones',
    gradient: 'linear-gradient(135deg, #FFD89B 0%, #19547B 100%)',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary aesthetic',
    gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Classic timeless appeal',
    gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast and bold shadows',
    gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Soft and authentic lighting',
    gradient: 'linear-gradient(135deg, #30CFD0 0%, #330867 100%)',
  },
];

export function MobileStudio() {
  // State
  const [image, setImage] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) logger.info('[MobileStudio] Loaded saved image');
      return saved;
    }
    return null;
  });
  const [showStyleSheet, setShowStyleSheet] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [smoothProgress, setSmoothProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Credit store
  const { deductCredit, fetchCredits } = useCreditStore();

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Image editing hook
  const { edit, isEditing, progress } = useImageEdit({
    onSuccess: async (result) => {
      if (result.images && result.images.length > 0) {
        const newImage = result.images[0].url;
        setImage(newImage);
        localStorage.setItem(STORAGE_KEY, newImage);
        logger.info('[MobileStudio] AI edit successful');

        // Auto-save to gallery
        try {
          await saveImageToGallery(
            newImage,
            `mobile-${Date.now()}.jpg`,
            'ai-edited'
          );
          window.dispatchEvent(new CustomEvent('gallery-updated'));
        } catch (error) {
          logger.error('[MobileStudio] Failed to save to gallery:', error);
        }
      }
    },
    onError: (error) => {
      logger.error('[MobileStudio] AI edit failed:', error);
    },
  });

  // Smooth progress animation
  useEffect(() => {
    if (!isEditing) {
      // Clear interval and reset when not editing
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

  // Reset progress when editing completes (via result callback)
  useEffect(() => {
    if (!isEditing) {
      const timer = setTimeout(() => setSmoothProgress(0), 300);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

  // Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
      localStorage.setItem(STORAGE_KEY, dataUrl);
      setShowUploadOptions(false);
      logger.info('[MobileStudio] Image uploaded');
    };
    reader.readAsDataURL(file);
  };

  const handleStyleApply = useCallback(
    async (presetId: string) => {
      if (!image) return;

      setShowStyleSheet(false);
      let creditDeducted = false;

      try {
        const success = await deductCredit({
          prompt: presetId,
          style: presetId,
        });

        if (success) {
          creditDeducted = true;
          logger.info('[MobileStudio] Credit deducted');
        } else {
          logger.warn('[MobileStudio] Credit deduction failed, continuing');
        }

        const preset = presetPrompts[presetId];
        if (!preset) {
          logger.error('[MobileStudio] Unknown preset:', presetId);
          if (creditDeducted) {
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
          }
          return;
        }

        const prompt = preset.buildPrompt('ring', undefined, '9:16');
        await edit({ image_url: image, prompt });
      } catch (error) {
        logger.error('[MobileStudio] Style application failed:', error);

        if (creditDeducted) {
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
            fetchCredits();
          } catch (refundError) {
            logger.error('[MobileStudio] Refund failed:', refundError);
          }
        }
      }
    },
    [image, deductCredit, edit, fetchCredits]
  );

  const handleDownload = () => {
    if (!image) return;

    const link = document.createElement('a');
    link.href = image;
    link.download = `jewelshot-${Date.now()}.jpg`;
    link.click();
    logger.info('[MobileStudio] Image downloaded');
  };

  const handleShare = async () => {
    if (!image) return;

    try {
      const blob = await fetch(image).then((r) => r.blob());
      const file = new File([blob], 'jewelshot.jpg', { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'JewelShot Creation',
          text: 'Check out my AI-edited jewelry photo!',
        });
        logger.info('[MobileStudio] Image shared');
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/jpeg': blob }),
        ]);
        alert('Image copied to clipboard!');
      }
    } catch (error) {
      logger.error('[MobileStudio] Share failed:', error);
      alert('Unable to share image');
    }
  };

  const handleClear = () => {
    setImage(null);
    localStorage.removeItem(STORAGE_KEY);
    logger.info('[MobileStudio] Image cleared');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: premiumTheme.colors.bg.primary,
        position: 'relative',
        fontFamily: premiumTheme.typography.fontFamily.primary,
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
      }}
    >
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* Main Content Area */}
      <div
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: premiumTheme.spacing.lg,
        }}
      >
        {!image && !isEditing ? (
          /* Empty State - Premium Upload */
          <div
            style={{
              textAlign: 'center',
              maxWidth: '400px',
              padding: premiumTheme.spacing.xl,
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                margin: '0 auto',
                borderRadius: premiumTheme.radius.full,
                background: premiumTheme.colors.gradient.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: premiumTheme.spacing.xl,
                boxShadow: premiumTheme.shadow.glowStrong,
              }}
            >
              <ImagePlus size={56} color={premiumTheme.colors.text.primary} />
            </div>

            <h1
              style={{
                fontSize: premiumTheme.typography.fontSize.xxxl,
                fontWeight: premiumTheme.typography.fontWeight.bold,
                color: premiumTheme.colors.text.primary,
                marginBottom: premiumTheme.spacing.md,
                background: premiumTheme.colors.gradient.glow,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Create Magic
            </h1>

            <p
              style={{
                fontSize: premiumTheme.typography.fontSize.base,
                color: premiumTheme.colors.text.secondary,
                marginBottom: premiumTheme.spacing.xxl,
                lineHeight: premiumTheme.typography.lineHeight.relaxed,
              }}
            >
              Upload a jewelry photo and transform it with AI-powered styles
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: premiumTheme.spacing.md,
              }}
            >
              <PremiumButton
                variant="primary"
                size="lg"
                fullWidth
                icon={<Camera size={20} />}
                onClick={() => cameraInputRef.current?.click()}
              >
                Take Photo
              </PremiumButton>

              <PremiumButton
                variant="secondary"
                size="lg"
                fullWidth
                icon={<Upload size={20} />}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload from Gallery
              </PremiumButton>
            </div>
          </div>
        ) : isEditing ? (
          /* Loading State - Premium */
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: premiumTheme.spacing.xl,
              textAlign: 'center',
            }}
          >
            <PremiumLoader
              variant="progress"
              progress={smoothProgress}
              text="Applying AI magic..."
            />

            <div
              style={{
                marginTop: premiumTheme.spacing.xxxl,
                padding: premiumTheme.spacing.xl,
                background: premiumTheme.colors.bg.tertiary,
                borderRadius: premiumTheme.radius.xl,
                border: `1px solid ${premiumTheme.colors.border.default}`,
              }}
            >
              <p
                style={{
                  fontSize: premiumTheme.typography.fontSize.sm,
                  color: premiumTheme.colors.text.secondary,
                  margin: 0,
                  lineHeight: premiumTheme.typography.lineHeight.relaxed,
                }}
              >
                Our AI is crafting your perfect image. This usually takes 15-30
                seconds.
              </p>
            </div>
          </div>
        ) : (
          /* Image Display */
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              borderRadius: premiumTheme.radius.xl,
              overflow: 'hidden',
              boxShadow: `${premiumTheme.shadow.xl}, 0 0 60px rgba(102, 126, 234, 0.3)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image || ''}
              alt="Jewelry image"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      {image && !isEditing && (
        <>
          <FloatingActionButton
            icon={<Sparkles size={24} />}
            position="bottom-right"
            size="lg"
            variant="primary"
            onClick={() => setShowStyleSheet(true)}
          />

          <FloatingActionButton
            icon={<Download size={20} />}
            position="bottom-left"
            size="md"
            variant="secondary"
            onClick={handleDownload}
          />

          <div
            style={{
              position: 'fixed',
              top: premiumTheme.spacing.lg,
              right: premiumTheme.spacing.lg,
              display: 'flex',
              gap: premiumTheme.spacing.sm,
              zIndex: premiumTheme.zIndex.sticky,
            }}
          >
            <button
              onClick={handleShare}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: premiumTheme.radius.full,
                background: premiumTheme.colors.bg.glass,
                backdropFilter: premiumTheme.blur.md,
                border: `1px solid ${premiumTheme.colors.border.glass}`,
                color: premiumTheme.colors.text.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: `all ${premiumTheme.animation.duration.fast} ease`,
              }}
            >
              <Share2 size={20} />
            </button>

            <button
              onClick={handleClear}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: premiumTheme.radius.full,
                background: premiumTheme.colors.bg.glass,
                backdropFilter: premiumTheme.blur.md,
                border: `1px solid ${premiumTheme.colors.border.glass}`,
                color: premiumTheme.colors.status.error,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: `all ${premiumTheme.animation.duration.fast} ease`,
              }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </>
      )}

      {/* Style Selection Sheet */}
      <GestureSheet
        isOpen={showStyleSheet}
        onClose={() => setShowStyleSheet(false)}
        title="Choose Your Style"
        subtitle="Select an AI style to transform your jewelry photo"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: premiumTheme.spacing.md,
          }}
        >
          {stylePresets.map((preset) => (
            <StyleCard
              key={preset.id}
              id={preset.id}
              name={preset.name}
              description={preset.description}
              previewGradient={preset.gradient}
              isSelected={selectedStyle === preset.id}
              onClick={(id) => {
                setSelectedStyle(id);
                setTimeout(() => handleStyleApply(id), 150);
              }}
            />
          ))}
        </div>
      </GestureSheet>

      {/* Upload Options Sheet */}
      <GestureSheet
        isOpen={showUploadOptions}
        onClose={() => setShowUploadOptions(false)}
        title="Add Image"
        subtitle="Choose how to add your jewelry photo"
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: premiumTheme.spacing.md,
          }}
        >
          <PremiumButton
            variant="primary"
            size="lg"
            fullWidth
            icon={<Camera size={20} />}
            onClick={() => {
              cameraInputRef.current?.click();
              setShowUploadOptions(false);
            }}
          >
            Take Photo
          </PremiumButton>

          <PremiumButton
            variant="secondary"
            size="lg"
            fullWidth
            icon={<Upload size={20} />}
            onClick={() => {
              fileInputRef.current?.click();
              setShowUploadOptions(false);
            }}
          >
            Upload from Gallery
          </PremiumButton>
        </div>
      </GestureSheet>

      {/* Bottom Navigation */}
      <PremiumBottomNav />
    </div>
  );
}

export default MobileStudio;
