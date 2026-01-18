'use client';

import { useState, useEffect } from 'react';
import { 
  Gift, 
  Copy, 
  Check, 
  Users, 
  Coins, 
  Clock,
  Share2,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface ReferralStats {
  totalReferrals: number;
  pendingRewards: number;
  earnedCredits: number;
  referralCode: string;
  referralLink: string;
  history: Array<{
    id: string;
    refereeEmail: string;
    status: 'pending' | 'completed' | 'expired';
    createdAt: string;
  }>;
}

export function ReferralSection() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/referral/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareLink = async () => {
    if (!stats) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Jewelshot',
          text: 'Transform your jewelry photos with AI! Use my referral link to get bonus credits.',
          url: stats.referralLink,
        });
      } catch (error) {
        // User cancelled or share failed
        copyToClipboard(stats.referralLink);
      }
    } else {
      copyToClipboard(stats.referralLink);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse">
        <div className="h-6 w-40 bg-white/10 rounded mb-4"></div>
        <div className="h-20 bg-white/10 rounded"></div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-white/10">
            <Gift className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Refer & Earn</h3>
        </div>
        <p className="text-white/60 text-sm">
          Invite friends and earn credits when they join!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
            <Users className="h-5 w-5 text-purple-400" />
            {stats.totalReferrals}
          </div>
          <div className="text-xs text-white/50">Referrals</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
            <Clock className="h-5 w-5 text-yellow-400" />
            {stats.pendingRewards}
          </div>
          <div className="text-xs text-white/50">Pending</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
            <Coins className="h-5 w-5 text-green-400" />
            {stats.earnedCredits}
          </div>
          <div className="text-xs text-white/50">Earned</div>
        </div>
      </div>

      {/* Referral Link */}
      <div className="p-6">
        <label className="text-sm text-white/60 mb-2 block">Your Referral Link</label>
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white/70 truncate">
            {stats.referralLink}
          </div>
          <button
            onClick={() => copyToClipboard(stats.referralLink)}
            className="rounded-lg bg-white/10 px-4 py-2.5 text-white hover:bg-white/20 transition-colors"
            title="Copy link"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={shareLink}
            className="rounded-lg bg-purple-500 px-4 py-2.5 text-white hover:bg-purple-600 transition-colors"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Referral Code */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-purple-500/10 border border-purple-500/30 px-4 py-3">
          <div>
            <div className="text-xs text-purple-300 mb-1">Your Code</div>
            <div className="text-lg font-mono font-bold text-white">{stats.referralCode}</div>
          </div>
          <button
            onClick={() => copyToClipboard(stats.referralCode)}
            className="rounded-lg bg-purple-500/20 p-2 text-purple-300 hover:bg-purple-500/30 transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        {/* Rewards Info */}
        <div className="mt-4 rounded-lg bg-white/5 border border-white/10 p-4">
          <h4 className="text-sm font-medium text-white mb-3">How it works</h4>
          <div className="space-y-2 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Friend signs up with your link → They get +2 credits
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Friend makes first generation → You get +5 credits
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">★</span>
              Max 50 referrals per account
            </div>
          </div>
        </div>
      </div>

      {/* Referral History */}
      {stats.history && stats.history.length > 0 && (
        <div className="border-t border-white/10 p-6">
          <h4 className="text-sm font-medium text-white mb-4">Recent Referrals</h4>
          <div className="space-y-2">
            {stats.history.slice(0, 5).map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3"
              >
                <div>
                  <div className="text-sm text-white">
                    {referral.refereeEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')}
                  </div>
                  <div className="text-xs text-white/40">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    referral.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : referral.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {referral.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
