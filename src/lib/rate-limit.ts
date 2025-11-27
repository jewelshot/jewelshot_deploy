import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Redis client for rate limiting
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Global rate limiter - applies to all requests
// 100 requests per 10 seconds per IP
export const globalRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '10 s'),
      analytics: true,
      prefix: 'ratelimit:global',
    })
  : null;

// User rate limiter - applies to authenticated users
// 50 requests per minute per user
export const userRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, '1 m'),
      analytics: true,
      prefix: 'ratelimit:user',
    })
  : null;

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

// Helper function to get client IP
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

// Helper to check rate limit and return appropriate response
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | null
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (!limiter) {
    // If Redis is not configured, allow all requests (dev mode)
    return { success: true };
  }

  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
  };
}
