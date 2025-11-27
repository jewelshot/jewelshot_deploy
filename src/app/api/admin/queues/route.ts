/**
 * BullMQ Queue Dashboard
 * 
 * Provides real-time queue monitoring via Bull Board
 * Access: /api/admin/queues
 */

import { urgentQueue, normalQueue, backgroundQueue } from '@/lib/queue/queues';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Check admin authorization
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/queues', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/queues', true);

  // Check if queues are available
  if (!urgentQueue || !normalQueue || !backgroundQueue) {
    return NextResponse.json(
      { error: 'Queues not initialized. Make sure REDIS_URL is set.' },
      { status: 503 }
    );
  }

  // Get queue stats
  const stats = {
    urgent: await getQueueStats(urgentQueue),
    normal: await getQueueStats(normalQueue),
    background: await getQueueStats(backgroundQueue),
  };

  return NextResponse.json({
    queues: stats,
    timestamp: new Date().toISOString(),
  });
}

async function getQueueStats(queue: any) {
  const counts = await queue.getJobCounts();
  const workers = await queue.getWorkers();
  
  return {
    name: queue.name,
    counts,
    workers: workers.length,
  };
}

