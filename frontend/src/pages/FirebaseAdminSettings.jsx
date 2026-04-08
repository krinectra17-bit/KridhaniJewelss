import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { User, Mail, Lock } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const FirebaseAdminSettings = () => {
  const { adminUser } = useAdminAuth();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your admin account</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Admin ID</p>
                <p className="font-semibold text-gray-900">{adminUser?.uid || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Mail size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{adminUser?.email || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Lock size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Authentication</p>
                <p className="font-semibold text-gray-900">Firebase Auth</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#FFF5F7] to-[#FFF9FA] rounded-xl p-6 border border-[#F5E6E8]">
          <h3 className="font-bold text-gray-900 mb-2">Firebase Integration Active</h3>
          <p className="text-sm text-gray-600">
            Your admin panel is fully integrated with Firebase Authentication, Firestore Database, and Cloud Storage.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FirebaseAdminSettings;
