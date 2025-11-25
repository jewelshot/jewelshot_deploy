-- ============================================================================
-- IMAGE METADATA & FAVORITES SYSTEM
-- Jewelry-specific metadata and favorite images for PDF catalog generation
-- ============================================================================

-- ============================================================================
-- 1. IMAGE METADATA TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS image_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_id TEXT NOT NULL, -- Reference to gallery image
  
  -- Basic info
  file_name TEXT NOT NULL DEFAULT 'Untitled',
  
  -- Jewelry specific fields
  carat DECIMAL(10, 2), -- CT (carat weight)
  color TEXT, -- Color grade (D, E, F, G, H, I, J, K, L, M, N)
  clarity TEXT, -- Clarity grade (FL, IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1, I2, I3)
  setting TEXT, -- Ayar (14K, 18K, 22K, 24K, Platinum, etc.)
  weight DECIMAL(10, 2), -- Gram
  
  -- Additional fields
  description TEXT,
  price DECIMAL(10, 2),
  sku TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint: one metadata per image per user
  UNIQUE(user_id, image_id)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_image_metadata_user_id ON image_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_image_metadata_image_id ON image_metadata(image_id);
CREATE INDEX IF NOT EXISTS idx_image_metadata_user_image ON image_metadata(user_id, image_id);

-- Add comment
COMMENT ON TABLE image_metadata IS 'Stores jewelry-specific metadata for gallery images';

-- ============================================================================
-- 2. FAVORITE IMAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS favorite_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_id TEXT NOT NULL, -- Reference to gallery image
  
  -- Selection order (1, 2, 3, ...)
  order_index INTEGER NOT NULL,
  
  -- Timestamp
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Unique constraint: one favorite per image per user
  UNIQUE(user_id, image_id)
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_favorite_images_user_id ON favorite_images(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_images_user_order ON favorite_images(user_id, order_index);

-- Add comment
COMMENT ON TABLE favorite_images IS 'Stores user favorite images with selection order for catalog generation';

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_images ENABLE ROW LEVEL SECURITY;

-- Image Metadata Policies
CREATE POLICY "Users can view their own metadata"
  ON image_metadata FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metadata"
  ON image_metadata FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metadata"
  ON image_metadata FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metadata"
  ON image_metadata FOR DELETE
  USING (auth.uid() = user_id);

-- Favorite Images Policies
CREATE POLICY "Users can view their own favorites"
  ON favorite_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorite_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites"
  ON favorite_images FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorite_images FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. AUTOMATIC UPDATED_AT TRIGGER
-- ============================================================================

-- Create trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to image_metadata
DROP TRIGGER IF EXISTS update_image_metadata_updated_at ON image_metadata;
CREATE TRIGGER update_image_metadata_updated_at
  BEFORE UPDATE ON image_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. HELPER FUNCTIONS (OPTIONAL)
-- ============================================================================

-- Function to get all metadata with favorites info for a user
CREATE OR REPLACE FUNCTION get_user_gallery_metadata(p_user_id UUID)
RETURNS TABLE (
  image_id TEXT,
  file_name TEXT,
  carat DECIMAL,
  color TEXT,
  clarity TEXT,
  setting TEXT,
  weight DECIMAL,
  description TEXT,
  price DECIMAL,
  sku TEXT,
  notes TEXT,
  is_favorite BOOLEAN,
  favorite_order INTEGER,
  metadata_updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    im.image_id,
    im.file_name,
    im.carat,
    im.color,
    im.clarity,
    im.setting,
    im.weight,
    im.description,
    im.price,
    im.sku,
    im.notes,
    CASE WHEN fi.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite,
    fi.order_index AS favorite_order,
    im.updated_at AS metadata_updated_at
  FROM image_metadata im
  LEFT JOIN favorite_images fi ON fi.user_id = im.user_id AND fi.image_id = im.image_id
  WHERE im.user_id = p_user_id
  ORDER BY fi.order_index NULLS LAST, im.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================================================

-- Uncomment below to add sample data for testing
/*
INSERT INTO image_metadata (user_id, image_id, file_name, carat, color, clarity, setting, weight, price, sku)
VALUES 
  ('YOUR_USER_ID', 'sample-image-1', 'Diamond Ring', 1.5, 'D', 'VVS1', '18K', 5.5, 5000.00, 'JWL-001'),
  ('YOUR_USER_ID', 'sample-image-2', 'Gold Necklace', 0.75, 'E', 'VS1', '14K', 12.3, 3500.00, 'JWL-002');

INSERT INTO favorite_images (user_id, image_id, order_index)
VALUES 
  ('YOUR_USER_ID', 'sample-image-1', 1),
  ('YOUR_USER_ID', 'sample-image-2', 2);
*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

