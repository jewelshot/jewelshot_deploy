import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';
import { createApiError, ApiErrorCode, withErrorHandling } from '@/lib/api-error';
import { validateString, validateNumber, ValidationError } from '@/lib/validation';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const logger = createScopedLogger('API:Batch:Create');

// ============================================
// 🚦 BATCH CREATE RATE LIMITING
// ============================================
// 15 batch projects per minute per user (prevents spam)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const batchCreateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, '1 m'),
      analytics: true,
      prefix: 'ratelimit:batch:create',
    })
  : null;

/**
 * POST /api/batch/create
 * Create a new batch project
 * Body: { name: string, totalImages: number }
 */
export const POST = withErrorHandling(async (request: Request) => {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    logger.warn('Unauthorized batch create attempt');
    return createApiError(ApiErrorCode.UNAUTHORIZED);
  }

  // ============================================
  // 🚦 RATE LIMITING CHECK
  // ============================================
  if (batchCreateLimiter) {
    const { success, limit, remaining, reset } = await batchCreateLimiter.limit(user.id);

    if (!success) {
      logger.warn('Batch create rate limit exceeded', { userId: user.id });
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'You are creating batch projects too quickly. Please wait a minute.',
          limit,
          remaining: 0,
          reset,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit?.toString() || '15',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': reset?.toString() || '0',
            'Retry-After': '60',
          },
        }
      );
    }
  }

  // Parse request body
  const body = await request.json();
  const { name, totalImages, prompt, aspectRatio, fileNamingConfig } = body;

  // Generate default batch name if not provided
  const now = new Date();
  const defaultName = `Batch_${now.toLocaleDateString('en-GB').replace(/\//g, '-')}_${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).replace(':', '')}`;
  const batchName = name?.trim() || defaultName;

  // Validate inputs
  try {
    validateString(batchName, 'name', { required: true, minLength: 1, maxLength: 100 });
    validateNumber(totalImages, 'totalImages', { required: true, min: 1, max: 100, integer: true });
    if (prompt) {
      validateString(prompt, 'prompt', { minLength: 3, maxLength: 1000 });
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return createApiError(error.code, error.message);
    }
    throw error;
  }

    // Create batch project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: project, error: createError } = await (supabase as any)
      .from('batch_projects')
      .insert({
        user_id: user.id,
        name: batchName,
        total_images: totalImages,
        prompt: prompt || 'enhance the image quality and details',
        aspect_ratio: aspectRatio || 'auto',
        status: 'processing',
        file_naming_config: fileNamingConfig || null,
      })
      .select()
      .single();

    if (createError) {
      logger.error('Failed to create batch project', {
        userId: user.id,
        error: createError.message,
      });
      return NextResponse.json(
        { error: 'Failed to create batch project' },
        { status: 500 }
      );
    }

    logger.info('Batch project created', {
      userId: user.id,
      projectId: project.id,
      name: batchName,
      totalImages,
    });

    return NextResponse.json({
      success: true,
      project,
    });
});

