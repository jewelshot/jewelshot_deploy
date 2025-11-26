/**
 * Queue Configuration
 * 
 * Redis connection and queue settings
 */

import { ConnectionOptions } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAMES } from './types';

// ============================================
// REDIS CONNECTION
// ============================================

/**
 * Create Redis connection for BullMQ
 * Uses Upstash Redis (serverless, production-ready)
 */
export function createRedisConnection(): Redis | null {
  const redisUrl = process.env.REDIS_URL;
  
  if (!redisUrl) {
    // During build time, Redis is not needed
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      console.warn('[Queue] REDIS_URL not set, queue system will be disabled');
      return null;
    }
    // In development, require Redis URL
    if (typeof window === 'undefined') {
      console.warn('[Queue] REDIS_URL not set, some features may not work');
    }
    return null;
  }

  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    // Upstash-specific settings
    family: 0, // Use IPv4 and IPv6
    lazyConnect: false,
  });
}

/**
 * Shared Redis connection for all queues
 * Created once and reused
 * May be null if Redis is not configured
 */
export const connection = createRedisConnection();

// ============================================
// QUEUE CONFIGURATION
// ============================================

/**
 * Default job options for all queues
 */
export const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 2000, // Start with 2s, then 4s, then 8s
  },
  removeOnComplete: {
    count: 100, // Keep last 100 completed jobs
    age: 3600,  // Keep for 1 hour
  },
  removeOnFail: {
    count: 500,  // Keep last 500 failed jobs for debugging
    age: 86400,  // Keep for 24 hours
  },
  timeout: 300000, // 5 minutes max per job
};

/**
 * Queue-specific configurations
 */
export const queueConfigs = {
  [QUEUE_NAMES.URGENT]: {
    defaultJobOptions: {
      ...defaultJobOptions,
      priority: 1,
      timeout: 60000, // 1 minute for urgent jobs
    },
  },
  [QUEUE_NAMES.NORMAL]: {
    defaultJobOptions: {
      ...defaultJobOptions,
      priority: 5,
      timeout: 180000, // 3 minutes for normal jobs
    },
  },
  [QUEUE_NAMES.BACKGROUND]: {
    defaultJobOptions: {
      ...defaultJobOptions,
      priority: 10,
      timeout: 600000, // 10 minutes for background jobs
    },
  },
};

// ============================================
// WORKER CONFIGURATION
// ============================================

/**
 * Worker pool settings
 */
export const workerConfig = {
  concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '5', 10),
  limiter: {
    max: 10,      // Max 10 jobs
    duration: 1000, // per 1 second
  },
};

// ============================================
// LOGGING
// ============================================

/**
 * Queue event logging (optional)
 */
export const enableLogging = process.env.NODE_ENV === 'development';

export function logQueueEvent(event: string, data: any) {
  if (enableLogging) {
    console.log(`[Queue] ${event}:`, data);
  }
}

