import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Package, Image as ImageIcon, X, Link as LinkIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { RelationsAPI } from '../../lib/api/relations';
import type { Product, Category } from '../../lib/supabase';
import type { ProductRelation } from '../../lib/api/relations';
import { useLanguage } from '../../contexts/LanguageContext';

const ProductsPage = () => {
  const { t, direction } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showRelationsModal, setShowRelationsModal] = useState<string | null>(null);
  const [relations, setRelations] = useState<ProductRelation[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    slug: '',
    description: '',
    description_ar: '',
    category_id: '',
   
   
    specifications_en: [] as string[],
    specifications_ar: [] as string[]
  });

  const [images, setImages] = useState<Array<{ image_url: string; alt_text: string; sort_order: number }>>([]);
  const [packages, setPackages] = useState<Array<{ weight: string; is_default: boolean }>>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newSpecificationEn, setNewSpecificationEn] = useState('');
  const [newSpecificationAr, setNewSpecificationAr] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(*),
          packages:product_packages(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let productId: string;

      if (editingProduct) {
        const { data, error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', editingProduct.id)
          .select()
          .single();

        if (error) throw error;
        productId = editingProduct.id;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(formData)
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      // Handle images
      if (editingProduct) {
        // Delete existing images
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId);
      }

      // Insert new images
      if (images.length > 0) {
        const imageData = images.map(img => ({
          product_id: productId,
          ...img
        }));
        
        await supabase
          .from('product_images')
          .insert(imageData);
      }

      // Handle packages
      if (editingProduct) {
        // Delete existing packages
        await supabase
          .from('product_packages')
          .delete()
          .eq('product_id', productId);
      }

      // Insert new packages
      if (packages.length > 0) {
        const packageData = packages.map(pkg => ({
          product_id: productId,
          ...pkg
        }));
        
        await supabase
          .from('product_packages')
          .insert(packageData);
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      name_ar: product.name_ar || '',
      slug: product.slug,
      description: product.description,
      description_ar: product.description_ar || '',
      category_id: product.category_id || '',
     
      availability: product.availability,
     
      specifications_en: product.specifications_en || [],
      specifications_ar: product.specifications_ar || []
    });
    
    setImages(product.images?.map(img => ({
      image_url: img.image_url,
      alt_text: img.alt_text || '',
      sort_order: img.sort_order
    })) || []);
    
    setPackages(product.packages?.map(pkg => ({
      weight: pkg.weight,
    
      is_default: pkg.is_default
    })) || []);
    
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchProducts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  const fetchRelations = async (productId: string) => {
    try {
      const [relationsData, allProducts] = await Promise.all([
        RelationsAPI.getProductRelations(productId),
        supabase.from('products').select('*').neq('id', productId)
      ]);
      
      setRelations(relationsData);
      setAvailableProducts(allProducts.data || []);
    } catch (error) {
      console.error('Error fetching relations:', error);
    }
  };

  const handleAddRelation = async (productId: string, relatedProductId: string, relationType: string) => {
    try {
      await RelationsAPI.addProductRelation(productId, relatedProductId, relationType as any);
      await fetchRelations(productId);
    } catch (error) {
      console.error('Error adding relation:', error);
      alert('Error adding relation. Please try again.');
    }
  };

  const handleRemoveRelation = async (relationId: string, productId: string) => {
    try {
      await RelationsAPI.removeProductRelation(relationId);
      await fetchRelations(productId);
    } catch (error) {
      console.error('Error removing relation:', error);
      alert('Error removing relation. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      name_ar: '',
      slug: '',
      description: '',
      description_ar: '',
      category_id: '',
    
     
     
      specifications_en: [],
      specifications_ar: []
    });
    setImages([]);
    setPackages([]);
    setNewFeature('');
    setNewSpecificationEn('');
    setNewSpecificationAr('');
    setEditingProduct(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

 

  const addSpecificationEn = () => {
    if (newSpecificationEn.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications_en: [...prev.specifications_en, newSpecificationEn.trim()]
      }));
      setNewSpecificationEn('');
    }
  };

  const addSpecificationAr = () => {
    if (newSpecificationAr.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications_ar: [...prev.specifications_ar, newSpecificationAr.trim()]
      }));
      setNewSpecificationAr('');
    }
  };
 

  const removeSpecificationEn = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications_en: prev.specifications_en.filter((_, i) => i !== index)
    }));
  };

  const removeSpecificationAr = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications_ar: prev.specifications_ar.filter((_, i) => i !== index)
    }));
  };
  const addImage = () => {
    setImages(prev => [...prev, { image_url: '', alt_text: '', sort_order: prev.length }]);
  };

  const updateImage = (index: number, field: string, value: string | number) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    ));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  

  const updatePackage = (index: number, field: string, value: string | number | boolean) => {
    setPackages(prev => prev.map((pkg, i) => 
      i === index ? { ...pkg, [field]: value } : pkg
    ));
  };

  const removePackage = (index: number) => {
    setPackages(prev => prev.filter((_, i) => i !== index));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b9a779]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#054239]">{t('admin.products.management')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {t('admin.add')} {t('admin.products.management')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('admin.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
          >
            <option value="all">{t('admin.all')} {t('admin.category')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}{category.name_ar ? ` / ${category.name_ar}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
  <tr>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('admin.products.management')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('admin.category')}
    </th>
    
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('admin.availability')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('admin.actions')}
    </th>
  </tr>
</thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'}
                        alt={product.name}
                        className="h-12 w-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-[#054239]">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category?.name || t('admin.uncategorized')}
                      {product.category?.name_ar && (
                        <div className="text-xs text-gray-500 mt-1">{product.category.name_ar}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                   
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center  gap-2">
                      <button
                        onClick={() => window.open(`/product/${product.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title={t('admin.view')}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-[#b9a779] hover:text-[#054239] p-1 rounded"
                        title={t('admin.edit')}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setShowRelationsModal(product.id);
                          fetchRelations(product.id);
                        }}
                        className="text-[#b9a779] hover:text-[#054239] p-1 rounded"
                        title={t('admin.manage')}
                      >
                        <LinkIcon size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title={t('admin.delete')}
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

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white mb-4">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#054239]">
                  {editingProduct ? t('admin.edit') : t('admin.add')} {t('admin.products.management')}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-[#054239] mb-4">{t('admin.basic_info')}</h4>
                  
                  {/* Product Name - Bilingual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.name')} ({t('admin.english')}) *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (!editingProduct) {
                            setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                        placeholder={t('admin.name')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.name')} ({t('admin.arabic')})</label>
                      <input
                        type="text"
                        value={formData.name_ar}
                        onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                        placeholder={t('admin.name')}
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Slug Field */}
                  <div className="mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                        placeholder="product-slug"
                      />
                    </div>
                  </div>

                  {/* Description - Bilingual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.description')} ({t('admin.english')}) *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                        placeholder={t('admin.description')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.description')} ({t('admin.arabic')})</label>
                      <textarea
                        rows={4}
                        value={formData.description_ar}
                        onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                        placeholder={t('admin.description')}
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.category')}</label>
                      <select
                        value={formData.category_id}
                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      >
                        <option value="">{t('admin.select')} {t('admin.category')}</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}{category.name_ar ? ` / ${category.name_ar}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                   
                    
                  </div>
                </div>

               
                {/* Specifications - Bilingual */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-[#054239] mb-4">{t('admin.specifications')}</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* English Specifications */}
                    <div>
                      <h5 className="text-md font-medium text-[#054239] mb-3">{t('admin.specifications')} ({t('admin.english')})</h5>
                      <div className="space-y-3">
                        {formData.specifications_en.map((spec, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={spec}
                              onChange={(e) => {
                                const newSpecs = [...formData.specifications_en];
                                newSpecs[index] = e.target.value;
                                setFormData({ ...formData, specifications_en: newSpecs });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => removeSpecificationEn(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center  gap-2">
                          <input
                            type="text"
                            value={newSpecificationEn}
                            onChange={(e) => setNewSpecificationEn(e.target.value)}
                            placeholder={`${t('admin.add')} ${t('admin.specifications')}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecificationEn())}
                          />
                          <button
                            type="button"
                            onClick={addSpecificationEn}
                            className="bg-[#b9a779] text-white px-4 py-2 rounded-lg hover:bg-[#054239] transition-colors"
                          >
                            {t('admin.add')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Arabic Specifications */}
                    <div>
                      <h5 className="text-md font-medium text-[#054239] mb-3">{t('admin.specifications')} ({t('admin.arabic')})</h5>
                      <div className="space-y-3">
                        {formData.specifications_ar.map((spec, index) => (
                          <div key={index} className="flex items-center  gap-2">
                            <input
                              type="text"
                              value={spec}
                              onChange={(e) => {
                                const newSpecs = [...formData.specifications_ar];
                                newSpecs[index] = e.target.value;
                                setFormData({ ...formData, specifications_ar: newSpecs });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                              dir="rtl"
                            placeholder={`${t('admin.add')} ${t('admin.specifications')}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeSpecificationAr(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center  gap-2">
                          <input
                            type="text"
                            value={newSpecificationAr}
                            onChange={(e) => setNewSpecificationAr(e.target.value)}
                            placeholder={`${t('admin.add')} ${t('admin.specifications')}`}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                            dir="rtl"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecificationAr())}
                          />
                          <button
                            type="button"
                            onClick={addSpecificationAr}
                            className="bg-[#b9a779] text-white px-4 py-2 rounded-lg hover:bg-[#054239] transition-colors"
                          >
                            {t('admin.add')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Images */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-[#054239]">{t('admin.image')}</h4>
                    <button
                      type="button"
                      onClick={addImage}
                      className="bg-[#b9a779] text-white px-4 py-2 rounded-lg hover:bg-[#054239] transition-colors flex items-center"
                    >
                      <ImageIcon size={16} className="mr-2" />
                      {t('admin.add')} {t('admin.image')}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {images.map((image, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.image')} URL</label>
                          <input
                            type="url"
                            value={image.image_url}
                            onChange={(e) => updateImage(index, 'image_url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.alt_text')}</label>
                          <input
                            type="text"
                            value={image.alt_text}
                            onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                            placeholder={t('admin.description')}
                          />
                        </div>
                        <div className="flex items-end  gap-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.order')}</label>
                            <input
                              type="number"
                              value={image.sort_order}
                              onChange={(e) => updateImage(index, 'sort_order', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Packages */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-[#054239]">{t('admin.packages')}</h4>
                    <button
                      type="button"
                      onClick={addPackage}
                      className="bg-[#b9a779] text-white px-4 py-2 rounded-lg hover:bg-[#054239] transition-colors flex items-center"
                    >
                      <Package size={16} className="mr-2" />
                      {t('admin.add')} {t('admin.packages')}
                    </button>
                  </div>
                  <div className="space-y-4">
                    {packages.map((pkg, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.weight')}</label>
                          <input
                            type="text"
                            value={pkg.weight}
                            onChange={(e) => updatePackage(index, 'weight', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                            placeholder="1kg, 5kg, etc."
                          />
                        </div>
                       
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={pkg.is_default}
                              onChange={(e) => updatePackage(index, 'is_default', e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700">{t('admin.default')}</span>
                          </label>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removePackage(index)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end  gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {t('admin.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#b9a779] text-white rounded-lg hover:bg-[#054239] transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? t('admin.saving') : editingProduct ? t('admin.update') : t('admin.create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Related Products Modal */}
      {showRelationsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#054239]">{t('admin.manage')} {t('admin.related')}</h3>
                <button
                  onClick={() => setShowRelationsModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Current Relations */}
                <div>
                  <h4 className="text-lg font-semibold text-[#054239] mb-4">{t('admin.current')} {t('admin.related')}</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {relations.map((relation) => (
                      <div key={relation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <img
                            src={relation.related_product?.images?.[0]?.image_url || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'}
                            alt={relation.related_product?.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <div className="font-medium text-[#054239]">{relation.related_product?.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{relation.relation_type}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveRelation(relation.id, showRelationsModal!)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {relations.length === 0 && (
                      <p className="text-gray-500 text-center py-4">{t('admin.no_data')}</p>
                    )}
                  </div>
                </div>

                {/* Add Relations */}
                <div>
                  <h4 className="text-lg font-semibold text-[#054239] mb-4">{t('admin.add')} {t('admin.related')}</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {availableProducts
                      .filter(product => !relations.some(rel => rel.related_product_id === product.id))
                      .map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <img
                              src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <div className="font-medium text-[#054239]">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.category?.name}</div>
                            </div>
                          </div>
                          <div className="flex  gap-2">
                            <button
                              onClick={() => handleAddRelation(showRelationsModal!, product.id, 'related')}
                              className="bg-[#b9a779] hover:bg-[#054239] text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                            >
                            </button>
                      ))}
                    {availableProducts
                      .filter(product => !relations.some(rel => rel.related_product_id === product.id))
                      .length === 0 && (
                      <p className="text-gray-500 text-center py-4">{t('admin.no_data')}</p>
                    )}
                  </div>
                            
                </div>
          
        
        
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">{t('admin.delete')} {t('admin.product')}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {t('admin.confirm_delete')} {t('admin.delete_warning')}
                </p>
              </div>
              <div className="flex justify-center  gap-3 pt-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;