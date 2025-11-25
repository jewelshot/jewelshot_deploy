-- ============================================
-- FIX STORAGE BUCKET FOR GALLERY IMAGES
-- ============================================
-- Galerideki görsellerin görünmesi için gerekli düzeltmeler

-- 1. Images bucket'ını oluştur (eğer yoksa) ve public yap
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) 
DO UPDATE SET public = true;

-- 2. Eski storage.objects policy'lerini temizle (çakışmaları önlemek için)
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public images are viewable" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- 3. YENİ POLICY'LER - Basit ve açık

-- Policy 1: Herkes images bucket'ındaki dosyaları görebilir (PUBLIC READ)
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Policy 2: Authenticated kullanıcılar kendi klasörlerine upload edebilir
CREATE POLICY "Authenticated users can upload to own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Kullanıcılar kendi dosyalarını silebilir
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Kullanıcılar kendi dosyalarını güncelleyebilir
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Images tablosu için RLS politikalarını kontrol et
-- (Bu politikalar zaten var ama eksikse oluştur)

DO $$ 
BEGIN
  -- Eski policy'leri temizle
  DROP POLICY IF EXISTS "Users can view own images" ON public.images;
  DROP POLICY IF EXISTS "Users can insert own images" ON public.images;
  DROP POLICY IF EXISTS "Users can update own images" ON public.images;
  DROP POLICY IF EXISTS "Users can delete own images" ON public.images;
  
  -- Yeni policy'ler oluştur
  CREATE POLICY "Users can view own images"
    ON public.images FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own images"
    ON public.images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update own images"
    ON public.images FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can delete own images"
    ON public.images FOR DELETE
    USING (auth.uid() = user_id);
    
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- ✅ STORAGE BUCKET FIX COMPLETE!
-- ============================================

-- Test için:
-- 1. Supabase Dashboard > Storage > images bucket'ını kontrol et
-- 2. Bucket "Public" olarak işaretli mi?
-- 3. Gallery sayfasını yenile ve görsellerin gelip gelmediğini kontrol et

-- Debug için:
-- SELECT * FROM storage.buckets WHERE id = 'images';
-- SELECT * FROM storage.objects WHERE bucket_id = 'images' LIMIT 10;

