/**
 * Inpaint Processor
 * 
 * Handles AI inpainting operations using flux-fill model
 * Takes an image and a mask, fills the masked area based on prompt
 * Supports data URIs by uploading to FAL storage first
 */

import { fal } from '@fal-ai/client';
import { AIJobResult } from '../types';
import { processFalAI, dataUriToBlob } from './base-processor';

export interface InpaintParams {
  image_url: string;      // Original image URL
  mask_url: string;       // Mask image URL (white = area to fill, black = keep)
  prompt: string;         // What to fill with
  negative_prompt?: string;
  strength?: number;      // 0.0 - 1.0, how much to change (default 0.95)
  num_inference_steps?: number;
  guidance_scale?: number;
}

/**
 * Upload image to FAL storage if it's a data URI
 */
async function ensureAccessibleUrl(imageUrl: string): Promise<string> {
  if (imageUrl.includes('fal.media') || imageUrl.includes('fal.ai')) {
    return imageUrl;
  }
  
  if (imageUrl.startsWith('data:')) {
    console.log('[Inpaint] Converting data URI to FAL storage URL');
    try {
      const blob = dataUriToBlob(imageUrl);
      const uploadedUrl = await fal.storage.upload(blob);
      console.log('[Inpaint] Uploaded to FAL storage');
      return uploadedUrl;
    } catch (error) {
      console.error('[Inpaint] Failed to upload data URI:', error);
      throw new Error('Failed to upload image for inpainting');
    }
  }
  
  if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
      const blob = await response.blob();
      const uploadedUrl = await fal.storage.upload(blob);
      return uploadedUrl;
    } catch (error) {
      console.error('[Inpaint] Failed to fetch and upload image:', error);
      throw new Error('Failed to prepare image for inpainting');
    }
  }
  
  return imageUrl;
}

export async function processInpaint(params: InpaintParams | Record<string, any>, apiKey: string): Promise<AIJobResult> {
  try {
    // Configure FAL client first
    fal.config({ credentials: apiKey });
    
    console.log('[Inpaint Processor] Starting inpaint operation');
    console.log('[Inpaint Processor] Params:', {
      image_url: params.image_url?.substring(0, 50) + '...',
      mask_url: params.mask_url?.substring(0, 50) + '...',
      prompt: params.prompt?.substring(0, 100),
    });

    // Upload both image and mask to FAL storage
    const [accessibleImageUrl, accessibleMaskUrl] = await Promise.all([
      ensureAccessibleUrl(params.image_url),
      ensureAccessibleUrl(params.mask_url),
    ]);

    // Transform params for flux-fill API
    const transformedParams = {
      image_url: accessibleImageUrl,
      mask_url: accessibleMaskUrl,
      prompt: params.prompt,
      strength: params.strength ?? 0.95,
      num_inference_steps: params.num_inference_steps ?? 28,
      guidance_scale: params.guidance_scale ?? 3.5,
    };

    // Add negative prompt if provided
    if (params.negative_prompt) {
      Object.assign(transformedParams, { negative_prompt: params.negative_prompt });
    }

    // Use flux-fill for inpainting
    return processFalAI('fal-ai/flux-fill', transformedParams, apiKey);
  } catch (error: any) {
    console.error('[Inpaint Processor] Error:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Inpainting failed',
        code: 'INPAINT_ERROR',
      },
    };
  }
}

