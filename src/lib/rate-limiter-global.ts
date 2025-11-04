/**
 * ============================================================================
 * GLOBAL RATE LIMITER - Protects FAL.AI API from rate limit bans
 * ============================================================================
 * 
 * Ensures the entire application doesn't exceed FAL.AI rate limits,
 * regardless of how many users are making requests.
 * 
 * Current Implementation: In-memory (single instance)
 * Future: Redis-based for multi-instance support
 */

import { createScopedLogger } from './logger';

const logger = createScopedLogger('GlobalRateLimit');

// FAL.AI rate limits (conservative to avoid bans)
const GLOBAL_AI_LIMIT = 15; // 15 AI requests per minute (safe for free tier)
const WINDOW_MS = 60 * 1000; // 1 minute

interface RequestRecord {
  timestamp: number;
  userId?: string;
}

// In-memory store (will be replaced with Redis in production)
const requestHistory: RequestRecord[] = [];

/**
 * Check if a new AI request can be made globally
 */
export function canMakeGlobalAIRequest(): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Remove old requests outside the window
  const recentRequests = requestHistory.filter(
    (req) => req.timestamp > windowStart
  );

  // Update the array
  requestHistory.length = 0;
  requestHistory.push(...recentRequests);

  if (recentRequests.length >= GLOBAL_AI_LIMIT) {
    logger.warn('Global AI rate limit reached', {
      current: recentRequests.length,
      limit: GLOBAL_AI_LIMIT,
    });
    return false;
  }

  return true;
}

/**
 * Record a new AI request
 */
export function recordGlobalAIRequest(userId?: string): void {
  requestHistory.push({
    timestamp: Date.now(),
    userId,
  });

  logger.debug('Global AI request recorded', {
    total: requestHistory.length,
    limit: GLOBAL_AI_LIMIT,
    userId,
  });
}

/**
 * Get current global rate limit status
 */
export function getGlobalRateLimitStatus(): {
  current: number;
  limit: number;
  remaining: number;
  resetIn: number; // milliseconds
} {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const recentRequests = requestHistory.filter(
    (req) => req.timestamp > windowStart
  );

  const oldestRequest = recentRequests[0];
  const resetIn = oldestRequest
    ? WINDOW_MS - (now - oldestRequest.timestamp)
    : 0;

  return {
    current: recentRequests.length,
    limit: GLOBAL_AI_LIMIT,
    remaining: Math.max(0, GLOBAL_AI_LIMIT - recentRequests.length),
    resetIn: Math.max(0, resetIn),
  };
}

/**
 * Get estimated queue position for a user
 * (simplified - will be enhanced with actual queue system)
 */
export function getEstimatedWaitTime(): number {
  const status = getGlobalRateLimitStatus();
  
  if (status.remaining > 0) {
    return 0; // No wait
  }

  // Estimate: Each AI request takes ~30s average
  const AVG_REQUEST_TIME = 30 * 1000;
  const queueDepth = Math.max(0, status.current - status.limit);
  
  return Math.ceil((queueDepth * AVG_REQUEST_TIME) / GLOBAL_AI_LIMIT);
}

