/**
 * SettingsSection Component
 *
 * User preferences and settings management.
 * Includes: notifications, privacy, language, theme.
 */

'use client';

import React, { useState } from 'react';
import { Bell, Lock, Globe, Palette, Save } from 'lucide-react';

export function SettingsSection() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    productUpdates: true,
    marketingEmails: false,
    profileVisibility: 'private',
    language: 'en',
    theme: 'dark',
  });
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
        <h2 className="mb-2 text-2xl font-bold text-white">Settings</h2>
        <p className="text-white/60">
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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-white/80">
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
                className="h-5 w-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-white/80">Product Updates</span>
              <input
                type="checkbox"
                checked={settings.productUpdates}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    productUpdates: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-white/80">Marketing Emails</span>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    marketingEmails: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50"
              />
            </label>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Privacy</h3>
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/80">
              Profile Visibility
            </label>
            <select
              value={settings.profileVisibility}
              onChange={(e) =>
                setSettings({ ...settings, profileVisibility: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
        </div>

        {/* Language & Region */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">
              Language & Region
            </h3>
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/80">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Appearance</h3>
          </div>
          <div>
            <label className="mb-2 block text-sm text-white/80">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) =>
                setSettings({ ...settings, theme: e.target.value })
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto (System)</option>
            </select>
            <p className="mt-2 text-xs text-white/50">
              Currently only dark mode is available
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

