/**
 * Users Management API
 * 
 * Provides comprehensive user data, statistics, and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/users', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/users', true);

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  const search = searchParams.get('search') || '';

  try {
    // Get users with credits
    let query = supabase
      .from('user_credits')
      .select(`
        user_id,
        balance,
        reserved,
        total_earned,
        total_spent,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: userCredits, error: creditsError, count } = await query;

    if (creditsError) throw creditsError;

    // Get auth user details for each user_id
    const userIds = userCredits?.map(uc => uc.user_id) || [];
    
    const { data: { users: authUsers }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    // Combine data
    const users = userCredits?.map(uc => {
      const authUser = authUsers?.find(au => au.id === uc.user_id);
      return {
        id: uc.user_id,
        email: authUser?.email || 'N/A',
        created_at: authUser?.created_at || uc.created_at,
        last_sign_in_at: authUser?.last_sign_in_at,
        email_confirmed_at: authUser?.email_confirmed_at,
        credits: {
          balance: uc.balance,
          reserved: uc.reserved,
          total_earned: uc.total_earned,
          total_spent: uc.total_spent,
        },
      };
    });

    // Get user stats
    const { data: transactionStats } = await supabase
      .from('credit_transactions')
      .select('user_id, operation_type, status')
      .in('user_id', userIds);

    // Calculate stats per user
    const userStats = users?.map(user => {
      const userTransactions = transactionStats?.filter(t => t.user_id === user.id) || [];
      const confirmed = userTransactions.filter(t => t.status === 'confirmed');
      
      return {
        ...user,
        stats: {
          total_operations: confirmed.length,
          operations_by_type: confirmed.reduce((acc: any, t) => {
            acc[t.operation_type] = (acc[t.operation_type] || 0) + 1;
            return acc;
          }, {}),
        },
      };
    });

    return NextResponse.json({
      users: userStats,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

