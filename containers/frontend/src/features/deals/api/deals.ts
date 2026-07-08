// WASITI 2027 â€” ط¯ظˆط§ظ„ ط§ظ„طµظپظ‚ط§طھ (Deals API)
// ط§ظ„ظ…ط³ط§ط±: src/lib/api/deals.ts

import { api } from '@/lib/api/client';

// --- ط¬ظ„ط¨ ظ‚ط§ط¦ظ…ط© ط§ظ„طµظپظ‚ط§طھ ---
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
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„طµظپظ‚ط§طھ');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ طھظپط§طµظٹظ„ طµظپظ‚ط© ---
export const getDeal = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/deals/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط§ظ„طµظپظ‚ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط¥ظ†ط´ط§ط، طµظپظ‚ط© ط¬ط¯ظٹط¯ط© ---
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
    throw new Error('ظپط´ظ„ ط¥ظ†ط´ط§ط، ط§ظ„طµظپظ‚ط©');
  } catch (error) {
    throw error;
  }
};

// --- ظ‚ط¨ظˆظ„ ط§ظ„طµظپظ‚ط© ---
export const acceptDeal = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/deals/${id}/accept`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ظ‚ط¨ظˆظ„ ط§ظ„طµظپظ‚ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط±ظپط¶ ط§ظ„طµظپظ‚ط© ---
export const rejectDeal = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/deals/${id}/reject`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط±ظپط¶ ط§ظ„طµظپظ‚ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط¥ظƒظ…ط§ظ„ ط§ظ„طµظپظ‚ط© ---
export const completeDeal = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/deals/${id}/complete`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¥ظƒظ…ط§ظ„ ط§ظ„طµظپظ‚ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط¥ظ„ط؛ط§ط، ط§ظ„طµظپظ‚ط© ---
export const cancelDeal = async (id: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/deals/${id}/cancel`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¥ظ„ط؛ط§ط، ط§ظ„طµظپظ‚ط©');
  } catch (error) {
    throw error;
  }
};