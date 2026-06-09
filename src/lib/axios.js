/**
 * Konfigurasi global axios untuk komunikasi dengan backend Laravel.
 * - Otomatis set baseURL dari env
 * - Otomatis baca XSRF-TOKEN dari cookie dan kirim sebagai header
 * - Sertakan credentials (cookie) agar Laravel Sanctum bisa autentikasi
 */
import { requiresAuth } from '@/lib/routes';
import axiosLib from 'axios';

const axios = axiosLib.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor request: tambahkan XSRF-TOKEN dari cookie (Laravel Sanctum)
axios.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    }
  }
  return config;
});

// Redirect ke login hanya di halaman yang wajib auth (dashboard, monitoring, profile)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (
      (status === 401 || status === 419) &&
      typeof window !== 'undefined' &&
      requiresAuth(window.location.pathname)
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axios;
