import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Batch:Create');

/**
 * POST /api/batch/create
 * Create a new batch project
 * Body: { name: string, totalImages: number }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized batch create attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { name, totalImages, prompt, aspectRatio } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    if (!totalImages || typeof totalImages !== 'number' || totalImages < 1) {
      return NextResponse.json(
        { error: 'Total images is required and must be a positive number' },
        { status: 400 }
      );
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in batch create', { error: errorMessage });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

