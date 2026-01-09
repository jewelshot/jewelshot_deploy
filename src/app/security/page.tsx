'use client';

import { Sparkles, Shield, Lock, Server, Eye, Key, AlertTriangle, CheckCircle2, FileCheck } from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All data is encrypted using TLS 1.3 in transit and AES-256 at rest.',
    },
    {
      icon: Server,
      title: 'SOC 2 Type II Infrastructure',
      description: 'Our infrastructure providers (Supabase, Vercel) maintain SOC 2 Type II compliance.',
    },
    {
      icon: Key,
      title: 'Secure Authentication',
      description: 'Passwords hashed with bcrypt, optional 2FA, and OAuth integration.',
    },
    {
      icon: Eye,
      title: '24/7 Monitoring',
      description: 'Continuous security monitoring with automated threat detection.',
    },
    {
      icon: Shield,
      title: 'DDoS Protection',
      description: 'Enterprise-grade DDoS mitigation powered by Vercel and Cloudflare.',
    },
    {
      icon: FileCheck,
      title: 'Regular Audits',
      description: 'Periodic security assessments and penetration testing.',
    },
  ];

  const practices = [
    {
      category: 'Data Protection',
      items: [
        'All customer data encrypted at rest using AES-256',
        'Encryption in transit via TLS 1.3',
        'Database backups encrypted and geo-redundant',
        'Automatic data retention policies',
        'Secure deletion upon account termination',
      ],
    },
    {
      category: 'Access Control',
      items: [
        'Role-based access control (RBAC)',
        'Principle of least privilege for all team members',
        'Multi-factor authentication for admin access',
        'Detailed audit logs of all access',
        'Automatic session timeout',
      ],
    },
    {
      category: 'Application Security',
      items: [
        'OWASP Top 10 vulnerability protection',
        'SQL injection and XSS prevention',
        'CSRF protection on all forms',
        'Rate limiting on all API endpoints',
        'Input validation and sanitization',
      ],
    },
    {
      category: 'Infrastructure',
      items: [
        'Serverless architecture reduces attack surface',
        'Automatic security patches and updates',
        'Network isolation and firewalls',
        'Container security scanning',
        'No direct database access from internet',
      ],
    },
  ];

  const certifications = [
    { name: 'GDPR Compliant', status: 'active' },
    { name: 'SOC 2 Type II (via providers)', status: 'active' },
    { name: 'CCPA Compliant', status: 'active' },
    { name: 'ISO 27001', status: 'planned' },
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-300">
            <Shield className="h-4 w-4" />
            Enterprise-Grade Security
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Your Data Security is Our Priority
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            We implement industry-leading security practices to protect your images, 
            data, and business. Here's how we keep everything safe.
          </p>
        </div>

        {/* Security Features Grid */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Security at Every Layer</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {securityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-green-500/30 hover:bg-white/10"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-green-400 transition-colors group-hover:bg-green-500/30">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Status Banner */}
        <section className="mb-20">
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/20">
                  <CheckCircle2 className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">All Systems Operational</h3>
                  <p className="text-green-300/80">No security incidents in the past 90 days</p>
                </div>
              </div>
              <a
                href="https://status.jewelshot.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-green-500/30 bg-green-500/20 px-6 py-3 font-medium text-green-300 transition-all hover:bg-green-500/30"
              >
                View Status Page
              </a>
            </div>
          </div>
        </section>

        {/* Security Practices */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Security Practices</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {practices.map((practice) => (
              <div
                key={practice.category}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="mb-4 text-lg font-semibold text-white">{practice.category}</h3>
                <ul className="space-y-3">
                  {practice.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-white/60">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance */}
        <section className="mb-20">
          <h2 className="mb-8 text-center text-2xl font-bold text-white">Compliance & Certifications</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className={`flex items-center gap-3 rounded-xl border px-6 py-4 ${
                  cert.status === 'active'
                    ? 'border-green-500/30 bg-green-500/10 text-green-300'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                {cert.status === 'active' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                <span className="font-medium">{cert.name}</span>
                {cert.status === 'planned' && (
                  <span className="text-xs">(In Progress)</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Vulnerability Disclosure */}
        <section className="mb-20">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-bold text-white">Responsible Disclosure</h3>
                <p className="mb-4 text-white/60">
                  We take security vulnerabilities seriously. If you discover a potential 
                  security issue, please report it responsibly. We appreciate your help in 
                  keeping Jewelshot safe for everyone.
                </p>
                <a
                  href="mailto:security@jewelshot.ai"
                  className="inline-flex items-center gap-2 text-purple-400 hover:underline"
                >
                  Report a vulnerability
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Data Processing */}
        <section>
          <h2 className="mb-8 text-center text-2xl font-bold text-white">How We Handle Your Images</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold">
                1
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">Upload</h3>
                <p className="text-sm text-white/60">
                  Your images are uploaded over an encrypted connection (TLS 1.3) and stored 
                  temporarily in our secure processing queue.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold">
                2
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">Processing</h3>
                <p className="text-sm text-white/60">
                  Images are processed by our AI in isolated environments. No human reviews 
                  your images unless you request support.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold">
                3
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">Storage</h3>
                <p className="text-sm text-white/60">
                  Generated images are stored in your personal gallery, encrypted at rest. 
                  Original uploads are deleted after processing unless you choose to keep them.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 font-bold">
                4
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-white">Deletion</h3>
                <p className="text-sm text-white/60">
                  You can delete any image at any time. When deleted, images are immediately 
                  removed from our active systems and purged from backups within 30 days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-16 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-8 text-center">
          <h2 className="mb-4 text-xl font-bold text-white">Security Questions?</h2>
          <p className="mb-6 text-white/60">
            Our security team is here to help with any concerns.
          </p>
          <a
            href="mailto:security@jewelshot.ai"
            className="inline-block rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-3 font-semibold text-white transition-all hover:opacity-90"
          >
            Contact Security Team
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">© 2025 Jewelshot. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white/60">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
            <Link href="/gdpr" className="hover:text-white/60">GDPR</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

