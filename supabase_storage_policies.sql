-- ========================================
-- JEWELSHOT - STORAGE POLICIES (HIZLI)
-- ========================================
-- Bu SQL'i Supabase SQL Editor'de çalıştır
-- Tüm storage policies tek seferde oluşur!
-- ========================================

-- Policy 1: Users can upload images to their own folder
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Anyone can view public images
CREATE POLICY "Public images are viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy 3: Users can delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Users can update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ========================================
-- ✅ STORAGE POLICIES COMPLETE!
-- ========================================
