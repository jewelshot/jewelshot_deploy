/**
 * ============================================================================
 * FAL.AI CLIENT - SECURE API PROXY IMPLEMENTATION
 * ============================================================================
 *
 * Client-side wrapper that calls Next.js API routes (server-side proxy)
 * This keeps the FAL.AI API key secure on the server
 *
 * API Routes:
 * - /api/ai/generate - Text-to-image generation
 * - /api/ai/edit - Image-to-image editing
 */

import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('FAL.AI');

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Timeout configuration
const REQUEST_TIMEOUT = 45000; // 45 seconds (FAL.AI can take 20-30s)
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

    logger.warn(`Request failed, retrying in ${delay}ms... (${attempts - 1} attempts left)`);
    
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, attempts - 1, delay * 1.5); // Exponential backoff
  }
}

// ============================================================================
// TEXT-TO-IMAGE GENERATION
// ============================================================================

/**
 * Generate image from text prompt (via API proxy)
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

  return retry(async () => {
    try {
      if (onProgress) onProgress('GENERATING', 'Processing with AI...');

      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/ai/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: input.prompt,
            num_images: input.num_images ?? 1,
            output_format: input.output_format ?? 'jpeg',
            aspect_ratio: input.aspect_ratio ?? '1:1',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || 'Failed to generate image');
      }

      const result = await response.json();

      if (onProgress) onProgress('COMPLETED', 'Generation complete!');

      logger.info('✅ Generation successful');
      return result as FalOutput;
    } catch (error) {
      logger.error('❌ Generation failed:', error);
      
      // Improve error message for user
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new Error(
            'AI generation timed out. The server is taking longer than expected. Please try again.'
          );
        }
        if (error.message.includes('429')) {
          throw new Error(
            'Too many requests. Please wait a moment and try again.'
          );
        }
        if (error.message.includes('Network')) {
          throw new Error(
            'Network error. Please check your connection and try again.'
          );
        }
      }
      
      throw error;
    }
  });
}

// ============================================================================
// IMAGE-TO-IMAGE EDITING
// ============================================================================

/**
 * Edit existing image with AI (via API proxy)
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

  return retry(async () => {
    try {
      if (onProgress) onProgress('EDITING', 'Processing with AI...');

      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/ai/edit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: input.prompt,
            image_url: input.image_url,
            num_images: input.num_images ?? 1,
            output_format: input.output_format ?? 'jpeg',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `HTTP ${response.status}: ${response.statusText}`,
        }));
        throw new Error(error.message || 'Failed to edit image');
      }

      const result = await response.json();

      if (onProgress) onProgress('COMPLETED', 'Edit complete!');

      logger.info('✅ Edit successful');
      return result as FalOutput;
    } catch (error) {
      logger.error('❌ Edit failed:', error);
      
      // Improve error message for user
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          throw new Error(
            'AI editing timed out. The server is taking longer than expected. Please try again.'
          );
        }
        if (error.message.includes('429')) {
          throw new Error(
            'Too many requests. Please wait a moment and try again.'
          );
        }
        if (error.message.includes('Network')) {
          throw new Error(
            'Network error. Please check your connection and try again.'
          );
        }
      }
      
      throw error;
    }
  });
}

/**
 * Check if fal.ai is configured (always true since it's server-side now)
 */
export function isFalConfigured(): boolean {
  return true; // Server-side API key, always available
}
