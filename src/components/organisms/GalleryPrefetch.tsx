/**
 * Gallery Prefetch Component
 *
 * Prefetches gallery images on app load for instant gallery access
 * Runs in background without blocking UI
 */

'use client';

import { useEffect } from 'react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('GalleryPrefetch');

export function GalleryPrefetch() {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check if already prefetched in this session
    const alreadyPrefetched = sessionStorage.getItem(
      'jewelshot_gallery_prefetched'
    );
    if (alreadyPrefetched === 'true') {
      logger.info('⚡ Gallery already prefetched this session');
      return;
    }

    // Prefetch after a short delay to not block initial page load
    const prefetchTimer = setTimeout(async () => {
      try {
        logger.info('🔄 Starting gallery prefetch...');

        // Dynamic import to avoid bundling on server
        const { getSavedImages } = await import('@/lib/gallery-storage');

        // Fetch images
        const images = await getSavedImages();

        // Cache in sessionStorage for instant access
        sessionStorage.setItem(
          'jewelshot_gallery_cache',
          JSON.stringify(images)
        );
        sessionStorage.setItem('jewelshot_gallery_prefetched', 'true');

        logger.info(`✅ Gallery prefetched: ${images.length} images cached`);
      } catch (error) {
        logger.error('❌ Gallery prefetch failed:', error);
      }
    }, 1000); // Wait 1 second after app loads

    return () => clearTimeout(prefetchTimer);
  }, []);

  // This component doesn't render anything
  return null;
}
