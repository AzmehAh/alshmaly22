import React, { useState, useEffect } from 'react';
import { Search, Eye, Mail, Calendar, User, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ContactAPI } from '../../lib/api/contact';
import type { ContactMessage } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

const ContactsPage = () => {
   const { t, direction } = useLanguage()
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      if (!id) {
        alert('No message ID provided');
        return;
      }
      
      await ContactAPI.deleteContactMessage(id);
      await fetchContacts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting contact message:', error);
      alert('Error deleting contact message. Please try again.');
    }
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error; 
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchContacts();
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Error updating contact status. Please try again.');
    }
  };

  const filteredContacts = contacts.filter(contact => {
  const term = searchTerm.toLowerCase();

  const matchesSearch =
    (contact.name && contact.name.toLowerCase().includes(term)) ||
    (contact.name_ar && contact.name_ar.toLowerCase().includes(term)) ||
    (contact.email && contact.email.toLowerCase().includes(term)) ||
    (contact.subject && contact.subject.toLowerCase().includes(term)) ||
    (contact.subject_ar && contact.subject_ar.toLowerCase().includes(term));

  const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;

  return matchesSearch && matchesStatus;
});


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b9a779]"></div>
      </div>
    );
  }

   return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#054239]">{t('contacts.title')}</h1>
        <div className="flex items-center  gap-2 text-sm text-gray-500">
          <Mail size={16} />
          <span>{t('contacts.totalMessages', { count: contacts.length })}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('contacts.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
          >
            <option value="all">{t('contacts.filter.allStatus')}</option>
            <option value="unread">{t('contacts.filter.unread')}</option>
            <option value="read">{t('contacts.filter.read')}</option>
            <option value="responded">{t('contacts.filter.responded')}</option>
          </select>
        </div>
      </div>

      {/* Contacts Table */} 
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
  <tr>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('contacts.table.contact')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('contacts.table.subject')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('contacts.table.status')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('contacts.table.date')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('contacts.table.language')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('contacts.table.actions')}
    </th>
  </tr>
</thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#b9a779] rounded-full flex items-center justify-center mr-3">
                        <User size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#054239]">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                        {contact.phone && (
                          <div className="text-xs text-gray-400">{contact.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {contact.subject}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={contact.status}
                      onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(contact.status)}`}
                    >
                      <option value="unread">{t('contacts.status.unread')}</option>
                      <option value="read">{t('contacts.status.read')}</option>
                      <option value="responded">{t('contacts.status.responded')}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      contact.language === 'ar' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {contact.language === 'ar' ? t('contacts.language.ar') : t('contacts.language.en')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center  gap-2">
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          if (contact.status === 'unread') {
                            updateContactStatus(contact.id, 'read');
                          }
                        }}
                        className="text-[#b9a779] hover:text-[#054239] p-1 rounded"
                        title={t('contacts.action.viewDetails')}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(contact.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title={t('contacts.action.deleteMessage')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#054239]">{t('contacts.details.title')}</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('contacts.details.name')}</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('contacts.details.email')}</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.email}</p>
                  </div>
                </div>

                {selectedContact.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('contacts.details.phone')}</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedContact.phone}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('contacts.details.subject')}</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedContact.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('contacts.details.message')}</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('contacts.details.status')}</label>
                    <p className="mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContact.status)}`}>
                        {t(`contacts.status.${selectedContact.status}`)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('contacts.details.dateReceived')}</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedContact.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end  gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  {t('contacts.details.close')}
                </button>
                 <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="px-4 py-2 bg-[#b9a779] text-white rounded-lg hover:bg-[#054239] transition-colors duration-200"
                >
                  {t('contacts.details.reply')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">{t('contacts.delete.title')}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {t('contacts.delete.confirmation')}
                </p>
              </div>
              <div className="flex justify-center  gap-3 pt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  {t('contacts.delete.cancel')}
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={!deleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  {t('contacts.delete.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ContactsPage;