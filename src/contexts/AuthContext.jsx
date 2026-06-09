'use client';

import axios from '@/lib/axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  loading: true,
  flash: {},
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState({});

  const refresh = useCallback(async () => {
    try {
      await axios.get('/sanctum/csrf-cookie');
      const { data } = await axios.get('/api/user');
      setUser(data.user ?? data);
      setIsAdmin(Boolean(data.is_admin ?? data.isAdmin));
    } catch {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (credentials) => {
    // Ambil CSRF cookie dulu (Laravel Sanctum)
    await axios.get('/sanctum/csrf-cookie');
    const { data } = await axios.post('/api/auth/login', credentials);
    setUser(data.user ?? data);
    setIsAdmin(Boolean(data.is_admin ?? data.isAdmin));
    setFlash({ success: 'Login berhasil.' });
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch {
      /* abaikan */
    }
    setUser(null);
    setIsAdmin(false);
    setFlash({});
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, flash, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
