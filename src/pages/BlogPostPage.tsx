import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, User, Loader2 } from 'lucide-react';
import { useBlogPost } from '../hooks/useBlog';
import { useLanguage } from '../contexts/LanguageContext';

const BlogPostPage = () => {
  const { t, getLocalizedField, language } = useLanguage();
  const { id } = useParams();
  const { post, relatedPosts, loading, error } = useBlogPost(id || '');
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const currentUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || 'Blog Article',
          url: currentUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        alert('Link copied to clipboard!');
      } catch {
        alert('Sharing is not supported and copying failed.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] pt-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#b9a779]" size={48} />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Blog post not found'}</p>
          <Link to="/blog" className="text-[#b9a779] hover:text-[#054239] font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-[#b9a779] hover:text-[#054239] font-medium mb-8 transition-colors duration-300"
        >
          <ArrowLeft size={20} className="mr-2" />
          {t('back.blog')} 
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <span className="bg-[#b9a779] text-white px-4 py-2 rounded-full text-sm font-medium">
                {getLocalizedField(post.category, 'name') || t('nav.blog')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#054239] mb-6 leading-tight"> 
              {getLocalizedField(post, 'title')}
            </h1>

            <div className="flex flex-wrap items-center text-gray-600 text-sm space-x-6 mb-6">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                {getLocalizedField(post, 'author')}
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {(() => {
                  // Use event date if available, otherwise fall back to published date
                  const eventDate = getLocalizedField(post, 'event_date');
                  if (eventDate) {
                    return eventDate;
                  }
                  // Fallback to published date if no event date
                  return new Date(post.published_at).toLocaleDateString(
                    language === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    ...(language === 'ar' && { calendar: 'gregory' })
                  });
                })()}
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                {getLocalizedField(post, 'read_time')}
              </div>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {getLocalizedField(post, 'excerpt')}
            </p>

            {/* Share Button */}
            <div className="flex items-center space-x-4 pb-8 border-b border-gray-200">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-full transition-colors duration-300"
              >
                <Share2 size={16} />
                <span>{t('blog.share')}</span>
              </button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={
                post.featured_image ||
                post.images?.[selectedImageIndex]?.image_url ||
                'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
              }
            alt={getLocalizedField(post, 'title')}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Article Content */}
          <div className="bg-[#f7f7f7] rounded-2xl p-8 shadow-lg mb-8">
            <div
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
             dangerouslySetInnerHTML={{ __html: getLocalizedField(post, 'content') }}
              style={{
                lineHeight: '1.8',
              }}
            />
          </div>

          {/* Image Gallery */}
          {post.images && post.images.length > 1 && (
            <div className="bg-[#f7f7f7] rounded-2xl p-8 shadow-lg mb-8">
              <h3 className="text-2xl font-semibold text-[#054239] mb-6">{t('Photo.Gallery')}</h3>

              {/* Main Gallery Image */}
              <div className="mb-6 bg-[#1E2229]">
                <img
                  src={post.images[selectedImageIndex]?.image_url || ''}
                  alt={`Gallery image ${selectedImageIndex + 1}`}
                  className="w-full h-96 object-contain rounded-xl shadow-md"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {post.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                      selectedImageIndex === index
                        ? 'ring-4 ring-[#b9a779] scale-105'
                        : 'hover:scale-105 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `Gallery thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover"
                    />
                    {selectedImageIndex === index && (
                      <div className="absolute inset-0 bg-[#b9a779]/20"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          <div className="bg-[#f7f7f7] rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-[#054239] mb-6">{t('Related.Articles')}</h3>
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 2).map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="group flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  >
                    <img
                      src={
                        relatedPost.featured_image ||
                        'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400&h=300'
                      }
                      alt={relatedPost.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#054239] group-hover:text-[#b9a779] transition-colors duration-300 line-clamp-2 mb-2">
                       {getLocalizedField(relatedPost, 'title')}

                      </h4>
                     
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">{t('No.related')}</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
