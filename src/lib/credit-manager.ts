/**
 * Credit Manager
 * 
 * Atomic credit operations with reserve/confirm/refund pattern
 * Integrates with Supabase RPC functions
 */

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { sendCreditsLowEmail } from './email/email-service';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('CreditManager');

/**
 * Detect if running in worker context (no request scope)
 */
function isWorkerContext(): boolean {
  // Simple check: if we're in Node.js and not in a Next.js request
  return typeof window === 'undefined' && !process.env.NEXT_RUNTIME;
}

// ============================================
// TYPES
// ============================================

export interface CreditReservation {
  transactionId: string;
  amount: number;
  operationType: string;
}

export interface UserCredits {
  balance: number;
  reserved: number;
  available: number;
  totalEarned: number;
  totalSpent: number;
}

// ============================================
// RESERVE CREDIT
// ============================================

/**
 * Reserve credits for an AI operation
 * Must be called BEFORE submitting job to queue
 * 
 * @param userId - User ID
 * @param operationType - AI operation type
 * @param jobId - BullMQ job ID (optional)
 * @returns Transaction ID for confirm/refund
 */
export async function reserveCredit(
  userId: string,
  operationType: string,
  jobId?: string
): Promise<CreditReservation> {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('reserve_credit', {
    p_user_id: userId,
    p_operation_type: operationType,
    p_job_id: jobId || null,
  } as any);

  if (error) {
    logger.error('Reserve failed:', error);
    throw new Error(error.message || 'Failed to reserve credits');
  }

  // Get operation cost
  const { data: costData } = await supabase
    .from('operation_costs')
    .select('cost')
    .eq('operation_type', operationType)
    .single();

  return {
    transactionId: data as string,
    amount: (costData as any)?.cost || 0,
    operationType,
  };
}

// ============================================
// CONFIRM CREDIT
// ============================================

/**
 * Confirm credit deduction after successful job completion
 * 
 * @param transactionId - Transaction ID from reserve
 * @param userId - Optional user ID for email notification check
 */
export async function confirmCredit(transactionId: string, userId?: string): Promise<void> {
  const supabase = isWorkerContext() 
    ? createServiceClient() 
    : await createClient();
  
  const { error } = await supabase.rpc('confirm_credit', {
    p_transaction_id: transactionId,
  } as any);

  if (error) {
    logger.error('Confirm failed:', error);
    throw new Error(error.message || 'Failed to confirm credits');
  }

  logger.info(`Confirmed transaction ${transactionId}`);

  // Check if credits are low and send email if needed
  if (userId) {
    try {
      const credits = await getUserCredits(userId);
      const LOW_CREDIT_THRESHOLD = 5;
      
      // Send email if credits dropped to or below threshold
      if (credits.balance <= LOW_CREDIT_THRESHOLD) {
        // Get user email
        const { data: userData } = await supabase.auth.admin.getUserById(userId);
        
        if (userData.user?.email) {
          // Fire and forget - don't block on email
          sendCreditsLowEmail({
            userEmail: userData.user.email,
            userName: userData.user.user_metadata?.name,
            creditsRemaining: credits.balance,
          }).catch((error) => {
            logger.error('Failed to send low credits email:', error);
          });
          
          logger.info(`Sent low credits email to user`);
        }
      }
    } catch (emailError) {
      logger.error('Email notification error:', emailError);
      // Don't throw - email failure shouldn't break credit confirm
    }
  }
}

// ============================================
// REFUND CREDIT
// ============================================

/**
 * Refund reserved credits if job fails
 * 
 * @param transactionId - Transaction ID from reserve
 */
export async function refundCredit(transactionId: string): Promise<void> {
  const supabase = isWorkerContext() 
    ? createServiceClient() 
    : await createClient();
  
  const { error } = await supabase.rpc('refund_credit', {
    p_transaction_id: transactionId,
  } as any);

  if (error) {
    logger.error('Refund failed:', error);
    throw new Error(error.message || 'Failed to refund credits');
  }

  logger.info(`Refunded transaction ${transactionId}`);
}

// ============================================
// GET USER CREDITS
// ============================================

/**
 * Get user's credit balance
 * 
 * @param userId - User ID
 */
export async function getUserCredits(userId: string): Promise<UserCredits> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    // User doesn't have credits record yet, return defaults
    return {
      balance: 500,
      reserved: 0,
      available: 500,
      totalEarned: 500,
      totalSpent: 0,
    };
  }

  return {
    balance: (data as any).balance,
    reserved: (data as any).reserved,
    available: (data as any).balance - (data as any).reserved,
    totalEarned: (data as any).total_earned,
    totalSpent: (data as any).total_spent,
  };
}

/**
 * Get available credits (balance - reserved)
 * 
 * @param userId - User ID
 */
export async function getAvailableCredits(userId: string): Promise<number> {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_available_credits', {
    p_user_id: userId,
  } as any);

  if (error) {
    logger.error('Get available credits failed:', error);
    return 0;
  }

  return data as number;
}

// ============================================
// GET OPERATION COST
// ============================================

/**
 * Get cost for an operation type
 * 
 * @param operationType - AI operation type
 */
export async function getOperationCost(operationType: string): Promise<number> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('operation_costs')
    .select('cost')
    .eq('operation_type', operationType)
    .single();

  if (error || !data) {
    logger.error('Get operation cost failed:', error);
    return 0;
  }

  return (data as any).cost;
}

