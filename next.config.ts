import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */

  // TypeScript: Can be bypassed via SKIP_TYPE_CHECK=true in Vercel
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },

  // 🔒 Security: Disable source maps in production
  productionBrowserSourceMaps: false,

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable experimental optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@supabase/supabase-js',
      'zustand',
      'sonner',
      'react-dropzone',
    ],
  },

  // Output standalone for smaller Docker images (if deploying to containers)
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fal.media',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // 🔒 Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // ============================================
          // CORS Headers
          // ============================================
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_APP_URL || 'https://jewelshot.ai',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-2FA-Token, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 hours
          },

          // ============================================
          // Security Headers
          // ============================================
          
          // Prevent clickjacking (upgraded to DENY for max security)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // XSS Protection
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // HSTS (HTTPS Strict Transport Security)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Content Security Policy (Relaxed for FAL.AI, Supabase, and Analytics)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://va.vercel-scripts.com https://vercel.live https://plausible.io https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.google.com https://www.gstatic.com https://t.contentsquare.net", // Analytics + reCAPTCHA
              "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
              "img-src 'self' data: https: blob:", // Allow images from FAL.AI and Supabase
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.fal.media https://fal.ai wss://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.ingest.de.sentry.io https://*.sentry.io https://plausible.io https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://region1.google-analytics.com blob: data:", // Added Analytics domains
              "media-src 'self' https: blob:",
              "worker-src 'self' blob:", // Allow web workers for image compression
              "frame-src 'self' blob: https://vercel.live https://www.google.com", // Allow Vercel Live + reCAPTCHA
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ];
  },
};

// Export with Sentry (ULTRA MINIMAL - just error tracking)
export default withSentryConfig(bundleAnalyzer(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'jewelshot',

  project: 'jewelshot-production',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
