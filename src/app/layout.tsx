import type { Metadata, Viewport } from 'next';
import React from 'react';

// Initialize Sentry
import '@/lib/sentry-init';

import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ErrorBoundary } from '@/components/organisms/ErrorBoundary';
import ToastContainer from '@/components/organisms/ToastContainer';
import { GalleryPrefetch } from '@/components/organisms/GalleryPrefetch';
import GlobalSidebar from '@/components/organisms/GlobalSidebar';
import './globals.css';

// Note: Environment validation is available in src/lib/env.ts
// It will automatically run in production runtime (not during build)
// For manual validation during development, import and call validateEnvOrThrow()

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#9333ea',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://jewelshot.com'
  ),
  title: {
    default: 'Jewelshot Studio | AI-Powered Jewelry Photo Editor',
    template: '%s | Jewelshot Studio',
  },
  description:
    'Professional jewelry photo editing with AI. Create stunning product images with advanced filters, background removal, and AI-powered enhancements. Perfect for e-commerce, Etsy, and Amazon sellers.',
  keywords: [
    'jewelry photo editor',
    'AI image editing',
    'product photography',
    'e-commerce tools',
    'jewelry photography',
    'AI background removal',
    'nano banana',
    'fal.ai',
    'online photo editor',
    'jewelry image enhancement',
  ],
  authors: [{ name: 'Jewelshot Team', url: 'https://jewelshot.com' }],
  creator: 'Jewelshot',
  publisher: 'Jewelshot',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icon-512.png',
      },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jewelshot.com',
    title: 'Jewelshot Studio | AI-Powered Jewelry Photo Editor',
    description:
      'Transform your jewelry photos with AI. Professional editing, advanced filters, and instant background removal. Create stunning product images in seconds.',
    siteName: 'Jewelshot Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jewelshot Studio - AI Jewelry Photo Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jewelshot Studio | AI-Powered Jewelry Photo Editor',
    description:
      'Transform your jewelry photos with AI. Professional editing, advanced filters, and instant background removal.',
    images: ['/og-image.jpg'],
    creator: '@jewelshot',
    site: '@jewelshot',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://jewelshot.com',
  },
  category: 'technology',
  classification: 'Business',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
        data-theme="purple"
      >
        <ErrorBoundary>{children}</ErrorBoundary>
        <GlobalSidebar />
        <ToastContainer />
        <GalleryPrefetch />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
