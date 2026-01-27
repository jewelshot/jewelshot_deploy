import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ============================================
// 🔒 MAINTENANCE MODE CONFIGURATION
// ============================================
const MAINTENANCE_MODE = false; // ✅ true = site kapalı, false = site açık
// 🔒 SECURITY: No fallback - MAINTENANCE_PASSWORD must be set in env
const MAINTENANCE_PASSWORD = process.env.MAINTENANCE_PASSWORD;

// ============================================
// 🚦 IP-BASED RATE LIMITING (GLOBAL PROTECTION)
// ============================================
// Edge runtime compatible - uses only IP, no cookies()
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const ipRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(500, '1 m'), // 500 requests per minute per IP (increased from 100)
      analytics: true,
      prefix: 'ratelimit:global:ip',
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // 🧪 SKIP MIDDLEWARE FOR TESTS
  // ============================================
  const isTest = process.env.NODE_ENV === 'test' || process.env.SKIP_RATE_LIMIT === 'true';
  
  if (isTest) {
    return NextResponse.next();
  }

  // ============================================
  // 🚦 GLOBAL IP-BASED RATE LIMITING
  // ============================================
  // Skip rate limiting for:
  // - Static assets (_next/static, images, etc.)
  // - Health check endpoint
  // - Auth callbacks (to prevent login issues)
  // - Credits balance (frequent polling)
  // - Page navigations (non-API routes)
  const skipRateLimit = 
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/health') ||
    pathname.startsWith('/api/credits/balance') ||
    pathname === '/auth/callback' ||
    pathname.startsWith('/auth/') ||
    pathname.includes('.') || // Static files
    !pathname.startsWith('/api'); // Skip rate limit for non-API routes (pages)

  if (!skipRateLimit && ipRateLimiter) {
    const ip = getClientIp(request);
    
    try {
      const { success, limit, remaining, reset } = await ipRateLimiter.limit(ip);

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: 'Rate limit exceeded',
            message: 'Too many requests from your IP. Please try again later.',
            limit,
            remaining: 0,
            reset,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': limit?.toString() || '100',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': reset?.toString() || '0',
              'Retry-After': '60',
            },
          }
        );
      }
    } catch (error) {
      // If rate limiting fails, log but don't block request
      console.error('Rate limiting error:', error);
    }
  }

  // ============================================
  // 🚧 MAINTENANCE MODE CHECK (First Priority)
  // ============================================
  if (MAINTENANCE_MODE) {
    // Allow access to maintenance page itself
    if (pathname === '/maintenance') {
      return NextResponse.next();
    }

    // Allow API routes for waitlist
    if (pathname.startsWith('/api/waitlist')) {
      return NextResponse.next();
    }

    // Bypass API endpoint
    if (pathname === '/api/maintenance-bypass') {
      const password = request.nextUrl.searchParams.get('password');
      // 🔒 SECURITY: Only allow bypass if password is configured AND matches
      if (MAINTENANCE_PASSWORD && password === MAINTENANCE_PASSWORD) {
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.set('maintenance_bypass', 'true', {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
        return response;
      }
      // Wrong password, redirect to maintenance
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }

    // Check for bypass cookie
    const bypassCookie = request.cookies.get('maintenance_bypass');
    if (!bypassCookie) {
      // Redirect all traffic to maintenance page
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  }

  // ============================================
  // 🔐 NORMAL AUTH FLOW (if not in maintenance)
  // ============================================
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshing the auth token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ============================================
  // 🔐 PROTECTED ROUTES - REQUIRE LOGIN
  // ============================================
  // ALL app pages require authentication (except public pages)
  const protectedPaths = [
    '/studio',      // Main app
    '/gallery',     // User gallery
    '/dashboard',   // Dashboard/Home
    '/batch',       // Batch processing
    '/library',     // User library
    '/profile',     // User profile
    '/editor',      // Image editor
    '/3d-view',     // 3D viewer
    '/motion-plus', // Video/Motion
    '/brand-lab',   // Brand Lab
    '/design-office', // Design Office
    '/catalogue',   // Catalogue
    '/admin',       // Admin pages (extra check in layout)
  ];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // ============================================
  // 🚫 BANNED USER CHECK
  // ============================================
  // Check if user is banned (Supabase sets banned_until when user is banned)
  if (user) {
    const bannedUntil = (user as unknown as { banned_until?: string }).banned_until;
    if (bannedUntil) {
      const banDate = new Date(bannedUntil);
      if (banDate > new Date()) {
        // User is still banned - redirect to banned page
        if (pathname !== '/banned') {
          const url = request.nextUrl.clone();
          url.pathname = '/banned';
          return NextResponse.redirect(url);
        }
        // Allow access to /banned page
        return supabaseResponse;
      }
    }
  }

  // 🔒 EMAIL VERIFICATION CHECK
  // If user is logged in but email not verified, redirect to verify page
  const isVerifyEmailPage = pathname === '/auth/verify-email';

  if (user && isProtectedPath && !isVerifyEmailPage) {
    // Check if email is confirmed
    // Supabase returns confirmed_at or email_confirmed_at depending on version
    const isEmailVerified =
      user.email_confirmed_at ||
      ('confirmed_at' in user &&
        (user as { confirmed_at?: string }).confirmed_at);

    // Auto-verify OAuth users (Google, GitHub, etc.)
    const isOAuthUser = user.app_metadata?.provider && user.app_metadata.provider !== 'email';

    if (!isEmailVerified && !isOAuthUser) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/verify-email';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect to dashboard if accessing auth pages while logged in (except verify-email)
  if (pathname.startsWith('/auth') && user && !isVerifyEmailPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
