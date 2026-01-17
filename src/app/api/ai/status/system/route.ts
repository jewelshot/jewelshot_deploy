/**
 * System Status Endpoint
 * 
 * Returns current system capacity and health metrics
 * Useful for monitoring and debugging
 */

import { NextResponse } from 'next/server';
import { getKeyPoolStats } from '@/lib/queue/api-key-manager';
import { getTotalActiveRequests, getAllUserStats } from '@/lib/queue/user-concurrency';

export async function GET() {
  try {
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
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Failed to get system status',
      },
      { status: 500 }
    );
  }
}
