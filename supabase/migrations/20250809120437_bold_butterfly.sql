/*
  # Add featured_image column to products table

  1. Schema Changes
    - Add `featured_image` column to `products` table
      - `featured_image` (text, nullable) - URL for the main product image

  2. Notes
    - This column will store the URL of the primary image for each product
    - Column is nullable to allow products without featured images
    - Existing products will have NULL values initially
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'featured_image'
  ) THEN
    ALTER TABLE products ADD COLUMN featured_image text;
  END IF;
END $$;