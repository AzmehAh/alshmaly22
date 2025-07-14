import React, { useState, useEffect } from 'react';
import { BarChart3, Package, FileText, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalProducts: number;
  totalBlogPosts: number;
  totalQuotes: number;
  totalContacts: number;
  recentQuotes: any[];
  recentContacts: any[];
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalBlogPosts: 0,
    totalQuotes: 0,
    totalContacts: 0,
    recentQuotes: [],
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
        { count: quotesCount },
        { count: contactsCount },
        { data: recentQuotes },
        { data: recentContacts }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('quote_requests').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('quote_requests').select('*, product:products(name)').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      setStats({
        totalProducts: productsCount || 0,
        totalBlogPosts: postsCount || 0,
        totalQuotes: quotesCount || 0,
        totalContacts: contactsCount || 0,
        recentQuotes: recentQuotes || [],
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
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%'
    },
   
    {
      title: 'Contact Messages',
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#054239]">Dashboard Overview</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <BarChart3 size={16} />
          <span>Last updated: {new Date().toLocaleString()}</span>
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
          <h2 className="text-xl font-semibold text-[#054239] mb-4">Recent Contact Messages</h2>
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
              <p className="text-gray-500 text-center py-4">No recent contact messages</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;