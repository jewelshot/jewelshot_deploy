'use client';

import { Sparkles, Target, Lightbulb, Users, Zap, Globe, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { AuroraBackground } from '@/components/atoms/AuroraBackground';

export default function AboutPage() {
  const stats = [
    { value: '50K+', label: 'Images Generated' },
    { value: '2,500+', label: 'Active Users' },
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '40+', label: 'Countries' },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We push the boundaries of AI to create tools that were previously impossible.',
    },
    {
      icon: Users,
      title: 'Customer Obsession',
      description: 'Every feature we build starts with understanding our customers\' real challenges.',
    },
    {
      icon: Zap,
      title: 'Speed Matters',
      description: 'In business, time is money. We help you move faster without sacrificing quality.',
    },
    {
      icon: Award,
      title: 'Quality Standards',
      description: 'We hold ourselves to the highest standards in everything we create.',
    },
  ];

  const team = [
    { name: 'Leadership Team', count: 3 },
    { name: 'Engineering', count: 8 },
    { name: 'AI & ML', count: 5 },
    { name: 'Design', count: 3 },
    { name: 'Customer Success', count: 4 },
  ];

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0 overflow-hidden opacity-50">
        <AuroraBackground />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Jewelshot</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              <Globe className="h-4 w-4" />
              Serving jewelers worldwide
            </div>
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              Revolutionizing Jewelry
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Photography</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/60">
              We're on a mission to democratize professional jewelry photography. 
              Using cutting-edge AI, we help businesses of all sizes create stunning 
              product visuals without expensive equipment or professional photographers.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-white/10 bg-white/5 px-6 py-16">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-3xl font-bold text-white md:text-4xl">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Our Story</h2>
              <div className="mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-white/70">
              <p>
                <strong className="text-white">Jewelshot was born from a simple observation:</strong> jewelry 
                businesses spend thousands of dollars on product photography, yet the results often fail 
                to capture the true beauty of their pieces.
              </p>
              <p>
                Traditional jewelry photography requires expensive macro lenses, professional lighting 
                setups, skilled photographers, and hours of post-processing. For small and medium-sized 
                businesses, this creates a significant barrier to competing with larger brands online.
              </p>
              <p>
                We asked ourselves: <em className="text-purple-300">"What if AI could level the playing field?"</em>
              </p>
              <p>
                Today, Jewelshot uses advanced generative AI to transform ordinary product photos into 
                professional-quality images. Our platform can place jewelry on models, create lifestyle 
                shots, remove backgrounds, enhance details, and generate variations—all in seconds.
              </p>
              <p>
                We're not just saving businesses time and money. We're helping them tell their story 
                through stunning visuals that connect with customers and drive sales.
              </p>
            </div>
          </div>
        </section>

        {/* Problem We Solve */}
        <section className="border-y border-white/10 bg-white/5 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">The Problem We Solve</h2>
              <p className="mx-auto max-w-2xl text-white/60">
                Traditional jewelry photography is expensive, time-consuming, and often inconsistent.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
                <h3 className="mb-4 text-xl font-semibold text-red-400">Without Jewelshot</h3>
                <ul className="space-y-3 text-white/60">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500/50"></span>
                    $500-2,000 per product photoshoot
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500/50"></span>
                    2-3 weeks turnaround time
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500/50"></span>
                    Hiring models for lifestyle shots
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500/50"></span>
                    Expensive equipment and studio rental
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500/50"></span>
                    Inconsistent results across products
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8">
                <h3 className="mb-4 text-xl font-semibold text-green-400">With Jewelshot</h3>
                <ul className="space-y-3 text-white/60">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500/50"></span>
                    Starting at $29/month for unlimited images
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500/50"></span>
                    Results in seconds, not weeks
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500/50"></span>
                    AI-generated models with diverse options
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500/50"></span>
                    No equipment needed—just upload
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500/50"></span>
                    Consistent, professional quality every time
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Our Values</h2>
              <p className="mx-auto max-w-2xl text-white/60">
                The principles that guide everything we do.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-purple-500/30 hover:bg-white/10"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 transition-colors group-hover:bg-purple-500/30">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{value.title}</h3>
                  <p className="text-white/60">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="border-y border-white/10 bg-white/5 px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Our Team</h2>
            <p className="mb-12 text-white/60">
              A passionate team of engineers, designers, and AI experts building the future of product photography.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {team.map((dept) => (
                <div
                  key={dept.name}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-4"
                >
                  <div className="text-2xl font-bold text-purple-400">{dept.count}</div>
                  <div className="text-sm text-white/60">{dept.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Ready to Transform Your Photography?</h2>
            <p className="mb-8 text-white/60">
              Join thousands of jewelry businesses already using Jewelshot.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/signup"
                className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-3 font-semibold text-white transition-all hover:opacity-90"
              >
                Start Free Trial
              </Link>
              <Link
                href="mailto:hello@jewelshot.ai"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-3 font-semibold text-white transition-all hover:bg-white/10"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0a0a0a] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">© 2025 Jewelshot. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
            <Link href="/contact" className="hover:text-white/60">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

