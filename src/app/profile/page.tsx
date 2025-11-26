/**
 * Profile Page
 *
 * User profile management with settings, stats, and billing.
 * Features: avatar upload, profile editing, usage statistics.
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import ErrorBoundary from '@/components/organisms/ErrorBoundary';
import { useBreakpoint } from '@/hooks/useMediaQuery';

// Dynamic imports for heavy components
const Sidebar = dynamic(() => import('@/components/organisms/Sidebar'), {
  loading: () => null,
});
const SidebarToggle = dynamic(() => import('@/components/atoms/SidebarToggle'));
const ProfileContent = dynamic(
  () => import('@/components/organisms/ProfileContent'),
  {
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading Profile...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Fallback component for errors
function ProfileFallback() {
  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Failed to Load Profile
        </h2>
        <p className="mb-6 text-white/70">
          Something went wrong while loading your profile.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-purple-500 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
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
            Profile management is best experienced on desktop for full functionality.
          </p>
        </div>
      </div>
    );
  }

  // Desktop: Full profile page
  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Left Sidebar */}
      <Sidebar />
      <SidebarToggle />

      {/* Main Content */}
      <ErrorBoundary fallback={<ProfileFallback />}>
        <ProfileContent />
      </ErrorBoundary>
    </>
  );
}

