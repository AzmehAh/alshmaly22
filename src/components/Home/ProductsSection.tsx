import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomepageAPI } from '../../lib/api/homepage';
import { Loader2 } from 'lucide-react';

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchHomepageProducts = async () => {
      try {
        setLoading(true);
        const homepageProducts = await HomepageAPI.getHomepageProducts();
        setProducts(homepageProducts.map(hp => hp.product));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageProducts();
  }, []);


  return (
    <section id="products" className="py-20 bg-[#F7F7F7]  overflow-hidden w-full">
      <div className="container mx-auto px-4"> 
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#054239] mb-4">
            Our Products
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our premium selection of Syrian agricultural products, carefully selected and processed for quality
          </p>
        </div>

   
        
        {/* Products Grid */}
        <div className="w-full mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="animate-spin text-[#b9a779]" size={48} />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Error loading products: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
              <div key={product.id} className="bg-[#f7f7f7] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group w-full">
                <div className="relative overflow-hidden">
                  <img   
                    src={product.images?.[0]?.image_url || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#054239] mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <Link
                    to={`/product/${product.id}`}
                    className="w-full bg-[#b9a779] hover:bg-[#054239] text-white py-3 rounded-full font-medium transition-all duration-300 text-center block mt-auto"
                  >
                    View Details
                  </Link> 
                </div>
              </div>
            ))}
            </div>
          )}
        </div>

        {/* Explore All Products Button */}
        <div className="text-center">
          <Link 
            to="/products"
            className="bg-[#b9a779] hover:bg-[#054239] text-white px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-lg inline-block"
          >
            Explore All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;