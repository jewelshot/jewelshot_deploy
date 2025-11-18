import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Batch:Image');

/**
 * POST /api/batch/[id]/image
 * Add/update an image in a batch project
 * Body: { 
 *   originalFilename: string, 
 *   originalSize: number, 
 *   resultUrl?: string, 
 *   status: 'pending' | 'processing' | 'completed' | 'failed',
 *   errorMessage?: string
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized batch image save attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: batchProjectId } = await params;

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('batch_projects')
      .select('id, user_id')
      .eq('id', batchProjectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Batch project not found' },
        { status: 404 }
      );
    }

    if (project.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { originalFilename, originalSize, resultUrl, status, errorMessage } = body;

    if (!originalFilename || typeof originalFilename !== 'string') {
      return NextResponse.json(
        { error: 'Original filename is required' },
        { status: 400 }
      );
    }

    if (!originalSize || typeof originalSize !== 'number') {
      return NextResponse.json(
        { error: 'Original size is required' },
        { status: 400 }
      );
    }

    if (!status || !['pending', 'processing', 'completed', 'failed'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      );
    }

    // Insert or update image record
    const imageData = {
      batch_project_id: batchProjectId,
      user_id: user.id,
      original_filename: originalFilename,
      original_size: originalSize,
      result_url: resultUrl || null,
      status,
      error_message: errorMessage || null,
      completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
    };

    const { data: image, error: imageError } = await supabase
      .from('batch_images')
      .insert(imageData)
      .select()
      .single();

    if (imageError) {
      logger.error('Failed to save batch image', {
        userId: user.id,
        batchProjectId,
        error: imageError.message,
      });
      return NextResponse.json(
        { error: 'Failed to save batch image' },
        { status: 500 }
      );
    }

    logger.info('Batch image saved', {
      userId: user.id,
      batchProjectId,
      imageId: image.id,
      status,
    });

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in batch image save', { error: errorMessage });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

