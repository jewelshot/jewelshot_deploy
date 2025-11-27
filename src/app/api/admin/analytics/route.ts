/**
 * Analytics API
 * 
 * System-wide analytics: popular presets, actions, prompts, trends
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { isAdminAuthorized, logAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const authCheck = await isAdminAuthorized(request);
  
  if (!authCheck.authorized) {
    logAdminAccess(request, '/api/admin/analytics', false, authCheck.error);
    return NextResponse.json(
      { error: authCheck.error },
      { status: authCheck.statusCode || 401 }
    );
  }
  
  logAdminAccess(request, '/api/admin/analytics', true);

  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '30d'; // 1d, 7d, 30d, all

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
      case 'all':
        startDate.setFullYear(2020); // Since beginning
        break;
    }

    // Get all confirmed operations
    const { data: operations } = await supabase
      .from('credit_transactions')
      .select('operation_type, metadata, created_at, confirmed_at')
      .eq('status', 'confirmed')
      .gte('confirmed_at', startDate.toISOString());

    // Analyze operations
    const operationCounts: { [key: string]: number } = {};
    const presetUsage: { [key: string]: number } = {};
    const prompts: string[] = [];
    const dailyOperations: { [key: string]: number } = {};
    const dailyCosts: { [key: string]: number } = {};

    operations?.forEach(op => {
      // Count operations
      operationCounts[op.operation_type] = (operationCounts[op.operation_type] || 0) + 1;

      // Track presets
      if (op.metadata?.preset) {
        presetUsage[op.metadata.preset] = (presetUsage[op.metadata.preset] || 0) + 1;
      }

      // Collect prompts
      if (op.metadata?.prompt) {
        prompts.push(op.metadata.prompt);
      }

      // Daily counts
      const date = new Date(op.confirmed_at).toISOString().split('T')[0];
      dailyOperations[date] = (dailyOperations[date] || 0) + 1;
      
      // Daily costs (assuming 1 credit = $0.01, adjust as needed)
      const creditCost = Math.abs(op.metadata?.credits_used || 1);
      dailyCosts[date] = (dailyCosts[date] || 0) + (creditCost * 0.01);
    });

    // Sort by popularity
    const topOperations = Object.entries(operationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([operation, count]) => ({ operation, count }));

    const topPresets = Object.entries(presetUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([preset, count]) => ({ preset, count }));

    // Recent unique prompts
    const uniquePrompts = [...new Set(prompts)].slice(0, 20);

    // Daily trend
    const dailyTrend = Object.entries(dailyOperations)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    // Chart data for operations
    const dailyOperationsChart = Object.entries(dailyOperations)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, operations]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        operations,
        cost: dailyCosts[date] || 0,
      }));

    // Chart data for costs
    const dailyCostsChart = Object.entries(dailyCosts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, cost]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cost: Number(cost.toFixed(4)),
      }));

    // User growth data
    const { data: users } = await supabase.auth.admin.listUsers();
    const dailyUsers: { [key: string]: number } = {};
    
    users.users?.forEach(user => {
      const date = new Date(user.created_at).toISOString().split('T')[0];
      if (new Date(date) >= startDate) {
        dailyUsers[date] = (dailyUsers[date] || 0) + 1;
      }
    });

    // Cumulative user count
    let cumulativeCount = 0;
    const dailyUsersChart = Object.entries(dailyUsers)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => {
        cumulativeCount += count;
        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: cumulativeCount,
        };
      });

    return NextResponse.json({
      period,
      totalOperations: operations?.length || 0,
      topOperations,
      topPresets,
      recentPrompts: uniquePrompts,
      dailyTrend,
      // Chart data
      dailyOperations: dailyOperationsChart,
      dailyCosts: dailyCostsChart,
      dailyUsers: dailyUsersChart,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}

