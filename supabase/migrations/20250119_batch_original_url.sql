-- ============================================
-- ADD ORIGINAL_URL TO BATCH_IMAGES
-- ============================================
-- This migration adds original_url column to batch_images table
-- to enable Before/After comparison in Gallery

-- 1. Add original_url column
ALTER TABLE batch_images 
ADD COLUMN IF NOT EXISTS original_url TEXT;

-- 2. Add comment for documentation
COMMENT ON COLUMN batch_images.original_url IS 'Supabase Storage URL of the original (unprocessed) image';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Now batch_images has:
-- - original_url: Original image URL
-- - result_url: Generated/processed image URL
-- 
-- This enables side-by-side Before/After comparison in Gallery

