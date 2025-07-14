import React from 'react';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomepageAPI } from '../../lib/api/homepage';

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchHomepageBlogPosts = async () => {
      try {
        setLoading(true);
        const homepagePosts = await HomepageAPI.getHomepageBlogPosts();
        setBlogPosts(homepagePosts.map(hp => hp.blog_post));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageBlogPosts();
  }, []);

  return (
    <section id="blog" className="py-20 bg-[#F7F7F7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#054239] mb-4">
            Latest News & Updates
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay updated with our latest news, product launches, and industry insights
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12 mb-12">
            <Loader2 className="animate-spin text-[#b9a779]" size={48} />
          </div>
        ) : error ? (
          <div className="text-center py-12 mb-12">
            <p className="text-red-600 text-lg">Error loading blog posts: {error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogPosts.map(post => (
                <article
                  key={post.id}
                  className="bg-[#f7f7f7] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <div className="relative overflow-hidden group">
                    <img
                      src={
                        post.featured_image ||
                        'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
                      }
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-[#054239] text-sm mb-3">
                      <Calendar size={16} className="mr-2" />
                      {new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    <h3 className="text-xl font-semibold text-[#054239] mb-3 group-hover:text-[#b9a779] transition-colors duration-300 min-h-[3.5rem]">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    <Link
                      to={`/blog/${post.id}`}
                      className="flex items-center mt-auto text-[#b9a779] hover:text-[#054239] font-medium transition-colors duration-300 group"
                    >
                      Read More
                      <ArrowRight
                        size={16}
                        className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Browse All Articles Button */}
            <div className="text-center">
              <Link
                to="/blog"
                className="bg-[#b9a779] hover:bg-[#054239] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg"
              >
                Browse All Articles
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
