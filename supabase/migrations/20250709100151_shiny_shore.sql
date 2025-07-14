/*
  # Add Homepage Content Selection and Related Content Features

  1. New Tables
    - `homepage_products` - Track which products to display on homepage
    - `homepage_blog_posts` - Track which blog posts to display on homepage
    - `product_relations` - Manage related products
    - `blog_post_relations` - Manage related blog posts

  2. Changes
    - Add fields to track homepage display and related content
    - Add proper indexes and constraints
    - Enable RLS and add policies
*/

-- Create homepage_products table
CREATE TABLE IF NOT EXISTS homepage_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id)
);

-- Create homepage_blog_posts table
CREATE TABLE IF NOT EXISTS homepage_blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(blog_post_id)
);

-- Create product_relations table
CREATE TABLE IF NOT EXISTS product_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  related_product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  relation_type text DEFAULT 'related' CHECK (relation_type IN ('related', 'similar', 'complementary')),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, related_product_id),
  CHECK (product_id != related_product_id)
);

-- Create blog_post_relations table
CREATE TABLE IF NOT EXISTS blog_post_relations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  related_blog_post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  relation_type text DEFAULT 'related' CHECK (relation_type IN ('related', 'similar', 'follow_up')),
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blog_post_id, related_blog_post_id),
  CHECK (blog_post_id != related_blog_post_id)
);

-- Enable Row Level Security
ALTER TABLE homepage_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_relations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read homepage_products"
  ON homepage_products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read homepage_blog_posts"
  ON homepage_blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can read product_relations"
  ON product_relations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read blog_post_relations"
  ON blog_post_relations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin policies (authenticated users can manage all data)
CREATE POLICY "Authenticated users can manage homepage_products"
  ON homepage_products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage homepage_blog_posts"
  ON homepage_blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage product_relations"
  ON product_relations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage blog_post_relations"
  ON blog_post_relations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_homepage_products_display_order ON homepage_products(display_order);
CREATE INDEX IF NOT EXISTS idx_homepage_products_active ON homepage_products(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_blog_posts_display_order ON homepage_blog_posts(display_order);
CREATE INDEX IF NOT EXISTS idx_homepage_blog_posts_active ON homepage_blog_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_product_relations_product_id ON product_relations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_relations_related_product_id ON product_relations(related_product_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_relations_blog_post_id ON blog_post_relations(blog_post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_relations_related_blog_post_id ON blog_post_relations(related_blog_post_id);

-- Create triggers for updated_at
CREATE TRIGGER update_homepage_products_updated_at BEFORE UPDATE ON homepage_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homepage_blog_posts_updated_at BEFORE UPDATE ON homepage_blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();