/**
 * Simple Rate Limiter
 * Prevents API abuse by limiting requests per time window
 */

import { createScopedLogger } from './logger';

const logger = createScopedLogger('RateLimiter');

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private timestamps: number[] = [];
  private config: RateLimitConfig;

  constructor(
    maxRequests: number = 10,
    windowMs: number = 60000 // 1 minute default
  ) {
    this.config = { maxRequests, windowMs };
  }

  /**
   * Check if a request can be made
   */
  canMakeRequest(): boolean {
    const now = Date.now();

    // Remove timestamps outside the time window
    this.timestamps = this.timestamps.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );

    // Check if under the limit
    const canRequest = this.timestamps.length < this.config.maxRequests;

    if (!canRequest) {
      const oldestTimestamp = this.timestamps[0];
      const waitTime = Math.ceil(
        (oldestTimestamp + this.config.windowMs - now) / 1000
      );
      logger.warn(
        `Rate limit exceeded. Try again in ${waitTime} seconds. (${this.timestamps.length}/${this.config.maxRequests} requests)`
      );
    }

    return canRequest;
  }

  /**
   * Record a request
   */
  recordRequest(): void {
    this.timestamps.push(Date.now());
  }

  /**
   * Get remaining requests
   */
  getRemainingRequests(): number {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );
    return Math.max(0, this.config.maxRequests - this.timestamps.length);
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.timestamps = [];
  }
}

/**
 * Pre-configured rate limiters for different use cases
 */
export const rateLimiters = {
  ai: new RateLimiter(5, 60000), // 5 AI requests per minute
  gallery: new RateLimiter(20, 60000), // 20 gallery operations per minute
  upload: new RateLimiter(10, 60000), // 10 uploads per minute
};

/**
 * Check if a rate-limited action can proceed
 */
export function checkRateLimit(
  type: 'ai' | 'gallery' | 'upload'
): { allowed: boolean; remaining: number } {
  const limiter = rateLimiters[type];

  if (!limiter.canMakeRequest()) {
    return {
      allowed: false,
      remaining: limiter.getRemainingRequests(),
    };
  }

  limiter.recordRequest();

  return {
    allowed: true,
    remaining: limiter.getRemainingRequests(),
  };
}
