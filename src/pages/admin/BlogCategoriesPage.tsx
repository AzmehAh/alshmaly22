import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { BlogCategory } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

const BlogCategoriesPage = () => {
     const { t, direction } = useLanguage()
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    slug: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching blog categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('blog_categories')
          .update(formData)
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_categories')
          .insert(formData);

        if (error) throw error;
      }

      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving blog category:', error);
      alert('Error saving blog category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      name_ar: category.name_ar || '',
      slug: category.slug
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCategories();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting blog category:', error);
      alert('Error deleting blog category. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      slug: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

const filteredCategories = categories.filter((category) => {
  const search = searchTerm.toLowerCase();

  const nameMatches =
    (category.name && category.name.toLowerCase().includes(search)) ||
    (category.name_ar && category.name_ar.toLowerCase().includes(search));

  return nameMatches;
});


  if (loading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b9a779]"></div>
      </div>
    );
  }

  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#054239]">{t('blogCategories.title')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {t('blogCategories.add')}
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('blogCategories.search.placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className= "min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
  <tr>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blogCategories.table.name')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blogCategories.table.slug')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blogCategories.table.created')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blogCategories.table.actions')}
    </th>
  </tr>
</thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-[#054239]">{category.name}</div>
                      {category.name_ar && (
                        <div className="text-xs text-gray-500 mt-1">{category.name_ar}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{category.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(category.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-[#b9a779] hover:text-[#054239] p-1 rounded"
                        title={t('blogCategories.edit.title')}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(category.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title={t('blogCategories.delete.title')}
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

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-[#054239] mb-4">
                {editingCategory ? t('blogCategories.edit.title') : t('blogCategories.addNew.title')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Name - Bilingual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blogCategories.form.name_en')}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (!editingCategory) {
                          setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder={t('blogCategories.form.name_en.placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blogCategories.form.name_ar')}</label>
                    <input
                      type="text"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder={t('blogCategories.form.name_ar.placeholder')}
                      dir="rtl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('blogCategories.form.slug')}</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                    placeholder={t('blogCategories.form.slug.placeholder')}
                  />
                </div>

                <div className="flex justify-end  gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {t('blogCategories.form.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#b9a779] text-white rounded-lg hover:bg-[#054239] transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading
                      ? t('blogCategories.form.saving')
                      : editingCategory
                      ? t('blogCategories.form.update')
                      : t('blogCategories.form.create')}
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
              <h3 className="text-lg font-medium text-gray-900">{t('blogCategories.delete.title')}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">{t('blogCategories.delete.confirmation')}</p>
              </div>
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  {t('blogCategories.delete.cancel')}
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  {t('blogCategories.delete.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogCategoriesPage;
