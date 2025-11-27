/**
 * Sentry Client Configuration
 * 
 * MINIMAL SETUP - Client-side error tracking only
 * NO source maps, NO performance, NO extras
 */

import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || 
  'https://a0e9eb5609a4567d13d8f7dbb911c418@o4510311307149312.ingest.de.sentry.io/4510439628996688';

// Only initialize if DSN is set
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
    // Environment
    environment: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    
    // MINIMAL - Only errors, no performance
    tracesSampleRate: 0, // Disable performance monitoring
    
    // Only send errors in production
    enabled: process.env.NODE_ENV === 'production',
    
    // Don't send in development
    debug: false,
    
    // Ignore common errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Network errors
      'NetworkError',
      'Failed to fetch',
      // Resizable Observer (not real errors)
      'ResizeObserver loop',
    ],
    
    // Ignore certain URLs
    denyUrls: [
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
    ],
    
    // Basic integrations only
    integrations: [
      // Keep it minimal
    ],
    
    // Don't send personal data
    beforeSend(event, hint) {
      // Remove sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }
      
      // Only send in production
      if (process.env.NODE_ENV !== 'production') {
        return null;
      }
      
      return event;
    },
  });
  
  console.log('[Sentry] Client initialized');
} else {
  console.warn('[Sentry] DSN not set, error tracking disabled');
}

