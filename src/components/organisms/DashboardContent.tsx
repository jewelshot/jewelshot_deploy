/**
 * DashboardContent Component
 *
 * Clean, minimal dashboard consistent with Studio UI.
 * No colorful effects, no mock data, real activity from database.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCreditStore } from '@/store/creditStore';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowRight,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
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

interface ActivityItem {
  id: string;
  type: 'generation' | 'upload' | 'batch' | 'edit';
  message: string;
  time: string;
  created_at: string;
}

export function DashboardContent() {
  const router = useRouter();
  const { leftOpen } = useSidebarStore();
  const { credits, loading: creditsLoading, fetchCredits } = useCreditStore();
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'there');

        // Get total images count
        const { count: imagesCount } = await supabase
          .from('images')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        setTotalGenerations(imagesCount || 0);

        // Get recent images (last 8)
        const { data: images } = await supabase
          .from('images')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(8);

        if (images) {
          setRecentImages(images);
          
          // Calculate total storage
          const storage = images.reduce((acc, img) => acc + (img.size || 0), 0);
          setTotalStorage(storage);

          // Create activity from real data
          const activityItems: ActivityItem[] = images.slice(0, 5).map((img) => ({
            id: img.id,
            type: 'generation' as const,
            message: img.name || 'New image generated',
            time: formatTimeAgo(new Date(img.created_at)),
            created_at: img.created_at,
          }));
          setActivity(activityItems);
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

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
  };

  // Handle image actions
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

  return (
    <main
      className="fixed inset-0 overflow-y-auto transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{ paddingLeft: leftOpen ? '260px' : '0' }}
    >
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-semibold text-white">
            Welcome back{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-sm text-white/40">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 mb-1">Credits</p>
            <p className="text-2xl font-semibold text-white">{credits}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 mb-1">Total Images</p>
            <p className="text-2xl font-semibold text-white">{totalGenerations}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 mb-1">Storage Used</p>
            <p className="text-2xl font-semibold text-white">{formatBytes(totalStorage)}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40 mb-1">This Week</p>
            <p className="text-2xl font-semibold text-white">{recentImages.filter(img => {
              const imgDate = new Date(img.created_at);
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return imgDate > weekAgo;
            }).length}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Images */}
          <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                Recent Images
              </h2>
              <a
                href="/gallery"
                className="flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                View all
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            {recentImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-3">
                {recentImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black/20"
                    onMouseEnter={() => setHoveredImage(image.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img
                      src={image.generated_url || image.original_url}
                      alt={image.name}
                      className="h-full w-full object-cover"
                    />
                    
                    {/* Hover Overlay - Like Studio */}
                    {hoveredImage === image.id && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2">
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
                          title="Open in new tab"
                        >
                          <ExternalLink className="h-4 w-4 text-white" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-white/40 mb-2">No images yet</p>
                <a
                  href="/studio"
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Create your first image →
                </a>
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="lg:col-span-1 rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-sm font-medium text-white/60 uppercase tracking-wider">
              Activity
            </h2>
            
            {activity.length > 0 ? (
              <div className="space-y-4">
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-white/20 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">{item.message}</p>
                      <p className="text-xs text-white/30">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No recent activity</p>
            )}
          </div>
        </div>

        {/* Quick Actions - Minimal */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          <a
            href="/studio"
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
          >
            <p className="text-sm font-medium text-white mb-0.5">Studio</p>
            <p className="text-xs text-white/40">Create new images</p>
          </a>
          <a
            href="/batch"
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
          >
            <p className="text-sm font-medium text-white mb-0.5">Batch</p>
            <p className="text-xs text-white/40">Process multiple files</p>
          </a>
          <a
            href="/gallery"
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
          >
            <p className="text-sm font-medium text-white mb-0.5">Gallery</p>
            <p className="text-xs text-white/40">Browse your work</p>
          </a>
          <a
            href="/profile"
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
          >
            <p className="text-sm font-medium text-white mb-0.5">Account</p>
            <p className="text-xs text-white/40">Manage subscription</p>
          </a>
        </div>

        {/* Usage Tips - Collapsible */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/40">
              Tip: Use <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono text-[10px]">Ctrl+S</kbd> in Studio to save your work to Gallery
            </p>
            <a
              href="/docs/api"
              className="text-xs text-white/40 hover:text-white/60"
            >
              View shortcuts →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardContent;
