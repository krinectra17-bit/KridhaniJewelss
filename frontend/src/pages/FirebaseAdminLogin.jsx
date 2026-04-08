import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { LogIn } from 'lucide-react';

const FirebaseAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/firebase-admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F7] to-[#FFF9FA] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C1810] mb-2" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
            Admin Panel
          </h1>
          <p className="text-sm md:text-base text-[#5D4037]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
            Firebase Authentication
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#F5E6E8]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2C1810] mb-2" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#F5E6E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A0A8]"
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-lg disabled:opacity-50 hover:shadow-lg transition-all"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
            >
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#5D4037] hover:text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              ← Back to Website
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Demo: admin@kridhani.com / admin123</p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseAdminLogin;
