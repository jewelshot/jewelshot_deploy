import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { globalRateLimit, getClientIp, checkRateLimit } from '@/lib/rate-limit';

// ============================================
// 🔒 MAINTENANCE MODE CONFIGURATION
// ============================================
const MAINTENANCE_MODE = false; // ✅ true = site kapalı, false = site açık
const MAINTENANCE_PASSWORD = 'jewelshot2024'; // 🔑 Geliştirici bypass şifresi

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // 🧪 SKIP MIDDLEWARE FOR TESTS
  // ============================================
  // Disable rate limiting and other checks in test/development
  const isTest = process.env.NODE_ENV === 'test' || process.env.SKIP_RATE_LIMIT === 'true';
  
  if (isTest) {
    // Pass through to the app without any checks
    return NextResponse.next();
  }

  // ============================================
  // 🚦 GLOBAL RATE LIMITING (First Priority)
  // ============================================
  // Skip rate limiting for static assets and health checks
  const skipRateLimit = 
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/health') ||
    pathname.includes('.');

  if (!skipRateLimit && globalRateLimit) {
    const ip = getClientIp(request);
    const { success, limit, remaining, reset } = await checkRateLimit(ip, globalRateLimit);

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit?.toString() || '0',
            'X-RateLimit-Remaining': remaining?.toString() || '0',
            'X-RateLimit-Reset': reset?.toString() || '0',
          },
        }
      );
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
      if (password === MAINTENANCE_PASSWORD) {
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

  // Protected routes
  const protectedPaths = ['/studio', '/gallery'];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 🔒 EMAIL VERIFICATION CHECK
  // If user is logged in but email not verified, redirect to verify page
  const isVerifyEmailPage = request.nextUrl.pathname === '/auth/verify-email';

  if (user && isProtectedPath && !isVerifyEmailPage) {
    // Check if email is confirmed
    // Supabase returns confirmed_at or email_confirmed_at depending on version
    const isEmailVerified =
      user.email_confirmed_at ||
      ('confirmed_at' in user &&
        (user as { confirmed_at?: string }).confirmed_at);

    if (!isEmailVerified) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/verify-email';
      url.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect to studio if accessing auth pages while logged in (except verify-email)
  if (
    request.nextUrl.pathname.startsWith('/auth') &&
    user &&
    !isVerifyEmailPage
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/studio';
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
