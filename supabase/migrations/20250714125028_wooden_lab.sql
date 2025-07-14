/*
  # Add Product Specifications Fields

  1. New Fields
    - `specifications_en` (jsonb) - English product specifications
    - `specifications_ar` (jsonb) - Arabic product specifications
  
  2. Changes
    - Add bilingual specification fields to products table
    - Enable storing structured specification data
*/

-- Add specifications fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS specifications_en jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS specifications_ar jsonb DEFAULT '[]'::jsonb;

-- Add some sample specifications data
UPDATE products 
SET specifications_en = '[
  "100% Natural",
  "No artificial preservatives", 
  "Gluten-free",
  "Non-GMO",
  "Sortex cleaned",
  "Premium quality"
]'::jsonb
WHERE specifications_en = '[]'::jsonb;

UPDATE products 
SET specifications_ar = '[
  "100% طبيعي",
  "خالي من المواد الحافظة الاصطناعية",
  "خالي من الجلوتين", 
  "غير معدل وراثياً",
  "منظف بتقنية السورتكس",
  "جودة متميزة"
]'::jsonb
WHERE specifications_ar = '[]'::jsonb;