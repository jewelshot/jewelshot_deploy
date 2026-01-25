/**
 * Permission System Types
 * 
 * Type definitions for plan-based access control
 */

// ============================================
// PLAN TYPES
// ============================================

/**
 * Available subscription plans
 */
export type PlanId = 'free' | 'basic' | 'studio' | 'pro' | 'enterprise';

/**
 * User roles in the system
 */
export type UserRole = 'user' | 'admin' | 'superadmin';

/**
 * Permission types
 */
export type PermissionType = 'page' | 'feature' | 'limit';

// ============================================
// PAGE PERMISSIONS
// ============================================

/**
 * Available page keys for access control
 */
export type PageKey = 
  | 'studio'
  | 'gallery'
  | 'profile'
  | 'batch'
  | 'library'
  | '3d-view'
  | 'catalogue'
  | 'brand-lab'
  | 'design-office'
  | 'motion-plus';

// ============================================
// FEATURE PERMISSIONS
// ============================================

/**
 * Available feature keys for access control
 */
export type FeatureKey =
  | 'ai_generation'
  | 'batch_processing'
  | 'api_access'
  | 'custom_presets'
  | 'priority_queue'
  | 'white_label'
  | 'team_management'
  | 'video_generation'
  | '3d_rendering'
  | 'hdr_export'
  | 'raw_export';

// ============================================
// LIMIT PERMISSIONS
// ============================================

/**
 * Available limit keys
 */
export type LimitKey =
  | 'max_concurrent'
  | 'max_batch_size'
  | 'storage_gb'
  | 'history_days'
  | 'daily_generations'
  | 'max_resolution';

// ============================================
// DATABASE TYPES
// ============================================

/**
 * Plan permission record from database
 */
export interface PlanPermission {
  id: string;
  plan_id: PlanId;
  permission_type: PermissionType;
  permission_key: string;
  permission_value: number;
  description: string | null;
  created_at: string;
}

/**
 * User's complete permission set
 */
export interface UserPermissions {
  userId: string;
  plan: PlanId;
  role: UserRole;
  pages: Record<PageKey, boolean>;
  features: Record<FeatureKey, boolean>;
  limits: Record<LimitKey, number>;
}

// ============================================
// HELPER TYPES
// ============================================

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  requiredPlan?: PlanId;
}

/**
 * Feature gate props
 */
export interface FeatureGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

/**
 * Page guard props
 */
export interface PageGuardProps {
  page: PageKey;
  children: React.ReactNode;
  redirectTo?: string;
}

// ============================================
// PLAN CONFIGURATION
// ============================================

/**
 * Plan display information
 */
export interface PlanInfo {
  id: PlanId;
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  credits: number;
  badge?: string;
  popular?: boolean;
}

/**
 * Plan comparison for upgrade prompts
 */
export const PLAN_HIERARCHY: Record<PlanId, number> = {
  free: 0,
  basic: 1,
  studio: 2,
  pro: 3,
  enterprise: 4,
};

/**
 * Check if plan A is higher than plan B
 */
export function isPlanHigherThan(planA: PlanId, planB: PlanId): boolean {
  return PLAN_HIERARCHY[planA] > PLAN_HIERARCHY[planB];
}

/**
 * Get minimum plan required for a feature (from constant config)
 */
export function getMinimumPlanForFeature(feature: FeatureKey): PlanId {
  // This will be populated from the constants file
  const FEATURE_MIN_PLANS: Record<FeatureKey, PlanId> = {
    ai_generation: 'free',
    batch_processing: 'basic',
    api_access: 'pro',
    custom_presets: 'studio',
    priority_queue: 'studio',
    white_label: 'enterprise',
    team_management: 'enterprise',
    video_generation: 'studio',
    '3d_rendering': 'studio',
    hdr_export: 'pro',
    raw_export: 'pro',
  };

  return FEATURE_MIN_PLANS[feature];
}
