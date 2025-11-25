/**
 * Library Page
 *
 * Browse and select presets for Quick Presets panel.
 * Uses dynamic imports for better code splitting.
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';
import { useBreakpoint } from '@/hooks/useMediaQuery';

// Dynamic imports for heavy components
const LibraryContent = dynamic(
  () => import('@/components/organisms/LibraryContent'),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading Library...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const Sidebar = dynamic(() => import('@/components/organisms/Sidebar'), {
  loading: () => null,
});
const SidebarToggle = dynamic(() => import('@/components/atoms/SidebarToggle'));
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

export default function LibraryPage() {
  const { isMobile } = useBreakpoint();

  // Desktop: Full library with all bars
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Top Bar */}
      <TopBar />
      <TopBarToggle />

      {/* Left Sidebar */}
      <Sidebar />
      <SidebarToggle />

      {/* Right Sidebar - Live preset preview */}
      <RightSidebar />
      <RightSidebarToggle />

      {/* Bottom Bar */}
      <BottomBar />
      <BottomBarToggle />

      {/* Library Content - Wrapped in Error Boundary */}
      <ErrorBoundary
        fallback={
          <div className="flex h-screen items-center justify-center">
            <p className="text-white/70">Failed to load Library</p>
          </div>
        }
      >
        <LibraryContent />
      </ErrorBoundary>
    </>
  );
}
