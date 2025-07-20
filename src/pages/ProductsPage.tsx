import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';




const ProductsPage = () => {
  const { t, getLocalizedField, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const limit = 8; // تغيير إلى 8 منتجات لكل صفحة

  const { products, categories, loading, error, totalCount } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: searchTerm,
    page,
    limit,
  });

  const displayCategories = [
    { id: 'all', name: t('products.filt'), slug: 'all' },
    ...categories
  ];

  // حساب عدد الصفحات الإجمالي
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20 overflow-x-hidden w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#054239] mb-4">{t('products.title')}</h1>
          <p className="text-gray-600 text-lg">{t('products.discover')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className="lg:w-1/4 w-full">
            <div className="bg-[#f7f7f7] rounded-2xl p-6 shadow-lg sticky top-24 h-[calc(100vh-120px)] overflow-y-auto">
              <h3 className="text-xl font-semibold text-[#054239] mb-6 flex items-center">
                <Filter size={20} className="mr-2" />
                {t('products.filters.title')}
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('products.filters.search.label')}
                </label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1); // reset pagination
                    }}
                    placeholder={t('products.filters.search.placeholder')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('products.filters.categories.label')}
                </label>
                <div
                  className="space-y-2"
                  style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                >
                  {displayCategories.map((category) => (
                    <button
                      key={category.slug}
                      onClick={() => {
                        setSelectedCategory(category.slug);
                        setPage(1);
                      }}
                      className={`w-full text-start px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedCategory === category.slug
                          ? 'bg-[#b9a779] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getLocalizedField(category, 'name')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:w-3/4 w-full">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? t('common.loading') : `${t('products.show')} ${products.length} ${t('products.show2')}`}
              </p>
            </div>

            {loading && products.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-[#b9a779]" size={48} />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">Error loading products: {error}</p>
              </div>
            ) : (
              <>
                <div
                  className={`w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`}
                >
                  {products.map((product) => {
                    const defaultPackage = product.packages?.find(pkg => pkg.is_default) || product.packages?.[0];

                    return (
                      <div
                        key={product.id}
                        className="bg-[#f7f7f7] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                        style={{ minHeight: '420px' }}
                      >
                        <div className="relative overflow-hidden w-full h-48">
                          <img
                            src={product.images?.[0]?.image_url || 'https://via.placeholder.com/400x300'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.availability === 'out-of-stock' && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-semibold text-[#054239] mb-2">
                            {getLocalizedField(product, 'name')}
                          </h3>
                          <p className="text-gray-600 mb-2 flex-grow">
                            {(() => {
                              const description = getLocalizedField(product, 'description');
                              return description.length > 100 ? description.slice(0, 50) + "..." : description;
                            })()}
                          </p>
                          <div className="flex items-center justify-end mb-4">
                            <span className="text-sm text-gray-500">{defaultPackage?.weight || 'Various sizes'}</span>
                          </div>
                          <Link
                            to={`/product/${product.id}`}
                            className="mt-auto w-full bg-[#b9a779] hover:bg-[#054239] text-white py-3 px-4 rounded-full font-medium transition-all duration-300 text-center block"
                          >
                            {t('common.view_details')}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded-full disabled:opacity-50"
                      >
                        &lt;
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-full ${
                              page === pageNum 
                                ? 'bg-[#b9a779] text-white' 
                                : 'hover:bg-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && page < totalPages - 2 && (
                        <span className="px-2">...</span>
                      )}
                      
                      {totalPages > 5 && page < totalPages - 2 && (
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className={`w-10 h-10 rounded-full ${
                            page === totalPages 
                              ? 'bg-[#b9a779] text-white' 
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          {totalPages}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded-full disabled:opacity-50"
                      >
                        &gt;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}

            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t('common.product')}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;