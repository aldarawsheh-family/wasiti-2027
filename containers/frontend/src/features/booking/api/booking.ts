// WASITI 2027 â€” ط¯ظˆط§ظ„ ط§ظ„ط­ط¬ظˆط²ط§طھ (Booking API)
// ط§ظ„ظ…ط³ط§ط±: src/lib/api/booking.ts

import { api } from '@/lib/api/client';

// --- ط¬ظ„ط¨ ظ‚ط§ط¦ظ…ط© ط§ظ„ط®ط¯ظ…ط§طھ ---
export const getServices = async (params?: {
  type?: 'ظپظ†ط¯ظ‚' | 'ظ…ط·ط¹ظ…' | 'ط³ظپط±';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_low' | 'price_high' | 'rating';
}) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        type: string;
        name: string;
        location: string;
        price: number;
        rating: number;
        image: string;
        availability: string;
      }>;
    }>('/booking/services', { params });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„ط®ط¯ظ…ط§طھ');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط®ط¯ظ…ط© ---
export const getService = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/booking/services/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط§ظ„ط®ط¯ظ…ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط¥ظ†ط´ط§ط، ط­ط¬ط² ط¬ط¯ظٹط¯ ---
export const createReservation = async (data: {
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  guests: number;
  notes?: string;
}) => {
  try {
    const response = await api.post<{
      success: boolean;
      data: {
        reservationId: string;
      };
    }>('/booking/reservations', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¥ظ†ط´ط§ط، ط§ظ„ط­ط¬ط²');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط§ظ„ط­ط¬ط² ---
export const getReservation = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/booking/reservations/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط§ظ„ط­ط¬ط²');
  } catch (error) {
    throw error;
  }
};

// --- ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„طھظˆظپط± ---
export const getAvailability = async (serviceId: string, date: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: {
        available: boolean;
        availableSlots?: number;
      };
    }>(`/booking/services/${serviceId}/availability`, {
      params: { date },
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط§ظ„طھط­ظ‚ظ‚ ظ…ظ† ط§ظ„طھظˆظپط±');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ ط§ظ„ط®طµظˆظ…ط§طھ ---
export const getDiscounts = async (serviceId?: string) => {
  try {
    const url = serviceId ? `/booking/discounts?serviceId=${serviceId}` : '/booking/discounts';
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        code: string;
        description: string;
        discount: number;
        expiresAt: string;
      }>;
    }>(url);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„ط®طµظˆظ…ط§طھ');
  } catch (error) {
    throw error;
  }
};