'use client';

import { Sparkles, Shield, Lock, Eye, Server, UserCheck, Clock, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const lastUpdated = 'January 9, 2025';

  const sections = [
    {
      id: 'information-we-collect',
      title: '1. Information We Collect',
      icon: Eye,
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you create an account, we collect your email address, name, and password. If you sign up via Google or other OAuth providers, we receive your basic profile information.',
        },
        {
          subtitle: 'Uploaded Content',
          text: 'We collect and store the images you upload for processing. These images are used solely to provide our services and are not shared with third parties for their own purposes.',
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you use Jewelshot, including features accessed, time spent, and actions taken. This helps us improve our service.',
        },
        {
          subtitle: 'Payment Information',
          text: 'Payment processing is handled by Creem.io. We do not store your full credit card details on our servers. We only receive confirmation of successful payments.',
        },
        {
          subtitle: 'Device & Technical Data',
          text: 'We collect browser type, IP address, device information, and operating system to ensure security and optimize performance.',
        },
      ],
    },
    {
      id: 'how-we-use',
      title: '2. How We Use Your Information',
      icon: UserCheck,
      content: [
        {
          subtitle: 'Providing Services',
          text: 'We use your information to process images, generate AI content, maintain your gallery, and deliver the features you expect from Jewelshot.',
        },
        {
          subtitle: 'Improving Our Platform',
          text: 'We analyze usage patterns to understand how customers use our features, identify areas for improvement, and develop new capabilities.',
        },
        {
          subtitle: 'Communication',
          text: 'We may send you service updates, security alerts, and occasional marketing messages. You can opt out of marketing communications at any time.',
        },
        {
          subtitle: 'Security & Fraud Prevention',
          text: 'We use your information to detect and prevent fraudulent activity, unauthorized access, and other security threats.',
        },
      ],
    },
    {
      id: 'data-storage',
      title: '3. Data Storage & Security',
      icon: Server,
      content: [
        {
          subtitle: 'Secure Infrastructure',
          text: 'Your data is stored on secure servers provided by Supabase and Vercel, both of which maintain SOC 2 Type II compliance and implement industry-standard security measures.',
        },
        {
          subtitle: 'Encryption',
          text: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Passwords are hashed using bcrypt with appropriate salt rounds.',
        },
        {
          subtitle: 'Access Controls',
          text: 'Access to user data is strictly limited to authorized personnel who need it to perform their job functions. All access is logged and monitored.',
        },
        {
          subtitle: 'Image Processing',
          text: 'Images are processed using FAL.ai infrastructure. Uploaded images are temporarily stored for processing and deleted according to our retention policies.',
        },
      ],
    },
    {
      id: 'data-retention',
      title: '4. Data Retention',
      icon: Clock,
      content: [
        {
          subtitle: 'Account Data',
          text: 'We retain your account information for as long as your account is active. You can request deletion at any time.',
        },
        {
          subtitle: 'Generated Images',
          text: 'Images you generate are stored in your gallery until you delete them or close your account. We do not set automatic expiration for generated content.',
        },
        {
          subtitle: 'Processing Logs',
          text: 'Technical logs and analytics data are retained for up to 90 days for debugging and security purposes.',
        },
        {
          subtitle: 'After Account Deletion',
          text: 'When you delete your account, we remove your personal data within 30 days. Some anonymized data may be retained for analytics purposes.',
        },
      ],
    },
    {
      id: 'sharing',
      title: '5. Information Sharing',
      icon: Lock,
      content: [
        {
          subtitle: 'We Do Not Sell Your Data',
          text: 'We never sell, rent, or trade your personal information or uploaded images to third parties.',
        },
        {
          subtitle: 'Service Providers',
          text: 'We share necessary data with trusted service providers who help us operate our platform (Supabase, Vercel, FAL.ai, Creem.io). These providers are bound by strict data processing agreements.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information if required by law, court order, or to protect our rights, property, or safety.',
        },
        {
          subtitle: 'Business Transfers',
          text: 'If Jewelshot is involved in a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your data becomes subject to a different privacy policy.',
        },
      ],
    },
    {
      id: 'your-rights',
      title: '6. Your Rights',
      icon: Shield,
      content: [
        {
          subtitle: 'Access & Portability',
          text: 'You can access your data through your account settings. You can export your generated images at any time.',
        },
        {
          subtitle: 'Correction',
          text: 'You can update your account information through your profile settings at any time.',
        },
        {
          subtitle: 'Deletion',
          text: 'You can delete individual images from your gallery or request complete account deletion through your settings or by contacting us.',
        },
        {
          subtitle: 'Opt-Out',
          text: 'You can opt out of marketing communications by clicking the unsubscribe link in our emails or updating your preferences.',
        },
      ],
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
          <Link
            href="/"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Title */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <Shield className="h-4 w-4" />
            Your privacy matters
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/60">Last updated: {lastUpdated}</p>
        </div>

        {/* Introduction */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="leading-relaxed text-white/70">
            At Jewelshot ("we," "our," or "us"), we take your privacy seriously. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you use our 
            AI-powered jewelry photography platform. By using Jewelshot, you agree to the collection 
            and use of information in accordance with this policy.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-semibold text-white">Table of Contents</h2>
          <nav className="grid gap-2 sm:grid-cols-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-purple-400"
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="space-y-6 pl-[52px]">
                {section.content.map((item, index) => (
                  <div key={index}>
                    <h3 className="mb-2 font-semibold text-white">{item.subtitle}</h3>
                    <p className="leading-relaxed text-white/60">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Cookies */}
        <section className="mt-12 scroll-mt-24">
          <h2 className="mb-6 text-2xl font-bold text-white">7. Cookies & Tracking</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="mb-4 text-white/60">We use the following types of cookies:</p>
            <ul className="space-y-3 text-white/60">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                <span><strong className="text-white">Essential Cookies:</strong> Required for the platform to function properly (authentication, session management).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                <span><strong className="text-white">Analytics Cookies:</strong> Help us understand how you use our platform (Plausible Analytics - privacy-focused, no personal data).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500"></span>
                <span><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Children */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">8. Children's Privacy</h2>
          <p className="leading-relaxed text-white/60">
            Jewelshot is not intended for children under the age of 16. We do not knowingly collect 
            personal information from children. If you believe we have inadvertently collected 
            information from a child, please contact us immediately.
          </p>
        </section>

        {/* Changes */}
        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">9. Changes to This Policy</h2>
          <p className="leading-relaxed text-white/60">
            We may update this Privacy Policy from time to time. We will notify you of any material 
            changes by posting the new policy on this page and updating the "Last updated" date. 
            Your continued use of Jewelshot after any changes constitutes acceptance of the new policy.
          </p>
        </section>

        {/* Contact */}
        <section className="mt-12 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-bold text-white">Contact Us</h2>
              <p className="mb-4 text-white/60">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="space-y-2 text-white/70">
                <li>Email: <a href="mailto:privacy@jewelshot.ai" className="text-purple-400 hover:underline">privacy@jewelshot.ai</a></li>
                <li>Address: Jewelshot Inc., Privacy Team</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white/40">© 2025 Jewelshot. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/terms" className="hover:text-white/60">Terms</Link>
            <Link href="/security" className="hover:text-white/60">Security</Link>
            <Link href="/gdpr" className="hover:text-white/60">GDPR</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

