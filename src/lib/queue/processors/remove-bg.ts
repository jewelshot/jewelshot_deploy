/**
 * Remove Background Processor
 * 
 * Handles background removal operations
 * Supports data URIs and blob URLs by uploading to FAL storage first
 */

import { fal } from '@fal-ai/client';
import { AIJobResult } from '../types';
import { processFalAI, dataUriToBlob } from './base-processor';

/**
 * Upload image to FAL storage if it's a data URI
 */
async function ensureAccessibleUrl(imageUrl: string): Promise<string> {
  // If already a fal.ai URL, return as-is
  if (imageUrl.includes('fal.media') || imageUrl.includes('fal.ai')) {
    return imageUrl;
  }
  
  // If it's a data URI, convert and upload
  if (imageUrl.startsWith('data:')) {
    console.log('[RemoveBG] Converting data URI to FAL storage URL');
    try {
      const blob = dataUriToBlob(imageUrl);
      const uploadedUrl = await fal.storage.upload(blob);
      console.log('[RemoveBG] Uploaded to FAL storage:', uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      console.error('[RemoveBG] Failed to upload data URI:', error);
      throw new Error('Failed to upload image for background removal');
    }
  }
  
  // If it's an HTTPS URL, fetch and re-upload for reliability
  if (imageUrl.startsWith('https://') || imageUrl.startsWith('http://')) {
    console.log('[RemoveBG] Fetching external URL and uploading to FAL storage');
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      const blob = await response.blob();
      const uploadedUrl = await fal.storage.upload(blob);
      return uploadedUrl;
    } catch (error) {
      console.error('[RemoveBG] Failed to fetch and upload image:', error);
      throw new Error('Failed to prepare image for background removal');
    }
  }
  
  return imageUrl;
}

export async function processRemoveBackground(params: any, apiKey: string): Promise<AIJobResult> {
  try {
    // Configure FAL client first
    fal.config({ credentials: apiKey });
    
    // Ensure image is accessible by FAL.AI
    const accessibleUrl = await ensureAccessibleUrl(params.image_url);
    
    const transformedParams = {
      ...params,
      image_url: accessibleUrl,
    };
    
    return processFalAI('fal-ai/imageutils/rembg', transformedParams, apiKey);
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error.message || 'Background removal failed',
        code: 'REMOVE_BG_ERROR',
      },
    };
  }
}


