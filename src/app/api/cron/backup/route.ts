/**
 * Database Backup Cron Job
 * 
 * Runs daily at 3 AM UTC
 * Creates pg_dump backup and uploads to Supabase Storage
 * 
 * Vercel Cron: https://vercel.com/docs/cron-jobs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { createLogger } from '@/lib/structured-logger';

const logger = createLogger('Backup:Cron');

// Verify cron secret (Vercel sets this automatically)
function isAuthorizedCron(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // 🔒 SECURITY: Always require CRON_SECRET (no development bypass)
  if (!cronSecret) {
    logger.error('CRON_SECRET not configured - denying all requests');
    return false;
  }
  
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  // Check authorization
  if (!isAuthorizedCron(request)) {
    logger.warn('Unauthorized cron attempt', {
      ip: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  logger.info('Starting database backup');

  try {
    const supabase = createServiceClient();
    
    // Get database connection info
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const projectRef = supabaseUrl?.split('//')[1]?.split('.')[0];
    
    if (!projectRef) {
      throw new Error('Could not extract project ref from Supabase URL');
    }

    // Create backup metadata
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const backupName = `backup_${projectRef}_${timestamp}.sql`;
    
    // Note: Supabase Free plan doesn't support direct pg_dump access
    // Instead, we'll backup critical tables to JSON
    const backupData = await createJSONBackup(supabase);
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('backups')
      .upload(`daily/${backupName}.json`, JSON.stringify(backupData, null, 2), {
        contentType: 'application/json',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Clean up old backups (keep last 7 days)
    await cleanupOldBackups(supabase);

    const duration = Date.now() - startTime;
    logger.info('Backup completed successfully', {
      backupName,
      duration,
      size: JSON.stringify(backupData).length,
    });

    return NextResponse.json({
      success: true,
      backupName,
      duration,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    const duration = Date.now() - startTime;
    logger.error('Backup failed', { duration, error: error.message });
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        duration,
      },
      { status: 500 }
    );
  }
}

/**
 * Create JSON backup of critical tables
 */
async function createJSONBackup(supabase: any) {
  const backup: any = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    tables: {},
  };

  // Backup user_credits
  const { data: userCredits, error: userCreditsError } = await supabase
    .from('user_credits')
    .select('*');
  
  if (userCreditsError) throw userCreditsError;
  backup.tables.user_credits = userCredits;

  // Backup credit_transactions
  const { data: creditTransactions, error: creditTransactionsError } = await supabase
    .from('credit_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10000); // Last 10k transactions
  
  if (creditTransactionsError) throw creditTransactionsError;
  backup.tables.credit_transactions = creditTransactions;

  // Backup batch_projects
  const { data: batchProjects, error: batchProjectsError } = await supabase
    .from('batch_projects')
    .select('*');
  
  if (batchProjectsError) throw batchProjectsError;
  backup.tables.batch_projects = batchProjects;

  // Backup batch_images (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: batchImages, error: batchImagesError } = await supabase
    .from('batch_images')
    .select('*')
    .gte('created_at', thirtyDaysAgo.toISOString());
  
  if (batchImagesError) throw batchImagesError;
  backup.tables.batch_images = batchImages;

  // Backup operation_costs
  const { data: operationCosts, error: operationCostsError } = await supabase
    .from('operation_costs')
    .select('*');
  
  if (operationCostsError) throw operationCostsError;
  backup.tables.operation_costs = operationCosts;

  return backup;
}

/**
 * Clean up backups older than 7 days
 */
async function cleanupOldBackups(supabase: any) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoffDate = sevenDaysAgo.toISOString().split('T')[0];

  try {
    // List all backups
    const { data: files, error: listError } = await supabase
      .storage
      .from('backups')
      .list('daily');

    if (listError) {
      logger.error('Failed to list backups for cleanup', { error: listError.message });
      return;
    }

    // Filter old backups
    const oldBackups = files.filter((file: any) => {
      const match = file.name.match(/backup_.*_(\d{4}-\d{2}-\d{2})/);
      if (!match) return false;
      return match[1] < cutoffDate;
    });

    // Delete old backups
    if (oldBackups.length > 0) {
      const filesToDelete = oldBackups.map((file: any) => `daily/${file.name}`);
      const { error: deleteError } = await supabase
        .storage
        .from('backups')
        .remove(filesToDelete);

      if (deleteError) {
        logger.error('Failed to delete old backups', { error: deleteError.message });
      } else {
        logger.info('Deleted old backups', { count: oldBackups.length });
      }
    }
  } catch (error: any) {
    logger.error('Cleanup failed', { error: error.message });
  }
}

// Also support POST for manual triggers
export const POST = GET;

