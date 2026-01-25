/**
 * FeatureGate Component
 * 
 * Conditionally renders content based on feature access
 * Shows upgrade prompt if user doesn't have access
 */

'use client';

import { type ReactNode } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { usePermissionContext } from '@/hooks/usePermissions';
import type { FeatureKey, PlanId } from '@/lib/permissions/types';
import { PLANS, FEATURE_INFO } from '@/lib/permissions/constants';

interface FeatureGateProps {
  /** Feature to check */
  feature: FeatureKey;
  /** Content to show if user has access */
  children: ReactNode;
  /** Content to show if user doesn't have access */
  fallback?: ReactNode;
  /** Show upgrade prompt instead of fallback */
  showUpgrade?: boolean;
  /** Custom upgrade message */
  upgradeMessage?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgrade = true,
  upgradeMessage,
}: FeatureGateProps) {
  const { hasFeature, getFeatureRequiredPlan, isLoading, plan } = usePermissionContext();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // If user has access, show children
  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  // If no upgrade prompt and no fallback, show nothing
  if (!showUpgrade && !fallback) {
    return null;
  }

  // If custom fallback provided, show it
  if (fallback && !showUpgrade) {
    return <>{fallback}</>;
  }

  // Show upgrade prompt
  const requiredPlan = getFeatureRequiredPlan(feature);
  const planInfo = PLANS[requiredPlan];
  const featureInfo = FEATURE_INFO[feature];

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-6">
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-purple-500/20 p-3">
          <Lock className="h-6 w-6 text-purple-400" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-white">
          {featureInfo?.name || feature} is a {planInfo.displayName}+ Feature
        </h3>
        
        <p className="mb-4 max-w-sm text-sm text-white/50">
          {upgradeMessage || featureInfo?.description || `Upgrade to ${planInfo.displayName} to unlock this feature.`}
        </p>
        
        <a
          href="/pricing"
          className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-600"
        >
          <Sparkles className="h-4 w-4" />
          Upgrade to {planInfo.displayName}
        </a>
        
        {fallback && (
          <div className="mt-4 w-full border-t border-white/10 pt-4">
            {fallback}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Simple feature check wrapper
 * Just hides content if user doesn't have access
 */
interface FeatureCheckProps {
  feature: FeatureKey;
  children: ReactNode;
}

export function FeatureCheck({ feature, children }: FeatureCheckProps) {
  const { hasFeature, isLoading } = usePermissionContext();

  if (isLoading || !hasFeature(feature)) {
    return null;
  }

  return <>{children}</>;
}

export default FeatureGate;
