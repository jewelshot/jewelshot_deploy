/**
 * Creem.io Webhook Handler
 * 
 * Handles payment events:
 * - checkout.completed: Initial purchase
 * - subscription.paid: Recurring payment success
 * - subscription.canceled: User canceled
 * - subscription.expired: Payment failed
 * 
 * Updates Supabase user credits and subscription status.
 */

import { Webhook } from '@creem_io/nextjs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Plan configurations - credits per plan
const PLAN_CREDITS: Record<string, number> = {
  'free': 10,
  'pro': 500,
  'enterprise': 999999, // Unlimited
};

// Grant user access - called on successful payment
async function grantAccess(
  userId: string, 
  email: string, 
  productName: string,
  renewalDate?: string | null
) {
  console.log(`[Creem Webhook] Granting access to user ${userId} (${email}) for ${productName}`);
  
  try {
    // Determine plan from product name
    const planName = productName.toLowerCase().includes('enterprise') 
      ? 'enterprise' 
      : productName.toLowerCase().includes('pro') 
        ? 'pro' 
        : 'free';
    
    const credits = PLAN_CREDITS[planName] || PLAN_CREDITS['pro'];
    
    // Calculate renewal date (default: 30 days from now if not provided)
    const nextRenewal = renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Update user's subscription status and credits
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_plan: planName,
        subscription_status: 'active',
        subscription_renewal_date: nextRenewal,
        credits: credits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (error) {
      console.error('[Creem Webhook] Error updating profile:', error);
      throw error;
    }
    
    // Log the transaction
    await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: userId,
        plan: planName,
        action: 'activated',
        credits_granted: credits,
        created_at: new Date().toISOString(),
      });
    
    // Create subscription renewed notification
    await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'subscription_renewed',
        title: 'Subscription Activated',
        message: `Your ${planName} plan is now active with ${credits} credits. Next renewal: ${new Date(nextRenewal).toLocaleDateString()}.`,
        metadata: { plan: planName, credits, renewal_date: nextRenewal },
      });
    
    console.log(`[Creem Webhook] Successfully granted ${planName} plan with ${credits} credits to ${email}`);
  } catch (error) {
    console.error('[Creem Webhook] Error granting access:', error);
    throw error;
  }
}

// Revoke user access - called on cancellation or expiry
async function revokeAccess(userId: string, email: string, reason: 'canceled' | 'expired' = 'canceled') {
  console.log(`[Creem Webhook] Revoking access for user ${userId} (${email}) - ${reason}`);
  
  try {
    // Downgrade to free plan
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_plan: 'free',
        subscription_status: reason,
        subscription_renewal_date: null,
        credits: PLAN_CREDITS['free'],
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (error) {
      console.error('[Creem Webhook] Error revoking access:', error);
      throw error;
    }
    
    // Log the transaction
    await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: userId,
        plan: 'free',
        action: 'downgraded',
        credits_granted: PLAN_CREDITS['free'],
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
          ? 'Your subscription has expired. You have been downgraded to the free plan.'
          : 'Your subscription has been canceled. You have been downgraded to the free plan.',
        metadata: { reason },
      });
    
    console.log(`[Creem Webhook] Successfully revoked access for ${email}, downgraded to free`);
  } catch (error) {
    console.error('[Creem Webhook] Error revoking access:', error);
    throw error;
  }
}

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  
  // Called when checkout is completed (first payment)
  onCheckoutCompleted: async ({ customer, product, metadata }) => {
    console.log(`[Creem Webhook] Checkout completed: ${customer?.email} purchased ${product?.name}`);
    
    const userId = metadata?.referenceId as string;
    
    if (userId && customer?.email && product?.name) {
      await grantAccess(userId, customer.email, product.name);
    }
  },
  
  // Called when subscription payment succeeds (recurring)
  onSubscriptionPaid: async ({ customer, product, metadata }) => {
    console.log(`[Creem Webhook] Subscription paid: ${customer?.email}`);
    
    const userId = metadata?.referenceId as string;
    
    if (userId && customer?.email && product?.name) {
      await grantAccess(userId, customer.email, product.name);
    }
  },
  
  // Simplified grant access callback
  onGrantAccess: async ({ customer, metadata, product }) => {
    const userId = metadata?.referenceId as string;
    
    if (userId && customer?.email) {
      await grantAccess(userId, customer.email, product?.name || 'Pro');
    }
  },
  
  // Simplified revoke access callback
  onRevokeAccess: async ({ customer, metadata }) => {
    const userId = metadata?.referenceId as string;
    if (userId && customer?.email) {
      await revokeAccess(userId, customer.email, 'canceled');
    }
  },
  
  // Called when subscription is canceled
  onSubscriptionCanceled: async ({ customer, metadata }) => {
    console.log(`[Creem Webhook] Subscription canceled: ${customer?.email}`);
    
    const userId = metadata?.referenceId as string;
    if (userId && customer?.email) {
      await revokeAccess(userId, customer.email, 'canceled');
    }
  },
  
  // Called when subscription expires (payment failed)
  onSubscriptionExpired: async ({ customer, metadata }) => {
    console.log(`[Creem Webhook] Subscription expired: ${customer?.email}`);
    
    const userId = metadata?.referenceId as string;
    if (userId && customer?.email) {
      await revokeAccess(userId, customer.email, 'expired');
    }
  },
});

