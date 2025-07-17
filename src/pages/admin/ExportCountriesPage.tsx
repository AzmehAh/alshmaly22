import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Globe, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { ExportCountriesAPI } from '../../lib/api/export-countries';
import type { ExportCountry } from '../../lib/supabase';

const ExportCountriesPage = () => {
  const [countries, setCountries] = useState<ExportCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<ExportCountry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    annual_exports: '',
    annual_exports_ar: '',
    main_products: '',
    main_products_ar: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const data = await ExportCountriesAPI.getAllExportCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching export countries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCountry) {
        await ExportCountriesAPI.updateExportCountry(editingCountry.id, formData);
      } else {
        await ExportCountriesAPI.createExportCountry({
          ...formData,
          display_order: countries.length + 1
        });
      }

      await fetchCountries();
      resetForm();
    } catch (error) {
      console.error('Error saving export country:', error);
      alert('Error saving export country. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (country: ExportCountry) => {
    setEditingCountry(country);
    setFormData({
      name: country.name,
      name_ar: country.name_ar || '',
      annual_exports: country.annual_exports,
      annual_exports_ar: country.annual_exports_ar || '',
      main_products: country.main_products,
      main_products_ar: country.main_products_ar || '',
      display_order: country.display_order,
      is_active: country.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await ExportCountriesAPI.deleteExportCountry(id);
      await fetchCountries();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting export country:', error);
      alert('Error deleting export country. Please try again.');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await ExportCountriesAPI.toggleActiveStatus(id, !isActive);
      await fetchCountries();
    } catch (error) {
      console.error('Error updating country status:', error);
      alert('Error updating country status. Please try again.');
    }
  };

  const handleMoveCountry = async (id: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = countries.findIndex(country => country.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= countries.length) return;

      const currentCountry = countries[currentIndex];
      const swapCountry = countries[newIndex];

      await Promise.all([
        ExportCountriesAPI.updateDisplayOrder(currentCountry.id, swapCountry.display_order),
        ExportCountriesAPI.updateDisplayOrder(swapCountry.id, currentCountry.display_order)
      ]);

      await fetchCountries();
    } catch (error) {
      console.error('Error moving country:', error);
      alert('Error moving country. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      annual_exports: '',
      annual_exports_ar: '',
      main_products: '',
      main_products_ar: '',
      display_order: 0,
      is_active: true
    });
    setEditingCountry(null);
    setShowForm(false);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.main_products.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && countries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b9a779]"></div>
      </div>
    );
  }
return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe size={24} className="text-[#b9a779]" />
          <h1 className="text-3xl font-bold text-[#054239]">{t('export.title')}</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {t('export.add')}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('export.search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
          />
        </div>
      </div>

      {/* Countries Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th>{t('export.table.order')}</th>
                <th>{t('export.table.country')}</th>
                <th>{t('export.table.exports')}</th>
                <th>{t('export.table.products')}</th>
                <th>{t('export.table.status')}</th>
                <th>{t('export.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCountries.map((country, index) => (
                <tr key={country.id}>
                  <td>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">#{country.display_order}</span>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => handleMoveCountry(country.id, 'up')}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-[#b9a779] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveCountry(country.id, 'down')}
                          disabled={index === filteredCountries.length - 1}
                          className="text-gray-400 hover:text-[#b9a779] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>{country.name}</td>
                  <td>{country.annual_exports}</td>
                  <td>{country.main_products}</td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(country.id, country.is_active)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors duration-200 ${
                        country.is_active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {country.is_active ? t('export.status.active') : t('export.status.inactive')}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleEdit(country)} title={t('export.edit')}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => setDeleteConfirm(country.id)} title={t('export.delete')}>
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Country Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 bg-white rounded-md">
            <h3 className="text-lg font-medium text-[#054239] mb-4">
              {editingCountry ? t('export.edit') : t('export.add_new')}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>{t('export.name_en')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>{t('export.name_ar')}</label>
                  <input
                    type="text"
                    value={formData.name_ar}
                    dir="rtl"
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  />
                </div>
              </div>

              {/* Exports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>{t('export.exports_en')}</label>
                  <input
                    type="text"
                    value={formData.annual_exports}
                    onChange={(e) => setFormData({ ...formData, annual_exports: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>{t('export.exports_ar')}</label>
                  <input
                    type="text"
                    value={formData.annual_exports_ar}
                    dir="rtl"
                    onChange={(e) => setFormData({ ...formData, annual_exports_ar: e.target.value })}
                  />
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>{t('export.products_en')}</label>
                  <textarea
                    rows={3}
                    value={formData.main_products}
                    onChange={(e) => setFormData({ ...formData, main_products: e.target.value })}
                  />
                </div>
                <div>
                  <label>{t('export.products_ar')}</label>
                  <textarea
                    rows={3}
                    dir="rtl"
                    value={formData.main_products_ar}
                    onChange={(e) => setFormData({ ...formData, main_products_ar: e.target.value })}
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <label>{t('export.display_on_site')}</label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={resetForm}>
                  {t('export.cancel')}
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? t('export.saving') : editingCountry ? t('export.update') : t('export.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 bg-white rounded-md text-center">
            <h3 className="text-lg font-medium text-gray-900">{t('export.delete.title')}</h3>
            <p className="text-sm text-gray-500 mt-2">{t('export.delete.confirmation')}</p>
            <div className="flex justify-center space-x-3 pt-4">
              <button onClick={() => setDeleteConfirm(null)}>{t('export.cancel')}</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="bg-red-600 text-white rounded px-4 py-2">
                {t('export.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportCountriesPage;