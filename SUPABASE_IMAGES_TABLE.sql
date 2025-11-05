-- ============================================
-- GENERATED IMAGES METADATA TABLE
-- ============================================
-- Stores metadata for proxied images
-- Allows serving images via /api/images/{id}

-- 1. Create table
CREATE TABLE IF NOT EXISTS generated_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  original_url TEXT, -- Original FAL.ai URL (for debugging)
  width INTEGER,
  height INTEGER,
  format TEXT, -- jpg, png, webp
  size_bytes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB, -- Additional metadata (prompt, style, etc.)
  
  -- Indexes
  CONSTRAINT generated_images_storage_path_unique UNIQUE (storage_path)
);

-- 2. Create indexes
CREATE INDEX idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX idx_generated_images_created_at ON generated_images(created_at DESC);

-- 3. Enable RLS
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Policy 1: Users can view their own images
CREATE POLICY "Users can view own images"
ON generated_images
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own images
CREATE POLICY "Users can insert own images"
ON generated_images
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can delete their own images
CREATE POLICY "Users can delete own images"
ON generated_images
FOR DELETE
USING (auth.uid() = user_id);

-- Policy 4: Service role can manage all (for cleanup, etc.)
CREATE POLICY "Service role full access"
ON generated_images
FOR ALL
USING (auth.role() = 'service_role');

-- ============================================
-- CLEANUP FUNCTION (Optional)
-- ============================================
-- Deletes images older than 90 days to save storage

CREATE OR REPLACE FUNCTION cleanup_old_images()
RETURNS void AS $$
BEGIN
  DELETE FROM generated_images
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- NOTES
-- ============================================
--
-- Table Structure:
-- - id: UUID for /api/images/{id} URLs
-- - storage_path: {user_id}/{filename}.jpg
-- - original_url: FAL.ai URL (for debugging only)
-- - metadata: JSONB for flexible data
--
-- Usage:
-- 1. Create table + indexes
-- 2. Apply RLS policies
-- 3. image-proxy.ts will insert records
-- 4. /api/images/[id] will read records
--
-- URL Format:
-- OLD: https://fal.media/files/abc123.jpg ❌
-- NEW: https://jewelshot.ai/api/images/{uuid} ✅
--
-- Cleanup:
-- Run monthly: SELECT cleanup_old_images();
-- Or setup cron: https://supabase.com/docs/guides/database/extensions/pg_cron

