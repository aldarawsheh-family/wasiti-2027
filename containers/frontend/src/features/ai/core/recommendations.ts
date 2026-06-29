// WASITI 2027 — دوال التوصيات الذكية (AI Recommendations)
// المسار: src/lib/ai/recommendations.ts

import { getRecommendations, getSimilarListings } from '../api/ai';

// --- جلب توصيات مخصصة للمستخدم ---
export const getPersonalizedRecommendations = async (userId: string) => {
  try {
    const response = await getRecommendations({ limit: 10, type: 'listings' });
    return response || [];
  } catch (error) {
    console.error('فشل جلب التوصيات للمستخدم:', error);
    return [];
  }
};

// --- جلب إعلانات مشابهة لإعلان معين ---
export const getSimilarToListing = async (listingId: string) => {
  try {
    const response = await getSimilarListings(listingId, 6);
    return response || [];
  } catch (error) {
    console.error('فشل جلب الإعلانات المشابهة:', error);
    return [];
  }
};