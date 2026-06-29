// WASITI 2027 — دوال الإشعارات (Notifications API)
// المسار: src/lib/api/notifications.ts

import { api } from './client';

// --- جلب قائمة الإشعارات ---
export const getNotifications = async (params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        title: string;
        message: string;
        time: string;
        read: boolean;
        type: 'info' | 'success' | 'warning' | 'error';
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/notifications', { params });
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل جلب الإشعارات');
  } catch (error) {
    throw error;
  }
};

// --- تحديد إشعار كمقروء ---
export const markRead = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      message: string;
    }>(`/notifications/${id}/read`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل تحديد الإشعار كمقروء');
  } catch (error) {
    throw error;
  }
};

// --- تحديد جميع الإشعارات كمقروءة ---
export const markAllRead = async () => {
  try {
    const response = await api.put<{
      success: boolean;
      message: string;
    }>('/notifications/read-all');
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل تحديد الإشعارات كمقروءة');
  } catch (error) {
    throw error;
  }
};

// --- حذف إشعار ---
export const deleteNotification = async (id: string) => {
  try {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/notifications/${id}`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل حذف الإشعار');
  } catch (error) {
    throw error;
  }
};

// --- جلب عدد الإشعارات غير المقروءة ---
export const getUnreadCount = async () => {
  try {
    const response = await api.get<{
      success: boolean;
      data: { count: number };
    }>('/notifications/unread-count');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب عدد الإشعارات');
  } catch (error) {
    throw error;
  }
};