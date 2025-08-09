/*
  # Configure Storage Bucket Policies

  1. Storage Buckets Setup
    - Create required storage buckets if they don't exist
    - `product-images` - for product image storage
    - `blog-images` - for blog post image storage  
    - `public-images` - for general public image storage

  2. Security Policies
    - Public SELECT access for viewing images (anon + authenticated)
    - Authenticated-only INSERT/UPDATE/DELETE for managing images
    - Policies apply to all three storage buckets
*/

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('blog-images', 'blog-images', true),
  ('public-images', 'public-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-images bucket
CREATE POLICY "Public can view product images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- Storage policies for blog-images bucket
CREATE POLICY "Public can view blog images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');

-- Storage policies for public-images bucket
CREATE POLICY "Public can view public images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can upload public images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can update public images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'public-images')
WITH CHECK (bucket_id = 'public-images');

CREATE POLICY "Authenticated users can delete public images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'public-images');