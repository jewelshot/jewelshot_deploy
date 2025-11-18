import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Batch:Delete');

/**
 * DELETE /api/batch/[id]
 * Delete a batch project and all its images
 */
export async function DELETE(
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
      logger.warn('Unauthorized batch delete attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: batchProjectId } = await params;

    // Delete batch project (CASCADE will delete images)
    const { error: deleteError } = await supabase
      .from('batch_projects')
      .delete()
      .eq('id', batchProjectId)
      .eq('user_id', user.id);

    if (deleteError) {
      logger.error('Failed to delete batch project', {
        userId: user.id,
        batchProjectId,
        error: deleteError.message,
      });
      return NextResponse.json(
        { error: 'Failed to delete batch project' },
        { status: 500 }
      );
    }

    logger.info('Batch project deleted', {
      userId: user.id,
      batchProjectId,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in batch delete', { error: errorMessage });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

