/**
 * BillingSection Component
 *
 * Subscription and billing management with Creem.io integration.
 * Displays current plan, upgrade options, and payment management.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CreemCheckout, CreemPortal } from '@creem_io/nextjs';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  ExternalLink,
  Sparkles,
  Check,
  Zap,
  Crown,
  Building,
} from 'lucide-react';
import { useCreditStore } from '@/store/creditStore';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('BillingSection');

// Plan type for subscription levels
type PlanType = 'free' | 'basic' | 'studio' | 'pro' | 'founder' | 'enterprise';

interface BillingInfo {
  plan: PlanType;
  status: 'active' | 'canceled' | 'expired' | 'trialing' | null;
  customerId: string | null;
  nextBillingDate: string | null;
}

// Plan configurations - REPLACE WITH YOUR CREEM PRODUCT IDs
const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    productId: 'prod_REPLACE_WITH_BASIC_ID',
    price: 29,
    originalPrice: 39,
    period: '/month',
    credits: 100,
    icon: CreditCard,
    color: 'from-blue-500 to-cyan-500',
    features: [
      '100 credits/month (+5 bonus)',
      '3 concurrent requests',
      '10GB storage',
      'Email support',
      '30-day history',
    ],
  },
  studio: {
    id: 'studio',
    name: 'Studio',
    productId: 'prod_REPLACE_WITH_STUDIO_ID',
    price: 79,
    originalPrice: 119,
    period: '/month',
    credits: 300,
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    features: [
      '300 credits/month (+5 bonus)',
      '5 concurrent requests',
      '25GB storage',
      'Priority support',
      'Unlimited history',
      'Batch processing',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    productId: 'prod_REPLACE_WITH_PRO_ID',
    price: 199,
    originalPrice: 249,
    period: '/month',
    credits: 750,
    icon: Crown,
    color: 'from-amber-500 to-orange-500',
    popular: true,
    features: [
      '750 credits/month (+5 bonus)',
      '10 concurrent requests',
      '100GB storage',
      'Priority support',
      'API access',
      'Custom presets',
    ],
  },
  founder: {
    id: 'founder',
    name: 'Founder',
    productId: 'prod_REPLACE_WITH_FOUNDER_ID',
    price: 129,
    originalPrice: 249,
    period: '/month',
    credits: 500,
    icon: Crown,
    color: 'from-orange-500 to-red-500',
    limited: true,
    features: [
      '500 credits/month (+5 bonus)',
      '10 concurrent requests',
      '100GB storage',
      'Founder badge',
      'Early access features',
      'Priority support',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    productId: 'prod_REPLACE_WITH_ENTERPRISE_ID',
    price: 499,
    originalPrice: 999,
    period: '/month',
    credits: 999999,
    icon: Building,
    color: 'from-emerald-500 to-teal-500',
    features: [
      'Unlimited credits (+5 bonus)',
      '25 concurrent requests',
      '500GB storage',
      '24/7 dedicated support',
      'Full API access',
      'Custom integrations',
      'White-label options',
    ],
  },
};

export function BillingSection() {
  const { credits } = useCreditStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [billing, setBilling] = useState<BillingInfo>({
    plan: 'free',
    status: null,
    customerId: null,
    nextBillingDate: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        setUserId(user.id);
        setUserEmail(user.email || null);

        // Fetch subscription info from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_plan, subscription_status, creem_customer_id')
          .eq('id', user.id)
          .single();

        if (profile) {
          const profileData = profile as {
            subscription_plan?: string | null;
            subscription_status?: string | null;
            creem_customer_id?: string | null;
          };
          
          setBilling({
            plan: (profileData.subscription_plan as PlanType) || 'free',
            status: profileData.subscription_status as BillingInfo['status'] || null,
            customerId: profileData.creem_customer_id || null,
            nextBillingDate: null, // Could be fetched from Creem API
          });
        }
      } catch (error) {
        logger.error('Error fetching billing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="text-sm text-white/70">Loading billing info...</p>
        </div>
      </div>
    );
  }

  const currentPlan = billing.plan;
  const isActive = billing.status === 'active' || billing.status === 'trialing';

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-white">
          Billing & Subscription
        </h2>
        <p className="text-white/60">Manage your plan and payment methods</p>
      </div>

      {/* Current Plan Overview */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-6 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-medium text-white/60">Current Plan</h3>
          </div>
          <p className="text-3xl font-bold text-white capitalize">{currentPlan}</p>
          {isActive && (
            <span className="mt-2 inline-block rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
              Active
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-medium text-white/60">
              Available Credits
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {credits === 999999 ? 'Unlimited' : credits.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-medium text-white/60">
              Status
            </h3>
          </div>
          <p className="text-3xl font-bold text-white capitalize">
            {billing.status || 'Free'}
          </p>
        </div>
      </div>

      {/* Upgrade Plans */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          {currentPlan === 'free' ? 'Upgrade Your Plan' : 'Available Plans'}
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Object.values(PLANS).map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;
            const isPopular = 'popular' in plan && plan.popular;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-5 backdrop-blur-sm transition-all hover:scale-[1.02] ${
                  isCurrent
                    ? 'border-purple-500/40 bg-purple-500/10'
                    : isPopular
                    ? 'border-purple-500/30 bg-white/5 ring-2 ring-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    Current
                  </div>
                )}
                
                {isPopular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-xs font-semibold text-white">
                    Popular
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${plan.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-white">${plan.price}</span>
                      <span className="ml-1 text-white/60">{plan.period}</span>
                    </div>
                  </div>
                </div>

                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  billing.customerId ? (
                    <CreemPortal customerId={billing.customerId}>
                      <button className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                        Manage Subscription
                      </button>
                    </CreemPortal>
                  ) : (
                    <button 
                      disabled 
                      className="w-full rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white/40 cursor-not-allowed"
                    >
                      Current Plan
                    </button>
                  )
                ) : (
                  <CreemCheckout
                    productId={plan.productId}
                    successUrl="/profile?tab=billing&success=true"
                    customer={userEmail ? { email: userEmail } : undefined}
                    referenceId={userId || undefined}
                    metadata={{ 
                      userId: userId,
                      plan: plan.id,
                      source: 'billing-page'
                    }}
                  >
                    <button className={`w-full rounded-lg bg-gradient-to-r ${plan.color} px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity`}>
                      {currentPlan === 'free' ? 'Upgrade Now' : 'Switch Plan'}
                    </button>
                  </CreemCheckout>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Free Plan Info */}
      {currentPlan === 'free' && (
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">Free Plan - Welcome Credits</h4>
              <p className="mt-1 text-white/60">
                You have 5 welcome credits. When you subscribe, these credits will be added as a bonus!
              </p>
              <ul className="mt-3 space-y-1 text-sm text-white/50">
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3" /> 5 welcome credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3" /> 2 concurrent requests
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3" /> 5GB storage
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3 w-3" /> +5 bonus when you subscribe!
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Manage Subscription */}
      {billing.customerId && isActive && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Manage Subscription
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Update payment methods, view invoices, or cancel subscription
              </p>
            </div>
            <CreemPortal customerId={billing.customerId}>
              <button className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                <ExternalLink className="h-4 w-4" />
                Customer Portal
              </button>
            </CreemPortal>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingSection;
