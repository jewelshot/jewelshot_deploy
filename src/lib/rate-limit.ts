import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// ============================================
// Types
// ============================================

export type RateLimitType = 'anonymous' | 'user' | 'premium' | 'admin';

export interface RateLimitConfig {
  requests: number;
  window: string;
}

// ============================================
// Redis Client
// ============================================

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// ============================================
// Rate Limit Configurations (by user type)
// ============================================

const rateLimitConfigs: Record<RateLimitType, RateLimitConfig> = {
  anonymous: {
    requests: 100,   // Anonymous users (increased from 20)
    window: '1 m',
  },
  user: {
    requests: 300,   // Standard authenticated users (increased from 100)
    window: '1 m',
  },
  premium: {
    requests: 1000,  // Premium users get more quota (increased from 500)
    window: '1 m',
  },
  admin: {
    requests: 2000,  // Admins get highest quota (increased from 1000)
    window: '1 m',
  },
};

// ============================================
// Rate Limiters (cached instances)
// ============================================

const rateLimiters: Record<RateLimitType, Ratelimit | null> = {
  anonymous: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          rateLimitConfigs.anonymous.requests,
          rateLimitConfigs.anonymous.window as any
        ),
        analytics: true,
        prefix: 'ratelimit:anonymous',
      })
    : null,
  
  user: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          rateLimitConfigs.user.requests,
          rateLimitConfigs.user.window as any
        ),
        analytics: true,
        prefix: 'ratelimit:user',
      })
    : null,
  
  premium: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          rateLimitConfigs.premium.requests,
          rateLimitConfigs.premium.window as any
        ),
        analytics: true,
        prefix: 'ratelimit:premium',
      })
    : null,
  
  admin: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          rateLimitConfigs.admin.requests,
          rateLimitConfigs.admin.window as any
        ),
        analytics: true,
        prefix: 'ratelimit:admin',
      })
    : null,
};

// ============================================
// Legacy Rate Limiters (for backward compatibility)
// ============================================

// Global rate limiter - applies to all requests (IP-based)
export const globalRateLimit = rateLimiters.user;

// User rate limiter - same as standard user
export const userRateLimit = rateLimiters.user;

// AI operation rate limiter - applies to AI API calls
// 10 AI requests per minute per user
export const aiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'ratelimit:ai',
    })
  : null;

// ============================================
// Helper Functions
// ============================================

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Determine user's rate limit type based on authentication and role
 */
async function getUserRateLimitType(request: Request): Promise<RateLimitType> {
  try {
    // Try to get authenticated user
    const cookieStore = await cookies();
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

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      // No session = anonymous user
      return 'anonymous';
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, subscription_tier')
      .eq('id', session.user.id)
      .single();

    if (!profile) {
      return 'user'; // Default to user if profile not found
    }

    // Check role (admin/superadmin get highest limits)
    if (profile.role === 'admin' || profile.role === 'superadmin') {
      return 'admin';
    }

    // Check subscription tier
    if (profile.subscription_tier === 'premium') {
      return 'premium';
    }

    // Default authenticated user
    return 'user';
  } catch (error) {
    // On error, fallback to anonymous (most restrictive)
    console.error('Failed to determine user type for rate limiting:', error);
    return 'anonymous';
  }
}

/**
 * Get rate limit identifier (user-based or IP-based)
 * Returns both identifier and appropriate limiter
 */
export async function getRateLimitIdentifier(
  request: Request
): Promise<{
  identifier: string;
  type: RateLimitType;
  limiter: Ratelimit | null;
  config: RateLimitConfig;
}> {
  const userType = await getUserRateLimitType(request);
  const ip = getClientIp(request);

  // Try to get user ID for authenticated users
  let identifier: string;
  
  if (userType === 'anonymous') {
    // Anonymous: use IP-based rate limiting
    identifier = `ip:${ip}`;
  } else {
    // Authenticated: use user-based rate limiting
    try {
      const cookieStore = await cookies();
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

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        identifier = `user:${session.user.id}`;
      } else {
        // Fallback to IP if session retrieval fails
        identifier = `ip:${ip}`;
      }
    } catch {
      // Fallback to IP on error
      identifier = `ip:${ip}`;
    }
  }

  return {
    identifier,
    type: userType,
    limiter: rateLimiters[userType],
    config: rateLimitConfigs[userType],
  };
}

/**
 * Check rate limit with automatic user type detection
 * 
 * @param request - The incoming request
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | null
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!limiter) {
    // If Redis is not configured, allow all requests (dev mode)
    return { success: true };
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    // If Redis fails (e.g., rate limit exceeded), allow request to proceed
    // This prevents Redis issues from blocking all requests
    console.warn('[RateLimit] Redis error, allowing request:', error instanceof Error ? error.message : 'Unknown error');
    return { success: true };
  }
}

/**
 * Enhanced rate limit check with automatic user detection
 * 
 * @param request - The incoming request
 * @returns Rate limit result with user type info
 */
export async function checkRateLimitEnhanced(
  request: Request
): Promise<{
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
  type?: RateLimitType;
  identifier?: string;
}> {
  const { identifier, type, limiter } = await getRateLimitIdentifier(request);

  if (!limiter) {
    return { success: true, type, identifier };
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    return {
      success,
      limit,
      remaining,
      reset,
      type,
      identifier,
    };
  } catch (error) {
    // If Redis fails, allow request to proceed
    console.warn('[RateLimit] Redis error in enhanced check:', error instanceof Error ? error.message : 'Unknown error');
    return { success: true, type, identifier };
  }
}

/**
 * Simple IP-based rate limit check for specific endpoints
 * 🔒 SECURITY: Prevents spam on public endpoints
 * 
 * @param ip - Client IP address
 * @param prefix - Unique prefix for this endpoint
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function checkRateLimitByIP(
  ip: string,
  prefix: string,
  config: { requests: number; window: string }
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!redis) {
    // If Redis is not configured, allow all requests (dev mode)
    return { success: true };
  }

  try {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, config.window as Parameters<typeof Ratelimit.slidingWindow>[1]),
      analytics: false,
      prefix: `ratelimit:${prefix}`,
    });

    const { success, limit, remaining, reset } = await limiter.limit(`ip:${ip}`);

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    // If Redis fails, allow request to proceed
    console.warn(`[RateLimit:${prefix}] Redis error:`, error instanceof Error ? error.message : 'Unknown error');
    return { success: true };
  }
}
