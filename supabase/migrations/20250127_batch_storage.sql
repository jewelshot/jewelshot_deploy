-- Create batch-originals storage bucket for original images

-- Create bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('batch-originals', 'batch-originals', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload batch originals to own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'batch-originals' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to read their own batch originals
CREATE POLICY "Users can read own batch originals"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'batch-originals' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow users to delete their own batch originals
CREATE POLICY "Users can delete own batch originals"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'batch-originals' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow public read access (for generated images)
CREATE POLICY "Public can view batch originals"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'batch-originals');

