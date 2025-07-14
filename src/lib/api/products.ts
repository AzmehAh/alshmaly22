import { supabase } from '../supabase';
import type { Product, Category } from '../supabase';

export interface ProductFilters {
  category?: string;
  availability?: string;
  weight?: string;
  search?: string;
  sortBy?: 'name' | 'price-low' | 'price-high';
}

export class ProductsAPI {
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Get all products with filters
  static async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        packages:product_packages(*)
      `);

    // Apply filters
    if (filters.category && filters.category !== 'all') {
      // First get the category ID by slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.category)
        .single();
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    if (filters.availability && filters.availability !== 'all') {
      query = query.eq('availability', filters.availability);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        query = query.order('base_price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('base_price', { ascending: false });
        break;
      case 'name':
      default:
        query = query.order('name');
        break;
    }

    const { data, error } = await query;

    if (error) throw error;

    // Process the data to sort images and packages
    return (data || []).map(product => ({
      ...product,
      images: product.images?.sort((a, b) => a.sort_order - b.sort_order) || [],
      packages: product.packages?.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)) || []
    }));
  }

  // Get single product by ID or slug
  static async getProduct(identifier: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        packages:product_packages(*)
      `)
      .or(`id.eq.${identifier},slug.eq.${identifier}`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    if (!data) return null;

    // Sort images and packages
    return {
      ...data,
      images: data.images?.sort((a, b) => a.sort_order - b.sort_order) || [],
      packages: data.packages?.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0)) || []
    };
  }

  // Get related products (same category, excluding current product)
  static async getRelatedProducts(productId: string, categoryId?: string, limit = 4): Promise<Product[]> {
    // First try to get manually defined related products
    const { data: relatedData, error: relatedError } = await supabase
      .from('product_relations')
      .select(`
        related_product:products(
          *,
          category:categories(*),
          images:product_images(*)
        )
      `)
      .eq('product_id', productId)
      .limit(limit);

    if (!relatedError && relatedData && relatedData.length > 0) {
      return relatedData.map(item => ({
        ...item.related_product,
        images: item.related_product.images?.sort((a, b) => a.sort_order - b.sort_order) || []
      }));
    }

    // Fallback to category-based related products if no manual relations exist
    if (!categoryId) return [];

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*)
      `)
      .eq('category_id', categoryId)
      .neq('id', productId)
      .limit(limit);

    if (error) throw error;

    return (data || []).map(product => ({
      ...product,
      images: product.images?.sort((a, b) => a.sort_order - b.sort_order) || []
    }));
  }

  // Create a new product (admin only)
  static async createProduct(productData: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update a product (admin only)
  static async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a product (admin only)
  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Add product image
  static async addProductImage(productId: string, imageData: {
    image_url: string;
    alt_text?: string;
    sort_order?: number;
  }): Promise<void> {
    const { error } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        ...imageData
      });

    if (error) throw error;
  }

  // Add product package
  static async addProductPackage(productId: string, packageData: {
    weight: string;
    price: number;
    is_default?: boolean;
  }): Promise<void> {
    const { error } = await supabase
      .from('product_packages')
      .insert({
        product_id: productId,
        ...packageData
      });

    if (error) throw error;
  }
}