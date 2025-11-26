/**
 * Generate Processor
 * 
 * Handles FLUX Pro image generation
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processGenerate(params: any, apiKey: string): Promise<AIJobResult> {
  return processFalAI('fal-ai/flux-pro/v1.1', params, apiKey);
}

