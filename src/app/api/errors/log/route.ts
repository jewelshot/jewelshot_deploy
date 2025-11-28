import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ============================================
// 🚦 ERROR LOG RATE LIMITING
// ============================================
// 50 error logs per minute per IP (prevents log spam)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const errorLogLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, '1 m'),
      analytics: true,
      prefix: 'ratelimit:errors',
    })
  : null;

function getClientIp(request: NextRequest): string {
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
 * Client-Side Error Logging Endpoint
 * 
 * Receives error reports from ErrorBoundary and other client-side error handlers
 */
export async function POST(request: NextRequest) {
  try {
    // ============================================
    // 🚦 RATE LIMITING CHECK (IP-based)
    // ============================================
    if (errorLogLimiter) {
      const ip = getClientIp(request);
      const { success, limit, remaining, reset } = await errorLogLimiter.limit(ip);

      if (!success) {
        // Silently drop excessive error logs (don't spam the logger)
        return NextResponse.json(
          {
            success: false,
            error: 'Rate limit exceeded',
            message: 'Too many error logs from your IP.',
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit?.toString() || '50',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': reset?.toString() || '0',
            },
          }
        );
      }
    }

    const body = await request.json();
    
    // Log to console (in production, this goes to Vercel logs)
    console.error('[Client Error]', {
      timestamp: body.timestamp,
      url: body.url,
      error: body.error,
      userAgent: body.userAgent,
    });

    // In the future, send to external monitoring service
    // await sendToMonitoringService(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silently fail - we don't want error logging to cause more errors
    console.error('[Error Logging Failed]', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

