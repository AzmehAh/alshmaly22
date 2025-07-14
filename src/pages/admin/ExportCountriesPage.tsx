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
          <h1 className="text-3xl font-bold text-[#054239]">Export Countries</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Country
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search countries..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Exports
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Main Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCountries.map((country, index) => (
                <tr key={country.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#054239]">{country.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{country.annual_exports}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {country.main_products}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(country.id, country.is_active)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors duration-200 ${
                        country.is_active 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {country.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(country)}
                        className="text-[#b9a779] hover:text-[#054239] p-1 rounded"
                        title="Edit Country"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(country.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete Country"
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

      {/* Country Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-[#054239] mb-4">
                {editingCountry ? 'Edit Export Country' : 'Add New Export Country'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Country Name - Bilingual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country Name (EN)</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="Country name in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country Name (AR)</label>
                    <input
                      type="text"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="اسم الدولة بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Annual Exports - Bilingual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Exports (EN)</label>
                    <input
                      type="text"
                      required
                      value={formData.annual_exports}
                      onChange={(e) => setFormData({ ...formData, annual_exports: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="e.g., 2,000 tons/year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Exports (AR)</label>
                    <input
                      type="text"
                      value={formData.annual_exports_ar}
                      onChange={(e) => setFormData({ ...formData, annual_exports_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="مثال: 2000 طن/سنة"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Main Products - Bilingual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Products (EN)</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.main_products}
                      onChange={(e) => setFormData({ ...formData, main_products: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="e.g., Spices, Dried Herbs, Legumes"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Products (AR)</label>
                    <textarea
                      rows={3}
                      value={formData.main_products_ar}
                      onChange={(e) => setFormData({ ...formData, main_products_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="مثال: البهارات، الأعشاب المجففة، البقوليات"
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">
                    Display on website
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#b9a779] text-white rounded-lg hover:bg-[#054239] transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingCountry ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Delete Export Country</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this export country? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 pt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportCountriesPage;