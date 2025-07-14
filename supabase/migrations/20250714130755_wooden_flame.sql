/*
  # Add Event Date Fields to Blog Posts

  1. New Fields
    - `event_date_en` (text) - Event date in English format
    - `event_date_ar` (text) - Event date in Arabic format
  
  2. Purpose
    - Allow storing formatted event dates for blog posts in both languages
    - Support cultural date formatting preferences
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'event_date_en'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN event_date_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'event_date_ar'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN event_date_ar text;
  END IF;
END $$;