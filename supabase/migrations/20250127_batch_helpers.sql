-- Batch Processing Helper Functions
-- These functions are called by the background batch processor

-- Increment completed images count
CREATE OR REPLACE FUNCTION increment_batch_completed(batch_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE batch_projects
  SET 
    completed_images = completed_images + 1,
    updated_at = NOW()
  WHERE id = batch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment failed images count
CREATE OR REPLACE FUNCTION increment_batch_failed(batch_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE batch_projects
  SET 
    failed_images = failed_images + 1,
    updated_at = NOW()
  WHERE id = batch_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add prompt and aspect_ratio columns to batch_projects (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'batch_projects' AND column_name = 'prompt'
  ) THEN
    ALTER TABLE batch_projects ADD COLUMN prompt TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'batch_projects' AND column_name = 'aspect_ratio'
  ) THEN
    ALTER TABLE batch_projects ADD COLUMN aspect_ratio TEXT DEFAULT 'auto';
  END IF;
END $$;


