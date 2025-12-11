-- ============================================
-- PRESET TRACKING MIGRATION
-- ============================================
-- Adds preset tracking fields to images and batch_images tables
-- Allows tracking which preset was used to generate each image
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. ADD COLUMNS TO IMAGES TABLE
-- ============================================

-- Add preset_id column (stores the preset identifier)
ALTER TABLE public.images 
ADD COLUMN IF NOT EXISTS preset_id TEXT;

-- Add preset_name column (stores the human-readable preset name)
ALTER TABLE public.images 
ADD COLUMN IF NOT EXISTS preset_name TEXT;

-- Add batch_id column (if generated from batch, links to batch_projects)
ALTER TABLE public.images 
ADD COLUMN IF NOT EXISTS batch_id UUID REFERENCES public.batch_projects(id) ON DELETE SET NULL;

-- ============================================
-- 2. ADD COLUMNS TO GENERATED_IMAGES TABLE (if exists)
-- ============================================

-- For the generated_images table (proxied images)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'generated_images') THEN
    ALTER TABLE public.generated_images 
    ADD COLUMN IF NOT EXISTS preset_id TEXT;
    
    ALTER TABLE public.generated_images 
    ADD COLUMN IF NOT EXISTS preset_name TEXT;
  END IF;
END $$;

-- ============================================
-- 3. ADD COLUMNS TO BATCH_IMAGES TABLE
-- ============================================

-- For batch processing, track preset per image
ALTER TABLE public.batch_images 
ADD COLUMN IF NOT EXISTS preset_id TEXT;

ALTER TABLE public.batch_images 
ADD COLUMN IF NOT EXISTS preset_name TEXT;

-- ============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index on preset_id for filtering images by preset
CREATE INDEX IF NOT EXISTS idx_images_preset_id ON public.images(preset_id);

-- Index on batch_id for filtering images by batch
CREATE INDEX IF NOT EXISTS idx_images_batch_id ON public.images(batch_id);

-- Index for batch_images preset lookups
CREATE INDEX IF NOT EXISTS idx_batch_images_preset_id ON public.batch_images(preset_id);

-- ============================================
-- 5. COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN public.images.preset_id IS 'ID of the preset used to generate this image (e.g., "on-model-ring-women-elegant")';
COMMENT ON COLUMN public.images.preset_name IS 'Human-readable name of the preset (e.g., "Elegant Ring Shot")';
COMMENT ON COLUMN public.images.batch_id IS 'Reference to batch_projects if this image was generated in a batch';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the migration:
--
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'images' AND column_name IN ('preset_id', 'preset_name', 'batch_id');
--
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'batch_images' AND column_name IN ('preset_id', 'preset_name');



