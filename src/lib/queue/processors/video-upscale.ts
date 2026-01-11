/**
 * Video Upscale Processor
 * 
 * Handles video upscaling using FlashVSR
 * Endpoint: fal-ai/flashvsr/upscale/video
 */

import { AIJobResult } from '../types';
import { processFalAI } from './base-processor';

export interface VideoUpscaleParams {
  video_url: string;
  upscale_factor?: number;       // 1-4, default 2
  acceleration?: 'regular' | 'high' | 'full';  // regular = best quality
  color_fix?: boolean;           // default true
  quality?: number;              // 0-100, default 70
  preserve_audio?: boolean;      // default false
  output_format?: 'X264 (.mp4)' | 'VP9 (.webm)' | 'PRORES4444 (.mov)' | 'GIF (.gif)';
  output_quality?: 'low' | 'medium' | 'high' | 'maximum';
  output_write_mode?: 'fast' | 'balanced' | 'small';
  seed?: number;
}

export async function processVideoUpscale(
  params: any, 
  apiKey: string
): Promise<AIJobResult> {
  // Build request params with defaults
  const upscaleParams = {
    video_url: params.video_url,
    upscale_factor: params.upscale_factor ?? 2,
    acceleration: params.acceleration ?? 'regular',
    color_fix: params.color_fix ?? true,
    quality: params.quality ?? 70,
    preserve_audio: params.preserve_audio ?? true,
    output_format: params.output_format ?? 'X264 (.mp4)',
    output_quality: params.output_quality ?? 'high',
    output_write_mode: params.output_write_mode ?? 'balanced',
    seed: params.seed,
  };

  const result = await processFalAI(
    'fal-ai/flashvsr/upscale/video', 
    upscaleParams, 
    apiKey
  );

  // Transform result to match expected format
  if (result.success && result.data) {
    return {
      ...result,
      data: {
        ...result.data,
        videoUrl: result.data.video?.url || result.data.videoUrl,
      },
    };
  }

  return result;
}
