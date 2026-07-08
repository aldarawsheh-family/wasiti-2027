// WASITI 2027 â€” ط¯ظˆط§ظ„ ط§ظ„ظ†ظ‚ظ„ (Transport API)
// ط§ظ„ظ…ط³ط§ط±: src/lib/api/transport.ts

import { api } from '@/lib/api/client';

// --- ط¬ظ„ط¨ ظ‚ط§ط¦ظ…ط© ط§ظ„ط±ط­ظ„ط§طھ ---
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
        status: 'ظ…طھط§ط­' | 'ظ…ظƒطھظ…ظ„' | 'ظ…ظ„ط؛ظٹ';
        company: string;
      }>;
      total: number;
    }>('/transport/trips', { params });
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„ط±ط­ظ„ط§طھ');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط±ط­ظ„ط© ---
export const getTrip = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/transport/trips/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط§ظ„ط±ط­ظ„ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط¥ظ†ط´ط§ط، ط­ط¬ط² ط¬ط¯ظٹط¯ ---
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
    throw new Error('ظپط´ظ„ ط¥ظ†ط´ط§ط، ط§ظ„ط­ط¬ط²');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط§ظ„ط­ط¬ط² ---
export const getBooking = async (id: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/transport/bookings/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ طھظپط§طµظٹظ„ ط§ظ„ط­ط¬ط²');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ ط¨ظٹط§ظ†ط§طھ ط§ظ„طھط°ظƒط±ط© ---
export const getTicket = async (bookingId: string) => {
  try {
    const response = await api.get<{
      success: boolean;
      data: any;
    }>(`/transport/tickets/${bookingId}`);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„طھط°ظƒط±ط©');
  } catch (error) {
    throw error;
  }
};

// --- ط§ظ„ط¨ط­ط« ط¹ظ† ظ…ط³ط§ط±ط§طھ ---
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
    throw new Error('ظپط´ظ„ ط§ظ„ط¨ط­ط« ط¹ظ† ط§ظ„ظ…ط³ط§ط±ط§طھ');
  } catch (error) {
    throw error;
  }
};