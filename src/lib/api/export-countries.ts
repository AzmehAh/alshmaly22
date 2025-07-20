import { supabase } from '../supabase';
import type { ExportCountry } from '../supabase';

export interface ExportCountryData {
  name: string;
  annual_exports: string;
  main_products: string;
  display_order?: number;
  is_active?: boolean;
}

export class ExportCountriesAPI {
  // Get all active export countries for public display
  static async getActiveExportCountries(): Promise<ExportCountry[]> {
    const { data, error } = await supabase
      .from('export_countries')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

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