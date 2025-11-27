'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function SentryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        environment: process.env.NODE_ENV,
        beforeSend(event) {
          if (window.location.hostname === 'localhost') {
            return null;
          }
          return event;
        },
      });

      // Expose for testing
      (window as any).Sentry = Sentry;
      console.log('[Sentry] Initialized:', !!Sentry);
    }
  }, []);

  return <>{children}</>;
}

