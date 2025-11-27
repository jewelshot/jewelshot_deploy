/**
 * Edit Processor
 * 
 * Handles nano-banana edit operations
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processEdit(params: any, apiKey: string): Promise<AIJobResult> {
  return processFalAI('fal-ai/nano-banana/edit', params, apiKey);
}


