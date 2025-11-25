/**
 * Image Metadata Storage
 * Handles both localStorage and Supabase sync for image metadata and favorites
 */

import { createClient } from '@/lib/supabase/client';
import { ImageMetadata, FavoriteImage } from '@/types/image-metadata';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('ImageMetadataStorage');

/**
 * Sync metadata to Supabase
 */
export async function syncMetadataToSupabase(
  metadata: ImageMetadata
): Promise<boolean> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      logger.warn('No user logged in, skipping Supabase sync');
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('image_metadata').upsert({
      user_id: user.id,
      image_id: metadata.imageId,
      file_name: metadata.fileName,
      carat: metadata.carat || null,
      color: metadata.color || null,
      clarity: metadata.clarity || null,
      setting: metadata.setting || null,
      weight: metadata.weight || null,
      description: metadata.description || null,
      price: metadata.price || null,
      sku: metadata.sku || null,
      notes: metadata.notes || null,
    });

    if (error) {
      logger.error('Failed to sync metadata to Supabase:', error);
      return false;
    }

    logger.info('Metadata synced to Supabase:', metadata.imageId);
    return true;
  } catch (error) {
    logger.error('Error syncing metadata:', error);
    return false;
  }
}

/**
 * Load metadata from Supabase
 */
export async function loadMetadataFromSupabase(
  imageId: string
): Promise<ImageMetadata | null> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('image_metadata')
      .select('*')
      .eq('user_id', user.id)
      .eq('image_id', imageId)
      .single();

    if (error || !data) return null;

    return {
      imageId: data.image_id,
      fileName: data.file_name,
      carat: data.carat || undefined,
      color: data.color || undefined,
      clarity: data.clarity || undefined,
      setting: data.setting || undefined,
      weight: data.weight || undefined,
      description: data.description || undefined,
      price: data.price || undefined,
      sku: data.sku || undefined,
      notes: data.notes || undefined,
      createdAt: new Date(data.created_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime(),
    };
  } catch (error) {
    logger.error('Error loading metadata:', error);
    return null;
  }
}

/**
 * Sync favorite to Supabase
 */
export async function syncFavoriteToSupabase(
  favorite: FavoriteImage
): Promise<boolean> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      logger.warn('No user logged in, skipping favorite sync');
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('favorite_images').upsert({
      user_id: user.id,
      image_id: favorite.imageId,
      order_index: favorite.order,
      added_at: new Date(favorite.addedAt).toISOString(),
    });

    if (error) {
      logger.error('Failed to sync favorite to Supabase:', error);
      return false;
    }

    logger.info('Favorite synced to Supabase:', favorite.imageId);
    return true;
  } catch (error) {
    logger.error('Error syncing favorite:', error);
    return false;
  }
}

/**
 * Remove favorite from Supabase
 */
export async function removeFavoriteFromSupabase(
  imageId: string
): Promise<boolean> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('favorite_images')
      .delete()
      .eq('user_id', user.id)
      .eq('image_id', imageId);

    if (error) {
      logger.error('Failed to remove favorite from Supabase:', error);
      return false;
    }

    logger.info('Favorite removed from Supabase:', imageId);
    return true;
  } catch (error) {
    logger.error('Error removing favorite:', error);
    return false;
  }
}

/**
 * Load all favorites from Supabase
 */
export async function loadFavoritesFromSupabase(): Promise<FavoriteImage[]> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('favorite_images')
      .select('*')
      .eq('user_id', user.id)
      .order('order_index', { ascending: true });

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((fav: any) => ({
      imageId: fav.image_id,
      order: fav.order_index,
      addedAt: new Date(fav.added_at).getTime(),
    }));
  } catch (error) {
    logger.error('Error loading favorites:', error);
    return [];
  }
}

/**
 * Load all metadata from Supabase for current user
 */
export async function loadAllMetadataFromSupabase(): Promise<
  Record<string, ImageMetadata>
> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('image_metadata')
      .select('*')
      .eq('user_id', user.id);

    if (error || !data) return {};

    const metadata: Record<string, ImageMetadata> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.forEach((item: any) => {
      metadata[item.image_id] = {
        imageId: item.image_id,
        fileName: item.file_name,
        carat: item.carat || undefined,
        color: item.color || undefined,
        clarity: item.clarity || undefined,
        setting: item.setting || undefined,
        weight: item.weight || undefined,
        description: item.description || undefined,
        price: item.price || undefined,
        sku: item.sku || undefined,
        notes: item.notes || undefined,
        createdAt: new Date(item.created_at).getTime(),
        updatedAt: new Date(item.updated_at).getTime(),
      };
    });

    return metadata;
  } catch (error) {
    logger.error('Error loading all metadata:', error);
    return {};
  }
}
