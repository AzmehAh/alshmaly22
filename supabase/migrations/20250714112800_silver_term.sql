/*
  # Add Arabic Fields to All Tables

  1. Database Schema Updates
    - Add Arabic fields for all translatable content
    - Add `name_ar`, `description_ar`, `title_ar`, etc. to relevant tables
    - Ensure proper indexing for performance
  
  2. Security
    - Maintain existing RLS policies
    - Arabic fields inherit same security rules
*/

-- Add Arabic fields to categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE categories 
    ADD COLUMN name_ar text,
    ADD COLUMN description_ar text;
  END IF;
END $$;

-- Add Arabic fields to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN name_ar text,
    ADD COLUMN description_ar text;
  END IF;
END $$;

-- Add Arabic fields to product_images table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images' AND column_name = 'alt_text_ar'
  ) THEN
    ALTER TABLE product_images 
    ADD COLUMN alt_text_ar text;
  END IF;
END $$;

-- Add Arabic fields to blog_categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_categories' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE blog_categories 
    ADD COLUMN name_ar text;
  END IF;
END $$;

-- Add Arabic fields to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'title_ar'
  ) THEN
    ALTER TABLE blog_posts 
    ADD COLUMN title_ar text,
    ADD COLUMN excerpt_ar text,
    ADD COLUMN content_ar text,
    ADD COLUMN author_ar text DEFAULT 'فريق الشمالي',
    ADD COLUMN read_time_ar text DEFAULT '5 دقائق قراءة';
  END IF;
END $$;

-- Add Arabic fields to blog_images table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_images' AND column_name = 'alt_text_ar'
  ) THEN
    ALTER TABLE blog_images 
    ADD COLUMN alt_text_ar text;
  END IF;
END $$;

-- Add Arabic fields to export_countries table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'export_countries' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE export_countries 
    ADD COLUMN name_ar text,
    ADD COLUMN annual_exports_ar text,
    ADD COLUMN main_products_ar text;
  END IF;
END $$;

-- Update some sample Arabic data for export_countries
UPDATE export_countries SET 
  name_ar = 'الصين',
  annual_exports_ar = '2000 طن/سنة',
  main_products_ar = 'البهارات، الأعشاب المجففة'
WHERE name = 'China';

UPDATE export_countries SET 
  name_ar = 'مصر',
  annual_exports_ar = '2300 طن/سنة',
  main_products_ar = 'الفريكة، العدس، الأعشاب'
WHERE name = 'Egypt';

UPDATE export_countries SET 
  name_ar = 'قطر',
  annual_exports_ar = '1300 طن/سنة',
  main_products_ar = 'المكسرات، الفواكه المجففة'
WHERE name = 'Qatar';

UPDATE export_countries SET 
  name_ar = 'السعودية',
  annual_exports_ar = '2800 طن/سنة',
  main_products_ar = 'الفريكة، الأعشاب التقليدية'
WHERE name = 'Saudi Arabia';

UPDATE export_countries SET 
  name_ar = 'تركيا',
  annual_exports_ar = '2500 طن/سنة',
  main_products_ar = 'البهارات، البقوليات، المخللات'
WHERE name = 'Turkey';