/**
 * Metal Recolor Processor
 * 
 * Handles metal recoloring operations
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processMetalRecolor(params: any, apiKey: string): Promise<AIJobResult> {
  return processFalAI('fal-ai/flux-pro/v1.1-ultra/redux', params, apiKey);
}


