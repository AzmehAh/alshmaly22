import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, Link as LinkIcon, X, Image as ImageIcon, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { RelationsAPI } from '../../lib/api/relations';
import type { BlogPost, BlogCategory } from '../../lib/supabase';
import type { BlogPostRelation } from '../../lib/api/relations';
import { useLanguage } from '../../contexts/LanguageContext';

const BlogPostsPage = () => {
  const { t, direction, language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showRelationsModal, setShowRelationsModal] = useState<string | null>(null);
  const [relations, setRelations] = useState<BlogPostRelation[]>([]);
  const [availablePosts, setAvailablePosts] = useState<BlogPost[]>([]);
  const [images, setImages] = useState<Array<{
    id?: string;
    image_url: string;
    alt_text: string;
    sort_order: number;
  }>>([]);</parameter>

  const fetchRelations = async (postId: string) => {
    try {
      const data = await RelationsAPI.getBlogPostRelations(postId);
      setRelations(data);
    } catch (error) {
      console.error('Error fetching relations:', error);
    }
  };

  const fetchAvailablePosts = async (currentPostId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*)
        `)
        .neq('id', currentPostId)
        .eq('published', true)
        .order('title');

      if (error) throw error;
      setAvailablePosts(data || []);
    } catch (error) {
      console.error('Error fetching available posts:', error);
    }
  };

  const handleAddRelation = async (blogPostId: string, relatedPostId: string, relationType: string) => {
    try {
      await RelationsAPI.addBlogPostRelation(blogPostId, relatedPostId, relationType);
      await fetchRelations(blogPostId);
    } catch (error) {
      console.error('Error adding relation:', error);
    }
  };

  const handleRemoveRelation = async (relationId: string, blogPostId: string) => {
    try {
      await RelationsAPI.removeBlogPostRelation(relationId);
      await fetchRelations(blogPostId);
    } catch (error) {
      console.error('Error removing relation:', error);
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    title_ar: '',
    slug: '',
    excerpt: '',
    excerpt_ar: '',
    content: '',
    content_ar: '',
    category_id: '',
    author: 'Al-Shamali Team',
    author_ar: 'فريق الشمالي',
    read_time: '5 min read',
    read_time_ar: '5 دقائق قراءة',
    event_date_en: '',
    event_date_ar: '',
    featured_image: '',
    published: true
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(*),
          images:blog_images(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchImages = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_images')
        .select('*')
        .eq('blog_post_id', postId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const saveImages = async (postId: string) => {
    try {
  
      await supabase
        .from('blog_images')
        .delete()
        .eq('blog_post_id', postId);

     
      if (images.length > 0) {
        const imagesToInsert = images.map(img => {
          const { id, ...imgWithoutId } = img;
          return {
            ...imgWithoutId,
            blog_post_id: postId
          };
        });

        const { error } = await supabase
          .from('blog_images')
          .insert(imagesToInsert);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving images:', error);
      throw error;
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      title_ar: '',
      slug: '',
      excerpt: '',
      excerpt_ar: '',
      content: '',
      content_ar: '',
      category_id: '',
      author: 'Al-Shamali Team',
      author_ar: 'فريق الشمالي',
      read_time: '5 min read',
      read_time_ar: '5 دقائق قراءة',
      event_date_en: '',
      event_date_ar: '',
      featured_image: '',
      published: true
    });
    setEditingPost(null);
    setImages([]);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let postId;
      
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(formData)
          .eq('id', editingPost.id);

        if (error) throw error;
        postId = editingPost.id;
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(formData)
          .select()
          .single();

        if (error) throw error;
        postId = data.id;
      }

      await saveImages(postId);
      await fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
      alert(t('blog.error.save_post'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      title_ar: post.title_ar || '',
      slug: post.slug,
      excerpt: post.excerpt,
      excerpt_ar: post.excerpt_ar || '',
      content: post.content,
      content_ar: post.content_ar || '',
      category_id: post.category_id || '',
      author: post.author,
      author_ar: post.author_ar || 'فريق الشمالي',
      read_time: post.read_time,
      read_time_ar: post.read_time_ar || '5 دقائق قراءة',
      event_date_en: post.event_date_en || '',
      event_date_ar: post.event_date_ar || '',
      featured_image: post.featured_image || '',
      published: post.published
    });
    fetchImages(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPosts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert(t('blog.error.delete_post'));
    }
  }; 


  const addImage = () => {
    setImages([...images, { 
      image_url: '', 
      alt_text: '', 
      sort_order: images.length > 0 ? Math.max(...images.map(i => i.sort_order)) + 1 : 1 
    }]);
  };

  const updateImage = (index: number, field: keyof BlogPostImage, value: string | number) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  }; 
  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const search = searchTerm.toLowerCase();

const filteredPosts = posts.filter(post => {
  const titleEn = post.title?.toLowerCase() || '';
  const titleAr = post.title_ar?.toLowerCase() || '';
  const excerptEn = post.excerpt?.toLowerCase() || '';
  const excerptAr = post.excerpt_ar?.toLowerCase() || '';

  const matchesSearch =
    titleEn.includes(search) || titleAr.includes(search) ||
    excerptEn.includes(search) || excerptAr.includes(search);

  const matchesCategory = selectedCategory === 'all' || post.category_id === selectedCategory;

  return matchesSearch && matchesCategory;
});
const getLocalizedText = (item: any, field: string) => {
  if (language === 'ar') {
    return item[`${field}_ar`] || item[field] || '';
  }
  return item[field] || '';
};


  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b9a779]"></div>
      </div>
    );
  }

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#054239]">{t('blog.title')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#b9a779] hover:bg-[#054239] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          {t('blog.add_post')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('blog.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
          >
            <option value="all">{t('blog.all_categories')}</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}{category.name_ar ? ` / ${category.name_ar}` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
         <thead className="bg-gray-50">
  <tr>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blog.table.post')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blog.table.category')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blog.table.author')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blog.table.status')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blog.table.date')}
    </th>
    <th className={`px-6 py-3 ${direction === 'rtl' ? 'text-right' : 'text-left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}>
      {t('blog.table.actions')}
    </th>
  </tr>
</thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={post.featured_image || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'}
                        alt={post.title}
                        className="h-12 w-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-[#054239]">
                          {getLocalizedText(post, 'title')}
                        </div>

 
                        
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {post.category?.name || t('blog.uncategorized')}
                      {post.category?.name_ar && (
                        <div className="text-xs text-gray-500 mt-1">{post.category.name_ar}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{post.author}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.published ? t('blog.status.published') : t('blog.status.draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      {new Date(post.published_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center  gap-2">
                      <button
                        onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title={t('blog.modal.view_post')}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-[#b9a779] hover:text-[#054239] p-1 rounded"
                        title={t('blog.modal.edit_post_btn')}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setShowRelationsModal(post.id);
                          fetchRelations(post.id);
                          fetchAvailablePosts(post.id);
                        }}
                        className="text-[#b9a779] hover:text-[#054239] p-1 rounded"
                        title={t('blog.modal.manage_related_posts')}
                      >
                        <LinkIcon size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title={t('blog.modal.delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> 
        </div>
      </div>

      {/* Post Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-[#054239] mb-4">
                {editingPost ? t('blog.modal.edit_post') : t('blog.modal.add_new_post')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title - Bilingual */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.title_en')}</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (!editingPost) {
                          setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="Post title in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.title_ar')}</label>
                    <input
                      type="text"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="عنوان المقال بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.slug')}</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                    placeholder="post-slug"
                  />
                </div>

                {/* Excerpt - Bilingual */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.excerpt_en')}</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="Brief description in English..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.excerpt_ar')}</label>
                    <textarea
                      rows={3}
                      value={formData.excerpt_ar}
                      onChange={(e) => setFormData({ ...formData, excerpt_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="الوصف المختصر بالعربية..."
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Content - Bilingual (can use ReactQuill or textarea) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.content_en')}</label>
                    <textarea
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="Full content in English..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.content_ar')}</label>
                    <textarea
                      rows={6}
                      value={formData.content_ar}
                      onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="المحتوى الكامل بالعربية..."
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.category')}</label>
                  <select
                    value={formData.category_id || ''}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                    required
                  >
                    <option value="">{t('blog.all_categories')}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}{cat.name_ar ? ` / ${cat.name_ar}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.author_en')}</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="Author in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.author_ar')}</label>
                    <input
                      type="text"
                      value={formData.author_ar}
                      onChange={(e) => setFormData({ ...formData, author_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="المؤلف بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Read Time */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.read_time_en')}</label>
                    <input
                      type="text"
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="Read time in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.read_time_ar')}</label>
                    <input
                      type="text"
                      value={formData.read_time_ar}
                      onChange={(e) => setFormData({ ...formData, read_time_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                      placeholder="مدة القراءة بالعربية"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Event Date */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.event_date_en')}</label>
                    <input
                      type="date"
                     value={formData.event_date_en}
                     onChange={(e) => setFormData({ ...formData, event_date_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.event_date_ar')}</label>
                    <input
                      type="date"
                      value={formData.event_date_ar}
                      onChange={(e) => setFormData({ ...formData, event_date_ar: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('blog.fields.status')}</label>
                  <select
                    value={formData.published ? 'published' : 'draft'}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.value === 'published' })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
                    required
                  >
                    <option value="published">{t('blog.status.published')}</option>
                    <option value="draft">{t('blog.status.draft')}</option>
                  </select>
                </div>
               {images.length === 0 ? (
  <div className="text-center py-6 bg-white rounded border border-dashed border-gray-300">
    <ImageIcon size={48} className="mx-auto text-gray-400 mb-2" />
    <p className="text-gray-500">{t('admin.image')}</p>
  </div>
) : (
  <div className="space-y-4">
    {images.map((image, index) => (
      <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-white border border-gray-200 rounded-lg relative">
        
        {/* ✅ وسم صورة رئيسية */}
        {image.is_featured && (
          <div className="absolute top-2 right-2 bg-[#b9a779] text-white text-xs px-2 py-1 rounded shadow">
            {t('blog.fields.featured')}
          </div>
        )}

        {/* صورة مصغّرة أو معاينة */}
        <div className="md:col-span-2">
          {image.image_url ? (
            <div className="relative group">
              <img 
                src={image.image_url}
                alt={image.alt_text || 'معاينة الصورة'}
                className="h-20 w-full object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/150?text=Invalid+Image';
                }}
              />
            </div>
          ) : (
            <div className="h-20 w-full bg-gray-100 rounded flex items-center justify-center">
              <ImageIcon size={24} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* رفع صورة أو إدخال رابط */}
        <div className="md:col-span-5">
          <div className="relative">
            {image.image_url ? (
              <div className="relative group">
                <img
                  src={image.image_url}
                  alt={image.alt_text || 'Preview'}
                  className="w-full h-32 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    if (!image.image_url.startsWith('blob:') && !image.image_url.startsWith('data:')) {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-75 rounded-full p-2 cursor-pointer transition-opacity duration-200"
                  >
                    <Upload className="w-5 h-5 text-gray-700" />
                  </label>
                </div>
              </div>
            ) : (
              <label
                htmlFor={`image-upload-${index}`}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">{t('admin.upload_image')}</span>
                <span className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</span>
              </label>
            )}

            {/* input ملف مخفي */}
            <input
              id={`image-upload-${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    alert('File size must be less than 10MB');
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const imageUrl = event.target?.result as string;

                    const updated = [...images];
                    updated[index].image_url = imageUrl;
                    updated[index].alt_text ||= file.name.replace(/\.[^/.]+$/, '');
                    setImages(updated);
                  };
                  reader.readAsDataURL(file);
                }
                e.target.value = '';
              }}
              className="hidden"
            />
          </div>

          {/* إدخال رابط وتحويله إلى base64 */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('admin.or_enter_url')}
            </label>
            <input
              type="url"
              value={image.image_url}
              onChange={async (e) => {
                const url = e.target.value;
                const updated = [...images];
                updated[index].image_url = url;
                setImages(updated);

                try {
                  const response = await fetch(url);
                  const blob = await response.blob();
                  if (!blob.type.startsWith('image/')) {
                    alert('الرابط لا يشير إلى صورة صالحة');
                    return;
                  }

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64data = reader.result as string;
                    updated[index].image_url = base64data;
                    setImages([...updated]);
                  };
                  reader.readAsDataURL(blob);
                } catch (error) {
                  console.error('فشل تحميل الصورة من الرابط:', error);
                  alert('تعذر تحميل الصورة من الرابط المحدد.');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* النص البديل */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.alt_text')}
          </label>
          <input
            type="text"
            value={image.alt_text}
            onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
            placeholder={t('admin.description')}
          />
        </div>

        {/* ترتيب الصور */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('admin.order')}
          </label>
          <input
            type="number"
            value={image.sort_order}
            onChange={(e) => updateImage(index, 'sort_order', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b9a779] focus:border-transparent"
            min="0"
          />
        </div>

        {/* ✅ Checkbox لاختيار الصورة الرئيسية */}
        <div className="md:col-span-1 flex items-center justify-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={image.is_featured === true}
              onChange={() => {
                const updatedImages = images.map((img, i) => ({
                  ...img,
                  is_featured: i === index,
                }));
                setImages(updatedImages);
              }}
            />
            <span className="text-sm text-gray-700">{t('blog.fields.featured_image')}</span>
          </label>
        </div>

        {/* زر الحذف */}
        <div className="md:col-span-1 flex items-end justify-end">
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="text-red-600 hover:text-red-800 p-5"
            title={t('blog.images.remove')}
          >
            <Trash2 size={20} />
          </button>
        </div>

      </div>
    ))}
  </div>
)}

                {/* Buttons */}
                <div className="flex justify-end  gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowForm(false);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    {t('blog.modal.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-[#b9a779] text-white rounded-md hover:bg-[#054239] transition-colors disabled:opacity-50"
                  >
                    {loading ? t('blog.modal.saving') : (editingPost ? t('blog.modal.edit_post_btn') : t('blog.modal.edit_post_btn'))}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 max-w-md mx-auto shadow-lg">
            <h2 className="text-xl font-semibold text-[#054239] mb-4">{t('blog.modal.delete_title')}</h2>
            <p className="mb-6">{t('blog.modal.delete_confirmation')}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                {t('blog.modal.cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t('blog.modal.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
{/* Related Posts Modal */}
{showRelationsModal && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white">
      <div className="mt-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#054239]">{t('admin.manage')} {t('admin.related2')}</h3>
          <button
            onClick={() => setShowRelationsModal(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button> 
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Relations */}
          <div>
            <h4 className="text-lg font-semibold text-[#054239] mb-4"> {t('admin.related2')}</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto"> 
              {relations.map((relation) => (
                <div key={relation.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <img
                      src={relation.related_post?.thumbnail || 'https://via.placeholder.com/100x100?text=Post'}
                      alt={relation.related_post?.title}
                      className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-10 w-10 rounded-lg object-cover`}
                    />
                    <div> 
                     <div className="text-sm font-medium text-[#054239]">
  {getLocalizedText(relation.related_blog_post, 'title')}
</div>

                      <div className="text-sm text-gray-500">{relation.related_post?.category?.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveRelation(relation.id, showRelationsModal)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title={t('admin.delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {relations.length === 0 && (
                <p className="text-gray-500 text-center py-4"  >{t('admin.no_data')}</p>
              )}
            </div>
          </div>

          {/* Add Relations */}
          <div>
            <h4 className="text-lg font-semibold text-[#054239] mb-4">{t('admin.add')} {t('admin.related2')}</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availablePosts
                .filter(post => !relations.some(rel => rel.related_post_id === post.id))
                .map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                     
                      <div>
                        <div className="text-sm font-medium text-[#054239]">
                          {getLocalizedText(post, 'title')}
                        </div>

                        <div className="text-sm text-gray-500">{post.category?.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddRelation(showRelationsModal, post.id, 'related')}
                      className="bg-[#b9a779] hover:bg-[#054239] text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                    > 
                      {t('admin.add')}
                    </button>
                  </div>
                ))}

              {availablePosts.filter(post => !relations.some(rel => rel.related_post_id === post.id)).length === 0 && (
                <p className="text-gray-500 text-center py-4">{t('admin.no_data')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default BlogPostsPage;