'use client';

import { Cookie, Shield, Settings, BarChart3, Megaphone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CookiesPage() {
  const lastUpdated = 'January 19, 2026';

  const cookieTypes = [
    {
      title: 'Essential Cookies',
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10 border-green-500/30',
      description: 'Required for the website to function properly',
      examples: [
        'Authentication and session management',
        'Security features (CSRF protection)',
        'Load balancing and server routing',
      ],
    },
    {
      title: 'Functional Cookies',
      icon: Settings,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/30',
      description: 'Enhance your experience and remember preferences',
      examples: [
        'Language and theme preferences',
        'Recently used features and presets',
        'Form data persistence',
      ],
    },
    {
      title: 'Analytics Cookies',
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      description: 'Help us understand how you use our service',
      examples: [
        'Google Analytics - Usage statistics',
        'Hotjar - User behavior analysis',
        'Plausible - Privacy-focused analytics',
      ],
    },
    {
      title: 'Marketing Cookies',
      icon: Megaphone,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/30',
      description: 'Used for advertising and conversion tracking',
      examples: [
        'Meta Pixel - Ad performance tracking',
        'Conversion tracking for campaigns',
      ],
    },
  ];

  const thirdPartyProviders = [
    { name: 'Google', purpose: 'Analytics, reCAPTCHA', link: 'https://policies.google.com/privacy' },
    { name: 'Meta', purpose: 'Pixel tracking', link: 'https://www.facebook.com/privacy/policy/' },
    { name: 'Hotjar', purpose: 'Heatmaps, recordings', link: 'https://www.hotjar.com/privacy/' },
    { name: 'Supabase', purpose: 'Authentication', link: 'https://supabase.com/privacy' },
    { name: 'JivoChat', purpose: 'Live chat support', link: 'https://www.jivochat.com/privacy/' },
    { name: 'Sentry', purpose: 'Error tracking', link: 'https://sentry.io/privacy/' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Cookie className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-sm font-medium text-purple-400">Legal</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
          <p className="text-white/60">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies?</h2>
          <p className="text-white/70 leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. 
            They help websites remember your preferences, keep you logged in, and understand 
            how you use the site to improve your experience.
          </p>
        </section>

        {/* Cookie Types */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Types of Cookies We Use</h2>
          <div className="space-y-4">
            {cookieTypes.map((type) => (
              <div key={type.title} className={`rounded-xl border p-6 ${type.bgColor}`}>
                <div className="flex items-center gap-3 mb-3">
                  <type.icon className={`h-5 w-5 ${type.color}`} />
                  <h3 className="text-lg font-medium text-white">{type.title}</h3>
                </div>
                <p className="text-white/60 text-sm mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.examples.map((example, idx) => (
                    <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                      <span className="text-white/40 mt-1">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Third Party Providers */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Third-Party Cookies</h2>
          <p className="text-white/70 mb-6">
            We use services from third parties that may set their own cookies:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 text-white font-medium">Provider</th>
                  <th className="py-3 text-white font-medium">Purpose</th>
                  <th className="py-3 text-white font-medium">Privacy Policy</th>
                </tr>
              </thead>
              <tbody>
                {thirdPartyProviders.map((provider) => (
                  <tr key={provider.name} className="border-b border-white/5">
                    <td className="py-3 text-white/70">{provider.name}</td>
                    <td className="py-3 text-white/70">{provider.purpose}</td>
                    <td className="py-3">
                      <a 
                        href={provider.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:underline inline-flex items-center gap-1"
                      >
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Managing Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
          <p className="text-white/70 leading-relaxed mb-4">
            You can control cookies through several methods:
          </p>
          <ul className="space-y-3 text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong className="text-white">Cookie Banner:</strong> Set your preferences when you first visit our site</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong className="text-white">Browser Settings:</strong> Block or delete cookies through your browser</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 mt-1">•</span>
              <span><strong className="text-white">Opt-Out Tools:</strong> Use provider-specific opt-out mechanisms</span>
            </li>
          </ul>
          <p className="text-white/50 text-sm mt-4">
            Note: Disabling essential cookies may affect website functionality.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Questions?</h2>
          <p className="text-white/70">
            Contact us at{' '}
            <a href="mailto:privacy@jewelshot.ai" className="text-purple-400 hover:underline">
              privacy@jewelshot.ai
            </a>
          </p>
        </section>

        {/* Back Link */}
        <div className="border-t border-white/10 pt-8">
          <Link href="/" className="text-purple-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
