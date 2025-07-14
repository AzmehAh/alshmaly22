import { supabase } from '../supabase';
import type { Product, BlogPost } from '../supabase';

export interface ProductRelation {
  id: string;
  product_id: string;
  related_product_id: string;
  relation_type: 'related' | 'similar' | 'complementary';
  display_order: number;
  created_at: string;
  product?: Product;
  related_product?: Product;
}

export interface BlogPostRelation {
  id: string;
  blog_post_id: string;
  related_blog_post_id: string;
  relation_type: 'related' | 'similar' | 'follow_up';
  display_order: number;
  created_at: string;
  blog_post?: BlogPost;
  related_blog_post?: BlogPost;
}

export class RelationsAPI {
  // Product Relations
  static async getProductRelations(productId: string): Promise<ProductRelation[]> {
    const { data, error } = await supabase
      .from('product_relations')
      .select(`
        *,
        related_product:products(
          *,
          category:categories(*),
          images:product_images(*)
        )
      `)
      .eq('product_id', productId)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  static async addProductRelation(
    productId: string, 
    relatedProductId: string, 
    relationType: 'related' | 'similar' | 'complementary' = 'related',
    displayOrder = 0
  ): Promise<ProductRelation> {
    const { data, error } = await supabase
      .from('product_relations')
      .insert({
        product_id: productId,
        related_product_id: relatedProductId,
        relation_type: relationType,
        display_order: displayOrder
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeProductRelation(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_relations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async updateProductRelation(id: string, updates: Partial<ProductRelation>): Promise<ProductRelation> {
    const { data, error } = await supabase
      .from('product_relations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Blog Post Relations
  static async getBlogPostRelations(blogPostId: string): Promise<BlogPostRelation[]> {
    const { data, error } = await supabase
      .from('blog_post_relations')
      .select(`
        *,
        related_blog_post:blog_posts(
          *,
          category:blog_categories(*)
        )
      `)
      .eq('blog_post_id', blogPostId)
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  static async addBlogPostRelation(
    blogPostId: string, 
    relatedBlogPostId: string, 
    relationType: 'related' | 'similar' | 'follow_up' = 'related',
    displayOrder = 0
  ): Promise<BlogPostRelation> {
    const { data, error } = await supabase
      .from('blog_post_relations')
      .insert({
        blog_post_id: blogPostId,
        related_blog_post_id: relatedBlogPostId,
        relation_type: relationType,
        display_order: displayOrder
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async removeBlogPostRelation(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_post_relations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async updateBlogPostRelation(id: string, updates: Partial<BlogPostRelation>): Promise<BlogPostRelation> {
    const { data, error } = await supabase
      .from('blog_post_relations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}