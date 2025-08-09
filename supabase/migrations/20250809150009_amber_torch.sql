/*
  # Update Storage Configuration

  1. Storage Buckets
    - Ensure buckets exist with proper configuration
    - Configure public access settings
  
  2. Security Policies  
    - Allow public read access to all images
    - Restrict upload/delete to authenticated users only
*/

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('blog-images', 'blog-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('public-images', 'public-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for public images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload public images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update public images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete public images" ON storage.objects;

-- Create comprehensive policies for all buckets
-- Product Images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Blog Images
CREATE POLICY "Public read access for blog images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- Public Images
CREATE POLICY "Public read access for public images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can upload public images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can update public images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public-images')
WITH CHECK (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can delete public images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public-images');