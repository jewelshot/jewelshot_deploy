-- ========================================
-- JEWELSHOT - SUPABASE DATABASE SETUP
-- ========================================
-- Bu SQL'i Supabase SQL Editor'de çalıştır
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. PROFILES TABLE
-- ========================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. IMAGES TABLE
-- ========================================
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

-- ========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. RLS POLICIES - PROFILES
-- ========================================

-- Users can view own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========================================
-- 5. RLS POLICIES - IMAGES
-- ========================================

-- Users can view only their own images
CREATE POLICY "Users can view own images"
  ON public.images FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own images
CREATE POLICY "Users can insert own images"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own images
CREATE POLICY "Users can update own images"
  ON public.images FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- 6. AUTO-CREATE PROFILE FUNCTION
-- ========================================
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

-- ========================================
-- 7. TRIGGER FOR AUTO-PROFILE CREATION
-- ========================================
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- ✅ SETUP COMPLETE!
-- ========================================
-- Sonuç: "Success. No rows returned" görmelisin
-- Eğer hata varsa, zaten var olan table'ları DROP TABLE ile sil ve tekrar dene
