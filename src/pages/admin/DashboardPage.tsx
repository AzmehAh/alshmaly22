import React, { useState, useEffect } from 'react';
import { BarChart3, Package, FileText, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardStats {
  totalProducts: number;
  totalBlogPosts: number;
  totalContacts: number;
  recentContacts: any[];
}

const DashboardPage = () => {
  const { t, direction } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalBlogPosts: 0,
    totalContacts: 0,
    recentContacts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        { count: productsCount },
        { count: postsCount },
        { count: contactsCount },
        { data: recentContacts }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        totalProducts: productsCount || 0,
        totalBlogPosts: postsCount || 0,
        totalContacts: contactsCount || 0,
        recentContacts: recentContacts || []
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t('admin.products.management'),
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: t('admin.blog.management'),
      value: stats.totalBlogPosts,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: t('admin.contacts.management'),
      value: stats.totalContacts,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b9a779]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#054239]">{t('admin.dashboard.overview')}</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BarChart3 size={16} />
          <span>{t('admin.last_updated')}: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-[#054239] mt-2">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-500 mr-1" />
                  <span className="text-sm text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contact Messages */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-[#054239] mb-4">{t('admin.contacts.management')}</h2>
          <div className="space-y-4">
            {stats.recentContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-[#054239]">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.subject}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  contact.status === 'unread' ? 'bg-red-100 text-red-800' :
                  contact.status === 'read' ? 'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {contact.status}
                </span>
              </div>
            ))}
            {stats.recentContacts.length === 0 && (
              <p className="text-gray-500 text-center py-4">{t('admin.no_data')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;