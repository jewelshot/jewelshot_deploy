/**
 * Plausible Analytics
 * 
 * Privacy-focused analytics tracking
 * GDPR compliant, no cookies, lightweight
 */

'use client';

import Script from 'next/script';

export function PlausibleAnalytics() {
  const domain = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '') || 'jewelshot.ai';
  
  if (process.env.NODE_ENV !== 'production') {
    return null; // Don't track in development
  }

  return (
    <>
      <Script
        defer
        data-domain={domain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    </>
  );
}

/**
 * Track Custom Events
 * 
 * Usage:
 * trackEvent('signup')
 * trackEvent('purchase', { props: { plan: 'pro', amount: 29 } })
 */
export function trackEvent(eventName: string, options?: { props?: Record<string, string | number> }) {
  if (typeof window === 'undefined' || !window.plausible) return;
  
  window.plausible(eventName, options);
}

// Type declaration for plausible
declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

