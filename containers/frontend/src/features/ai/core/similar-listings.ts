// WASITI 2027 — دوال الإعلانات المشابهة والمتصفحة معاً (Similar & Also Viewed)
// المسار: src/lib/ai/similar-listings.ts

import { getSimilarListings } from '../api/ai';

// --- جلب إعلانات مشابهة لإعلان معين ---
export const getSimilar = async (listingId: string) => {
  try {
    const response = await getSimilarListings(listingId, 6);
    return response || [];
  } catch (error) {
    console.error('فشل جلب الإعلانات المشابهة:', error);
    return [];
  }
};

// --- جلب إعلانات شاهدها نفس المستخدمين معاً (للتوصيات التكميلية) ---
export const getAlsoViewed = async (listingId: string) => {
  try {
    // ملاحظة: هذه الدالة تحتاج إلى نقطة نهاية (Endpoint) مخصصة في الـ AI API.
    // حالياً سنقوم بمحاكاة البيانات لأننا لا نعرف إذا كانت الخدمة تدعمها.
    
    // محاكاة (للاستخدام التجريبي فقط)
    const mockAlsoViewed = [
      {
        id: 'sim-1',
        title: 'سيارة تويوتا كامري 2019',
        price: 18000,
        city: 'دمشق',
        image: 'https://placehold.co/600x400/111a20/ffffff?text=كامري',
      },
      {
        id: 'sim-2',
        title: 'سيارة هوندا أكورد 2021',
        price: 22000,
        city: 'حلب',
        image: 'https://placehold.co/600x400/111a20/ffffff?text=أكورد',
      },
    ];
    
    return mockAlsoViewed;
  } catch (error) {
    console.error('فشل جلب الإعلانات المتصفحة معاً:', error);
    return [];
  }
};