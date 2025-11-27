'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function SentryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Sentry.init({
      dsn: "https://136322cdc9532b260f074a5f6a7b4d7a@o4510311307149312.ingest.de.sentry.io/4510437651775568",
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
    });

    // Expose for testing
    (window as any).Sentry = Sentry;
    console.log('[Sentry] Initialized successfully!');
  }, []);

  return <>{children}</>;
}

