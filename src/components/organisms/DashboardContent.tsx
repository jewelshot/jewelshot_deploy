/**
 * DashboardContent Component
 *
 * Comprehensive dashboard with real data analytics.
 * All data is fetched from Supabase - NO MOCK DATA.
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Keyboard,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  TrendingUp,
  Sparkles,
  HardDrive,
  CalendarClock,
} from 'lucide-react';
import { createScopedLogger } from '@/lib/logger';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { NotificationCenter } from '@/components/molecules/NotificationCenter';

const logger = createScopedLogger('Dashboard');

// ============================================
// TYPES
// ============================================
interface GalleryImage {
  id: string;
  name: string;
  original_url: string;
  generated_url: string;
  created_at: string;
  size: number;
  file_type?: string | null;
  preset_id?: string | null;
  preset_name?: string | null;
}

interface DailyUsage {
  date: string;
  count: number;
  dayName: string;
}

interface PresetUsage {
  name: string;
  count: number;
  percentage: number;
}

interface BatchJob {
  id: string;
  name: string;
  status: string;
  total_images: number;
  completed_images: number;
  failed_images: number;
  created_at: string;
}

interface PlanInfo {
  name: string;
  creditsUsed: number;
  creditsTotal: number;
  percentUsed: number;
  renewalDate: string | null;
}

interface StorageBreakdown {
  type: string;
  label: string;
  size: number;
  count: number;
  color: string;
}

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
  { keys: ['[', ']'], action: 'Brush size' },
  { keys: ['1-9'], action: 'Quick presets' },
];

const FILE_TYPE_COLORS: Record<string, string> = {
  'image/jpeg': '#71717a',
  'image/png': '#a1a1aa',
  'image/webp': '#d4d4d8',
  'image/gif': '#52525b',
  'other': '#3f3f46',
};

// ============================================
// MAIN COMPONENT
// ============================================
export function DashboardContent() {
  const router = useRouter();
  const { leftOpen } = useSidebarStore();
  const { credits, loading: creditsLoading, fetchCredits } = useCreditStore();
  const { t } = useLanguage();

  // Core State
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // Data State
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    name: 'Free',
    creditsUsed: 0,
    creditsTotal: 10,
    percentUsed: 0,
    renewalDate: null,
  });

  // Analytics State
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  const [presetUsage, setPresetUsage] = useState<PresetUsage[]>([]);
  const [activeBatches, setActiveBatches] = useState<BatchJob[]>([]);
  const [recentBatches, setRecentBatches] = useState<BatchJob[]>([]);
  const [storageBreakdown, setStorageBreakdown] = useState<StorageBreakdown[]>([]);

  // UI State
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastUsedPreset, setLastUsedPreset] = useState<{ id: string; name: string } | null>(null);

  // ============================================
  // COMPUTED: Weekly/Monthly Usage Data
  // ============================================
  const usageData = useMemo((): DailyUsage[] => {
    const days: DailyUsage[] = [];
    const now = new Date();
    const daysToShow = timeRange === 'week' ? 7 : 30;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = timeRange === 'week'
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.getDate().toString();

      const count = allImages.filter(img => {
        const imgDate = new Date(img.created_at).toISOString().split('T')[0];
        return imgDate === dateStr;
      }).length;

      days.push({ date: dateStr, count, dayName });
    }

    return days;
  }, [allImages, timeRange]);

  const maxUsageCount = useMemo(() => {
    return Math.max(...usageData.map(d => d.count), 1);
  }, [usageData]);

  const periodTotal = useMemo(() => {
    return usageData.reduce((sum, d) => sum + d.count, 0);
  }, [usageData]);

  // ============================================
  // DATA FETCHING (PARALLEL)
  // ============================================
  const fetchDashboardData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      setUserName(user.user_metadata?.full_name?.split(' ')[0] || '');

      // ========== RUN ALL QUERIES IN PARALLEL (OPTIMIZED) ==========
      // Only fetch what we need, with strict limits
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [
        profileResult,
        // Count only (very fast, head: true)
        galleryCountResult,
        // Recent images for display (only 8, minimal fields)
        recentGalleryResult,
        // Last 30 days for analytics (minimal fields)
        analyticsGalleryResult,
        // Batch images count only
        batchCountResult,
        // Recent batch images for display
        recentBatchImagesResult,
        // Batch projects
        batchProjectsResult,
      ] = await Promise.all([
        // Profile - minimal fields
        supabase
          .from('profiles')
          .select('subscription_plan, subscription_renewal_date, credits')
          .eq('id', user.id)
          .single(),
        // Gallery count only (super fast)
        supabase
          .from('images')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        // Recent 8 images for display - minimal fields
        supabase
          .from('images')
          .select('id, name, original_url, generated_url, created_at, size, file_type, preset_name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(8),
        // Last 30 days for analytics - only date and preset
        supabase
          .from('images')
          .select('id, created_at, preset_name, size, file_type')
          .eq('user_id', user.id)
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(500),
        // Batch images count only
        supabase
          .from('batch_images')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed'),
        // Recent batch images - minimal fields, limited
        supabase
          .from('batch_images')
          .select('id, original_filename, original_url, result_url, original_size, created_at')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(8),
        // Batch projects - minimal fields
        supabase
          .from('batch_projects')
          .select('id, name, status, total_images, completed_images, failed_images, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      // ========== PROCESS PROFILE ==========
      const profile = profileResult.data as { subscription_plan?: string; subscription_renewal_date?: string; credits?: number } | null;
      if (profile) {
        const plan = profile.subscription_plan || 'free';
        const total = PLAN_CREDITS[plan] || 10;
        const used = total - (profile.credits || 0);
        const percent = total > 0 ? Math.round((used / total) * 100) : 0;

        setPlanInfo({
          name: plan.charAt(0).toUpperCase() + plan.slice(1),
          creditsUsed: used,
          creditsTotal: total,
          percentUsed: percent,
          renewalDate: profile.subscription_renewal_date || null,
        });
      }

      // ========== PROCESS COUNTS ==========
      const galleryCount = galleryCountResult.count as number || 0;
      const batchCount = batchCountResult.count as number || 0;

      // ========== PROCESS RECENT GALLERY IMAGES ==========
      const recentGalleryImages = recentGalleryResult.data as GalleryImage[] | null;
      
      // ========== PROCESS ANALYTICS DATA ==========
      const analyticsImages = analyticsGalleryResult.data as Array<{
        id: string;
        created_at: string;
        preset_name: string | null;
        size: number;
        file_type: string | null;
      }> | null;

      // ========== PROCESS BATCH IMAGES ==========
      const recentBatchImages = recentBatchImagesResult.data as Array<{
        id: string;
        original_filename: string;
        original_url: string | null;
        result_url: string | null;
        original_size: number;
        created_at: string;
      }> | null;

      // ========== PROCESS BATCH PROJECTS ==========
      const batchProjects = batchProjectsResult.data as BatchJob[] | null;
      if (batchProjects) {
        const active = batchProjects.filter(b => b.status === 'processing');
        setActiveBatches(active);
        const completed = batchProjects.filter(b => b.status === 'completed').slice(0, 3);
        setRecentBatches(completed);
      }

      // ========== CALCULATE TOTALS (using counts, not full data) ==========
      const totalImageCount = galleryCount + batchCount;

      // Storage from analytics data (last 30 days only for speed)
      const galleryStorage = analyticsImages?.reduce((acc, img) => acc + (img.size || 0), 0) || 0;
      const batchStorage = recentBatchImages?.reduce((acc, img) => acc + (img.original_size || 0), 0) || 0;

      // ========== STORAGE BREAKDOWN (from analytics data) ==========
      if (analyticsImages && analyticsImages.length > 0) {
        const breakdown: Record<string, { size: number; count: number }> = {};
        
        analyticsImages.forEach(img => {
          const fileType = img.file_type || 'image/jpeg';
          if (!breakdown[fileType]) {
            breakdown[fileType] = { size: 0, count: 0 };
          }
          breakdown[fileType].size += img.size || 0;
          breakdown[fileType].count += 1;
        });

        const storageStats: StorageBreakdown[] = Object.entries(breakdown)
          .map(([type, data]) => ({
            type,
            label: type.replace('image/', '').toUpperCase(),
            size: data.size,
            count: data.count,
            color: FILE_TYPE_COLORS[type] || FILE_TYPE_COLORS['other'],
          }))
          .sort((a, b) => b.size - a.size);

        setStorageBreakdown(storageStats);
      }

      // ========== PRESET USAGE ANALYTICS (from analytics data) ==========
      if (analyticsImages && analyticsImages.length > 0) {
        const presetCounts: Record<string, number> = {};
        analyticsImages.forEach(img => {
          const presetName = img.preset_name || 'No Preset';
          presetCounts[presetName] = (presetCounts[presetName] || 0) + 1;
        });

        const totalWithPresets = Object.values(presetCounts).reduce((a, b) => a + b, 0);
        const presetStats: PresetUsage[] = Object.entries(presetCounts)
          .map(([name, count]) => ({
            name,
            count,
            percentage: Math.round((count / totalWithPresets) * 100),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setPresetUsage(presetStats);

        // Last used preset from recent gallery images
        const lastWithPreset = recentGalleryImages?.find(img => img.preset_name);
        if (lastWithPreset) {
          setLastUsedPreset({
            id: lastWithPreset.preset_id || '',
            name: lastWithPreset.preset_name!,
          });
        }
      }

      // ========== COMBINE RECENT IMAGES FOR DISPLAY ==========
      const batchAsGallery: GalleryImage[] = (recentBatchImages || []).map(img => ({
        id: img.id,
        name: img.original_filename,
        original_url: img.original_url || '',
        generated_url: img.result_url || img.original_url || '',
        created_at: img.created_at,
        size: img.original_size,
      }));

      const combinedRecent = [
        ...(recentGalleryImages || []),
        ...batchAsGallery,
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
       .slice(0, 8);

      // For analytics chart, use analytics data
      const analyticsForChart = (analyticsImages || []).map(img => ({
        id: img.id,
        name: '',
        original_url: '',
        generated_url: '',
        created_at: img.created_at,
        size: img.size,
        preset_name: img.preset_name,
      }));

      setAllImages(analyticsForChart);
      setRecentImages(combinedRecent);
      setTotalGenerations(totalImageCount);
      setTotalStorage(galleryStorage + batchStorage);

    } catch (error) {
      logger.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    fetchCredits();

    const stored = localStorage.getItem('jewelshot_last_preset');
    if (stored) {
      try {
        setLastUsedPreset(JSON.parse(stored));
      } catch {
        // Ignore
      }
    }
  }, [fetchDashboardData, fetchCredits]);

  // ============================================
  // HANDLERS
  // ============================================
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
  };

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

  const handleQuickGenerate = () => {
    if (lastUsedPreset) {
      sessionStorage.setItem('studio-quick-preset', JSON.stringify(lastUsedPreset));
    }
    router.push('/studio');
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading || creditsLoading) {
    return (
      <main
        className="fixed inset-0 flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
        style={{ paddingLeft: leftOpen ? '260px' : '0' }}
      >
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60 mx-auto" />
          <p className="text-sm text-white/40">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <main
      className="fixed inset-0 overflow-y-auto transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{ paddingLeft: leftOpen ? '260px' : '0' }}
    >
      <div className="min-h-screen p-6">
        {/* ==================== HEADER ==================== */}
        <div className="mb-6 flex items-center justify-between">
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

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <NotificationCenter />

            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/60 hover:bg-white/[0.06] transition-colors"
            >
              <Keyboard className="h-3.5 w-3.5" />
              Shortcuts
            </button>
          </div>
        </div>

        {/* ==================== STATS ROW ==================== */}
        <div className="mb-5 grid grid-cols-4 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Credits</p>
            <p className="text-2xl font-semibold text-white">{credits}</p>
            <p className="text-[10px] text-white/30 mt-1">of {planInfo.creditsTotal}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Total Images</p>
            <p className="text-2xl font-semibold text-white">{totalGenerations}</p>
            <p className="text-[10px] text-white/30 mt-1">all time</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{t.dashboard.storage}</p>
            <p className="text-2xl font-semibold text-white">{formatBytes(totalStorage)}</p>
            <p className="text-[10px] text-white/30 mt-1">used</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
              {timeRange === 'week' ? 'This Week' : 'This Month'}
            </p>
            <p className="text-2xl font-semibold text-white">{periodTotal}</p>
            <p className="text-[10px] text-white/30 mt-1">generations</p>
          </div>
        </div>

        {/* ==================== ANALYTICS & PLAN ROW ==================== */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {/* Usage Analytics (2/3) */}
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40">
                Usage Analytics
              </p>
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                <button
                  onClick={() => setTimeRange('week')}
                  className={`px-3 py-1 text-[10px] transition-colors ${timeRange === 'week'
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/60'
                    }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeRange('month')}
                  className={`px-3 py-1 text-[10px] transition-colors ${timeRange === 'month'
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/60'
                    }`}
                >
                  Month
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between gap-1 h-28">
              {usageData.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex items-end justify-center h-20">
                    <div
                      className="w-full max-w-[24px] rounded-t transition-all duration-300 hover:opacity-80"
                      style={{
                        height: day.count > 0 ? `${(day.count / maxUsageCount) * 100}%` : '3px',
                        backgroundColor: day.count > 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255,255,255,0.08)',
                        minHeight: '3px',
                      }}
                      title={`${day.date}: ${day.count} generations`}
                    />
                  </div>
                  <span className="text-[9px] text-white/30">{day.dayName}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] text-white/40">
              <span>Total: {periodTotal} generations</span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {usageData.length > 0 && usageData[usageData.length - 1].count > 0 ? 'Active today' : 'No activity today'}
              </span>
            </div>
          </div>

          {/* Plan & Limits (1/3) */}
          <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40">{t.dashboard.plan}</p>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/60">
                {planInfo.name}
              </span>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-white/50">{t.dashboard.creditUsage}</span>
                <span className="text-[10px] text-white/50">{planInfo.percentUsed}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${planInfo.percentUsed > 90 ? 'bg-red-500/60' :
                      planInfo.percentUsed > 70 ? 'bg-yellow-500/60' :
                        'bg-white/40'
                    }`}
                  style={{ width: `${planInfo.percentUsed}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-white/30">
                {planInfo.creditsUsed} of {planInfo.creditsTotal} used
              </p>
            </div>

            {/* Renewal Date */}
            {planInfo.renewalDate && (
              <div className="mb-3 flex items-center gap-2 text-[10px] text-white/40">
                <CalendarClock className="h-3 w-3" />
                <span>
                  Renews {new Date(planInfo.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}

            {planInfo.percentUsed > 80 && (
              <div className="mb-3 flex items-start gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-2">
                <AlertCircle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-yellow-500/80">
                  {planInfo.percentUsed >= 100 ? 'Credits depleted!' : 'Running low on credits'}
                </p>
              </div>
            )}

            {planInfo.name === 'Free' && (
              <Link
                href="/profile?tab=billing"
                className="flex items-center justify-center gap-1 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-white/60 hover:text-white/80 transition-colors"
              >
                {t.dashboard.upgradePlan}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        {/* ==================== PRESETS & STORAGE & BATCHES ROW ==================== */}
        <div className="mb-5 grid grid-cols-4 gap-3">
          {/* Most Used Presets */}
          <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-4">
              {t.dashboard.topPresets}
            </p>

            {presetUsage.length > 0 ? (
              <div className="space-y-2.5">
                {presetUsage.map((preset, i) => (
                  <div key={preset.name} className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30 w-3">{i + 1}.</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/70 truncate">{preset.name}</p>
                      <div className="mt-0.5 h-1 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white/40"
                          style={{ width: `${preset.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-white/40">{preset.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-white/30">{t.dashboard.noDataYet}</p>
            )}
          </div>

          {/* Storage Breakdown */}
          <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40">
                {t.dashboard.storage}
              </p>
              <HardDrive className="h-3.5 w-3.5 text-white/30" />
            </div>

            {storageBreakdown.length > 0 ? (
              <>
                {/* Mini Pie Chart (CSS) */}
                <div className="flex justify-center mb-3">
                  <div 
                    className="w-16 h-16 rounded-full"
                    style={{
                      background: `conic-gradient(${storageBreakdown.map((item, i, arr) => {
                        const prevPercent = arr.slice(0, i).reduce((acc, it) => acc + (it.size / totalStorage * 100), 0);
                        const thisPercent = item.size / totalStorage * 100;
                        return `${item.color} ${prevPercent}% ${prevPercent + thisPercent}%`;
                      }).join(', ')})`,
                    }}
                  />
                </div>
                
                <div className="space-y-1.5">
                  {storageBreakdown.map(item => (
                    <div key={item.type} className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white/60">{item.label}</span>
                      </div>
                      <span className="text-white/40">{formatBytes(item.size)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[11px] text-white/30">{t.dashboard.noFilesYet}</p>
            )}
          </div>

          {/* Quick Generation */}
          <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-4">
              {t.dashboard.quickGenerate}
            </p>

            {lastUsedPreset ? (
              <div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5 mb-3">
                  <p className="text-[11px] text-white truncate">{lastUsedPreset.name}</p>
                  <p className="text-[10px] text-white/40">{t.dashboard.lastUsed}</p>
                </div>
                <button
                  onClick={handleQuickGenerate}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] text-white transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  {t.dashboard.generate}
                </button>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-[11px] text-white/40 mb-2">{t.dashboard.noRecentPreset}</p>
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-white/60 transition-colors"
                >
                  {t.dashboard.goToStudio}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Batch Status */}
          <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-wider text-white/40">
                {t.dashboard.batches}
              </p>
              {activeBatches.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-yellow-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {activeBatches.length}
                </span>
              )}
            </div>

            {activeBatches.length > 0 ? (
              <div className="space-y-2">
                {activeBatches.slice(0, 2).map((batch) => (
                  <div key={batch.id} className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] text-white truncate flex-1">{batch.name}</p>
                      <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />
                    </div>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-yellow-500/60"
                        style={{ width: `${batch.total_images > 0 ? (batch.completed_images / batch.total_images) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">
                      {batch.completed_images}/{batch.total_images}
                    </p>
                  </div>
                ))}
              </div>
            ) : recentBatches.length > 0 ? (
              <div className="space-y-1.5">
                {recentBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center gap-2 text-[11px]">
                    <CheckCircle2 className="h-3 w-3 text-green-500/60" />
                    <span className="text-white/60 truncate flex-1">{batch.name}</span>
                    <span className="text-white/30">{batch.total_images}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-white/30">No batches</p>
            )}

            <Link
              href="/batch"
              className="mt-3 flex items-center justify-center gap-1 w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-white/50 transition-colors"
            >
              View All
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* ==================== RECENT IMAGES ==================== */}
        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] uppercase tracking-wider text-white/40">
              Recent Images
            </p>
            <Link
              href="/gallery"
              className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/50 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentImages.length > 0 ? (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
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

                  {hoveredImage === image.id && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-1.5 animate-in fade-in duration-150">
                      <button
                        onClick={() => handleOpenInStudio(image)}
                        className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                        title={t.dashboard.editInStudio}
                      >
                        <Edit3 className="h-3.5 w-3.5 text-white" />
                      </button>
                      <button
                        onClick={() => handleDownload(image)}
                        className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                        title={t.common.download}
                      >
                        <Download className="h-3.5 w-3.5 text-white" />
                      </button>
                      <a
                        href={image.generated_url || image.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                        title={t.dashboard.openInNew}
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-white" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-white/30 mb-2">{t.empty.noImages}</p>
              <Link href="/studio" className="text-xs text-white/50 hover:text-white/70">
                {t.dashboard.createFirstImage} →
              </Link>
            </div>
          )}
        </div>

        {/* ==================== QUICK ACTIONS ==================== */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { href: '/studio', title: 'Studio', desc: 'Create images' },
            { href: '/batch', title: 'Batch', desc: 'Process multiple' },
            { href: '/gallery', title: 'Gallery', desc: 'View your work' },
            { href: '/profile', title: 'Account', desc: 'Settings & billing' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition-colors group"
            >
              <p className="text-sm font-medium text-white group-hover:text-white/90">{action.title}</p>
              <p className="text-[10px] text-white/30">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ==================== KEYBOARD SHORTCUTS MODAL ==================== */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{t.dashboard.keyboardShortcuts}</h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-white/60" />
              </button>
            </div>

            <div className="space-y-2">
              {KEYBOARD_SHORTCUTS.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-sm text-white/70">{shortcut.action}</span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, j) => (
                      <span key={j}>
                        <kbd className="px-2 py-1 rounded bg-white/10 text-xs text-white/80 font-mono">
                          {key}
                        </kbd>
                        {j < shortcut.keys.length - 1 && (
                          <span className="text-white/30 mx-1">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowShortcuts(false)}
              className="mt-4 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/60 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================
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
