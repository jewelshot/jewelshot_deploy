/**
 * Per-User Concurrency Manager
 * 
 * Ensures fair resource distribution across users.
 * Prevents a single user from monopolizing all API capacity.
 * 
 * Features:
 * - Per-user concurrent request limits
 * - Different limits for different subscription tiers
 * - Real-time tracking of active requests
 */

import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('UserConcurrency');

// ============================================
// CONFIGURATION
// ============================================

export type UserTier = 'free' | 'basic' | 'premium' | 'enterprise';

const CONCURRENCY_LIMITS: Record<UserTier, number> = {
  free: 2,        // Free users: 2 concurrent requests
  basic: 5,       // Basic plan: 5 concurrent
  premium: 10,    // Premium plan: 10 concurrent
  enterprise: 25, // Enterprise: 25 concurrent
};

// ============================================
// STATE
// ============================================

interface UserState {
  activeRequests: number;
  tier: UserTier;
  lastActivity: number;
}

// In-memory tracking (for single-server setup)
// For multi-server, use Redis
const userStates = new Map<string, UserState>();

// Cleanup interval (remove stale entries every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
const STALE_THRESHOLD = 10 * 60 * 1000; // 10 minutes of inactivity

// Start cleanup timer
if (typeof window === 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [userId, state] of userStates.entries()) {
      if (now - state.lastActivity > STALE_THRESHOLD && state.activeRequests === 0) {
        userStates.delete(userId);
      }
    }
  }, CLEANUP_INTERVAL);
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Try to acquire a slot for a user
 * Returns release function if successful, null if at limit
 */
export function tryAcquireUserSlot(
  userId: string, 
  tier: UserTier = 'free'
): { acquired: boolean; release: () => void; activeCount: number; limit: number } {
  const limit = CONCURRENCY_LIMITS[tier];
  
  // Get or create user state
  let state = userStates.get(userId);
  if (!state) {
    state = { activeRequests: 0, tier, lastActivity: Date.now() };
    userStates.set(userId, state);
  }

  // Update tier if different
  state.tier = tier;
  state.lastActivity = Date.now();

  // Check if at limit
  if (state.activeRequests >= limit) {
    logger.debug(`User ${userId.slice(0, 8)} at limit: ${state.activeRequests}/${limit}`);
    return { 
      acquired: false, 
      release: () => {}, 
      activeCount: state.activeRequests, 
      limit 
    };
  }

  // Acquire slot
  state.activeRequests++;
  const currentCount = state.activeRequests;
  
  logger.debug(`User ${userId.slice(0, 8)} acquired slot: ${currentCount}/${limit}`);

  // Return release function
  const release = () => {
    const currentState = userStates.get(userId);
    if (currentState) {
      currentState.activeRequests = Math.max(0, currentState.activeRequests - 1);
      currentState.lastActivity = Date.now();
      logger.debug(`User ${userId.slice(0, 8)} released slot: ${currentState.activeRequests}/${limit}`);
    }
  };

  return { acquired: true, release, activeCount: currentCount, limit };
}

/**
 * Check if user has available capacity
 */
export function hasUserCapacity(userId: string, tier: UserTier = 'free'): boolean {
  const limit = CONCURRENCY_LIMITS[tier];
  const state = userStates.get(userId);
  
  if (!state) return true;
  return state.activeRequests < limit;
}

/**
 * Get user's current active request count
 */
export function getUserActiveCount(userId: string): number {
  const state = userStates.get(userId);
  return state?.activeRequests || 0;
}

/**
 * Get user's concurrency limit based on tier
 */
export function getUserLimit(tier: UserTier = 'free'): number {
  return CONCURRENCY_LIMITS[tier];
}

/**
 * Get all active user counts (for monitoring)
 */
export function getAllUserStats(): { userId: string; active: number; tier: UserTier }[] {
  const stats: { userId: string; active: number; tier: UserTier }[] = [];
  
  for (const [userId, state] of userStates.entries()) {
    if (state.activeRequests > 0) {
      stats.push({
        userId: userId.slice(0, 8) + '...', // Truncate for privacy
        active: state.activeRequests,
        tier: state.tier,
      });
    }
  }
  
  return stats;
}

/**
 * Get total active requests across all users
 */
export function getTotalActiveRequests(): number {
  let total = 0;
  for (const state of userStates.values()) {
    total += state.activeRequests;
  }
  return total;
}

/**
 * Force release all slots for a user (emergency cleanup)
 */
export function forceReleaseUser(userId: string): void {
  userStates.delete(userId);
  logger.warn(`Force released all slots for user ${userId.slice(0, 8)}`);
}
