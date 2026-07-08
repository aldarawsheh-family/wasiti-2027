// WASITI 2027 â€” ط¯ظˆط§ظ„ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ (Notifications API)
// ط§ظ„ظ…ط³ط§ط±: src/lib/api/notifications.ts

import { api } from '@/lib/api/client';

// --- ط¬ظ„ط¨ ظ‚ط§ط¦ظ…ط© ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ---
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
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ');
  } catch (error) {
    throw error;
  }
};

// --- طھط­ط¯ظٹط¯ ط¥ط´ط¹ط§ط± ظƒظ…ظ‚ط±ظˆط، ---
export const markRead = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      message: string;
    }>(`/notifications/${id}/read`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('ظپط´ظ„ طھط­ط¯ظٹط¯ ط§ظ„ط¥ط´ط¹ط§ط± ظƒظ…ظ‚ط±ظˆط،');
  } catch (error) {
    throw error;
  }
};

// --- طھط­ط¯ظٹط¯ ط¬ظ…ظٹط¹ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ظƒظ…ظ‚ط±ظˆط،ط© ---
export const markAllRead = async () => {
  try {
    const response = await api.put<{
      success: boolean;
      message: string;
    }>('/notifications/read-all');
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('ظپط´ظ„ طھط­ط¯ظٹط¯ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ظƒظ…ظ‚ط±ظˆط،ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط­ط°ظپ ط¥ط´ط¹ط§ط± ---
export const deleteNotification = async (id: string) => {
  try {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/notifications/${id}`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('ظپط´ظ„ ط­ط°ظپ ط§ظ„ط¥ط´ط¹ط§ط±');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ ط¹ط¯ط¯ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط؛ظٹط± ط§ظ„ظ…ظ‚ط±ظˆط،ط© ---
export const getUnreadCount = async () => {
  try {
    const response = await api.get<{
      success: boolean;
      data: { count: number };
    }>('/notifications/unread-count');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط¹ط¯ط¯ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ');
  } catch (error) {
    throw error;
  }
};