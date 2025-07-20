import { useState, useEffect } from 'react';
import { BlogAPI, type BlogFilters } from '../lib/api/blog';
import type { BlogPost, BlogCategory } from '../lib/supabase';

export const useBlogPosts = (filters: BlogFilters = {}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [postsData, categoriesData] = await Promise.all([
          BlogAPI.getPosts(filters),
          BlogAPI.getCategories()
        ]);
        
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [JSON.stringify(filters)]);

  return { posts, categories, loading, error };
};

export const useBlogPost = (id: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postData = await BlogAPI.getPost(id);
        setPost(postData);
        
        if (postData?.category_id) {
          const related = await BlogAPI.getRelatedPosts(
            postData.id, 
            postData.category_id
          );
          setRelatedPosts(related);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  return { post, relatedPosts, loading, error };
};

export const useRecentPosts = (limit = 3) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const postsData = await BlogAPI.getRecentPosts(limit);
        setPosts(postsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recent posts');
        console.error('Error fetching recent posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [limit]);

  return { posts, loading, error };
};