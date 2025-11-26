/**
 * Studio Page
 *
 * Main studio workspace with sidebar and canvas.
 * Uses dynamic imports for better code splitting.
 * Mobile-responsive with simplified interface for touch devices.
 */

'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';
import CanvasFallback from '@/components/molecules/CanvasFallback';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import MobileStudio from '@/components/organisms/MobileStudio';

// Dynamic imports for heavy components
const Canvas = dynamic(() => import('@/components/organisms/Canvas'), {
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        <p className="text-sm text-white/70">Loading Studio...</p>
      </div>
    </div>
  ),
  ssr: false,
});

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

export default function StudioPage() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  // Breakpoint detection (no logging in production)

  // Handle preset generation from RightSidebar
  const handleGenerateWithPreset = (prompt: string, aspectRatio?: string) => {
    // Trigger Canvas generation via global handler
    const win = window as Window & {
      __canvasPresetHandler?: (prompt: string, aspectRatio?: string) => void;
    };
    if (win.__canvasPresetHandler) {
      win.__canvasPresetHandler(prompt, aspectRatio);
    }
  };

  // Mobile: Show simplified studio directly
  if (isMobile) {
    return <MobileStudio />;
  }

  // Desktop: Full studio
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Top Bar */}
      <TopBar />
      <TopBarToggle />


      {/* Right Sidebar */}
      <RightSidebar onGenerateWithPreset={handleGenerateWithPreset} />
      <RightSidebarToggle />

      {/* Bottom Bar */}
      <BottomBar />
      <BottomBarToggle />

      {/* Canvas Area - Wrapped in Error Boundary */}
      <ErrorBoundary fallback={<CanvasFallback />}>
        <Canvas onPresetPrompt={handleGenerateWithPreset} />
      </ErrorBoundary>
    </>
  );
}
