import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedWeight, setSelectedWeight] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Fetch products with current filters
  const { products, categories, loading, error } = useProducts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    availability: selectedAvailability,
    search: searchTerm,
    sortBy: sortBy
  });

  const weights = ['1 kg', '5 kg', '10 kg', '25 kg', '50 kg'];

  // Prepare categories for display
  const displayCategories = [
    { id: 'all', name: 'All Products', slug: 'all' },
    ...categories
  ];

  // Filter products by weight (client-side since it's a package property)
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by weight if selected
    if (selectedWeight !== 'all') {
      filtered = filtered.filter(product => 
        product.packages?.some(pkg => pkg.weight === selectedWeight)
      );
    }
    
    return filtered;
  }, [products, selectedWeight]);

  return (
    <div className="min-h-screen bg-[#F7F7F7]  pt-20 overflow-x-hidden w-full">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#054239] mb-4">Our Products</h1>
          <p className="text-gray-600 text-lg">Discover our premium selection of Syrian agricultural products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4 w-full">
            <div className="bg-[#f7f7f7] rounded-2xl p-6 shadow-lg sticky top-24">
              <h3 className="text-xl font-semibold text-[#054239] mb-6 flex items-center">
                <Filter size={20} className="mr-2" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
                <div className="space-y-2">
                  {displayCategories.map(category => (
                    <button
                      key={category.slug}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedCategory === category.slug
                          ? 'bg-[#b9a779] text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div> 
              </div>

              {/* Weight Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Weight</label>
                <select
                  value={selectedWeight}
                  onChange={(e) => setSelectedWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                >
                  <option value="all">All Weights</option>
                  {weights.map(weight => (
                    <option key={weight} value={weight}>{weight}</option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Availability</label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                >
                  <option value="all">All Products</option>
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4 w-full">
            {/* View Toggle and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#b9a779] text-white' : 'bg-[#f7f7f7]  text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#b9a779] text-white' : 'bg-[#f7f7f7] text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {/* Products Display */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-[#b9a779]" size={48} />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 text-lg">Error loading products: {error}</p>
              </div>
            ) : (
              <div className={`w-full ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }`}>
                {filteredProducts.map(product => {
                  const defaultPackage = product.packages?.find(pkg => pkg.is_default) || product.packages?.[0];
                  return (
                <div key={product.id} className={`bg-[#f7f7f7] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group w-full ${
                  viewMode === 'list' ? 'flex items-center p-4' : ''
                }`}>
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-24 h-24 rounded-lg flex-shrink-0' : 'w-full h-48'}`}>
                    <img 
                      src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.availability === 'out-of-stock' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  <div className={`${viewMode === 'list' ? 'ml-4 flex-1' : 'p-6'}`}>
                    <h3 className="text-xl font-semibold text-[#054239] mb-2">{product.name}</h3>
                   <p className="text-gray-600 mb-2">
  {product.description.length > 100
    ? product.description.slice(0, 50) + "..."
    : product.description
  }
</p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-[#b9a779]">
                        ${defaultPackage?.price || product.base_price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {defaultPackage?.weight || 'Various sizes'}
                      </span>
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="w-full bg-[#b9a779] hover:bg-[#054239] text-white py-3 px-4 rounded-full font-medium transition-all duration-300 text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                  );
                })}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;