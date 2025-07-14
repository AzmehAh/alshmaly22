/*
  # Create Export Countries Table

  1. New Tables
    - `export_countries`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `annual_exports` (text)
      - `main_products` (text)
      - `display_order` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `export_countries` table
    - Add policy for public read access
    - Add policy for authenticated admin access
*/

-- Create export_countries table
CREATE TABLE IF NOT EXISTS export_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  annual_exports text NOT NULL,
  main_products text NOT NULL,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE export_countries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read active export_countries"
  ON export_countries FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin policies (authenticated users can manage all data)
CREATE POLICY "Authenticated users can manage export_countries"
  ON export_countries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_export_countries_display_order ON export_countries(display_order);
CREATE INDEX IF NOT EXISTS idx_export_countries_active ON export_countries(is_active);
CREATE INDEX IF NOT EXISTS idx_export_countries_name ON export_countries(name);

-- Create trigger for updated_at
CREATE TRIGGER update_export_countries_updated_at 
  BEFORE UPDATE ON export_countries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data based on the current hardcoded data
INSERT INTO export_countries (name, annual_exports, main_products, display_order, is_active) VALUES
  ('China', '2,000 tons/year', 'Spices, Dried Herbs', 1, true),
  ('Sri Lanka', '1,200 tons/year', 'Tea, Spices', 2, true),
  ('Libya', '950 tons/year', 'Legumes, Oils', 3, true),
  ('Egypt', '2,300 tons/year', 'Freekeh, Lentils, Herbs', 4, true),
  ('Palestine', '1,000 tons/year', 'Olive Oil, Thyme, Dates', 5, true),
  ('Kuwait', '1,100 tons/year', 'Spices, Grains', 6, true),
  ('Qatar', '1,300 tons/year', 'Nuts, Dried Fruits', 7, true),
  ('Saudi Arabia', '2,800 tons/year', 'Freekeh, Traditional Herbs', 8, true),
  ('Turkey', '2,500 tons/year', 'Spices, Pulses, Preserves', 9, true),
  ('Austria', '900 tons/year', 'Dried Herbs, Organic Oils', 10, true),
  ('Jordan', '2,700 tons/year', 'Freekeh, Spices, Thyme', 11, true),
  ('Iraq', '1,500 tons/year', 'Lentils, Herbs, Dates', 12, true)
ON CONFLICT (name) DO NOTHING;