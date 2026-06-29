// WASITI 2027 — دوال الذكاء الاصطناعي (AI API)
// المسار: src/lib/api/ai.ts

import { api } from './client';

// --- جلب التوصيات المخصصة ---
export const getRecommendations = async (params?: {
  limit?: number;
  type?: 'listings' | 'services' | 'transport';
}) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any[];
    }>('/ai/recommendations', { params });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب التوصيات');
  } catch (error) {
    throw error;
  }
};

// --- جلب إعلانات مشابهة ---
export const getSimilarListings = async (listingId: string, limit?: number) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any[];
    }>('/ai/similar', { params: { listingId, limit } });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب الإعلانات المشابهة');
  } catch (error) {
    throw error;
  }
};

// --- جلب اقتراحات البحث الذكية ---
export const getSearchSuggestions = async (query: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: string[];
    }>('/ai/suggestions', { params: { q: query } });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب الاقتراحات');
  } catch (error) {
    throw error;
  }
};

// --- الإبلاغ عن احتيال ---
export const reportFraud = async (data: {
  targetId: string;
  targetType: 'listing' | 'user' | 'company';
  reason: string;
  description: string;
}) => {
  try {
    const response = await api.post<{
      success: boolean;
      message: string;
    }>('/ai/report-fraud', data);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل الإبلاغ');
  } catch (error) {
    throw error;
  }
};