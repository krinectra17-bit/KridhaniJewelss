import React from 'react';
import { User, Shield } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminSettings = () => {
  const { adminUser } = useAdminAuth();

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="admin-settings">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-[#E8A0A8] to-[#D8909C] rounded-full flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{adminUser?.name || 'Admin'}</h2>
              <p className="text-sm text-gray-500">{adminUser?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Shield size={20} className="text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">Role: Administrator</p>
                <p className="text-xs text-green-600">Full access to all admin features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
