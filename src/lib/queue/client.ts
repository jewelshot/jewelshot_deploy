/**
 * Queue Client
 * 
 * Client for adding jobs to BullMQ queues
 * Used by API routes and services to submit AI jobs
 */

import { Queue, Job } from 'bullmq';
import { connection, defaultJobOptions, queueConfigs } from './config';
import { 
  QUEUE_NAMES, 
  AIJobData, 
  JobPriority, 
  PRIORITY_WEIGHTS,
  QueueName 
} from './types';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('QueueClient');

// ============================================
// QUEUE INSTANCES
// ============================================

let queues: Map<QueueName, Queue<AIJobData>> | null = null;

/**
 * Initialize queue instances (lazy loading)
 */
function getQueues(): Map<QueueName, Queue<AIJobData>> | null {
  if (!connection) {
    logger.warn('Redis connection not available, queue system disabled');
    return null;
  }

  if (!queues) {
    queues = new Map();
    
    // Connection is guaranteed to be non-null here
    const redisConnection = connection;
    
    Object.values(QUEUE_NAMES).forEach((name) => {
      const config = queueConfigs[name as keyof typeof queueConfigs];
      queues!.set(name, new Queue(name, {
        connection: redisConnection,
        defaultJobOptions: config?.defaultJobOptions || defaultJobOptions,
      }));
    });
    
    logger.info('Queue instances initialized', { 
      queues: Object.values(QUEUE_NAMES) 
    });
  }

  return queues;
}

/**
 * Get appropriate queue based on priority
 */
function getQueueByPriority(priority: JobPriority): QueueName {
  switch (priority) {
    case 'urgent':
      return QUEUE_NAMES.URGENT;
    case 'background':
      return QUEUE_NAMES.BACKGROUND;
    default:
      return QUEUE_NAMES.NORMAL;
  }
}

// ============================================
// ADD JOB
// ============================================

export interface AddJobResult {
  success: boolean;
  jobId?: string;
  queueName?: QueueName;
  error?: string;
}

/**
 * Add a job to the appropriate queue
 * 
 * @param data - AI job data
 * @returns Job ID and queue info
 */
export async function addJob(data: AIJobData): Promise<AddJobResult> {
  const queueInstances = getQueues();
  
  if (!queueInstances) {
    logger.error('Cannot add job: Queue system not available');
    return {
      success: false,
      error: 'Queue system not available (Redis not configured)',
    };
  }

  const queueName = getQueueByPriority(data.priority);
  const queue = queueInstances.get(queueName);

  if (!queue) {
    logger.error('Queue not found', { queueName });
    return {
      success: false,
      error: `Queue ${queueName} not found`,
    };
  }

  try {
    const job = await queue.add(data.operation, data, {
      priority: PRIORITY_WEIGHTS[data.priority],
      jobId: `${data.operation}-${data.userId}-${Date.now()}`,
    });

    logger.info('Job added to queue', {
      jobId: job.id,
      queue: queueName,
      operation: data.operation,
      userId: data.userId,
    });

    return {
      success: true,
      jobId: job.id!,
      queueName,
    };
  } catch (error: any) {
    logger.error('Failed to add job', { error: error.message });
    return {
      success: false,
      error: error.message || 'Failed to add job to queue',
    };
  }
}

// ============================================
// GET JOB STATUS
// ============================================

export interface JobStatus {
  id: string;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'unknown';
  progress: number;
  result?: any;
  error?: string;
  attemptsMade: number;
  timestamp: number;
}

/**
 * Get job status by ID
 * 
 * @param jobId - BullMQ job ID
 * @param queueName - Queue to search in (optional, searches all if not provided)
 */
export async function getJobStatus(
  jobId: string, 
  queueName?: QueueName
): Promise<JobStatus | null> {
  const queueInstances = getQueues();
  
  if (!queueInstances) {
    return null;
  }

  // Search in specific queue or all queues
  const queuesToSearch = queueName 
    ? [queueInstances.get(queueName)!]
    : Array.from(queueInstances.values());

  for (const queue of queuesToSearch) {
    try {
      const job = await queue.getJob(jobId);
      
      if (job) {
        const state = await job.getState();
        
        return {
          id: job.id!,
          state: state as JobStatus['state'],
          progress: job.progress as number || 0,
          result: job.returnvalue,
          error: job.failedReason,
          attemptsMade: job.attemptsMade,
          timestamp: job.timestamp,
        };
      }
    } catch (error) {
      // Job not found in this queue, continue searching
    }
  }

  return null;
}

// ============================================
// QUEUE HEALTH CHECK
// ============================================

export interface QueueHealth {
  connected: boolean;
  queues: {
    name: string;
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }[];
}

/**
 * Get health status of all queues
 */
export async function getQueueHealth(): Promise<QueueHealth> {
  const queueInstances = getQueues();
  
  if (!queueInstances || !connection) {
    return {
      connected: false,
      queues: [],
    };
  }

  try {
    // Test Redis connection
    await connection.ping();
    
    const queuesHealth = await Promise.all(
      Array.from(queueInstances.entries()).map(async ([name, queue]) => {
        const [waiting, active, completed, failed] = await Promise.all([
          queue.getWaitingCount(),
          queue.getActiveCount(),
          queue.getCompletedCount(),
          queue.getFailedCount(),
        ]);

        return {
          name,
          waiting,
          active,
          completed,
          failed,
        };
      })
    );

    return {
      connected: true,
      queues: queuesHealth,
    };
  } catch (error: any) {
    logger.error('Queue health check failed', { error: error.message });
    return {
      connected: false,
      queues: [],
    };
  }
}

// ============================================
// CHECK IF QUEUE AVAILABLE FOR ASYNC PROCESSING
// ============================================

/**
 * Check if the queue system is available for ASYNC processing
 * 
 * IMPORTANT: In Vercel serverless environment, we cannot run persistent workers.
 * Even if Redis is connected, jobs will sit in queue forever without a worker.
 * 
 * This returns false to force synchronous processing.
 * Enable async mode only when you have a dedicated worker process running
 * (e.g., on Railway, Render, or a VPS with ENABLE_ASYNC_QUEUE=true).
 * 
 * Note: Redis is still used for:
 * - Rate limiting (protects against 200+ concurrent users)
 * - Job tracking and monitoring
 * - Future migration to async processing
 */
export function isQueueAvailable(): boolean {
  // Check if async queue mode is explicitly enabled
  // Set ENABLE_ASYNC_QUEUE=true when you have a dedicated worker
  const asyncEnabled = process.env.ENABLE_ASYNC_QUEUE === 'true';
  
  if (!asyncEnabled) {
    // Sync mode: process immediately in API route
    // Redis still works for rate limiting
    return false;
  }
  
  // Async mode: use queue (requires dedicated worker)
  return connection !== null;
}

/**
 * Check if Redis is connected (for rate limiting, health checks)
 */
export function isRedisConnected(): boolean {
  return connection !== null;
}
