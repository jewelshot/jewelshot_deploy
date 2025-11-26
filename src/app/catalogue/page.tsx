/**
 * Catalogue Page
 *
 * PDF Catalogue generator for favorite images with metadata.
 * Features: drag-and-drop ordering, customizable settings, PDF export.
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';
import { useBreakpoint } from '@/hooks/useMediaQuery';

// Dynamic imports for heavy components
const RightSidebar = dynamic(
  () => import('@/components/organisms/RightSidebar'),
  { loading: () => null }
);
const RightSidebarToggle = dynamic(
  () => import('@/components/atoms/RightSidebarToggle')
);
const TopBar = dynamic(() => import('@/components/organisms/TopBar'), {
  loading: () => null,
});
const TopBarToggle = dynamic(() => import('@/components/atoms/TopBarToggle'));
const BottomBar = dynamic(() => import('@/components/organisms/BottomBar'), {
  loading: () => null,
});
const BottomBarToggle = dynamic(
  () => import('@/components/atoms/BottomBarToggle')
);
const CatalogueContent = dynamic(
  () => import('@/components/organisms/CatalogueContent'),
  {
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading Catalogue...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Fallback component for errors
function CatalogueFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-white/70">Failed to load catalogue</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  const { isMobile } = useBreakpoint();

  // Mobile: Show warning
  if (isMobile) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Desktop Required
          </h2>
          <p className="text-white/70">
            PDF Catalogue creation is best experienced on desktop. Please use a
            larger screen for optimal results.
          </p>
        </div>
      </div>
    );
  }

  // Desktop: Full catalogue
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Top Bar */}
      <TopBar />
      <TopBarToggle />


      {/* Right Sidebar */}
      <RightSidebar />
      <RightSidebarToggle />

      {/* Bottom Bar */}
      <BottomBar />
      <BottomBarToggle />

      {/* Main Content */}
      <ErrorBoundary fallback={<CatalogueFallback />}>
        <CatalogueContent />
      </ErrorBoundary>
    </>
  );
}
