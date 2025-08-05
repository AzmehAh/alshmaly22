import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useLanguage } from '../contexts/LanguageContext';

 

const ProductsPage = () => {
  const { t, getLocalizedField, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 9;

  const { products, categories, loading, error, total, totalPages } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    search: searchTerm,
    page: currentPage,
    limit,
  });

  const displayCategories = [
    { id: 'all', name: t('products.filt'), slug: 'all' },
    ...categories
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }
    
    return buttons;
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
          <div className="lg:w-1/4 w-full ">
            <div className="bg-[#f7f7f7] rounded-2xl p-6 shadow-lg sticky top-24 z-10">
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
                    onChange={(e) => handleSearchChange(e.target.value)}
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
                      onClick={() => handleCategoryChange(category.slug)}
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
                {loading ? t('common.loading') : `${t('products.show')} ${products.length} ${t('products.show2')} (${total} )`}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-[#b9a779]" size={48} />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">{t('erorr')} {error}</p>
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
  className="bg-[#f7f7f7] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
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
    <p className="text-gray-600 mb-2">
      {(() => {
        const description = getLocalizedField(product, 'description');
        return description.length > 100 ? description.slice(0, 50) + "..." : description;
      })()}
    </p>
    <div className="flex items-center justify-end mb-4">
      <span className="text-sm text-gray-500">{defaultPackage?.weight || 'Various sizes'}</span>
    </div>
    <Link
      to={`/product/${product.slug}`}
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
                  <div className="flex justify-center items-center mt-12 gap-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                       disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {t('pagination.previous')}
                    </button>

                    {/* First page */}
                    {getPaginationButtons()[0] > 1 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          1
                        </button>
                        {getPaginationButtons()[0] > 2 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                      </>
                    )}

                    {/* Page buttons */}
                    {getPaginationButtons().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === pageNum
                            ? 'bg-[#b9a779] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {/* Last page */}
                    {getPaginationButtons()[getPaginationButtons().length - 1] < totalPages && (
                      <>
                        {getPaginationButtons()[getPaginationButtons().length - 1] < totalPages - 1 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {t('pagination.next')}
                    </button>
                  </div>
                )}
              </> 
            )}

            {products.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t('products.no_products')}</p>
              </div>
            )} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;