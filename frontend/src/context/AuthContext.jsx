import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        withCredentials: true,
      });
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    const { data } = await axios.post(
      `${BACKEND_URL}/api/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    setUser(data);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    checkAuth
  }), [user, loading, login, logout, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};