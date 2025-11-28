import { NextRequest, NextResponse } from 'next/server';
import { createScopedLogger } from '@/lib/logger';
import { withAdminAuth } from '@/lib/admin';

const logger = createScopedLogger('API:Setup:Migrate');

/**
 * POST /api/setup/migrate
 * Run batch_projects migration check
 * 🔒 ADMIN ONLY - Secured with session-based auth
 * ⚠️ Remove this endpoint after migration is confirmed!
 */
async function handler(request: NextRequest, auth: any) {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    logger.info('Running batch tables migration check', { 
      userId: auth.userId,
      adminEmail: auth.userEmail,
      role: auth.role,
    });

    // Check if tables already exist
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingProjects, error: checkError } = await (supabase as any)
      .from('batch_projects')
      .select('id')
      .limit(1);

    if (!checkError) {
      logger.info('Tables already exist', { userId: auth.userId });
      return NextResponse.json({
        success: true,
        message: 'Tables already exist!',
        tablesExist: true,
      });
    }

    // Tables don't exist, show error
    logger.error('Tables not found - migration needed', {
      userId: auth.userId,
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

// Export wrapped with admin auth
export const POST = withAdminAuth(
  { action: 'setup:migrate' },
  handler
);

