# Supabase Setup Guide for Jewelshot

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Choose a region close to your users
4. Save your project credentials:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Anon/Public Key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Images table (private galleries)
CREATE TABLE public.images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_url TEXT NOT NULL,
  generated_url TEXT NOT NULL,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  prompt TEXT,
  style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for Images
-- Users can view only their own images
CREATE POLICY "Users can view own images"
  ON public.images
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own images
CREATE POLICY "Users can insert own images"
  ON public.images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own images
CREATE POLICY "Users can update own images"
  ON public.images
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON public.images
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_images_updated
  BEFORE UPDATE ON public.images
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX images_user_id_idx ON public.images(user_id);
CREATE INDEX images_created_at_idx ON public.images(created_at DESC);
```

---

## 3. Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. Create two buckets:

### Bucket 1: `originals` (Private)

- **Public**: ❌ No
- **File Size Limit**: 10MB
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`

### Bucket 2: `generated` (Private)

- **Public**: ❌ No
- **File Size Limit**: 10MB
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`

### Storage RLS Policies

Run this SQL for storage policies:

```sql
-- RLS Policies for originals bucket
CREATE POLICY "Users can upload their own originals"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'originals' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own originals"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'originals' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own originals"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'originals' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS Policies for generated bucket
CREATE POLICY "Users can upload their own generated images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'generated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view their own generated images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'generated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own generated images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'generated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## 4. Authentication Settings

1. Go to **Authentication** → **Providers**
2. Enable **Email** (default)
3. Optional: Enable **Google OAuth**
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### Email Templates

Customize email templates in **Authentication** → **Email Templates**:

- Confirm signup
- Magic Link
- Reset password

---

## 5. Environment Variables

Add these to `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Keep existing
FAL_KEY=your-fal-key
```

---

## 6. Test the Setup

1. Run the app: `npm run dev`
2. Sign up a new user
3. Check Supabase Dashboard:
   - **Authentication** → Users (should see new user)
   - **Table Editor** → Profiles (should see profile created automatically)
4. Upload an image in Studio
5. Check **Table Editor** → Images (should see image entry with correct user_id)
6. Check **Storage** → originals/generated (should see files in user's folder)

---

## Security Features ✅

- ✅ **Row Level Security (RLS)**: Users can only see their own data
- ✅ **Storage Policies**: Users can only access their own images
- ✅ **Private Galleries**: Complete isolation between users
- ✅ **Auto Profile Creation**: Profile created automatically on signup
- ✅ **Cascade Deletes**: When user is deleted, all their data is removed
- ✅ **Email Verification**: Optional email confirmation
- ✅ **Password Reset**: Built-in password reset flow

---

## Migration from localStorage

The app will automatically migrate existing localStorage data to Supabase when user logs in for the first time. No manual action required!

---

## Need Help?

- [Supabase Docs](https://supabase.com/docs)
- [Next.js SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
