/**
 * Upscale Processor
 * 
 * Handles image upscaling operations using SeedVR2
 * Supports data URIs and blob URLs by uploading to FAL storage first
 */

import { fal } from '@fal-ai/client';
import { AIJobResult } from '../types';
import { processFalAI, dataUriToBlob } from './base-processor';

/**
 * Upload image to FAL storage if it's a data URI or blob URL
 */
async function ensureAccessibleUrl(imageUrl: string): Promise<string> {
  // If already a fal.ai URL or regular HTTPS URL, return as-is
  if (imageUrl.includes('fal.media') || imageUrl.includes('fal.ai')) {
    console.log('[Upscale] Image already on FAL storage');
    return imageUrl;
  }
  
  // If it's a data URI, convert and upload
  if (imageUrl.startsWith('data:')) {
    console.log('[Upscale] Converting data URI to FAL storage URL');
    try {
      const blob = dataUriToBlob(imageUrl);
      const uploadedUrl = await fal.storage.upload(blob);
      console.log('[Upscale] Uploaded to FAL storage:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error('[Upscale] Failed to upload data URI:', error);
      throw new Error('Failed to upload image for upscaling');
    }
  }
  
  // If it's an HTTPS URL, fetch and re-upload to FAL storage for reliability
  if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
    console.log('[Upscale] Fetching external URL and uploading to FAL storage');
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const blob = await response.blob();
      const uploadedUrl = await fal.storage.upload(blob);
      console.log('[Upscale] Uploaded to FAL storage:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error('[Upscale] Failed to fetch and upload image:', error);
      throw new Error('Failed to prepare image for upscaling');
    }
  }
  
  // Unknown format, try as-is
  console.log('[Upscale] Unknown URL format, using as-is:', imageUrl.substring(0, 50));
  return imageUrl;
}

export async function processUpscale(params: any, apiKey: string): Promise<AIJobResult> {
  try {
    // Configure FAL client first
    fal.config({ credentials: apiKey });
    
    // Ensure image is accessible by FAL.AI
    const accessibleUrl = await ensureAccessibleUrl(params.image_url);
    
    // Use SeedVR2 upscaling with target resolution mode
    const upscaleParams = {
      image_url: accessibleUrl,
      upscale_mode: params.upscale_mode || 'target',
      target_resolution: params.target_resolution || '2160p',
      upscale_factor: params.upscale_factor,
      noise_scale: params.noise_scale || 0.1,
      output_format: params.output_format || 'jpg',
      seed: params.seed,
    };

    return processFalAI('fal-ai/seedvr/upscale/image', upscaleParams, apiKey);
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Upscale processing failed',
        code: 'UPSCALE_ERROR',
      },
    };
  }
}


