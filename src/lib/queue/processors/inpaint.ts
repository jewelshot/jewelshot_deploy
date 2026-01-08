/**
 * Inpaint Processor
 * 
 * Handles AI inpainting operations using flux-fill model
 * Takes an image and a mask, fills the masked area based on prompt
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export interface InpaintParams {
  image_url: string;      // Original image URL
  mask_url: string;       // Mask image URL (white = area to fill, black = keep)
  prompt: string;         // What to fill with
  negative_prompt?: string;
  strength?: number;      // 0.0 - 1.0, how much to change (default 0.95)
  num_inference_steps?: number;
  guidance_scale?: number;
}

export async function processInpaint(params: InpaintParams | Record<string, any>, apiKey: string): Promise<AIJobResult> {
  console.log('[Inpaint Processor] Starting inpaint operation');
  console.log('[Inpaint Processor] Params:', {
    image_url: params.image_url?.substring(0, 50) + '...',
    mask_url: params.mask_url?.substring(0, 50) + '...',
    prompt: params.prompt?.substring(0, 100),
  });

  // Transform params for flux-fill API
  const transformedParams = {
    image_url: params.image_url,
    mask_url: params.mask_url,
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
  // Alternative models: fal-ai/flux-pro/v1.1/inpainting, fal-ai/stable-diffusion-v1-5-inpainting
  return processFalAI('fal-ai/flux-fill', transformedParams, apiKey);
}

