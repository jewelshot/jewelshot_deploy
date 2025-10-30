import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { GradientText } from '@/components/atoms/GradientText';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';

/**
 * HeroSection - Main landing page hero
 * Eye-catching introduction with CTA
 */
export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        {/* Badge */}
        <div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-2 backdrop-blur-xl"
          style={{
            animation:
              'fadeInDown 600ms cubic-bezier(0.4, 0, 0.2, 1) backwards',
          }}
        >
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-300">
            AI-Powered Jewelry Photography
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
          style={{
            animation:
              'fadeInDown 600ms cubic-bezier(0.4, 0, 0.2, 1) 100ms backwards',
          }}
        >
          Transform Your Jewelry
          <br />
          Into <GradientText>Stunning Visuals</GradientText>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-10 text-lg leading-relaxed text-white/70 sm:text-xl lg:text-2xl"
          style={{
            animation:
              'fadeInDown 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms backwards',
          }}
        >
          Professional AI-powered editing for jewelry brands.
          <br />
          Create magazine-quality product photos in seconds.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{
            animation:
              'fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) 300ms backwards',
          }}
        >
          <PrimaryButton href="/studio" size="lg" icon>
            Start Creating Free
          </PrimaryButton>
          <PrimaryButton href="/gallery" size="lg" variant="secondary">
            View Examples
          </PrimaryButton>
        </div>

        {/* Social Proof */}
        <div
          className="mt-12 flex items-center justify-center gap-8 text-sm text-white/50"
          style={{
            animation:
              'fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) 400ms backwards',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-purple-400 to-purple-600" />
              <div className="h-8 w-8 rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-pink-400 to-pink-600" />
              <div className="h-8 w-8 rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-blue-400 to-blue-600" />
            </div>
            <span>Trusted by 1000+ jewelers</span>
          </div>
          <div className="hidden sm:block">•</div>
          <span className="hidden sm:inline">No credit card required</span>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
