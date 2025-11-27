import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getQueueStats } from '@/lib/queue/queues';

/**
 * Health Check Endpoint
 * 
 * Returns system health status for monitoring
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {} as Record<string, { status: string; latency?: number; error?: string }>,
  };

  // ============================================
  // 1. DATABASE CHECK
  // ============================================
  
  try {
    const start = Date.now();
    const supabase = await createClient();
    const { error } = await supabase.from('user_credits').select('user_id').limit(1);
    const latency = Date.now() - start;

    health.services.database = {
      status: error ? 'unhealthy' : 'healthy',
      latency,
      error: error?.message,
    };

    if (error) {
      health.status = 'degraded';
    }
  } catch (error: any) {
    health.services.database = {
      status: 'unhealthy',
      error: error.message,
    };
    health.status = 'degraded';
  }

  // ============================================
  // 2. QUEUE CHECK
  // ============================================
  
  try {
    const start = Date.now();
    const stats = await getQueueStats();
    const latency = Date.now() - start;

    const hasQueues = stats && (stats.urgent || stats.normal || stats.background);

    health.services.queue = {
      status: hasQueues ? 'healthy' : 'unhealthy',
      latency,
    };

    if (!hasQueues) {
      health.status = 'degraded';
    }
  } catch (error: any) {
    health.services.queue = {
      status: 'unhealthy',
      error: error.message,
    };
    health.status = 'degraded';
  }

  // ============================================
  // 3. RESPONSE
  // ============================================
  
  const statusCode = health.status === 'healthy' ? 200 : 503;

  return NextResponse.json(health, { status: statusCode });
}

