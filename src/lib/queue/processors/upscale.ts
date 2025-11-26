/**
 * Upscale Processor
 * 
 * Handles image upscaling operations
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processUpscale(params: any, apiKey: string): Promise<AIJobResult> {
  return processFalAI('fal-ai/aura-sr', params, apiKey);
}

