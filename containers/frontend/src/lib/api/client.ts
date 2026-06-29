// WASITI 2027 — عميل API (Axios Instance)
// المسار: src/lib/api/client.ts

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '@/lib/errors';

// تكوين القيم الافتراضية
const API_URL = '/api';
const API_TIMEOUT = 30000;

// إنشاء مثيل Axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'tenant-id': '00000000-0000-0000-0000-000000000001',
  },
});

apiClient.interceptors.request.use(
  (config: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);
// --- اعتراض الاستجابات ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { token: newToken, refreshToken: newRefreshToken } = response.data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', newToken);
            localStorage.setItem('refresh_token', newRefreshToken);
          }
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/ar/auth/login';
        }
        return Promise.reject();
      }
    }

    if (error.response) {
      const errorData = (error.response.data as any) || {};
      const apiError = new ApiError(
        errorData.message || errorData.error || 'حدث خطأ في الخادم',
        error.response.status,
        errorData
      );
      return Promise.reject(apiError);
    }

    if (error.request) {
      return Promise.reject(new Error('لا يمكن الاتصال بالخادم. تحقق من اتصال الإنترنت.'));
    }

    return Promise.reject(new Error(error.message || 'حدث خطأ غير متوقع'));
  }
);

// --- دوال مساعدة ---
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => apiClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
};

export default apiClient;