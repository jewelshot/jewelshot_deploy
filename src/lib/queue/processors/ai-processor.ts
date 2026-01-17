/**
 * AI Processor (Main Router)
 * 
 * Routes jobs to appropriate processors based on operation type
 * Features:
 * - Smart API key management with health tracking
 * - Automatic retry with key rotation on rate limit
 * - Graceful degradation under load
 */

import { AIJobData, AIJobResult } from '../types';
import { 
  acquireApiKey, 
  markKeyRateLimited, 
  markKeyFailed, 
  markKeySuccess,
  hasKeyCapacity,
  getKeyPoolStats,
} from '../api-key-manager';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('AIProcessor');

// Import all operation processors
import { processEdit } from './edit';
import { processGenerate } from './generate';
import { processUpscale } from './upscale';
import { processRemoveBackground } from './remove-bg';
import { processInpaint } from './inpaint';
import { processCameraControl } from './camera-control';
import { processGemstone } from './gemstone';
import { processMetalRecolor } from './metal-recolor';
import { processMetalPolish } from './metal-polish';
import { processNaturalLight } from './natural-light';
import { processVideo } from './video';
import { processTurntable } from './turntable';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Maximum retry attempts on rate limit
  MAX_RETRIES: 3,
  
  // Delay between retries (ms)
  RETRY_DELAY: 1000,
  
  // Timeout for capacity wait (ms)
  CAPACITY_WAIT_TIMEOUT: 5000,
};

// ============================================
// MAIN PROCESSOR
// ============================================

/**
 * Process AI job with smart key management
 * Routes to appropriate processor based on operation type
 * 
 * @param data - Job data containing operation and parameters
 * @returns AI processing result
 */
export async function processAIJob(data: AIJobData): Promise<AIJobResult> {
  const startTime = Date.now();
  
  console.log(`[AIProcessor] Starting ${data.operation} for user ${data.userId}`);
  
  // Check capacity before proceeding
  if (!hasKeyCapacity()) {
    const stats = getKeyPoolStats();
    console.warn(`[AIProcessor] System at capacity: ${stats.utilizationPercent}%`);
    
    // Wait briefly for capacity
    const hasCapacity = await waitForCapacity(CONFIG.CAPACITY_WAIT_TIMEOUT);
    
    if (!hasCapacity) {
      return {
        success: false,
        error: {
          message: 'System is currently at maximum capacity. Please try again in a few moments.',
          code: 'CAPACITY_EXCEEDED',
        },
      };
    }
  }

  // Try processing with automatic retry on rate limit
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
    // Acquire a key with tracking
    const keyAcquisition = acquireApiKey();
    
    if (!keyAcquisition) {
      console.error('[AIProcessor] Failed to acquire API key');
      return {
        success: false,
        error: {
          message: 'No API keys available',
          code: 'API_KEY_ERROR',
        },
      };
    }

    const { key: apiKey, index: keyIndex, release } = keyAcquisition;
    console.log(`[AIProcessor] Attempt ${attempt}/${CONFIG.MAX_RETRIES} with key #${keyIndex + 1}`);

    try {
      // Route to appropriate processor
      const result = await executeOperation(data, apiKey);
      
      // Release key and mark success
      release();
      const processingTime = Date.now() - startTime;
      markKeySuccess(keyIndex, processingTime);

      // Add processing metadata
      return {
        ...result,
        metadata: {
          ...result.metadata,
          processingTime,
          keyIndex,
          attempt,
        },
      };
    } catch (error: any) {
      release();
      lastError = error;
      
      // Check if rate limited
      if (isRateLimitError(error)) {
        const retryAfter = extractRetryAfter(error);
        markKeyRateLimited(keyIndex, retryAfter);
        
        console.warn(`[AIProcessor] Key #${keyIndex + 1} rate limited, retrying with different key...`);
        
        // Small delay before retry
        if (attempt < CONFIG.MAX_RETRIES) {
          await sleep(CONFIG.RETRY_DELAY);
        }
        continue;
      }
      
      // Other errors - mark key as potentially problematic
      markKeyFailed(keyIndex);
      
      // Don't retry on non-rate-limit errors
      break;
    }
  }

  // All attempts failed
  logger.error(`Error processing ${data.operation}:`, lastError);
  
  return {
    success: false,
    error: {
      message: lastError?.message || 'Unknown error occurred',
      code: lastError?.code || 'PROCESSOR_ERROR',
      details: lastError,
    },
    metadata: {
      processingTime: Date.now() - startTime,
    },
  };
}

/**
 * Execute the actual operation
 */
async function executeOperation(data: AIJobData, apiKey: string): Promise<AIJobResult> {
  switch (data.operation) {
    case 'edit':
      return await processEdit(data.params, apiKey);
    
    case 'generate':
      return await processGenerate(data.params, apiKey);
    
    case 'upscale':
      return await processUpscale(data.params, apiKey);
    
    case 'remove-bg':
      return await processRemoveBackground(data.params, apiKey);
    
    case 'inpaint':
      return await processInpaint(data.params, apiKey);
    
    case 'camera-control':
      return await processCameraControl(data.params, apiKey);
    
    case 'gemstone':
      return await processGemstone(data.params, apiKey);
    
    case 'metal-recolor':
      return await processMetalRecolor(data.params, apiKey);
    
    case 'metal-polish':
      return await processMetalPolish(data.params, apiKey);
    
    case 'natural-light':
      return await processNaturalLight(data.params, apiKey);
    
    case 'video':
      return await processVideo(data.params, apiKey);
    
    case 'turntable':
      return await processTurntable(data.params, apiKey);
    
    default:
      return {
        success: false,
        error: {
          message: `Unknown operation: ${data.operation}`,
          code: 'UNKNOWN_OPERATION',
        },
      };
  }
}

/**
 * Check if error is a rate limit error
 */
function isRateLimitError(error: any): boolean {
  if (!error) return false;
  
  // Check status code
  if (error.status === 429 || error.statusCode === 429) {
    return true;
  }
  
  // Check error message
  const message = (error.message || '').toLowerCase();
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return true;
  }
  
  // Check error code
  if (error.code === 'RATE_LIMIT_EXCEEDED' || error.code === 'TOO_MANY_REQUESTS') {
    return true;
  }
  
  return false;
}

/**
 * Extract retry-after from error (in milliseconds)
 */
function extractRetryAfter(error: any): number {
  // Check headers
  const retryAfterHeader = error.headers?.get?.('retry-after') || 
                           error.retryAfter || 
                           error.retry_after;
  
  if (retryAfterHeader) {
    const seconds = parseInt(retryAfterHeader, 10);
    if (!isNaN(seconds)) {
      return seconds * 1000;
    }
  }
  
  // Default to 60 seconds
  return 60_000;
}

/**
 * Wait for capacity to become available
 */
async function waitForCapacity(timeout: number): Promise<boolean> {
  const startTime = Date.now();
  const checkInterval = 100; // Check every 100ms
  
  while (Date.now() - startTime < timeout) {
    if (hasKeyCapacity()) {
      return true;
    }
    await sleep(checkInterval);
  }
  
  return false;
}

/**
 * Sleep helper
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate job data before processing
 */
export function validateJobData(data: AIJobData): { valid: boolean; error?: string } {
  if (!data.userId) {
    return { valid: false, error: 'Missing userId' };
  }
  
  if (!data.operation) {
    return { valid: false, error: 'Missing operation' };
  }
  
  if (!data.params || typeof data.params !== 'object') {
    return { valid: false, error: 'Invalid params' };
  }
  
  return { valid: true };
}
