/**
 * Suspicious Activities API
 * 
 * Monitor and review suspicious user behavior
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/suspicious', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/suspicious', true);

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  
  const limit = parseInt(searchParams.get('limit') || '50');
  const reviewed = searchParams.get('reviewed'); // 'true', 'false', or null (all)

  try {
    let query = supabase
      .from('suspicious_activities')
      .select('*')
      .order('suspicion_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (reviewed === 'true') {
      query = query.eq('reviewed', true);
    } else if (reviewed === 'false') {
      query = query.eq('reviewed', false);
    }

    const { data: activities, error } = await query;

    if (error) throw error;

    // Get user emails
    const userIds = [...new Set(activities?.map(a => a.user_id) || [])];
    const { data: { users } } = await supabase.auth.admin.listUsers();
    
    const emailMap = new Map(users?.map(u => [u.id, u.email]) || []);

    const enrichedActivities = activities?.map(activity => ({
      ...activity,
      user_email: emailMap.get(activity.user_id) || 'Unknown',
    }));

    return NextResponse.json({
      activities: enrichedActivities,
      stats: {
        total: activities?.length || 0,
        unreviewed: activities?.filter(a => !a.reviewed).length || 0,
        highRisk: activities?.filter(a => a.suspicion_score >= 70).length || 0,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Suspicious activities API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suspicious activities', details: error.message },
      { status: 500 }
    );
  }
}

// Mark as reviewed
export async function POST(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }

  const supabase = createServiceClient();
  const { activityId, action } = await request.json();

  try {
    const { error } = await supabase
      .from('suspicious_activities')
      .update({
        reviewed: true,
        reviewed_at: new Date().toISOString(),
        action_taken: action || 'none',
      })
      .eq('id', activityId);

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update activity', details: error.message },
      { status: 500 }
    );
  }
}

