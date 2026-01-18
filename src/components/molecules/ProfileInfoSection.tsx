/**
 * ProfileInfoSection Component
 *
 * User profile information form with avatar upload.
 * Handles profile updates with Supabase.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Camera, Save, X } from 'lucide-react';
import Avatar from '@/components/atoms/Avatar';
import { PhoneVerificationSection } from '@/components/molecules/PhoneVerificationSection';
import { createScopedLogger } from '@/lib/logger';
import { useLanguage } from '@/lib/i18n';

const logger = createScopedLogger('ProfileInfo');

interface ProfileData {
  full_name: string;
  email: string;
  avatar_url: string;
  bio?: string;
}

export function ProfileInfoSection() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    email: '',
    avatar_url: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Try to get profile from profiles table
           
          const { data: profileData } = (await supabase
            .from('profiles')
            .select('full_name, avatar_url, bio')
            .eq('id', user.id)
            .maybeSingle()) as { data: any };

          setProfile({
            full_name:
              profileData?.full_name ||
              user.user_metadata?.full_name ||
              'User',
            email: user.email || '',
            avatar_url:
              profileData?.avatar_url || user.user_metadata?.avatar_url || '',
            bio: profileData?.bio || '',
          });
        }
      } catch (error) {
        logger.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle avatar upload
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: t.errors.fileTooLarge });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: t.errors.invalidFile });
      return;
    }

    setUploadingAvatar(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName; // Path within the 'avatars' bucket

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        logger.error('Upload error details:', uploadError);
        throw new Error(
          uploadError.message || t.errors.uploadFailed
        );
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);

      logger.info('Avatar uploaded successfully:', publicUrl);

      // Update profile state
      setProfile({ ...profile, avatar_url: publicUrl });

      // IMPORTANT: Save to database immediately
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = (await (supabase as any)
        .from('profiles')
        .upsert({
          id: user.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: publicUrl, // Save new avatar URL
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })) as { error: any };

      if (profileError) {
        logger.error('Profile update error:', profileError);
        throw new Error(t.errors.uploadFailed);
      }

      // Also update auth user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          avatar_url: publicUrl,
        },
      });

      setMessage({ type: 'success', text: t.success.uploaded });

      // Reload page after 1 second to update sidebar avatar
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      logger.error('Avatar upload error:', error);
      setMessage({
        type: 'error',
        text: error.message || t.errors.uploadFailed,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Not authenticated');

      // Update profiles table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: profileError } = (await (supabase as any)
        .from('profiles')
        .upsert({
          id: user.id,
          email: profile.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })) as { error: any };

      if (profileError) throw profileError;

      // Also update auth user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
        },
      });

      if (metadataError) throw metadataError;

      setMessage({ type: 'success', text: t.success.profileUpdated });

      // Reload window after 1s to refresh sidebar
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      logger.error('Profile update error:', error);
      setMessage({
        type: 'error',
        text: t.errors.generic,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-sm text-white/70">{t.common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Message Banner */}
      {message && (
        <div
          className={`mb-6 flex items-center justify-between rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-green-500/20 bg-green-500/10 text-green-400'
              : 'border-red-500/20 bg-red-500/10 text-red-400'
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-current hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">
            {t.profile.avatar}
          </h3>
          <div className="flex items-center gap-6">
            {/* Avatar Preview */}
            <div className="relative h-20 w-20">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-20 w-20 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to initial if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <Avatar
                  content={profile.full_name.charAt(0)}
                  size="lg"
                />
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-400 transition-all hover:border-purple-500/50 hover:bg-purple-500/20 disabled:opacity-50"
              >
                <Camera className="h-4 w-4" />
                {uploadingAvatar ? t.common.loading : t.common.upload}
              </button>
              <p className="mt-2 text-xs text-white/50">
                JPG, PNG, GIF. Max 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">
            {t.profile.account}
          </h3>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="full_name"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                {t.profile.fullName}
              </label>
              <input
                type="text"
                id="full_name"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition-all focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t.placeholders.enterName}
              />
            </div>

            {/* Email (readonly) */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                {t.profile.email}
              </label>
              <input
                type="email"
                id="email"
                value={profile.email}
                disabled
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white/60 placeholder-white/40 opacity-60"
              />
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-medium text-white/80"
              >
                {t.profile.bio}
              </label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-white/40 transition-all focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder={t.placeholders.enterDescription}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? t.common.loading : t.common.save}
          </button>
        </div>
      </form>

      {/* Phone Verification Section */}
      <div className="mt-8">
        <PhoneVerificationSection />
      </div>
    </div>
  );
}

export default ProfileInfoSection;
