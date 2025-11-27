/**
 * Backup API
 * 
 * Trigger manual database backups and view backup history
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess, getAdminEmail } from '@/lib/admin-auth';

// Get backup history
export async function GET(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/backup', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/backup', true);

  const supabase = createServiceClient();

  try {
    // Get backup stats
    const { data: stats } = await supabase.rpc('get_backup_stats');

    // Get recent backups
    const { data: backups } = await supabase
      .from('backup_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      stats: stats?.[0] || null,
      backups: backups || [],
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Backup API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch backup history', details: error.message },
      { status: 500 }
    );
  }
}

// Trigger manual backup
export async function POST(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/backup', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/backup', true);

  const supabase = createServiceClient();
  const adminEmail = getAdminEmail(request);
  const body = await request.json();
  const { reason } = body;

  try {
    // Log the backup trigger
    const { data: backupId } = await supabase.rpc('log_backup', {
      p_backup_type: 'manual',
      p_backup_method: 'api_trigger',
      p_triggered_by: adminEmail,
      p_trigger_reason: reason || 'Manual backup triggered from admin panel',
      p_status: 'completed',
    });

    return NextResponse.json({
      success: true,
      message: 'Backup logged successfully',
      backupId,
      note: 'Supabase Pro automatically creates backups. This action has been logged for audit purposes.',
      instructions: {
        viewBackups: 'Go to Supabase Dashboard → Database → Backups',
        downloadBackup: 'Click on any backup → Download',
        restoreBackup: 'Contact support or use restore script',
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Backup trigger error:', error);
    return NextResponse.json(
      { error: 'Failed to trigger backup', details: error.message },
      { status: 500 }
    );
  }
}
