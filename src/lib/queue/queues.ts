/**
 * Queue Instances
 * 
 * BullMQ queue instances for different priority levels
 */

import { Queue } from 'bullmq';
import { connection, queueConfigs } from './config';
import { QUEUE_NAMES, AIJobData, AIJobResult } from './types';

// ============================================
// QUEUE INSTANCES
// ============================================

/**
 * Urgent Queue
 * For Studio, Quick Actions, and real-time operations
 * Priority: 1 (highest)
 * Timeout: 1 minute
 */
export const urgentQueue = connection ? new Queue<AIJobData, AIJobResult>(
  QUEUE_NAMES.URGENT,
  {
    connection,
    defaultJobOptions: queueConfigs[QUEUE_NAMES.URGENT].defaultJobOptions,
  }
) : null;

/**
 * Normal Queue
 * For Batch operations and non-urgent requests
 * Priority: 5 (medium)
 * Timeout: 3 minutes
 */
export const normalQueue = connection ? new Queue<AIJobData, AIJobResult>(
  QUEUE_NAMES.NORMAL,
  {
    connection,
    defaultJobOptions: queueConfigs[QUEUE_NAMES.NORMAL].defaultJobOptions,
  }
) : null;

/**
 * Background Queue
 * For analytics, maintenance, and low-priority tasks
 * Priority: 10 (lowest)
 * Timeout: 10 minutes
 */
export const backgroundQueue = connection ? new Queue<AIJobData, AIJobResult>(
  QUEUE_NAMES.BACKGROUND,
  {
    connection,
    defaultJobOptions: queueConfigs[QUEUE_NAMES.BACKGROUND].defaultJobOptions,
  }
) : null;

// ============================================
// QUEUE HELPERS
// ============================================

/**
 * Get queue by priority
 */
export function getQueueByPriority(priority: 'urgent' | 'normal' | 'background'): Queue<AIJobData, AIJobResult> | null {
  if (!connection) {
    console.error('[Queue] Redis not configured');
    return null;
  }
  
  switch (priority) {
    case 'urgent':
      return urgentQueue;
    case 'normal':
      return normalQueue;
    case 'background':
      return backgroundQueue;
    default:
      return normalQueue; // Default fallback
  }
}

/**
 * Get all queues
 */
export function getAllQueues(): Queue<AIJobData, AIJobResult>[] {
  return [urgentQueue, normalQueue, backgroundQueue].filter((q): q is Queue<AIJobData, AIJobResult> => q !== null);
}

// ============================================
// QUEUE MONITORING
// ============================================

/**
 * Get queue stats for monitoring
 */
export async function getQueueStats() {
  if (!urgentQueue || !normalQueue || !backgroundQueue) {
    return {
      urgent: { waiting: 0, active: 0, completed: 0, failed: 0 },
      normal: { waiting: 0, active: 0, completed: 0, failed: 0 },
      background: { waiting: 0, active: 0, completed: 0, failed: 0 },
      total: { waiting: 0, active: 0, completed: 0, failed: 0 },
    };
  }

  const [urgentCounts, normalCounts, backgroundCounts] = await Promise.all([
    urgentQueue.getJobCounts(),
    normalQueue.getJobCounts(),
    backgroundQueue.getJobCounts(),
  ]);

  return {
    urgent: urgentCounts,
    normal: normalCounts,
    background: backgroundCounts,
    total: {
      waiting: urgentCounts.waiting + normalCounts.waiting + backgroundCounts.waiting,
      active: urgentCounts.active + normalCounts.active + backgroundCounts.active,
      completed: urgentCounts.completed + normalCounts.completed + backgroundCounts.completed,
      failed: urgentCounts.failed + normalCounts.failed + backgroundCounts.failed,
    },
  };
}

/**
 * Pause all queues (emergency use)
 */
export async function pauseAllQueues() {
  const queues = getAllQueues();
  if (queues.length === 0) return;
  await Promise.all(queues.map(q => q.pause()));
}

/**
 * Resume all queues
 */
export async function resumeAllQueues() {
  const queues = getAllQueues();
  if (queues.length === 0) return;
  await Promise.all(queues.map(q => q.resume()));
}

/**
 * Graceful shutdown - close all queues
 */
export async function closeAllQueues() {
  const queues = getAllQueues();
  if (queues.length === 0) return;
  await Promise.all(queues.map(q => q.close()));
}

