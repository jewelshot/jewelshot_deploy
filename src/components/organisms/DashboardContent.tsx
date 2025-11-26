/**
 * DashboardContent Component
 *
 * Enterprise dashboard with stats, charts, and activity.
 * Responsive to sidebar collapse/expand state.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCreditStore } from '@/store/creditStore';
import { createClient } from '@/lib/supabase/client';
import {
  TrendingUp,
  Sparkles,
  HardDrive,
  CreditCard,
  Clock,
  Image as ImageIcon,
  Zap,
  Calendar,
} from 'lucide-react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('Dashboard');

interface DashboardStats {
  totalGenerations: number;
  totalStorage: number;
  accountAge: number;
  recentImages: any[];
  recentActivity: any[];
}

export function DashboardContent() {
  const { leftOpen } = useSidebarStore();
  const { credits, loading: creditsLoading, fetchCredits } = useCreditStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalGenerations: 0,
    totalStorage: 0,
    accountAge: 0,
    recentImages: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        setUserName(user.user_metadata?.full_name || 'User');

        // Get total images count
        const { count: imagesCount } = await supabase
          .from('images')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get recent images (last 6)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: recentImages } = (await supabase
          .from('images')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6)) as { data: any };

        // Get total storage
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: images } = (await supabase
          .from('images')
          .select('size')
          .eq('user_id', user.id)) as { data: any };

        const totalStorage =
          images?.reduce((acc: number, img: any) => acc + (img.size || 0), 0) ||
          0;

        // Calculate account age
        const accountCreated = new Date(user.created_at);
        const now = new Date();
        const accountAge = Math.floor(
          (now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Mock recent activity
        const recentActivity = [
          {
            type: 'generation',
            message: 'Generated new image',
            time: '2 minutes ago',
          },
          {
            type: 'upload',
            message: 'Uploaded to gallery',
            time: '1 hour ago',
          },
          {
            type: 'favorite',
            message: 'Added to favorites',
            time: '3 hours ago',
          },
          { type: 'batch', message: 'Created batch job', time: '5 hours ago' },
          {
            type: 'credit',
            message: 'Credits recharged',
            time: '1 day ago',
          },
        ];

        setStats({
          totalGenerations: imagesCount || 0,
          totalStorage,
          accountAge,
          recentImages: recentImages || [],
          recentActivity,
        });
      } catch (error) {
        logger.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      <main
        className="fixed inset-0 flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
        style={{
          paddingLeft: leftOpen ? '260px' : '0',
        }}
      >
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  const statCards = [
    {
      icon: CreditCard,
      label: 'Available Credits',
      value: credits.toString(),
      change: '+12%',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: Sparkles,
      label: 'Total Generations',
      value: stats.totalGenerations.toString(),
      change: '+8%',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: formatBytes(stats.totalStorage),
      change: '+5%',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: Zap,
      label: 'Account Age',
      value: `${stats.accountAge} days`,
      change: 'Active',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
    },
  ];

  return (
    <main
      className="fixed inset-0 overflow-y-auto transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        paddingLeft: leftOpen ? '260px' : '0',
      }}
    >
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent">
            Welcome back, {userName}!
          </h1>
          <p className="text-white/60">
            Here's what's happening with your account today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`group rounded-2xl border ${card.borderColor} ${card.bgColor} p-6 backdrop-blur-sm transition-all hover:scale-105`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-xl bg-gradient-to-r ${card.color} p-3`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-green-400">
                    {card.change}
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

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Images - 2/3 width */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Recent Images
                </h2>
                <a
                  href="/gallery"
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  View All →
                </a>
              </div>
              {stats.recentImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {stats.recentImages.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                    >
                      <img
                        src={image.generated_url || image.original_url}
                        alt={image.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="truncate text-xs text-white">
                            {image.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <ImageIcon className="mx-auto mb-4 h-12 w-12 text-white/20" />
                  <p className="text-white/60">No images yet</p>
                  <a
                    href="/studio"
                    className="mt-2 inline-block text-sm text-purple-400 hover:text-purple-300"
                  >
                    Create your first image →
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                      <Clock className="h-4 w-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.message}</p>
                      <p className="text-xs text-white/40">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <a
              href="/studio"
              className="group rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 transition-all hover:border-purple-500/50 hover:bg-purple-500/20"
            >
              <Sparkles className="mb-2 h-6 w-6 text-purple-400" />
              <h3 className="mb-1 font-semibold text-white">Create Image</h3>
              <p className="text-xs text-white/60">Generate new AI images</p>
            </a>
            <a
              href="/batch"
              className="group rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 transition-all hover:border-blue-500/50 hover:bg-blue-500/20"
            >
              <ImageIcon className="mb-2 h-6 w-6 text-blue-400" />
              <h3 className="mb-1 font-semibold text-white">Batch Process</h3>
              <p className="text-xs text-white/60">Process multiple images</p>
            </a>
            <a
              href="/gallery"
              className="group rounded-xl border border-green-500/30 bg-green-500/10 p-4 transition-all hover:border-green-500/50 hover:bg-green-500/20"
            >
              <ImageIcon className="mb-2 h-6 w-6 text-green-400" />
              <h3 className="mb-1 font-semibold text-white">View Gallery</h3>
              <p className="text-xs text-white/60">Browse your images</p>
            </a>
            <a
              href="/profile"
              className="group rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 transition-all hover:border-orange-500/50 hover:bg-orange-500/20"
            >
              <Calendar className="mb-2 h-6 w-6 text-orange-400" />
              <h3 className="mb-1 font-semibold text-white">Upgrade Plan</h3>
              <p className="text-xs text-white/60">Get more credits</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardContent;

