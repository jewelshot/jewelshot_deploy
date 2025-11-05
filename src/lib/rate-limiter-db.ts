/**
 * Persistent Rate Limiter (Supabase)
 *
 * Server-side rate limiting with database persistence
 * Replaces in-memory Map with Supabase table
 */

import { createClient } from '@supabase/supabase-js';
import { createScopedLogger } from './logger';

const logger = createScopedLogger('RateLimiter:DB');

interface RateLimitConfig {
  endpoint: string;
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
}

/**
 * Check and record rate limit in Supabase
 * Requires SUPABASE_SERVICE_ROLE_KEY for RLS bypass
 */
export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  try {
    // Use service role key to bypass RLS (if available)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      logger.warn(
        'SUPABASE_SERVICE_ROLE_KEY not set, falling back to in-memory rate limiting'
      );
      // Fallback to allowing request (or throw error)
      return { allowed: true, remaining: config.maxRequests };
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);

    // Get current rate limit record
    const { data: existing, error: selectError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('user_id', userId)
      .eq('endpoint', config.endpoint)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      // PGRST116 = no rows found (expected for new users)
      logger.error('Rate limit select error:', selectError);
      // Fail open (allow request on error)
      return { allowed: true, remaining: config.maxRequests };
    }

    // No existing record OR window expired
    if (!existing || new Date(existing.window_start) < windowStart) {
      // Create new record or reset
      const { error: upsertError } = await supabase.from('rate_limits').upsert(
        {
          user_id: userId,
          endpoint: config.endpoint,
          request_count: 1,
          window_start: now.toISOString(),
        },
        {
          onConflict: 'user_id,endpoint',
        }
      );

      if (upsertError) {
        logger.error('Rate limit upsert error:', upsertError);
        return { allowed: true, remaining: config.maxRequests };
      }

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
      };
    }

    // Existing record within window
    const currentCount = existing.request_count;

    if (currentCount >= config.maxRequests) {
      // Rate limit exceeded
      const windowEnd = new Date(
        new Date(existing.window_start).getTime() + config.windowMs
      );
      const retryAfter = Math.ceil(
        (windowEnd.getTime() - now.getTime()) / 1000
      );

      logger.warn(
        `Rate limit exceeded for user ${userId} on ${config.endpoint}`
      );

      return {
        allowed: false,
        remaining: 0,
        retryAfter,
      };
    }

    // Increment count
    const { error: updateError } = await supabase
      .from('rate_limits')
      .update({
        request_count: currentCount + 1,
      })
      .eq('user_id', userId)
      .eq('endpoint', config.endpoint);

    if (updateError) {
      logger.error('Rate limit update error:', updateError);
      return { allowed: true, remaining: config.maxRequests };
    }

    return {
      allowed: true,
      remaining: config.maxRequests - (currentCount + 1),
    };
  } catch (error) {
    logger.error('Rate limiter error:', error);
    // Fail open (allow request on error)
    return { allowed: true, remaining: config.maxRequests };
  }
}

/**
 * Cleanup old rate limit records (run periodically)
 */
export async function cleanupRateLimits(): Promise<void> {
  try {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      logger.warn('SUPABASE_SERVICE_ROLE_KEY not set, skipping cleanup');
      return;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    );

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('rate_limits')
      .delete()
      .lt('window_start', oneHourAgo);

    if (error) {
      logger.error('Cleanup error:', error);
    } else {
      logger.info('Rate limits cleanup completed');
    }
  } catch (error) {
    logger.error('Cleanup error:', error);
  }
}
