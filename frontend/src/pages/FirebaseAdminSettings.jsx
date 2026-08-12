import React, { useEffect, useState } from 'react';
import { User, Shield, Sun, Loader2 } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getSiteSettings, updateSiteSettings } from '../services/settingsService';

const AdminSettings = () => {
  const { adminUser } = useAdminAuth();
  const [isJanmashtami, setIsJanmashtami] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then((s) => {
        setIsJanmashtami(!!s.isJanmashtamiThemeActive);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const handleToggle = async () => {
    const next = !isJanmashtami;
    setSaving(true);
    try {
      await updateSiteSettings({ isJanmashtamiThemeActive: next });
      setIsJanmashtami(next);
    } catch (e) {
      console.error('Failed to update theme setting', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="admin-settings">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account & site preferences</p>
        </div>

        {/* Admin profile card */}
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

        {/* Seasonal theme toggle card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6" data-testid="seasonal-theme-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-full flex items-center justify-center">
              <Sun size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Seasonal Theme</h2>
              <p className="text-sm text-gray-500">Toggle special festival themes on the homepage</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg" data-testid="janmashtami-toggle-row">
            <div>
              <p className="text-sm font-semibold text-gray-800">Janmashtami Theme</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {isJanmashtami
                  ? 'Active — Hero shows Janmashtami festive layout'
                  : 'Inactive — Hero shows the regular layout'}
              </p>
            </div>

            {!loaded ? (
              <Loader2 size={20} className="animate-spin text-gray-400" />
            ) : (
              <button
                onClick={handleToggle}
                disabled={saving}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  isJanmashtami ? 'bg-[#D8909C]' : 'bg-gray-300'
                } ${saving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                data-testid="janmashtami-toggle-btn"
                aria-label="Toggle Janmashtami theme"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                    isJanmashtami ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
