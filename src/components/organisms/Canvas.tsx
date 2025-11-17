'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { useImageState } from '@/hooks/useImageState';
import { useImageTransform } from '@/hooks/useImageTransform';
import { useImageFilters } from '@/hooks/useImageFilters';
import { useCanvasUI } from '@/hooks/useCanvasUI';
import { useToast } from '@/hooks/useToast';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useImageEdit } from '@/hooks/useImageEdit';
import { useImageToVideo } from '@/hooks/useImageToVideo';
import { useImageUpscale } from '@/hooks/useImageUpscale';
import { useRemoveBackground } from '@/hooks/useRemoveBackground';
import { useCameraControl } from '@/hooks/useCameraControl';
import { useCanvasHandlers } from '@/hooks/useCanvasHandlers';
import { createScopedLogger } from '@/lib/logger';
import { saveImageToGallery } from '@/lib/gallery-storage';
import Toast from '@/components/atoms/Toast';
import { useCreditStore } from '@/store/creditStore';
import { VideoPlayerModal } from '@/components/molecules/VideoPlayerModal';
import { VideoGeneratingModal } from '@/components/molecules/VideoGeneratingModal';
import { QuickActionsBar } from '@/components/molecules/QuickActionsBar';

const logger = createScopedLogger('Canvas');
// New refactored components
import CanvasCore from './canvas/CanvasCore';
import CanvasControls from './canvas/CanvasControls';
import AIEditManager from './canvas/AIEditManager';
import CanvasModals from './canvas/CanvasModals';

interface CanvasProps {
  onPresetPrompt?: (prompt: string) => void;
}

export function Canvas({ onPresetPrompt }: CanvasProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    leftOpen,
    rightOpen,
    topOpen,
    bottomOpen,
    toggleAll,
    openLeft,
    closeLeft,
    openRight,
    closeRight,
    openTop,
    closeTop,
    openBottom,
    closeBottom,
  } = useSidebarStore();

  // Image upload state (extracted to hook)
  const {
    uploadedImage,
    setUploadedImage,
    fileName,
    setFileName,
    fileSize,
    setFileSize,
    isLoading,
    setIsLoading,
    resetImageState,
  } = useImageState();

  // Image transformation state (extracted to hook)
  const {
    scale,
    setScale,
    position,
    setPosition,
    transform,
    setTransform,
    resetTransform,
  } = useImageTransform();

  // Image filters state (extracted to hook)
  const {
    adjustFilters,
    setAdjustFilters,
    colorFilters,
    setColorFilters,
    filterEffects,
    setFilterEffects,
    resetFilters,
  } = useImageFilters();

  // Canvas UI state (extracted to hook)
  const {
    isFullscreen,
    setIsFullscreen,
    background,
    setBackground,
    cropRatio,
    setCropRatio,
    isCropMode,
    setIsCropMode,
    resetCropState,
  } = useCanvasUI();

  // Canvas-specific UI state (not extracted)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [savedBarStates, setSavedBarStates] = useState({
    left: false,
    right: false,
    top: false,
    bottom: false,
  });
  const [canvasControlsVisible, setCanvasControlsVisible] = useState(true);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  // Toast notifications
  const { showToast, hideToast, toastState } = useToast();

  // Credit store
  const { deductCredit, fetchCredits } = useCreditStore();

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // AI Image Edit & Comparison
  // Track AI image loading state
  const [isAIImageLoading, setIsAIImageLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'side-by-side'>('normal');

  // Independent states for side-by-side comparison
  const [leftImageScale, setLeftImageScale] = useState(1.0);
  const [leftImagePosition, setLeftImagePosition] = useState({ x: 0, y: 0 });
  const [rightImageScale, setRightImageScale] = useState(1.0);
  const [rightImagePosition, setRightImagePosition] = useState({ x: 0, y: 0 });
  const [activeImage, setActiveImage] = useState<'left' | 'right'>('right'); // Which image is on top

  const {
    edit: editWithAI,
    isEditing: isAIEditing,
    progress: aiProgress,
  } = useImageEdit({
    onSuccess: async (result) => {
      if (result.images && result.images.length > 0) {
        setIsAIImageLoading(true); // Start loading overlay
        const aiImageUrl = result.images[0].url;
        setUploadedImage(aiImageUrl);
        showToast('Image edited successfully!', 'success');

        // 🎯 AUTO-SAVE to gallery
        try {
          await saveImageToGallery(
            aiImageUrl,
            fileName || 'ai-generated-image.jpg',
            'ai-edited',
            {
              style: 'AI Enhanced',
            }
          );

          // Dispatch custom event for gallery sync
          window.dispatchEvent(new Event('gallery-updated'));

          logger.info('✅ AI-generated image auto-saved to gallery');
          showToast('Saved to gallery!', 'success');
        } catch (error) {
          logger.error('Failed to auto-save to gallery:', error);
          // Don't show error toast - image generation was successful
          // User can manually save from Save button if needed
        }
      }
    },
    onError: (error) => {
      setIsAIImageLoading(false); // Clear loading state on error
      showToast(error.message || 'Failed to edit image', 'error');
    },
  });

  // Video Generation
  const {
    generateVideo,
    isGenerating: isGeneratingVideo,
    videoUrl,
    error: videoError,
    reset: resetVideo,
  } = useImageToVideo();

  const [showVideoModal, setShowVideoModal] = useState(false);

  // Image Upscale
  const {
    upscaleImage,
    isUpscaling,
    upscaledImageUrl,
    error: upscaleError,
  } = useImageUpscale();

  // Remove Background
  const {
    removeBackground,
    isProcessing: isRemovingBackground,
    processedImageUrl: removedBgImageUrl,
    error: removeBgError,
  } = useRemoveBackground();

  // Camera Control (Rotate Left/Right, Close-Up)
  const { applyCamera, error: cameraError } = useCameraControl();

  // Track individual camera operations
  const [isRotatingLeft, setIsRotatingLeft] = useState(false);
  const [isRotatingRight, setIsRotatingRight] = useState(false);
  const [isClosingUp, setIsClosingUp] = useState(false);

  // Handle video generation
  const handleGenerateVideo = useCallback(() => {
    if (!uploadedImage) {
      showToast('No image to convert to video', 'warning');
      return;
    }

    logger.info(
      '[Canvas] Starting video generation from image:',
      uploadedImage
    );

    generateVideo({
      image_url: uploadedImage,
      prompt:
        'Hand gently rotating ring, showcasing from different angles with natural movements.',
      duration: '8s',
      resolution: '720p', // 720p quality, aspect ratio auto-detected from image
    });
  }, [uploadedImage, generateVideo, showToast]);

  // Show video modal when generation completes
  useEffect(() => {
    if (videoUrl && !showVideoModal) {
      logger.info('[Canvas] Video generated, opening modal');
      queueMicrotask(() => {
        setShowVideoModal(true);
        showToast('✅ Video generated successfully!', 'success');
      });
    }
  }, [videoUrl, showVideoModal, showToast]);

  // Show error toast if video generation fails
  useEffect(() => {
    if (videoError) {
      logger.error('[Canvas] Video generation failed:', videoError);
      showToast(`❌ Video generation failed: ${videoError}`, 'error');
    }
  }, [videoError, showToast]);

  // Handle image upscale
  const handleUpscale = useCallback(() => {
    if (!uploadedImage) {
      showToast('No image to upscale', 'warning');
      return;
    }

    logger.info('[Canvas] Starting image upscale:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    upscaleImage({
      image_url: uploadedImage,
      upscale_mode: 'factor',
      upscale_factor: 2, // 2x upscale
      output_format: 'jpg',
    });
  }, [uploadedImage, originalImage, upscaleImage, showToast, setOriginalImage]);

  // Update canvas with upscaled image and enable comparison
  useEffect(() => {
    if (upscaledImageUrl) {
      logger.info('[Canvas] Upscaled image ready, updating canvas');
      queueMicrotask(() => {
        setUploadedImage(upscaledImageUrl);
        setViewMode('side-by-side'); // Enable comparison view
        showToast(
          '✅ Image upscaled successfully! Compare with original.',
          'success'
        );
      });
    }
  }, [upscaledImageUrl, setUploadedImage, setViewMode, showToast]);

  // Show error toast if upscale fails
  useEffect(() => {
    if (upscaleError) {
      logger.error('[Canvas] Image upscale failed:', upscaleError);
      showToast(`❌ Upscale failed: ${upscaleError}`, 'error');
    }
  }, [upscaleError, showToast]);

  // Handle remove background
  const handleRemoveBackground = useCallback(() => {
    if (!uploadedImage) {
      showToast('No image to process', 'warning');
      return;
    }

    logger.info('[Canvas] Starting background removal:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    removeBackground({
      image_url: uploadedImage,
      crop_to_bbox: false, // Keep original dimensions
    });
  }, [
    uploadedImage,
    originalImage,
    removeBackground,
    showToast,
    setOriginalImage,
  ]);

  // Update canvas with background-removed image and enable comparison
  useEffect(() => {
    if (removedBgImageUrl) {
      logger.info('[Canvas] Background removed, updating canvas');
      queueMicrotask(() => {
        setUploadedImage(removedBgImageUrl);
        setViewMode('side-by-side'); // Enable comparison view
        showToast(
          '✅ Background removed successfully! Compare with original.',
          'success'
        );
      });
    }
  }, [removedBgImageUrl, setUploadedImage, setViewMode, showToast]);

  // Show error toast if remove background fails
  useEffect(() => {
    if (removeBgError) {
      logger.error('[Canvas] Background removal failed:', removeBgError);
      showToast(`❌ Remove background failed: ${removeBgError}`, 'error');
    }
  }, [removeBgError, showToast]);

  // Handle rotate left
  const handleRotateLeft = useCallback(async () => {
    if (!uploadedImage) {
      showToast('No image to rotate', 'warning');
      return;
    }

    setIsRotatingLeft(true);
    logger.info('[Canvas] Starting rotate left:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    try {
      const result = await applyCamera(uploadedImage, 'rotate_left', 'product');
      if (result?.url) {
        setUploadedImage(result.url);
        setViewMode('side-by-side');
        showToast('✅ Rotated left', 'success');
      }
    } catch (err) {
      logger.error('[Canvas] Rotate left failed:', err);
    } finally {
      setIsRotatingLeft(false);
    }
  }, [
    uploadedImage,
    originalImage,
    applyCamera,
    showToast,
    setOriginalImage,
    setUploadedImage,
    setViewMode,
  ]);

  // Handle rotate right
  const handleRotateRight = useCallback(async () => {
    if (!uploadedImage) {
      showToast('No image to rotate', 'warning');
      return;
    }

    setIsRotatingRight(true);
    logger.info('[Canvas] Starting rotate right:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    try {
      const result = await applyCamera(
        uploadedImage,
        'rotate_right',
        'product'
      );
      if (result?.url) {
        setUploadedImage(result.url);
        setViewMode('side-by-side');
        showToast('✅ Rotated right', 'success');
      }
    } catch (err) {
      logger.error('[Canvas] Rotate right failed:', err);
    } finally {
      setIsRotatingRight(false);
    }
  }, [
    uploadedImage,
    originalImage,
    applyCamera,
    showToast,
    setOriginalImage,
    setUploadedImage,
    setViewMode,
  ]);

  // Handle close-up
  const handleCloseUp = useCallback(async () => {
    if (!uploadedImage) {
      showToast('No image for close-up', 'warning');
      return;
    }

    setIsClosingUp(true);
    logger.info('[Canvas] Starting close-up:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    try {
      const result = await applyCamera(uploadedImage, 'closeup', 'product');
      if (result?.url) {
        setUploadedImage(result.url);
        setViewMode('side-by-side');
        showToast('✅ Close-up created', 'success');
      }
    } catch (err) {
      logger.error('[Canvas] Close-up failed:', err);
    } finally {
      setIsClosingUp(false);
    }
  }, [
    uploadedImage,
    originalImage,
    applyCamera,
    showToast,
    setOriginalImage,
    setUploadedImage,
    setViewMode,
  ]);

  // Show error toast if camera control fails
  useEffect(() => {
    if (cameraError) {
      logger.error('[Canvas] Camera control failed:', cameraError);
      showToast(`❌ Camera control failed: ${cameraError}`, 'error');
    }
  }, [cameraError, showToast]);

  // Preset generation
  const handlePresetGeneration = useCallback(
    (prompt: string, aspectRatio?: string) => {
      if (!uploadedImage) {
        showToast('Please upload an image first', 'warning');
        return;
      }

      // Start generation with comprehensive prompt
      editWithAI({
        image_url: uploadedImage,
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
    },
    [uploadedImage, editWithAI, showToast]
  );

  // Expose generation handler via callback
  useEffect(() => {
    if (onPresetPrompt) {
      // Store reference for external trigger
      (
        window as Window & {
          __canvasPresetHandler?: (
            prompt: string,
            aspectRatio?: string
          ) => void;
        }
      ).__canvasPresetHandler = handlePresetGeneration;
    }
    return () => {
      delete (
        window as Window & {
          __canvasPresetHandler?: (
            prompt: string,
            aspectRatio?: string
          ) => void;
        }
      ).__canvasPresetHandler;
    };
  }, [onPresetPrompt, handlePresetGeneration]);

  // Canvas handlers (extracted to hook for better organization)
  const {
    handleUploadClick,
    handleFileChange,
    handleCloseImage,
    handleZoomIn,
    handleZoomOut,
    handleFitScreen,
    handleSave,
    handleDownload,
    handleDelete,
    toggleFullscreen,
  } = useCanvasHandlers({
    fileInputRef,
    uploadedImage,
    fileName,
    originalImage,
    setUploadedImage,
    setFileName,
    setFileSize,
    setIsLoading,
    setOriginalImage,
    resetImageState,
    scale,
    setScale,
    setPosition,
    resetTransform,
    isFullscreen,
    setIsFullscreen,
    isCropMode,
    adjustFilters,
    colorFilters,
    filterEffects,
    transform,
    viewMode,
    activeImage,
    leftImageScale,
    rightImageScale,
    leftImagePosition,
    rightImagePosition,
    setLeftImageScale,
    setRightImageScale,
    setLeftImagePosition,
    setRightImagePosition,
    showToast,
    openRight,
  });

  // Handle AI image load complete
  const handleAIImageLoad = useCallback(() => {
    setIsAIImageLoading(false);
  }, []);

  // Handle AI image load error
  const handleAIImageError = useCallback(() => {
    setIsAIImageLoading(false);
    showToast('Failed to load generated image', 'error');
  }, [showToast]);

  // Sync comparison states when switching view modes
  useEffect(() => {
    if (viewMode === 'side-by-side') {
      // Initialize side-by-side states with current values
      setLeftImageScale(scale);
      setLeftImagePosition(position);
      setRightImageScale(scale);
      setRightImagePosition(position);
      setActiveImage('right');
    } else {
      // Sync back to single state when switching to normal
      // Use right image state as the source (AI generated)
      setScale(rightImageScale);
      setPosition(rightImagePosition);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]); // Only run when viewMode changes

  // Update main zoom/position based on active image in compare mode
  useEffect(() => {
    if (viewMode === 'side-by-side') {
      if (activeImage === 'left') {
        setScale(leftImageScale);
        setPosition(leftImagePosition);
      } else {
        setScale(rightImageScale);
        setPosition(rightImagePosition);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeImage,
    leftImageScale,
    leftImagePosition,
    rightImageScale,
    rightImagePosition,
    viewMode,
  ]);

  // ============================================================================
  // FILE & ACTION HANDLERS - Moved to useCanvasHandlers hook
  // ============================================================================

  // The following handlers are now provided by useCanvasHandlers:
  // - handleUploadClick, handleFileChange, handleCloseImage
  // - handleZoomIn, handleZoomOut, handleFitScreen
  // - handleSave, handleDownload, handleDelete, toggleFullscreen

  // Load image from gallery via query param
  useEffect(() => {
    const imageUrl = searchParams.get('imageUrl');
    const imageName = searchParams.get('imageName');

    if (imageUrl && !uploadedImage) {
      try {
        // Check if it's a base64 data URL (from localStorage gallery)
        if (imageUrl.startsWith('data:')) {
          // Direct base64 - no need to fetch
          setUploadedImage(imageUrl);
          setFileName(imageName || 'gallery-image.jpg');

          // Estimate file size from base64 length
          const base64Data = imageUrl.split(',')[1] || '';
          const estimatedSize = (base64Data.length * 3) / 4; // Base64 to bytes
          setFileSize(estimatedSize);

          // Reset transformations and filters for fresh start
          resetTransform();
          resetFilters();

          showToast('Image loaded from gallery!', 'success');

          // Clear query params
          router.replace('/studio', { scroll: false });
        } else {
          // External URL - fetch it
          setIsLoading(true);

          fetch(imageUrl)
            .then((response) => response.blob())
            .then((blob) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                if (e.target?.result) {
                  setUploadedImage(e.target.result as string);
                  setFileName(imageName || 'gallery-image.jpg');
                  setFileSize(blob.size);
                  setIsLoading(false);

                  // Reset transformations and filters for fresh start
                  resetTransform();
                  resetFilters();

                  showToast('Image loaded from gallery!', 'success');

                  // Clear query params
                  router.replace('/studio', { scroll: false });
                }
              };
              reader.onerror = () => {
                setIsLoading(false);
                showToast('Failed to load image from gallery', 'error');
                router.replace('/studio', { scroll: false });
              };
              reader.readAsDataURL(blob);
            })
            .catch(() => {
              setIsLoading(false);
              showToast('Failed to fetch image from gallery', 'error');
              router.replace('/studio', { scroll: false });
            });
        }
      } catch (error) {
        logger.error('Failed to load image from gallery:', error);
        showToast('Failed to load image from gallery', 'error');
        setIsLoading(false);
        router.replace('/studio', { scroll: false });
      }
    }
  }, [
    searchParams,
    uploadedImage,
    router,
    setIsLoading,
    setUploadedImage,
    setFileName,
    setFileSize,
    resetTransform,
    resetFilters,
    showToast,
  ]);

  // ============================================================================
  // ZOOM, FULLSCREEN, SAVE, DOWNLOAD HANDLERS - Moved to useCanvasHandlers
  // ============================================================================

  // These handlers were moved to useCanvasHandlers hook:
  // - handleZoomIn, handleZoomOut, handleFitScreen (zoom controls)
  // - handleToggleFullscreen → toggleFullscreen (fullscreen control)
  // - handleDelete (delete confirmation)
  // - handleSave (save to gallery)
  // - handleDownload (download with filters applied)

  const handleToggleEditPanel = () => {
    setIsEditPanelOpen((prev) => !prev);
  };

  // Auto-collapse/restore bars when edit panel opens/closes
  useEffect(() => {
    // Only run this effect when image is uploaded (prevents flash during image change)
    if (!uploadedImage) return;

    if (isEditPanelOpen) {
      // Opening edit panel - save current bar states and collapse all
      setSavedBarStates({
        left: leftOpen,
        right: rightOpen,
        top: topOpen,
        bottom: bottomOpen,
      });

      // Collapse all bars
      closeLeft();
      closeRight();
      closeTop();
      closeBottom();

      // Push image to the right (EditPanel width 384px + smaller gap = 200px offset)
      setPosition((prev) => ({ ...prev, x: prev.x + 200 }));
    } else {
      // Edit panel closed - restore previous bar states (only if we have saved states)
      if (
        savedBarStates.left ||
        savedBarStates.right ||
        savedBarStates.top ||
        savedBarStates.bottom
      ) {
        if (savedBarStates.left) openLeft();
        else closeLeft();

        if (savedBarStates.right) openRight();
        else closeRight();

        if (savedBarStates.top) openTop();
        else closeTop();

        if (savedBarStates.bottom) openBottom();
        else closeBottom();
      }

      // Reset image to center position
      setPosition((prev) => ({ ...prev, x: 0 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditPanelOpen, uploadedImage]);

  const handleCropRatioChange = (ratio: number | null) => {
    setCropRatio(ratio);
    setIsCropMode(true);
  };

  const handleCropApply = (croppedImage: string) => {
    setUploadedImage(croppedImage);
    resetCropState(); // Reset crop mode and ratio
    resetTransform(); // Reset scale, position, transform after crop
  };

  const handleCropCancel = () => {
    resetCropState(); // Reset crop mode and ratio
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [setIsFullscreen]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    // Ctrl+O: Open file
    {
      key: 'o',
      ctrl: true,
      handler: () => {
        if (!isLoading) {
          handleUploadClick();
        }
      },
      preventDefault: true,
    },
    // Ctrl+S: Save/Download
    {
      key: 's',
      ctrl: true,
      handler: () => {
        if (uploadedImage) {
          handleDownload();
        }
      },
      preventDefault: true,
    },
    // + or =: Zoom in
    {
      key: '+',
      handler: () => {
        if (uploadedImage) {
          handleZoomIn();
        }
      },
    },
    {
      key: '=',
      handler: () => {
        if (uploadedImage) {
          handleZoomIn();
        }
      },
    },
    // -: Zoom out
    {
      key: '-',
      handler: () => {
        if (uploadedImage) {
          handleZoomOut();
        }
      },
    },
    // 0: Fit to screen
    {
      key: '0',
      handler: () => {
        if (uploadedImage) {
          handleFitScreen();
        }
      },
    },
    // Escape: Close edit panel or crop modal
    {
      key: 'Escape',
      handler: () => {
        if (isCropMode) {
          handleCropCancel();
        } else if (isEditPanelOpen) {
          setIsEditPanelOpen(false);
        }
      },
    },
    // Delete/Backspace: Close image
    {
      key: 'Delete',
      handler: () => {
        if (uploadedImage && !isCropMode) {
          handleCloseImage();
        }
      },
    },
    {
      key: 'Backspace',
      handler: () => {
        if (uploadedImage && !isCropMode) {
          handleCloseImage();
        }
      },
    },
    // F: Toggle fullscreen
    {
      key: 'f',
      handler: () => {
        if (uploadedImage) {
          toggleFullscreen();
        }
      },
    },
    // E: Toggle edit panel
    {
      key: 'e',
      handler: () => {
        if (uploadedImage && !isCropMode) {
          setIsEditPanelOpen((prev) => !prev);
        }
      },
    },
    // C: Toggle canvas controls
    {
      key: 'c',
      handler: () => {
        if (uploadedImage) {
          setCanvasControlsVisible((prev) => !prev);
        }
      },
    },
    // ?: Show keyboard shortcuts
    {
      key: '?',
      handler: () => {
        setShowKeyboardHelp(true);
      },
    },
  ]);

  // Listen for AI edit generation events from AIEditControl
  const handleAIEditGenerate = useCallback(
    async (event: CustomEvent) => {
      const { prompt, imageUrl } = event.detail;
      if (!imageUrl) return;

      let creditDeducted = false;

      try {
        // Try to deduct credit (but don't block if it fails)
        const success = await deductCredit({
          prompt: prompt || 'enhance',
          style: 'ai-edit',
        });

        if (success) {
          creditDeducted = true;
          logger.info('[Canvas] Credit deducted successfully');
        } else {
          logger.warn('[Canvas] Credit deduction failed, continuing anyway');
        }

        // Save original image before AI editing
        setOriginalImage(imageUrl);

        editWithAI({
          prompt: prompt || 'enhance the image quality and lighting',
          image_url: imageUrl,
          num_images: 1,
          output_format: 'jpeg',
        });
      } catch (error) {
        logger.error('[Canvas] AI generation failed:', error);
        showToast('Failed to generate image', 'error');

        // Refund credit if generation failed AFTER deduction
        if (creditDeducted) {
          logger.warn('[Canvas] Refunding credit due to generation failure');
          try {
            await fetch('/api/credits/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount: 1,
                type: 'refund',
                description: 'Refund: AI generation failed',
                metadata: {
                  error: error instanceof Error ? error.message : 'Unknown',
                  prompt: prompt || 'enhance',
                },
              }),
            });
            // Refresh credits after refund
            const { fetchCredits } = useCreditStore.getState();
            await fetchCredits();
            showToast('Credit refunded due to generation failure', 'info');
          } catch (refundError) {
            logger.error('[Canvas] Failed to refund credit:', refundError);
          }
        }
      }
    },
    [deductCredit, editWithAI, showToast]
  );

  useEffect(() => {
    const eventHandler = handleAIEditGenerate as unknown as EventListener;
    window.addEventListener('ai-edit-generate', eventHandler);
    return () => {
      window.removeEventListener('ai-edit-generate', eventHandler);
    };
  }, [handleAIEditGenerate]);

  // Smooth zoom transition when view mode changes
  useEffect(() => {
    // Reset zoom to fit screen when switching view modes
    // This ensures smooth transition instead of jarring jump
    if (uploadedImage) {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    }
  }, [viewMode, uploadedImage, setScale, setPosition]);

  const allBarsOpen = leftOpen && rightOpen && topOpen && bottomOpen;

  const leftPos = leftOpen ? 260 : 0;
  const rightPos = rightOpen ? 260 : 0;
  const topPos = topOpen ? 64 : 0;
  const bottomPos = bottomOpen ? 40 : 0;

  // Minimal padding to prevent overlap with controls only
  // Use equal padding on both sides to keep image centered
  const minHorizontalPadding = Math.min(
    leftOpen ? 48 : 16,
    rightOpen ? 48 : 16
  );

  // Calculate bottom padding to stay aligned with AI Edit Control (generate button)
  // AI Edit Control position: bottom: bottomOpen ? 56px : 16px
  const aiEditControlBottom = bottomOpen ? 56 : 16;
  const aiEditControlHeight = 50; // Approximate height of generate button
  const aiEditControlSpacing = bottomOpen ? 0 : 12; // Extra spacing only when bottom bar is closed
  const promptAreaHeight = isPromptExpanded ? 110 : 0; // Height of expanded prompt area (textarea ~60px + quick buttons ~40px + gap ~8px)
  const promptAreaSpacing = isPromptExpanded ? 8 : 0; // Gap between prompt area and generate button

  const imagePadding = {
    top: canvasControlsVisible ? 80 : 16,
    left: canvasControlsVisible ? minHorizontalPadding : 16,
    right: canvasControlsVisible ? minHorizontalPadding : 16,
    bottom: canvasControlsVisible
      ? aiEditControlBottom +
        aiEditControlHeight +
        aiEditControlSpacing +
        promptAreaHeight +
        promptAreaSpacing
      : 16,
  };

  const backgroundStyles = {
    none: {},
    black: { backgroundColor: '#000000' },
    gray: { backgroundColor: '#808080' },
    white: { backgroundColor: '#ffffff' },
    alpha: {
      backgroundImage:
        'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
      backgroundSize: '16px 16px',
      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
      backgroundColor: '#ffffff',
    },
  };

  // NEW CANVAS.TSX RETURN STATEMENT (after line 698)

  return (
    <>
      {/* File Input (keep - needed for file uploads) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ===================================================================
          REFACTORED: Canvas Core - Image Rendering Engine
          ================================================================= */}
      <CanvasCore
        uploadedImage={uploadedImage}
        originalImage={originalImage}
        isLoading={isLoading}
        isAIEditing={isAIEditing}
        isAIImageLoading={isAIImageLoading}
        aiProgress={aiProgress}
        viewMode={viewMode}
        activeImage={activeImage}
        onActiveImageChange={setActiveImage}
        scale={scale}
        position={position}
        onScaleChange={setScale}
        onPositionChange={setPosition}
        leftImageScale={leftImageScale}
        leftImagePosition={leftImagePosition}
        onLeftImageScaleChange={setLeftImageScale}
        onLeftImagePositionChange={setLeftImagePosition}
        rightImageScale={rightImageScale}
        rightImagePosition={rightImagePosition}
        onRightImageScaleChange={setRightImageScale}
        onRightImagePositionChange={setRightImagePosition}
        transform={transform}
        adjustFilters={adjustFilters}
        colorFilters={colorFilters}
        filterEffects={filterEffects}
        background={background}
        canvasControlsVisible={canvasControlsVisible}
        leftPos={leftPos}
        rightPos={rightPos}
        topPos={topPos}
        bottomPos={bottomPos}
        imagePadding={imagePadding}
        backgroundStyles={backgroundStyles}
        onImageLoad={handleAIImageLoad}
        onImageError={handleAIImageError}
        onUploadClick={handleUploadClick}
      />

      {/* ===================================================================
          REFACTORED: Canvas Controls - All UI Controls
          ================================================================= */}
      {uploadedImage && (
        <CanvasControls
          hasImage={!!uploadedImage}
          fileName={fileName}
          fileSize={fileSize}
          isAIEditing={isAIEditing}
          aiProgress={aiProgress}
          scale={scale}
          leftImageScale={leftImageScale}
          rightImageScale={rightImageScale}
          viewMode={viewMode}
          activeImage={activeImage}
          hasOriginalImage={!!originalImage}
          leftOpen={leftOpen}
          rightOpen={rightOpen}
          topOpen={topOpen}
          bottomOpen={bottomOpen}
          allBarsOpen={allBarsOpen}
          controlsVisible={canvasControlsVisible}
          isFullscreen={isFullscreen}
          isEditPanelOpen={isEditPanelOpen}
          background={background}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitScreen={handleFitScreen}
          onToggleAllBars={toggleAll}
          onToggleFullscreen={toggleFullscreen}
          onToggleUI={() => setCanvasControlsVisible(!canvasControlsVisible)}
          onToggleEditPanel={handleToggleEditPanel}
          onCloseImage={handleCloseImage}
          onDelete={handleDelete}
          onSave={handleSave}
          onDownload={handleDownload}
          onBackgroundChange={setBackground}
          onViewModeChange={setViewMode}
          onImageEdited={(url) => setUploadedImage(url)}
          onAIError={(error) => showToast(error.message, 'error')}
          onPromptExpandedChange={setIsPromptExpanded}
          currentImageUrl={uploadedImage || ''}
          onGenerateVideo={handleGenerateVideo}
          isGeneratingVideo={isGeneratingVideo}
        />
      )}

      {/* ===================================================================
          REFACTORED: AI Edit Manager - AI Generation Logic
          ================================================================= */}
      <AIEditManager
        fileName={fileName}
        onImageUpdate={setUploadedImage}
        onOriginalImageSet={setOriginalImage}
        onLoadingChange={setIsAIImageLoading}
        onSuccess={(msg) => showToast(msg, 'success')}
        onError={(msg) => showToast(msg, 'error')}
      />

      {/* ===================================================================
          Quick Actions Bar - All Image Operations
          ================================================================= */}
      {uploadedImage && canvasControlsVisible && (
        <QuickActionsBar
          onUpscale={handleUpscale}
          isUpscaling={isUpscaling}
          onRemoveBackground={handleRemoveBackground}
          isRemovingBackground={isRemovingBackground}
          onRotateLeft={handleRotateLeft}
          isRotatingLeft={isRotatingLeft}
          onRotateRight={handleRotateRight}
          isRotatingRight={isRotatingRight}
          onCloseUp={handleCloseUp}
          isClosingUp={isClosingUp}
          hasActiveImage={!!uploadedImage}
          isRightSidebarOpen={rightOpen}
          isTopBarOpen={topOpen}
          controlsVisible={canvasControlsVisible}
        />
      )}

      {/* ===================================================================
          REFACTORED: Canvas Modals - All Modal Components
          ================================================================= */}
      <CanvasModals
        isCropMode={isCropMode}
        cropRatio={cropRatio}
        uploadedImage={uploadedImage}
        onCropApply={handleCropApply}
        onCropCancel={handleCropCancel}
        showKeyboardHelp={showKeyboardHelp}
        onCloseKeyboardHelp={() => setShowKeyboardHelp(false)}
        isEditPanelOpen={isEditPanelOpen}
        onEditPanelClose={() => setIsEditPanelOpen(false)}
        leftOpen={leftOpen}
        topOpen={topOpen}
        onCropRatioChange={handleCropRatioChange}
        transform={transform}
        onTransformChange={(transformData) => {
          setTransform({
            rotation: transformData.rotation,
            flipHorizontal: transformData.flipHorizontal,
            flipVertical: transformData.flipVertical,
          });
        }}
        adjustFilters={adjustFilters}
        onAdjustFiltersChange={(filters) => {
          setAdjustFilters({
            brightness: filters.brightness,
            contrast: filters.contrast,
            exposure: filters.exposure,
            highlights: filters.highlights,
            shadows: filters.shadows,
            whites: filters.whites,
            blacks: filters.blacks,
            clarity: filters.clarity,
            sharpness: filters.sharpness,
            dehaze: filters.dehaze,
          });
        }}
        colorFilters={colorFilters}
        onColorFiltersChange={(filters) => {
          setColorFilters({
            temperature: filters.temperature || 0,
            tint: filters.tint || 0,
            saturation: filters.saturation || 0,
            vibrance: filters.vibrance || 0,
          });
        }}
        filterEffects={filterEffects}
        onFilterEffectsChange={(effects) => {
          setFilterEffects({
            vignetteAmount: effects.vignetteAmount || 0,
            vignetteSize: effects.vignetteSize || 50,
            vignetteFeather: effects.vignetteFeather || 50,
            grainAmount: effects.grainAmount || 0,
            grainSize: effects.grainSize || 50,
            fadeAmount: effects.fadeAmount || 0,
          });
        }}
        isLoading={isLoading}
      />

      {/* Video Generating Modal */}
      <VideoGeneratingModal isVisible={isGeneratingVideo} error={videoError} />

      {/* Video Player Modal */}
      {showVideoModal && videoUrl && (
        <VideoPlayerModal
          videoUrl={videoUrl}
          onClose={() => {
            setShowVideoModal(false);
            resetVideo();
          }}
        />
      )}

      {/* Toast Notifications (managed by useToast hook) */}
      {toastState.visible && (
        <Toast
          message={toastState.message}
          type={toastState.type}
          onClose={hideToast}
          isTopBarOpen={topOpen}
          isRightSidebarOpen={rightOpen}
        />
      )}
    </>
  );
}

export default Canvas;
