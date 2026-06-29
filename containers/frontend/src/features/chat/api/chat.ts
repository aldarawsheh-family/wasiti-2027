// WASITI 2027 — دوال المحادثات (Chat API)
// المسار: src/lib/api/chat.ts

import { api } from '../../../lib/api/client';

// --- جلب قائمة المحادثات ---
export const getConversations = async () => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        name: string;
        avatar?: string;
        lastMessage: string;
        timestamp: string;
        unread: number;
      }>;
    }>('/chat/conversations');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب المحادثات');
  } catch (error) {
    throw error;
  }
};

// --- جلب رسائل محادثة ---
export const getMessages = async (conversationId: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        senderId: string;
        senderName: string;
        senderAvatar?: string;
        content: string;
        timestamp: string;
        read: boolean;
        type: 'text' | 'image' | 'file';
        fileUrl?: string;
      }>;
    }>(`/chat/conversations/${conversationId}/messages`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب الرسائل');
  } catch (error) {
    throw error;
  }
};

// --- إرسال رسالة ---
export const sendMessage = async (conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text', file?: File) => {
  try {
    const formData = new FormData();
    formData.append('content', content);
    formData.append('type', type);
    if (file) {
      formData.append('file', file);
    }
    
    const response = await api.post<{
      success: boolean;
      data: any;
    }>(`/chat/conversations/${conversationId}/messages`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل إرسال الرسالة');
  } catch (error) {
    throw error;
  }
};

// --- تحديد الرسائل كمقروءة ---
export const markRead = async (conversationId: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      message: string;
    }>(`/chat/conversations/${conversationId}/read`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل تحديد الرسائل كمقروءة');
  } catch (error) {
    throw error;
  }
};

// --- رفع ملف مرفق ---
export const uploadAttachment = async (conversationId: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<{
      success: boolean;
      data: { url: string };
    }>(`/chat/conversations/${conversationId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل رفع الملف');
  } catch (error) {
    throw error;
  }
};