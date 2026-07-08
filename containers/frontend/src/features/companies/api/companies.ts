// WASITI 2027 â€” ط¯ظˆط§ظ„ ط§ظ„ط´ط±ظƒط§طھ (Companies API)
// ط§ظ„ظ…ط³ط§ط±: src/lib/api/companies.ts

import { api } from '@/lib/api/client';

// --- ط¬ظ„ط¨ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط´ط±ظƒط© ---
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
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط¨ظٹط§ظ†ط§طھ ط§ظ„ط´ط±ظƒط©');
  } catch (error) {
    throw error;
  }
};

// --- طھط­ط¯ظٹط« ظ…ط¹ظ„ظˆظ…ط§طھ ط§ظ„ط´ط±ظƒط© ---
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
    throw new Error('ظپط´ظ„ طھط­ط¯ظٹط« ط§ظ„ط´ط±ظƒط©');
  } catch (error) {
    throw error;
  }
};

// --- ط¬ظ„ط¨ ظ‚ط§ط¦ظ…ط© ط£ط¹ط¶ط§ط، ط§ظ„ط´ط±ظƒط© ---
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
    throw new Error('ظپط´ظ„ ط¬ظ„ط¨ ط§ظ„ط£ط¹ط¶ط§ط،');
  } catch (error) {
    throw error;
  }
};

// --- ط¯ط¹ظˆط© ط¹ط¶ظˆ ط¬ط¯ظٹط¯ ---
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
    throw new Error('ظپط´ظ„ ط¥ط±ط³ط§ظ„ ط§ظ„ط¯ط¹ظˆط©');
  } catch (error) {
    throw error;
  }
};

// --- ط­ط°ظپ ط¹ط¶ظˆ ظ…ظ† ط§ظ„ط´ط±ظƒط© ---
export const removeMember = async (id: string) => {
  try {
    const response = await api.delete<{
      success: boolean;
      message: string;
    }>(`/companies/members/${id}`);
    
    if (response.data.success) {
      return response.data;
    }
    throw new Error('ظپط´ظ„ ط­ط°ظپ ط§ظ„ط¹ط¶ظˆ');
  } catch (error) {
    throw error;
  }
};

// --- طھط­ط¯ظٹط« ط¯ظˆط± ط¹ط¶ظˆ ---
export const updateMemberRole = async (id: string, role: string) => {
  try {
    const response = await api.put<{
      success: boolean;
      data: any;
    }>(`/companies/members/${id}`, { role });
    
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('ظپط´ظ„ طھط­ط¯ظٹط« ط¯ظˆط± ط§ظ„ط¹ط¶ظˆ');
  } catch (error) {
    throw error;
  }
};