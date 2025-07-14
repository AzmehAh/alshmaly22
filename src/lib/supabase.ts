import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Category {
  id: string;
  name: string;
  name_ar?: string;
  name_ar?: string;
  slug: string;
  description?: string;
  description_ar?: string;
  description_ar?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  id: string;
  product_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  company_name?: string;
  quantity: number;
  package_size: string;
  message?: string;
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Product {
  id: string;
  name: string;
  name_ar?: string;
  name_ar?: string;
  slug: string;
  description: string;
  description_ar?: string;
  description_ar?: string;
  category_id?: string;
  base_price: number;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
  features: string[];
  specifications_en: string[];
  specifications_ar: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
  packages?: ProductPackage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text?: string;
  alt_text_ar?: string;
  alt_text_ar?: string;
  sort_order: number;
  created_at: string;
}

export interface ProductPackage {
  id: string;
  product_id: string;
  weight: string;
  price: number;
  is_default: boolean;
  created_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  name_ar?: string;
  name_ar?: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  title_ar?: string;
  title_ar?: string;
  slug: string;
  excerpt: string;
  excerpt_ar?: string;
  excerpt_ar?: string;
  content: string;
  content_ar?: string;
  content_ar?: string;
  category_id?: string;
  author: string;
  author_ar?: string;
  author_ar?: string;
  read_time: string;
  read_time_ar?: string;
  read_time_ar?: string;
  event_date_en?: string;
  event_date_ar?: string;
  featured_image?: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  images?: BlogImage[];
}

export interface BlogImage {
  id: string;
  blog_post_id: string;
  image_url: string;
  alt_text?: string;
  alt_text_ar?: string;
  alt_text_ar?: string;
  sort_order: number;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  product_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  company_name?: string;
  quantity: number;
  package_size: string;
  message?: string;
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
  created_at: string;
  product?: Product;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  language: 'en' | 'ar';
  created_at: string;
}

export interface ExportCountry {
  id: string;
  name: string;
  name_ar?: string;
  annual_exports: string;
  annual_exports_ar?: string;
  main_products: string;
  main_products_ar?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}