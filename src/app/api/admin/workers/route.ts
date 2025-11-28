/**
 * Worker Metrics & Status
 * 
 * Real-time worker status and performance metrics
 * Access: /api/admin/workers
 * 
 * 🔒 SECURITY: Session-based admin auth with auto audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { urgentQueue, normalQueue, backgroundQueue } from '@/lib/queue/queues';
import { withAdminAuth } from '@/lib/admin';

export const GET = withAdminAuth(
  { action: 'WORKERS_VIEW' },
  async (request: NextRequest, auth) => {
    // Check if queues are available
    if (!urgentQueue || !normalQueue || !backgroundQueue) {
      return NextResponse.json(
        { error: 'Queues not initialized. Make sure REDIS_URL is set.' },
        { status: 503 }
      );
    }

    try {
      // Check if worker is accessible
      const workerHealthUrl = process.env.WORKER_HEALTH_URL || 'http://localhost:3001';
      
      let workerHealth = null;
      try {
        const healthResponse = await fetch(`${workerHealthUrl}/health`, {
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        workerHealth = await healthResponse.json();
      } catch (error) {
        workerHealth = { status: 'unreachable', error: 'Worker health check failed' };
      }

      // Get queue statistics
      const [urgentStats, normalStats, backgroundStats] = await Promise.all([
        getQueueMetrics(urgentQueue),
        getQueueMetrics(normalQueue),
        getQueueMetrics(backgroundQueue),
      ]);

      // Get workers per queue
      const [urgentWorkers, normalWorkers, backgroundWorkers] = await Promise.all([
        urgentQueue.getWorkers(),
        normalQueue.getWorkers(),
        backgroundQueue.getWorkers(),
      ]);

      return NextResponse.json({
        worker: workerHealth,
        queues: {
          urgent: {
            ...urgentStats,
            workers: urgentWorkers.length,
          },
          normal: {
            ...normalStats,
            workers: normalWorkers.length,
          },
          background: {
            ...backgroundStats,
            workers: backgroundWorkers.length,
          },
        },
        totalWorkers: urgentWorkers.length + normalWorkers.length + backgroundWorkers.length,
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error('Workers API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch worker metrics', details: error.message },
        { status: 500 }
      );
    }
  }
);

async function getQueueMetrics(queue: any) {
  const counts = await queue.getJobCounts();
  const completed = await queue.getCompleted(0, 0);
  const failed = await queue.getFailed(0, 0);
  
  return {
    name: queue.name,
    waiting: counts.waiting || 0,
    active: counts.active || 0,
    completed: completed.length,
    failed: failed.length,
    delayed: counts.delayed || 0,
    paused: counts.paused || 0,
  };
}
