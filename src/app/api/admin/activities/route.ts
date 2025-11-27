/**
 * Activities API
 * 
 * Recent user activities, operations, and system events
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/activities', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/activities', true);

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  
  const limit = parseInt(searchParams.get('limit') || '100');
  const type = searchParams.get('type'); // 'all', 'operations', 'batches'

  try {
    const activities: any[] = [];

    // Get recent credit transactions (operations)
    if (!type || type === 'all' || type === 'operations') {
      const { data: transactions } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('status', 'confirmed')
        .order('confirmed_at', { ascending: false })
        .limit(limit);

      activities.push(...(transactions?.map(t => ({
        id: t.id,
        type: 'operation',
        user_id: t.user_id,
        operation: t.operation_type,
        timestamp: t.confirmed_at,
        metadata: t.metadata,
        credits_used: Math.abs(t.amount),
      })) || []));
    }

    // Get recent batch operations
    if (!type || type === 'all' || type === 'batches') {
      const { data: batches } = await supabase
        .from('batch_projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      activities.push(...(batches?.map(b => ({
        id: b.id,
        type: 'batch',
        user_id: b.user_id,
        name: b.name,
        status: b.status,
        timestamp: b.created_at,
        total_images: b.total_images,
        completed_images: b.completed_images,
      })) || []));
    }

    // Sort by timestamp
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      activities: activities.slice(0, limit),
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Activities API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities', details: error.message },
      { status: 500 }
    );
  }
}

