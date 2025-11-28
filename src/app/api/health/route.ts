/**
 * Health Check Endpoint
 * 
 * Monitors system health for uptime monitoring (UptimeRobot)
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/redis';
import { createServiceClient } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const checks = {
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    timestamp: Date.now(),
    version: '1.0.0',
    services: {
      redis: false,
      supabase: false,
      worker: false,
    },
    details: {
      redis: '',
      supabase: '',
      worker: '',
    },
  };

  // Check Redis
  try {
    const redis = createClient();
    await redis.ping();
    checks.services.redis = true;
    checks.details.redis = 'Connected';
  } catch (error: any) {
    checks.status = 'degraded';
    checks.details.redis = error.message || 'Connection failed';
  }

  // Check Supabase
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('user_credits')
      .select('id')
      .limit(1);
    
    checks.services.supabase = !error;
    checks.details.supabase = error ? error.message : 'Connected';
    
    if (error) {
      checks.status = 'degraded';
    }
  } catch (error: any) {
    checks.status = 'degraded';
    checks.services.supabase = false;
    checks.details.supabase = error.message || 'Connection failed';
  }

  // Check Worker health (via last heartbeat)
  try {
    const redis = createClient();
    const queueLength = await redis.llen('ai-queue');
    const lastHeartbeat = await redis.get('worker:heartbeat');
    
    const workerAlive = lastHeartbeat && 
      (Date.now() - parseInt(lastHeartbeat)) < 120000; // 2 minutes
    
    checks.services.worker = workerAlive;
    checks.details.worker = workerAlive 
      ? `Active - Queue: ${queueLength}` 
      : `No heartbeat - Queue: ${queueLength}`;
    
    // Worker down is degraded, not critical
    if (!workerAlive) {
      checks.status = 'degraded';
    }
  } catch (error: any) {
    // Worker check is optional
    checks.details.worker = error.message || 'Check failed';
  }

  // Determine overall status
  if (!checks.services.redis || !checks.services.supabase) {
    checks.status = 'unhealthy';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 
                     checks.status === 'degraded' ? 200 : 503;

  return NextResponse.json(checks, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
