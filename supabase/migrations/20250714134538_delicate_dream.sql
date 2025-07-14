/*
  # Ensure Foreign Key Constraints

  1. Security
    - Ensure all foreign key constraints exist properly
    - Fix any missing relationships

  2. Product Relations
    - Verify product_relations table has proper foreign keys
    - Ensure referential integrity

  3. Blog Post Relations  
    - Verify blog_post_relations table has proper foreign keys
    - Ensure referential integrity
*/

-- Ensure product_relations foreign key constraints exist
DO $$
BEGIN
  -- Check and add product_id foreign key if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'product_relations_product_id_fkey'
    AND table_name = 'product_relations'
  ) THEN
    ALTER TABLE product_relations 
    ADD CONSTRAINT product_relations_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;

  -- Check and add related_product_id foreign key if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'product_relations_related_product_id_fkey'
    AND table_name = 'product_relations'
  ) THEN
    ALTER TABLE product_relations 
    ADD CONSTRAINT product_relations_related_product_id_fkey 
    FOREIGN KEY (related_product_id) REFERENCES products(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure blog_post_relations foreign key constraints exist
DO $$
BEGIN
  -- Check and add blog_post_id foreign key if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'blog_post_relations_blog_post_id_fkey'
    AND table_name = 'blog_post_relations'
  ) THEN
    ALTER TABLE blog_post_relations 
    ADD CONSTRAINT blog_post_relations_blog_post_id_fkey 
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;
  END IF;

  -- Check and add related_blog_post_id foreign key if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'blog_post_relations_related_blog_post_id_fkey'
    AND table_name = 'blog_post_relations'
  ) THEN
    ALTER TABLE blog_post_relations 
    ADD CONSTRAINT blog_post_relations_related_blog_post_id_fkey 
    FOREIGN KEY (related_blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE;
  END IF;
END $$;