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
      const user = await loginAdmin(email, password);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/firebase-admin/dashboard');
      }, 300);
      
    } catch (err) {
      // User-friendly error messages
      let userMessage = '';
      
      if (err.message.includes('User not found') || err.message.includes('user-not-found')) {
        userMessage = 'No account found with this email. Please check your email or create an account.';
      } else if (err.message.includes('password') || err.message.includes('wrong-password')) {
        userMessage = 'Incorrect password. Please try again.';
      } else if (err.message.includes('invalid-email')) {
        userMessage = 'Invalid email format. Please enter a valid email.';
      } else if (err.message.includes('too-many-requests')) {
        userMessage = 'Too many failed login attempts. Please try again later.';
      } else if (err.message.includes('network')) {
        userMessage = 'Network error. Please check your internet connection and try again.';
      } else if (err.message.includes('invalid-credential')) {
        userMessage = 'Invalid email or password. Please try again.';
      } else {
        userMessage = err.message || 'Login failed. Please try again.';
      }
      
      setError(userMessage);
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
                autoComplete="email"
                data-testid="email-input"
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
                autoComplete="current-password"
                data-testid="password-input"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded" role="alert" data-testid="error-message">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3 bg-gradient-to-r from-[#E8A0A8] to-[#D8909C] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ fontFamily: "'Nunito Sans', sans-serif" }}
              data-testid="login-button"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Login to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#5D4037] hover:text-[#E8A0A8]" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
              ← Back to Website
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">Authorized administrators only</p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseAdminLogin;
