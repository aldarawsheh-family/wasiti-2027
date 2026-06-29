// المسار: src/features/listings/images/upload.ts

import apiClient from '@/lib/api/client';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await apiClient.post('/listings/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data?.url || '';
}

export const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file));
  return Promise.all(uploadPromises);
};