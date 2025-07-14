/*
  # Create quote_requests table

  1. New Tables
    - `quote_requests`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text, optional)
      - `company_name` (text, optional)
      - `quantity` (integer)
      - `package_size` (text)
      - `message` (text, optional)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `quote_requests` table
    - Add policies for public insert and authenticated read/update
    - Add foreign key constraint to products table

  3. Indexes
    - Index on product_id for faster lookups
    - Index on status for filtering
    - Index on created_at for ordering
*/

CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  company_name text,
  quantity integer NOT NULL DEFAULT 1,
  package_size text NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'responded', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create quote_requests"
  ON quote_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read quote_requests"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update quote_requests"
  ON quote_requests
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete quote_requests"
  ON quote_requests
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quote_requests_product_id ON quote_requests(product_id);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_quote_requests_updated_at'
  ) THEN
    CREATE TRIGGER update_quote_requests_updated_at
      BEFORE UPDATE ON quote_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;