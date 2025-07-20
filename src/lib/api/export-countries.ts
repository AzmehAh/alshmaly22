import { supabase } from '../supabase';
import type { ExportCountry } from '../supabase';

export interface ExportCountryData {
  name: string;
  name_ar?: string;
  annual_exports: string;
  annual_exports_ar?: string;
  main_products: string;
  main_products_ar?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface ExportCountryFilters {
  search?: string;
  language?: 'en' | 'ar';
}

export class ExportCountriesAPI {
  // Get all active export countries for public display
  static async getActiveExportCountries(filters: ExportCountryFilters = {}): Promise<ExportCountry[]> {
    let query = supabase
      .from('export_countries')
      .select('*')
      .eq('is_active', true);

    // Filter by language - only show countries with content in the selected language
    if (filters.language === 'ar') {
      query = query.not('name_ar', 'is', null);
    } else {
      query = query.not('name', 'is', null);
    }

    // Apply search filter
    if (filters.search) {
      // Search in both language fields regardless of input language
      query = query.or(`name.ilike.%${filters.search}%,name_ar.ilike.%${filters.search}%,main_products.ilike.%${filters.search}%,main_products_ar.ilike.%${filters.search}%`);
    }

    query = query.order('display_order');

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Get all export countries (admin only)
  static async getAllExportCountries(): Promise<ExportCountry[]> {
    const { data, error } = await supabase
      .from('export_countries')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return data || [];
  }

  // Get single export country by ID
  static async getExportCountry(id: string): Promise<ExportCountry | null> {
    const { data, error } = await supabase
      .from('export_countries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  // Create a new export country (admin only)
  static async createExportCountry(countryData: ExportCountryData): Promise<ExportCountry> {
    const { data, error } = await supabase
      .from('export_countries')
      .insert(countryData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update an export country (admin only)
  static async updateExportCountry(id: string, countryData: Partial<ExportCountryData>): Promise<ExportCountry> {
    const { data, error } = await supabase
      .from('export_countries')
      .update(countryData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete an export country (admin only)
  static async deleteExportCountry(id: string): Promise<void> {
    const { error } = await supabase
      .from('export_countries')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Update display order (admin only)
  static async updateDisplayOrder(id: string, displayOrder: number): Promise<ExportCountry> {
    const { data, error } = await supabase
      .from('export_countries')
      .update({ display_order: displayOrder })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Toggle active status (admin only)
  static async toggleActiveStatus(id: string, isActive: boolean): Promise<ExportCountry> {
    const { data, error } = await supabase
      .from('export_countries')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}