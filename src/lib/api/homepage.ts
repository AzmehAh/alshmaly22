import { supabase } from '../supabase';
import type { Product, BlogPost } from '../supabase';

export interface HomepageProduct {
  id: string;
  product_id: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface HomepageBlogPost {
  id: string;
  blog_post_id: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  blog_post?: BlogPost;
}

export class HomepageAPI {
  // Get homepage products
  static async getHomepageProducts(): Promise<HomepageProduct[]> {
    const { data, error } = await supabase
      .from('homepage_products')
      .select(`
        *,
        product:products(
          *,
          category:categories(*),
          images:product_images(*),
          packages:product_packages(*)
        )
      `)
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  // Get all homepage products for admin
  static async getAllHomepageProducts(): Promise<HomepageProduct[]> {
    const { data, error } = await supabase
      .from('homepage_products')
      .select(`
        *,
        product:products(*)
      `)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  // Add product to homepage
  static async addProductToHomepage(productId: string, displayOrder = 0): Promise<HomepageProduct> {
    const { data, error } = await supabase
      .from('homepage_products')
      .insert({
        product_id: productId,
        display_order: displayOrder,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove product from homepage
  static async removeProductFromHomepage(productId: string): Promise<void> {
    const { error } = await supabase
      .from('homepage_products')
      .delete()
      .eq('product_id', productId);

    if (error) throw error;
  }

  // Update homepage product
  static async updateHomepageProduct(id: string, updates: Partial<HomepageProduct>): Promise<HomepageProduct> {
    const { data, error } = await supabase
      .from('homepage_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get homepage blog posts
  static async getHomepageBlogPosts(): Promise<HomepageBlogPost[]> {
    const { data, error } = await supabase
      .from('homepage_blog_posts')
      .select(`
        *,
        blog_post:blog_posts(
          *,
          category:blog_categories(*)
        )
      `)
      .eq('is_active', true)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  // Get all homepage blog posts for admin
  static async getAllHomepageBlogPosts(): Promise<HomepageBlogPost[]> {
    const { data, error } = await supabase
      .from('homepage_blog_posts')
      .select(`
        *,
        blog_post:blog_posts(*)
      `)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  // Add blog post to homepage
  static async addBlogPostToHomepage(blogPostId: string, displayOrder = 0): Promise<HomepageBlogPost> {
    const { data, error } = await supabase
      .from('homepage_blog_posts')
      .insert({
        blog_post_id: blogPostId,
        display_order: displayOrder,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Remove blog post from homepage
  static async removeBlogPostFromHomepage(blogPostId: string): Promise<void> {
    const { error } = await supabase
      .from('homepage_blog_posts')
      .delete()
      .eq('blog_post_id', blogPostId);

    if (error) throw error;
  }

  // Update homepage blog post
  static async updateHomepageBlogPost(id: string, updates: Partial<HomepageBlogPost>): Promise<HomepageBlogPost> {
    const { data, error } = await supabase
      .from('homepage_blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}