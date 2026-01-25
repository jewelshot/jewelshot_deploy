/**
 * Permission Database Queries
 * 
 * Server-side permission checks
 */

import { createServiceClient } from '@/lib/supabase/service';
import { createClient } from '@/lib/supabase/server';
import type { 
  PlanId, 
  UserRole, 
  PageKey, 
  FeatureKey, 
  LimitKey,
  UserPermissions,
  PlanPermission,
} from './types';

// ============================================
// USER PERMISSION CHECKS
// ============================================

/**
 * Check if current user has access to a page
 */
export async function hasPageAccess(pageKey: PageKey): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .rpc('user_has_page_access', {
      p_user_id: user.id,
      p_page_key: pageKey,
    });

  return data === true;
}

/**
 * Check if current user has access to a feature
 */
export async function hasFeatureAccess(featureKey: FeatureKey): Promise<boolean> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .rpc('user_has_feature_access', {
      p_user_id: user.id,
      p_feature_key: featureKey,
    });

  return data === true;
}

/**
 * Get current user's limit value
 */
export async function getUserLimit(limitKey: LimitKey): Promise<number> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .rpc('get_user_limit', {
      p_user_id: user.id,
      p_limit_key: limitKey,
    });

  return data || 0;
}

/**
 * Get current user's complete permissions
 */
export async function getCurrentUserPermissions(): Promise<UserPermissions | null> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_plan, role')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  const profileData = profile as { subscription_plan?: string; role?: string };
  const plan = (profileData.subscription_plan || 'free') as PlanId;
  const role = (profileData.role || 'user') as UserRole;

  // If admin/superadmin, return full permissions
  if (role === 'admin' || role === 'superadmin') {
    return {
      userId: user.id,
      plan,
      role,
      pages: {
        studio: true,
        gallery: true,
        profile: true,
        batch: true,
        library: true,
        '3d-view': true,
        catalogue: true,
        'brand-lab': true,
        'design-office': true,
        'motion-plus': true,
      },
      features: {
        ai_generation: true,
        batch_processing: true,
        api_access: true,
        custom_presets: true,
        priority_queue: true,
        white_label: true,
        team_management: true,
        video_generation: true,
        '3d_rendering': true,
        hdr_export: true,
        raw_export: true,
      },
      limits: {
        max_concurrent: 999999,
        max_batch_size: 999999,
        storage_gb: 999999,
        history_days: 999999,
        daily_generations: 999999,
        max_resolution: 999999,
      },
    };
  }

  // Get plan permissions
  const { data: permissions } = await supabase
    .from('plan_permissions')
    .select('*')
    .eq('plan_id', plan);

  if (!permissions) {
    return {
      userId: user.id,
      plan,
      role,
      pages: {} as Record<PageKey, boolean>,
      features: {} as Record<FeatureKey, boolean>,
      limits: {} as Record<LimitKey, number>,
    };
  }

  // Build permission maps
  const pages: Record<string, boolean> = {};
  const features: Record<string, boolean> = {};
  const limits: Record<string, number> = {};

  permissions.forEach((p: PlanPermission) => {
    if (p.permission_type === 'page') {
      pages[p.permission_key] = p.permission_value > 0;
    } else if (p.permission_type === 'feature') {
      features[p.permission_key] = p.permission_value > 0;
    } else if (p.permission_type === 'limit') {
      limits[p.permission_key] = p.permission_value;
    }
  });

  return {
    userId: user.id,
    plan,
    role,
    pages: pages as Record<PageKey, boolean>,
    features: features as Record<FeatureKey, boolean>,
    limits: limits as Record<LimitKey, number>,
  };
}

// ============================================
// SERVICE ROLE QUERIES
// ============================================

/**
 * Check page access for a specific user (service role)
 */
export async function checkUserPageAccess(
  userId: string,
  pageKey: PageKey
): Promise<boolean> {
  const supabase = createServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .rpc('user_has_page_access', {
      p_user_id: userId,
      p_page_key: pageKey,
    });

  return data === true;
}

/**
 * Check feature access for a specific user (service role)
 */
export async function checkUserFeatureAccess(
  userId: string,
  featureKey: FeatureKey
): Promise<boolean> {
  const supabase = createServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .rpc('user_has_feature_access', {
      p_user_id: userId,
      p_feature_key: featureKey,
    });

  return data === true;
}

/**
 * Get limit for a specific user (service role)
 */
export async function checkUserLimit(
  userId: string,
  limitKey: LimitKey
): Promise<number> {
  const supabase = createServiceClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .rpc('get_user_limit', {
      p_user_id: userId,
      p_limit_key: limitKey,
    });

  return data || 0;
}

/**
 * Get all permissions for a plan
 */
export async function getPlanPermissions(planId: PlanId): Promise<PlanPermission[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('plan_permissions')
    .select('*')
    .eq('plan_id', planId)
    .order('permission_type');

  if (error) {
    console.error('Error fetching plan permissions:', error);
    return [];
  }

  return data || [];
}

/**
 * Update a plan permission (superadmin only)
 */
export async function updatePlanPermission(
  planId: PlanId,
  permissionType: string,
  permissionKey: string,
  permissionValue: number
): Promise<boolean> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('plan_permissions')
    .upsert({
      plan_id: planId,
      permission_type: permissionType,
      permission_key: permissionKey,
      permission_value: permissionValue,
    }, {
      onConflict: 'plan_id,permission_type,permission_key',
    });

  if (error) {
    console.error('Error updating permission:', error);
    return false;
  }

  return true;
}
