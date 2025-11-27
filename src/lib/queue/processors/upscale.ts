/**
 * Upscale Processor
 * 
 * Handles image upscaling operations using SeedVR2
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export async function processUpscale(params: any, apiKey: string): Promise<AIJobResult> {
  // Use SeedVR2 upscaling with target resolution mode
  const upscaleParams = {
    image_url: params.image_url,
    upscale_mode: params.upscale_mode || 'target',
    target_resolution: params.target_resolution || '2160p',
    upscale_factor: params.upscale_factor,
    noise_scale: params.noise_scale || 0.1,
    output_format: params.output_format || 'jpg',
    seed: params.seed,
  };

  return processFalAI('fal-ai/seedvr/upscale/image', upscaleParams, apiKey);
}


