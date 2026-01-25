/**
 * System Status Endpoint
 * 
 * Returns current system capacity and health metrics
 * 🔒 SECURED: Requires admin authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKeyPoolStats } from '@/lib/queue/api-key-manager';
import { getTotalActiveRequests, getAllUserStats } from '@/lib/queue/user-concurrency';
import { createClient } from '@/lib/supabase/server';

// Check if user is admin
async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = (profile as { role?: string } | null)?.role;
    return role === 'admin' || role === 'superadmin';
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // 🔒 SECURITY: Check admin access
    const admin = await isAdmin();
    
    if (!admin) {
      // Return only basic health info for non-admins
      return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        health: {
          isHealthy: true,
          message: 'System operational',
        },
      });
    }

    // Full stats for admins only
    const keyStats = getKeyPoolStats();
    const totalActiveRequests = getTotalActiveRequests();
    const userStats = getAllUserStats();

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      capacity: {
        totalKeys: keyStats.totalKeys,
        healthyKeys: keyStats.healthyKeys,
        rateLimitedKeys: keyStats.rateLimitedKeys,
        maxCapacity: keyStats.maxCapacity,
        availableCapacity: keyStats.availableCapacity,
        utilizationPercent: keyStats.utilizationPercent,
        totalActiveRequests: keyStats.totalActiveRequests,
      },
      users: {
        activeUsers: userStats.length,
        totalActiveRequests,
        breakdown: userStats.slice(0, 10), // Top 10 users only
      },
      health: {
        isHealthy: keyStats.healthyKeys > 0,
        hasCapacity: keyStats.availableCapacity > 0,
        message: keyStats.availableCapacity > 0 
          ? 'System operational' 
          : 'System at capacity',
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get system status';
    return NextResponse.json(
      {
        status: 'error',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
