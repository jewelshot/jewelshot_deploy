-- ============================================
-- SUPABASE STORAGE BUCKET SETUP
-- ============================================
-- Bu SQL'i Supabase Dashboard > Storage > New Bucket 
-- veya SQL Editor'da çalıştır

-- 1. "generations" bucket'ını oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public)
VALUES ('generations', 'generations', true)
ON CONFLICT (id) DO NOTHING;

-- 2. RLS Policies (Row Level Security)

-- Policy 1: Kullanıcılar kendi klasörlerine upload edebilir
CREATE POLICY "Users can upload to own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'generations' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 2: Kullanıcılar kendi dosyalarını görebilir
CREATE POLICY "Users can view own files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'generations' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Kullanıcılar kendi dosyalarını silebilir
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'generations' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Public read for all files (bucket is public)
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'generations');

-- ============================================
-- NOTES
-- ============================================
-- 
-- Bucket Structure:
-- generations/
--   ├── {user_id}/
--   │   ├── generated-1234567890-abc123.jpg
--   │   ├── generated-1234567891-def456.jpg
--   │   └── ...
--
-- Security:
-- - Bucket is PUBLIC (anyone can read)
-- - But only authenticated users can upload
-- - Users can only upload to their own folder
-- - Users can only delete their own files
--
-- Usage:
-- 1. Create bucket (if not exists)
-- 2. Apply RLS policies
-- 3. Test upload: image-proxy.ts will handle uploads
--
-- Testing:
-- Upload test image:
-- SELECT * FROM storage.objects WHERE bucket_id = 'generations';
--
-- Check bucket:
-- SELECT * FROM storage.buckets WHERE id = 'generations';

