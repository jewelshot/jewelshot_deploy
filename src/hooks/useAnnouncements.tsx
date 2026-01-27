/**
 * useAnnouncements Hook
 * 
 * Client-side hook for fetching and managing announcements
 */

'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { UserAnnouncement } from '@/lib/announcements/types';

// ============================================
// LOCAL STORAGE KEYS
// ============================================

const DISMISSED_ANNOUNCEMENTS_KEY = 'jewelshot_dismissed_announcements';

function getDismissedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(DISMISSED_ANNOUNCEMENTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(Array.isArray(parsed) ? parsed : []);
    }
  } catch {
    // Ignore errors
  }
  return new Set();
}

function saveDismissedId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDismissedIds();
    current.add(id);
    localStorage.setItem(DISMISSED_ANNOUNCEMENTS_KEY, JSON.stringify([...current]));
  } catch {
    // Ignore errors
  }
}

// ============================================
// LANDING PAGE PATHS (No modal shown)
// ============================================

const LANDING_PATHS = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/auth/verify-email',
  '/privacy',
  '/terms',
  '/cookies',
  '/gdpr',
  '/refund',
  '/security',
  '/about',
  '/contact',
  '/help',
  '/blog',
  '/careers',
  '/changelog',
  '/maintenance',
  '/banned',
];

function isLandingPage(pathname: string | null): boolean {
  if (!pathname) return true;
  return LANDING_PATHS.some(path => pathname === path || pathname.startsWith('/auth/'));
}

// ============================================
// HOOK
// ============================================

interface UseAnnouncementsReturn {
  announcements: UserAnnouncement[];
  unreadCount: number;
  importantAnnouncements: UserAnnouncement[];
  isLoading: boolean;
  error: string | null;
  markAsRead: (announcementId: string, dismissModal?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAnnouncements(): UseAnnouncementsReturn {
  const [announcements, setAnnouncements] = useState<UserAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/announcements');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch announcements');
      }

      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (announcementId: string, dismissModal = false) => {
    try {
      const response = await fetch('/api/announcements/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementId, dismissModal }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to mark as read');
      }

      // Mark as read in local state (don't remove - keep in history)
      setAnnouncements(prev => prev.map(a => 
        a.id === announcementId ? { ...a, is_read: true } : a
      ));
    } catch (err) {
      console.error('Error marking announcement read:', err);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Filter important announcements (for modal display)
  const importantAnnouncements = announcements.filter(
    a => a.priority === 'important' || a.priority === 'critical'
  );

  return {
    announcements,
    unreadCount: announcements.length,
    importantAnnouncements,
    isLoading,
    error,
    markAsRead,
    refresh: fetchAnnouncements,
  };
}

// ============================================
// ANNOUNCEMENT CONTEXT
// ============================================

interface AnnouncementContextValue extends UseAnnouncementsReturn {
  showModal: boolean;
  currentModalAnnouncement: UserAnnouncement | null;
  dismissModal: () => void;
}

const AnnouncementContext = createContext<AnnouncementContextValue | null>(null);

export function useAnnouncementContext(): AnnouncementContextValue {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncementContext must be used within AnnouncementProvider');
  }
  return context;
}

interface AnnouncementProviderProps {
  children: ReactNode;
}

export function AnnouncementProvider({ children }: AnnouncementProviderProps) {
  const announcementsData = useAnnouncements();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [currentModalAnnouncement, setCurrentModalAnnouncement] = useState<UserAnnouncement | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Load dismissed IDs from localStorage on mount
  useEffect(() => {
    setDismissedIds(getDismissedIds());
    setInitialized(true);
  }, []);

  // Show modal for first important/critical announcement not yet dismissed
  // BUT NOT on landing pages
  useEffect(() => {
    if (!initialized) return;
    if (announcementsData.isLoading) return;
    if (isLandingPage(pathname)) return; // Don't show on landing pages

    const nextImportant = announcementsData.importantAnnouncements.find(
      a => !dismissedIds.has(a.id) && !a.is_read
    );

    if (nextImportant && !showModal) {
      setCurrentModalAnnouncement(nextImportant);
      setShowModal(true);
    }
  }, [announcementsData.importantAnnouncements, announcementsData.isLoading, dismissedIds, showModal, pathname, initialized]);

  const dismissModal = useCallback(() => {
    if (currentModalAnnouncement) {
      // Save to localStorage so it never shows again
      saveDismissedId(currentModalAnnouncement.id);
      setDismissedIds(prev => new Set([...prev, currentModalAnnouncement.id]));
      announcementsData.markAsRead(currentModalAnnouncement.id, true);
    }
    setShowModal(false);
    setCurrentModalAnnouncement(null);
  }, [currentModalAnnouncement, announcementsData]);

  const value: AnnouncementContextValue = {
    ...announcementsData,
    showModal,
    currentModalAnnouncement,
    dismissModal,
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}
