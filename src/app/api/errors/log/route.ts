import { NextRequest, NextResponse } from 'next/server';

/**
 * Client-Side Error Logging Endpoint
 * 
 * Receives error reports from ErrorBoundary and other client-side error handlers
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log to console (in production, this goes to Vercel logs)
    console.error('[Client Error]', {
      timestamp: body.timestamp,
      url: body.url,
      error: body.error,
      userAgent: body.userAgent,
    });

    // In the future, send to external monitoring service
    // await sendToMonitoringService(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silently fail - we don't want error logging to cause more errors
    console.error('[Error Logging Failed]', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

