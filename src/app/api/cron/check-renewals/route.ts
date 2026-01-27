/**
 * Cron Job: Check Subscription Renewals
 * 
 * Checks for expired subscriptions and sends renewal reminders
 * Should be called once daily via Vercel Cron
 * 
 * @route GET /api/cron/check-renewals
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // 🔒 SECURITY: CRON_SECRET is REQUIRED - no bypass allowed
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!cronSecret) {
      console.error('[Cron/check-renewals] CRON_SECRET not configured - denying request');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Cron/check-renewals] Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Cron/check-renewals] Starting subscription renewal check');

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Find users with subscriptions expiring in next 3 days
    const { data: expiringUsers, error: expiringError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, subscription_plan, subscription_renewal_date')
      .eq('subscription_status', 'active')
      .neq('subscription_plan', 'free')
      .lt('subscription_renewal_date', threeDaysFromNow.toISOString())
      .gt('subscription_renewal_date', now.toISOString());

    if (expiringError) {
      console.error('[Cron/check-renewals] Error fetching expiring users:', expiringError);
    } else {
      // Send reminder notifications
      for (const user of (expiringUsers || [])) {
        await supabaseAdmin
          .from('notifications')
          .upsert({
            user_id: user.id,
            type: 'subscription_reminder',
            title: 'Subscription Renewing Soon',
            message: `Your ${user.subscription_plan} subscription will renew on ${new Date(user.subscription_renewal_date).toLocaleDateString()}.`,
            metadata: { 
              plan: user.subscription_plan, 
              renewal_date: user.subscription_renewal_date 
            },
          }, {
            onConflict: 'user_id,type',
            ignoreDuplicates: false
          });
      }
      console.log(`[Cron/check-renewals] Sent ${expiringUsers?.length || 0} renewal reminders`);
    }

    // Find expired subscriptions that haven't been downgraded
    const { data: expiredUsers, error: expiredError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, subscription_plan')
      .eq('subscription_status', 'active')
      .neq('subscription_plan', 'free')
      .lt('subscription_renewal_date', now.toISOString());

    if (expiredError) {
      console.error('[Cron/check-renewals] Error fetching expired users:', expiredError);
    } else {
      // Downgrade expired users to free plan
      for (const user of (expiredUsers || [])) {
        console.log(`[Cron/check-renewals] Downgrading expired user: ${user.id}`);
        
        // Update profile
        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_plan: 'free',
            subscription_status: 'expired',
            subscription_renewal_date: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        // Reset credits to free tier
        await supabaseAdmin
          .from('user_credits')
          .update({
            balance: 10, // Free tier credits
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);

        // Send notification
        await supabaseAdmin
          .from('notifications')
          .insert({
            user_id: user.id,
            type: 'subscription_expired',
            title: 'Subscription Expired',
            message: 'Your subscription has expired. You have been downgraded to the free plan with 10 credits.',
            metadata: { previous_plan: user.subscription_plan },
          });
      }
      console.log(`[Cron/check-renewals] Downgraded ${expiredUsers?.length || 0} expired users`);
    }

    return NextResponse.json({
      success: true,
      reminders_sent: expiringUsers?.length || 0,
      users_downgraded: expiredUsers?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Cron/check-renewals] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// Also support POST for flexibility
export const POST = GET;
