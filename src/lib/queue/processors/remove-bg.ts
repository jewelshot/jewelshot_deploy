/**
 * Remove Background Processor
 * 
 * Handles background removal operations
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processRemoveBackground(params: any, apiKey: string): Promise<AIJobResult> {
  return processFalAI('fal-ai/imageutils/rembg', params, apiKey);
}

