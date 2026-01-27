/**
 * AI Job Processor Endpoint
 * 
 * Serverless-compatible job processor
 * Called by Vercel Cron or external trigger to process queued jobs
 * 
 * POST /api/ai/process - Process next jobs from queue
 * GET /api/ai/process - Health check
 */

import { NextRequest, NextResponse } from 'next/server';
import { Worker, Job } from 'bullmq';
import { connection } from '@/lib/queue/config';
import { QUEUE_NAMES, AIJobData, AIJobResult } from '@/lib/queue/types';
import { processAIJob, validateJobData } from '@/lib/queue/processors/ai-processor';
import { confirmCredit, refundCredit } from '@/lib/credit-manager';
import { createScopedLogger } from '@/lib/logger';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds max for Vercel Pro

const logger = createScopedLogger('AIProcessor');

// ============================================
// HEALTH CHECK
// ============================================

export async function GET() {
  const status = {
    status: connection ? 'ready' : 'no-redis',
    timestamp: new Date().toISOString(),
    message: connection 
      ? 'Processor ready to handle jobs' 
      : 'Redis not configured - using sync processing',
  };

  return NextResponse.json(status);
}

// ============================================
// PROCESS JOBS
// ============================================

export async function POST(request: NextRequest) {
  // 🔒 SECURITY: CRON_SECRET is REQUIRED - no bypass allowed
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (!cronSecret) {
    logger.error('CRON_SECRET not configured - denying request');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    logger.warn('Unauthorized process request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!connection) {
    return NextResponse.json(
      { error: 'Redis not configured', message: 'Queue processing unavailable' },
      { status: 503 }
    );
  }

  // Parse request body for options
  const body = await request.json().catch(() => ({}));
  const maxJobs = Math.min(body.maxJobs || 5, 10); // Process up to 10 jobs per call
  const timeout = Math.min(body.timeout || 55000, 55000); // 55s timeout (leaving buffer)

  const startTime = Date.now();
  const results: any[] = [];

  try {
    // Process jobs from all queues in priority order
    const queueOrder = [QUEUE_NAMES.URGENT, QUEUE_NAMES.NORMAL, QUEUE_NAMES.BACKGROUND];

    for (const queueName of queueOrder) {
      // Check if we've exceeded timeout or max jobs
      if (Date.now() - startTime > timeout || results.length >= maxJobs) {
        break;
      }

      // Create a temporary worker to process jobs
      const processedJobs = await processQueueJobs(
        queueName,
        maxJobs - results.length,
        timeout - (Date.now() - startTime)
      );

      results.push(...processedJobs);
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
      duration: Date.now() - startTime,
    });

  } catch (error: any) {
    logger.error('Processor error:', error);
    return NextResponse.json(
      { error: 'Processing failed', message: error.message },
      { status: 500 }
    );
  }
}

// ============================================
// PROCESS QUEUE JOBS HELPER
// ============================================

async function processQueueJobs(
  queueName: string,
  maxJobs: number,
  timeout: number
): Promise<any[]> {
  const results: any[] = [];
  const startTime = Date.now();

  return new Promise((resolve) => {
    if (!connection) {
      resolve(results);
      return;
    }

    // Create worker for this queue
    const worker = new Worker<AIJobData, AIJobResult>(
      queueName,
      async (job: Job<AIJobData>) => {
        logger.info('Processing job', {
          jobId: job.id,
          queue: queueName,
          operation: job.data.operation,
        });

        // Validate job data
        const validation = validateJobData(job.data);
        if (!validation.valid) {
          throw new Error(`Invalid job data: ${validation.error}`);
        }

        // Process the job
        const result = await processAIJob(job.data);

        // Handle credits
        const transactionId = job.data.metadata?.creditTransactionId;
        if (transactionId) {
          if (result.success) {
            await confirmCredit(transactionId, job.data.userId);
          } else {
            await refundCredit(transactionId);
          }
        }

        if (!result.success) {
          throw new Error(result.error?.message || 'Processing failed');
        }

        return result;
      },
      { connection, concurrency: 1 }
    );

    // Track processed jobs
    let processedCount = 0;

    worker.on('completed', (job, result) => {
      results.push({
        jobId: job.id,
        status: 'completed',
        operation: job.data.operation,
        duration: Date.now() - job.timestamp,
      });
      processedCount++;

      if (processedCount >= maxJobs || Date.now() - startTime > timeout) {
        worker.close().then(() => resolve(results));
      }
    });

    worker.on('failed', (job, error) => {
      results.push({
        jobId: job?.id,
        status: 'failed',
        operation: job?.data.operation,
        error: error.message,
      });
      processedCount++;

      if (processedCount >= maxJobs || Date.now() - startTime > timeout) {
        worker.close().then(() => resolve(results));
      }
    });

    // Timeout handler
    setTimeout(() => {
      worker.close().then(() => resolve(results));
    }, timeout);
  });
}
