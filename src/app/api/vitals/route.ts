import { NextRequest, NextResponse } from 'next/server';

/**
 * Web Vitals API Endpoint
 *
 * Receives Core Web Vitals metrics from the client
 * Logs them for monitoring and analysis
 *
 * In production, you can forward these to your analytics service:
 * - Sentry (performance monitoring)
 * - DataDog
 * - New Relic
 * - Custom analytics
 */

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();

    // Validate metric data
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // Vitals tracked automatically by Vercel Analytics

    // In production, forward to your monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry
      // You can uncomment this if you want to track Web Vitals in Sentry
      /*
      const Sentry = require('@sentry/nextjs');
      Sentry.captureMessage(`Web Vital: ${metric.name}`, {
        level: 'info',
        tags: {
          webVital: metric.name,
          rating: metric.rating,
        },
        extra: {
          value: metric.value,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        },
      });
      */
      // Example: Send to custom analytics
      // await analytics.track('web-vital', metric);
      // Example: Store in database for analysis
      // await db.webVitals.create({ data: metric });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Don't break the client if analytics fail
    return NextResponse.json(
      { error: 'Failed to process metric' },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
