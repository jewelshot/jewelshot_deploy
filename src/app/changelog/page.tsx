'use client';

import Link from 'next/link';
import { 
  Sparkles, 
  Bug, 
  Zap, 
  Shield, 
  Gift,
  ArrowRight,
  Calendar
} from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  changes: {
    type: 'feature' | 'improvement' | 'fix' | 'security';
    description: string;
  }[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: 'January 19, 2026',
    title: 'Referral System & Notifications',
    changes: [
      { type: 'feature', description: 'Referral program - earn credits by inviting friends' },
      { type: 'feature', description: 'In-app notification center' },
      { type: 'feature', description: 'PWA support - install as mobile app' },
      { type: 'feature', description: 'Comprehensive Help/FAQ page' },
      { type: 'feature', description: 'New onboarding tutorial for new users' },
      { type: 'improvement', description: 'Added Cookie Policy and Refund Policy pages' },
    ],
  },
  {
    version: '1.1.0',
    date: 'January 18, 2026',
    title: 'Security & Analytics',
    changes: [
      { type: 'feature', description: 'Phone number verification with Twilio' },
      { type: 'feature', description: 'Google Analytics 4 integration' },
      { type: 'feature', description: 'Meta Pixel for ad tracking' },
      { type: 'feature', description: 'Hotjar/Contentsquare for heatmaps' },
      { type: 'feature', description: 'JivoChat live support widget' },
      { type: 'security', description: 'reCAPTCHA v3 protection' },
      { type: 'security', description: 'Advanced anti-fraud system' },
      { type: 'fix', description: 'Fixed Google OAuth redirect issues' },
      { type: 'fix', description: 'Fixed email verification redirects' },
    ],
  },
  {
    version: '1.0.0',
    date: 'January 15, 2026',
    title: 'Official Launch 🚀',
    changes: [
      { type: 'feature', description: 'AI-powered jewelry photo generation' },
      { type: 'feature', description: 'Studio with preset library' },
      { type: 'feature', description: 'Batch processing for multiple images' },
      { type: 'feature', description: 'Gallery with download & share' },
      { type: 'feature', description: '5 subscription tiers (Basic to Enterprise)' },
      { type: 'feature', description: 'Credit-based usage system' },
      { type: 'feature', description: 'Multi-language support (EN/TR)' },
      { type: 'security', description: 'End-to-end encryption' },
    ],
  },
];

const typeConfig = {
  feature: {
    icon: Sparkles,
    label: 'New Feature',
    color: 'text-purple-400 bg-purple-500/20',
  },
  improvement: {
    icon: Zap,
    label: 'Improvement',
    color: 'text-blue-400 bg-blue-500/20',
  },
  fix: {
    icon: Bug,
    label: 'Bug Fix',
    color: 'text-green-400 bg-green-500/20',
  },
  security: {
    icon: Shield,
    label: 'Security',
    color: 'text-yellow-400 bg-yellow-500/20',
  },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-2 text-sm text-purple-300 mb-6">
            <Gift className="h-4 w-4" />
            What&apos;s New
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Changelog</h1>
          <p className="text-white/60 max-w-lg">
            All the latest updates, improvements, and fixes to Jewelshot.
          </p>
        </div>
      </div>

      {/* Changelog Entries */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />

          {/* Entries */}
          <div className="space-y-12">
            {CHANGELOG.map((entry, entryIndex) => (
              <div key={entry.version} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-500 bg-[#0a0a0a]">
                  <span className="text-xs font-bold text-purple-400">
                    {entry.version.split('.')[0]}.{entry.version.split('.')[1]}
                  </span>
                </div>

                {/* Version card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  {/* Header */}
                  <div className="border-b border-white/10 bg-white/5 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-white mb-1">
                          v{entry.version} – {entry.title}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <Calendar className="h-4 w-4" />
                          {entry.date}
                        </div>
                      </div>
                      {entryIndex === 0 && (
                        <span className="rounded-full bg-purple-500 px-3 py-1 text-xs font-medium text-white">
                          Latest
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Changes */}
                  <div className="p-6">
                    <ul className="space-y-3">
                      {entry.changes.map((change, changeIndex) => {
                        const config = typeConfig[change.type];
                        const Icon = config.icon;
                        return (
                          <li key={changeIndex} className="flex items-start gap-3">
                            <span className={`shrink-0 rounded-md p-1.5 ${config.color}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-white/70">{change.description}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe to updates */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Get notified when we release new features and updates.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-3 text-white font-medium hover:bg-purple-600 transition-colors"
          >
            Sign Up for Updates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Back Link */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <Link href="/" className="text-purple-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
