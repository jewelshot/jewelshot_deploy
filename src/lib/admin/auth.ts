/**
 * Admin Authentication & Authorization Library
 * 
 * Provides secure authentication and authorization for admin routes
 * Implements session-based auth, role checking, and audit logging
 */

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createServiceClient } from '@/lib/supabase/service';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('AdminAuth');

// ============================================
// Types
// ============================================

export type AdminRole = 'user' | 'admin' | 'superadmin';

export interface AdminAuthResult {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  userId?: string;
  userEmail?: string;
  role?: AdminRole;
  error?: string;
}

export interface AuditLogData {
  action: string;
  targetType?: string;
  targetId?: string;
  requestBody?: any;
  responseStatus?: number;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

// ============================================
// Configuration
// ============================================

const SENSITIVE_ACTIONS = [
  'USER_DELETE',
  'USER_BAN',
  'CREDIT_MODIFY',
  'ROLE_CHANGE',
  'SYSTEM_CONFIG',
];

const SUPERADMIN_ONLY_ACTIONS = [
  'ADMIN_CREATE',
  'ADMIN_DELETE',
  'SYSTEM_CONFIG',
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real;
  }
  
  return 'unknown';
}

/**
 * Get user agent from request
 */
function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}

// ============================================
// Core Authentication
// ============================================

/**
 * Authenticate admin user
 * 
 * Checks:
 * 1. Valid session
 * 2. Admin or superadmin role
 * 3. Optional 2FA verification
 * 
 * @param request - Next.js request object
 * @param require2FA - Whether to require 2FA verification
 * @returns AdminAuthResult
 */
export async function authenticateAdmin(
  request: NextRequest,
  require2FA: boolean = false
): Promise<AdminAuthResult> {
  try {
    // 1. Create Supabase client with cookies
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 2. Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      logger.warn('No valid session found', { sessionError });
      return {
        isAuthenticated: false,
        isAdmin: false,
        isSuperAdmin: false,
        error: 'No active session',
      };
    }

    // 3. Get user with role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, is_2fa_enabled, two_factor_secret')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      logger.error('Failed to fetch user profile', { profileError });
      return {
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
        error: 'User profile not found',
      };
    }

    // 4. Check role
    const isAdmin = profile.role === 'admin' || profile.role === 'superadmin';
    const isSuperAdmin = profile.role === 'superadmin';

    if (!isAdmin) {
      logger.warn('User is not admin', { userId: profile.id, role: profile.role });
      return {
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
        userId: profile.id,
        userEmail: profile.email,
        role: profile.role as AdminRole,
        error: 'Insufficient permissions',
      };
    }

    // 5. Check 2FA if required
    if (require2FA && profile.is_2fa_enabled) {
      const twoFactorToken = request.headers.get('x-2fa-token');
      
      if (!twoFactorToken) {
        return {
          isAuthenticated: true,
          isAdmin: true,
          isSuperAdmin,
          userId: profile.id,
          userEmail: profile.email,
          role: profile.role as AdminRole,
          error: '2FA verification required',
        };
      }

      // Verify 2FA token
      const is2FAValid = await verify2FAToken(profile.id, twoFactorToken);
      
      if (!is2FAValid) {
        logger.warn('2FA verification failed', { userId: profile.id });
        return {
          isAuthenticated: true,
          isAdmin: true,
          isSuperAdmin,
          userId: profile.id,
          userEmail: profile.email,
          role: profile.role as AdminRole,
          error: 'Invalid 2FA token',
        };
      }
    }

    // 6. Success
    return {
      isAuthenticated: true,
      isAdmin: true,
      isSuperAdmin,
      userId: profile.id,
      userEmail: profile.email,
      role: profile.role as AdminRole,
    };
  } catch (error) {
    logger.error('Admin authentication failed', error);
    return {
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Check if action requires 2FA
 */
export function requiresTwoFactor(action: string): boolean {
  return SENSITIVE_ACTIONS.includes(action);
}

/**
 * Check if action requires superadmin
 */
export function requiresSuperAdmin(action: string): boolean {
  return SUPERADMIN_ONLY_ACTIONS.includes(action);
}

/**
 * Verify 2FA token
 * 
 * @param userId - User ID
 * @param token - 2FA token from request
 * @returns boolean - Is token valid?
 */
async function verify2FAToken(userId: string, token: string): Promise<boolean> {
  try {
    // TODO: Implement actual 2FA verification
    // For now, we'll use a simple placeholder
    // In production, use libraries like:
    // - speakeasy (TOTP)
    // - otpauth
    
    // Placeholder: Accept any 6-digit token for development
    if (process.env.NODE_ENV === 'development') {
      return /^\d{6}$/.test(token);
    }
    
    // Production: Implement real TOTP verification
    const supabase = createServiceClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('two_factor_secret')
      .eq('id', userId)
      .single();
    
    if (!profile?.two_factor_secret) {
      return false;
    }
    
    // TODO: Verify TOTP token against user's secret
    // const speakeasy = require('speakeasy');
    // return speakeasy.totp.verify({
    //   secret: profile.two_factor_secret,
    //   encoding: 'base32',
    //   token: token,
    //   window: 2,
    // });
    
    return false;
  } catch (error) {
    logger.error('2FA verification error', error);
    return false;
  }
}

// ============================================
// Audit Logging
// ============================================

/**
 * Log admin action to audit trail
 * 
 * @param request - Next.js request
 * @param adminId - Admin user ID
 * @param data - Audit log data
 */
export async function logAdminAction(
  request: NextRequest,
  adminId: string,
  data: AuditLogData
): Promise<void> {
  try {
    const supabase = createServiceClient();
    
    const { error } = await supabase.from('admin_audit_logs').insert({
      admin_id: adminId,
      action: data.action,
      target_type: data.targetType,
      target_id: data.targetId,
      ip_address: getClientIp(request),
      user_agent: getUserAgent(request),
      request_method: request.method,
      request_path: request.nextUrl.pathname,
      request_body: data.requestBody,
      response_status: data.responseStatus,
      success: data.success,
      error_message: data.errorMessage,
      metadata: data.metadata,
    });

    if (error) {
      logger.error('Failed to log admin action', { error, data });
    } else {
      logger.info('Admin action logged', {
        adminId,
        action: data.action,
        success: data.success,
      });
    }
  } catch (error) {
    logger.error('Audit logging failed', error);
    // Don't throw - logging failure shouldn't break the request
  }
}

// ============================================
// Authorization Middleware
// ============================================

/**
 * Authorize admin action
 * 
 * Combines authentication and authorization checks
 * 
 * @param request - Next.js request
 * @param action - Action being performed
 * @returns AdminAuthResult or NextResponse (error)
 */
export async function authorizeAdminAction(
  request: NextRequest,
  action: string
): Promise<AdminAuthResult> {
  // 1. Authenticate
  const require2FA = requiresTwoFactor(action);
  const auth = await authenticateAdmin(request, require2FA);

  // 2. Check if authenticated
  if (!auth.isAuthenticated) {
    await logAdminAction(request, '', {
      action,
      success: false,
      errorMessage: 'Not authenticated',
      responseStatus: 401,
    });
    
    auth.error = 'Unauthorized: Please log in';
    return auth;
  }

  // 3. Check if admin
  if (!auth.isAdmin) {
    await logAdminAction(request, auth.userId!, {
      action,
      success: false,
      errorMessage: 'Insufficient permissions',
      responseStatus: 403,
    });
    
    auth.error = 'Forbidden: Admin access required';
    return auth;
  }

  // 4. Check superadmin requirement
  if (requiresSuperAdmin(action) && !auth.isSuperAdmin) {
    await logAdminAction(request, auth.userId!, {
      action,
      success: false,
      errorMessage: 'Superadmin required',
      responseStatus: 403,
    });
    
    auth.error = 'Forbidden: Superadmin access required';
    return auth;
  }

  // 5. Check 2FA if error present
  if (auth.error?.includes('2FA')) {
    await logAdminAction(request, auth.userId!, {
      action,
      success: false,
      errorMessage: auth.error,
      responseStatus: 403,
    });
    
    return auth;
  }

  // 6. Success
  return auth;
}

// ============================================
// Utility Exports
// ============================================

export { getClientIp, getUserAgent };

