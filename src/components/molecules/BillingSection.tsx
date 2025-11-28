/**
import { createScopedLogger } from '@/lib/logger';
const logger = createScopedLogger('BillingSection');

 * BillingSection Component
 *
 * Subscription and billing information.
 * Displays current plan, payment method, billing history.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  CreditCard,
  Calendar,
  DollarSign,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { useCreditStore } from '@/store/creditStore';

interface BillingInfo {
  plan: string;
  billingCycle: string;
  nextBillingDate: string;
  amount: string;
}

export function BillingSection() {
  const { credits } = useCreditStore();
  const [billing, setBilling] = useState<BillingInfo>({
    plan: 'Free',
    billingCycle: 'N/A',
    nextBillingDate: 'N/A',
    amount: '$0.00',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // In a real app, fetch from subscriptions table
        // For now, show free plan info
        setBilling({
          plan: 'Free',
          billingCycle: 'Monthly',
          nextBillingDate: 'N/A',
          amount: '$0.00',
        });
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
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading billing info...</p>
        </div>
      </div>
    );
  }

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        '10 credits/month',
        '5 AI requests/min',
        '1GB storage',
        'Basic support',
      ],
      current: billing.plan === 'Free',
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      features: [
        '500 credits/month',
        '50 AI requests/min',
        '50GB storage',
        'Priority support',
        'Advanced features',
      ],
      current: billing.plan === 'Pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: [
        'Unlimited credits',
        'Unlimited AI requests',
        'Unlimited storage',
        '24/7 support',
        'Custom integrations',
        'API access',
      ],
      current: billing.plan === 'Enterprise',
    },
  ];

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
          <p className="text-3xl font-bold text-white">{billing.plan}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-medium text-white/60">
              Available Credits
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">{credits}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-medium text-white/60">
              Next Billing
            </h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {billing.nextBillingDate}
          </p>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-white">
          Available Plans
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-6 backdrop-blur-sm transition-all hover:scale-105 ${
                plan.current
                  ? 'border-purple-500/40 bg-purple-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-xs font-semibold text-white">
                  Popular
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1 text-xs font-semibold text-white">
                  Current Plan
                </div>
              )}
              <div className="mb-4">
                <h4 className="mb-2 text-xl font-bold text-white">
                  {plan.name}
                </h4>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-white/60">{plan.period}</span>
                </div>
              </div>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 text-purple-400">✓</span>
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.current}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  plan.current
                    ? 'cursor-not-allowed bg-white/10 text-white/40'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                }`}
              >
                {plan.current ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Payment Method</h3>
          <button className="text-sm text-purple-400 hover:text-purple-300">
            Add New
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">No payment method</p>
              <p className="text-xs text-white/60">Add a card to upgrade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Billing History
          </h3>
          <button className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300">
            <span>View All</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-white/60">No billing history yet</p>
          <p className="mt-2 text-sm text-white/40">
            Invoices will appear here when you upgrade
          </p>
        </div>
      </div>
    </div>
  );
}

export default BillingSection;


