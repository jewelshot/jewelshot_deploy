/**
 * Rate Limiting Utility
 * Prevents API abuse by limiting requests per user/IP
 */

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RateLimitConfig {
  interval: number; // milliseconds
  uniqueTokenPerInterval: number; // max requests per interval
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // AI Generation endpoints (pahalı!)
  'ai-generate': {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 5, // max 5 generation/min
  },
  'ai-edit': {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 5,
  },

  // Credit endpoints
  'credits-check': {
    interval: 10 * 1000, // 10 seconds
    uniqueTokenPerInterval: 30, // max 30 check/10sec
  },
  'credits-use': {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 10,
  },

  // Auth endpoints
  auth: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 5, // max 5 login attempt/min
  },

  // Default
  default: {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 60,
  },
};

/**
 * Check rate limit for a request
 * @returns true if allowed, false if rate limited
 */
export async function checkRateLimit(
  request: NextRequest,
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  try {
    const supabase = await createClient();

    // Get user ID or IP
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Get rate limit config
    const config = RATE_LIMITS[endpoint] || RATE_LIMITS['default'];

    // Calculate window
    const now = new Date();
    const windowStart = new Date(
      Math.floor(now.getTime() / config.interval) * config.interval
    );

    // Check current count
    const { data: existing } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('endpoint', endpoint)
      .eq('window_start', windowStart.toISOString())
      .or(userId ? `user_id.eq.${userId}` : `ip_address.eq.${ipAddress}`)
      .single();

    const typedExisting = existing as { request_count: number } | null;
    const currentCount = typedExisting?.request_count || 0;

    if (currentCount >= config.uniqueTokenPerInterval) {
      // Rate limited!
      return {
        allowed: false,
        remaining: 0,
        reset: windowStart.getTime() + config.interval,
      };
    }

    // Increment count
    const rpcParams = {
      p_user_id: userId || null,
      p_ip_address: ipAddress,
      p_endpoint: endpoint,
      p_window_start: windowStart.toISOString(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await supabase.rpc('increment_rate_limit', rpcParams as any);

    return {
      allowed: true,
      remaining: config.uniqueTokenPerInterval - currentCount - 1,
      reset: windowStart.getTime() + config.interval,
    };
  } catch (error) {
    // On error, allow request (fail open)
    console.error('[RateLimit] Error:', error);
    return {
      allowed: true,
      remaining: -1,
      reset: Date.now() + 60000,
    };
  }
}

/**
 * Rate limit middleware wrapper
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<Response>,
  endpoint: string
) {
  return async (request: NextRequest): Promise<Response> => {
    const { allowed, remaining, reset } = await checkRateLimit(
      request,
      endpoint
    );

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          remaining: 0,
          reset: new Date(reset).toISOString(),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(
              RATE_LIMITS[endpoint]?.uniqueTokenPerInterval || 60
            ),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(reset),
            'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)),
          },
        }
      );
    }

    // Add rate limit headers to response
    const response = await handler(request);
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(reset));

    return response;
  };
}
