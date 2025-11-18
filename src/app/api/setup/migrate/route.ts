import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('API:Setup:Migrate');

/**
 * POST /api/setup/migrate
 * Run batch_projects migration
 * ⚠️ ADMIN ONLY - Remove this endpoint after migration!
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('Running batch tables migration', { userId: user.id });

    // Check if tables already exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingProjects, error: checkError } = await (supabase as any)
      .from('batch_projects')
      .select('id')
      .limit(1);

    if (!checkError) {
      logger.info('Tables already exist', { userId: user.id });
      return NextResponse.json({
        success: true,
        message: 'Tables already exist!',
        tablesExist: true,
      });
    }

    // Tables don't exist, show error
    logger.error('Tables not found - migration needed', {
      userId: user.id,
      error: checkError.message,
    });

    return NextResponse.json({
      success: false,
      tablesExist: false,
      error: 'Tables not found',
      message: 'Please run the migration in Supabase Dashboard SQL Editor',
      instructions: [
        '1. Go to Supabase Dashboard → SQL Editor',
        '2. Create a new query',
        '3. Copy the migration from: supabase/migrations/20250118_batch_projects.sql',
        '4. Run the query',
        '5. Refresh this page',
      ],
      migrationFile: 'supabase/migrations/20250118_batch_projects.sql',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Migration check failed', { error: errorMessage });

    return NextResponse.json(
      {
        success: false,
        error: 'Migration check failed',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

