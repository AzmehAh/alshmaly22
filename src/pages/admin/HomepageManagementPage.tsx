import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Trash2, ArrowUp, ArrowDown, Home } from 'lucide-react';
import { HomepageAPI } from '../../lib/api/homepage';
import { ProductsAPI } from '../../lib/api/products';
import { BlogAPI } from '../../lib/api/blog';
import type { HomepageProduct, HomepageBlogPost } from '../../lib/api/homepage';
import type { Product, BlogPost } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';
 


const HomepageManagementPage = () => {
  const { t, direction } = useLanguage();
  const [activeTab, setActiveTab] = useState<'products' | 'blog'>('products');
  const [homepageProducts, setHomepageProducts] = useState<HomepageProduct[]>([]);
  const [homepageBlogPosts, setHomepageBlogPosts] = useState<HomepageBlogPost[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
 
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [homepageProds, homepagePosts, products, blogPosts] = await Promise.all([
        HomepageAPI.getAllHomepageProducts(),
        HomepageAPI.getAllHomepageBlogPosts(),
        ProductsAPI.getProducts(),
        BlogAPI.getPosts({ published: undefined }) // Get all blog posts (published and draft)
      ]);

      setHomepageProducts(homepageProds);
      setHomepageBlogPosts(homepagePosts);
      setAllProducts(products.products || []);
      setAllBlogPosts(blogPosts || []);
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToHomepage = async (itemId: string) => {
    try {
      if (activeTab === 'products') {
        await HomepageAPI.addProductToHomepage(itemId, homepageProducts.length);
      } else {
        await HomepageAPI.addBlogPostToHomepage(itemId, homepageBlogPosts.length);
      }
      await fetchData();
      setShowAddModal(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error adding to homepage:', error);
      alert('Error adding item to homepage. Please try again.');
    }
  };

  const handleRemoveFromHomepage = async (itemId: string) => {
    try {
      if (activeTab === 'products') {
        await HomepageAPI.removeProductFromHomepage(itemId);
      } else {
        await HomepageAPI.removeBlogPostFromHomepage(itemId);
      }
      await fetchData();
    } catch (error) {
      console.error('Error removing from homepage:', error);
      alert('Error removing item from homepage. Please try again.');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      if (activeTab === 'products') {
        await HomepageAPI.updateHomepageProduct(id, { is_active: !isActive });
      } else {
        await HomepageAPI.updateHomepageBlogPost(id, { is_active: !isActive });
      }
      await fetchData();
    } catch (error) {
      console.error('Error updating item status:', error);
      alert('Error updating item status. Please try again.');
    }
  };

  const handleMoveItem = async (id: string, direction: 'up' | 'down') => {
    try {
      const items = activeTab === 'products' ? homepageProducts : homepageBlogPosts;
      const currentIndex = items.findIndex(item => item.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= items.length) return;

      const currentItem = items[currentIndex];
      const swapItem = items[newIndex];

      if (activeTab === 'products') {
        await Promise.all([
          HomepageAPI.updateHomepageProduct(currentItem.id, { display_order: swapItem.display_order }),
          HomepageAPI.updateHomepageProduct(swapItem.id, { display_order: currentItem.display_order })
        ]);
      } else {
        await Promise.all([
          HomepageAPI.updateHomepageBlogPost(currentItem.id, { display_order: swapItem.display_order }),
          HomepageAPI.updateHomepageBlogPost(swapItem.id, { display_order: currentItem.display_order })
        ]);
      }

      await fetchData();
    } catch (error) {
      console.error('Error moving item:', error);
      alert('Error moving item. Please try again.');
    }
  };


  const getLocalizedText = (item: any, field: string) => {
    if (direction === 'rtl') {
      return item[`${field}_ar`] || item[field] || '';
    }
    return item[field] || '';
  };

 
  const getAvailableItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'products') {
      const homepageProductIds = homepageProducts.map(hp => hp.product_id);
      return allProducts.filter(product =>
        !homepageProductIds.includes(product.id) &&
        (
          (product.name && product.name.toLowerCase().includes(term)) ||
          (product.name_ar && product.name_ar.toLowerCase().includes(term))
        )
      );
    } else {
      const homepageBlogPostIds = homepageBlogPosts.map(hb => hb.blog_post_id);
      return allBlogPosts.filter(post =>
        !homepageBlogPostIds.includes(post.id) &&
        (
          (post.title && post.title.toLowerCase().includes(term)) ||
          (post.title_ar && post.title_ar.toLowerCase().includes(term))
        )
      );
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
        <div className="flex items-center gap-3">
          <Home size={24} className="text-[#b9a779]" />
          <h1 className="text-3xl font-bold text-[#054239]">{t('admin.homepage.management')}</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {t('add.to.homepage')}
        </button>
      </div>


      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => { setActiveTab('products'); setSearchTerm(''); }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'products' ? 'bg-[#b9a779] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('homepage.products')} ({homepageProducts.length})
          </button>
          <button
            onClick={() => { setActiveTab('blog'); setSearchTerm(''); }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'blog' ? 'bg-[#b9a779] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('homepage.blog.posts')} ({homepageBlogPosts.length})
          </button>
        </div>

    
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('order')}
                </th>
                <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {activeTab === 'products' ? t('product') : t('blog.post')}
                </th>
                <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('status')}
                </th>
                <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  {t('actions')}
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === 'products' ? homepageProducts : homepageBlogPosts).map((item, index) => {
                const content = activeTab === 'products' ? (item as HomepageProduct).product : (item as HomepageBlogPost).blog_post;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handleMoveItem(item.id, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-[#b9a779] disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveItem(item.id, 'down')}
                            disabled={index === ((activeTab === 'products' ? homepageProducts.length : homepageBlogPosts.length) - 1)}
                            className="text-gray-400 hover:text-[#b9a779] disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        
                        <div>
                          <div className="text-sm font-medium text-[#054239]">
                            {getLocalizedText(content, activeTab === 'products' ? 'name' : 'title')}
                          </div>
                         
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(item.id, item.is_active)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors duration-200 ${
                          item.is_active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {item.is_active ? t('active') : t('inactive')}
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              activeTab === 'products'
                                ? `/product/${(item as HomepageProduct).product_id}`
                                : `/blog/${(item as HomepageBlogPost).blog_post_id}`,
                              '_blank'
                            )
                          }
                          onClick={() =>
                            window.open(
                              activeTab === 'products'
                                ? `/product/${(item as HomepageProduct).product?.slug}`
                                : `/blog/${(item as HomepageBlogPost).blog_post_slug }`,
                              '_blank'
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title={t('view.item')}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveFromHomepage(
                              activeTab === 'products'
                                ? (item as HomepageProduct).product_id
                                : (item as HomepageBlogPost).blog_post_id
                            )
                          }
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title={t('remove.from.homepage')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-[#054239]">
                  {t('add.item.to.homepage', { type: t(activeTab === 'products' ? 'product' : 'blog.post') })}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>

             
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder={t(activeTab === 'products' ? 'search.products' : 'search.blog')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                  />
                </div>
              </div>

   
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {getAvailableItems().map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        {activeTab === 'products' && (
                          <img
                            src={item.images?.[0]?.image_url || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'}
                            alt={getLocalizedText(item, activeTab === 'products' ? 'name' : 'title')}
                            className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-10 w-10 rounded-lg object-cover`}
                          />
                        )}
                        <div>
                          <div className="font-medium text-[#054239]">
                            {getLocalizedText(item, activeTab === 'products' ? 'name' : 'title')}
                          </div>
                          {activeTab === 'products' && (
                            <div className="text-sm text-gray-500">
                              {direction === 'rtl'
                                ? item.category?.name_ar || item.category?.name || t('uncategorized')
                                : item.category?.name || t('uncategorized')}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToHomepage(item.id)}
                        className="bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        {t('add')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {getAvailableItems().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {t(activeTab === 'products' ? 'no.available.products' : 'no.available.blog.posts')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageManagementPage;