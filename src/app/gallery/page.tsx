/**
 * Gallery Page
 *
 * Browse and manage jewelry images with filtering and sorting.
 * Uses dynamic imports for better code splitting.
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';
import GalleryFallback from '@/components/molecules/GalleryFallback';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import MobileGallery from '@/components/organisms/MobileGallery';
import SkipLink from '@/components/atoms/SkipLink';

// Dynamic imports for heavy components
const GalleryContent = dynamic(
  () => import('@/components/organisms/GalleryContent'),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading Gallery...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export default function GalleryPage() {
  const { isMobile } = useBreakpoint();

  // Mobile: Show simplified mobile gallery
  if (isMobile) {
    return <MobileGallery />;
  }

  // Desktop: Full gallery with sidebar
  return (
    <>
      {/* Skip Links for Accessibility */}
      <SkipLink href="#gallery-content">Skip to gallery</SkipLink>
      <SkipLink href="#gallery-search">Skip to search</SkipLink>
      
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Gallery Content - Wrapped in Error Boundary */}
      <main id="gallery-content" aria-label="Image gallery">
        <ErrorBoundary fallback={<GalleryFallback />}>
          <GalleryContent />
        </ErrorBoundary>
      </main>
    </>
  );
}
