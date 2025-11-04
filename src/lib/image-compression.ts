/**
 * Image Compression Utility
 * 
 * Client-side image compression before upload to:
 * - Reduce storage costs
 * - Improve upload speed
 * - Better user experience
 */

import imageCompression from 'browser-image-compression';
import { createScopedLogger } from './logger';

const logger = createScopedLogger('ImageCompression');

// ============================================================================
// CONFIGURATION
// ============================================================================

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
  fileType?: string;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: 2, // Max 2MB (down from 10MB default)
  maxWidthOrHeight: 2048, // Max dimension 2048px (good for AI models)
  useWebWorker: true, // Use web worker for better performance
  quality: 0.85, // 85% quality (good balance)
  fileType: 'image/jpeg', // Convert to JPEG for smaller size
};

// ============================================================================
// COMPRESSION FUNCTIONS
// ============================================================================

/**
 * Compress an image file before upload
 * 
 * @example
 * ```ts
 * const file = event.target.files[0];
 * const compressed = await compressImage(file);
 * // Upload compressed file instead
 * ```
 */
export async function compressImage(
  file: File,
  options?: CompressionOptions
): Promise<File> {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    logger.info('Compressing image...', {
      originalSize: formatBytes(file.size),
      originalType: file.type,
    });

    const startTime = Date.now();
    
    const compressedFile = await imageCompression(file, opts);
    
    const compressionTime = Date.now() - startTime;
    const compressionRatio = (1 - compressedFile.size / file.size) * 100;

    logger.info('✅ Compression complete', {
      originalSize: formatBytes(file.size),
      compressedSize: formatBytes(compressedFile.size),
      savedSize: formatBytes(file.size - compressedFile.size),
      compressionRatio: `${compressionRatio.toFixed(1)}%`,
      duration: `${compressionTime}ms`,
    });

    return compressedFile;
  } catch (error) {
    logger.error('❌ Compression failed:', error);
    
    // Fall back to original file if compression fails
    logger.warn('Using original file (compression failed)');
    return file;
  }
}

/**
 * Compress image with progress callback
 */
export async function compressImageWithProgress(
  file: File,
  onProgress?: (progress: number) => void,
  options?: CompressionOptions
): Promise<File> {
  try {
    const opts = {
      ...DEFAULT_OPTIONS,
      ...options,
      onProgress: onProgress ? (progress: number) => {
        // progress is 0-100
        onProgress(progress);
      } : undefined,
    };
    
    logger.info('Compressing image with progress...', {
      originalSize: formatBytes(file.size),
    });

    const compressedFile = await imageCompression(file, opts);
    
    logger.info('✅ Compression complete', {
      originalSize: formatBytes(file.size),
      compressedSize: formatBytes(compressedFile.size),
      saved: formatBytes(file.size - compressedFile.size),
    });

    return compressedFile;
  } catch (error) {
    logger.error('❌ Compression failed:', error);
    return file;
  }
}

/**
 * Check if image needs compression
 */
export function shouldCompress(file: File): boolean {
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_DIMENSION = 2048;

  // Check file size
  if (file.size > MAX_SIZE) {
    return true;
  }

  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return false;
  }

  // For large images, check dimensions (requires async, so return true for safety)
  return true;
}

/**
 * Get compressed data URL for preview
 */
export async function getCompressedDataURL(
  file: File,
  options?: CompressionOptions
): Promise<string> {
  const compressed = await compressImage(file, options);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(compressed);
  });
}

/**
 * Batch compress multiple images
 */
export async function compressImages(
  files: File[],
  onProgress?: (completed: number, total: number) => void,
  options?: CompressionOptions
): Promise<File[]> {
  const total = files.length;
  const compressed: File[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const compressedFile = await compressImage(file, options);
    compressed.push(compressedFile);
    
    if (onProgress) {
      onProgress(i + 1, total);
    }
  }

  return compressed;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Calculate compression ratio
 */
export function getCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  return (1 - compressedSize / originalSize) * 100;
}

/**
 * Estimate compression result
 */
export function estimateCompressedSize(
  originalSize: number,
  quality: number = 0.85
): number {
  // Rough estimation: JPEG compression typically achieves 60-80% reduction at 85% quality
  return Math.floor(originalSize * (1 - quality * 0.5));
}

