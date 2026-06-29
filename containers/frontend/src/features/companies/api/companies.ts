// WASITI 2027 — دوال الشركات (Companies API)
// المسار: src/lib/api/companies.ts

import { api } from './client';

// --- جلب بيانات الشركة ---
export const getCompany = async (id?: string) => {
  try {
    const url = id ? `/companies/${id}` : '/companies';
    const response = await api.get<{
      success: boolean;
      data: {
        id: string;
        name: string;
        description: string;
        logo?: string;
        founded?: string;
        stats: {
          listings: number;
          members: number;
          rating: number;
        };
      };
    }>(url);
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب بيانات الشركة');
  } catch (error) {
    throw error;
  }
};

// --- تحديث معلومات الشركة ---
export const updateCompany = async (data: {
  name?: string;
  description?: string;
  logo?: File;
}) => {
  try {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.logo) formData.append('logo', data.logo);
    
    const response = await api.put<{
      success: boolean;
      data: any;
    }>('/companies', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل تحديث الشركة');
  } catch (error) {
    throw error;
  }
};

// --- جلب قائمة أعضاء الشركة ---
export const getMembers = async () => {
  try {
    const response = await api.get<{
      success: boolean;
      data: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        joined: string;
        avatar?: string;
      }>;
    }>('/companies/members');
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل جلب الأعضاء');
  } catch (error) {
    throw error;
  }
};

// --- دعوة عضو جديد ---
export const inviteMember = async (data: {
  email: string;
  role: string;
}) => {
  try {
    const response = await api.post<{
      success: boolean;
      message: string;
    }>('/companies/members/invite', data);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل إرسال الدعوة');
  } catch (error) {
    throw error;
  }
};

// --- حذف عضو من الشركة ---
export const removeMember = async (id: string) => {
  try {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/companies/members/${id}`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('فشل حذف العضو');
  } catch (error) {
    throw error;
  }
};

// --- تحديث دور عضو ---
export const updateMemberRole = async (id: string, role: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/companies/members/${id}`, { role });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('فشل تحديث دور العضو');
  } catch (error) {
    throw error;
  }
};