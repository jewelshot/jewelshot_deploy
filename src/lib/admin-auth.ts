/**
 * Admin Authentication & Authorization
 * 
 * Centralized admin security checks
 */

import { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createServiceClient } from './supabase/service';

// Admin rate limiter: 30 requests per minute per IP
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const adminRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(30, '1m'),
  analytics: true,
  prefix: 'admin_ratelimit',
});

// IP Whitelist (optional - set in env)
const ALLOWED_IPS = process.env.ADMIN_ALLOWED_IPS?.split(',').map(ip => ip.trim()) || [];

/**
 * Check if request is authorized as admin
 */
export async function isAdminAuthorized(request: NextRequest): Promise<{
  authorized: boolean;
  error?: string;
  statusCode?: number;
}> {
  // 1. Check rate limit
  const ip = getClientIP(request);
  
  try {
    const { success, limit, remaining, reset } = await adminRateLimiter.limit(ip);
    
    if (!success) {
      return {
        authorized: false,
        error: 'Too many requests. Please try again later.',
        statusCode: 429,
      };
    }
  } catch (error) {
    console.error('Admin rate limit check failed:', error);
    // Don't block if rate limit check fails
  }

  // 2. Check IP whitelist (if configured)
  if (ALLOWED_IPS.length > 0 && !ALLOWED_IPS.includes(ip)) {
    console.warn(`Admin access denied from unauthorized IP: ${ip}`);
    return {
      authorized: false,
      error: 'Access denied from your IP address.',
      statusCode: 403,
    };
  }

  // 3. Check admin key
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_DASHBOARD_KEY;

  if (!adminKey) {
    console.error('ADMIN_DASHBOARD_KEY not configured');
    return {
      authorized: false,
      error: 'Server configuration error',
      statusCode: 500,
    };
  }

  if (!authHeader || authHeader !== `Bearer ${adminKey}`) {
    return {
      authorized: false,
      error: 'Invalid or missing authorization token',
      statusCode: 401,
    };
  }

  // All checks passed
  return { authorized: true };
}

/**
 * Get client IP address
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  );
}

/**
 * Log admin access attempt (to console for now, database logging in logAdminAction)
 */
export function logAdminAccess(
  request: NextRequest,
  endpoint: string,
  success: boolean,
  error?: string
) {
  const ip = getClientIP(request);
  const timestamp = new Date().toISOString();
  const userAgent = request.headers.get('user-agent') ?? 'unknown';

  console.log(
    JSON.stringify({
      type: 'admin_access',
      timestamp,
      endpoint,
      ip,
      userAgent,
      success,
      error,
    })
  );
}

/**
 * Log admin action to database (audit trail)
 */
export async function logAdminAction(params: {
  adminEmail: string;
  actionType: string;
  actionCategory: string;
  actionDetails?: Record<string, any>;
  targetType?: string;
  targetId?: string;
  targetEmail?: string;
  request?: NextRequest;
  apiEndpoint?: string;
  success?: boolean;
  errorMessage?: string;
}): Promise<void> {
  const {
    adminEmail,
    actionType,
    actionCategory,
    actionDetails = {},
    targetType,
    targetId,
    targetEmail,
    request,
    apiEndpoint,
    success = true,
    errorMessage,
  } = params;

  const supabase = createServiceClient();
  const adminIp = request ? getClientIP(request) : undefined;

  try {
    await supabase.rpc('log_admin_action', {
      p_admin_email: adminEmail,
      p_action_type: actionType,
      p_action_category: actionCategory,
      p_action_details: actionDetails,
      p_target_type: targetType,
      p_target_id: targetId,
      p_target_email: targetEmail,
      p_admin_ip: adminIp,
      p_api_endpoint: apiEndpoint,
      p_success: success,
      p_error_message: errorMessage,
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
    // Don't throw - logging failure shouldn't break the action
  }
}

/**
 * Get admin email from request (from custom header or default)
 */
export function getAdminEmail(request: NextRequest): string {
  return request.headers.get('x-admin-email') || 'admin@jewelshot.ai';
}

