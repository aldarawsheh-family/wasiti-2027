// WASITI 2027 — دوال الإعلانات (Listings API)
// المسار: src/features/listings/api/listings.ts

import { api } from '../../../lib/api/client';

// --- جلب قائمة الإعلانات ---
export const getListings = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_low' | 'price_high';
  search?: string;
}) => {
  try {
    const response = await api.get('/listings', { params });
    const data: any = response.data;
    if (Array.isArray(data)) return data;
    if (data?.success) return data.data || data;
    return data || [];
  } catch (error) {
    throw error;
  }
};

// --- جلب تفاصيل إعلان واحد ---
export const getListing = async (id: string) => {
  try {
    const response = await api.get(`/listings/${id}`);
    const data: any = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

// --- إنشاء إعلان جديد ---
export const createListing = async (data: {
  title: string;
  category: string;
  price: number;
  city: string;
  description: string;
  imageUrl?: string;
  images?: File[];
}) => {
  try {
    if (!data.images || data.images.length === 0) {
      const response = await api.post('/listings', {
        title: data.title,
        category: data.category,
        price: data.price,
        city: data.city,
        description: data.description,
        image: data.imageUrl,
      });
      return (response.data as any);
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('price', String(data.price));
    formData.append('city', data.city);
    formData.append('description', data.description);
    data.images.forEach((file) => formData.append('images', file));
    
    const response = await api.post('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return (response.data as any);
  } catch (error) {
    throw error;
  }
};

// --- تحديث إعلان موجود ---
export const updateListing = async (id: string, data: {
  title?: string;
  category?: string;
  price?: number;
  city?: string;
  description?: string;
  images?: File[];
}) => {
  try {
    const response = await api.put(`/listings/${id}`, {
      title: data.title,
      category: data.category,
      price: data.price,
      city: data.city,
      description: data.description,
    });
    return (response.data as any);
  } catch (error) {
    throw error;
  }
};

// --- حذف إعلان ---
export const deleteListing = async (id: string) => {
  try {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/listings/${id}`);
    
    const resData = response.data as any;
    if (resData?.success) {
      return resData;
    }
    throw new Error('فشل حذف الإعلان');
  } catch (error) {
    throw error;
  }
};

// --- رفع صورة للإعلان ---
export const uploadImage = async (id: string, file: File) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post<{
      success: boolean;
      data: { url: string };
    }>(`/listings/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const resData = response.data as any;
    if (resData?.success) {
      return resData.data;
    }
    throw new Error('فشل رفع الصورة');
  } catch (error) {
    throw error;
  }
};

// --- جلب قائمة الفئات ---
export const getCategories = async () => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{ id: string; name: string }>;
    }>('/listings/categories');
    
    const resData = response.data as any;
    if (resData?.success) {
      return resData.data;
    }
    throw new Error('فشل جلب الفئات');
  } catch (error) {
    throw error;
  }
};