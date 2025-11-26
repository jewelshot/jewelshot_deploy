/**
 * Video Processor
 * 
 * Handles video generation from images
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processVideo(params: any, apiKey: string): Promise<AIJobResult> {
  return processFalAI('fal-ai/kling-video/v1/standard/image-to-video', params, apiKey);
}

