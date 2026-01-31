/**
 * Dashboard Page
 *
 * Enterprise-level dashboard with analytics, stats, and recent activity.
 * Features: Usage stats, recent images, activity timeline, plan info.
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';
import { useBreakpoint } from '@/hooks/useMediaQuery';

// Dynamic imports for heavy components
const DashboardContent = dynamic(
  () => import('@/components/organisms/DashboardContent'),
  {
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
          <p className="text-sm text-white/70">Loading Dashboard...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const OnboardingModal = dynamic(
  () => import('@/components/organisms/OnboardingModal').then(mod => ({ default: mod.OnboardingModal })),
  { ssr: false }
);

// Fallback component for errors
function DashboardFallback() {
  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Failed to Load Dashboard
        </h2>
        <p className="mb-6 text-white/70">
          Something went wrong while loading your dashboard.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isMobile } = useBreakpoint();

  // Mobile: Show simplified message
  if (isMobile) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Desktop Recommended
          </h2>
          <p className="text-white/70">
            Dashboard is best experienced on desktop for full analytics view.
          </p>
        </div>
      </div>
    );
  }

  // Desktop: Full dashboard
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Main Content - Sidebar is now global */}
      <ErrorBoundary fallback={<DashboardFallback />}>
        <DashboardContent />
      </ErrorBoundary>

      {/* Onboarding Modal for new users */}
      <OnboardingModal />
    </>
  );
}

