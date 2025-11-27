import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';
import { createApiError, ApiErrorCode, withErrorHandling } from '@/lib/api-error';
import { validateString, validateNumber, ValidationError } from '@/lib/validation';

const logger = createScopedLogger('API:Batch:Create');

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

  // Parse request body
  const body = await request.json();
  const { name, totalImages, prompt, aspectRatio } = body;

  // Validate inputs
  try {
    validateString(name, 'name', { required: true, minLength: 1, maxLength: 100 });
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
        name,
        total_images: totalImages,
        prompt: prompt || 'enhance the image quality and details',
        aspect_ratio: aspectRatio || 'auto',
        status: 'processing',
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
      name,
      totalImages,
    });

    return NextResponse.json({
      success: true,
      project,
    });
});

