import React from 'react';
import { Wand2, Zap, Palette, Download, Shield, Sparkles } from 'lucide-react';
import { FeatureCard } from '@/components/molecules/FeatureCard';

/**
 * FeaturesSection - Showcase main features
 * Grid layout with animated cards
 */
export function FeaturesSection() {
  const features = [
    {
      icon: Wand2,
      title: 'AI-Powered Enhancement',
      description:
        'Advanced AI instantly enhances your jewelry photos with professional-grade quality. No manual editing required.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Transform your images in seconds. Generate multiple variations and export instantly without waiting.',
    },
    {
      icon: Palette,
      title: 'Professional Styles',
      description:
        'Choose from curated styles: Clean White, Minimalist Model, Still Life, and Luxury Editorial.',
    },
    {
      icon: Download,
      title: 'Export Ready',
      description:
        'Download high-resolution images optimized for e-commerce, social media, and print catalogs.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description:
        'Your images are processed securely and never shared. Full control over your creative assets.',
    },
    {
      icon: Sparkles,
      title: 'Real-time Preview',
      description:
        'See changes instantly with live preview. Fine-tune every detail with professional-grade controls.',
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            Everything You Need for{' '}
            <span className="bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
              Perfect Jewelry Photos
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Professional tools designed specifically for jewelry photography.
            Create stunning visuals that sell.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-500/5 blur-3xl" />
    </section>
  );
}









