import React from 'react';
import { Sparkles } from 'lucide-react';
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

        {/* Main Heading - Zoom out from blur effect */}
        <h1
          className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
          style={{
            animation: 'zoomBlurIn 1s cubic-bezier(0.16, 1, 0.3, 1) 100ms backwards',
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
          <PrimaryButton href="/auth/signup" size="lg" icon>
            Start Creating Free
          </PrimaryButton>
          <PrimaryButton href="/auth/login" size="lg" variant="secondary">
            Sign In
          </PrimaryButton>
        </div>

        {/* Social Proof */}
        <div
          className="mt-12 flex flex-col items-center justify-center gap-6 text-sm text-white/70 sm:flex-row sm:gap-8"
          style={{
            animation:
              'fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) 400ms backwards',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-purple-400 to-purple-600 font-bold text-white shadow-lg">
                AI
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-pink-400 to-pink-600 font-bold text-white shadow-lg">
                LX
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#0a0a0a] bg-gradient-to-br from-blue-400 to-blue-600 font-bold text-white shadow-lg">
                JS
              </div>
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">10,000+ Users</div>
              <div className="text-xs text-white/60">
                Join jewelers worldwide
              </div>
            </div>
          </div>
          <div className="hidden h-8 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-medium text-white">4.9/5 Rating</span>
          </div>
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
        @keyframes zoomBlurIn {
          0% {
            opacity: 0;
            transform: scale(1.3);
            filter: blur(20px);
          }
          50% {
            opacity: 0.8;
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}
