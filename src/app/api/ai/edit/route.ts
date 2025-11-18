/**
 * API Route: /api/ai/edit
 * Secure server-side proxy for FAL.AI image-to-image editing
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

const logger = createScopedLogger('API:Edit');

// Server-side FAL.AI initialization
const FAL_KEY = process.env.FAL_AI_API_KEY || '';
logger.info('[Edit] FAL_AI_API_KEY status:', {
  exists: !!FAL_KEY,
  length: FAL_KEY.length,
  prefix: FAL_KEY.substring(0, 10),
  format: FAL_KEY.includes(':')
    ? 'UUID format'
    : FAL_KEY.startsWith('fal_')
      ? 'fal_ format'
      : 'unknown',
});

fal.config({
  credentials: FAL_KEY,
});

// Rate limiting configuration
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 60 * 1000; // per minute

// Fallback: In-memory rate limiting (if Supabase service_role not available)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Upload image to FAL.AI storage if needed
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  // If it's already an absolute URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it's a relative URL (e.g., /api/images/[id]), convert to absolute and fetch
  if (imageUrl.startsWith('/')) {
    // Build proper base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
      'http://localhost:3000';

    const absoluteUrl = `${baseUrl}${imageUrl}`;

    logger.info('[Edit] Converting relative URL to absolute:', {
      original: imageUrl,
      absolute: absoluteUrl,
      baseUrl,
    });

    // Fetch the image from our own API
    const response = await fetch(absoluteUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image from ${absoluteUrl}: ${response.statusText}`
      );
    }

    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', {
      type: blob.type || 'image/jpeg',
    });

    // Upload to fal.ai storage
    const uploadedUrl = await fal.storage.upload(file);
    logger.debug('Image uploaded to FAL.AI:', uploadedUrl);
    return uploadedUrl;
  }

  // If it's a data URI, upload it
  if (imageUrl.startsWith('data:')) {
    // Convert data URI to Blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: blob.type });

    // Upload to fal.ai storage
    const uploadedUrl = await fal.storage.upload(file);
    logger.debug('Image uploaded to FAL.AI:', uploadedUrl);
    return uploadedUrl;
  }

  throw new Error('Invalid image URL format');
}

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
      endpoint: '/api/ai/edit',
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
      logger.error('Failed to check credits', {
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
      logger.warn('Insufficient credits', {
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
    const { prompt, image_url, num_images, output_format, aspect_ratio } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (!image_url || typeof image_url !== 'string') {
      return NextResponse.json(
        { error: 'image_url is required and must be a string' },
        { status: 400 }
      );
    }

    // Upload image if needed
    logger.info('[Edit] Processing image edit', {
      promptLength: prompt.length,
      imageUrl: image_url.substring(0, 50),
    });
    const uploadedUrl = await uploadIfNeeded(image_url);
    logger.info('[Edit] Image prepared:', uploadedUrl.substring(0, 50));

    // Call FAL.AI Edit API
    logger.info('[Edit] Calling Fal.ai nano-banana/edit API...');
    let result;
    try {
      result = await fal.subscribe('fal-ai/nano-banana/edit', {
        input: {
          prompt,
          image_urls: [uploadedUrl],
          num_images: num_images ?? 1,
          output_format: output_format ?? 'jpeg',
          aspect_ratio: aspect_ratio ?? '1:1',
        },
        logs: true,
        onQueueUpdate: (update) => {
          logger.info('[Edit] Queue update:', update.status);
        },
      });
      logger.info('[Edit] Fal.ai request successful');
    } catch (falError: unknown) {
      const error = falError as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      logger.error('[Edit] Fal.ai API error:', {
        message: error?.message,
        status: error?.status,
        statusCode: error?.statusCode,
        response: error?.response,
        data: error?.data,
        name: error?.name,
        stack: error?.stack?.split('\n')[0],
      });
      throw new Error(
        `Fal.ai API error: ${error?.message || error?.statusText || 'Unknown error'}`
      );
    }

    logger.info('[Edit] Edit successful');

    // 💰 DEDUCT CREDIT (After successful AI operation)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: deductError } = await (supabase as any).rpc('use_credit', {
        p_user_id: userId,
        p_description: 'AI Image Generation',
        p_metadata: { prompt: prompt.substring(0, 100) },
      });

      if (deductError) {
        logger.error('[Edit] Failed to deduct credit', {
          userId,
          error: deductError.message,
        });
        // Don't fail the request, just log the error
        // User already got the image, we'll fix credits later
      } else {
        logger.info('[Edit] Credit deducted successfully', { userId });
      }
    } catch (deductError) {
      logger.error('[Edit] Credit deduction error', { userId, deductError });
      // Don't fail the request
    }

    // Return result
    return NextResponse.json(result.data);
  } catch (error: unknown) {
    logger.error('Edit failed:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to edit image',
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
