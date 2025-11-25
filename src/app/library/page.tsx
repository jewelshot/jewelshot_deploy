/**
 * Library Page
 *
 * Browse and select presets for Quick Presets panel.
 * Uses dynamic imports for better code splitting.
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';

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

export default function LibraryPage() {
  // Desktop: Full library with sidebar
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Left Sidebar */}
      <Sidebar />
      <SidebarToggle />

      {/* Library Content */}
      <LibraryContent />
    </>
  );
}
