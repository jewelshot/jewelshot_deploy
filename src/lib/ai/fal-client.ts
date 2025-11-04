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
  try {
    if (onProgress) onProgress('INITIALIZING', 'Starting generation...');

    const response = await fetch(`${API_BASE_URL}/api/ai/generate`, {
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
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate image');
    }

    const result = await response.json();

    if (onProgress) onProgress('COMPLETED', 'Generation complete!');

    return result as FalOutput;
  } catch (error) {
    logger.error('❌ Generation failed:', error);
    throw error;
  }
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
  try {
    if (onProgress) onProgress('UPLOADING', 'Preparing image...');

    const response = await fetch(`${API_BASE_URL}/api/ai/edit`, {
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
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to edit image');
    }

    if (onProgress) onProgress('EDITING', 'Processing with AI...');

    const result = await response.json();

    if (onProgress) onProgress('COMPLETED', 'Edit complete!');

    return result as FalOutput;
  } catch (error) {
    logger.error('❌ Edit failed:', error);
    throw error;
  }
}

/**
 * Check if fal.ai is configured (always true since it's server-side now)
 */
export function isFalConfigured(): boolean {
  return true; // Server-side API key, always available
}
