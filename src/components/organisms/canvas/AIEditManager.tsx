/**
 * =============================================================================
 * AI EDIT MANAGER - AI Generation Logic
 * =============================================================================
 *
 * Handles:
 * - AI image generation/editing (via useImageEdit hook)
 * - Auto-save to gallery after successful generation
 * - AI edit event listeners (from AIEditControl)
 * - Success/error handling
 *
 * This is an invisible component (no UI rendering)
 *
 * Extracted from Canvas.tsx (1,130 lines → maintainable components)
 */

'use client';

import { useEffect } from 'react';
import { useImageEdit } from '@/hooks/useImageEdit';
import { saveImageToGallery } from '@/lib/gallery-storage';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('AIEditManager');

/**
 * Props for AIEditManager component
 */
export interface AIEditManagerProps {
  // Image state
  fileName: string;

  // Callbacks
  onImageUpdate: (imageUrl: string) => void;
  onOriginalImageSet: (imageUrl: string) => void;
  onLoadingChange: (loading: boolean) => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

/**
 * AIEditManager: Manages AI generation logic
 *
 * This component doesn't render anything (return null)
 * It only manages AI generation state and side effects
 */
export default function AIEditManager({
  fileName,
  onImageUpdate,
  onOriginalImageSet,
  onLoadingChange,
  onSuccess,
  onError,
}: AIEditManagerProps) {
  // AI Edit hook with auto-save
  const { edit: editWithAI } = useImageEdit({
    onSuccess: async (result) => {
      if (result.images && result.images.length > 0) {
        onLoadingChange(true); // Start loading overlay
        const aiImageUrl = result.images[0].url;
        onSuccess('Image edited successfully!');

        // 🎯 AUTO-SAVE to gallery & get stable URL
        try {
          const savedImage = await saveImageToGallery(
            aiImageUrl,
            fileName || 'ai-generated-image.jpg',
            'ai-edited',
            {
              style: 'AI Enhanced',
            }
          );

          // Use the stable Supabase Storage URL for canvas display
          onImageUpdate(savedImage.src);
          onLoadingChange(false);

          // Dispatch custom event for gallery sync
          window.dispatchEvent(new Event('gallery-updated'));

          logger.info('✅ AI-generated image auto-saved to gallery');
          onSuccess('Saved to gallery!');
        } catch (error) {
          logger.error('Failed to auto-save to gallery:', error);
          // Fallback: use original AI URL if gallery save fails
          onImageUpdate(aiImageUrl);
          onLoadingChange(false);
        }
      }
    },
    onError: (error) => {
      onLoadingChange(false); // Clear loading state on error
      onError(error.message || 'Failed to edit image');
    },
  });

  // Listen for AI edit generation events from AIEditControl
  useEffect(() => {
    const handleAIEditGenerate = (event: CustomEvent) => {
      const { prompt, imageUrl, aspectRatio } = event.detail;
      if (imageUrl) {
        // Save original image before AI editing
        onOriginalImageSet(imageUrl);

        // Start AI generation
        editWithAI({
          prompt: prompt || 'enhance the image quality and lighting',
          image_url: imageUrl,
          num_images: 1,
          output_format: 'jpeg',
          aspect_ratio: aspectRatio || 'auto', // Use aspect ratio from event or default to 'auto'
        });
      }
    };

    window.addEventListener(
      'ai-edit-generate',
      handleAIEditGenerate as EventListener
    );

    return () => {
      window.removeEventListener(
        'ai-edit-generate',
        handleAIEditGenerate as EventListener
      );
    };
  }, [editWithAI, onOriginalImageSet]);

  // This component doesn't render anything
  return null;
}
