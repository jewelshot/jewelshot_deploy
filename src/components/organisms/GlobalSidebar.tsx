/**
 * GlobalSidebar Component
 *
 * Wrapper for Sidebar that only renders on app pages (not auth/landing)
 * Persists across route changes to prevent remounting
 */

'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/organisms/Sidebar';
import SidebarToggle from '@/components/atoms/SidebarToggle';

// Pages where sidebar should NOT be shown
const NO_SIDEBAR_ROUTES = [
  '/',           // Landing page
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/verify-email',
  '/maintenance',
];

export default function GlobalSidebar() {
  const pathname = usePathname();

  // Don't show sidebar on auth/landing pages
  if (NO_SIDEBAR_ROUTES.includes(pathname)) {
    return null;
  }

  // Don't show sidebar on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Don't show sidebar on lab pages (experimental features)
  if (pathname.startsWith('/studio/lab')) {
    return null;
  }

  // Don't show sidebar on presets page
  if (pathname.startsWith('/studio/presets')) {
    return null;
  }

  // Don't show sidebar on debug/test pages
  if (pathname.startsWith('/sentry-debug') || pathname.startsWith('/sentry-example-page')) {
    return null;
  }

  return (
    <>
      <Sidebar />
      <SidebarToggle />
    </>
  );
}


