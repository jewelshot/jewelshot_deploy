/**
 * Advanced API Key Manager
 * 
 * Features:
 * - 20+ API key support
 * - Health tracking & automatic key rotation
 * - Rate limit detection & cooldown
 * - Concurrent request tracking per key
 * - Weighted selection (least loaded key first)
 * - Graceful degradation under load
 * 
 * SECURITY: Keys never logged, server-side only
 */

import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('APIKeyManager');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Maximum concurrent requests per key (FAL.AI typical limit)
  MAX_CONCURRENT_PER_KEY: 10,
  
  // Cooldown after rate limit (ms)
  RATE_LIMIT_COOLDOWN: 60_000, // 1 minute
  
  // Key health check interval
  HEALTH_CHECK_INTERVAL: 30_000, // 30 seconds
  
  // Max failures before marking key unhealthy
  MAX_FAILURES_BEFORE_UNHEALTHY: 3,
  
  // Recovery time for failed keys
  FAILURE_RECOVERY_TIME: 300_000, // 5 minutes
};

// ============================================
// TYPES
// ============================================

interface KeyHealth {
  key: string;
  index: number;
  isHealthy: boolean;
  isRateLimited: boolean;
  rateLimitResetAt: number | null;
  activeRequests: number;
  totalRequests: number;
  failureCount: number;
  lastUsed: number;
  lastFailure: number | null;
  avgResponseTime: number;
}

interface KeyPoolStats {
  totalKeys: number;
  healthyKeys: number;
  rateLimitedKeys: number;
  totalActiveRequests: number;
  maxCapacity: number;
  availableCapacity: number;
  utilizationPercent: number;
}

// ============================================
// API KEY POOL
// ============================================

class APIKeyManager {
  private keys: KeyHealth[] = [];
  private initialized = false;

  constructor() {
    this.loadKeys();
  }

  /**
   * Load all API keys from environment
   * Supports FAL_KEY, FAL_AI_KEY_1 through FAL_AI_KEY_20
   */
  private loadKeys(): void {
    const envKeys: string[] = [];

    // Single key setup
    if (process.env.FAL_KEY) {
      envKeys.push(process.env.FAL_KEY);
    }

    // Multiple key setup (1-20)
    for (let i = 1; i <= 20; i++) {
      const key = process.env[`FAL_AI_KEY_${i}`];
      if (key && !envKeys.includes(key)) {
        envKeys.push(key);
      }
    }

    // Initialize health tracking for each key
    this.keys = envKeys.map((key, index) => ({
      key,
      index,
      isHealthy: true,
      isRateLimited: false,
      rateLimitResetAt: null,
      activeRequests: 0,
      totalRequests: 0,
      failureCount: 0,
      lastUsed: 0,
      lastFailure: null,
      avgResponseTime: 0,
    }));

    this.initialized = true;

    if (this.keys.length === 0) {
      console.warn('[APIKeyManager] No FAL.AI API keys found!');
    } else {
      logger.info(`Loaded ${this.keys.length} API key(s)`);
    }
  }

  /**
   * Get the best available key using weighted selection
   * Priority: healthy > not rate limited > least active requests > longest idle
   */
  public getKey(): { key: string; index: number } | null {
    // Refresh rate limit status
    this.refreshRateLimitStatus();

    // Filter available keys
    const availableKeys = this.keys.filter(k => 
      k.isHealthy && 
      !k.isRateLimited && 
      k.activeRequests < CONFIG.MAX_CONCURRENT_PER_KEY
    );

    if (availableKeys.length === 0) {
      // Try to find any key that's not at max capacity
      const anyAvailable = this.keys.find(k => 
        k.activeRequests < CONFIG.MAX_CONCURRENT_PER_KEY
      );

      if (anyAvailable) {
        logger.warn('Using degraded key (unhealthy or rate-limited)');
        return { key: anyAvailable.key, index: anyAvailable.index };
      }

      logger.error('No available API keys!');
      return null;
    }

    // Sort by: fewest active requests, then longest idle time
    availableKeys.sort((a, b) => {
      // Prefer fewer active requests
      if (a.activeRequests !== b.activeRequests) {
        return a.activeRequests - b.activeRequests;
      }
      // Then prefer longest idle (older lastUsed)
      return a.lastUsed - b.lastUsed;
    });

    const selected = availableKeys[0];
    logger.debug(`Selected key #${selected.index + 1} (active: ${selected.activeRequests})`);

    return { key: selected.key, index: selected.index };
  }

  /**
   * Acquire a key for use (increments active count)
   */
  public acquireKey(): { key: string; index: number; release: () => void } | null {
    const keyInfo = this.getKey();
    
    if (!keyInfo) {
      return null;
    }

    const keyHealth = this.keys[keyInfo.index];
    keyHealth.activeRequests++;
    keyHealth.totalRequests++;
    keyHealth.lastUsed = Date.now();

    // Return release function
    const release = () => {
      keyHealth.activeRequests = Math.max(0, keyHealth.activeRequests - 1);
    };

    return { ...keyInfo, release };
  }

  /**
   * Mark key as rate limited
   */
  public markRateLimited(keyIndex: number, retryAfterMs: number = CONFIG.RATE_LIMIT_COOLDOWN): void {
    if (keyIndex < 0 || keyIndex >= this.keys.length) return;

    const key = this.keys[keyIndex];
    key.isRateLimited = true;
    key.rateLimitResetAt = Date.now() + retryAfterMs;

    logger.warn(`Key #${keyIndex + 1} rate limited for ${retryAfterMs}ms`);
  }

  /**
   * Mark key as failed
   */
  public markFailed(keyIndex: number): void {
    if (keyIndex < 0 || keyIndex >= this.keys.length) return;

    const key = this.keys[keyIndex];
    key.failureCount++;
    key.lastFailure = Date.now();

    if (key.failureCount >= CONFIG.MAX_FAILURES_BEFORE_UNHEALTHY) {
      key.isHealthy = false;
      logger.error(`Key #${keyIndex + 1} marked unhealthy after ${key.failureCount} failures`);
    }
  }

  /**
   * Mark key as successful (resets failure count)
   */
  public markSuccess(keyIndex: number, responseTimeMs: number): void {
    if (keyIndex < 0 || keyIndex >= this.keys.length) return;

    const key = this.keys[keyIndex];
    key.failureCount = 0;
    key.isHealthy = true;
    
    // Update rolling average response time
    if (key.avgResponseTime === 0) {
      key.avgResponseTime = responseTimeMs;
    } else {
      key.avgResponseTime = (key.avgResponseTime * 0.9) + (responseTimeMs * 0.1);
    }
  }

  /**
   * Refresh rate limit status (check if cooldowns expired)
   */
  private refreshRateLimitStatus(): void {
    const now = Date.now();

    for (const key of this.keys) {
      // Check rate limit expiry
      if (key.isRateLimited && key.rateLimitResetAt && now >= key.rateLimitResetAt) {
        key.isRateLimited = false;
        key.rateLimitResetAt = null;
        logger.info(`Key #${key.index + 1} rate limit expired, now available`);
      }

      // Check failure recovery
      if (!key.isHealthy && key.lastFailure) {
        if (now - key.lastFailure >= CONFIG.FAILURE_RECOVERY_TIME) {
          key.isHealthy = true;
          key.failureCount = 0;
          logger.info(`Key #${key.index + 1} recovered from failure state`);
        }
      }
    }
  }

  /**
   * Get pool statistics
   */
  public getStats(): KeyPoolStats {
    this.refreshRateLimitStatus();

    const healthyKeys = this.keys.filter(k => k.isHealthy && !k.isRateLimited);
    const rateLimitedKeys = this.keys.filter(k => k.isRateLimited);
    const totalActiveRequests = this.keys.reduce((sum, k) => sum + k.activeRequests, 0);
    const maxCapacity = this.keys.length * CONFIG.MAX_CONCURRENT_PER_KEY;
    const availableCapacity = healthyKeys.length * CONFIG.MAX_CONCURRENT_PER_KEY - 
      healthyKeys.reduce((sum, k) => sum + k.activeRequests, 0);

    return {
      totalKeys: this.keys.length,
      healthyKeys: healthyKeys.length,
      rateLimitedKeys: rateLimitedKeys.length,
      totalActiveRequests,
      maxCapacity,
      availableCapacity: Math.max(0, availableCapacity),
      utilizationPercent: maxCapacity > 0 ? Math.round((totalActiveRequests / maxCapacity) * 100) : 0,
    };
  }

  /**
   * Check if system has capacity for new requests
   */
  public hasCapacity(): boolean {
    const stats = this.getStats();
    return stats.availableCapacity > 0;
  }

  /**
   * Get total number of keys
   */
  public getKeyCount(): number {
    return this.keys.length;
  }

  /**
   * Check if manager is properly initialized with keys
   */
  public isReady(): boolean {
    return this.initialized && this.keys.length > 0;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

let instance: APIKeyManager | null = null;

export function getAPIKeyManager(): APIKeyManager {
  if (!instance) {
    instance = new APIKeyManager();
  }
  return instance;
}

// ============================================
// CONVENIENCE EXPORTS
// ============================================

/**
 * Get next available API key (legacy compatibility)
 */
export function getNextApiKey(): string {
  const manager = getAPIKeyManager();
  const keyInfo = manager.getKey();
  
  if (!keyInfo) {
    throw new Error('No FAL.AI API keys available');
  }
  
  return keyInfo.key;
}

/**
 * Acquire a key with automatic release tracking
 */
export function acquireApiKey(): { key: string; index: number; release: () => void } | null {
  return getAPIKeyManager().acquireKey();
}

/**
 * Get pool statistics
 */
export function getKeyPoolStats(): KeyPoolStats {
  return getAPIKeyManager().getStats();
}

/**
 * Check if system has capacity
 */
export function hasKeyCapacity(): boolean {
  return getAPIKeyManager().hasCapacity();
}

/**
 * Mark key as rate limited
 */
export function markKeyRateLimited(keyIndex: number, retryAfterMs?: number): void {
  getAPIKeyManager().markRateLimited(keyIndex, retryAfterMs);
}

/**
 * Mark key as failed
 */
export function markKeyFailed(keyIndex: number): void {
  getAPIKeyManager().markFailed(keyIndex);
}

/**
 * Mark key as successful
 */
export function markKeySuccess(keyIndex: number, responseTimeMs: number): void {
  getAPIKeyManager().markSuccess(keyIndex, responseTimeMs);
}
