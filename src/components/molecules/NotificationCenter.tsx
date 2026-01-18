'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  Gift,
  CreditCard,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

// Notification types
export type NotificationType = 'success' | 'error' | 'info' | 'warning' | 'reward';

export interface Notification {
  id: string;
  type: NotificationType;
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

// Notification store (in-memory for now, can be persisted to localStorage/Supabase)
let notifications: Notification[] = [];
let listeners: ((notifications: Notification[]) => void)[] = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...notifications]));
}

// Public API for adding notifications
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const newNotification: Notification = {
    ...notification,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    read: false,
  };
  notifications = [newNotification, ...notifications].slice(0, 50); // Keep last 50
  notifyListeners();
  
  // Save to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('jewelshot_notifications', JSON.stringify(notifications));
  }
}

export function markAsRead(id: string) {
  notifications = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  notifyListeners();
  if (typeof window !== 'undefined') {
    localStorage.setItem('jewelshot_notifications', JSON.stringify(notifications));
  }
}

export function markAllAsRead() {
  notifications = notifications.map(n => ({ ...n, read: true }));
  notifyListeners();
  if (typeof window !== 'undefined') {
    localStorage.setItem('jewelshot_notifications', JSON.stringify(notifications));
  }
}

export function clearNotifications() {
  notifications = [];
  notifyListeners();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jewelshot_notifications');
  }
}

// Hook to subscribe to notifications
function useNotifications() {
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jewelshot_notifications');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          notifications = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }));
          setNotifs(notifications);
        } catch (e) {
          console.error('Failed to parse notifications', e);
        }
      }
    }

    // Subscribe to updates
    const listener = (updated: Notification[]) => setNotifs(updated);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);

  return notifs;
}

// Icon mapping
const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
  reward: Gift,
};

const colorMap = {
  success: 'text-green-400 bg-green-500/20',
  error: 'text-red-400 bg-red-500/20',
  info: 'text-blue-400 bg-blue-500/20',
  warning: 'text-yellow-400 bg-yellow-500/20',
  reward: 'text-purple-400 bg-purple-500/20',
};

// Notification Center Component
export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96 rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h3 className="font-semibold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-purple-400 hover:text-purple-300"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-8 w-8 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => {
                      const Icon = iconMap[notification.type];
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-white/[0.02]' : ''
                          }`}
                          onClick={() => {
                            markAsRead(notification.id);
                            if (notification.action?.onClick) {
                              notification.action.onClick();
                            } else if (notification.action?.href) {
                              window.location.href = notification.action.href;
                            }
                          }}
                        >
                          <div className="flex gap-3">
                            <div className={`shrink-0 rounded-lg p-2 ${colorMap[notification.type]}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm font-medium ${notification.read ? 'text-white/70' : 'text-white'}`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="shrink-0 h-2 w-2 rounded-full bg-purple-500" />
                                )}
                              </div>
                              <p className="text-sm text-white/50 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-white/30 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-white/10 p-3">
                  <button
                    onClick={clearNotifications}
                    className="w-full text-center text-sm text-white/40 hover:text-white/60"
                  >
                    Clear all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper functions to create common notifications
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
