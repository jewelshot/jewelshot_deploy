/**
 * useAnnouncements Hook
 * 
 * Client-side hook for fetching and managing announcements
 */

'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { UserAnnouncement } from '@/lib/announcements/types';

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
  const [showModal, setShowModal] = useState(false);
  const [currentModalAnnouncement, setCurrentModalAnnouncement] = useState<UserAnnouncement | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Show modal for first important/critical announcement not yet dismissed
  useEffect(() => {
    if (announcementsData.isLoading) return;

    const nextImportant = announcementsData.importantAnnouncements.find(
      a => !dismissedIds.has(a.id)
    );

    if (nextImportant && !showModal) {
      setCurrentModalAnnouncement(nextImportant);
      setShowModal(true);
    }
  }, [announcementsData.importantAnnouncements, announcementsData.isLoading, dismissedIds, showModal]);

  const dismissModal = useCallback(() => {
    if (currentModalAnnouncement) {
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
