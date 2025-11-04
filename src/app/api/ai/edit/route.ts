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

const logger = createScopedLogger('API:Edit');

// Server-side FAL.AI initialization
fal.config({
  credentials: process.env.FAL_AI_API_KEY || '',
});

// Rate limiting store (in-memory, resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 60 * 1000; // per minute

/**
 * Upload image to FAL.AI storage if needed
 */
async function uploadIfNeeded(imageUrl: string): Promise<string> {
  // If it's already a URL, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
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
    const { prompt, image_url, num_images, output_format } = body;

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
    logger.debug('Processing image edit with prompt:', prompt);
    const uploadedUrl = await uploadIfNeeded(image_url);

    // Call FAL.AI Edit API
    const result = await fal.subscribe('fal-ai/nano-banana/edit', {
      input: {
        prompt,
        image_urls: [uploadedUrl],
        num_images: num_images ?? 1,
        output_format: output_format ?? 'jpeg',
      },
      logs: true,
    });

    logger.debug('Edit successful');

    // Return result
    return NextResponse.json(result.data);
  } catch (error: any) {
    logger.error('Edit failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to edit image',
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

