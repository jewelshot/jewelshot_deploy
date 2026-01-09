/**
 * DashboardContent Component
 *
 * Clean, minimal dashboard with usage analytics.
 * Layout: Stats → Analytics → Content → Quick Actions
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCreditStore } from '@/store/creditStore';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowRight,
  Download,
  Edit3,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('Dashboard');

interface GalleryImage {
  id: string;
  name: string;
  original_url: string;
  generated_url: string;
  created_at: string;
  size: number;
}

interface DailyUsage {
  date: string;
  count: number;
  dayName: string;
}

interface PlanInfo {
  name: string;
  creditsUsed: number;
  creditsTotal: number;
  renewalDate: string | null;
}

export function DashboardContent() {
  const router = useRouter();
  const { leftOpen } = useSidebarStore();
  const { credits, loading: creditsLoading, fetchCredits } = useCreditStore();
  
  // State
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    name: 'Free',
    creditsUsed: 0,
    creditsTotal: 10,
    renewalDate: null,
  });

  // Calculate weekly usage from images
  const weeklyUsage = useMemo((): DailyUsage[] => {
    const days: DailyUsage[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const count = allImages.filter(img => {
        const imgDate = new Date(img.created_at).toISOString().split('T')[0];
        return imgDate === dateStr;
      }).length;
      
      days.push({ date: dateStr, count, dayName });
    }
    
    return days;
  }, [allImages]);

  // Max count for chart scaling
  const maxCount = useMemo(() => {
    return Math.max(...weeklyUsage.map(d => d.count), 1);
  }, [weeklyUsage]);

  // This week total
  const thisWeekTotal = useMemo(() => {
    return weeklyUsage.reduce((sum, d) => sum + d.count, 0);
  }, [weeklyUsage]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        setUserName(user.user_metadata?.full_name?.split(' ')[0] || '');

        // Get user profile for plan info
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_plan, subscription_status, credits')
          .eq('id', user.id)
          .single();

        if (profile) {
          const planCredits: Record<string, number> = {
            free: 10,
            pro: 500,
            enterprise: 9999,
          };
          const plan = profile.subscription_plan || 'free';
          const total = planCredits[plan] || 10;
          
          setPlanInfo({
            name: plan.charAt(0).toUpperCase() + plan.slice(1),
            creditsUsed: total - (profile.credits || 0),
            creditsTotal: total,
            renewalDate: null, // Would come from billing
          });
        }

        // Get all images for analytics (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: images, count } = await supabase
          .from('images')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false });

        if (images) {
          setAllImages(images);
          setRecentImages(images.slice(0, 8));
          setTotalGenerations(count || 0);
          
          const storage = images.reduce((acc, img) => acc + (img.size || 0), 0);
          setTotalStorage(storage);
        }
      } catch (error) {
        logger.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchCredits();
  }, [fetchCredits]);

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
  };

  // Image actions
  const handleOpenInStudio = (image: GalleryImage) => {
    sessionStorage.setItem('studio-import-image', image.generated_url || image.original_url);
    sessionStorage.setItem('studio-import-source', 'dashboard');
    sessionStorage.setItem('studio-import-timestamp', Date.now().toString());
    router.push('/studio');
  };

  const handleDownload = async (image: GalleryImage) => {
    try {
      const response = await fetch(image.generated_url || image.original_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.name || 'image.png';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading || creditsLoading) {
    return (
      <main
        className="fixed inset-0 flex items-center justify-center transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
        style={{ paddingLeft: leftOpen ? '260px' : '0' }}
      >
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60 mx-auto" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </main>
    );
  }

  // Credit usage percentage
  const creditUsagePercent = planInfo.creditsTotal > 0 
    ? Math.round((planInfo.creditsUsed / planInfo.creditsTotal) * 100)
    : 0;

  return (
    <main
      className="fixed inset-0 overflow-y-auto transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{ paddingLeft: leftOpen ? '260px' : '0' }}
    >
      <div className="min-h-screen p-8">
        {/* ==================== HEADER ==================== */}
        <div className="mb-6">
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

        {/* ==================== STATS ROW ==================== */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Credits</p>
            <p className="text-2xl font-semibold text-white">{credits}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Total Images</p>
            <p className="text-2xl font-semibold text-white">{totalGenerations}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">Storage</p>
            <p className="text-2xl font-semibold text-white">{formatBytes(totalStorage)}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[11px] uppercase tracking-wider text-white/40 mb-1">This Week</p>
            <p className="text-2xl font-semibold text-white">{thisWeekTotal}</p>
          </div>
        </div>

        {/* ==================== ANALYTICS ROW ==================== */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {/* Usage Chart - 2/3 width */}
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] uppercase tracking-wider text-white/40">
                Last 7 Days
              </p>
              <p className="text-xs text-white/30">
                {thisWeekTotal} generations
              </p>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-24">
              {weeklyUsage.map((day, i) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-16">
                    <div 
                      className="w-full max-w-[32px] rounded-t transition-all duration-300"
                      style={{
                        height: day.count > 0 ? `${(day.count / maxCount) * 100}%` : '4px',
                        backgroundColor: day.count > 0 ? 'rgba(168, 85, 247, 0.6)' : 'rgba(255,255,255,0.1)',
                        minHeight: '4px',
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-white/30">{day.dayName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Plan & Limits - 1/3 width */}
          <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] uppercase tracking-wider text-white/40">Plan</p>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">
                {planInfo.name}
              </span>
            </div>
            
            {/* Credit Usage Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-white/50">Credit Usage</span>
                <span className="text-xs text-white/50">{creditUsagePercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-purple-500/60 transition-all duration-500"
                  style={{ width: `${creditUsagePercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-white/30">
                {planInfo.creditsUsed} of {planInfo.creditsTotal} used
              </p>
            </div>

            {planInfo.name === 'Free' && (
              <a 
                href="/profile?tab=billing"
                className="mt-3 flex items-center justify-center gap-1 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white/80 transition-colors"
              >
                Upgrade Plan
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {/* Recent Images - 2/3 width */}
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] uppercase tracking-wider text-white/40">
                Recent Images
              </p>
              <a
                href="/gallery"
                className="flex items-center gap-1 text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                View all <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            {recentImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {recentImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/30"
                    onMouseEnter={() => setHoveredImage(image.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img
                      src={image.generated_url || image.original_url}
                      alt={image.name}
                      className="h-full w-full object-cover"
                    />
                    
                    {/* Hover Overlay */}
                    {hoveredImage === image.id && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-2 animate-in fade-in duration-150">
                        <button
                          onClick={() => handleOpenInStudio(image)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Edit in Studio"
                        >
                          <Edit3 className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleDownload(image)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4 text-white" />
                        </button>
                        <a
                          href={image.generated_url || image.original_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          title="Open"
                        >
                          <ExternalLink className="h-4 w-4 text-white" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-white/30 mb-2">No images yet</p>
                <a href="/studio" className="text-sm text-purple-400/80 hover:text-purple-400">
                  Create your first image →
                </a>
              </div>
            )}
          </div>

          {/* Activity - 1/3 width */}
          <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[11px] uppercase tracking-wider text-white/40 mb-4">
              Recent Activity
            </p>
            
            {recentImages.length > 0 ? (
              <div className="space-y-3">
                {recentImages.slice(0, 6).map((image) => (
                  <div key={image.id} className="flex items-start gap-3">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-white/20 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 truncate">
                        {image.name || 'Image generated'}
                      </p>
                      <p className="text-[10px] text-white/30">
                        {formatTimeAgo(new Date(image.created_at))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/30">No recent activity</p>
            )}
          </div>
        </div>

        {/* ==================== QUICK ACTIONS ==================== */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { href: '/studio', title: 'Studio', desc: 'Create images' },
            { href: '/batch', title: 'Batch', desc: 'Process multiple' },
            { href: '/gallery', title: 'Gallery', desc: 'View your work' },
            { href: '/profile', title: 'Account', desc: 'Settings & billing' },
          ].map((action) => (
            <a
              key={action.href}
              href={action.href}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-colors group"
            >
              <p className="text-sm font-medium text-white group-hover:text-white/90">{action.title}</p>
              <p className="text-[11px] text-white/30">{action.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

// Helper function
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default DashboardContent;
