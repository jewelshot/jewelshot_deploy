/**
 * API Key Manager
 * 
 * Round-robin load balancing for multiple FAL.AI API keys
 * SECURITY: Keys never logged, server-side only
 */

// ============================================
// API KEY POOL
// ============================================

/**
 * Load all available FAL.AI API keys from environment
 * Filters out undefined/empty keys
 */
const API_KEYS = [
  process.env.FAL_AI_KEY_1,
  process.env.FAL_AI_KEY_2,
  process.env.FAL_AI_KEY_3,
  process.env.FAL_AI_KEY_4,
  process.env.FAL_AI_KEY_5,
].filter((key): key is string => Boolean(key));

if (API_KEYS.length === 0) {
  throw new Error('No FAL.AI API keys found. Set at least FAL_AI_KEY_1 in environment variables.');
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
 */
export function getNextApiKey(): string {
  const key = API_KEYS[currentIndex];
  currentIndex = (currentIndex + 1) % API_KEYS.length;
  
  // SECURITY: Never log the actual key value
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Keys] Using key #${currentIndex + 1}/${API_KEYS.length}`);
  }
  
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
  
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[API Keys] Key #${keyIndex} rate limited until ${resetAt.toISOString()}`);
  }
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

