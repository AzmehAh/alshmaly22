import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ProductsAPI } from '../lib/api/products';

interface Product {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
  description: string;
  description_ar: string;
  base_price: number;
  availability: 'in-stock' | 'limited';
  category: {
    id: string;
    name: string;
    name_ar: string;
  } | null;
  images: Array<{
    image_url: string;
    alt_text: string;
    alt_text_ar: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
  slug: string;
}

const ProductsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ProductsAPI.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await ProductsAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = !selectedCategory || product.category?.id === selectedCategory;
    const availabilityMatch = !selectedAvailability || product.availability === selectedAvailability;
    return categoryMatch && availabilityMatch;
  });

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return language === 'ar' ? 'متوفر' : 'In Stock';
      case 'limited':
        return language === 'ar' ? 'محدود' : 'Limited';
      default:
        return availability;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'المنتجات' : 'Products'}
        </h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الفئة' : 'Category'}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">
                {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
              </option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {language === 'ar' ? category.name_ar || category.name : category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'التوفر' : 'Availability'}
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">
                {language === 'ar' ? 'جميع المنتجات' : 'All Products'}
              </option>
              <option value="in-stock">
                {language === 'ar' ? 'متوفر / In Stock' : 'In Stock / متوفر'}
              </option>
              <option value="limited">
                {language === 'ar' ? 'محدود / Limited' : 'Limited / محدود'}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0].image_url}
                alt={language === 'ar' ? product.images[0].alt_text_ar || product.images[0].alt_text : product.images[0].alt_text}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {language === 'ar' ? product.name_ar || product.name : product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {language === 'ar' ? product.description_ar || product.description : product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-green-600">
                  ${product.base_price}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  product.availability === 'in-stock' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {getAvailabilityText(product.availability)}
                </span>
              </div>
              {product.category && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    {language === 'ar' ? product.category.name_ar || product.category.name : product.category.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {language === 'ar' ? 'لا توجد منتجات متاحة' : 'No products available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;