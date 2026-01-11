/**
 * Edit Processor
 * 
 * Handles Nano Banana Pro (v2) edit operations
 * Uses fal-ai/nano-banana-pro/edit with 4K resolution
 */

import { fal } from '@fal-ai/client';
import { AIJobResult } from '../types';
import { processFalAI, dataUriToBlob } from './base-processor';

/**
 * Upload image to FAL storage if it's a data URI or blob URL
 */
async function ensureAccessibleUrl(imageUrl: string): Promise<string> {
  // If already a fal.ai URL, return as-is
  if (imageUrl.includes('fal.media') || imageUrl.includes('fal.ai')) {
    console.log('[Edit] Image already on FAL storage');
    return imageUrl;
  }
  
  // If it's a data URI, convert and upload
  if (imageUrl.startsWith('data:')) {
    console.log('[Edit] Converting data URI to FAL storage URL');
    try {
      const blob = dataUriToBlob(imageUrl);
      const uploadedUrl = await fal.storage.upload(blob);
      console.log('[Edit] Uploaded to FAL storage:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error('[Edit] Failed to upload data URI:', error);
      throw new Error('Failed to upload image for editing');
    }
  }
  
  // If it's an HTTPS URL, fetch and re-upload to FAL storage for reliability
  if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
    console.log('[Edit] Fetching external URL and uploading to FAL storage');
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const blob = await response.blob();
      const uploadedUrl = await fal.storage.upload(blob);
      console.log('[Edit] Uploaded to FAL storage:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error('[Edit] Failed to fetch and upload image:', error);
      throw new Error('Failed to prepare image for editing');
    }
  }
  
  return imageUrl;
}

export async function processEdit(params: any, apiKey: string): Promise<AIJobResult> {
  try {
    // Configure FAL client first
    fal.config({ credentials: apiKey });
    
    // Get image URL(s) - can be single or array
    let imageUrls: string[] = [];
    
    if (params.image_url) {
      const accessibleUrl = await ensureAccessibleUrl(params.image_url);
      imageUrls = [accessibleUrl];
    } else if (params.image_urls && Array.isArray(params.image_urls)) {
      imageUrls = await Promise.all(
        params.image_urls.map((url: string) => ensureAccessibleUrl(url))
      );
    }
    
    if (imageUrls.length === 0) {
      throw new Error('No image URL provided');
    }
    
    // Transform params for Nano Banana Pro API
    const transformedParams = {
      prompt: params.prompt,
      image_urls: imageUrls,
      num_images: params.num_images || 1,
      aspect_ratio: params.aspect_ratio || 'auto',
      output_format: params.output_format || 'png',
      resolution: '4K', // Always use 4K for highest quality
      sync_mode: false,
    };
    
    console.log('[Edit Processor] Using Nano Banana Pro with params:', {
      ...transformedParams,
      image_urls: transformedParams.image_urls.map((url: string) => url.substring(0, 50) + '...'),
      prompt: transformedParams.prompt.substring(0, 100) + '...',
    });
    
    return processFalAI('fal-ai/nano-banana-pro/edit', transformedParams, apiKey);
  } catch (error: any) {
    console.error('[Edit Processor] Error:', error);
    return {
      success: false,
      error: {
        message: error.message || 'Edit processing failed',
        code: 'EDIT_ERROR',
      },
    };
  }
}


