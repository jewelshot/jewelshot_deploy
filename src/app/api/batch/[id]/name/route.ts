import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Batch:Name');

/**
 * PATCH /api/batch/[id]/name
 * Update batch project name
 * Body: { name: string }
 */
export async function PATCH(
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
      logger.warn('Unauthorized batch name update attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: batchProjectId } = await params;

    // Parse request body
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid name is required' },
        { status: 400 }
      );
    }

    // Update project name (RLS will ensure user owns it)
    const { data: project, error: updateError } = await supabase
      .from('batch_projects')
      .update({ name: name.trim() })
      .eq('id', batchProjectId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      logger.error('Failed to update batch project name', {
        userId: user.id,
        batchProjectId,
        error: updateError.message,
      });
      return NextResponse.json(
        { error: 'Failed to update batch project name' },
        { status: 500 }
      );
    }

    if (!project) {
      return NextResponse.json(
        { error: 'Batch project not found or unauthorized' },
        { status: 404 }
      );
    }

    logger.info('Batch project name updated', {
      userId: user.id,
      batchProjectId,
      newName: name.trim(),
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in batch name update', { error: errorMessage });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

