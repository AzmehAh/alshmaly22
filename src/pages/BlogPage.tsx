import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Clock, Loader2 } from 'lucide-react';
import { useBlogPosts } from '../hooks/useBlog';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const { posts: blogPosts, categories, loading, error } = useBlogPosts({
    category: selectedCategory === 'All' ? undefined : selectedCategory
  });

  // Prepare categories for display
  const displayCategories = ['All', ...categories.map(cat => cat.name)];

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-[#054239] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Al-Shamali Blog</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Stay updated with our latest news, insights, and stories from the world of Syrian agriculture
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
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#b9a779] text-white shadow-lg'
                    : 'bg-[#f7f7f7] text-[#054239] hover:bg-[#054239] hover:text-white shadow-md'
                }`}
              >
                {category}
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
              <article key={post.id} className="bg-[#f7f7f7] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img 
                    src={post.featured_image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'} 
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#b9a779] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category?.name || 'Blog'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-gray-500 text-sm mb-3 space-x-4">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {new Date(post.published_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      {post.read_time}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-[#054239] mb-3 group-hover:text-[#b9a779] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-[#b9a779] hover:text-[#054239] font-medium transition-colors duration-300 group"
                  >
                    Read More
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </article>
            ))}
            </div>
          )}

          {!loading && !error && blogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found in this category.</p>
            </div>
          )}

          {/* Load More Button */}
          {!loading && !error && blogPosts.length > 0 && (
            <div className="text-center mt-12">
              <button className="bg-[#b9a779] hover:bg-[#054239] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg">
                Load More Articles
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;