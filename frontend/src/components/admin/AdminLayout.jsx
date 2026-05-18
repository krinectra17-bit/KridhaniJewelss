import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin, adminUser } = useAdminAuth();

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="block">
            <h1 className="text-lg font-bold text-[#2C1810]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
              KRIDHANI JEWELS
            </h1>
            <p className="text-xs text-[#E8A0A8]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Admin Panel
            </p>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-[#FFF9FA] text-[#E8A0A8] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-gray-400">Signed in as</p>
            <p className="text-sm font-medium text-gray-700 truncate">{adminUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            data-testid="logout-btn"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <h1 className="text-sm font-bold text-[#2C1810]" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
          KRIDHANI ADMIN
        </h1>
        <div className="flex gap-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`p-2 rounded-lg ${location.pathname === item.path ? 'bg-[#FFF9FA] text-[#E8A0A8]' : 'text-gray-500'}`}>
              <item.icon size={18} />
            </Link>
          ))}
          <button onClick={handleLogout} className="p-2 text-red-500"><LogOut size={18} /></button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
