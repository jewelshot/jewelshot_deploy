-- ========================================
-- PROFILES & AVATARS SETUP
-- ========================================
-- Migration for user profiles and avatar storage
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Create avatars storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Storage policies for avatars bucket

-- Allow users to view all avatars (public bucket)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
-- File names should start with user ID: {user_id}-{timestamp}.{ext}
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = substring(name from '^[^-]+')
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = substring(name from '^[^-]+')
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = substring(name from '^[^-]+')
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = substring(name from '^[^-]+')
);

-- 4. Add bio column to profiles table if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 5. Update the handle_new_user function to include bio
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, bio)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'bio'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    bio = EXCLUDED.bio,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- ✅ SETUP COMPLETE!
-- ========================================
-- You can now:
-- 1. Upload avatars to the 'avatars' bucket
-- 2. Store user bios in the profiles table
-- 3. Users can only modify their own avatars
-- ========================================

