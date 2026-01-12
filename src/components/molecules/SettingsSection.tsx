/**
 * SettingsSection Component
 *
 * User preferences and settings management.
 * Includes: notifications, privacy, language, theme.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Lock, Globe, Palette, Save, Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { useLanguage, AVAILABLE_LANGUAGES, Language } from '@/lib/i18n';

export function SettingsSection() {
  const { theme, setTheme, resolvedTheme } = useThemeStore();
  const { language, setLanguage, t } = useLanguage();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    productUpdates: true,
    marketingEmails: false,
    profileVisibility: 'private',
  });
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jewelshot_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save to localStorage for now
    localStorage.setItem('jewelshot_settings', JSON.stringify(settings));

    setMessage('Settings saved successfully!');
    setSaving(false);

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-[var(--foreground)]">Settings</h2>
        <p className="text-[var(--foreground-subtle)]">
          Customize your experience and preferences
        </p>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-green-400">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Notifications */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Notifications</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">
                Email Notifications
              </span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">Product Updates</span>
              <input
                type="checkbox"
                checked={settings.productUpdates}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    productUpdates: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">Marketing Emails</span>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    marketingEmails: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-[var(--border)] bg-[var(--surface)] text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-[var(--foreground)]">Privacy</h3>
          </div>
          <div>
            <label className="mb-2 block text-sm text-[var(--foreground-muted)]">
              Profile Visibility
            </label>
            <select
              value={settings.profileVisibility}
              onChange={(e) =>
                setSettings({ ...settings, profileVisibility: e.target.value })
              }
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-[var(--foreground)] focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="public" className="bg-[var(--background)]">Public</option>
              <option value="private" className="bg-[var(--background)]">Private</option>
              <option value="friends" className="bg-[var(--background)]">Friends Only</option>
            </select>
          </div>
        </div>

        {/* Language & Region */}
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

        {/* Appearance */}
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

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsSection;


