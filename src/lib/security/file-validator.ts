/**
 * File Validator
 * 
 * 🔒 SECURITY: Validates uploaded files
 * - Magic byte detection (true file type)
 * - File size limits
 * - Allowed MIME types
 */

// Maximum file sizes (in bytes)
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,    // 10MB for images
  batch: 5 * 1024 * 1024,     // 5MB for batch uploads
  avatar: 2 * 1024 * 1024,    // 2MB for avatars
} as const;

// Allowed image MIME types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

// Magic bytes for common image formats
const MAGIC_BYTES: Record<string, { bytes: number[]; mimeType: string }[]> = {
  jpeg: [
    { bytes: [0xFF, 0xD8, 0xFF], mimeType: 'image/jpeg' },
  ],
  png: [
    { bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], mimeType: 'image/png' },
  ],
  gif: [
    { bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], mimeType: 'image/gif' }, // GIF87a
    { bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], mimeType: 'image/gif' }, // GIF89a
  ],
  webp: [
    { bytes: [0x52, 0x49, 0x46, 0x46], mimeType: 'image/webp' }, // RIFF
  ],
};

/**
 * Detect actual MIME type from file buffer using magic bytes
 */
export function detectMimeType(buffer: Buffer): string | null {
  if (buffer.length < 8) return null;

  // Check JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }

  // Check PNG
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }

  // Check GIF
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return 'image/gif';
  }

  // Check WebP (RIFF....WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer.length >= 12 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  return null;
}

/**
 * Validate an image file
 * 
 * @returns Object with validation result
 */
export function validateImageFile(
  buffer: Buffer,
  claimedMimeType?: string,
  maxSize: number = MAX_FILE_SIZES.image
): {
  valid: boolean;
  error?: string;
  detectedType?: string;
} {
  // Check size
  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  // Check minimum size (corrupt file)
  if (buffer.length < 100) {
    return {
      valid: false,
      error: 'File is too small or corrupt',
    };
  }

  // Detect actual type from magic bytes
  const detectedType = detectMimeType(buffer);

  if (!detectedType) {
    return {
      valid: false,
      error: 'Could not detect file type. Please upload a valid image (JPEG, PNG, WebP, or GIF)',
    };
  }

  // Check if detected type is allowed
  if (!ALLOWED_IMAGE_TYPES.includes(detectedType as typeof ALLOWED_IMAGE_TYPES[number])) {
    return {
      valid: false,
      error: `File type ${detectedType} is not allowed. Please upload JPEG, PNG, WebP, or GIF`,
    };
  }

  // Optional: Warn if claimed type doesn't match detected type
  if (claimedMimeType && claimedMimeType !== detectedType) {
    console.warn(
      `[Security] MIME type mismatch: claimed ${claimedMimeType}, detected ${detectedType}`
    );
  }

  return {
    valid: true,
    detectedType,
  };
}

/**
 * Get safe content type from buffer (for storage)
 */
export function getSafeContentType(buffer: Buffer, fallback: string = 'image/jpeg'): string {
  const detected = detectMimeType(buffer);
  return detected || fallback;
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMime(mimeType: string): string {
  const mapping: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };
  return mapping[mimeType] || 'jpg';
}
