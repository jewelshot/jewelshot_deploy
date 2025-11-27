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

// ============================================
// VALIDATE ENVIRONMENT
// ============================================

try {
  validateEnv();
  console.log('✅ Environment variables validated');
} catch (error) {
  console.error('❌ Environment validation failed:', (error as Error).message);
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
      
      console.log(`[Worker] Processing job ${job.id} from ${queueName}`);
      console.log(`[Worker] Operation: ${job.data.operation}, User: ${job.data.userId}`);
      
      // Validate job data
      const validation = validateJobData(job.data);
      if (!validation.valid) {
        throw new Error(`Invalid job data: ${validation.error}`);
      }
      
      // Process the job
      const result = await processAIJob(job.data);
      
      const duration = Date.now() - startTime;
      console.log(`[Worker] Job ${job.id} completed in ${duration}ms`);
      
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
    console.log(`✅ [Worker] Job ${job.id} completed successfully`);
    
    // Confirm credit deduction
    const transactionId = job.data.metadata?.creditTransactionId;
    if (transactionId) {
      try {
        await confirmCredit(transactionId);
        console.log(`[Worker] Credits confirmed for job ${job.id}`);
      } catch (error) {
        console.error(`[Worker] Failed to confirm credits for job ${job.id}:`, error);
      }
    }
  });

  worker.on('failed', async (job: Job<AIJobData> | undefined, error: Error) => {
    if (job) {
      console.error(`❌ [Worker] Job ${job.id} failed:`, error.message);
      console.error(`[Worker] Attempt ${job.attemptsMade}/${job.opts.attempts}`);
      
      // Refund credits if this is the final attempt
      if (job.attemptsMade >= (job.opts.attempts || 3)) {
        const transactionId = job.data.metadata?.creditTransactionId;
        if (transactionId) {
          try {
            await refundCredit(transactionId);
            console.log(`[Worker] Credits refunded for failed job ${job.id}`);
          } catch (error) {
            console.error(`[Worker] Failed to refund credits for job ${job.id}:`, error);
          }
        }
      }
    } else {
      console.error(`❌ [Worker] Job failed:`, error.message);
    }
  });

  worker.on('progress', (job: Job<AIJobData>, progress: any) => {
    console.log(`⏳ [Worker] Job ${job.id} progress:`, progress);
  });

  worker.on('error', (error: Error) => {
    console.error(`🔥 [Worker] Worker error:`, error);
  });

  worker.on('stalled', (jobId: string) => {
    console.warn(`⚠️  [Worker] Job ${jobId} stalled`);
  });

  return worker;
}

// ============================================
// START WORKERS
// ============================================

if (!connection) {
  console.error('❌ Redis connection not available. Set REDIS_URL environment variable.');
  process.exit(1);
}

console.log('🚀 Starting AI Workers...');
console.log(`Concurrency: ${workerConfig.concurrency}`);
console.log(`Queues: ${Object.values(QUEUE_NAMES).join(', ')}`);

const urgentWorker = createWorker(QUEUE_NAMES.URGENT);
const normalWorker = createWorker(QUEUE_NAMES.NORMAL);
const backgroundWorker = createWorker(QUEUE_NAMES.BACKGROUND);

console.log('✅ All workers started successfully');

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
  console.log(`🏥 Health check server running on port ${PORT}`);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

async function gracefulShutdown() {
  console.log('\n🛑 Shutting down workers gracefully...');
  
  // Close health check server
  server.close(() => {
    console.log('✅ Health check server stopped');
  });
  
  // Close workers
  await Promise.all([
    urgentWorker.close(),
    normalWorker.close(),
    backgroundWorker.close(),
  ]);
  
  console.log('✅ All workers stopped');
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
  console.log(`📊 Workers running - Checking queue stats...`);
}, 30000);

