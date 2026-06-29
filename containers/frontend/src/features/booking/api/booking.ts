// WASITI 2027 — دوال الحجوزات (Booking API)
// المسار: src/lib/api/booking.ts

import { api } from './client';

// --- جلب قائمة الخدمات ---
export const getServices = async (params?: {
  type?: 'فندق' | 'مطعم' | 'سفر';
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
    throw new Error('فشل جلب الخدمات');
  } catch (error) {
    throw error;
  }
};

// --- جلب تفاصيل خدمة ---
export const getService = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/booking/services/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب تفاصيل الخدمة');
  } catch (error) {
    throw error;
  }
};

// --- إنشاء حجز جديد ---
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
    throw new Error('فشل إنشاء الحجز');
  } catch (error) {
    throw error;
  }
};

// --- جلب تفاصيل الحجز ---
export const getReservation = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/booking/reservations/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب تفاصيل الحجز');
  } catch (error) {
    throw error;
  }
};

// --- التحقق من التوفر ---
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
    throw new Error('فشل التحقق من التوفر');
  } catch (error) {
    throw error;
  }
};

// --- جلب الخصومات ---
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
    throw new Error('فشل جلب الخصومات');
  } catch (error) {
    throw error;
  }
};