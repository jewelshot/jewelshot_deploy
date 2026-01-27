/**
 * Health Check Endpoint
 * 
 * Simple health check for uptime monitoring (UptimeRobot, etc.)
 * 🔒 SECURITY: Does NOT expose sensitive system information
 */

import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isQueueAvailable, isRedisConnected } from '@/lib/queue/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  
  // Check Database (Supabase) - don't expose error details
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('user_credits')
      .select('user_id')
      .limit(1);
    
    if (error) {
      status = 'unhealthy';
    }
  } catch {
    status = 'unhealthy';
  }

  // Check Redis Connection
  const redisConnected = isRedisConnected();
  if (!redisConnected) {
    // Redis not configured is acceptable (fallback mode)
    // Only degrade if it was expected but failed
  }

  // Check Queue (async processing)
  const asyncMode = isQueueAvailable();

  // Check critical Environment Variables (without exposing names)
  const hasRequiredEnv = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (!hasRequiredEnv) {
    status = 'degraded';
  }

  // 🔒 SECURITY: Only return minimal, non-sensitive information
  const response = {
    status,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: true,
      database: status !== 'unhealthy',
      cache: redisConnected,
      queue: asyncMode,
    },
  };

  // Determine HTTP status code
  const statusCode = status === 'healthy' ? 200 : 
                     status === 'degraded' ? 200 : 503;

  return NextResponse.json(response, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
