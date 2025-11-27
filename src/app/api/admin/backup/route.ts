/**
 * Manual Backup Trigger
 * 
 * Allows admin to manually trigger database backup
 * Access: POST /api/admin/backup
 */

import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  // Check admin authorization
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/backup', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/backup', true);

  try {
    // Trigger backup cron job
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const cronSecret = process.env.CRON_SECRET || '';
    
    const response = await fetch(`${baseUrl}/api/cron/backup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Backup failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Backup completed successfully',
      ...result,
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to trigger backup',
      },
      { status: 500 }
    );
  }
}

