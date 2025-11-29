/**
 * Canvas Event Handlers Hook
 *
 * Extracted from Canvas.tsx to reduce component size.
 * Contains all event handlers for file operations, zoom, actions, and UI controls.
 */

import { useCallback, RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { createScopedLogger } from '@/lib/logger';
import { validateFile } from '@/lib/validators';
import { rateLimiters } from '@/lib/rate-limiter';
import { compressImage, shouldCompress } from '@/lib/image-compression';
import { saveImageToGallery } from '@/lib/gallery-storage';
import { toastManager } from '@/lib/toast-manager';
import type {
  AdjustFilters,
  ColorFilters,
  FilterEffects,
} from './useImageFilters';
import type { Transform } from './useImageTransform';

const logger = createScopedLogger('CanvasHandlers');

interface UseCanvasHandlersProps {
  // Refs
  fileInputRef: RefObject<HTMLInputElement | null>;

  // Image state
  uploadedImage: string | null;
  fileName: string;
  originalImage: string | null;

  // Image state setters
  setUploadedImage: (image: string | null) => void;
  setFileName: (name: string) => void;
  setFileSize: (size: number) => void;
  setIsLoading: (loading: boolean) => void;
  setOriginalImage: (image: string | null) => void;
  resetImageState: () => void;

  // Transform state
  scale: number;
  setScale: (scale: number | ((prev: number) => number)) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  resetTransform: () => void;

  // UI state
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  isCropMode: boolean;

  // Filters
  adjustFilters: AdjustFilters;
  colorFilters: ColorFilters;
  filterEffects: FilterEffects;
  transform: Transform;
  resetFilters: () => void; // 🎯 CRITICAL: Reset filters when new image loaded

  // View mode
  viewMode: 'normal' | 'side-by-side';
  activeImage: 'left' | 'right';
  leftImageScale: number;
  rightImageScale: number;
  leftImagePosition: { x: number; y: number };
  rightImagePosition: { x: number; y: number };
  setLeftImageScale: (scale: number | ((prev: number) => number)) => void;
  setRightImageScale: (scale: number | ((prev: number) => number)) => void;
  setLeftImagePosition: (pos: { x: number; y: number }) => void;
  setRightImagePosition: (pos: { x: number; y: number }) => void;

  // Sidebar control
  openRight: () => void;
}

export function useCanvasHandlers(props: UseCanvasHandlersProps) {
  const {
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
    // scale, // unused in handlers
    setScale,
    setPosition,
    resetTransform,
    // isFullscreen, // unused - passed for fullscreen state
    setIsFullscreen,
    // isCropMode, // unused - passed for crop mode state
    adjustFilters,
    colorFilters,
    filterEffects,
    transform,
    resetFilters, // 🎯 CRITICAL: Reset filters when new image loaded
    viewMode,
    activeImage,
    // leftImageScale, // unused in handlers
    // rightImageScale, // unused in handlers
    // leftImagePosition, // unused in handlers
    // rightImagePosition, // unused in handlers
    setLeftImageScale,
    setRightImageScale,
    setLeftImagePosition,
    setRightImagePosition,
    openRight,
  } = props;

  const router = useRouter();

  // ============================================================================
  // FILE OPERATIONS
  // ============================================================================

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Check rate limit
      if (!rateLimiters.upload.canMakeRequest()) {
        const remaining = rateLimiters.upload.getRemainingRequests();
        toastManager.warning(
          `Too many uploads. ${remaining} uploads remaining in this time window.`
        );
        return;
      }

      // Comprehensive file validation
      const validation = await validateFile(file, {
        maxSizeMB: 10,
        minSizeMB: 0.001,
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        maxDimensions: { width: 8000, height: 8000 },
        minDimensions: { width: 100, height: 100 },
      });

      if (!validation.valid) {
        toastManager.error(validation.error || 'Invalid file');
        return;
      }

      // Record successful upload
      rateLimiters.upload.recordRequest();

      setIsLoading(true);
      setFileName(file.name);

      // Compress image before processing (if needed)
      let processedFile = file;
      if (shouldCompress(file)) {
        toastManager.info('Optimizing image...');
        try {
          processedFile = await compressImage(file, {
            maxSizeMB: 2,
            maxWidthOrHeight: 2048,
            quality: 0.85,
          });
          logger.info('Image compressed', {
            original: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            compressed: `${(processedFile.size / 1024 / 1024).toFixed(2)}MB`,
            saved: `${((1 - processedFile.size / file.size) * 100).toFixed(1)}%`,
          });
        } catch (error) {
          logger.warn('Compression failed, using original file', error);
          processedFile = file;
        }
      }

      setFileSize(processedFile.size);
      const reader = new FileReader();

      // Success handler
      reader.onload = (event) => {
        try {
          const result = event.target?.result;
          if (typeof result === 'string') {
            setUploadedImage(result);
            // Save original image for comparison
            setOriginalImage(result);
            // 🎯 CRITICAL FIX: Reset transform AND filters for new image!
            resetTransform();
            resetFilters(); // ✅ Prevents old filters from applying to new images
            logger.info('🔄 Filters reset for new image upload');
            // Auto-open right sidebar for AI generation setup
            openRight();
            logger.info('Image uploaded successfully, opening right sidebar');
            
            // 🎯 NEW: Dispatch image upload event for settings modal
            const uploadEvent = new CustomEvent('jewelshot:imageUploaded', {
              detail: { fileName: processedFile.name },
            });
            window.dispatchEvent(uploadEvent);
            logger.info('📢 Image upload event dispatched');
          } else {
            throw new Error('Failed to read image file');
          }
        } catch (error) {
          logger.error('Error processing image:', error);
          toastManager.error('Failed to load image. Please try again.');
          resetImageState();
        } finally {
          setIsLoading(false);
        }
      };

      // Error handler
      reader.onerror = () => {
        logger.error('FileReader error:', reader.error);
        toastManager.error('Failed to read file. The file may be corrupted.');
        setIsLoading(false);
        resetImageState();
      };

      // Abort handler
      reader.onabort = () => {
        logger.debug('File reading was aborted');
        setIsLoading(false);
      };

      try {
        reader.readAsDataURL(processedFile);
      } catch (error) {
        logger.error('Error reading file:', error);
        toastManager.error('Failed to read file. Please try again.');
        setIsLoading(false);
        resetImageState();
      } finally {
        // Reset file input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [
      setUploadedImage,
      setOriginalImage,
      setFileName,
      setFileSize,
      setIsLoading,
      resetTransform,
      resetFilters, // 🎯 Include resetFilters in dependencies
      resetImageState,
      fileInputRef,
      openRight,
    ]
  );

  const handleCloseImage = useCallback(() => {
    // Reset image state
    resetImageState();
    // Reset transform
    resetTransform();
    // 🎯 CRITICAL FIX: Reset filters when closing image
    resetFilters(); // ✅ Clean slate for next image
    logger.info('🔄 Filters reset on image close');
    // Reset original image (for comparison)
    setOriginalImage(null);
    // Reset file input so new images can be uploaded
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // Navigate to studio without query params
    router.replace('/studio', { scroll: false });
    logger.info('Image closed');
  }, [
    resetImageState,
    resetTransform,
    resetFilters,
    setOriginalImage,
    fileInputRef,
    router,
  ]);

  // ============================================================================
  // ZOOM CONTROLS
  // ============================================================================

  const handleZoomIn = useCallback(() => {
    if (viewMode === 'side-by-side') {
      if (activeImage === 'left') {
        setLeftImageScale((prev) => Math.min(prev + 0.1, 3.0));
      } else {
        setRightImageScale((prev) => Math.min(prev + 0.1, 3.0));
      }
    } else {
      setScale((prev) => Math.min(prev + 0.1, 3.0));
    }
  }, [viewMode, activeImage, setScale, setLeftImageScale, setRightImageScale]);

  const handleZoomOut = useCallback(() => {
    if (viewMode === 'side-by-side') {
      if (activeImage === 'left') {
        setLeftImageScale((prev) => Math.max(prev - 0.1, 0.1));
      } else {
        setRightImageScale((prev) => Math.max(prev - 0.1, 0.1));
      }
    } else {
      setScale((prev) => Math.max(prev - 0.1, 0.1));
    }
  }, [viewMode, activeImage, setScale, setLeftImageScale, setRightImageScale]);

  const handleFitScreen = useCallback(() => {
    if (viewMode === 'side-by-side') {
      // Fit both images in compare mode
      setLeftImageScale(1.0);
      setLeftImagePosition({ x: 0, y: 0 });
      setRightImageScale(1.0);
      setRightImagePosition({ x: 0, y: 0 });
    } else {
      setScale(1.0);
      setPosition({ x: 0, y: 0 });
    }
  }, [
    viewMode,
    setScale,
    setPosition,
    setLeftImageScale,
    setRightImageScale,
    setLeftImagePosition,
    setRightImagePosition,
  ]);

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================

  const handleSave = useCallback(async () => {
    if (!uploadedImage) return;

    // Check rate limit
    if (!rateLimiters.gallery.canMakeRequest()) {
      const remaining = rateLimiters.gallery.getRemainingRequests();
      toastManager.warning(`Too many saves. ${remaining} saves remaining.`);
      return;
    }

    try {
      // Record rate limit before async operation
      rateLimiters.gallery.recordRequest();

      // Save to gallery (await the async function)
      const savedImage = await saveImageToGallery(
        uploadedImage,
        fileName || 'edited-image.jpg',
        originalImage ? 'ai-edited' : 'manual'
      );

      if (!savedImage) {
        throw new Error('Failed to save image');
      }

      // Dispatch custom event for gallery sync
      window.dispatchEvent(new Event('gallery-updated'));

      toastManager.success('Image saved to gallery!');
    } catch (error) {
      logger.error('Failed to save image:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to save image to gallery';
      toastManager.error(errorMessage);
    }
  }, [uploadedImage, fileName, originalImage]);

  const handleDownload = useCallback(async () => {
    if (!uploadedImage) return;

    try {
      // Create canvas to apply filters
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          toastManager.error('Failed to create canvas context');
          return;
        }

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply transformations and filters
        ctx.save();

        // Apply rotation and flip
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.translate(centerX, centerY);

        if (transform.rotation !== 0) {
          ctx.rotate((transform.rotation * Math.PI) / 180);
        }

        ctx.scale(
          transform.flipHorizontal ? -1 : 1,
          transform.flipVertical ? -1 : 1
        );

        // Apply filters
        const filters = [];
        if (adjustFilters.brightness !== 0) {
          filters.push(`brightness(${100 + adjustFilters.brightness}%)`);
        }
        if (adjustFilters.contrast !== 0) {
          filters.push(`contrast(${100 + adjustFilters.contrast}%)`);
        }
        if (colorFilters.saturation !== 0) {
          filters.push(`saturate(${100 + colorFilters.saturation}%)`);
        }
        if (filters.length > 0) {
          ctx.filter = filters.join(' ');
        }

        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2);
        ctx.restore();

        // Download
        canvas.toBlob((blob) => {
          if (!blob) {
            toastManager.error('Failed to create image blob');
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName || 'edited-image.jpg';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          toastManager.success('Image downloaded successfully!');
        }, 'image/jpeg');
      };

      img.onerror = () => {
        toastManager.error('Failed to load image for download');
      };

      img.src = uploadedImage;
    } catch (error) {
      logger.error('Download error:', error);
      toastManager.error('Failed to download image');
    }
  }, [
    uploadedImage,
    fileName,
    transform,
    adjustFilters,
    colorFilters,
    // filterEffects not used in download
  ]);

  const handleDelete = useCallback(() => {
    if (
      window.confirm(
        'Are you sure you want to delete this image? This action cannot be undone.'
      )
    ) {
      handleCloseImage();
      toastManager.info('Image deleted');
    }
  }, [handleCloseImage]);

  // ============================================================================
  // UI CONTROLS
  // ============================================================================

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      logger.error('Fullscreen error:', error);
      toastManager.error('Failed to toggle fullscreen');
    }
  }, [setIsFullscreen]);

  return {
    // File operations
    handleUploadClick,
    handleFileChange,
    handleCloseImage,

    // Zoom controls
    handleZoomIn,
    handleZoomOut,
    handleFitScreen,

    // Actions
    handleSave,
    handleDownload,
    handleDelete,

    // UI controls
    toggleFullscreen,
  };
}
