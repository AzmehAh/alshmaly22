/*
  # Seed Sample Data for Al-Shamali Database

  This migration populates the database with sample data for:
  - Categories
  - Products with images and packages
  - Blog categories and posts with images
*/

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
  ('Spices', 'spices', 'Premium Syrian spices and seasonings'),
  ('Legumes', 'legumes', 'High-quality legumes and grains'),
  ('Ramadan Herbs and Flavors', 'ramadan-herbs', 'Special herbs and flavors for Ramadan'),
  ('Traditional Home Preserves', 'preserves', 'Traditional Syrian preserves and oils'),
  ('Natural Dried Products', 'dried-products', 'Naturally dried fruits and vegetables'),
  ('Premium Nuts', 'nuts', 'Premium quality nuts and seeds')
ON CONFLICT (slug) DO NOTHING;

-- Insert products
INSERT INTO products (name, slug, description, category_id, base_price, availability, features) VALUES
  (
    'Freekeh Zahra',
    'freekeh-zahra',
    'Authentic Freekeh made from the finest Syrian wheat, prepared in the traditional Levantine way, cleaned using the latest Sortex machines.',
    (SELECT id FROM categories WHERE slug = 'legumes'),
    45.00,
    'in-stock',
    '["We accept private labeling with the importer''s brand", "High-quality product, free from dyes, colorants, and preservatives", "Cleaned using latest Sortex machines", "Traditional Levantine preparation method"]'::jsonb
  ),
  (
    'Premium Sumac Powder',
    'sumac-powder',
    'Authentic Middle Eastern sumac with a tangy, lemony flavor. Perfect for seasoning salads, meats, and traditional dishes.',
    (SELECT id FROM categories WHERE slug = 'spices'),
    28.00,
    'in-stock',
    '["100% natural with no additives", "Traditional grinding methods", "Rich in antioxidants", "Authentic Syrian origin"]'::jsonb
  ),
  (
    'Cold-Pressed Olive Oil',
    'olive-oil',
    'Premium cold-pressed olive oil from Syrian olive groves. Rich flavor and high quality for cooking and dressing.',
    (SELECT id FROM categories WHERE slug = 'preserves'),
    85.00,
    'in-stock',
    '["Cold-pressed extraction", "Extra virgin quality", "Traditional Syrian olives", "Rich in healthy fats"]'::jsonb
  ),
  (
    'Dried Mint Leaves',
    'dried-mint',
    'Fresh dried mint leaves perfect for tea, cooking, and traditional Middle Eastern dishes.',
    (SELECT id FROM categories WHERE slug = 'ramadan-herbs'),
    15.00,
    'out-of-stock',
    '["Air-dried naturally", "Intense flavor and aroma", "Perfect for tea and cooking", "Harvested at peak freshness"]'::jsonb
  ),
  (
    'Red Lentils',
    'red-lentils',
    'High-quality red lentils, perfect for soups, stews, and traditional Middle Eastern dishes.',
    (SELECT id FROM categories WHERE slug = 'legumes'),
    32.00,
    'in-stock',
    '["Quick cooking variety", "High protein content", "Cleaned and sorted", "Ideal for soups and stews"]'::jsonb
  ),
  (
    'Cumin Seeds',
    'cumin-seeds',
    'Aromatic cumin seeds with intense flavor, essential for Middle Eastern and Mediterranean cooking.',
    (SELECT id FROM categories WHERE slug = 'spices'),
    22.00,
    'in-stock',
    '["Whole seeds for maximum freshness", "Intense aromatic flavor", "Essential for traditional dishes", "Premium quality selection"]'::jsonb
  ),
  (
    'Natural Dried Apricots',
    'dried-apricots',
    'Sweet and nutritious dried apricots, naturally dried without preservatives.',
    (SELECT id FROM categories WHERE slug = 'dried-products'),
    55.00,
    'in-stock',
    '["No preservatives added", "Naturally sweet", "Rich in vitamins", "Traditional drying methods"]'::jsonb
  ),
  (
    'Premium Almonds',
    'premium-almonds',
    'High-quality almonds, carefully selected and processed for maximum freshness and flavor.',
    (SELECT id FROM categories WHERE slug = 'nuts'),
    95.00,
    'in-stock',
    '["Carefully selected", "High nutritional value", "Fresh and crunchy", "Premium grade quality"]'::jsonb
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order) VALUES
  -- Freekeh Zahra
  ((SELECT id FROM products WHERE slug = 'freekeh-zahra'), 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Freekeh Zahra Premium Quality', 0),
  ((SELECT id FROM products WHERE slug = 'freekeh-zahra'), 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Freekeh Zahra Packaging', 1),
  ((SELECT id FROM products WHERE slug = 'freekeh-zahra'), 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Freekeh Zahra Close-up', 2),
  
  -- Sumac Powder
  ((SELECT id FROM products WHERE slug = 'sumac-powder'), 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Premium Sumac Powder', 0),
  ((SELECT id FROM products WHERE slug = 'sumac-powder'), 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Sumac Powder Texture', 1),
  
  -- Olive Oil
  ((SELECT id FROM products WHERE slug = 'olive-oil'), 'https://images.pexels.com/photos/33307/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=800&h=600', 'Cold-Pressed Olive Oil', 0),
  
  -- Dried Mint
  ((SELECT id FROM products WHERE slug = 'dried-mint'), 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Dried Mint Leaves', 0),
  
  -- Red Lentils
  ((SELECT id FROM products WHERE slug = 'red-lentils'), 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'High-Quality Red Lentils', 0),
  
  -- Cumin Seeds
  ((SELECT id FROM products WHERE slug = 'cumin-seeds'), 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Aromatic Cumin Seeds', 0),
  
  -- Dried Apricots
  ((SELECT id FROM products WHERE slug = 'dried-apricots'), 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Natural Dried Apricots', 0),
  
  -- Premium Almonds
  ((SELECT id FROM products WHERE slug = 'premium-almonds'), 'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Premium Quality Almonds', 0);

-- Insert product packages
INSERT INTO product_packages (product_id, weight, price, is_default) VALUES
  -- Freekeh Zahra
  ((SELECT id FROM products WHERE slug = 'freekeh-zahra'), '1kg', 8.00, false),
  ((SELECT id FROM products WHERE slug = 'freekeh-zahra'), '10kg', 35.00, false),
  ((SELECT id FROM products WHERE slug = 'freekeh-zahra'), '25kg', 45.00, true),
  
  -- Sumac Powder
  ((SELECT id FROM products WHERE slug = 'sumac-powder'), '1kg', 12.00, false),
  ((SELECT id FROM products WHERE slug = 'sumac-powder'), '5kg', 28.00, true),
  ((SELECT id FROM products WHERE slug = 'sumac-powder'), '10kg', 50.00, false),
  
  -- Olive Oil
  ((SELECT id FROM products WHERE slug = 'olive-oil'), '1L', 25.00, false),
  ((SELECT id FROM products WHERE slug = 'olive-oil'), '5L', 85.00, true),
  ((SELECT id FROM products WHERE slug = 'olive-oil'), '10L', 160.00, false),
  
  -- Dried Mint
  ((SELECT id FROM products WHERE slug = 'dried-mint'), '500g', 8.00, false),
  ((SELECT id FROM products WHERE slug = 'dried-mint'), '1kg', 15.00, true),
  ((SELECT id FROM products WHERE slug = 'dried-mint'), '5kg', 65.00, false),
  
  -- Red Lentils
  ((SELECT id FROM products WHERE slug = 'red-lentils'), '1kg', 4.50, false),
  ((SELECT id FROM products WHERE slug = 'red-lentils'), '10kg', 32.00, false),
  ((SELECT id FROM products WHERE slug = 'red-lentils'), '25kg', 75.00, true),
  
  -- Cumin Seeds
  ((SELECT id FROM products WHERE slug = 'cumin-seeds'), '1kg', 8.00, false),
  ((SELECT id FROM products WHERE slug = 'cumin-seeds'), '5kg', 22.00, true),
  ((SELECT id FROM products WHERE slug = 'cumin-seeds'), '10kg', 40.00, false),
  
  -- Dried Apricots
  ((SELECT id FROM products WHERE slug = 'dried-apricots'), '1kg', 15.00, false),
  ((SELECT id FROM products WHERE slug = 'dried-apricots'), '5kg', 55.00, true),
  ((SELECT id FROM products WHERE slug = 'dried-apricots'), '10kg', 100.00, false),
  
  -- Premium Almonds
  ((SELECT id FROM products WHERE slug = 'premium-almonds'), '1kg', 25.00, false),
  ((SELECT id FROM products WHERE slug = 'premium-almonds'), '5kg', 95.00, true),
  ((SELECT id FROM products WHERE slug = 'premium-almonds'), '10kg', 180.00, false);

-- Insert blog categories
INSERT INTO blog_categories (name, slug) VALUES
  ('Events', 'events'),
  ('Products', 'products'),
  ('Sustainability', 'sustainability'),
  ('Traditional Methods', 'traditional-methods'),
  ('Technology', 'technology'),
  ('Business', 'business')
ON CONFLICT (slug) DO NOTHING;

-- Insert blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, author, read_time, featured_image, published_at) VALUES
  (
    'Al-Shamali Participates in Middle East Food Exhibition 2024',
    'middle-east-food-exhibition-2024',
    'We showcased our latest product line at the regional food exhibition, connecting with international buyers and demonstrating our commitment to quality Syrian agricultural products.',
    '<p>Al-Shamali proudly participated in the Middle East Food Exhibition 2024, one of the region''s most prestigious agricultural trade shows. This year''s exhibition provided an excellent platform for us to showcase our premium Syrian agricultural products to an international audience.</p>

<p>Our booth featured a comprehensive display of our product range, including our signature freekeh, premium spices, natural oils, and traditional herbs. Visitors were particularly impressed with our quality control processes and the authentic taste of our products.</p>

<h3>Key Highlights from the Exhibition</h3>
<p>During the three-day event, we had the opportunity to connect with buyers from over 25 countries. Many expressed interest in establishing long-term partnerships with Al-Shamali, recognizing our commitment to quality and authenticity.</p>

<p>We demonstrated our modern Sortex cleaning technology, which ensures that our products meet international quality standards while preserving their natural characteristics. This technology has been instrumental in maintaining our reputation for excellence.</p>

<h3>New Product Launches</h3>
<p>The exhibition also served as the launch platform for our new premium nut collection and enhanced packaging options. We introduced eco-friendly packaging solutions that align with global sustainability trends while maintaining product freshness.</p>

<p>Our team conducted live demonstrations of traditional Syrian food preparation methods, allowing visitors to experience the authentic flavors and aromas of our products. These demonstrations were particularly popular among international buyers seeking genuine Middle Eastern ingredients.</p>

<h3>Looking Forward</h3>
<p>The positive response from the exhibition reinforces our commitment to expanding our global reach while maintaining the highest quality standards. We''re excited about the new partnerships formed and look forward to bringing authentic Syrian flavors to even more markets worldwide.</p>',
    (SELECT id FROM blog_categories WHERE slug = 'events'),
    'Al-Shamali Team',
    '5 min read',
    'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    '2024-01-15'::timestamptz
  ),
  (
    'New Shipment of Premium Freekeh to European Markets',
    'premium-freekeh-european-markets',
    'Our latest shipment of premium freekeh is now available across Europe. Learn about our quality control process and what makes our freekeh special.',
    '<p>We''re excited to announce that our latest shipment of premium freekeh has successfully reached European markets, bringing authentic Syrian flavors to discerning customers across the continent.</p>

<p>This shipment represents months of careful cultivation, harvesting, and processing using traditional methods combined with modern quality control techniques. Each batch of freekeh undergoes rigorous testing to ensure it meets our exacting standards.</p>

<h3>What Makes Our Freekeh Special</h3>
<p>Our freekeh is made from young green wheat that is harvested at the perfect moment of ripeness. The wheat is then roasted and rubbed to create the distinctive smoky flavor that freekeh is known for. This ancient process has been passed down through generations of Syrian farmers.</p>

<p>We use only the finest Syrian wheat varieties, grown in the fertile soils of northern Syria. The unique climate and soil conditions in this region contribute to the exceptional quality and flavor of our freekeh.</p>

<h3>Quality Control Process</h3>
<p>Every batch of freekeh is processed using our state-of-the-art Sortex machines, which remove any impurities while preserving the natural characteristics of the grain. This technology ensures consistent quality and safety standards that meet international requirements.</p>

<p>Our quality control team conducts multiple inspections throughout the processing chain, from raw material selection to final packaging. This attention to detail has earned us certifications from leading international quality organizations.</p>

<h3>Availability in European Markets</h3>
<p>This latest shipment is now available through our network of distributors across Germany, France, the Netherlands, and the United Kingdom. We''re working to expand availability to additional European markets in the coming months.</p>',
    (SELECT id FROM blog_categories WHERE slug = 'products'),
    'Al-Shamali Team',
    '3 min read',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    '2024-01-10'::timestamptz
  ),
  (
    'Sustainability Practices in Syrian Agriculture',
    'sustainability-syrian-agriculture',
    'Learn about our commitment to sustainable farming practices and how we support local Syrian farmers while maintaining the highest quality standards.',
    '<p>At Al-Shamali, sustainability isn''t just a buzzword—it''s a core principle that guides every aspect of our operations. From supporting local farmers to implementing eco-friendly packaging, we''re committed to practices that benefit both our customers and the environment.</p>

<h3>Supporting Local Farmers</h3>
<p>We work directly with Syrian farmers, providing them with fair prices for their crops and technical support to improve their farming practices. This direct relationship ensures that our farmers can invest in sustainable methods while maintaining their livelihoods.</p>

<p>Our agricultural consultants regularly visit farms to provide guidance on crop rotation, natural pest control, and soil conservation techniques. These practices not only improve crop quality but also help preserve the land for future generations.</p>

<h3>Water Conservation</h3>
<p>Water is a precious resource in Syria, and we''ve implemented several initiatives to reduce water consumption in our processing facilities. Our modern cleaning equipment uses 40% less water than traditional methods while maintaining superior cleaning standards.</p>

<h3>Eco-Friendly Packaging</h3>
<p>We''ve recently introduced biodegradable packaging options for several of our product lines. These packages maintain product freshness while reducing environmental impact. We''re working towards making all our packaging sustainable by 2025.</p>

<h3>Energy Efficiency</h3>
<p>Our processing facilities have been upgraded with energy-efficient equipment, reducing our carbon footprint by 30% over the past two years. We''ve also installed solar panels to power our administrative offices.</p>

<h3>Community Impact</h3>
<p>Beyond environmental sustainability, we''re committed to social sustainability. We provide employment opportunities in rural areas and support local schools and healthcare facilities through our community development programs.</p>',
    (SELECT id FROM blog_categories WHERE slug = 'sustainability'),
    'Al-Shamali Team',
    '7 min read',
    'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
    '2024-01-05'::timestamptz
  );

-- Insert blog images
INSERT INTO blog_images (blog_post_id, image_url, alt_text, sort_order) VALUES
  -- Exhibition blog post images
  ((SELECT id FROM blog_posts WHERE slug = 'middle-east-food-exhibition-2024'), 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Al-Shamali booth at the exhibition', 0),
  ((SELECT id FROM blog_posts WHERE slug = 'middle-east-food-exhibition-2024'), 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Product display at the exhibition', 1),
  ((SELECT id FROM blog_posts WHERE slug = 'middle-east-food-exhibition-2024'), 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Team members at the exhibition', 2),
  ((SELECT id FROM blog_posts WHERE slug = 'middle-east-food-exhibition-2024'), 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Visitors tasting products', 3),
  
  -- Freekeh blog post images
  ((SELECT id FROM blog_posts WHERE slug = 'premium-freekeh-european-markets'), 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Premium freekeh ready for shipment', 0),
  ((SELECT id FROM blog_posts WHERE slug = 'premium-freekeh-european-markets'), 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Freekeh quality control process', 1),
  ((SELECT id FROM blog_posts WHERE slug = 'premium-freekeh-european-markets'), 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Packaging process', 2),
  
  -- Sustainability blog post images
  ((SELECT id FROM blog_posts WHERE slug = 'sustainability-syrian-agriculture'), 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Syrian farmers working in the field', 0),
  ((SELECT id FROM blog_posts WHERE slug = 'sustainability-syrian-agriculture'), 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Sustainable farming practices', 1),
  ((SELECT id FROM blog_posts WHERE slug = 'sustainability-syrian-agriculture'), 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'Eco-friendly packaging', 2);