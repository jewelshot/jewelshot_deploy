/**
 * usePermissions Hook
 * 
 * Client-side hook for checking user permissions
 */

'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { PlanId, UserRole, PageKey, FeatureKey, LimitKey } from '@/lib/permissions/types';
import { 
  planHasPageAccess, 
  planHasFeatureAccess, 
  getPlanLimit,
  PLANS,
  getMinPlanForPage,
  getMinPlanForFeature,
} from '@/lib/permissions/constants';

// ============================================
// PERMISSION STATE
// ============================================

interface PermissionState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  plan: PlanId;
  role: UserRole;
}

interface UsePermissionsReturn extends PermissionState {
  // Page access
  canAccessPage: (page: PageKey) => boolean;
  getPageRequiredPlan: (page: PageKey) => PlanId;
  
  // Feature access
  hasFeature: (feature: FeatureKey) => boolean;
  getFeatureRequiredPlan: (feature: FeatureKey) => PlanId;
  
  // Limits
  getLimit: (limit: LimitKey) => number;
  
  // Role checks
  isAdmin: boolean;
  isSuperAdmin: boolean;
  
  // Plan info
  planInfo: typeof PLANS[PlanId];
  
  // Refresh
  refresh: () => Promise<void>;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function usePermissions(): UsePermissionsReturn {
  const [state, setState] = useState<PermissionState>({
    isLoading: true,
    isAuthenticated: false,
    userId: null,
    plan: 'free',
    role: 'user',
  });

  const fetchPermissions = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch('/api/auth/me');
      
      if (!response.ok) {
        setState({
          isLoading: false,
          isAuthenticated: false,
          userId: null,
          plan: 'free',
          role: 'user',
        });
        return;
      }

      const data = await response.json();

      if (data.user) {
        setState({
          isLoading: false,
          isAuthenticated: true,
          userId: data.user.id,
          plan: (data.profile?.subscription_plan || 'free') as PlanId,
          role: (data.profile?.role || 'user') as UserRole,
        });
      } else {
        setState({
          isLoading: false,
          isAuthenticated: false,
          userId: null,
          plan: 'free',
          role: 'user',
        });
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setState({
        isLoading: false,
        isAuthenticated: false,
        userId: null,
        plan: 'free',
        role: 'user',
      });
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Check page access
  const canAccessPage = useCallback((page: PageKey): boolean => {
    // Admins have full access
    if (state.role === 'admin' || state.role === 'superadmin') {
      return true;
    }
    return planHasPageAccess(state.plan, page);
  }, [state.plan, state.role]);

  // Check feature access
  const hasFeature = useCallback((feature: FeatureKey): boolean => {
    // Admins have full access
    if (state.role === 'admin' || state.role === 'superadmin') {
      return true;
    }
    return planHasFeatureAccess(state.plan, feature);
  }, [state.plan, state.role]);

  // Get limit value
  const getLimit = useCallback((limit: LimitKey): number => {
    // Admins get max limits
    if (state.role === 'admin' || state.role === 'superadmin') {
      return 999999;
    }
    return getPlanLimit(state.plan, limit);
  }, [state.plan, state.role]);

  return {
    ...state,
    canAccessPage,
    getPageRequiredPlan: getMinPlanForPage,
    hasFeature,
    getFeatureRequiredPlan: getMinPlanForFeature,
    getLimit,
    isAdmin: state.role === 'admin' || state.role === 'superadmin',
    isSuperAdmin: state.role === 'superadmin',
    planInfo: PLANS[state.plan],
    refresh: fetchPermissions,
  };
}

// ============================================
// PERMISSION CONTEXT
// ============================================

const PermissionContext = createContext<UsePermissionsReturn | null>(null);

export function usePermissionContext(): UsePermissionsReturn {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within PermissionProvider');
  }
  return context;
}

interface PermissionProviderProps {
  children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const permissions = usePermissions();

  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
}

// ============================================
// QUICK ACCESS FUNCTIONS
// ============================================

/**
 * Check if current plan can access a page (client-side only, no server check)
 */
export function checkPageAccess(plan: PlanId, page: PageKey): boolean {
  return planHasPageAccess(plan, page);
}

/**
 * Check if current plan has a feature (client-side only, no server check)
 */
export function checkFeatureAccess(plan: PlanId, feature: FeatureKey): boolean {
  return planHasFeatureAccess(plan, feature);
}
