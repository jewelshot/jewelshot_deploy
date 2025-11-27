/**
 * Worker Metrics & Status
 * 
 * Real-time worker status and performance metrics
 * Access: /api/admin/workers
 */

import { NextRequest, NextResponse } from 'next/server';
import { connection } from '@/lib/queue/config';
import { urgentQueue, normalQueue, backgroundQueue } from '@/lib/queue/queues';

// Simple auth middleware
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const adminKey = process.env.ADMIN_DASHBOARD_KEY || 'your-secret-admin-key-change-this';
  
  return authHeader === `Bearer ${adminKey}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
      getDetailedQueueStats(urgentQueue),
      getDetailedQueueStats(normalQueue),
      getDetailedQueueStats(backgroundQueue),
    ]);

    // Redis connection status
    let redisStatus = 'disconnected';
    try {
      if (connection) {
        await connection.ping();
        redisStatus = 'connected';
      }
    } catch (error) {
      redisStatus = 'error';
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      worker: workerHealth,
      redis: {
        status: redisStatus,
        url: process.env.REDIS_URL ? 'configured' : 'not configured',
      },
      queues: {
        urgent: urgentStats,
        normal: normalStats,
        background: backgroundStats,
      },
      summary: {
        totalWaiting: 
          (urgentStats?.waiting || 0) + 
          (normalStats?.waiting || 0) + 
          (backgroundStats?.waiting || 0),
        totalActive: 
          (urgentStats?.active || 0) + 
          (normalStats?.active || 0) + 
          (backgroundStats?.active || 0),
        totalCompleted: 
          (urgentStats?.completed || 0) + 
          (normalStats?.completed || 0) + 
          (backgroundStats?.completed || 0),
        totalFailed: 
          (urgentStats?.failed || 0) + 
          (normalStats?.failed || 0) + 
          (backgroundStats?.failed || 0),
      },
    });
  } catch (error: any) {
    console.error('Worker metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch worker metrics', details: error.message },
      { status: 500 }
    );
  }
}

async function getDetailedQueueStats(queue: any) {
  try {
    const counts = await queue.getJobCounts();
    const workers = await queue.getWorkers();
    const waitingJobs = await queue.getWaiting(0, 10); // First 10 waiting jobs
    const activeJobs = await queue.getActive(0, 10); // First 10 active jobs
    const failedJobs = await queue.getFailed(0, 10); // First 10 failed jobs

    return {
      name: queue.name,
      waiting: counts.waiting,
      active: counts.active,
      completed: counts.completed,
      failed: counts.failed,
      delayed: counts.delayed,
      paused: counts.paused,
      workers: workers.length,
      waitingJobs: waitingJobs.map((j: any) => ({
        id: j.id,
        operation: j.data?.operation,
        addedAt: j.timestamp,
      })),
      activeJobs: activeJobs.map((j: any) => ({
        id: j.id,
        operation: j.data?.operation,
        progress: j.progress,
        processedOn: j.processedOn,
      })),
      recentFailures: failedJobs.map((j: any) => ({
        id: j.id,
        operation: j.data?.operation,
        failedReason: j.failedReason,
        failedAt: j.finishedOn,
      })),
    };
  } catch (error) {
    console.error(`Error getting stats for queue ${queue?.name}:`, error);
    return null;
  }
}

