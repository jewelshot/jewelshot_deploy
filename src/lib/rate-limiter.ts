/**
 * Rate Limiter with localStorage persistence
 * Prevents API abuse by limiting requests per time window
 */

import { createScopedLogger } from './logger';

const logger = createScopedLogger('RateLimiter');

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  storageKey?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  retryAfter?: number;
}

export interface RateLimitStats {
  totalRequests: number;
  blockedRequests: number;
  remaining: number;
  resetAt: Date;
}

interface StoredData {
  timestamps: number[];
  totalRequests: number;
  blockedRequests: number;
}

export class RateLimiter {
  private timestamps: number[] = [];
  private config: RateLimitConfig;
  private totalRequests = 0;
  private blockedRequests = 0;

  constructor(config: RateLimitConfig) {
    this.config = {
      maxRequests: config.maxRequests,
      windowMs: config.windowMs,
      storageKey: config.storageKey,
    };

    // Load from localStorage if storage key provided
    if (this.config.storageKey && typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  /**
   * Check if a request can be made (without recording it)
   */
  canMakeRequest(): boolean {
    this.cleanupOldTimestamps();
    return this.timestamps.length < this.config.maxRequests;
  }

  /**
   * Record a request
   */
  recordRequest(): void {
    this.timestamps.push(Date.now());
    this.totalRequests++;
    this.saveToStorage();
  }

  /**
   * Get remaining requests
   */
  getRemainingRequests(): number {
    this.cleanupOldTimestamps();
    return Math.max(0, this.config.maxRequests - this.timestamps.length);
  }

  /**
   * Get time until reset in milliseconds
   */
  getTimeUntilReset(): number {
    this.cleanupOldTimestamps();
    
    if (this.timestamps.length === 0) {
      return 0;
    }

    const oldestTimestamp = this.timestamps[0];
    const resetTime = oldestTimestamp + this.config.windowMs;
    return Math.max(0, resetTime - Date.now());
  }

  /**
   * Check rate limit and return detailed information
   */
  checkLimit(): RateLimitResult {
    const allowed = this.canMakeRequest();
    const remaining = this.getRemainingRequests();
    const resetIn = this.getTimeUntilReset();

    if (!allowed) {
      this.blockedRequests++;
      this.saveToStorage();
      
      return {
        allowed: false,
        remaining,
        resetIn,
        retryAfter: Math.ceil(resetIn / 1000),
      };
    }

    return {
      allowed: true,
      remaining,
      resetIn,
    };
  }

  /**
   * Attempt to execute a request with rate limiting
   */
  async attemptRequest<T>(
    action: () => Promise<T>
  ): Promise<{ success: true; data: T } | { success: false; error: string; retryAfter: number }> {
    const limitCheck = this.checkLimit();

    if (!limitCheck.allowed) {
      logger.warn(`Rate limit exceeded. Retry after ${limitCheck.retryAfter} seconds`);
      return {
        success: false,
        error: `Rate limit exceeded. Try again in ${limitCheck.retryAfter} seconds.`,
        retryAfter: limitCheck.retryAfter!,
      };
    }

    try {
      this.recordRequest();
      const data = await action();
      return { success: true, data };
    } catch (error) {
      // Don't count failed requests against the limit
      this.timestamps.pop();
      this.totalRequests--;
      this.saveToStorage();
      throw error;
    }
  }

  /**
   * Get statistics
   */
  getStats(): RateLimitStats {
    this.cleanupOldTimestamps();
    
    const resetTime = this.timestamps.length > 0
      ? this.timestamps[0] + this.config.windowMs
      : Date.now() + this.config.windowMs;

    return {
      totalRequests: this.totalRequests,
      blockedRequests: this.blockedRequests,
      remaining: this.getRemainingRequests(),
      resetAt: new Date(resetTime),
    };
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.timestamps = [];
    this.totalRequests = 0;
    this.blockedRequests = 0;
    this.saveToStorage();
  }

  /**
   * Clean up old timestamps outside the time window
   */
  private cleanupOldTimestamps(): void {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(
      (timestamp) => now - timestamp < this.config.windowMs
    );
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    if (!this.config.storageKey || typeof window === 'undefined') {
      return;
    }

    try {
      const data: StoredData = {
        timestamps: this.timestamps,
        totalRequests: this.totalRequests,
        blockedRequests: this.blockedRequests,
      };
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      logger.error('Failed to save rate limit data to localStorage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    if (!this.config.storageKey || typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (!stored) {
        return;
      }

      const data: StoredData = JSON.parse(stored);
      this.timestamps = data.timestamps || [];
      this.totalRequests = data.totalRequests || 0;
      this.blockedRequests = data.blockedRequests || 0;

      // Clean up old timestamps
      this.cleanupOldTimestamps();
      this.saveToStorage(); // Save cleaned data back
    } catch (error) {
      logger.error('Failed to load rate limit data from localStorage:', error);
      // Start fresh if corrupted
      this.reset();
    }
  }
}

/**
 * Format wait time in seconds to human-readable string
 */
export function formatWaitTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? '' : 's'}`;
  }
  
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

/**
 * Pre-configured rate limiters for different use cases
 */
export const aiRateLimiter = new RateLimiter({ maxRequests: 15, windowMs: 60000, storageKey: 'rate_limit_ai' }); // Increased from 5
export const galleryRateLimiter = new RateLimiter({ maxRequests: 100, windowMs: 60000, storageKey: 'rate_limit_gallery' }); // Increased from 20
export const uploadRateLimiter = new RateLimiter({ maxRequests: 30, windowMs: 60000, storageKey: 'rate_limit_upload' }); // Increased from 10

export const rateLimiters = {
  ai: aiRateLimiter,
  gallery: galleryRateLimiter,
  upload: uploadRateLimiter,
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
