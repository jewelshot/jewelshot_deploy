import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://136322cdc9532b260f074a5f6a7b4d7a@o4510311307149312.ingest.de.sentry.io/4510437651775568",
  
  tracesSampleRate: 1.0,
  
  debug: false,
  
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

