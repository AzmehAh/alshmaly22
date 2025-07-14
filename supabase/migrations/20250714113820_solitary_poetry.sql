/*
  # Add Arabic fields to remaining tables

  1. Products table updates
    - Add name_ar, description_ar fields
  
  2. Categories table updates
    - Add name_ar, description_ar fields
  
  3. Blog posts table updates
    - Add title_ar, excerpt_ar, content_ar, author_ar, read_time_ar fields
  
  4. Blog categories table updates
    - Add name_ar field
  
  5. Product images table updates
    - Add alt_text_ar field
  
  6. Blog images table updates
    - Add alt_text_ar field
  
  7. Contact messages table updates
    - Add language field for filtering
*/

-- Add Arabic fields to categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE categories ADD COLUMN name_ar text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'description_ar'
  ) THEN
    ALTER TABLE categories ADD COLUMN description_ar text;
  END IF;
END $$;

-- Add Arabic fields to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE products ADD COLUMN name_ar text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'description_ar'
  ) THEN
    ALTER TABLE products ADD COLUMN description_ar text;
  END IF;
END $$;

-- Add Arabic fields to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'title_ar'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN title_ar text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'excerpt_ar'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN excerpt_ar text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'content_ar'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN content_ar text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'author_ar'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN author_ar text DEFAULT 'فريق الشمالي';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'read_time_ar'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN read_time_ar text DEFAULT '5 دقائق قراءة';
  END IF;
END $$;

-- Add Arabic fields to blog_categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_categories' AND column_name = 'name_ar'
  ) THEN
    ALTER TABLE blog_categories ADD COLUMN name_ar text;
  END IF;
END $$;

-- Add Arabic fields to product_images table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images' AND column_name = 'alt_text_ar'
  ) THEN
    ALTER TABLE product_images ADD COLUMN alt_text_ar text;
  END IF;
END $$;

-- Add Arabic fields to blog_images table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_images' AND column_name = 'alt_text_ar'
  ) THEN
    ALTER TABLE blog_images ADD COLUMN alt_text_ar text;
  END IF;
END $$;

-- Add language field to contact_messages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_messages' AND column_name = 'language'
  ) THEN
    ALTER TABLE contact_messages ADD COLUMN language text DEFAULT 'en' CHECK (language IN ('en', 'ar'));
  END IF;
END $$;

-- Sample Arabic data for categories
UPDATE categories SET 
  name_ar = CASE
    WHEN name = 'Spices' THEN 'البهارات'
    WHEN name = 'Legumes' THEN 'البقوليات'
    WHEN name = 'Herbs' THEN 'الأعشاب'
    WHEN name = 'Oils' THEN 'الزيوت'
    WHEN name = 'Grains' THEN 'الحبوب'
    ELSE name
  END,
  description_ar = CASE
    WHEN name = 'Spices' THEN 'مجموعة متنوعة من البهارات السورية الأصيلة'
    WHEN name = 'Legumes' THEN 'بقوليات طبيعية عالية الجودة'
    WHEN name = 'Herbs' THEN 'أعشاب طبيعية مجففة ومعالجة بعناية'
    WHEN name = 'Oils' THEN 'زيوت طبيعية مستخرجة بطرق تقليدية'
    WHEN name = 'Grains' THEN 'حبوب طبيعية ومنتجات الحبوب'
    ELSE description
  END
WHERE name IN ('Spices', 'Legumes', 'Herbs', 'Oils', 'Grains');

-- Sample Arabic data for blog categories
UPDATE blog_categories SET 
  name_ar = CASE
    WHEN name = 'News' THEN 'أخبار'
    WHEN name = 'Recipes' THEN 'وصفات'
    WHEN name = 'Agriculture' THEN 'الزراعة'
    WHEN name = 'Health' THEN 'الصحة'
    WHEN name = 'Sustainability' THEN 'الاستدامة'
    ELSE name
  END
WHERE name IN ('News', 'Recipes', 'Agriculture', 'Health', 'Sustainability');