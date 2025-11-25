import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ImageMetadata,
  FavoriteImage,
  ImageMetadataStore,
} from '@/types/image-metadata';
import { createScopedLogger } from '@/lib/logger';
import {
  syncMetadataToSupabase,
  syncFavoriteToSupabase,
  removeFavoriteFromSupabase,
  loadAllMetadataFromSupabase,
  loadFavoritesFromSupabase,
} from '@/lib/image-metadata-storage';

const logger = createScopedLogger('ImageMetadataStore');

interface ImageMetadataState extends ImageMetadataStore {
  // Metadata actions
  setMetadata: (imageId: string, metadata: Partial<ImageMetadata>) => void;
  getMetadata: (imageId: string) => ImageMetadata | null;
  deleteMetadata: (imageId: string) => void;
  updateFileName: (imageId: string, fileName: string) => void;

  // Favorites actions
  addToFavorites: (imageId: string) => boolean;
  removeFromFavorites: (imageId: string) => void;
  isFavorite: (imageId: string) => boolean;
  getFavoriteOrder: (imageId: string) => number; // Returns 0 if not favorite, otherwise 1-N
  reorderFavorites: (imageIds: string[]) => void;
  clearFavorites: () => void;
  canAddMoreFavorites: () => boolean;

  // Sync actions
  syncFromSupabase: () => Promise<void>;
  hasMetadata: (imageId: string) => boolean;
}

const DEFAULT_MAX_FAVORITES = 50;

export const useImageMetadataStore = create<ImageMetadataState>()(
  persist(
    (set, get) => ({
      metadata: {},
      favorites: [],
      maxFavorites: DEFAULT_MAX_FAVORITES,

      // ===== METADATA ACTIONS =====

      setMetadata: (
        imageId: string,
        metadataUpdate: Partial<ImageMetadata>
      ) => {
        const state = get();
        const existing = state.metadata[imageId];
        const now = Date.now();

        const newMetadata: ImageMetadata = {
          ...existing,
          ...metadataUpdate,
          imageId, // Always override
          fileName: metadataUpdate.fileName || existing?.fileName || 'Untitled',
          updatedAt: now,
          createdAt: existing?.createdAt || now,
        };

        set({
          metadata: {
            ...state.metadata,
            [imageId]: newMetadata,
          },
        });

        // Sync to Supabase in background
        syncMetadataToSupabase(newMetadata).catch((error) => {
          logger.error('Background sync failed:', error);
        });

        logger.info('Metadata updated:', imageId);
      },

      getMetadata: (imageId: string) => {
        const state = get();
        return state.metadata[imageId] || null;
      },

      deleteMetadata: (imageId: string) => {
        const state = get();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [imageId]: _removed, ...rest } = state.metadata;

        set({ metadata: rest });

        // Also remove from favorites if it exists
        state.removeFromFavorites(imageId);

        logger.info('Metadata deleted:', imageId);
      },

      updateFileName: (imageId: string, fileName: string) => {
        const state = get();
        const existing = state.metadata[imageId];

        if (existing) {
          state.setMetadata(imageId, { fileName });
        } else {
          // Create new metadata entry with just fileName
          state.setMetadata(imageId, { fileName });
        }
      },

      // ===== FAVORITES ACTIONS =====

      addToFavorites: (imageId: string) => {
        const state = get();

        // Check if already favorite
        if (state.favorites.some((f) => f.imageId === imageId)) {
          logger.warn('⚠️ Image already in favorites:', imageId);
          return false;
        }

        // Check limit
        if (state.favorites.length >= state.maxFavorites) {
          logger.warn('⚠️ Max favorites limit reached:', state.maxFavorites);
          return false;
        }

        // Calculate next order
        const nextOrder =
          state.favorites.length > 0
            ? Math.max(...state.favorites.map((f) => f.order)) + 1
            : 1;

        const newFavorite: FavoriteImage = {
          imageId,
          order: nextOrder,
          addedAt: Date.now(),
        };

        set({
          favorites: [...state.favorites, newFavorite],
        });

        // Sync to Supabase in background
        syncFavoriteToSupabase(newFavorite)
          .then((success) => {
            if (success) {
              logger.info('✅ Favorite synced to Supabase:', imageId);
            } else {
              logger.error('❌ Failed to sync favorite to Supabase:', imageId);
            }
          })
          .catch((error) => {
            logger.error('❌ Background favorite sync error:', error);
            console.error('Favorite sync error details:', error);
          });

        logger.info(
          '⭐ Added to favorites:',
          imageId,
          'order:',
          nextOrder,
          'total:',
          state.favorites.length + 1
        );
        console.log('Current favorites:', state.favorites);
        return true;
      },

      removeFromFavorites: (imageId: string) => {
        const state = get();
        const filtered = state.favorites.filter((f) => f.imageId !== imageId);

        // Reorder remaining favorites
        const reordered = filtered.map((f, index) => ({
          ...f,
          order: index + 1,
        }));

        set({ favorites: reordered });

        // Sync removal to Supabase in background
        removeFavoriteFromSupabase(imageId).catch((error) => {
          logger.error('Background favorite removal failed:', error);
        });

        // Sync reordered favorites
        reordered.forEach((fav) => {
          syncFavoriteToSupabase(fav).catch((error) => {
            logger.error('Background favorite reorder sync failed:', error);
          });
        });

        logger.info('Removed from favorites:', imageId);
      },

      isFavorite: (imageId: string) => {
        const state = get();
        return state.favorites.some((f) => f.imageId === imageId);
      },

      getFavoriteOrder: (imageId: string) => {
        const state = get();
        const favorite = state.favorites.find((f) => f.imageId === imageId);
        return favorite ? favorite.order : 0;
      },

      reorderFavorites: (imageIds: string[]) => {
        const state = get();

        // Create new favorites array with new order
        const reordered = imageIds
          .map((id, index) => {
            const existing = state.favorites.find((f) => f.imageId === id);
            if (!existing) return null;

            return {
              ...existing,
              order: index + 1,
            };
          })
          .filter((f): f is FavoriteImage => f !== null);

        set({ favorites: reordered });

        logger.info('Favorites reordered');
      },

      clearFavorites: () => {
        set({ favorites: [] });
        logger.info('Favorites cleared');
      },

      canAddMoreFavorites: () => {
        const state = get();
        return state.favorites.length < state.maxFavorites;
      },

      // ===== SYNC ACTIONS =====

      syncFromSupabase: async () => {
        try {
          logger.info('🔄 Syncing from Supabase...');

          // Load all metadata
          const metadataFromSupabase = await loadAllMetadataFromSupabase();
          logger.info(
            '📦 Loaded metadata from Supabase:',
            Object.keys(metadataFromSupabase).length,
            'items'
          );

          // Load all favorites
          const favoritesFromSupabase = await loadFavoritesFromSupabase();
          logger.info(
            '⭐ Loaded favorites from Supabase:',
            favoritesFromSupabase.length,
            'items'
          );
          console.log('Favorites from Supabase:', favoritesFromSupabase);

          // Merge with local state (Supabase is source of truth)
          set({
            metadata: metadataFromSupabase,
            favorites: favoritesFromSupabase,
          });

          logger.info(
            '✅ Synced from Supabase successfully - Metadata:',
            Object.keys(metadataFromSupabase).length,
            'Favorites:',
            favoritesFromSupabase.length
          );
        } catch (error) {
          logger.error('❌ Failed to sync from Supabase:', error);
          console.error('Supabase sync error details:', error);
        }
      },

      hasMetadata: (imageId: string) => {
        const state = get();
        return !!state.metadata[imageId];
      },
    }),
    {
      name: 'jewelshot-image-metadata',
      version: 1,
      // Add post-rehydration sync
      onRehydrateStorage: () => (state) => {
        // Sync from Supabase after rehydration
        if (state) {
          state.syncFromSupabase();
        }
      },
    }
  )
);
