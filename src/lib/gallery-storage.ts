/**
 * Gallery Storage Utility
 *
 * Manages saving and retrieving images to/from Supabase
 * Supports both authenticated and guest (localStorage fallback) modes
 */

import { createClient } from './supabase/client';
import { createScopedLogger } from './logger';
import type { Image, Database } from './supabase/types';

const logger = createScopedLogger('Gallery Storage');

export interface SavedImage {
  id: string;
  src: string; // URL for Supabase, base64 for localStorage
  alt: string;
  createdAt: Date;
  type: 'ai-edited' | 'manual';
  prompt?: string; // Optional AI prompt
  style?: string; // Optional style info
}

const STORAGE_KEY = 'jewelshot_gallery_images';
const MAX_IMAGES =
  parseInt(process.env.NEXT_PUBLIC_MAX_GALLERY_IMAGES || '100', 10) || 100;

/**
 * Check if user is authenticated
 */
async function isAuthenticated(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

/**
 * Get all saved images (Supabase or localStorage fallback)
 */
export async function getSavedImages(): Promise<SavedImage[]> {
  if (typeof window === 'undefined') return [];

  const authenticated = await isAuthenticated();

  if (authenticated) {
    return getSupabaseImages();
  } else {
    return getLocalStorageImages();
  }
}

/**
 * Get images from Supabase
 */
async function getSupabaseImages(): Promise<SavedImage[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch images from Supabase:', error);
      return [];
    }

    return (
      (data as Image[])?.map((img) => ({
        id: img.id,
        src: img.generated_url || img.original_url,
        alt: img.name,
        createdAt: new Date(img.created_at),
        type: (img.style ? 'ai-edited' : 'manual') as 'ai-edited' | 'manual',
        prompt: img.prompt || undefined,
        style: img.style || undefined,
      })) || []
    );
  } catch (error) {
    logger.error('Error loading images from Supabase:', error);
    return [];
  }
}

/**
 * Get images from localStorage (guest mode)
 */
function getLocalStorageImages(): SavedImage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Array<
      Omit<SavedImage, 'createdAt'> & { createdAt: string }
    >;
    return parsed.map((img) => ({
      ...img,
      createdAt: new Date(img.createdAt),
    }));
  } catch (error) {
    logger.error('Failed to load gallery images from localStorage:', error);
    return [];
  }
}

/**
 * Save a new image to gallery (Supabase or localStorage)
 */
export async function saveImageToGallery(
  src: string,
  alt: string,
  type: 'ai-edited' | 'manual' = 'manual',
  options?: { prompt?: string; style?: string; fileSize?: number }
): Promise<SavedImage> {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    return saveToSupabase(src, alt, type, options);
  } else {
    return saveToLocalStorage(src, alt, type);
  }
}

/**
 * Save image to Supabase (uploads to Storage + saves metadata)
 */
async function saveToSupabase(
  src: string,
  alt: string,
  type: 'ai-edited' | 'manual',
  options?: { prompt?: string; style?: string; fileSize?: number }
): Promise<SavedImage> {
  try {
    const supabase = createClient();

    // Get user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Download the image from the external URL (FAL.AI or data URL)
    let blob: Blob;
    let actualFileSize = options?.fileSize || 0;

    if (src.startsWith('data:')) {
      // Data URL (uploaded file)
      const response = await fetch(src);
      blob = await response.blob();
      actualFileSize = blob.size;
    } else {
      // External URL (FAL.AI)
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error('Failed to fetch image from URL');
      }
      blob = await response.blob();
      actualFileSize = blob.size;
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const extension = blob.type.split('/')[1] || 'jpg';
    const fileName = `${user.id}/${timestamp}_${randomId}.${extension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, blob, {
        contentType: blob.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      logger.error('Failed to upload image to storage:', uploadError);
      throw new Error('Failed to upload image to storage');
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(uploadData.path);

    // Insert image record with Storage URL
    type ImageInsert = Database['public']['Tables']['images']['Insert'];
    const insertData: ImageInsert = {
      user_id: user.id,
      original_url: src.startsWith('data:') ? publicUrl : src,
      generated_url: publicUrl,
      name: alt,
      size: actualFileSize,
      prompt: options?.prompt || null,
      style: options?.style || null,
    };

    // Type assertion needed due to Supabase client not inferring Database types correctly
    const result = (await supabase
      .from('images')
      .insert(insertData as never) // Bypass Supabase's type check
      .select()
      .single()) as {
      data: Image | null;
      error: { message: string } | null;
    };

    const { data, error } = result;

    if (error || !data) {
      // Cleanup: Delete uploaded file if DB insert fails
      await supabase.storage.from('images').remove([uploadData.path]);
      logger.error('Failed to save image to database:', error);
      throw new Error('Failed to save image to gallery');
    }

    logger.info('✅ Image saved to Supabase:', {
      id: data?.id,
      storageUrl: publicUrl,
    });

    return {
      id: data.id,
      src: data.generated_url || data.original_url,
      alt: data.name,
      createdAt: new Date(data.created_at),
      type,
      prompt: data.prompt || undefined,
      style: data.style || undefined,
    };
  } catch (error) {
    logger.error('Error saving to Supabase:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to save image';
    throw new Error(message);
  }
}

/**
 * Save image to localStorage (guest mode)
 */
function saveToLocalStorage(
  src: string,
  alt: string,
  type: 'ai-edited' | 'manual'
): SavedImage {
  const existing = getLocalStorageImages();

  // Check image limit
  if (existing.length >= MAX_IMAGES) {
    throw new Error(
      `Gallery limit reached (${MAX_IMAGES} images). Please delete some images first.`
    );
  }

  const newImage: SavedImage = {
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    src,
    alt,
    createdAt: new Date(),
    type,
  };

  const updated = [newImage, ...existing];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newImage;
  } catch (error) {
    logger.error('Failed to save image to localStorage:', error);

    if (
      error instanceof DOMException &&
      (error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
    ) {
      throw new Error(
        'Storage quota exceeded. Please delete some images or use a smaller image size.'
      );
    }

    throw new Error('Failed to save image. Please try again.');
  }
}

/**
 * Delete an image from gallery
 */
export async function deleteImageFromGallery(imageId: string): Promise<void> {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    return deleteFromSupabase(imageId);
  } else {
    return deleteFromLocalStorage(imageId);
  }
}

/**
 * Delete from Supabase
 */
async function deleteFromSupabase(imageId: string): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase.from('images').delete().eq('id', imageId);

    if (error) {
      logger.error('Failed to delete image from Supabase:', error);
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    logger.error('Error deleting from Supabase:', error);
    throw new Error('Failed to delete image. Please try again.');
  }
}

/**
 * Delete from localStorage
 */
function deleteFromLocalStorage(imageId: string): void {
  const existing = getLocalStorageImages();
  const filtered = existing.filter((img) => img.id !== imageId);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    logger.error('Failed to delete image from localStorage:', error);
    throw new Error('Failed to delete image.');
  }
}

/**
 * Clear all images from gallery
 */
export async function clearGallery(): Promise<void> {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from('images').delete().eq('user_id', user.id);
      }
    } catch (error) {
      logger.error('Failed to clear gallery from Supabase:', error);
    }
  } else {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      logger.error('Failed to clear gallery from localStorage:', error);
    }
  }
}

/**
 * Get gallery image count
 */
export async function getGalleryImageCount(): Promise<number> {
  const images = await getSavedImages();
  return images.length;
}
