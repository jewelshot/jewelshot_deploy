'use client';

import { Sparkles, Briefcase, MapPin, Clock, Heart, Zap, Users, Rocket, Coffee, Laptop, Globe } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  const perks = [
    { icon: Laptop, title: 'Remote-First', description: 'Work from anywhere in the world' },
    { icon: Clock, title: 'Flexible Hours', description: 'We care about results, not hours' },
    { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive health coverage' },
    { icon: Rocket, title: 'Growth Budget', description: '$2,000/year for learning' },
    { icon: Coffee, title: 'Home Office', description: '$1,000 setup stipend' },
    { icon: Globe, title: 'Team Retreats', description: 'Annual company meetups' },
  ];

  const openPositions = [
    {
      title: 'Senior Full-Stack Engineer',
      department: 'Engineering',
      location: 'Remote (Global)',
      type: 'Full-time',
      description: 'Build and scale our AI-powered platform using Next.js, React, and TypeScript.',
    },
    {
      title: 'ML/AI Engineer',
      department: 'AI',
      location: 'Remote (Global)',
      type: 'Full-time',
      description: 'Develop and optimize our generative AI models for jewelry photography.',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote (Global)',
      type: 'Full-time',
      description: 'Design intuitive and beautiful experiences for creative professionals.',
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote (US/EU)',
      type: 'Full-time',
      description: 'Help our customers succeed and grow their businesses with Jewelshot.',
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote (Global)',
      type: 'Full-time',
      description: 'Build and maintain our cloud infrastructure on Vercel, Supabase, and AWS.',
    },
  ];

  const values = [
    {
      icon: Zap,
      title: 'Move Fast',
      description: 'We ship quickly, learn from users, and iterate. Perfect is the enemy of good.',
    },
    {
      icon: Users,
      title: 'Customer-First',
      description: 'Every decision starts with "How does this help our customers?"',
    },
    {
      icon: Heart,
      title: 'Ownership',
      description: 'We take responsibility for our work and see things through to completion.',
    },
    {
      icon: Rocket,
      title: 'Ambition',
      description: 'We set audacious goals and believe in our ability to achieve them.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Jewelshot</span>
          </Link>
          <Link href="/" className="text-sm text-white/60 transition-colors hover:text-white">
            Back to Home
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-6 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              <Briefcase className="h-4 w-4" />
              We're Hiring
            </div>
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              Build the Future of
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> AI Photography</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/60">
              Join a passionate team revolutionizing how the jewelry industry creates 
              visual content. We're looking for talented individuals who want to make 
              a real impact.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-white/10 bg-white/5 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{value.title}</h3>
                  <p className="text-sm text-white/60">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-white">Open Positions</h2>
            <p className="mb-12 text-center text-white/60">
              {openPositions.length} roles available
            </p>
            <div className="space-y-4">
              {openPositions.map((position) => (
                <div
                  key={position.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-purple-500/30 hover:bg-white/10"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white group-hover:text-purple-300">
                        {position.title}
                      </h3>
                      <p className="mb-3 text-sm text-white/60">{position.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1 text-xs text-white/40">
                          <Briefcase className="h-3 w-3" />
                          {position.department}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-white/40">
                          <MapPin className="h-3 w-3" />
                          {position.location}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-white/40">
                          <Clock className="h-3 w-3" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`mailto:careers@jewelshot.ai?subject=Application: ${position.title}`}
                      className="flex-shrink-0 rounded-xl bg-purple-500/20 px-6 py-3 text-sm font-medium text-purple-300 transition-all hover:bg-purple-500/30"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Perks */}
        <section className="border-y border-white/10 bg-white/5 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-center text-3xl font-bold text-white">Perks & Benefits</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-500/20 text-green-400">
                    <perk.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-white">{perk.title}</h3>
                    <p className="text-sm text-white/60">{perk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Life at Jewelshot */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-white">Life at Jewelshot</h2>
            <div className="mb-8 text-white/60">
              <p className="mb-4">
                We're a small, focused team building something we're genuinely excited about. 
                We believe great work comes from passionate people who have the freedom to 
                do their best work.
              </p>
              <p className="mb-4">
                Our team is fully remote, spanning multiple time zones. We communicate 
                asynchronously when possible and meet synchronously when it matters. 
                We value deep work and protect our time.
              </p>
              <p>
                We're growing fast, which means lots of opportunities to take on new 
                challenges and grow your career. If you're the type of person who thrives 
                in a fast-paced environment, you'll feel right at home.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Don't See Your Role?</h2>
              <p className="mb-8 text-white/60">
                We're always looking for exceptional talent. Send us your resume and 
                tell us how you can contribute to Jewelshot.
              </p>
              <a
                href="mailto:careers@jewelshot.ai"
                className="inline-block rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-4 font-semibold text-white transition-all hover:opacity-90"
              >
                Send Your Resume
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">© 2025 Jewelshot. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/about" className="hover:text-white/60">About</Link>
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

