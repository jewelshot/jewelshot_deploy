/**
 * BullMQ Queue Dashboard
 * 
 * Provides real-time queue monitoring via Bull Board
 * Access: /api/admin/queues
 * 
 * 🔒 SECURITY: Session-based admin auth with auto audit logging
 */

import { urgentQueue, normalQueue, backgroundQueue } from '@/lib/queue/queues';
import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin';

export const GET = withAdminAuth(
  { action: 'QUEUES_VIEW' },
  async (request: NextRequest, auth) => {
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
);

async function getQueueStats(queue: any) {
  const counts = await queue.getJobCounts();
  const workers = await queue.getWorkers();
  
  return {
    name: queue.name,
    counts,
    workers: workers.length,
  };
}
