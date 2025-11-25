import { createScopedLogger } from './logger';

const logger = createScopedLogger('DownloadUtils');

/**
 * Downloads an image using blob URL to ensure proper file download
 * instead of opening in new tab (especially for Supabase URLs with CORS)
 *
 * @param imageUrl - URL of the image (can be Supabase URL or base64 data URI)
 * @param filename - Desired filename for download
 * @returns Promise<void>
 * @throws Error if fetch fails or blob creation fails
 */
export async function downloadImageWithBlob(
  imageUrl: string,
  filename: string
): Promise<void> {
  try {
    logger.info('Starting download:', {
      filename,
      imageUrl: imageUrl.slice(0, 50) + '...',
    });

    // If it's already a data URI, we can download directly
    if (imageUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      logger.info('✅ Downloaded data URI successfully:', filename);
      return;
    }

    // For remote URLs (Supabase, etc.), fetch as blob
    const response = await fetch(imageUrl, {
      mode: 'cors', // Explicitly request CORS
      credentials: 'omit', // Don't send credentials (cleaner)
    });

    if (!response.ok) {
      throw new Error(
        `Fetch failed: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();
    logger.debug('Blob created:', { size: blob.size, type: blob.type });

    // Create blob URL
    const blobUrl = URL.createObjectURL(blob);

    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
      logger.debug('Blob URL revoked:', blobUrl);
    }, 100);

    logger.info('✅ Downloaded successfully:', filename);
  } catch (error) {
    logger.error('❌ Download failed:', error);
    throw error; // Re-throw for caller to handle
  }
}

/**
 * Sanitizes a filename by removing invalid characters
 * and ensuring it has a valid extension
 *
 * @param filename - Original filename
 * @param fallbackExtension - Extension to use if none found (default: 'jpg')
 * @returns Sanitized filename
 */
export function sanitizeFilename(
  filename: string,
  fallbackExtension: string = 'jpg'
): string {
  // Remove invalid characters
  let sanitized = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // If empty after sanitization, use default
  if (!sanitized) {
    sanitized = `image-${Date.now()}`;
  }

  // Ensure extension
  const hasExtension = /\.(jpg|jpeg|png|webp|gif)$/i.test(sanitized);
  if (!hasExtension) {
    sanitized += `.${fallbackExtension}`;
  }

  return sanitized;
}

/**
 * Generates a default filename from image metadata
 *
 * @param imageId - Image ID
 * @param metadata - Optional metadata with custom filename
 * @param createdAt - Optional creation date
 * @returns Generated filename
 */
export function generateImageFilename(
  imageId: string,
  metadata?: { fileName?: string },
  createdAt?: Date
): string {
  // If metadata has custom filename, use it
  if (metadata?.fileName) {
    return sanitizeFilename(metadata.fileName);
  }

  // Otherwise, generate from date or ID
  const dateStr = createdAt
    ? createdAt.toISOString().split('T')[0].replace(/-/g, '')
    : Date.now();

  return `jewelshot-${dateStr}-${imageId.slice(0, 8)}.jpg`;
}
