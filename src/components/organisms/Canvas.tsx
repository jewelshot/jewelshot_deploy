'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { useImageState } from '@/hooks/useImageState';
import { useImageTransform } from '@/hooks/useImageTransform';
import { useImageFilters } from '@/hooks/useImageFilters';
import { useCanvasUI } from '@/hooks/useCanvasUI';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useImageEdit } from '@/hooks/useImageEdit';
import { useImageToVideo } from '@/hooks/useImageToVideo';
import { useImageUpscale } from '@/hooks/useImageUpscale';
import { useRemoveBackground } from '@/hooks/useRemoveBackground';
import { useGemstoneEnhance } from '@/hooks/useGemstoneEnhance';
import { useMetalRecolor, MetalType } from '@/hooks/useMetalRecolor';
import { useMetalPolish } from '@/hooks/useMetalPolish';
import { useNaturalLight } from '@/hooks/useNaturalLight';
import { useTurntableVideo } from '@/hooks/useTurntableVideo';
import { useCameraControl } from '@/hooks/useCameraControl';
import { useCanvasHandlers } from '@/hooks/useCanvasHandlers';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { createScopedLogger } from '@/lib/logger';
import { saveImageToGallery } from '@/lib/gallery-storage';
import { toastManager } from '@/lib/toast-manager';
import { useCreditStore } from '@/store/creditStore';
import { VideoPlayerModal } from '@/components/molecules/VideoPlayerModal';
import { VideoGeneratingModal } from '@/components/molecules/VideoGeneratingModal';
import { QuickActionsBar } from '@/components/molecules/QuickActionsBar';
import { saveCanvasState, loadCanvasState } from '@/lib/canvas-state-storage';

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

  // Canvas History for Undo/Redo/Reset
  const {
    pushHistory,
    undo,
    redo,
    reset: resetHistory,
    canUndo,
    canRedo,
  } = useCanvasHistory();

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

  // Toast notifications - now handled by toastManager in BottomBar

  // Credit store
  const { fetchCredits } = useCreditStore();

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
        toastManager.success('Image edited successfully!');

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
          toastManager.success('Saved to gallery!');
        } catch (error) {
          logger.error('Failed to auto-save to gallery:', error);
          // Don't show error toast - image generation was successful
          // User can manually save from Save button if needed
        }
      }
    },
    onError: (error) => {
      setIsAIImageLoading(false); // Clear loading state on error
      toastManager.error(error.message || 'Failed to edit image');
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
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);

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

  // Gemstone Enhancement
  const {
    enhanceGemstones,
    isEnhancing: isEnhancingGemstones,
    enhancedImageUrl: gemstoneEnhancedImageUrl,
    error: gemstoneEnhanceError,
  } = useGemstoneEnhance();

  // Metal Recolor
  const {
    recolorMetal,
    isRecoloring: isRecoloringMetal,
    recoloredImageUrl: metalRecoloredImageUrl,
    error: metalRecolorError,
  } = useMetalRecolor();

  // Metal Polish
  const {
    polishMetal,
    isPolishing: isPolishingMetal,
    polishedImageUrl: metalPolishedImageUrl,
    error: metalPolishError,
  } = useMetalPolish();

  // Natural Light & Reflections
  const {
    enhanceLight,
    isEnhancing: isEnhancingLight,
    enhancedImageUrl: lightEnhancedImageUrl,
    error: naturalLightError,
  } = useNaturalLight();

  // 360° Turntable Video
  const {
    generateVideo: generateTurntableVideo,
    isGenerating: isGeneratingTurntable,
    videoUrl: turntableVideoUrl,
    error: turntableVideoError,
  } = useTurntableVideo();

  // Camera Control (Rotate Left/Right, Close-Up)
  const { applyCamera, error: cameraError } = useCameraControl();

  // Track individual camera operations
  const [isRotatingLeft, setIsRotatingLeft] = useState(false);
  const [isRotatingRight, setIsRotatingRight] = useState(false);
  const [isClosingUp, setIsClosingUp] = useState(false);

  // Handle video generation
  const handleGenerateVideo = useCallback(() => {
    if (!uploadedImage) {
      toastManager.warning('No image to convert to video');
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
  }, [uploadedImage, generateVideo]);

  // Show video modal when generation completes
  useEffect(() => {
    if (videoUrl && !showVideoModal) {
      logger.info('[Canvas] Video generated, opening modal');
      queueMicrotask(() => {
        setShowVideoModal(true);
        toastManager.success('✅ Video generated successfully!');
      });
    }
  }, [videoUrl, showVideoModal]);

  // Show error toast if video generation fails
  useEffect(() => {
    if (videoError) {
      logger.error('[Canvas] Video generation failed:', videoError);
      toastManager.error(`❌ Video generation failed: ${videoError}`);
    }
  }, [videoError]);

  // Handle image upscale
  const handleUpscale = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image to upscale');
      return;
    }

    logger.info('[Canvas] Starting image upscale:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info('[Canvas] Converting blob URL to data URI for upscale');
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for upscaling');
        return;
      }
    }

    upscaleImage({
      image_url: imageUrl,
      upscale_mode: 'factor',
      upscale_factor: 2, // 2x upscale
      output_format: 'jpg',
    });
  }, [uploadedImage, originalImage, upscaleImage, setOriginalImage]);

  // Update canvas with upscaled image and enable comparison
  useEffect(() => {
    if (upscaledImageUrl) {
      logger.info('[Canvas] Upscaled image ready, updating canvas');
      queueMicrotask(() => {
        setUploadedImage(upscaledImageUrl);
        setViewMode('side-by-side'); // Enable comparison view
        toastManager.success(
          '✅ Image upscaled successfully! Compare with original.'
        );
      });
    }
  }, [upscaledImageUrl, setUploadedImage, setViewMode]);

  // Show error toast if upscale fails
  useEffect(() => {
    if (upscaleError) {
      logger.error('[Canvas] Image upscale failed:', upscaleError);
      toastManager.error(`❌ Upscale failed: ${upscaleError}`);
    }
  }, [upscaleError]);

  // Handle remove background
  const handleRemoveBackground = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image to process');
      return;
    }

    logger.info('[Canvas] Starting background removal:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info(
        '[Canvas] Converting blob URL to data URI for background removal'
      );
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for processing');
        return;
      }
    }

    removeBackground({
      image_url: imageUrl,
      crop_to_bbox: false, // Keep original dimensions
    });
  }, [uploadedImage, originalImage, removeBackground, setOriginalImage]);

  // Update canvas with background-removed image and enable comparison
  useEffect(() => {
    if (removedBgImageUrl) {
      logger.info('[Canvas] Background removed, updating canvas');
      queueMicrotask(() => {
        setUploadedImage(removedBgImageUrl);
        setViewMode('side-by-side'); // Enable comparison view
        toastManager.success(
          '✅ Background removed successfully! Compare with original.'
        );
      });
    }
  }, [removedBgImageUrl, setUploadedImage, setViewMode]);

  // Show error toast if remove background fails
  useEffect(() => {
    if (removeBgError) {
      logger.error('[Canvas] Background removal failed:', removeBgError);
      toastManager.error(`❌ Remove background failed: ${removeBgError}`);
    }
  }, [removeBgError]);

  // Handle rotate left
  const handleRotateLeft = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image to rotate');
      return;
    }

    setIsRotatingLeft(true);
    logger.info('[Canvas] Starting rotate left:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info(
        '[Canvas] Converting blob URL to data URI for camera control'
      );
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for processing');
        setIsRotatingLeft(false);
        return;
      }
    }

    try {
      const result = await applyCamera(imageUrl, 'rotate_left', 'product');
      if (result?.url) {
        setUploadedImage(result.url);
        setViewMode('side-by-side');
        toastManager.success('✅ Rotated left');
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
    setOriginalImage,
    setUploadedImage,
    setViewMode,
  ]);

  // Handle rotate right
  const handleRotateRight = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image to rotate');
      return;
    }

    setIsRotatingRight(true);
    logger.info('[Canvas] Starting rotate right:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info(
        '[Canvas] Converting blob URL to data URI for camera control'
      );
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for processing');
        setIsRotatingRight(false);
        return;
      }
    }

    try {
      const result = await applyCamera(imageUrl, 'rotate_right', 'product');
      if (result?.url) {
        setUploadedImage(result.url);
        setViewMode('side-by-side');
        toastManager.success('✅ Rotated right');
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
    setOriginalImage,
    setUploadedImage,
    setViewMode,
  ]);

  // Handle close-up
  const handleCloseUp = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image for close-up');
      return;
    }

    setIsClosingUp(true);
    logger.info('[Canvas] Starting close-up:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info(
        '[Canvas] Converting blob URL to data URI for camera control'
      );
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for processing');
        setIsClosingUp(false);
        return;
      }
    }

    try {
      const result = await applyCamera(imageUrl, 'closeup', 'product');
      if (result?.url) {
        setUploadedImage(result.url);
        setViewMode('side-by-side');
        toastManager.success('✅ Close-up created');
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
    setOriginalImage,
    setUploadedImage,
    setViewMode,
  ]);

  // Show error toast if camera control fails
  useEffect(() => {
    if (cameraError) {
      logger.error('[Canvas] Camera control failed:', cameraError);
      toastManager.error(`❌ Camera control failed: ${cameraError}`);
    }
  }, [cameraError]);

  // Handle gemstone enhancement
  const handleGemstoneEnhance = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image to enhance');
      return;
    }

    logger.info('[Canvas] Starting gemstone enhancement:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info(
        '[Canvas] Converting blob URL to data URI for gemstone enhancement'
      );
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for processing');
        return;
      }
    }

    enhanceGemstones({
      image_url: imageUrl,
    });
  }, [uploadedImage, originalImage, enhanceGemstones, setOriginalImage]);

  // Update canvas with gemstone-enhanced image and enable comparison
  useEffect(() => {
    if (gemstoneEnhancedImageUrl) {
      logger.info('[Canvas] Gemstones enhanced, updating canvas');
      queueMicrotask(() => {
        setUploadedImage(gemstoneEnhancedImageUrl);
        setViewMode('side-by-side'); // Enable comparison view
        toastManager.success('✅ Gemstones enhanced! Compare with original.');
      });
    }
  }, [gemstoneEnhancedImageUrl, setUploadedImage, setViewMode]);

  // Show error toast if gemstone enhancement fails
  useEffect(() => {
    if (gemstoneEnhanceError) {
      logger.error(
        '[Canvas] Gemstone enhancement failed:',
        gemstoneEnhanceError
      );
      toastManager.error(
        `❌ Gemstone enhancement failed: ${gemstoneEnhanceError}`
      );
    }
  }, [gemstoneEnhanceError]);

  // Handle metal recolor
  const handleMetalRecolor = useCallback(
    async (metalType: MetalType) => {
      if (!uploadedImage) {
        toastManager.warning('No image to recolor');
        return;
      }

      logger.info('[Canvas] Starting metal recolor:', {
        uploadedImage,
        metalType,
      });

      // Store original image for comparison
      if (!originalImage) {
        setOriginalImage(uploadedImage);
      }

      // Convert blob URL to data URI if needed
      let imageUrl = uploadedImage;
      if (uploadedImage.startsWith('blob:')) {
        logger.info(
          '[Canvas] Converting blob URL to data URI for metal recolor'
        );
        try {
          const response = await fetch(uploadedImage);
          const blob = await response.blob();
          imageUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          logger.info('[Canvas] Blob converted to data URI successfully');
        } catch (error) {
          logger.error('[Canvas] Failed to convert blob to data URI:', error);
          toastManager.error('Failed to prepare image for processing');
          return;
        }
      }

      recolorMetal({
        image_url: imageUrl,
        metal_type: metalType,
      });
    },
    [uploadedImage, originalImage, recolorMetal, setOriginalImage]
  );

  // Update canvas with recolored image and enable comparison
  useEffect(() => {
    if (metalRecoloredImageUrl) {
      logger.info('[Canvas] Metal recolored, updating canvas');
      queueMicrotask(() => {
        setUploadedImage(metalRecoloredImageUrl);
        setViewMode('side-by-side'); // Enable comparison view
        toastManager.success('✅ Metal color changed! Compare with original.');
      });
    }
  }, [metalRecoloredImageUrl, setUploadedImage, setViewMode]);

  // Show error toast if metal recolor fails
  useEffect(() => {
    if (metalRecolorError) {
      logger.error('[Canvas] Metal recolor failed:', metalRecolorError);
      toastManager.error(`❌ Metal recolor failed: ${metalRecolorError}`);
    }
  }, [metalRecolorError]);

  // Handle metal polish
  const handleMetalPolish = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image to polish');
      return;
    }

    logger.info('[Canvas] Starting metal polish:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info('[Canvas] Converting blob URL to data URI for metal polish');
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for processing');
        return;
      }
    }

    polishMetal({
      image_url: imageUrl,
    });
  }, [uploadedImage, originalImage, polishMetal, setOriginalImage]);

  // Update canvas with polished image and enable comparison
  useEffect(() => {
    if (metalPolishedImageUrl) {
      logger.info('[Canvas] Metal polished, updating canvas');
      queueMicrotask(() => {
        setUploadedImage(metalPolishedImageUrl);
        setViewMode('side-by-side'); // Enable comparison view
        toastManager.success(
          '✅ Metal polished to perfection! Compare with original.'
        );
      });
    }
  }, [metalPolishedImageUrl, setUploadedImage, setViewMode]);

  // Show error toast if metal polish fails
  useEffect(() => {
    if (metalPolishError) {
      logger.error('[Canvas] Metal polish failed:', metalPolishError);
      toastManager.error(`❌ Metal polish failed: ${metalPolishError}`);
    }
  }, [metalPolishError]);

  // Handle natural light enhancement
  const handleNaturalLight = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image to enhance');
      return;
    }

    logger.info('[Canvas] Starting natural light enhancement:', uploadedImage);

    // Store original image for comparison
    if (!originalImage) {
      setOriginalImage(uploadedImage);
    }

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info('[Canvas] Converting blob URL to data URI for natural light');
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for processing');
        return;
      }
    }

    enhanceLight({
      image_url: imageUrl,
    });
  }, [uploadedImage, originalImage, enhanceLight, setOriginalImage]);

  // Update canvas with light-enhanced image and enable comparison
  useEffect(() => {
    if (lightEnhancedImageUrl) {
      logger.info('[Canvas] Natural light enhanced, updating canvas');
      queueMicrotask(() => {
        setUploadedImage(lightEnhancedImageUrl);
        setViewMode('side-by-side');
        toastManager.success(
          '✅ Natural lighting added! Compare with original.'
        );
      });
    }
  }, [lightEnhancedImageUrl, setUploadedImage, setViewMode]);

  // Show error toast if natural light fails
  useEffect(() => {
    if (naturalLightError) {
      logger.error('[Canvas] Natural light failed:', naturalLightError);
      toastManager.error(`❌ Natural light failed: ${naturalLightError}`);
    }
  }, [naturalLightError]);

  // Handle 360° turntable video generation
  const handleTurntableVideo = useCallback(async () => {
    if (!uploadedImage) {
      toastManager.warning('No image to create video from');
      return;
    }

    logger.info('[Canvas] Starting turntable video generation:', uploadedImage);

    // Convert blob URL to data URI if needed
    let imageUrl = uploadedImage;
    if (uploadedImage.startsWith('blob:')) {
      logger.info(
        '[Canvas] Converting blob URL to data URI for turntable video'
      );
      try {
        const response = await fetch(uploadedImage);
        const blob = await response.blob();
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        logger.info('[Canvas] Blob converted to data URI successfully');
      } catch (error) {
        logger.error('[Canvas] Failed to convert blob to data URI:', error);
        toastManager.error('Failed to prepare image for video generation');
        return;
      }
    }

    generateTurntableVideo({
      image_url: imageUrl,
    });
  }, [uploadedImage, generateTurntableVideo]);

  // Show turntable video when ready
  useEffect(() => {
    if (turntableVideoUrl) {
      logger.info('[Canvas] Turntable video ready:', turntableVideoUrl);
      // Open video in modal (reuse existing VideoPlayerModal)
      setCurrentVideoUrl(turntableVideoUrl);
      setShowVideoModal(true);
      toastManager.success('✅ 360° turntable video ready!');
    }
  }, [turntableVideoUrl]);

  // Show error toast if turntable video fails
  useEffect(() => {
    if (turntableVideoError) {
      logger.error('[Canvas] Turntable video failed:', turntableVideoError);
      toastManager.error(`❌ Turntable video failed: ${turntableVideoError}`);
    }
  }, [turntableVideoError]);

  // Preset generation
  const handlePresetGeneration = useCallback(
    (prompt: string, aspectRatio?: string) => {
      if (!uploadedImage) {
        toastManager.warning('Please upload an image first');
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
    [uploadedImage, editWithAI]
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
    resetFilters, // 🎯 CRITICAL: Pass resetFilters to handlers
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
    openRight,
  });

  // ===================================================================
  // CANVAS HISTORY - Undo/Redo/Reset Handlers
  // ===================================================================

  /**
   * Handle Undo - Restore previous canvas state
   */
  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (!previousState) {
      logger.warn('Cannot undo: No previous state');
      return;
    }

    logger.info('⬅️ Undoing to previous state');

    // Restore all canvas state (with null safety)
    if (previousState.uploadedImage !== undefined) {
      setUploadedImage(previousState.uploadedImage);
    }
    if (previousState.scale !== undefined) {
      setScale(previousState.scale);
    }
    if (previousState.position !== undefined) {
      setPosition(previousState.position);
    }
    if (
      previousState.rotation !== undefined &&
      previousState.flipHorizontal !== undefined &&
      previousState.flipVertical !== undefined
    ) {
      setTransform({
        rotation: previousState.rotation,
        flipHorizontal: previousState.flipHorizontal,
        flipVertical: previousState.flipVertical,
      });
    }
    if (previousState.adjustFilters) {
      setAdjustFilters(previousState.adjustFilters);
    }
    if (previousState.colorFilters) {
      setColorFilters(previousState.colorFilters);
    }
    if (previousState.filterEffects) {
      setFilterEffects(previousState.filterEffects);
    }
    if (previousState.background) {
      setBackground(previousState.background as 'gray' | 'white' | 'black');
    }

    toastManager.success('Undone');
  }, [
    undo,
    setUploadedImage,
    setScale,
    setPosition,
    setTransform,
    setAdjustFilters,
    setColorFilters,
    setFilterEffects,
    setBackground,
  ]);

  /**
   * Handle Redo - Restore next canvas state
   */
  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (!nextState) {
      logger.warn('Cannot redo: No next state');
      return;
    }

    logger.info('➡️ Redoing to next state');

    // Restore all canvas state (with null safety)
    if (nextState.uploadedImage !== undefined) {
      setUploadedImage(nextState.uploadedImage);
    }
    if (nextState.scale !== undefined) {
      setScale(nextState.scale);
    }
    if (nextState.position !== undefined) {
      setPosition(nextState.position);
    }
    if (
      nextState.rotation !== undefined &&
      nextState.flipHorizontal !== undefined &&
      nextState.flipVertical !== undefined
    ) {
      setTransform({
        rotation: nextState.rotation,
        flipHorizontal: nextState.flipHorizontal,
        flipVertical: nextState.flipVertical,
      });
    }
    if (nextState.adjustFilters) {
      setAdjustFilters(nextState.adjustFilters);
    }
    if (nextState.colorFilters) {
      setColorFilters(nextState.colorFilters);
    }
    if (nextState.filterEffects) {
      setFilterEffects(nextState.filterEffects);
    }
    if (nextState.background) {
      setBackground(nextState.background as 'gray' | 'white' | 'black');
    }

    toastManager.success('Redone');
  }, [
    redo,
    setUploadedImage,
    setScale,
    setPosition,
    setTransform,
    setAdjustFilters,
    setColorFilters,
    setFilterEffects,
    setBackground,
  ]);

  /**
   * Handle Reset - Clear entire canvas history and state
   */
  const handleReset = useCallback(() => {
    logger.info('🔄 Resetting canvas history');

    resetHistory();
    resetFilters();
    resetTransform();
    resetCropState();
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setBackground('gray');

    toastManager.success('Canvas reset');
  }, [
    resetHistory,
    resetFilters,
    resetTransform,
    resetCropState,
    setScale,
    setPosition,
    setBackground,
  ]);

  /**
   * 📚 AUTO-SAVE CANVAS STATE TO HISTORY
   * Push to history on every significant change (debounced 500ms)
   */
  useEffect(() => {
    // Don't push if no image uploaded or filters not initialized
    if (!uploadedImage || !adjustFilters || !colorFilters || !filterEffects) {
      return;
    }

    // Debounce to avoid excessive history pushes
    const timeoutId = setTimeout(() => {
      pushHistory({
        uploadedImage,
        scale,
        position,
        rotation: transform.rotation,
        flipHorizontal: transform.flipHorizontal,
        flipVertical: transform.flipVertical,
        adjustFilters,
        colorFilters,
        filterEffects,
        background,
        timestamp: Date.now(),
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    uploadedImage,
    scale,
    position,
    transform,
    adjustFilters,
    colorFilters,
    filterEffects,
    background,
    pushHistory,
  ]);

  // Handle AI image load complete
  const handleAIImageLoad = useCallback(() => {
    setIsAIImageLoading(false);
  }, []);

  // Handle AI image load error (with debounce to prevent infinite loop)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastErrorUrlRef = useRef<string>('');

  const handleAIImageError = useCallback(() => {
    // Prevent duplicate errors for the same URL (blob URL cleanup causes this)
    if (uploadedImage && uploadedImage === lastErrorUrlRef.current) {
      return; // Skip duplicate error for same URL
    }

    // Clear previous timeout
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    // Debounce error handling to prevent infinite loop
    errorTimeoutRef.current = setTimeout(() => {
      setIsAIImageLoading(false);
      lastErrorUrlRef.current = uploadedImage || '';

      // Only show error if it's not a blob URL issue (revoked)
      if (uploadedImage && !uploadedImage.startsWith('blob:')) {
        toastManager.error('Failed to load generated image');
      }
    }, 500); // 500ms debounce
  }, [uploadedImage]);

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

          toastManager.success('Image loaded from gallery!');

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

                  toastManager.success('Image loaded from gallery!');

                  // Clear query params
                  router.replace('/studio', { scroll: false });
                }
              };
              reader.onerror = () => {
                setIsLoading(false);
                toastManager.error('Failed to load image from gallery');
                router.replace('/studio', { scroll: false });
              };
              reader.readAsDataURL(blob);
            })
            .catch(() => {
              setIsLoading(false);
              toastManager.error('Failed to fetch image from gallery');
              router.replace('/studio', { scroll: false });
            });
        }
      } catch (error) {
        logger.error('Failed to load image from gallery:', error);
        toastManager.error('Failed to load image from gallery');
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
  ]);

  // 🔄 STATE RESTORATION: Load saved canvas state on mount
  useEffect(() => {
    // Only restore if no imageUrl in query params (avoid conflict)
    const imageUrl = searchParams.get('imageUrl');
    if (imageUrl) return;

    // Only restore if canvas is empty
    if (uploadedImage) return;

    const savedState = loadCanvasState();
    if (!savedState) return;

    logger.info('Restoring canvas state...', {
      fileName: savedState.fileName,
      hasOriginal: !!savedState.originalImage,
    });

    // Restore image
    if (savedState.uploadedImage) {
      setUploadedImage(savedState.uploadedImage);
      setFileName(savedState.fileName);
      setFileSize(savedState.fileSize);
    }

    // Restore original image (for side-by-side comparison)
    if (savedState.originalImage) {
      setOriginalImage(savedState.originalImage);
    }

    // Restore transforms
    setScale(savedState.scale);
    setPosition(savedState.position);
    setTransform({
      rotation: savedState.rotation,
      flipHorizontal: savedState.flipHorizontal,
      flipVertical: savedState.flipVertical,
    });

    // Restore filters
    setAdjustFilters(savedState.adjustFilters);
    setColorFilters(savedState.colorFilters);
    setFilterEffects(savedState.filterEffects);

    // Restore background
    setBackground(savedState.background);

    toastManager.success('Canvas state restored!');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 💾 AUTO-SAVE: Save canvas state on changes (debounced)
  useEffect(() => {
    // Skip if no image
    if (!uploadedImage) return;

    // Debounce save (500ms delay)
    const timeoutId = setTimeout(() => {
      saveCanvasState({
        uploadedImage,
        originalImage,
        fileName,
        fileSize,
        scale,
        position,
        rotation: transform.rotation,
        flipHorizontal: transform.flipHorizontal,
        flipVertical: transform.flipVertical,
        adjustFilters,
        colorFilters,
        filterEffects,
        background,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    uploadedImage,
    originalImage,
    fileName,
    fileSize,
    scale,
    position,
    transform,
    adjustFilters,
    colorFilters,
    filterEffects,
    background,
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
  // ✅ NO client-side credit deduction - API routes handle it automatically
  const handleAIEditGenerate = useCallback(
    async (event: CustomEvent) => {
      const { prompt, imageUrl } = event.detail;
      if (!imageUrl) return;

      try {
        // Save original image before AI editing
        setOriginalImage(imageUrl);

        // Call AI API - credit check & deduction happens server-side
        editWithAI({
          prompt: prompt || 'enhance the image quality and lighting',
          image_url: imageUrl,
          num_images: 1,
          output_format: 'jpeg',
        });
      } catch (error) {
        logger.error('[Canvas] AI generation failed:', error);
        toastManager.error('Failed to generate image');
      }
    },
    [editWithAI]
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

  // Cleanup on unmount - prevent memory leaks from error timeout
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

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
          onAIError={(error) => toastManager.error(error.message)}
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
        onSuccess={(msg) => toastManager.success(msg)}
        onError={(msg) => toastManager.error(msg)}
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
          onGemstoneEnhance={handleGemstoneEnhance}
          isEnhancingGemstones={isEnhancingGemstones}
          onMetalRecolor={handleMetalRecolor}
          isRecoloringMetal={isRecoloringMetal}
          onMetalPolish={handleMetalPolish}
          isPolishingMetal={isPolishingMetal}
          onNaturalLight={handleNaturalLight}
          isEnhancingLight={isEnhancingLight}
          onTurntableVideo={handleTurntableVideo}
          isGeneratingTurntable={isGeneratingTurntable}
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
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Video Generating Modal */}
      <VideoGeneratingModal isVisible={isGeneratingVideo} error={videoError} />

      {/* Video Player Modal */}
      {showVideoModal && (videoUrl || currentVideoUrl) && (
        <VideoPlayerModal
          videoUrl={currentVideoUrl || videoUrl || ''}
          onClose={() => {
            setShowVideoModal(false);
            setCurrentVideoUrl(null);
            if (videoUrl) resetVideo();
          }}
        />
      )}

      {/* Toast Notifications - Now displayed in BottomBar */}
    </>
  );
}

export default Canvas;
