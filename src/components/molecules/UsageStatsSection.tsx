/**
 * UsageStatsSection Component
 *
 * Display user's usage statistics: credits, generations, storage.
 * Visual cards with charts and metrics.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useCreditStore } from '@/store/creditStore';
import {
  CreditCard,
  Sparkles,
  HardDrive,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { createScopedLogger } from '@/lib/logger';
import { toast } from 'sonner';

const logger = createScopedLogger('UsageStats');

interface Stats {
  totalGenerations: number;
  totalStorage: number; // in bytes
  accountAge: number; // in days
  creditsUsed: number;
}

export function UsageStatsSection() {
  const { credits, loading: creditsLoading, fetchCredits } = useCreditStore();
  const [stats, setStats] = useState<Stats>({
    totalGenerations: 0,
    totalStorage: 0,
    accountAge: 0,
    creditsUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [addingCredits, setAddingCredits] = useState(false);

  // TEST FUNCTION - Remove before production
  const handleAddTestCredits = async () => {
    setAddingCredits(true);
    try {
      const response = await fetch('/api/credits/add-test', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        logger.info('Added 10 credits. New balance:', data.balance);
        toast.success(`Added 10 credits! Balance: ${data.balance}`);
        // Refresh credits
        await fetchCredits();
      } else {
        const error = await response.json();
        logger.error('Failed to add credits:', error);
        toast.error(`Failed: ${error.error}`);
      }
    } catch (error) {
      logger.error('Error adding test credits:', error);
      toast.error('Network error');
    } finally {
      setAddingCredits(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Get total images count
        const { count: imagesCount } = await supabase
          .from('images')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get total storage (sum of sizes)
         
        const { data: images } = (await supabase
          .from('images')
          .select('size')
          .eq('user_id', user.id)) as { data: any };

        const totalStorage =
          images?.reduce((acc: number, img: any) => acc + (img.size || 0), 0) || 0;

        // Calculate account age
        const accountCreated = new Date(user.created_at);
        const now = new Date();
        const accountAge = Math.floor(
          (now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Get credits history from user_credits table
         
        const { data: creditData } = (await supabase
          .from('user_credits')
          .select('total_spent')
          .eq('user_id', user.id)
          .maybeSingle()) as { data: any };

        setStats({
          totalGenerations: imagesCount || 0,
          totalStorage,
          accountAge,
          creditsUsed: creditData?.total_spent || 0,
        });
      } catch (error) {
        logger.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchCredits();
  }, [fetchCredits]);

  // Format bytes to human readable
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading || creditsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: CreditCard,
      label: 'Available Credits',
      value: credits.toString(),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: Sparkles,
      label: 'Total Generations',
      value: stats.totalGenerations.toString(),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: formatBytes(stats.totalStorage),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Credits Used',
      value: stats.creditsUsed.toString(),
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
    {
      icon: Calendar,
      label: 'Account Age',
      value: `${stats.accountAge} days`,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-white">Usage & Stats</h2>
        <p className="text-white/60">
          Track your account activity and resource usage
        </p>
      </div>

      {/* TEST BUTTON - REMOVE BEFORE PRODUCTION */}
      <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-yellow-400">Test Mode</p>
            <p className="text-xs text-white/60">Click to add 10 credits (for testing only)</p>
          </div>
          <button
            onClick={handleAddTestCredits}
            disabled={addingCredits}
            className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingCredits ? 'Adding...' : '+ 10 Credits'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`group rounded-2xl border ${card.borderColor} ${card.bgColor} p-6 backdrop-blur-sm transition-all hover:scale-105 hover:border-opacity-40`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`rounded-xl bg-gradient-to-r ${card.color} p-3`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-white/60">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <h3 className="mb-4 text-lg font-semibold text-white">Quick Tips</h3>
        <ul className="space-y-2 text-sm text-white/70">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-purple-400">•</span>
            <span>
              Each AI generation consumes 1 credit. Plan your designs wisely!
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-purple-400">•</span>
            <span>
              Free tier includes 5 AI requests per minute. Upgrade for more.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-purple-400">•</span>
            <span>
              Storage limit is 1GB for free users. Delete unused images to free
              space.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UsageStatsSection;

