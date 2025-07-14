import { supabase } from '../supabase';
import type { QuoteRequest } from '../supabase';

export interface QuoteRequestData {
  product_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  company_name?: string;
  quantity: number;
  package_size: string;
  message?: string;
}

export class QuotesAPI {
  // Submit a quote request
  static async submitQuoteRequest(quoteData: QuoteRequestData): Promise<QuoteRequest> {
    const { data, error } = await supabase
      .from('quote_requests')
      .insert(quoteData)
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Get all quote requests (admin only)
  static async getQuoteRequests(status?: string): Promise<QuoteRequest[]> {
    let query = supabase
      .from('quote_requests')
      .select(`
        *,
        product:products(*)
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Get single quote request (admin only)
  static async getQuoteRequest(id: string): Promise<QuoteRequest | null> {
    const { data, error } = await supabase
      .from('quote_requests')
      .select(`
        *,
        product:products(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  // Update quote request status (admin only)
  static async updateQuoteStatus(id: string, status: string): Promise<QuoteRequest> {
    const { data, error } = await supabase
      .from('quote_requests')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  // Delete quote request (admin only)
  static async deleteQuoteRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('quote_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Get quote statistics (admin only)
  static async getQuoteStatistics(): Promise<{
    total: number;
    pending: number;
    reviewed: number;
    responded: number;
    closed: number;
  }> {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      pending: 0,
      reviewed: 0,
      responded: 0,
      closed: 0
    };

    data?.forEach(quote => {
      stats[quote.status as keyof typeof stats]++;
    });

    return stats;
  }
}