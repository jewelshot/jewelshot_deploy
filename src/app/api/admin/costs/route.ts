/**
 * Cost Tracking & Analytics
 * 
 * Tracks AI operation costs and usage patterns
 * Access: /api/admin/costs
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Check admin authorization
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/costs', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/costs', true);

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7d'; // 1d, 7d, 30d

  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
    }

    // Get confirmed transactions (actual costs)
    const { data: transactions, error } = await supabase
      .from('credit_transactions')
      .select('operation_type, amount, created_at, confirmed_at')
      .eq('status', 'confirmed')
      .gte('confirmed_at', startDate.toISOString())
      .lte('confirmed_at', endDate.toISOString());

    if (error) throw error;

    // Calculate costs per operation type
    const costsByOperation: { [key: string]: number } = {};
    let totalCreditsUsed = 0;

    transactions?.forEach((tx) => {
      const credits = Math.abs(tx.amount);
      totalCreditsUsed += credits;
      
      if (!costsByOperation[tx.operation_type]) {
        costsByOperation[tx.operation_type] = 0;
      }
      costsByOperation[tx.operation_type] += credits;
    });

    // Get operation costs from database
    const { data: operationCosts } = await supabase
      .from('operation_costs')
      .select('*');

    // Calculate estimated USD cost
    const CREDIT_TO_USD = 0.01; // 1 credit = $0.01 (adjust based on your pricing)
    const estimatedCost = totalCreditsUsed * CREDIT_TO_USD;

    // Get active users count
    const { count: activeUsers } = await supabase
      .from('credit_transactions')
      .select('user_id', { count: 'exact', head: true })
      .eq('status', 'confirmed')
      .gte('confirmed_at', startDate.toISOString());

    return NextResponse.json({
      period,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary: {
        totalCreditsUsed,
        estimatedCostUSD: estimatedCost.toFixed(2),
        totalOperations: transactions?.length || 0,
        activeUsers: activeUsers || 0,
      },
      costsByOperation,
      operationCosts,
      transactions: transactions?.slice(0, 100), // Last 100 transactions
    });
  } catch (error: any) {
    console.error('Cost tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cost data', details: error.message },
      { status: 500 }
    );
  }
}

