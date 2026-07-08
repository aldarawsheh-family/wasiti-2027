// WASITI 2027 â€” ط¯ظˆط§ظ„ ط§ظ„ط¨ط­ط« (Search API)
// ط§ظ„ظ…ط³ط§ط±: src/lib/api/search.ts

import { api } from '@/lib/api/client';

// --- طھظ†ظپظٹط° ط§ظ„ط¨ط­ط« ط§ظ„ظ…طھظ‚ط¯ظ… ---
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
    throw new Error('ظپط´ظ„ طھظ†ظپظٹط° ط§ظ„ط¨ط­ط«');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ ط§ظ‚طھط±ط§ط­ط§طھ ط§ظ„ط¨ط­ط« (ظ„ظ„ظ…ط±ط¨ط¹ ط§ظ„طھظ„ظ‚ط§ط¦ظٹ) ---
export const getSuggestions = async (query: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: string[];
    }>('/search/suggestions', { params: { q: query } });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„ط§ظ‚طھط±ط§ط­ط§طھ');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ ظ‚ط§ط¦ظ…ط© ط¹ظ…ظ„ظٹط§طھ ط§ظ„ط¨ط­ط« ط§ظ„ظ…ط­ظپظˆط¸ط© ---
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
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط¹ظ…ظ„ظٹط§طھ ط§ظ„ط¨ط­ط« ط§ظ„ظ…ط­ظپظˆط¸ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط­ظپط¸ ط¹ظ…ظ„ظٹط© ط¨ط­ط« ---
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
    throw new Error('ظپط´ظ„ ط­ظپط¸ ط§ظ„ط¨ط­ط«');
  } catch (error) {
    throw error;
  }
};

// --- ط­ط°ظپ ط¹ظ…ظ„ظٹط© ط¨ط­ط« ظ…ط­ظپظˆط¸ط© ---
export const deleteSavedSearch = async (id: string) => {
  try {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/search/saved/${id}`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('ظپط´ظ„ ط­ط°ظپ ط§ظ„ط¨ط­ط« ط§ظ„ظ…ط­ظپظˆط¸');
  } catch (error) {
    throw error;
  }
};