import React from 'react';
import { Sparkles } from 'lucide-react';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';

/**
 * CTASection - Final call-to-action
 * Glassmorphic card with strong visual appeal
 */
export function CTASection() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* CTA Card */}
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent p-12 backdrop-blur-xl lg:p-16">
          {/* Background Glow */}
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex rounded-2xl bg-purple-500/20 p-4">
              <Sparkles className="h-8 w-8 text-purple-300" />
            </div>

            {/* Heading */}
            <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
                Jewelry Photography?
              </span>
            </h2>

            {/* Description */}
            <p className="mb-8 text-lg text-white/70 lg:text-xl">
              Join thousands of jewelers creating professional product photos
              with AI.
              <br />
              Start for free, no credit card required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PrimaryButton href="/studio" size="lg" icon>
                Start Creating Now
              </PrimaryButton>
              <PrimaryButton href="/gallery" size="lg" variant="ghost">
                View Examples
              </PrimaryButton>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Free to start</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>No credit card</span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
