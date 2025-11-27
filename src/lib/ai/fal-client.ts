/**
 * ============================================================================
 * FAL.AI CLIENT - QUEUE-BASED IMPLEMENTATION
 * ============================================================================
 *
 * Client-side wrapper that submits jobs to queue system
 * Uses atomic credit system (reserve/confirm/refund)
 *
 * NEW ROUTES:
 * - /api/ai/submit - Submit job to queue
 * - /api/ai/status/[jobId] - Poll for result
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
 * Generate image from text prompt (via QUEUE SYSTEM)
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

  try {
    if (onProgress) onProgress('SUBMITTING', 'Submitting to queue...');

    // Submit job to queue
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
      const error = await submitResponse.json().catch(() => ({
        error: `HTTP ${submitResponse.status}: ${submitResponse.statusText}`,
      }));
      throw new Error(error.error || 'Failed to submit job');
    }

    const { jobId } = await submitResponse.json();

    if (onProgress) onProgress('QUEUED', 'Waiting for processing...');

    // Poll for result
    let attempts = 0;
    const maxAttempts = 150; // 5 minutes max (2s * 150)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s interval
      attempts++;

      const statusResponse = await fetch(`${API_BASE_URL}/api/ai/status/${jobId}`);
      const status = await statusResponse.json();

      if (status.state === 'active') {
        if (onProgress) onProgress('GENERATING', 'Processing with AI...');
      }

      if (status.state === 'completed' && status.result) {
        if (onProgress) onProgress('COMPLETED', 'Generation complete!');
        logger.info('✅ Generation successful (via queue)');
        
        // Map queue result to old FalOutput format
        return {
          images: [{
            url: status.result.data.imageUrl,
            width: status.result.data.width,
            height: status.result.data.height,
          }],
        };
      }

      if (status.state === 'failed') {
        throw new Error(status.error?.message || 'Generation failed');
      }
    }

    throw new Error('Generation timeout - job took too long');
  } catch (error) {
    logger.error('❌ Generation failed:', error);

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
 * Edit existing image with AI (via QUEUE SYSTEM)
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

  try {
    if (onProgress) onProgress('SUBMITTING', 'Submitting to queue...');

    // Submit job to queue
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
            image_url: input.image_url,
            num_images: input.num_images ?? 1,
            output_format: input.output_format ?? 'jpeg',
            aspect_ratio: input.aspect_ratio ?? '1:1',
          },
          priority: 'urgent',
        }),
      }
    );

    if (!submitResponse.ok) {
      const error = await submitResponse.json().catch(() => ({
        error: `HTTP ${submitResponse.status}: ${submitResponse.statusText}`,
      }));
      throw new Error(error.error || 'Failed to submit job');
    }

    const { jobId } = await submitResponse.json();

    if (onProgress) onProgress('QUEUED', 'Waiting for processing...');

    // Poll for result
    let attempts = 0;
    const maxAttempts = 150; // 5 minutes max (2s * 150)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2s interval
      attempts++;

      const statusResponse = await fetch(`${API_BASE_URL}/api/ai/status/${jobId}`);
      const status = await statusResponse.json();

      if (status.state === 'active') {
        if (onProgress) onProgress('EDITING', 'Processing with AI...');
      }

      if (status.state === 'completed' && status.result) {
        if (onProgress) onProgress('COMPLETED', 'Edit complete!');
        logger.info('✅ Edit successful (via queue)');
        
        // Map queue result to old FalOutput format
        return {
          images: [{
            url: status.result.data.imageUrl,
            width: status.result.data.width,
            height: status.result.data.height,
          }],
        };
      }

      if (status.state === 'failed') {
        throw new Error(status.error?.message || 'Edit failed');
      }
    }

    throw new Error('Edit timeout - job took too long');
  } catch (error) {
    logger.error('❌ Edit failed:', error);

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
