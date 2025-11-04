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

const logger = createScopedLogger('API:Generate');

// Server-side FAL.AI initialization
fal.config({
  credentials: process.env.FAL_AI_API_KEY || '',
});

// Rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 60 * 1000; // per minute

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

    // 🛡️ SERVER-SIDE RATE LIMITING
    const userId = user.id;
    const now = Date.now();
    const userLimit = rateLimitStore.get(userId);

    if (userLimit && now < userLimit.resetAt) {
      if (userLimit.count >= RATE_LIMIT) {
        const retryAfter = Math.ceil((userLimit.resetAt - now) / 1000);
        logger.warn(`Rate limit exceeded for user ${userId}`);
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: `Too many requests. Try again in ${retryAfter} seconds.`,
            retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
            },
          }
        );
      }
      userLimit.count += 1;
    } else {
      rateLimitStore.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
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

