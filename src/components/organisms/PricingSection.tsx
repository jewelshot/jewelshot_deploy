'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';

/**
 * PricingSection - Pricing plans
 * Clear value proposition
 */
export function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out Jewelshot',
      features: [
        '5 images per month',
        'Basic AI enhancement',
        'Standard quality exports',
        'Community support',
        '7-day history',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'per month',
      description: 'For serious jewelry businesses',
      features: [
        'Unlimited images',
        'Advanced AI enhancement',
        'High-resolution exports',
        'Priority support',
        'Unlimited history',
        'Custom watermarks',
        'Batch processing',
        'API access',
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large teams and agencies',
      features: [
        'Everything in Pro',
        'Custom AI models',
        'Dedicated support',
        'SLA guarantee',
        'Team collaboration',
        'White-label options',
        'Custom integrations',
        'Training & onboarding',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden px-6 py-24 lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            Simple,{' '}
            <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Start free, upgrade when you need more. No hidden fees, cancel
            anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="animate-in fade-in slide-in-from-bottom-4 group relative"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/20 px-4 py-1 backdrop-blur-xl">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    <span className="text-xs font-semibold text-purple-300">
                      MOST POPULAR
                    </span>
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative h-full overflow-hidden rounded-2xl border p-8 backdrop-blur-xl transition-all duration-300 ${
                  plan.popular
                    ? 'scale-105 border-purple-500/30 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-purple-500/20 hover:bg-white/10'
                }`}
              >
                {/* Plan Name */}
                <h3 className="mb-2 text-2xl font-bold text-white">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-white/60">/{plan.period}</span>
                </div>

                {/* Description */}
                <p className="mb-6 text-white/60">{plan.description}</p>

                {/* CTA Button */}
                <PrimaryButton
                  href="/auth/signup"
                  className="mb-8 w-full"
                  size="lg"
                  variant={plan.popular ? 'primary' : 'secondary'}
                >
                  {plan.cta}
                </PrimaryButton>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover glow effect */}
                {plan.popular && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/20 to-transparent opacity-50 blur-xl" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/60">
            14-day money-back guarantee • No credit card required for free
            plan
          </p>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />
    </section>
  );
}
