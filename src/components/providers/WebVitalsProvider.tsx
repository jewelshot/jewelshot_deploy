'use client';

import { useReportWebVitals } from 'next/web-vitals';

/**
 * Web Vitals Provider
 *
 * Reports Core Web Vitals to analytics for performance monitoring
 * Tracks: CLS, FID, FCP, LCP, TTFB, INP
 *
 * @see https://web.dev/vitals/
 */
export function WebVitalsProvider() {
  useReportWebVitals((metric) => {
    // Vitals tracked automatically by Vercel Analytics

    // Send to analytics
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    });

    // Send to your analytics endpoint (Vercel Analytics, Google Analytics, etc.)
    if (window.navigator.sendBeacon) {
      // Use sendBeacon if available (doesn't block page unload)
      window.navigator.sendBeacon('/api/vitals', body);
    } else {
      // Fallback to fetch
      fetch('/api/vitals', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
        keepalive: true,
      }).catch((error) => {
        // Fail silently - don't break the app if analytics fail
        console.error('Failed to send web vitals:', error);
      });
    }

    // Also send to Vercel Analytics if available
    if (
      typeof window !== 'undefined' &&
      (
        window as Window & {
          va?: (
            event: string,
            name: string,
            data: Record<string, unknown>
          ) => void;
        }
      ).va
    ) {
      const win = window as Window & {
        va: (
          event: string,
          name: string,
          data: Record<string, unknown>
        ) => void;
      };
      win.va('event', 'webVital', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      });
    }
  });

  return null; // This component doesn't render anything
}
