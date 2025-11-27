/**
 * Admin Audit Logs API
 * 
 * View admin activity history for security & compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/audit-logs', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/audit-logs', true);

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  const adminEmail = searchParams.get('admin_email');
  const actionType = searchParams.get('action_type');
  const actionCategory = searchParams.get('action_category');
  const targetId = searchParams.get('target_id');

  try {
    // Build query
    let query = supabase
      .from('admin_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (adminEmail) {
      query = query.eq('admin_email', adminEmail);
    }
    if (actionType) {
      query = query.eq('action_type', actionType);
    }
    if (actionCategory) {
      query = query.eq('action_category', actionCategory);
    }
    if (targetId) {
      query = query.eq('target_id', targetId);
    }

    const { data: logs, error, count } = await query;

    if (error) throw error;

    // Get summary stats
    const { data: stats } = await supabase
      .from('admin_logs')
      .select('action_category, success')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const summary = {
      totalLogs: count || 0,
      last7Days: stats?.length || 0,
      successRate: stats
        ? ((stats.filter(s => s.success).length / stats.length) * 100).toFixed(1)
        : '100',
      byCategory: stats?.reduce((acc: any, curr) => {
        acc[curr.action_category] = (acc[curr.action_category] || 0) + 1;
        return acc;
      }, {}),
    };

    return NextResponse.json({
      logs,
      summary,
      pagination: {
        limit,
        offset,
        total: count || 0,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Audit logs API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs', details: error.message },
      { status: 500 }
    );
  }
}

