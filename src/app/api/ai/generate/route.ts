/**
 * TEMPORARY ENDPOINT - Until Redis is configured
 * This endpoint will be removed once queue system is active
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fal from '@fal-ai/serverless-client';

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_KEY_1 || process.env.FAL_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, num_images = 1, output_format = 'jpeg', aspect_ratio = '1:1' } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing required field: prompt' },
        { status: 400 }
      );
    }

    // Call FAL.AI directly (temporary - bypasses queue and credits)
    const result = await fal.subscribe('fal-ai/flux-pro', {
      input: {
        prompt,
        num_images,
        output_format,
        image_size: aspect_ratio,
      },
      logs: true,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}

