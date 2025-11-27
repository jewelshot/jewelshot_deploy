import * as Sentry from '@sentry/nextjs';

// Initialize Sentry
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
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

  // Expose to window for testing
  (window as any).Sentry = Sentry;
}

