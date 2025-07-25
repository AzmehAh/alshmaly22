import { supabase } from '../supabase';
import type { ContactMessage } from '../supabase';

export interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  language?: 'en' | 'ar';
}

export class ContactAPI {
  // Submit a contact message
  static async submitContactMessage(messageData: ContactMessageData): Promise<ContactMessage> {
    // Default to English if language not specified
    const dataWithLanguage = {
      ...messageData,
      language: messageData.language || 'en'
    };
    
    const { error } = await supabase
      .from('contact_messages')
      .insert(dataWithLanguage);

    if (error) throw error;
    
    // Return a minimal object since we don't need the full data
    return {
      id: 'submitted',
      ...dataWithLanguage,
      status: 'unread',
      created_at: new Date().toISOString()
    } as ContactMessage;
  }

  // Get all contact messages (admin only)
  static async getContactMessages(status?: string): Promise<ContactMessage[]> {
    let query = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  // Get single contact message (admin only)
  static async getContactMessage(id: string): Promise<ContactMessage | null> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data;
  }

  // Update contact message status (admin only)
  static async updateMessageStatus(id: string, status: string): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete contact message (admin only)
  static async deleteContactMessage(id: string): Promise<void> {
    if (!id) {
      throw new Error('Contact message ID is required');
    }
    
    console.log('Attempting to delete contact message with ID:', id);
    
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact message:', error);
      throw new Error(`Failed to delete contact message: ${error.message}`);
    }
    
    console.log('Successfully deleted contact message');
  }

  // Get contact statistics (admin only)
  static async getContactStatistics(): Promise<{
    total: number;
    unread: number;
    read: number;
    responded: number;
  }> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      unread: 0,
      read: 0,
      responded: 0
    };

    data?.forEach(message => {
      stats[message.status as keyof typeof stats]++;
    });

    return stats;
  }
}