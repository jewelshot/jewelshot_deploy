import React from 'react';
import { Upload, Wand2, Download, ArrowRight } from 'lucide-react';

/**
 * HowItWorksSection - Step-by-step process explanation
 * Visual guide with animated steps
 */
export function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      number: '01',
      title: 'Upload Your Photo',
      description:
        'Simply drag and drop your jewelry image or select from your device. Supports all major formats.',
    },
    {
      icon: Wand2,
      number: '02',
      title: 'Choose Your Style',
      description:
        'Select from professional presets or customize with AI-powered editing tools for perfect results.',
    },
    {
      icon: Download,
      number: '03',
      title: 'Export & Share',
      description:
        'Download your enhanced image in high resolution, ready for your website, social media, or print.',
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            Create Stunning Photos in{' '}
            <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
              Three Simple Steps
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            From upload to export in under a minute. No experience required.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="absolute left-1/2 top-20 hidden h-[calc(100%-160px)] w-0.5 -translate-x-1/2 lg:block">
            <div className="h-full w-full bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />
          </div>

          {/* Step Cards */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative flex flex-col items-center gap-8 lg:flex-row ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
                style={{
                  animation: `fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 200}ms backwards`,
                }}
              >
                {/* Icon Circle */}
                <div className="relative flex-shrink-0">
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />

                  {/* Circle */}
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-xl">
                    <step.icon className="h-10 w-10 text-purple-400" />
                  </div>

                  {/* Step Number */}
                  <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/20 backdrop-blur-xl">
                    <span className="text-sm font-bold text-purple-300">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-purple-500/30 hover:bg-white/[0.05] ${
                    index % 2 === 1 ? 'lg:text-right' : ''
                  }`}
                >
                  <h3 className="mb-3 text-2xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-white/60">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (only between steps) */}
                {index < steps.length - 1 && (
                  <div className="absolute -bottom-8 left-1/2 block -translate-x-1/2 lg:hidden">
                    <ArrowRight className="h-6 w-6 rotate-90 text-purple-500/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />

      <style jsx>{`
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






