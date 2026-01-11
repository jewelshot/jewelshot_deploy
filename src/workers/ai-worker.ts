/**
 * AI Worker
 * 
 * BullMQ worker for processing AI jobs from all queues
 * Runs as a separate process for reliability
 */

// Load environment variables
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { Worker, Job } from 'bullmq';
import { createServer } from 'http';
import { connection, workerConfig } from '@/lib/queue/config';
import { QUEUE_NAMES, AIJobData, AIJobResult } from '@/lib/queue/types';
import { processAIJob, validateJobData } from '@/lib/queue/processors/ai-processor';
import { confirmCredit, refundCredit } from '@/lib/credit-manager';
import { validateEnv } from '@/lib/env-validator';
import { createLogger } from '@/lib/structured-logger';

const logger = createLogger('Worker');

// ============================================
// VALIDATE ENVIRONMENT
// ============================================

try {
  validateEnv();
  logger.info('Environment variables validated');
} catch (error) {
  logger.fatal('Environment validation failed', error as Error);
  process.exit(1);
}

// ============================================
// WORKER INSTANCES
// ============================================

/**
 * Create worker for a specific queue
 */
function createWorker(queueName: string) {
  if (!connection) {
    throw new Error('Redis connection not available');
  }

  const worker = new Worker<AIJobData, AIJobResult>(
    queueName,
    async (job: Job<AIJobData>) => {
      const startTime = Date.now();
      
      logger.info('Processing job', {
        jobId: job.id,
        queue: queueName,
        operation: job.data.operation,
        userId: job.data.userId,
      });
      
      // Validate job data
      const validation = validateJobData(job.data);
      if (!validation.valid) {
        throw new Error(`Invalid job data: ${validation.error}`);
      }
      
      // Process the job
      const result = await processAIJob(job.data);
      
      const duration = Date.now() - startTime;
      logger.info('Job completed', {
        jobId: job.id,
        duration,
        operation: job.data.operation,
      });
      
      // If processing failed, throw error to trigger retry
      if (!result.success) {
        throw new Error(result.error?.message || 'Processing failed');
      }
      
      return result;
    },
    {
      connection,
      concurrency: workerConfig.concurrency,
      limiter: workerConfig.limiter,
    }
  );

  // ============================================
  // EVENT HANDLERS
  // ============================================

  worker.on('completed', async (job: Job<AIJobData, AIJobResult>) => {
    logger.info('Job completed successfully', { jobId: job.id });
    
    // Confirm credit deduction
    const transactionId = job.data.metadata?.creditTransactionId;
    if (transactionId) {
      try {
        await confirmCredit(transactionId, job.data.userId);
        logger.info('Credits confirmed', { jobId: job.id, transactionId });
      } catch (error) {
        logger.error('Failed to confirm credits', { jobId: job.id }, error as Error);
      }
    }
  });

  worker.on('failed', async (job: Job<AIJobData> | undefined, error: Error) => {
    if (job) {
      logger.error('Job failed', {
        jobId: job.id,
        attempt: job.attemptsMade,
        maxAttempts: job.opts.attempts,
      }, error);
      
      // Refund credits if this is the final attempt
      if (job.attemptsMade >= (job.opts.attempts || 3)) {
        const transactionId = job.data.metadata?.creditTransactionId;
        if (transactionId) {
          try {
            await refundCredit(transactionId);
            logger.info('Credits refunded for failed job', { jobId: job.id, transactionId });
          } catch (refundError) {
            logger.error('Failed to refund credits', { jobId: job.id }, refundError as Error);
          }
        }
      }
    } else {
      logger.error('Job failed (no job info)', error);
    }
  });

  worker.on('progress', (job: Job<AIJobData>, progress: any) => {
    logger.debug('Job progress', { jobId: job.id, progress });
  });

  worker.on('error', (error: Error) => {
    logger.error('Worker error', error);
  });

  worker.on('stalled', (jobId: string) => {
    logger.warn('Job stalled', { jobId });
  });

  return worker;
}

// ============================================
// START WORKERS
// ============================================

if (!connection) {
  logger.fatal('Redis connection not available. Set REDIS_URL environment variable.');
  process.exit(1);
}

logger.info('Starting AI Workers', {
  concurrency: workerConfig.concurrency,
  queues: Object.values(QUEUE_NAMES),
});

const urgentWorker = createWorker(QUEUE_NAMES.URGENT);
const normalWorker = createWorker(QUEUE_NAMES.NORMAL);
const backgroundWorker = createWorker(QUEUE_NAMES.BACKGROUND);

logger.info('All workers started successfully');

// ============================================
// HEALTH CHECK SERVER
// ============================================

const PORT = process.env.WORKER_PORT || 3001;

const server = createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      workers: {
        urgent: urgentWorker.isRunning(),
        normal: normalWorker.isRunning(),
        background: backgroundWorker.isRunning(),
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(health));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  logger.info('Health check server started', { port: PORT });
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

async function gracefulShutdown() {
  logger.info('Shutting down workers gracefully');
  
  // Close health check server
  server.close(() => {
    logger.info('Health check server stopped');
  });
  
  // Close workers
  await Promise.all([
    urgentWorker.close(),
    normalWorker.close(),
    backgroundWorker.close(),
  ]);
  
  logger.info('All workers stopped');
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// ============================================
// KEEP PROCESS ALIVE
// ============================================

// Prevent process from exiting
process.stdin.resume();

// Log worker status every 30 seconds
setInterval(() => {
  logger.debug('Workers running', {
    urgent: urgentWorker.isRunning(),
    normal: normalWorker.isRunning(),
    background: backgroundWorker.isRunning(),
  });
}, 30000);

