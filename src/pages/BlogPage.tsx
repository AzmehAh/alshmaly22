import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock, Loader2,ArrowLeft } from 'lucide-react';
import { useBlogPosts } from '../hooks/useBlog';
import { useLanguage } from '../contexts/LanguageContext';

const BlogPage = () => {
  const { t, getLocalizedField, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const { posts: blogPosts, categories, loading, error } = useBlogPosts({
    category: selectedCategory === 'All' ? undefined : selectedCategory
  });

  // Prepare categories for display
  const displayCategories = [
    { name: 'All', name_ar: 'الكل' },
    ...categories
  ];

return (
  <div className="min-h-screen bg-[#F7F7F7] pt-20">
    {/* Hero Section */}
    <section className="py-20 bg-[#054239] text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">{t('blog.title')}</h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </div>
      </div> 
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {displayCategories.map(category => (
            <button
              key={category.name || category}
              onClick={() => setSelectedCategory(typeof category === 'string' ? category : category.name)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === (typeof category === 'string' ? category : category.name)
                  ? 'bg-[#b9a779] text-white shadow-lg'
                  : 'bg-[#f7f7f7] text-[#054239] hover:bg-[#054239] hover:text-white shadow-md'
              }`}
            >
              {typeof category === 'string' ? category : getLocalizedField(category, 'name')}
            </button>
          ))}
        </div> 

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-[#b9a779]" size={48} />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">Error loading blog posts: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <Link 
                key={post.id}  
                to={`/blog/${post.slug }`}
                className="bg-[#f7f7f7] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={post.featured_image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#b9a779] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category ? (language === 'ar' ? post.category.name_ar : post.category.name) : (language === 'ar' ? 'مدونة' : 'Blog')}

                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center text-gray-500 text-sm mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {(() => {
                        const eventDate = getLocalizedField(post, 'event_date');
                        if (eventDate) {
                          return eventDate;
                        }
                        return new Date(post.published_at).toLocaleDateString(
                          language === 'ar' ? 'ar-SA' : 'en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }
                        );
                      })()}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      {getLocalizedField(post, 'read_time')}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-[#054239] mb-3 group-hover:text-[#b9a779] transition-colors duration-300 line-clamp-2">
                    {getLocalizedField(post, 'title')}
                  </h3>

                  <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                    {getLocalizedField(post, 'excerpt')}
                  </p>

                  <span className="inline-flex items-center text-[#b9a779] font-medium transition-colors duration-300 group-hover:text-[#054239] mt-auto">
                    {t('common.read_more')}
                   {language === 'ar' ? (
  <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
) : (
  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
)}

                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && blogPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('blog.no_posts')}</p>
          </div>
        )}

      
      </div>
    </section>
  </div>
);

};

export default BlogPage;