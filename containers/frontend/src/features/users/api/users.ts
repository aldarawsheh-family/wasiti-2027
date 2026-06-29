// WASITI 2027 — دوال المستخدمين (Users API)
// المسار: src/features/users/api/users.ts

import { api } from '@/lib/api/client';

const getUserId = (): string => {
  if (typeof window === 'undefined') return '';
  const token = localStorage.getItem('auth_token');
  if (!token) return '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.sub || '';
  } catch {
    return '';
  }
};

export const getProfile = async (): Promise<any> => {
  const userId = getUserId();
  const response = await api.get(`/users/profile/${userId}`);
  return response.data;
};

export const updateProfile = async (data: {
  name?: string;
  email?: string;
  phone?: string;
}): Promise<any> => {
  const response = await api.put('/users/profile', data);
  return response.data;
};

export const uploadAvatar = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getSettings = async (): Promise<any> => {
  const response = await api.get('/users/settings');
  return response.data;
};

export const updateSettings = async (data: {
  theme?: 'light' | 'dark';
  language?: 'ar' | 'en';
  notifications?: { email?: boolean; push?: boolean; sms?: boolean };
}): Promise<any> => {
  const response = await api.put('/users/settings', data);
  return response.data;
};