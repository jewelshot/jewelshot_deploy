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

    // 💳 CREDIT CHECK (Before expensive AI operation)
    const { data: creditData, error: creditError } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', userId)
      .single();

    if (creditError || !creditData) {
      logger.error('[Generate] Failed to check credits', {
        userId,
        error: creditError?.message,
      });
      return NextResponse.json(
        { error: 'Failed to check credits' },
        { status: 500 }
      );
    }

    const typedCreditData = creditData as { credits_remaining: number };

    if (typedCreditData.credits_remaining < 1) {
      logger.warn('[Generate] Insufficient credits', {
        userId,
        remaining: typedCreditData.credits_remaining,
      });
      return NextResponse.json(
        {
          error: 'Insufficient credits',
          message: 'You need at least 1 credit to generate images.',
          credits: typedCreditData.credits_remaining,
        },
        { status: 402 } // Payment Required
      );
    }

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

    // 💰 DEDUCT CREDIT (After successful AI operation)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: deductError } = await (supabase as any).rpc('use_credit', {
        p_user_id: userId,
        p_description: 'AI Image Generation',
        p_metadata: {
          operation: 'generate',
          prompt: prompt.substring(0, 100),
          aspect_ratio,
        },
      });

      if (deductError) {
        logger.error('[Generate] Failed to deduct credit', {
          userId,
          error: deductError.message,
        });
      } else {
        logger.info('[Generate] Credit deducted successfully', { userId });
      }
    } catch (deductError) {
      logger.error('[Generate] Credit deduction error', {
        userId,
        deductError,
      });
    }

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
