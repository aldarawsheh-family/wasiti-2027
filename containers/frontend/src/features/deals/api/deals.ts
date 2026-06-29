// WASITI 2027 — دوال الصفقات (Deals API)
// المسار: src/lib/api/deals.ts

import { api } from './client';

// --- جلب قائمة الصفقات ---
export const getDeals = async (params?: {
  status?: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        listingTitle: string;
        buyerName: string;
        sellerName: string;
        amount: number;
        status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
        date: string;
        statusHistory: Array<{
          status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
          date: string;
          note?: string;
        }>;
      }>;
      total: number;
      page: number;
      totalPages: number;
    }>('/deals', { params });
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل جلب الصفقات');
  } catch (error) {
    throw error;
  }
};

// --- جلب تفاصيل صفقة ---
export const getDeal = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/deals/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب تفاصيل الصفقة');
  } catch (error) {
    throw error;
  }
};

// --- إنشاء صفقة جديدة ---
export const createDeal = async (data: {
  listingId: string;
  buyerId: string;
  amount: number;
  message: string;
}) => {
  try {
    const response = await api.post<{
      success: boolean;
      data: any;
    }>('/deals', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل إنشاء الصفقة');
  } catch (error) {
    throw error;
  }
};

// --- قبول الصفقة ---
export const acceptDeal = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/deals/${id}/accept`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل قبول الصفقة');
  } catch (error) {
    throw error;
  }
};

// --- رفض الصفقة ---
export const rejectDeal = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/deals/${id}/reject`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل رفض الصفقة');
  } catch (error) {
    throw error;
  }
};

// --- إكمال الصفقة ---
export const completeDeal = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/deals/${id}/complete`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل إكمال الصفقة');
  } catch (error) {
    throw error;
  }
};

// --- إلغاء الصفقة ---
export const cancelDeal = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/deals/${id}/cancel`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل إلغاء الصفقة');
  } catch (error) {
    throw error;
  }
};