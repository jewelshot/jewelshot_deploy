/**
 * NotificationCenter Component
 * 
 * Unified notification center with:
 * - Admin announcements (from database)
 * - Local notifications (in-app events)
 * - Glassmorphism design
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Gift,
  CheckCircle2,
  Sparkles,
  Zap,
  Wrench,
  ExternalLink,
  Megaphone,
} from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import type { UserAnnouncement, AnnouncementType } from '@/lib/announcements/types';

// ============================================
// LOCAL NOTIFICATIONS (In-app events)
// ============================================

export type LocalNotificationType = 'success' | 'error' | 'info' | 'warning' | 'reward';

export interface LocalNotification {
  id: string;
  type: LocalNotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

// In-memory store for local notifications
let localNotifications: LocalNotification[] = [];
let listeners: ((notifications: LocalNotification[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...localNotifications]));
}

// Public API for local notifications
export function addNotification(notification: Omit<LocalNotification, 'id' | 'timestamp' | 'read'>) {
  const newNotification: LocalNotification = {
    ...notification,
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    read: false,
  };
  localNotifications = [newNotification, ...localNotifications].slice(0, 20);
  notifyListeners();
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('jewelshot_local_notifications', JSON.stringify(localNotifications));
  }
}

export function markLocalAsRead(id: string) {
  localNotifications = localNotifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  notifyListeners();
  if (typeof window !== 'undefined') {
    localStorage.setItem('jewelshot_local_notifications', JSON.stringify(localNotifications));
  }
}

export function clearLocalNotifications() {
  localNotifications = [];
  notifyListeners();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jewelshot_local_notifications');
  }
}

// Hook for local notifications
function useLocalNotifications() {
  const [notifs, setNotifs] = useState<LocalNotification[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jewelshot_local_notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          localNotifications = parsed.map((n: LocalNotification) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
          setNotifs(localNotifications);
        } catch {
          // Ignore parse errors
        }
      }
    }

    const listener = (updated: LocalNotification[]) => setNotifs(updated);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return notifs;
}

// ============================================
// ICON MAPPINGS
// ============================================

const localIconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
  reward: Gift,
};

const localColorMap = {
  success: 'text-green-400 bg-green-500/20',
  error: 'text-red-400 bg-red-500/20',
  info: 'text-blue-400 bg-blue-500/20',
  warning: 'text-yellow-400 bg-yellow-500/20',
  reward: 'text-purple-400 bg-purple-500/20',
};

const announcementIconMap: Record<AnnouncementType, typeof Sparkles> = {
  update: Sparkles,
  offer: Gift,
  alert: AlertCircle,
  feature: Zap,
  maintenance: Wrench,
};

const announcementColorMap: Record<AnnouncementType, string> = {
  update: 'text-blue-400 bg-blue-500/20',
  offer: 'text-purple-400 bg-purple-500/20',
  alert: 'text-yellow-400 bg-yellow-500/20',
  feature: 'text-green-400 bg-green-500/20',
  maintenance: 'text-red-400 bg-red-500/20',
};

// ============================================
// NOTIFICATION CENTER COMPONENT
// ============================================

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const localNotifs = useLocalNotifications();
  const { announcements, markAsRead } = useAnnouncements();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalUnread = announcements.length + localNotifs.filter(n => !n.read).length;

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleAnnouncementClick = (announcement: UserAnnouncement) => {
    markAsRead(announcement.id);
    if (announcement.action_url) {
      if (announcement.action_url.startsWith('http')) {
        window.open(announcement.action_url, '_blank');
      } else {
        window.location.href = announcement.action_url;
      }
    }
  };

  const handleLocalClick = (notification: LocalNotification) => {
    markLocalAsRead(notification.id);
    if (notification.action?.onClick) {
      notification.action.onClick();
    } else if (notification.action?.href) {
      window.location.href = notification.action.href;
    }
  };

  const dropdownContent = isOpen && mounted && (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[9999]" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed right-4 top-16 z-[10000] w-[360px] overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,10,10,0.95)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-500/20 p-1.5">
              <Bell className="h-4 w-4 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white">Notifications</h3>
            {totalUnread > 0 && (
              <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs font-bold text-white">
                {totalUnread}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto">
          {/* Announcements Section */}
          {announcements.length > 0 && (
            <div className="border-b border-white/5">
              <div className="flex items-center gap-2 px-4 py-2 text-xs text-white/40">
                <Megaphone className="h-3 w-3" />
                <span className="uppercase tracking-wider">Announcements</span>
              </div>
              {announcements.map((announcement) => {
                const Icon = announcementIconMap[announcement.type] || Sparkles;
                const colors = announcementColorMap[announcement.type] || announcementColorMap.update;
                return (
                  <div
                    key={announcement.id}
                    className="cursor-pointer border-b border-white/5 p-4 transition-colors hover:bg-white/5"
                    onClick={() => handleAnnouncementClick(announcement)}
                  >
                    <div className="flex gap-3">
                      <div className={`shrink-0 rounded-lg p-2 ${colors}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-white">
                            {announcement.title}
                          </p>
                          <span className="shrink-0 h-2 w-2 rounded-full bg-purple-500" />
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-white/50">
                          {announcement.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-white/30">
                            {formatTime(announcement.created_at)}
                          </span>
                          {announcement.action_url && (
                            <span className="flex items-center gap-1 text-xs text-purple-400">
                              {announcement.action_label || 'View'}
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Local Notifications Section */}
          {localNotifs.length > 0 && (
            <div>
              {announcements.length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 text-xs text-white/40">
                  <Bell className="h-3 w-3" />
                  <span className="uppercase tracking-wider">Activity</span>
                </div>
              )}
              {localNotifs.map((notification) => {
                const Icon = localIconMap[notification.type];
                const colors = localColorMap[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={`cursor-pointer border-b border-white/5 p-4 transition-colors hover:bg-white/5 ${
                      !notification.read ? 'bg-white/[0.02]' : ''
                    }`}
                    onClick={() => handleLocalClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={`shrink-0 rounded-lg p-2 ${colors}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${notification.read ? 'text-white/70' : 'text-white'}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="shrink-0 h-2 w-2 rounded-full bg-purple-500" />
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-white/50">
                          {notification.message}
                        </p>
                        <span className="mt-2 block text-xs text-white/30">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {announcements.length === 0 && localNotifs.length === 0 && (
            <div className="p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                <Bell className="h-6 w-6 text-white/20" />
              </div>
              <p className="text-sm text-white/50">No notifications yet</p>
              <p className="mt-1 text-xs text-white/30">
                We'll notify you about important updates
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {(announcements.length > 0 || localNotifs.length > 0) && (
          <div className="border-t border-white/10 p-3">
            <button
              onClick={() => {
                clearLocalNotifications();
                announcements.forEach(a => markAsRead(a.id));
              }}
              className="w-full rounded-lg py-2 text-center text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              Mark all as read
            </button>
          </div>
        )}
      </motion.div>
    </>
  );

  return (
    <>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Bell className="h-5 w-5" />
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white"
          >
            {totalUnread > 9 ? '9+' : totalUnread}
          </motion.span>
        )}
      </button>

      {/* Dropdown Portal */}
      <AnimatePresence>
        {mounted && createPortal(dropdownContent, document.body)}
      </AnimatePresence>
    </>
  );
}

// ============================================
// HELPER FUNCTIONS FOR LOCAL NOTIFICATIONS
// ============================================

export function notifyImageGenerated(imageName?: string) {
  addNotification({
    type: 'success',
    title: 'Image Generated!',
    message: imageName 
      ? `Your image "${imageName}" is ready to view.`
      : 'Your AI-generated image is ready to view.',
    action: {
      label: 'View in Gallery',
      href: '/gallery',
    },
  });
}

export function notifyCreditsLow(remaining: number) {
  addNotification({
    type: 'warning',
    title: 'Low Credits',
    message: `You have ${remaining} credits remaining. Consider upgrading your plan.`,
    action: {
      label: 'Get More Credits',
      href: '/pricing',
    },
  });
}

export function notifyCreditsAdded(amount: number, reason: string) {
  addNotification({
    type: 'reward',
    title: 'Credits Added!',
    message: `You received ${amount} credits${reason ? ` - ${reason}` : ''}.`,
  });
}

export function notifyError(title: string, message: string) {
  addNotification({
    type: 'error',
    title,
    message,
  });
}

export function notifySuccess(title: string, message: string) {
  addNotification({
    type: 'success',
    title,
    message,
  });
}

export function notifyInfo(title: string, message: string) {
  addNotification({
    type: 'info',
    title,
    message,
  });
}

export default NotificationCenter;
