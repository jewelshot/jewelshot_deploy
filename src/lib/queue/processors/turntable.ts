/**
 * Turntable Processor
 * 
 * Handles turntable/360 video generation
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processTurntable(params: any, apiKey: string): Promise<AIJobResult> {
  return processFalAI('fal-ai/kling-video/v1/standard/image-to-video', params, apiKey);
}

