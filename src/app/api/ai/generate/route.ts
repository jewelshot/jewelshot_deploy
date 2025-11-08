/**
 * API Route: /api/ai/generate
 * Secure server-side proxy for FAL.AI text-to-image generation
 * 🔒 Authentication Required
 */

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { createScopedLogger } from '@/lib/logger';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkRateLimit } from '@/lib/rate-limiter-db';
import {
  canMakeGlobalAIRequest,
  recordGlobalAIRequest,
  getGlobalRateLimitStatus,
} from '@/lib/rate-limiter-global';

const logger = createScopedLogger('API:Generate');

// Server-side FAL.AI initialization
fal.config({
  credentials: process.env.FAL_AI_API_KEY || '',
});

// Rate limiting configuration
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 60 * 1000; // per minute

// Note: Rate limiting handled by checkRateLimit from rate-limiter-db

export async function POST(request: NextRequest) {
  try {
    // 🔒 AUTHENTICATION CHECK
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized API access attempt');
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // 🛡️ GLOBAL RATE LIMITING (Protects FAL.AI from overload)
    if (!canMakeGlobalAIRequest()) {
      const globalStatus = getGlobalRateLimitStatus();
      const waitSeconds = Math.ceil(globalStatus.resetIn / 1000);

      logger.warn('Global AI rate limit reached', {
        userId: user.id,
        resetIn: waitSeconds,
      });

      return NextResponse.json(
        {
          error: 'System busy',
          message: `AI service is currently at capacity. Please try again in ${waitSeconds} seconds.`,
          retryAfter: waitSeconds,
          queuePosition: globalStatus.current - globalStatus.limit,
        },
        {
          status: 429,
          headers: {
            'Retry-After': waitSeconds.toString(),
            'X-RateLimit-Global': 'true',
          },
        }
      );
    }

    // 🛡️ USER RATE LIMITING (Per-user limits)
    const userId = user.id;

    const rateLimit = await checkRateLimit(userId, {
      endpoint: '/api/ai/generate',
      maxRequests: RATE_LIMIT,
      windowMs: RATE_WINDOW,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Try again in ${rateLimit.retryAfter} seconds.`,
          retryAfter: rateLimit.retryAfter,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimit.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': RATE_LIMIT.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Record global request
    recordGlobalAIRequest(userId);

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
  } catch (error: unknown) {
    logger.error('Generation failed:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to generate image',
        message,
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS preflight (Restricted to own domain)
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  const isAllowedOrigin = allowedOrigins.some((allowed) =>
    origin?.startsWith(allowed)
  );

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin! : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
