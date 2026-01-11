/**
 * AI Processor (Main Router)
 * 
 * Routes jobs to appropriate processors based on operation type
 * Injects API key and handles errors
 */

import { AIJobData, AIJobResult, AIOperation } from '../types';
import { getNextApiKey } from '../api-keys';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('AIProcessor');

// Import all operation processors
import { processEdit } from './edit';
import { processGenerate } from './generate';
import { processUpscale } from './upscale';
import { processVideoUpscale } from './video-upscale';
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
// MAIN PROCESSOR
// ============================================

/**
 * Process AI job
 * Routes to appropriate processor based on operation type
 * 
 * @param data - Job data containing operation and parameters
 * @returns AI processing result
 */
export async function processAIJob(data: AIJobData): Promise<AIJobResult> {
  const startTime = Date.now();
  
  console.log(`[AIProcessor] Starting ${data.operation} for user ${data.userId}`);
  
  // Get next API key from pool
  let apiKey: string;
  try {
    apiKey = getNextApiKey();
    console.log(`[AIProcessor] Got API key (length: ${apiKey?.length || 0})`);
  } catch (keyError) {
    console.error('[AIProcessor] Failed to get API key:', keyError);
    return {
      success: false,
      error: {
        message: keyError instanceof Error ? keyError.message : 'Failed to get API key',
        code: 'API_KEY_ERROR',
      },
    };
  }
  
  logger.debug(`Processing ${data.operation} for user ${data.userId}`);

  try {
    // Route to appropriate processor
    let result: AIJobResult;
    
    switch (data.operation) {
      case 'edit':
        result = await processEdit(data.params, apiKey);
        break;
      
      case 'generate':
        result = await processGenerate(data.params, apiKey);
        break;
      
      case 'upscale':
        result = await processUpscale(data.params, apiKey);
        break;
      
      case 'video-upscale':
        result = await processVideoUpscale(data.params, apiKey);
        break;
      
      case 'remove-bg':
        result = await processRemoveBackground(data.params, apiKey);
        break;
      
      case 'inpaint':
        result = await processInpaint(data.params, apiKey);
        break;
      
      case 'camera-control':
        result = await processCameraControl(data.params, apiKey);
        break;
      
      case 'gemstone':
        result = await processGemstone(data.params, apiKey);
        break;
      
      case 'metal-recolor':
        result = await processMetalRecolor(data.params, apiKey);
        break;
      
      case 'metal-polish':
        result = await processMetalPolish(data.params, apiKey);
        break;
      
      case 'natural-light':
        result = await processNaturalLight(data.params, apiKey);
        break;
      
      case 'video':
        result = await processVideo(data.params, apiKey);
        break;
      
      case 'turntable':
        result = await processTurntable(data.params, apiKey);
        break;
      
      default:
        return {
          success: false,
          error: {
            message: `Unknown operation: ${data.operation}`,
            code: 'UNKNOWN_OPERATION',
          },
        };
    }

    // Add processing metadata
    const processingTime = Date.now() - startTime;
    
    return {
      ...result,
      metadata: {
        ...result.metadata,
        processingTime,
      },
    };
  } catch (error: any) {
    logger.error(`Error processing ${data.operation}:`, error);
    
    return {
      success: false,
      error: {
        message: error.message || 'Unknown error occurred',
        code: 'PROCESSOR_ERROR',
        details: error,
      },
      metadata: {
        processingTime: Date.now() - startTime,
      },
    };
  }
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


