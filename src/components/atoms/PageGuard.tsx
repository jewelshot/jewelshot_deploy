/**
 * PageGuard Component
 * 
 * Protects pages based on plan access
 * Redirects or shows upgrade prompt if user doesn't have access
 */

'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { usePermissionContext } from '@/hooks/usePermissions';
import type { PageKey } from '@/lib/permissions/types';
import { PLANS, PAGE_INFO } from '@/lib/permissions/constants';

interface PageGuardProps {
  /** Page to check access for */
  page: PageKey;
  /** Content to show if user has access */
  children: ReactNode;
  /** Redirect to this path if no access (default: show upgrade prompt) */
  redirectTo?: string;
  /** Show loading skeleton while checking */
  loadingFallback?: ReactNode;
}

export function PageGuard({
  page,
  children,
  redirectTo,
  loadingFallback,
}: PageGuardProps) {
  const router = useRouter();
  const { canAccessPage, getPageRequiredPlan, isLoading, isAuthenticated, plan } = usePermissionContext();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !canAccessPage(page) && redirectTo) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, canAccessPage, page, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return loadingFallback || <PageGuardSkeleton />;
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return loadingFallback || <PageGuardSkeleton />;
  }

  // If user has access, show children
  if (canAccessPage(page)) {
    return <>{children}</>;
  }

  // If redirecting, show nothing
  if (redirectTo) {
    return loadingFallback || <PageGuardSkeleton />;
  }

  // Show upgrade prompt
  const requiredPlan = getPageRequiredPlan(page);
  const planInfo = PLANS[requiredPlan];
  const pageInfo = PAGE_INFO[page];

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-8">
      <div className="max-w-md text-center">
        {/* Lock Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-purple-500/20 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
          <Lock className="h-10 w-10 text-purple-400" />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-white">
          {pageInfo?.name || page} Requires {planInfo.displayName}
        </h1>

        {/* Description */}
        <p className="mb-6 text-white/50">
          {pageInfo?.description || `This page is available for ${planInfo.displayName} subscribers and above.`}
        </p>

        {/* Current plan badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/70">
          Your current plan: <span className="font-medium text-white">{PLANS[plan].displayName}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/pricing"
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-600"
          >
            <Sparkles className="h-4 w-4" />
            Upgrade to {planInfo.displayName}
          </a>
          
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Plan comparison hint */}
        <p className="mt-8 text-sm text-white/40">
          Not sure which plan is right for you?{' '}
          <a href="/pricing" className="text-purple-400 hover:text-purple-300">
            Compare plans →
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for page guard
 */
function PageGuardSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}

export default PageGuard;
