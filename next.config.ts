import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  /* config options here */

  // TypeScript: Can be bypassed via SKIP_TYPE_CHECK=true in Vercel
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

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
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
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
          // Content Security Policy (Relaxed for FAL.AI and Supabase)
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://va.vercel-scripts.com", // Next.js + browser-image-compression CDN + Vercel Analytics
              "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
              "img-src 'self' data: https: blob:", // Allow images from FAL.AI and Supabase
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://*.fal.media https://fal.ai wss://*.supabase.co https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.ingest.de.sentry.io https://*.sentry.io blob: data:", // Added Sentry domains and data: for WASM
              "media-src 'self' https: blob:",
              "worker-src 'self' blob:", // Allow web workers for image compression
              "frame-src 'self' blob:", // Allow PDF preview iframes with blob URLs
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

export default withSentryConfig(nextConfig, {
  org: "jewelshot",
  project: "jewelshot",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
