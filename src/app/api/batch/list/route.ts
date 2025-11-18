import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Batch:List');

/**
 * GET /api/batch/list
 * List user's batch projects with images
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Auth check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      logger.warn('Unauthorized batch list attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch batch projects with images
    const { data: projects, error: projectsError } = await supabase
      .from('batch_projects')
      .select(`
        *,
        batch_images (
          id,
          original_filename,
          original_size,
          result_url,
          status,
          error_message,
          created_at,
          completed_at
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (projectsError) {
      logger.error('Failed to fetch batch projects', {
        userId: user.id,
        error: projectsError.message,
      });
      return NextResponse.json(
        { error: 'Failed to fetch batch projects' },
        { status: 500 }
      );
    }

    logger.info('Batch projects fetched', {
      userId: user.id,
      count: projects?.length || 0,
    });

    return NextResponse.json({
      success: true,
      projects: projects || [],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error in batch list', { error: errorMessage });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

