/**
 * Image Proxy Utility
 *
 * Proxies external image URLs (FAL.ai) through Supabase Storage
 * to hide the source and maintain control over assets
 *
 * Security Benefits:
 * - Hides FAL.ai usage from end users
 * - Prevents direct access to FAL.ai URLs
 * - Maintains ownership of generated images
 * - Enables custom CDN and caching
 */

import { createClient } from './supabase/client';
import { createScopedLogger } from './logger';

const logger = createScopedLogger('ImageProxy');

/**
 * Upload external image URL to Supabase Storage
 *
 * @param externalUrl - External image URL (e.g., from FAL.ai)
 * @param filename - Optional custom filename
 * @returns Supabase Storage public URL
 */
export async function proxyImageToSupabase(
  externalUrl: string,
  filename?: string
): Promise<string> {
  try {
    logger.info('Proxying external image to Supabase:', externalUrl);

    // 1. Fetch the image from external URL
    const response = await fetch(externalUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 2. Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = contentType.split('/')[1] || 'jpg';
    const finalFilename =
      filename || `generated-${timestamp}-${randomStr}.${extension}`;

    // 3. Get authenticated Supabase client
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }

    // 4. Upload to Supabase Storage (generations bucket)
    const filePath = `${user.id}/${finalFilename}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generations')
      .upload(filePath, blob, {
        contentType,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      logger.error('Supabase upload failed:', uploadError.message);
      throw uploadError;
    }

    // 5. Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('generations').getPublicUrl(filePath);

    logger.info('Image proxied successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    logger.error('Failed to proxy image:', error);
    // Fallback: return original URL if proxy fails
    // This ensures the app doesn't break, but logs the issue
    return externalUrl;
  }
}

/**
 * Proxy multiple images in parallel
 *
 * @param urls - Array of external image URLs
 * @returns Array of Supabase URLs (or original URLs if proxy fails)
 */
export async function proxyMultipleImages(urls: string[]): Promise<string[]> {
  logger.info(`Proxying ${urls.length} images...`);

  const results = await Promise.allSettled(
    urls.map((url) => proxyImageToSupabase(url))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      logger.warn(`Failed to proxy image ${index}:`, result.reason);
      return urls[index]; // Fallback to original URL
    }
  });
}

/**
 * Check if URL is from external source (FAL.ai, etc.)
 *
 * @param url - Image URL to check
 * @returns true if URL should be proxied
 */
export function shouldProxyUrl(url: string): boolean {
  if (!url) return false;

  // Proxy these external sources
  const externalDomains = [
    'fal.media',
    'fal.ai',
    'cdn.fal.ai',
    // Add more external domains here if needed
  ];

  try {
    const urlObj = new URL(url);
    return externalDomains.some((domain) => urlObj.hostname.includes(domain));
  } catch {
    // Invalid URL or relative path - don't proxy
    return false;
  }
}

/**
 * Smart proxy: only proxy if URL is from external source
 *
 * @param url - Image URL
 * @returns Proxied URL or original URL
 */
export async function smartProxyImage(url: string): Promise<string> {
  if (shouldProxyUrl(url)) {
    return proxyImageToSupabase(url);
  }
  return url;
}
