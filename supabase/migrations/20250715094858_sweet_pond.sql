/*
  # Update Products Schema

  1. Database Changes
    - Remove features column from products table
    - Update availability constraint to only allow 'in-stock' and 'limited'
    - Update existing 'out-of-stock' records to 'limited'

  2. Security
    - Maintain existing RLS policies
*/

-- First, update any existing 'out-of-stock' records to 'limited'
UPDATE products 
SET availability = 'limited' 
WHERE availability = 'out-of-stock';

-- Drop the existing availability constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_availability_check;

-- Add new availability constraint with only 'in-stock' and 'limited'
ALTER TABLE products ADD CONSTRAINT products_availability_check 
CHECK ((availability = ANY (ARRAY['in-stock'::text, 'limited'::text])));

-- Remove the features column
ALTER TABLE products DROP COLUMN IF EXISTS features;