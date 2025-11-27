/**
 * Base Processor
 * 
 * Generic FAL.AI call wrapper with error handling and retry logic
 */

import { fal } from '@fal-ai/client';
import { AIJobResult } from '../types';

// ============================================
// FAL.AI PROCESSOR
// ============================================

/**
 * Generic FAL.AI subscription handler
 * Wraps fal.subscribe with error handling
 * 
 * @param modelId - FAL.AI model identifier
 * @param input - Input parameters for the model
 * @param apiKey - FAL.AI API key to use
 * @returns Processed result
 */
export async function processFalAI(
  modelId: string,
  input: Record<string, any>,
  apiKey: string
): Promise<AIJobResult> {
  try {
    // Configure FAL client with specific API key
    fal.config({
      credentials: apiKey,
    });

    // Subscribe to model with logs enabled
    const result = await fal.subscribe(modelId, {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`[FAL.AI] Queue update:`, update.status);
        }
      },
    });

    // Normalize response format
    // FAL.AI returns different formats, normalize to { imageUrl, ... }
    const normalizedData = normalizeResponse(result.data);

    // Return successful result
    return {
      success: true,
      data: normalizedData,
      metadata: {
        processingTime: Date.now(),
      },
    };
  } catch (error: any) {
    // Handle FAL.AI errors
    console.error(`[FAL.AI] Error processing ${modelId}:`, error);

    return {
      success: false,
      error: {
        message: error.message || 'Unknown FAL.AI error',
        code: error.code,
        details: error.body || error.response?.data,
      },
    };
  }
}

/**
 * Upload image to FAL.AI storage
 * Used for operations that require image input
 */
export async function uploadToFalStorage(imageUrl: string): Promise<string> {
  try {
    // If already a fal.ai URL, return as-is
    if (imageUrl.includes('fal.media') || imageUrl.includes('fal.ai')) {
      return imageUrl;
    }

    // Fetch image and convert to Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Upload to FAL storage
    const uploadedUrl = await fal.storage.upload(blob);
    return uploadedUrl;
  } catch (error) {
    console.error('[FAL.AI] Image upload failed:', error);
    throw error;
  }
}

/**
 * Convert data URI to blob for upload
 */
export function dataUriToBlob(dataUri: string): Blob {
  const arr = dataUri.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Normalize FAL.AI response to consistent format
 * Different endpoints return different structures
 */
function normalizeResponse(data: any): any {
  // If already has imageUrl, return as-is
  if (data.imageUrl) {
    return data;
  }

  // Handle { image: { url: "..." } } format (upscale, etc.)
  if (data.image?.url) {
    return {
      imageUrl: data.image.url,
      width: data.image.width,
      height: data.image.height,
      content_type: data.image.content_type,
    };
  }

  // Handle { images: [{ url: "..." }] } format (generation)
  if (data.images && Array.isArray(data.images) && data.images[0]?.url) {
    return {
      imageUrl: data.images[0].url,
      width: data.images[0].width,
      height: data.images[0].height,
      content_type: data.images[0].content_type,
      images: data.images.map((img: any) => img.url),
    };
  }

  // Handle { video: { url: "..." } } format
  if (data.video?.url) {
    return {
      videoUrl: data.video.url,
      imageUrl: data.video.url, // For compatibility
    };
  }

  // Return as-is if unknown format
  return data;
}

