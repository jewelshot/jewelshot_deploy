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
      id: 'basic',
      name: 'Basic',
      price: '$29',
      originalPrice: '$39',
      discount: '25%',
      savings: 10,
      period: 'per month',
      description: 'Entry level for small shops',
      status: 'Giriş',
      credits: '100',
      features: [
        '100 credits/month',
        '3 concurrent requests',
        '10GB storage',
        'Email support',
        '30-day history',
        'Standard quality',
      ],
      cta: 'Start Basic',
      popular: false,
      highlight: false,
      badge: null,
    },
    {
      id: 'studio',
      name: 'Studio',
      price: '$79',
      originalPrice: '$119',
      discount: '33%',
      savings: 40,
      period: 'per month',
      description: 'For designers & creators',
      status: 'Tasarımcı',
      credits: '300',
      features: [
        '300 credits/month',
        '5 concurrent requests',
        '25GB storage',
        'Priority support',
        'Unlimited history',
        'High quality',
        'Batch processing',
      ],
      cta: 'Start Studio',
      popular: false,
      highlight: false,
      badge: null,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$199',
      originalPrice: '$249',
      discount: '20%',
      savings: 50,
      period: 'per month',
      description: 'For professional businesses',
      status: 'Profesyonel',
      credits: '750',
      features: [
        '750 credits/month',
        '10 concurrent requests',
        '100GB storage',
        'Priority support',
        'Unlimited history',
        'Maximum quality',
        'Batch processing',
        'API access',
        'Custom presets',
      ],
      cta: 'Start Pro',
      popular: true,
      highlight: true,
      badge: 'STANDARD',
    },
    {
      id: 'founder',
      name: 'Founder',
      price: '$129',
      originalPrice: '$249',
      discount: '48%',
      savings: 120,
      period: 'per month',
      description: 'Limited spots for early supporters',
      status: 'Kurucu Üye',
      credits: '500',
      features: [
        '500 credits/month',
        '10 concurrent requests',
        '100GB storage',
        'Priority support',
        'Unlimited history',
        'Maximum quality',
        'API access',
        'Founder badge',
        'Early access features',
      ],
      cta: 'Claim Founder Spot',
      popular: false,
      highlight: true,
      badge: '🔥 ONLY 20 SPOTS',
      limited: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$499',
      originalPrice: '$999',
      discount: '50%',
      savings: 500,
      period: 'per month',
      description: 'For agencies & large teams',
      status: 'Kurumsal',
      credits: 'Unlimited',
      features: [
        'Unlimited credits',
        '25 concurrent requests',
        '500GB storage',
        '24/7 dedicated support',
        'Unlimited history',
        'Maximum quality',
        'Full API access',
        'Custom integrations',
        'White-label options',
        'Team management',
        'Dedicated account manager',
      ],
      cta: 'Contact Sales',
      popular: false,
      highlight: false,
      badge: '5 COMPANIES',
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
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Transparent Pricing
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Start free, upgrade when you need more. No hidden fees, cancel
            anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className="animate-in fade-in slide-in-from-bottom-4 group relative"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2">
                  <div className={`flex items-center gap-1 rounded-full border px-3 py-1 backdrop-blur-xl whitespace-nowrap ${
                    plan.id === 'founder' 
                      ? 'border-orange-500/30 bg-orange-500/20' 
                      : plan.popular 
                      ? 'border-amber-500/30 bg-amber-500/20'
                      : 'border-white/20 bg-white/10'
                  }`}>
                    {plan.popular && <Sparkles className="h-3 w-3 text-amber-400" />}
                    <span className={`text-xs font-semibold ${
                      plan.id === 'founder' ? 'text-orange-300' : plan.popular ? 'text-amber-300' : 'text-white/70'
                    }`}>
                      {plan.badge}
                    </span>
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative h-full overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-300 ${
                  plan.highlight
                    ? 'border-amber-500/30 bg-white/10 ring-2 ring-amber-500/20'
                    : 'border-white/10 bg-white/5 hover:border-amber-500/20 hover:bg-white/10'
                }`}
              >
                {/* Plan Name & Discount */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {plan.name}
                  </h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    plan.id === 'founder' 
                      ? 'bg-orange-500/20 text-orange-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    -{plan.discount}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm text-white/60">/{plan.period}</span>
                </div>
                
                {/* Original Price */}
                <div className="mb-3">
                  <span className="text-sm text-white/40 line-through">
                    {plan.originalPrice}
                  </span>
                </div>

                {/* Savings Badge */}
                <div className={`mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                  plan.id === 'founder' 
                    ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30' 
                    : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20'
                }`}>
                  <span className="text-lg">💰</span>
                  <span className={`text-sm font-bold ${
                    plan.id === 'founder' ? 'text-orange-400' : 'text-green-400'
                  }`}>
                    YOU SAVE: ${plan.savings}
                  </span>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm text-white/60">{plan.description}</p>

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
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Hover glow effect */}
                {plan.highlight && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/20 to-transparent opacity-50 blur-xl" />
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
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-amber-500/5 blur-3xl" />
    </section>
  );
}
