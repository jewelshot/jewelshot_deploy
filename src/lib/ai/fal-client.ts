/**
 * ============================================================================
 * FAL.AI CLIENT - SYNCHRONOUS IMPLEMENTATION
 * ============================================================================
 *
 * Client-side wrapper that submits jobs to API
 * Now uses synchronous processing - no queue polling needed
 *
 * ROUTES:
 * - /api/ai/submit - Submit and process job (synchronous)
 */

import { createScopedLogger } from '@/lib/logger';
import { showAILoading, showAISuccess, showAIError } from './ai-request';

const logger = createScopedLogger('FAL.AI');

// ============================================================================
// IMAGE COMPRESSION HELPER
// ============================================================================

/**
 * Compress base64 image to reduce size before sending to API
 * Prevents Vercel 4.5MB body limit error (HTTP 413)
 */
async function compressBase64Image(dataUrl: string, maxSizeMB: number = 2): Promise<string> {
  // If it's not a data URL, return as-is (external URL)
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }

  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // If already small enough, return as-is
    const sizeMB = blob.size / (1024 * 1024);
    if (sizeMB <= maxSizeMB) {
      logger.info(`Image already small (${sizeMB.toFixed(2)}MB), skipping compression`);
      return dataUrl;
    }

    logger.info(`Compressing image from ${sizeMB.toFixed(2)}MB to ~${maxSizeMB}MB`);

    // Lazy load browser-image-compression
    const imageCompression = (await import('browser-image-compression')).default;
    
    // Create File from Blob for compression library
    const file = new File([blob], 'image.jpg', { type: blob.type || 'image/jpeg' });
    
    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight: 2048,
      useWebWorker: true,
      fileType: 'image/jpeg',
    });

    // Convert back to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const newSizeMB = (result.length * 0.75) / (1024 * 1024); // Approximate size
        logger.info(`Compression complete: ${sizeMB.toFixed(2)}MB → ~${newSizeMB.toFixed(2)}MB`);
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    logger.error('Compression failed, using original:', error);
    return dataUrl; // Fallback to original
  }
}

// ============================================================================
// TYPES - Based on official fal.ai documentation
// ============================================================================

/**
 * Text-to-Image Generation Input
 */
export interface GenerateInput {
  prompt: string;
  num_images?: number;
  output_format?: 'jpeg' | 'png' | 'webp';
  aspect_ratio?:
    | 'auto'
    | '21:9'
    | '1:1'
    | '4:3'
    | '3:2'
    | '2:3'
    | '5:4'
    | '4:5'
    | '3:4'
    | '16:9'
    | '9:16';
}

/**
 * Image-to-Image Edit Input
 */
export interface EditInput {
  prompt: string;
  image_url: string; // Single image URL or data URI
  num_images?: number;
  output_format?: 'jpeg' | 'png' | 'webp';
  aspect_ratio?:
    | 'auto'
    | '21:9'
    | '1:1'
    | '4:3'
    | '3:2'
    | '2:3'
    | '5:4'
    | '4:5'
    | '3:4'
    | '16:9'
    | '9:16';
}

/**
 * API Output (both generate and edit return this)
 */
export interface FalOutput {
  images: Array<{
    url: string;
    width?: number;
    height?: number;
  }>;
  description?: string;
}

/**
 * Progress callback
 */
export type ProgressCallback = (status: string, message?: string) => void;

// ============================================================================
// CONFIGURATION
// ============================================================================

// Use environment variable or dynamic origin (for production)
const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser, use current origin (works for production and dev)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // SSR fallback (should never happen in this client-side file)
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

// Timeout configuration - increased for synchronous processing
const REQUEST_TIMEOUT = 120000; // 2 minutes (FAL.AI can take 30-60s)
const RETRY_ATTEMPTS = 2; // Retry failed requests twice
const RETRY_DELAY = 2000; // Wait 2s between retries

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        `Request timeout after ${timeout / 1000}s. AI generation is taking longer than expected. Please try again.`
      );
    }
    throw error;
  }
}

/**
 * Retry helper with exponential backoff
 */
async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = RETRY_ATTEMPTS,
  delay: number = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;

    // Don't retry on client errors (400-499) except 429 (rate limit)
    if (
      error instanceof Error &&
      error.message.includes('429') === false &&
      (error.message.includes('400') ||
        error.message.includes('401') ||
        error.message.includes('403') ||
        error.message.includes('404'))
    ) {
      throw error;
    }

    logger.warn(
      `Request failed, retrying in ${delay}ms... (${attempts - 1} attempts left)`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay * 1.5); // Exponential backoff
  }
}

// ============================================================================
// TEXT-TO-IMAGE GENERATION
// ============================================================================

/**
 * Generate image from text prompt (SYNCHRONOUS)
 *
 * @example
 * ```ts
 * const result = await generateImage({
 *   prompt: "A jewelry ring on white background",
 *   aspect_ratio: "16:9"
 * });
 * // result.images[0].url
 * ```
 */
export async function generateImage(
  input: GenerateInput,
  onProgress?: ProgressCallback
): Promise<FalOutput> {
  if (onProgress) onProgress('INITIALIZING', 'Starting generation...');

  // Show global loading modal
  showAILoading('generate');

  try {
    if (onProgress) onProgress('GENERATING', 'Processing with AI...');

    // Submit job - synchronous processing
    const submitResponse = await fetchWithTimeout(
      `${API_BASE_URL}/api/ai/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'generate',
          params: {
            prompt: input.prompt,
            num_images: input.num_images ?? 1,
            output_format: input.output_format ?? 'jpeg',
            aspect_ratio: input.aspect_ratio ?? '1:1',
          },
          priority: 'urgent',
        }),
      }
    );

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({
        error: `HTTP ${submitResponse.status}: ${submitResponse.statusText}`,
      }));
      const errorMessage = typeof errorData === 'string' 
        ? errorData 
        : errorData.message || errorData.error || 'Failed to generate image';
      throw new Error(errorMessage);
    }

    const response = await submitResponse.json();

    // Synchronous response - result is directly in response
    if (response.status === 'completed' && response.result) {
      if (onProgress) onProgress('COMPLETED', 'Generation complete!');
      logger.info('✅ Generation successful');
      showAISuccess();
      
      // Map result to FalOutput format
      return {
        images: [{
          url: response.result.data.imageUrl,
          width: response.result.data.width,
          height: response.result.data.height,
        }],
      };
    }

    // Handle failed status
    if (response.status === 'failed' || response.state === 'failed') {
      const errorMsg = response.error?.message || response.message || 'Generation failed';
      showAIError(errorMsg);
      throw new Error(errorMsg);
    }

    // Unexpected response
    console.error('[FAL.AI] Unexpected response:', JSON.stringify(response));
    showAIError('Beklenmeyen yanıt');
    throw new Error(response.message || 'Unexpected response from server');

  } catch (error) {
    logger.error('❌ Generation failed:', error);
    showAIError(error instanceof Error ? error.message : 'Oluşturma başarısız');

    if (error instanceof Error) {
      if (error.message.includes('Insufficient credits')) {
        throw new Error('Insufficient credits. Please purchase more credits to continue.');
      }
      if (error.message.includes('timeout')) {
        throw new Error('AI generation timed out. Please try again.');
      }
      if (error.message.includes('Network')) {
        throw new Error('Network error. Please check your connection.');
      }
    }

    throw error;
  }
}

// ============================================================================
// IMAGE-TO-IMAGE EDITING
// ============================================================================

/**
 * Edit existing image with AI (SYNCHRONOUS)
 *
 * @example
 * ```ts
 * const result = await editImage({
 *   prompt: "enhance lighting and colors",
 *   image_url: "https://example.com/image.jpg"
 * });
 * // result.images[0].url
 * ```
 */
export async function editImage(
  input: EditInput,
  onProgress?: ProgressCallback
): Promise<FalOutput> {
  if (onProgress) onProgress('UPLOADING', 'Preparing image...');

  // Show global loading modal
  showAILoading('edit');

  try {
    // Compress image before sending to prevent HTTP 413 (Payload Too Large)
    if (onProgress) onProgress('COMPRESSING', 'Optimizing image...');
    const compressedImageUrl = await compressBase64Image(input.image_url, 2);
    
    if (onProgress) onProgress('EDITING', 'Processing with AI...');

    // Submit job - synchronous processing
    const submitResponse = await fetchWithTimeout(
      `${API_BASE_URL}/api/ai/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: 'edit',
          params: {
            prompt: input.prompt,
            image_url: compressedImageUrl, // Use compressed image
            num_images: input.num_images ?? 1,
            output_format: input.output_format ?? 'jpeg',
            aspect_ratio: input.aspect_ratio ?? '1:1',
          },
          priority: 'urgent',
        }),
      }
    );

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json().catch(() => ({
        error: `HTTP ${submitResponse.status}: ${submitResponse.statusText}`,
      }));
      const errorMessage = typeof errorData === 'string' 
        ? errorData 
        : errorData.message || errorData.error || 'Failed to edit image';
      throw new Error(errorMessage);
    }

    const response = await submitResponse.json();

    // Synchronous response - result is directly in response
    if (response.status === 'completed' && response.result) {
      if (onProgress) onProgress('COMPLETED', 'Edit complete!');
      logger.info('✅ Edit successful');
      showAISuccess();
      
      // Map result to FalOutput format
      return {
        images: [{
          url: response.result.data.imageUrl,
          width: response.result.data.width,
          height: response.result.data.height,
        }],
      };
    }

    // Handle failed status
    if (response.status === 'failed' || response.state === 'failed') {
      const errorMsg = response.error?.message || response.message || 'Edit failed';
      showAIError(errorMsg);
      throw new Error(errorMsg);
    }

    // Unexpected response
    console.error('[FAL.AI] Unexpected response:', JSON.stringify(response));
    showAIError('Beklenmeyen yanıt');
    throw new Error(response.message || 'Unexpected response from server');

  } catch (error) {
    logger.error('❌ Edit failed:', error);
    showAIError(error instanceof Error ? error.message : 'Düzenleme başarısız');

    if (error instanceof Error) {
      if (error.message.includes('Insufficient credits')) {
        throw new Error('Insufficient credits. Please purchase more credits to continue.');
      }
      if (error.message.includes('timeout')) {
        throw new Error('AI editing timed out. Please try again.');
      }
      if (error.message.includes('Network')) {
        throw new Error('Network error. Please check your connection.');
      }
    }

    throw error;
  }
}

/**
 * Check if fal.ai is configured (always true since it's server-side now)
 */
export function isFalConfigured(): boolean {
  return true; // Server-side API key, always available
}
