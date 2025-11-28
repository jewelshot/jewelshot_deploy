/**
 * TEMPORARY ENDPOINT - Until Redis is configured
 * This endpoint will be removed once queue system is active
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_KEY_1 || process.env.FAL_KEY || '',
});

export async function POST(request: NextRequest) {
  // ⚠️ DEPRECATED ENDPOINT - Bypasses credit system!
  // Use /api/ai/submit instead
  
  return NextResponse.json(
    {
      error: 'This endpoint is deprecated and has been removed for security reasons.',
      message: 'Please use /api/ai/submit instead with operation="edit".',
      migrateTo: '/api/ai/submit',
      documentation: '/docs/api',
      example: {
        method: 'POST',
        url: '/api/ai/submit',
        body: {
          operation: 'edit',
          params: {
            prompt: 'your prompt',
            image_url: 'image url',
          },
        },
      },
    },
    { 
      status: 410, // Gone
      headers: {
        'X-Deprecated': 'true',
        'X-Migrate-To': '/api/ai/submit',
      },
    }
  );
}


