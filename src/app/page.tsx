'use client';

import { AuroraBackground } from '@/components/atoms/AuroraBackground';
import { HeroSection } from '@/components/organisms/HeroSection';
import { FeaturesSection } from '@/components/organisms/FeaturesSection';
import { HowItWorksSection } from '@/components/organisms/HowItWorksSection';
import { CTASection } from '@/components/organisms/CTASection';
import { StatsSection } from '@/components/organisms/StatsSection';
import { LogoCloudSection } from '@/components/organisms/LogoCloudSection';
import { TestimonialsSection } from '@/components/organisms/TestimonialsSection';
import { PricingSection } from '@/components/organisms/PricingSection';
import { Navbar } from '@/components/organisms/Navbar';

/**
 * Landing Page - Enterprise-grade landing page for Jewelshot
 * Fully responsive, animated, and optimized
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <AuroraBackground />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Logo Cloud */}
        <LogoCloudSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Pricing */}
        <PricingSection />

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <footer className="relative overflow-hidden border-t border-white/5 px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Jewelshot
                </h3>
                <p className="text-sm text-white/60">
                  AI-powered jewelry photography for professionals.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">
                  Product
                </h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>
                    <a
                      href="/auth/login"
                      className="transition-colors hover:text-purple-400"
                    >
                      Sign In
                    </a>
                  </li>
                  <li>
                    <a
                      href="/auth/signup"
                      className="transition-colors hover:text-purple-400"
                    >
                      Sign Up
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="transition-colors hover:text-purple-400"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pricing"
                      className="transition-colors hover:text-purple-400"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">
                  Company
                </h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>
                    <a
                      href="#about"
                      className="transition-colors hover:text-purple-400"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#blog"
                      className="transition-colors hover:text-purple-400"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#careers"
                      className="transition-colors hover:text-purple-400"
                    >
                      Careers
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="transition-colors hover:text-purple-400"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-white/60">
                  <li>
                    <a
                      href="#privacy"
                      className="transition-colors hover:text-purple-400"
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#terms"
                      className="transition-colors hover:text-purple-400"
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#security"
                      className="transition-colors hover:text-purple-400"
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-white/40">
              <p>© 2025 Jewelshot. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
