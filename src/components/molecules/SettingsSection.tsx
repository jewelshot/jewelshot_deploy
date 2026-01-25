/**
 * SettingsSection Component
 *
 * User preferences and settings management with full database integration.
 * Includes: notifications, announcements, privacy, language, theme.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  Lock, 
  Globe, 
  Palette, 
  Save, 
  Sun, 
  Moon, 
  Monitor, 
  Megaphone,
  ExternalLink,
  Sparkles,
  Gift,
  AlertCircle,
  Zap,
  Wrench,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useLanguage, AVAILABLE_LANGUAGES } from '@/lib/i18n';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import type { AnnouncementType, UserAnnouncement } from '@/lib/announcements/types';

// ============================================
// TYPES
// ============================================

interface NotificationPreferences {
  email_notifications: boolean;
  product_updates: boolean;
  marketing_emails: boolean;
  announcement_emails: boolean;
  in_app_notifications: boolean;
}

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'friends';
  show_activity: boolean;
  allow_analytics: boolean;
}

// ============================================
// CONSTANTS
// ============================================

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  email_notifications: true,
  product_updates: true,
  marketing_emails: false,
  announcement_emails: true,
  in_app_notifications: true,
};

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profile_visibility: 'private',
  show_activity: false,
  allow_analytics: true,
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
// COMPONENT
// ============================================

export function SettingsSection() {
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const { language, setLanguage, t } = useLanguage();
  const { announcements, markAsRead, isLoading: announcementsLoading } = useAnnouncements();
  
  // Settings State
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFS);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // All announcements for history
  const [allAnnouncements, setAllAnnouncements] = useState<UserAnnouncement[]>([]);
  const [loadingAllAnnouncements, setLoadingAllAnnouncements] = useState(true);

  // ============================================
  // LOAD SETTINGS FROM API
  // ============================================
  
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/user/settings');
      const data = await response.json();
      
      if (data.success && data.settings) {
        setNotificationPrefs({
          ...DEFAULT_NOTIFICATION_PREFS,
          ...data.settings.notification_preferences,
        });
        setPrivacySettings({
          ...DEFAULT_PRIVACY_SETTINGS,
          ...data.settings.privacy_settings,
        });
      } else {
        // Fallback to localStorage
        const saved = localStorage.getItem('jewelshot_settings');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.notification_preferences) {
              setNotificationPrefs(prev => ({ ...prev, ...parsed.notification_preferences }));
            }
            if (parsed.privacy_settings) {
              setPrivacySettings(prev => ({ ...prev, ...parsed.privacy_settings }));
            }
            // Legacy support
            if (parsed.emailNotifications !== undefined) {
              setNotificationPrefs(prev => ({
                ...prev,
                email_notifications: parsed.emailNotifications,
                product_updates: parsed.productUpdates ?? prev.product_updates,
                marketing_emails: parsed.marketingEmails ?? prev.marketing_emails,
              }));
            }
            if (parsed.profileVisibility !== undefined) {
              setPrivacySettings(prev => ({
                ...prev,
                profile_visibility: parsed.profileVisibility,
              }));
            }
          } catch (e) {
            console.error('Failed to parse localStorage settings:', e);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // LOAD ALL ANNOUNCEMENTS
  // ============================================
  
  const loadAllAnnouncements = useCallback(async () => {
    try {
      setLoadingAllAnnouncements(true);
      
      const response = await fetch('/api/announcements?all=true');
      const data = await response.json();
      
      if (data.success && data.announcements) {
        setAllAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Failed to load all announcements:', error);
    } finally {
      setLoadingAllAnnouncements(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    loadAllAnnouncements();
  }, [loadSettings, loadAllAnnouncements]);

  // ============================================
  // SAVE SETTINGS
  // ============================================
  
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notification_preferences: notificationPrefs,
          privacy_settings: privacySettings,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Also save to localStorage as backup
        localStorage.setItem('jewelshot_settings', JSON.stringify({
          notification_preferences: notificationPrefs,
          privacy_settings: privacySettings,
        }));

        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setHasChanges(false);
      } else {
        throw new Error(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save failed:', error);
      
      // Fallback: Save to localStorage
      localStorage.setItem('jewelshot_settings', JSON.stringify({
        notification_preferences: notificationPrefs,
        privacy_settings: privacySettings,
      }));
      
      setMessage({ type: 'success', text: 'Settings saved locally!' });
      setHasChanges(false);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // ============================================
  // HANDLERS
  // ============================================
  
  const updateNotificationPref = (key: keyof NotificationPreferences, value: boolean) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updatePrivacySetting = <K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

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
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (loading) {
    return (
      <div className="mx-auto max-w-2xl flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Settings</h2>
        <p className="text-[var(--foreground-subtle)]">
          Customize your experience and preferences
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 rounded-lg border p-4 flex items-center gap-2 ${
          message.type === 'success' 
            ? 'border-green-500/20 bg-green-500/10 text-green-400' 
            : 'border-red-500/20 bg-red-500/10 text-red-400'
        }`}>
          <CheckCircle2 className="h-4 w-4" />
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* ==================== NOTIFICATIONS ==================== */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm text-[var(--foreground)]">
                  Email Notifications
                </span>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Receive important updates via email
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.email_notifications}
                onChange={(e) => updateNotificationPref('email_notifications', e.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>

            <label className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm text-[var(--foreground)]">
                  Product Updates
                </span>
                <p className="text-xs text-[var(--foreground-muted)]">
                  New features and improvements
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.product_updates}
                onChange={(e) => updateNotificationPref('product_updates', e.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>

            <label className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm text-[var(--foreground)]">
                  Marketing Emails
                </span>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Promotions and offers
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.marketing_emails}
                onChange={(e) => updateNotificationPref('marketing_emails', e.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>

            <label className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm text-[var(--foreground)]">
                  Announcement Emails
                </span>
                <p className="text-xs text-[var(--foreground-muted)]">
                  System-wide announcements and alerts
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.announcement_emails}
                onChange={(e) => updateNotificationPref('announcement_emails', e.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>

            <label className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm text-[var(--foreground)]">
                  In-App Notifications
                </span>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Show notifications within the app
                </p>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs.in_app_notifications}
                onChange={(e) => updateNotificationPref('in_app_notifications', e.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>
          </div>
        </div>

        {/* ==================== ANNOUNCEMENTS ==================== */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Announcements</h3>
              {announcements.length > 0 && (
                <span className="rounded-full bg-purple-500 px-2 py-0.5 text-xs font-bold text-white">
                  {announcements.length} new
                </span>
              )}
            </div>
          </div>

          {loadingAllAnnouncements || announcementsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
            </div>
          ) : allAnnouncements.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {allAnnouncements.map((announcement) => {
                const Icon = announcementIconMap[announcement.type] || Sparkles;
                const colors = announcementColorMap[announcement.type] || announcementColorMap.update;
                const isUnread = announcements.some(a => a.id === announcement.id);

                return (
                  <div
                    key={announcement.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      isUnread 
                        ? 'border-purple-500/30 bg-purple-500/5' 
                        : 'border-[var(--border)] bg-[var(--surface)]'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`shrink-0 rounded-lg p-2 ${colors}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {announcement.title}
                          </p>
                          {isUnread && (
                            <span className="shrink-0 h-2 w-2 rounded-full bg-purple-500" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-[var(--foreground-muted)] line-clamp-2">
                          {announcement.message}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-[var(--foreground-faint)]">
                            {formatTime(announcement.created_at)}
                          </span>
                          <div className="flex items-center gap-2">
                            {announcement.action_url && (
                              <a
                                href={announcement.action_url}
                                target={announcement.action_url.startsWith('http') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                              >
                                {announcement.action_label || 'View'}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {isUnread && (
                              <button
                                onClick={() => markAsRead(announcement.id)}
                                className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <Megaphone className="h-8 w-8 text-[var(--foreground-faint)] mx-auto mb-2" />
              <p className="text-sm text-[var(--foreground-muted)]">No announcements yet</p>
              <p className="text-xs text-[var(--foreground-faint)] mt-1">
                Check back later for updates and news
              </p>
            </div>
          )}
        </div>

        {/* ==================== PRIVACY ==================== */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Privacy</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-[var(--foreground)]">
                Profile Visibility
              </label>
              <p className="text-xs text-[var(--foreground-muted)] mb-2">
                Control who can see your profile
              </p>
              <select
                value={privacySettings.profile_visibility}
                onChange={(e) => updatePrivacySetting('profile_visibility', e.target.value as PrivacySettings['profile_visibility'])}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--foreground)] focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              >
                <option value="public" className="bg-[var(--background)]">Public - Anyone can view</option>
                <option value="private" className="bg-[var(--background)]">Private - Only you</option>
                <option value="friends" className="bg-[var(--background)]">Friends Only</option>
              </select>
            </div>

            <label className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm text-[var(--foreground)]">
                  Show Activity
                </span>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Allow others to see your activity
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.show_activity}
                onChange={(e) => updatePrivacySetting('show_activity', e.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>

            <label className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm text-[var(--foreground)]">
                  Allow Analytics
                </span>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Help improve Jewelshot with usage data
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.allow_analytics}
                onChange={(e) => updatePrivacySetting('allow_analytics', e.target.checked)}
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>
          </div>
        </div>

        {/* ==================== LANGUAGE & REGION ==================== */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">
              {t.profile.language}
            </h3>
          </div>
          <div>
            <label className="mb-3 block text-sm text-[var(--foreground-muted)]">
              {t.profile.selectLanguage}
            </label>
            
            {/* Language Toggle Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
                    language === lang.code
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <div className={`text-sm font-medium ${
                      language === lang.code ? 'text-purple-400' : 'text-[var(--foreground)]'
                    }`}>
                      {lang.nativeName}
                    </div>
                    <div className="text-xs text-[var(--foreground-muted)]">
                      {lang.name}
                    </div>
                  </div>
                  {language === lang.code && (
                    <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-purple-500">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <p className="mt-3 text-xs text-[var(--foreground-faint)]">
              {language === 'tr' ? 'Arayüz dili değiştirildi' : 'Interface language changed'}
            </p>
          </div>
        </div>

        {/* ==================== APPEARANCE ==================== */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Appearance</h3>
          </div>
          <div>
            <label className="mb-3 block text-sm text-[var(--foreground-muted)]">Theme</label>
            
            {/* Theme Toggle Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  theme === 'light'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  theme === 'light' ? 'bg-purple-500/20' : 'bg-[var(--surface)]'
                }`}>
                  <Sun className={`h-5 w-5 ${theme === 'light' ? 'text-purple-400' : 'text-[var(--foreground-subtle)]'}`} />
                </div>
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-purple-400' : 'text-[var(--foreground-muted)]'}`}>
                  Light
                </span>
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  theme === 'dark'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  theme === 'dark' ? 'bg-purple-500/20' : 'bg-[var(--surface)]'
                }`}>
                  <Moon className={`h-5 w-5 ${theme === 'dark' ? 'text-purple-400' : 'text-[var(--foreground-subtle)]'}`} />
                </div>
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-[var(--foreground-muted)]'}`}>
                  Dark
                </span>
              </button>
              
              <button
                onClick={() => setTheme('system')}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                  theme === 'system'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  theme === 'system' ? 'bg-purple-500/20' : 'bg-[var(--surface)]'
                }`}>
                  <Monitor className={`h-5 w-5 ${theme === 'system' ? 'text-purple-400' : 'text-[var(--foreground-subtle)]'}`} />
                </div>
                <span className={`text-sm font-medium ${theme === 'system' ? 'text-purple-400' : 'text-[var(--foreground-muted)]'}`}>
                  System
                </span>
              </button>
            </div>
            
            <p className="mt-3 text-xs text-[var(--foreground-faint)]">
              {theme === 'system' 
                ? `Using system preference (${resolvedTheme})`
                : `Currently using ${theme} mode`
              }
            </p>
          </div>
        </div>

        {/* ==================== SAVE BUTTON ==================== */}
        <div className="flex items-center justify-between">
          {hasChanges && (
            <p className="text-sm text-yellow-400">
              You have unsaved changes
            </p>
          )}
          <div className="ml-auto">
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;
