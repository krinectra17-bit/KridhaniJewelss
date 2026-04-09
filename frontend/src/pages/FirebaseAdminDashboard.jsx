import React, { useState, useEffect } from 'react';
import { Package, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import StatCard from '../components/admin/StatCard';
import RecentOrdersTable from '../components/admin/RecentOrdersTable';
import { getDashboardStats } from '../services/orderService';

const FirebaseAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, bgColor: 'bg-blue-50' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, bgColor: 'bg-green-50' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: Package, bgColor: 'bg-orange-50' },
    { title: 'Total Products', value: stats.totalProducts || 0, icon: TrendingUp, bgColor: 'bg-purple-50' }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64" data-testid="dashboard-loading">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="admin-dashboard">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome to your admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <RecentOrdersTable orders={stats.recentOrders} />
      </div>
    </AdminLayout>
  );
};

export default FirebaseAdminDashboard;
