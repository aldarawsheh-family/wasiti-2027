// WASITI 2027 — دوال النقل (Transport API)
// المسار: src/lib/api/transport.ts

import { api } from './client';

// --- جلب قائمة الرحلات ---
export const getTrips = async (params?: {
  from?: string;
  to?: string;
  date?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_low' | 'price_high';
}) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        route: string;
        time: string;
        date: string;
        price: number;
        totalSeats: number;
        availableSeats: number;
        status: 'متاح' | 'مكتمل' | 'ملغي';
        company: string;
      }>;
      total: number;
    }>('/transport/trips', { params });
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل جلب الرحلات');
  } catch (error) {
    throw error;
  }
};

// --- جلب تفاصيل رحلة ---
export const getTrip = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/transport/trips/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب تفاصيل الرحلة');
  } catch (error) {
    throw error;
  }
};

// --- إنشاء حجز جديد ---
export const createBooking = async (data: {
  tripId: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  seatNumber: number;
  classType: 'economy' | 'first';
}) => {
  try {
    const response = await api.post<{
      success: boolean;
      data: {
        bookingId: string;
        ticketId: string;
      };
    }>('/transport/bookings', data);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل إنشاء الحجز');
  } catch (error) {
    throw error;
  }
};

// --- جلب تفاصيل الحجز ---
export const getBooking = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/transport/bookings/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب تفاصيل الحجز');
  } catch (error) {
    throw error;
  }
};

// --- جلب بيانات التذكرة ---
export const getTicket = async (bookingId: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/transport/tickets/${bookingId}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب التذكرة');
  } catch (error) {
    throw error;
  }
};

// --- البحث عن مسارات ---
export const searchRoutes = async (params: {
  from: string;
  to: string;
  date: string;
}) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        route: string;
        time: string;
        price: number;
        availableSeats: number;
      }>;
    }>('/transport/routes/search', { params });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل البحث عن المسارات');
  } catch (error) {
    throw error;
  }
};