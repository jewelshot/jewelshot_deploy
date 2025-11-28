import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://a0e9eb5609a4567d13d8f7dbb911c418@o4510311307149312.ingest.de.sentry.io/4510439628996688",

  // Only send errors (no performance, no replay)
  tracesSampleRate: 0,
  
  // Only enable in production
  enabled: process.env.NODE_ENV === 'production',
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
});

