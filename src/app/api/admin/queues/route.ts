/**
 * BullMQ Queue Dashboard
 * 
 * Provides real-time queue monitoring via Bull Board
 * Access: /api/admin/queues
 */

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { urgentQueue, normalQueue, backgroundQueue } from '@/lib/queue/queues';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/api/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullMQAdapter(urgentQueue),
    new BullMQAdapter(normalQueue),
    new BullMQAdapter(backgroundQueue),
  ],
  serverAdapter: serverAdapter,
});

// Simple auth middleware (replace with proper auth)
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_DASHBOARD_KEY || 'your-secret-admin-key-change-this';
  
  return authHeader === `Bearer ${adminKey}`;
}

export async function GET(request: NextRequest) {
  // Check authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
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

