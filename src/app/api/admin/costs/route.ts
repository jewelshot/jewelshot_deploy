/**
 * Cost Tracking & Analytics
 * 
 * Tracks AI operation costs and usage patterns
 * Access: /api/admin/costs
 * 
 * 🔒 SECURITY: Session-based admin auth with auto audit logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { withAdminAuth } from '@/lib/admin';

export const GET = withAdminAuth(
  { action: 'COSTS_VIEW' },
  async (request: NextRequest, auth) => {
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
        .gte('confirmed_at', startDate.toISOString());

      if (error) throw error;

      // Calculate costs per operation type
      const costsByOperation: { [key: string]: number } = {};
      const dailyCosts: { [key: string]: number } = {};

      transactions?.forEach(t => {
        const credits = Math.abs(t.amount);
        const operation = t.operation_type;

        // By operation
        costsByOperation[operation] = (costsByOperation[operation] || 0) + credits;

        // By date
        const date = new Date(t.confirmed_at).toISOString().split('T')[0];
        dailyCosts[date] = (dailyCosts[date] || 0) + credits;
      });

      // Calculate daily averages
      const totalCreditsUsed = Object.values(dailyCosts).reduce((sum, val) => sum + val, 0);
      const daysInPeriod = Object.keys(dailyCosts).length || 1;
      const dailyAverage = totalCreditsUsed / daysInPeriod;

      // Get operation cost breakdown
      const operationBreakdown = Object.entries(costsByOperation)
        .sort(([, a], [, b]) => b - a)
        .map(([operation, credits]) => ({
          operation,
          credits,
          percentage: ((credits / totalCreditsUsed) * 100).toFixed(1),
        }));

      // Daily trend
      const dailyTrend = Object.entries(dailyCosts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, credits]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          credits,
        }));

      return NextResponse.json({
        period,
        summary: {
          totalCreditsUsed,
          dailyAverage: Number(dailyAverage.toFixed(2)),
          totalTransactions: transactions?.length || 0,
          daysInPeriod,
        },
        byOperation: operationBreakdown,
        dailyTrend,
        timestamp: new Date().toISOString(),
      });

    } catch (error: any) {
      console.error('Costs API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch cost analytics', details: error.message },
        { status: 500 }
      );
    }
  }
);
