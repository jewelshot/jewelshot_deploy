/**
 * API Route: /api/ai/generate
 * Secure server-side proxy for FAL.AI text-to-image generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Generate');

// Server-side FAL.AI initialization
fal.config({
  credentials: process.env.FAL_AI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.FAL_AI_API_KEY) {
      return NextResponse.json(
        { error: 'FAL.AI API key not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, num_images, output_format, aspect_ratio } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    // Call FAL.AI API
    logger.debug('Generating image with prompt:', prompt);

    const result = await fal.subscribe('fal-ai/nano-banana', {
      input: {
        prompt,
        num_images: num_images ?? 1,
        output_format: output_format ?? 'jpeg',
        aspect_ratio: aspect_ratio ?? '1:1',
      },
      logs: true,
    });

    logger.debug('Generation successful');

    // Return result
    return NextResponse.json(result.data);
  } catch (error: any) {
    logger.error('Generation failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate image',
        message: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

