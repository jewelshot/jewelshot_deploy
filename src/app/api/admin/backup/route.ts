/**
 * Backup API
 * 
 * Trigger manual database backups and view backup history
 * 
 * 🔒 SECURITY: Session-based admin auth with auto audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { withAdminAuth } from '@/lib/admin';

// Get backup history
export const GET = withAdminAuth(
  { action: 'BACKUP_VIEW' },
  async (request: NextRequest, auth) => {
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
        { error: 'Failed to fetch backup history' },
        { status: 500 }
      );
    }
  }
);

// Trigger backup
export const POST = withAdminAuth(
  { action: 'BACKUP_TRIGGER' },  // Sensitive action
  async (request: NextRequest, auth) => {
    const supabase = createServiceClient();

    try {
      // Trigger backup
      const { data, error } = await supabase.rpc('trigger_backup', {
        admin_email: auth.userEmail,
      });

      if (error) throw error;

      return NextResponse.json({
        success: true,
        backup: data,
        message: 'Backup triggered successfully',
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error('Backup trigger error:', error);
      return NextResponse.json(
        { error: 'Failed to trigger backup' },
        { status: 500 }
      );
    }
  }
);
