/**
 * API Key Manager
 * 
 * Round-robin load balancing for multiple FAL.AI API keys
 * SECURITY: Keys never logged, server-side only
 */

import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('APIKeys');

// Load environment variables (for worker process)
if (typeof window === 'undefined') {
  try {
    const dotenv = require('dotenv');
    const path = require('path');
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
  } catch (e) {
    // dotenv might not be available in all contexts, ignore
  }
}

// ============================================
// API KEY POOL
// ============================================

/**
 * Load all available FAL.AI API keys from environment
 * Filters out undefined/empty keys
 */
/**
 * Load all available FAL.AI API keys from environment
 * Also checks for FAL_KEY (single key setup)
 */
const loadApiKeys = (): string[] => {
  const keys = [
    process.env.FAL_KEY, // Single key (common setup)
    process.env.FAL_AI_KEY_1,
    process.env.FAL_AI_KEY_2,
    process.env.FAL_AI_KEY_3,
    process.env.FAL_AI_KEY_4,
    process.env.FAL_AI_KEY_5,
  ].filter((key): key is string => Boolean(key));
  
  return keys;
};

const API_KEYS = loadApiKeys();

// Log warning instead of throwing during build
if (API_KEYS.length === 0 && typeof window === 'undefined') {
  console.warn('[API Keys] No FAL.AI API keys found. Set FAL_KEY or FAL_AI_KEY_1 in environment variables.');
}

// ============================================
// ROUND-ROBIN ROTATION
// ============================================

let currentIndex = 0;

/**
 * Get next API key using round-robin strategy
 * Distributes load evenly across all available keys
 * 
 * @returns {string} Next API key in rotation
 * @throws {Error} If no API keys are configured
 */
export function getNextApiKey(): string {
  if (API_KEYS.length === 0) {
    throw new Error('No FAL.AI API keys configured. Please set FAL_KEY or FAL_AI_KEY_1 environment variable.');
  }
  
  const key = API_KEYS[currentIndex];
  currentIndex = (currentIndex + 1) % API_KEYS.length;
  
  // SECURITY: Never log the actual key value
  logger.debug(`Using key #${currentIndex + 1}/${API_KEYS.length}`);
  
  return key;
}

/**
 * Get total number of available API keys
 * Useful for monitoring and capacity planning
 */
export function getKeyCount(): number {
  return API_KEYS.length;
}

/**
 * Get current key index (for debugging)
 * Does NOT return the actual key value
 */
export function getCurrentKeyIndex(): number {
  return currentIndex;
}

// ============================================
// HEALTH TRACKING (Future Enhancement)
// ============================================

/**
 * Track API key health and rate limit status
 * Can be used to skip unhealthy keys in future versions
 */
interface KeyHealth {
  index: number;
  lastUsed: Date;
  failureCount: number;
  rateLimited: boolean;
  rateLimitResetAt?: Date;
}

const keyHealthMap = new Map<number, KeyHealth>();

/**
 * Mark a key as rate limited
 * Future: Implement automatic key skipping
 */
export function markKeyAsRateLimited(keyIndex: number, resetAt: Date) {
  keyHealthMap.set(keyIndex, {
    index: keyIndex,
    lastUsed: new Date(),
    failureCount: 0,
    rateLimited: true,
    rateLimitResetAt: resetAt,
  });
  
  logger.warn(`Key #${keyIndex} rate limited until ${resetAt.toISOString()}`);
}

/**
 * Mark a key as healthy
 */
export function markKeyAsHealthy(keyIndex: number) {
  keyHealthMap.set(keyIndex, {
    index: keyIndex,
    lastUsed: new Date(),
    failureCount: 0,
    rateLimited: false,
  });
}

/**
 * Get key health status
 */
export function getKeyHealth(keyIndex: number): KeyHealth | undefined {
  return keyHealthMap.get(keyIndex);
}

/**
 * Reset all key health tracking
 */
export function resetKeyHealth() {
  keyHealthMap.clear();
}


