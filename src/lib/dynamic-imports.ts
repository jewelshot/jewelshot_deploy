/**
 * Dynamic Imports for Code Splitting
 * 
 * Lazy load heavy components and libraries
 * Usage: Import from this file instead of directly importing components
 * 
 * Example:
 * import { DynamicGalleryContent } from '@/lib/dynamic-imports';
 */

import dynamic from 'next/dynamic';

// Gallery Content (lazy load for better initial load)
export const DynamicGalleryContent = dynamic(
  () => import('@/components/organisms/GalleryContent').then(mod => ({ default: mod.GalleryContent })),
  {
    ssr: true,
  }
);

// Batch Detail Content (heavy component)
export const DynamicBatchDetailContent = dynamic(
  () => import('@/components/organisms/BatchDetailContent').then(mod => ({ default: mod.BatchDetailContent })),
  {
    ssr: true,
  }
);

