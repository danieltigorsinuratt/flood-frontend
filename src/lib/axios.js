import { requiresAuth } from '@/lib/routes';
import axiosLib from 'axios';

const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: false,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor request: tambahkan Bearer token dari localStorage
axios.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// Redirect ke login jika 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (
      status === 401 &&
      typeof window !== 'undefined' &&
      requiresAuth(window.location.pathname)
    ) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axios;