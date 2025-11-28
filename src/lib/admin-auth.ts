/**
 * ⚠️ DEPRECATED - DO NOT USE
 * 
 * @deprecated This file is deprecated. Use @/lib/admin/auth.ts instead.
 * 
 * Old header-based admin authentication (INSECURE).
 * Replaced by session-based authentication with RLS and 2FA.
 * 
 * Migration path:
 * - Import from '@/lib/admin' instead
 * - Use `withAdminAuth(handler, 'action-name')` wrapper for API routes
 * - Use `authenticateAdmin(request)` for manual auth checks
 * 
 * This file is kept for reference only and will be removed in a future version.
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
 * @deprecated Use @/lib/admin/auth.ts instead
 * Check if request is authorized as admin
 */
export async function isAdminAuthorized(request: NextRequest): Promise<{
  authorized: boolean;
  error?: string;
  statusCode?: number;
}> {
  try {
    // 1. Check IP whitelist (if configured)
    if (ALLOWED_IPS.length > 0) {
      const clientIP = getClientIP(request);
      if (!ALLOWED_IPS.includes(clientIP)) {
        return {
          authorized: false,
          error: 'IP not whitelisted',
          statusCode: 403,
        };
      }
    }

    // 2. Check rate limit
    const clientIP = getClientIP(request);
    const { success: rateLimitPassed } = await adminRateLimiter.limit(clientIP);
    
    if (!rateLimitPassed) {
      return {
        authorized: false,
        error: 'Rate limit exceeded',
        statusCode: 429,
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

    if (!authHeader) {
      return {
        authorized: false,
        error: 'Missing authorization header',
        statusCode: 401,
      };
    }

    // Support both "Bearer TOKEN" and direct token
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : authHeader;

    if (token !== adminKey) {
      return {
        authorized: false,
        error: 'Invalid admin key',
        statusCode: 401,
      };
    }

    return { authorized: true };
  } catch (error) {
    console.error('[Admin Auth] Error:', error);
    return {
      authorized: false,
      error: 'Authentication failed',
      statusCode: 500,
    };
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
