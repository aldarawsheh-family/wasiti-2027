// WASITI 2027 — دوال البحث (Search API)
// المسار: src/lib/api/search.ts

import { api } from './client';

// --- تنفيذ البحث المتقدم ---
export const search = async (params: {
  q?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_low' | 'price_high';
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any[];
      total: number;
      page: number;
      totalPages: number;
    }>('/search', { params });
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل تنفيذ البحث');
  } catch (error) {
    throw error;
  }
};

// --- جلب اقتراحات البحث (للمربع التلقائي) ---
export const getSuggestions = async (query: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: string[];
    }>('/search/suggestions', { params: { q: query } });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب الاقتراحات');
  } catch (error) {
    throw error;
  }
};

// --- جلب قائمة عمليات البحث المحفوظة ---
export const getSavedSearches = async () => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        query: string;
        filters: any;
        createdAt: string;
      }>;
    }>('/search/saved');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب عمليات البحث المحفوظة');
  } catch (error) {
    throw error;
  }
};

// --- حفظ عملية بحث ---
export const saveSearch = async (data: {
  query?: string;
  filters?: any;
}) => {
  try {
    const response = await api.post<{
      success: boolean;
      data: any;
    }>('/search/saved', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل حفظ البحث');
  } catch (error) {
    throw error;
  }
};

// --- حذف عملية بحث محفوظة ---
export const deleteSavedSearch = async (id: string) => {
  try {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/search/saved/${id}`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل حذف البحث المحفوظ');
  } catch (error) {
    throw error;
  }
};