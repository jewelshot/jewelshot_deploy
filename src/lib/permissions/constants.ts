/**
 * Permission System Constants
 * 
 * Client-side configuration for permission checks
 * This mirrors the database configuration for fast UI checks
 */

import type { PlanId, PageKey, FeatureKey, LimitKey, PlanInfo } from './types';

// ============================================
// PLAN INFORMATION
// ============================================

export const PLANS: Record<PlanId, PlanInfo> = {
  free: {
    id: 'free',
    name: 'FREE',
    displayName: 'Free',
    description: 'Perfect for trying out JewelShot',
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: 5,
  },
  basic: {
    id: 'basic',
    name: 'BASIC',
    displayName: 'Basic',
    description: 'Great for small jewelry businesses',
    monthlyPrice: 29,
    yearlyPrice: 290,
    credits: 100,
  },
  studio: {
    id: 'studio',
    name: 'STUDIO',
    displayName: 'Studio',
    description: 'Ideal for professional jewelers',
    monthlyPrice: 79,
    yearlyPrice: 790,
    credits: 300,
    popular: true,
    badge: 'Most Popular',
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    displayName: 'Pro',
    description: 'For high-volume producers',
    monthlyPrice: 199,
    yearlyPrice: 1990,
    credits: 750,
  },
  enterprise: {
    id: 'enterprise',
    name: 'ENTERPRISE',
    displayName: 'Enterprise',
    description: 'Custom solutions for large teams',
    monthlyPrice: 499,
    yearlyPrice: 4990,
    credits: 999999,
    badge: 'Contact Us',
  },
};

// ============================================
// PAGE ACCESS BY PLAN
// ============================================

export const PAGE_ACCESS: Record<PageKey, PlanId[]> = {
  studio: ['free', 'basic', 'studio', 'pro', 'enterprise'],
  gallery: ['free', 'basic', 'studio', 'pro', 'enterprise'],
  profile: ['free', 'basic', 'studio', 'pro', 'enterprise'],
  library: ['free', 'basic', 'studio', 'pro', 'enterprise'],
  batch: ['basic', 'studio', 'pro', 'enterprise'],
  '3d-view': ['studio', 'pro', 'enterprise'],
  catalogue: ['studio', 'pro', 'enterprise'],
  'brand-lab': ['pro', 'enterprise'],
  'design-office': ['pro', 'enterprise'],
  'motion-plus': ['studio', 'pro', 'enterprise'],
};

/**
 * Get minimum plan required for a page
 */
export function getMinPlanForPage(page: PageKey): PlanId {
  const plans = PAGE_ACCESS[page];
  if (!plans || plans.length === 0) return 'enterprise';
  
  // Plans are in order from lowest to highest
  return plans[0];
}

/**
 * Check if plan has page access (client-side)
 */
export function planHasPageAccess(plan: PlanId, page: PageKey): boolean {
  return PAGE_ACCESS[page]?.includes(plan) || false;
}

// ============================================
// FEATURE ACCESS BY PLAN
// ============================================

export const FEATURE_ACCESS: Record<FeatureKey, PlanId[]> = {
  ai_generation: ['free', 'basic', 'studio', 'pro', 'enterprise'],
  batch_processing: ['basic', 'studio', 'pro', 'enterprise'],
  api_access: ['pro', 'enterprise'],
  custom_presets: ['studio', 'pro', 'enterprise'],
  priority_queue: ['studio', 'pro', 'enterprise'],
  white_label: ['enterprise'],
  team_management: ['enterprise'],
  video_generation: ['studio', 'pro', 'enterprise'],
  '3d_rendering': ['studio', 'pro', 'enterprise'],
  hdr_export: ['pro', 'enterprise'],
  raw_export: ['pro', 'enterprise'],
};

/**
 * Get minimum plan required for a feature
 */
export function getMinPlanForFeature(feature: FeatureKey): PlanId {
  const plans = FEATURE_ACCESS[feature];
  if (!plans || plans.length === 0) return 'enterprise';
  return plans[0];
}

/**
 * Check if plan has feature access (client-side)
 */
export function planHasFeatureAccess(plan: PlanId, feature: FeatureKey): boolean {
  return FEATURE_ACCESS[feature]?.includes(plan) || false;
}

// ============================================
// LIMITS BY PLAN
// ============================================

export const PLAN_LIMITS: Record<PlanId, Record<LimitKey, number>> = {
  free: {
    max_concurrent: 2,
    max_batch_size: 0,
    storage_gb: 5,
    history_days: 7,
    daily_generations: 10,
    max_resolution: 1024,
  },
  basic: {
    max_concurrent: 3,
    max_batch_size: 10,
    storage_gb: 10,
    history_days: 30,
    daily_generations: 50,
    max_resolution: 2048,
  },
  studio: {
    max_concurrent: 5,
    max_batch_size: 25,
    storage_gb: 25,
    history_days: 999999,
    daily_generations: 200,
    max_resolution: 4096,
  },
  pro: {
    max_concurrent: 10,
    max_batch_size: 50,
    storage_gb: 100,
    history_days: 999999,
    daily_generations: 500,
    max_resolution: 4096,
  },
  enterprise: {
    max_concurrent: 25,
    max_batch_size: 100,
    storage_gb: 500,
    history_days: 999999,
    daily_generations: 999999,
    max_resolution: 8192,
  },
};

/**
 * Get limit value for a plan (client-side)
 */
export function getPlanLimit(plan: PlanId, limit: LimitKey): number {
  return PLAN_LIMITS[plan]?.[limit] || 0;
}

// ============================================
// PAGE METADATA
// ============================================

export const PAGE_INFO: Record<PageKey, {
  name: string;
  description: string;
  icon: string;
  path: string;
}> = {
  studio: {
    name: 'Studio',
    description: 'AI-powered jewelry photography',
    icon: 'Camera',
    path: '/studio',
  },
  gallery: {
    name: 'Gallery',
    description: 'Your generated images',
    icon: 'Images',
    path: '/gallery',
  },
  profile: {
    name: 'Profile',
    description: 'Account settings',
    icon: 'User',
    path: '/profile',
  },
  library: {
    name: 'Library',
    description: 'Preset templates',
    icon: 'BookOpen',
    path: '/library',
  },
  batch: {
    name: 'Batch',
    description: 'Bulk image processing',
    icon: 'Layers',
    path: '/batch',
  },
  '3d-view': {
    name: '3D View',
    description: '3D model viewer',
    icon: 'Box',
    path: '/3d-view',
  },
  catalogue: {
    name: 'Catalogue',
    description: 'Product catalog management',
    icon: 'BookMarked',
    path: '/catalogue',
  },
  'brand-lab': {
    name: 'Brand Lab',
    description: 'Brand identity tools',
    icon: 'Palette',
    path: '/brand-lab',
  },
  'design-office': {
    name: 'Design Office',
    description: 'Advanced design tools',
    icon: 'PenTool',
    path: '/design-office',
  },
  'motion-plus': {
    name: 'Motion+',
    description: 'Video generation',
    icon: 'Video',
    path: '/motion-plus',
  },
};

// ============================================
// FEATURE METADATA
// ============================================

export const FEATURE_INFO: Record<FeatureKey, {
  name: string;
  description: string;
}> = {
  ai_generation: {
    name: 'AI Generation',
    description: 'Generate professional jewelry images with AI',
  },
  batch_processing: {
    name: 'Batch Processing',
    description: 'Process multiple images at once',
  },
  api_access: {
    name: 'API Access',
    description: 'Integrate with your own applications',
  },
  custom_presets: {
    name: 'Custom Presets',
    description: 'Create and save your own presets',
  },
  priority_queue: {
    name: 'Priority Queue',
    description: 'Skip the queue for faster processing',
  },
  white_label: {
    name: 'White Label',
    description: 'Remove JewelShot branding',
  },
  team_management: {
    name: 'Team Management',
    description: 'Manage team members and permissions',
  },
  video_generation: {
    name: 'Video Generation',
    description: 'Create product videos',
  },
  '3d_rendering': {
    name: '3D Rendering',
    description: 'Render 3D jewelry models',
  },
  hdr_export: {
    name: 'HDR Export',
    description: 'Export in HDR format',
  },
  raw_export: {
    name: 'RAW Export',
    description: 'Export in RAW format',
  },
};
