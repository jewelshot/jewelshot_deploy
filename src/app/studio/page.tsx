/**
 * Studio Page
 *
 * Main studio workspace with sidebar and canvas.
 * Uses dynamic imports for better code splitting.
 * Mobile-responsive with simplified interface for touch devices.
 */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';
import CanvasFallback from '@/components/molecules/CanvasFallback';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import { useNoScroll } from '@/hooks/useNoScroll';
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
  const [isClient, setIsClient] = useState(false);
  
  // Disable body scroll for fixed viewport
  useNoScroll();

  // Fix hydration: Only check breakpoint after client mount
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  // Mobile: Show simplified studio directly (only after hydration)
  if (isClient && isMobile) {
    return <MobileStudio />;
  }

  // Desktop: Full studio
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Top Bar */}
      <nav aria-label="Top toolbar">
        <TopBar />
      </nav>
      <TopBarToggle />

      {/* Right Sidebar - AI Controls */}
      <aside id="ai-controls" aria-label="AI generation controls" role="complementary">
        <RightSidebar onGenerateWithPreset={handleGenerateWithPreset} />
      </aside>
      <RightSidebarToggle />

      {/* Bottom Bar */}
      <nav aria-label="Bottom toolbar">
        <BottomBar />
      </nav>
      <BottomBarToggle />

      {/* Canvas Area - Main Content */}
      <main id="main-content" aria-label="Image editor canvas">
        <ErrorBoundary fallback={<CanvasFallback />}>
          <Canvas onPresetPrompt={handleGenerateWithPreset} />
        </ErrorBoundary>
      </main>
    </>
  );
}
