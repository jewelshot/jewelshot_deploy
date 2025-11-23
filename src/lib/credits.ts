/**
 * Credit Management Utilities
 * Centralized credit deduction, refund, and check logic
 */

import { createClient } from '@/lib/supabase/server';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('Credits');

export interface CreditCheckResult {
  hasCredits: boolean;
  remaining: number;
  error?: string;
}

export interface CreditDeductResult {
  success: boolean;
  remaining: number;
  error?: string;
}

export interface CreditRefundResult {
  success: boolean;
  remaining: number;
  error?: string;
}

/**
 * Check if user has sufficient credits
 * @param userId - User ID
 * @param required - Required credit amount (default: 1)
 * @returns CreditCheckResult
 */
export async function checkUserCredits(
  userId: string,
  required: number = 1
): Promise<CreditCheckResult> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', userId)
      .single();

    if (error) {
      logger.error('Failed to check credits', { userId, error: error.message });
      return {
        hasCredits: false,
        remaining: 0,
        error: 'Failed to check credits',
      };
    }

    const typedData = data as { credits_remaining: number };
    const hasCredits = typedData.credits_remaining >= required;

    if (!hasCredits) {
      logger.warn('Insufficient credits', {
        userId,
        remaining: typedData.credits_remaining,
        required,
      });
    }

    return {
      hasCredits,
      remaining: typedData.credits_remaining,
    };
  } catch (error) {
    logger.error('Unexpected error checking credits', { userId, error });
    return { hasCredits: false, remaining: 0, error: 'Unexpected error' };
  }
}

/**
 * Deduct credits from user (atomically via RPC)
 * @param userId - User ID
 * @param description - Operation description
 * @param metadata - Optional metadata (prompt, style, etc.)
 * @returns CreditDeductResult
 */
export async function deductUserCredit(
  userId: string,
  description: string = 'AI Generation',
  metadata: Record<string, unknown> = {}
): Promise<CreditDeductResult> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
      'use_credit',
      {
        p_user_id: userId,
        p_description: description,
        p_metadata: metadata,
      }
    );

    if (rpcError) {
      logger.error('RPC use_credit failed', {
        userId,
        error: rpcError.message,
        code: rpcError.code,
      });
      return { success: false, remaining: 0, error: rpcError.message };
    }

    const result = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as {
      success: boolean;
      credits_remaining: number;
      message: string;
    };

    if (!result || !result.success) {
      logger.warn('Credit deduction failed', {
        userId,
        message: result?.message,
        remaining: result?.credits_remaining || 0,
      });
      return {
        success: false,
        remaining: result?.credits_remaining || 0,
        error: result?.message || 'Insufficient credits',
      };
    }

    logger.info('Credit deducted successfully', {
      userId,
      remaining: result.credits_remaining,
      description,
    });

    return {
      success: true,
      remaining: result.credits_remaining,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error deducting credit', {
      userId,
      error: errorMessage,
    });
    return { success: false, remaining: 0, error: errorMessage };
  }
}

/**
 * Refund credits to user (for failed operations)
 * @param userId - User ID
 * @param amount - Amount to refund (default: 1)
 * @param reason - Refund reason
 * @param metadata - Optional metadata
 * @returns CreditRefundResult
 */
export async function refundUserCredit(
  userId: string,
  amount: number = 1,
  reason: string = 'Operation failed',
  metadata: Record<string, unknown> = {}
): Promise<CreditRefundResult> {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rpcData, error: rpcError } = await (supabase as any).rpc(
      'add_credits',
      {
        p_user_id: userId,
        p_amount: amount,
        p_type: 'refund',
        p_description: reason,
        p_metadata: metadata,
      }
    );

    if (rpcError) {
      logger.error('RPC add_credits (refund) failed', {
        userId,
        error: rpcError.message,
      });
      return { success: false, remaining: 0, error: rpcError.message };
    }

    const result = (Array.isArray(rpcData) ? rpcData[0] : rpcData) as {
      success: boolean;
      credits_remaining: number;
      message: string;
    };

    if (!result || !result.success) {
      logger.warn('Credit refund failed', { userId, message: result?.message });
      return {
        success: false,
        remaining: result?.credits_remaining || 0,
        error: result?.message || 'Refund failed',
      };
    }

    logger.info('Credit refunded successfully', {
      userId,
      amount,
      remaining: result.credits_remaining,
      reason,
    });

    return {
      success: true,
      remaining: result.credits_remaining,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown';
    logger.error('Unexpected error refunding credit', {
      userId,
      error: errorMessage,
    });
    return { success: false, remaining: 0, error: errorMessage };
  }
}
