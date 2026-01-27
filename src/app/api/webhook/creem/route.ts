/**
 * Creem.io Webhook Handler
 * 
 * Handles payment events:
 * - checkout.completed: Initial purchase
 * - subscription.paid: Recurring payment success
 * - subscription.canceled: User canceled
 * - subscription.expired: Payment failed
 * 
 * CRITICAL: Uses unified credit system to update BOTH:
 * - user_credits table (used by AI generation)
 * - profiles table (used by UI display)
 * 
 * @see supabase/migrations/20250111_unified_credit_system.sql
 */

import { Webhook } from '@creem_io/nextjs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Plan configurations - credits per plan (BASIC, STUDIO, PRO, FOUNDER, ENTERPRISE)
const PLAN_CREDITS: Record<string, number> = {
  'free': 5,          // Welcome credits only
  'basic': 100,       // $29/month
  'studio': 300,      // $79/month
  'pro': 750,         // $199/month
  'founder': 500,     // $129/month - LIMITED SPOTS
  'enterprise': 999999, // $499/month - Unlimited
};

// Helper to normalize plan name from product name
function normalizePlanName(productName: string): string {
  const lower = productName.toLowerCase();
  if (lower.includes('enterprise')) return 'enterprise';
  if (lower.includes('founder')) return 'founder';
  if (lower.includes('pro')) return 'pro';
  if (lower.includes('studio')) return 'studio';
  if (lower.includes('basic')) return 'basic';
  return 'basic'; // Default to basic for unknown plans
}

// 🔒 SECURITY: Mask email for logging (GDPR compliance)
function maskEmail(email: string | undefined): string {
  if (!email) return '[no-email]';
  const [local, domain] = email.split('@');
  if (!domain) return '[invalid]';
  const masked = local.length > 2 
    ? `${local[0]}***${local[local.length - 1]}` 
    : '***';
  return `${masked}@${domain}`;
}

/**
 * Grant subscription credits using unified RPC function
 * This updates BOTH user_credits and profiles tables atomically
 */
async function grantSubscriptionCredits(
  userId: string, 
  email: string, 
  productName: string,
  renewalDate?: string | null
) {
  // 🔒 SECURITY: Log with masked email (GDPR)
  console.log(`[Creem Webhook] Granting credits to user ${userId.slice(0, 8)}... for ${productName}`);
  
  try {
    // Determine plan from product name using helper
    const planName = normalizePlanName(productName);
    const credits = PLAN_CREDITS[planName] || PLAN_CREDITS['basic'];
    
    // Calculate renewal date (default: 30 days from now if not provided)
    const nextRenewal = renewalDate 
      ? new Date(renewalDate).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Call unified RPC function that updates BOTH tables
    const { data, error } = await supabaseAdmin.rpc('grant_subscription_credits', {
      p_user_id: userId,
      p_plan: planName,
      p_credits: credits,
      p_renewal_date: nextRenewal,
    });
    
    if (error) {
      console.error('[Creem Webhook] RPC grant_subscription_credits failed:', error);
      throw error;
    }
    
    const result = Array.isArray(data) ? data[0] : data;
    
    if (!result?.success) {
      console.error('[Creem Webhook] grant_subscription_credits returned failure:', result);
      throw new Error(result?.message || 'Failed to grant credits');
    }
    
    console.log(`[Creem Webhook] Successfully granted ${credits} credits for ${planName} plan. New balance: ${result.new_balance}`);
    
    // Log the transaction to subscription_history
    await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: userId,
        plan: planName,
        action: 'activated',
        credits_granted: credits,
        metadata: { 
          product_name: productName,
          renewal_date: nextRenewal,
          new_balance: result.new_balance,
        },
        created_at: new Date().toISOString(),
      });
    
    // Create subscription renewed notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'subscription_renewed',
        title: 'Subscription Activated',
        message: `Your ${planName.charAt(0).toUpperCase() + planName.slice(1)} plan is now active with ${credits} credits. Next renewal: ${new Date(nextRenewal).toLocaleDateString()}.`,
        metadata: { plan: planName, credits, renewal_date: nextRenewal },
      });
    
    console.log(`[Creem Webhook] Completed credit grant flow for user ${userId.slice(0, 8)}...`);
    
  } catch (error) {
    console.error('[Creem Webhook] Error granting subscription credits:', error);
    throw error;
  }
}

/**
 * Revoke subscription credits using unified RPC function
 * This downgrades user to free plan in BOTH tables
 */
async function revokeSubscriptionCredits(
  userId: string, 
  email: string, 
  reason: 'canceled' | 'expired' = 'canceled'
) {
  // 🔒 SECURITY: Log with masked data (GDPR)
  console.log(`[Creem Webhook] Revoking subscription for user ${userId.slice(0, 8)}... - ${reason}`);
  
  try {
    // Call unified RPC function
    const { data, error } = await supabaseAdmin.rpc('revoke_subscription_credits', {
      p_user_id: userId,
      p_reason: reason,
    });
    
    if (error) {
      console.error('[Creem Webhook] RPC revoke_subscription_credits failed:', error);
      throw error;
    }
    
    const result = Array.isArray(data) ? data[0] : data;
    
    if (!result?.success) {
      console.error('[Creem Webhook] revoke_subscription_credits returned failure:', result);
      throw new Error(result?.message || 'Failed to revoke credits');
    }
    
    console.log(`[Creem Webhook] Successfully revoked subscription for user ${userId.slice(0, 8)}...`);
    
    // Log the transaction
    await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: userId,
        plan: 'free',
        action: reason === 'expired' ? 'expired' : 'downgraded',
        credits_granted: PLAN_CREDITS['free'],
        metadata: { reason },
        created_at: new Date().toISOString(),
      });
    
    // Create notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type: reason === 'expired' ? 'subscription_expired' : 'subscription_canceled',
        title: reason === 'expired' ? 'Subscription Expired' : 'Subscription Canceled',
        message: reason === 'expired' 
          ? 'Your subscription has expired due to payment failure. You have been downgraded to the free plan with 5 credits.'
          : 'Your subscription has been canceled. You have been downgraded to the free plan with 5 credits.',
        metadata: { reason, credits: PLAN_CREDITS['free'] },
      });
    
  } catch (error) {
    console.error('[Creem Webhook] Error revoking subscription:', error);
    throw error;
  }
}

/**
 * Webhook handler using Creem SDK
 */
export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  
  // ============================================
  // CHECKOUT COMPLETED (First payment)
  // ============================================
  onCheckoutCompleted: async ({ customer, product, metadata, subscription }) => {
    // 🔒 SECURITY: No PII in logs (GDPR)
    console.log(`[Creem Webhook] Checkout completed for product: ${product?.name}`);
    
    const userId = metadata?.referenceId as string;
    
    if (!userId) {
      console.error('[Creem Webhook] No referenceId in metadata!');
      return;
    }
    
    if (!customer?.email) {
      console.error('[Creem Webhook] No customer email!');
      return;
    }
    
    if (!product?.name) {
      console.error('[Creem Webhook] No product name!');
      return;
    }
    
    // Get renewal date from subscription if available
    // Note: Creem SDK uses current_period_end_date
    const renewalDate = (subscription as any)?.current_period_end_date 
      || (subscription as any)?.current_period_end 
      || null;
    
    await grantSubscriptionCredits(userId, customer.email, product.name, renewalDate);
  },
  
  // ============================================
  // SUBSCRIPTION PAID (Recurring payment success)
  // ============================================
  onSubscriptionPaid: async (payload) => {
    const { customer, product, metadata } = payload;
    const subscription = (payload as any).subscription;
    
    // 🔒 SECURITY: No PII in logs (GDPR)
    console.log(`[Creem Webhook] Subscription paid for product: ${product?.name}`);
    
    const userId = metadata?.referenceId as string;
    
    if (!userId || !customer?.email || !product?.name) {
      console.error('[Creem Webhook] Missing required data for subscription paid event');
      return;
    }
    
    // This is a renewal - grant fresh credits
    const renewalDate = subscription?.current_period_end_date 
      || subscription?.current_period_end 
      || null;
    
    await grantSubscriptionCredits(userId, customer.email, product.name, renewalDate);
  },
  
  // ============================================
  // GRANT ACCESS (Generic access grant)
  // ============================================
  onGrantAccess: async (payload) => {
    const { customer, metadata, product } = payload;
    const subscription = (payload as any).subscription;
    
    // 🔒 SECURITY: No PII in logs (GDPR)
    console.log(`[Creem Webhook] Grant access event received`);
    
    const userId = metadata?.referenceId as string;
    
    if (!userId || !customer?.email) {
      console.error('[Creem Webhook] Missing required data for grant access event');
      return;
    }
    
    const renewalDate = subscription?.current_period_end_date 
      || subscription?.current_period_end 
      || null;

    await grantSubscriptionCredits(userId, customer.email, product?.name || 'Pro', renewalDate);
  },
  
  // ============================================
  // REVOKE ACCESS (Generic access revoke)
  // ============================================
  onRevokeAccess: async ({ customer, metadata }) => {
    // 🔒 SECURITY: No PII in logs (GDPR)
    console.log(`[Creem Webhook] Revoke access event received`);
    
    const userId = metadata?.referenceId as string;
    
    if (!userId || !customer?.email) {
      console.error('[Creem Webhook] Missing required data for revoke access event');
      return;
    }
    
    await revokeSubscriptionCredits(userId, customer.email, 'canceled');
  },
  
  // ============================================
  // SUBSCRIPTION CANCELED
  // ============================================
  onSubscriptionCanceled: async ({ customer, metadata }) => {
    // 🔒 SECURITY: No PII in logs (GDPR)
    console.log(`[Creem Webhook] Subscription canceled event received`);
    
    const userId = metadata?.referenceId as string;
    
    if (!userId || !customer?.email) {
      console.error('[Creem Webhook] Missing required data for subscription canceled event');
      return;
    }
    
    await revokeSubscriptionCredits(userId, customer.email, 'canceled');
  },
  
  // ============================================
  // SUBSCRIPTION EXPIRED (Payment failed)
  // ============================================
  onSubscriptionExpired: async ({ customer, metadata }) => {
    // 🔒 SECURITY: No PII in logs (GDPR)
    console.log(`[Creem Webhook] Subscription expired event received`);
    
    const userId = metadata?.referenceId as string;
    
    if (!userId || !customer?.email) {
      console.error('[Creem Webhook] Missing required data for subscription expired event');
      return;
    }
    
    await revokeSubscriptionCredits(userId, customer.email, 'expired');
  },
});
