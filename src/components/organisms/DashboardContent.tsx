/**
 * DashboardContent Component
 *
 * Lightweight dashboard - instant load, no blocking queries.
 * Credits loaded from store, minimal UI.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCreditStore } from '@/store/creditStore';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowUpRight,
  Keyboard,
  X,
  Sparkles,
  Layers,
  Image,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { NotificationCenter } from '@/components/molecules/NotificationCenter';

// ============================================
// CONSTANTS
// ============================================
const PLAN_CREDITS: Record<string, number> = {
  free: 10,
  pro: 500,
  enterprise: 9999,
};

const KEYBOARD_SHORTCUTS = [
  { keys: ['G'], action: 'Generate image' },
  { keys: ['Ctrl', 'Z'], action: 'Undo' },
  { keys: ['Ctrl', 'S'], action: 'Save to gallery' },
  { keys: ['Ctrl', 'D'], action: 'Download' },
  { keys: ['Space'], action: 'Pan canvas' },
  { keys: ['R'], action: 'Reset view' },
  { keys: ['1-9'], action: 'Quick presets' },
];

const QUICK_ACTIONS = [
  { href: '/studio', title: 'Studio', desc: 'Create images', icon: Sparkles },
  { href: '/batch', title: 'Batch', desc: 'Process multiple', icon: Layers },
  { href: '/gallery', title: 'Gallery', desc: 'View your work', icon: Image },
  { href: '/profile', title: 'Account', desc: 'Settings & billing', icon: User },
];

// ============================================
// MAIN COMPONENT
// ============================================
export function DashboardContent() {
  const { leftOpen } = useSidebarStore();
  const { credits, fetchCredits } = useCreditStore();
  const { t } = useLanguage();

  // Minimal state - no loading state, instant render
  const [userName, setUserName] = useState('');
  const [planName, setPlanName] = useState('Free');
  const [creditsTotal, setCreditsTotal] = useState(10);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Fetch user data in background (non-blocking)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserName(user.user_metadata?.full_name?.split(' ')[0] || '');
          
          // Get plan info
          const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_plan')
            .eq('id', user.id)
            .single();
          
          const profileData = profile as { subscription_plan?: string } | null;
          if (profileData?.subscription_plan) {
            const plan = profileData.subscription_plan;
            setPlanName(plan.charAt(0).toUpperCase() + plan.slice(1));
            setCreditsTotal(PLAN_CREDITS[plan] || 10);
          }
        }
      } catch {
        // Silent fail - UI still works
      }
    };

    fetchUserData();
    fetchCredits();
  }, [fetchCredits]);

  const creditsUsed = creditsTotal - credits;
  const percentUsed = creditsTotal > 0 ? Math.round((creditsUsed / creditsTotal) * 100) : 0;

  return (
    <main
      className="fixed inset-0 overflow-y-auto panel-transition"
      style={{ paddingLeft: leftOpen ? '260px' : '0' }}
    >
      <div className="min-h-screen p-6">
        {/* ==================== HEADER ==================== */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {userName ? `Welcome back, ${userName}` : 'Dashboard'}
            </h1>
            <p className="text-sm text-white/40">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <NotificationCenter />
            <button
              onClick={() => setShowShortcuts(true)}
              className="ctrl-btn px-3 py-2 gap-2 text-xs"
            >
              <Keyboard className="h-3.5 w-3.5" />
              Shortcuts
            </button>
          </div>
        </div>

        {/* ==================== CREDITS CARD ==================== */}
        <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Your Credits</p>
              <p className="text-4xl font-semibold text-white">{credits}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/60">
                {planName}
              </span>
              <p className="text-[10px] text-white/30 mt-2">of {creditsTotal} total</p>
            </div>
          </div>

          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentUsed > 90 ? 'bg-red-500/60' :
                percentUsed > 70 ? 'bg-yellow-500/60' :
                'bg-white/40'
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>

          {planName === 'Free' && percentUsed > 50 && (
            <Link
              href="/profile?tab=billing"
              className="mt-4 flex items-center justify-center gap-1 w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white/80 transition-colors"
            >
              {t.dashboard.upgradePlan}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* ==================== QUICK ACTIONS ==================== */}
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:bg-white/[0.06] hover:border-white/20"
            >
              <action.icon className="h-5 w-5 text-white/40 mb-3 group-hover:text-white/60 transition-colors" />
              <h3 className="text-sm font-medium text-white/80 mb-0.5">{action.title}</h3>
              <p className="text-[11px] text-white/40">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ==================== KEYBOARD SHORTCUTS MODAL ==================== */}
      {showShortcuts && (
        <>
          <div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={() => setShowShortcuts(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-[201] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4">
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="ctrl-btn h-7 w-7"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                {KEYBOARD_SHORTCUTS.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-white/60">{shortcut.action}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-white/70"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default DashboardContent;
