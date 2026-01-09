'use client';

import { Sparkles, Shield, Globe, Download, Trash2, Edit3, Lock, UserCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function GDPRPage() {
  const rights = [
    {
      icon: Download,
      title: 'Right to Access',
      description: 'You can request a copy of all personal data we hold about you. We will provide this within 30 days.',
      action: 'Request Data Export',
    },
    {
      icon: Edit3,
      title: 'Right to Rectification',
      description: 'You can correct any inaccurate or incomplete personal data through your account settings.',
      action: 'Update Profile',
    },
    {
      icon: Trash2,
      title: 'Right to Erasure',
      description: 'You can request deletion of your personal data. We will process this within 30 days.',
      action: 'Delete Account',
    },
    {
      icon: Lock,
      title: 'Right to Restrict Processing',
      description: 'You can limit how we use your data while we address any concerns you may have.',
      action: 'Contact Support',
    },
    {
      icon: Globe,
      title: 'Right to Data Portability',
      description: 'You can receive your data in a structured, machine-readable format.',
      action: 'Export Data',
    },
    {
      icon: UserCheck,
      title: 'Right to Object',
      description: 'You can object to processing of your data for marketing or profiling purposes.',
      action: 'Manage Preferences',
    },
  ];

  const legalBases = [
    {
      basis: 'Contract Performance',
      description: 'Processing necessary to provide you with our services (image processing, gallery storage, etc.)',
      examples: ['Account management', 'Image generation', 'Customer support'],
    },
    {
      basis: 'Legitimate Interests',
      description: 'Processing for our legitimate business interests, balanced against your rights',
      examples: ['Service improvement', 'Security monitoring', 'Analytics'],
    },
    {
      basis: 'Consent',
      description: 'Processing based on your explicit consent, which you can withdraw anytime',
      examples: ['Marketing emails', 'Product updates', 'Surveys'],
    },
    {
      basis: 'Legal Obligation',
      description: 'Processing required to comply with applicable laws',
      examples: ['Tax records', 'Fraud prevention', 'Legal requests'],
    },
  ];

  const dataCategories = [
    { category: 'Identity Data', examples: 'Name, email address, user ID', retention: 'Until account deletion' },
    { category: 'Authentication Data', examples: 'Hashed password, OAuth tokens', retention: 'Until account deletion' },
    { category: 'Uploaded Content', examples: 'Product images you upload', retention: 'Until you delete or close account' },
    { category: 'Generated Content', examples: 'AI-generated images', retention: 'Until you delete or close account' },
    { category: 'Usage Data', examples: 'Features used, session duration', retention: '90 days' },
    { category: 'Technical Data', examples: 'IP address, browser type', retention: '90 days' },
    { category: 'Payment Data', examples: 'Subscription status, invoice history', retention: '7 years (legal requirement)' },
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

      <main className="mx-auto max-w-6xl px-6 py-16">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Globe className="h-4 w-4" />
            European Data Protection
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            GDPR Compliance
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Jewelshot is committed to protecting the privacy and rights of individuals 
            in the European Union under the General Data Protection Regulation (GDPR).
          </p>
        </div>

        {/* EU Badge */}
        <div className="mb-16 flex justify-center">
          <div className="inline-flex items-center gap-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-8 py-4">
            <div className="text-3xl">🇪🇺</div>
            <div>
              <div className="font-semibold text-white">GDPR Compliant</div>
              <div className="text-sm text-blue-300">EU Data Protection Standards</div>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Your Rights Under GDPR</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rights.map((right) => (
              <div
                key={right.title}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-blue-500/30"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                  <right.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{right.title}</h3>
                <p className="mb-4 flex-1 text-sm text-white/60">{right.description}</p>
                <button className="self-start rounded-lg bg-white/5 px-4 py-2 text-sm text-blue-400 transition-colors hover:bg-white/10">
                  {right.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Legal Basis */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Legal Basis for Processing</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {legalBases.map((item) => (
              <div
                key={item.basis}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="mb-2 text-lg font-semibold text-white">{item.basis}</h3>
                <p className="mb-4 text-sm text-white/60">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.examples.map((example) => (
                    <span
                      key={example}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Categories */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Data We Collect & Retention</h2>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Examples</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dataCategories.map((item) => (
                  <tr key={item.category} className="transition-colors hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">{item.category}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{item.examples}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{item.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* International Transfers */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">International Data Transfers</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="mb-6 text-white/60">
              Some of our service providers are located outside the European Economic Area (EEA). 
              When we transfer your data internationally, we ensure adequate protection through:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">Standard Contractual Clauses</h4>
                  <p className="text-sm text-white/60">EU-approved data transfer agreements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">Data Processing Agreements</h4>
                  <p className="text-sm text-white/60">Binding contracts with all processors</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">Adequacy Decisions</h4>
                  <p className="text-sm text-white/60">Using providers in approved countries</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-blue-400" />
                <div>
                  <h4 className="font-medium text-white">Technical Safeguards</h4>
                  <p className="text-sm text-white/60">Encryption and pseudonymization</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Protection Officer */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Data Protection Contact</h2>
          <div className="mx-auto max-w-2xl rounded-2xl border border-blue-500/30 bg-blue-500/10 p-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">Contact Our DPO</h3>
            <p className="mb-4 text-white/60">
              For any GDPR-related inquiries or to exercise your data protection rights, 
              please contact our Data Protection Officer:
            </p>
            <a
              href="mailto:dpo@jewelshot.ai"
              className="inline-block rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 font-semibold text-white transition-all hover:opacity-90"
            >
              dpo@jewelshot.ai
            </a>
          </div>
        </section>

        {/* How to Exercise Rights */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">How to Exercise Your Rights</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold">
                1
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">Submit a Request</h3>
                <p className="text-sm text-white/60">
                  Email our DPO at dpo@jewelshot.ai or use the self-service options in your 
                  account settings. Include your name and the specific right you wish to exercise.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold">
                2
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">Identity Verification</h3>
                <p className="text-sm text-white/60">
                  We may ask you to verify your identity to protect your data from unauthorized 
                  access. This typically involves confirming your email address.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold">
                3
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">Processing</h3>
                <p className="text-sm text-white/60">
                  We will respond to your request within 30 days. Complex requests may take 
                  up to 60 days, in which case we will notify you of the extension.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supervisory Authority */}
        <section>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="mb-4 text-xl font-bold text-white">Right to Lodge a Complaint</h2>
            <p className="mb-4 text-white/60">
              If you believe that our processing of your personal data violates the GDPR, 
              you have the right to lodge a complaint with your local supervisory authority. 
              We encourage you to contact us first so we can address your concerns directly.
            </p>
            <p className="text-sm text-white/40">
              A list of EU data protection authorities can be found at the European Data 
              Protection Board website: edpb.europa.eu
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">© 2025 Jewelshot. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
            <Link href="/security" className="hover:text-white/60">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

