// WASITI 2027 — دوال اقتراحات البحث (Search Suggestions)
// المسار: src/lib/ai/search-suggestions.ts

import { getSearchSuggestions as apiGetSuggestions } from '../api/ai';

// --- جلب اقتراحات بحث ذكية بناءً على النص المدخل ---
export const getSearchSuggestions = async (query: string) => {
  try {
    const response = await apiGetSuggestions(query);
    return response || [];
  } catch (error) {
    console.error('فشل جلب اقتراحات البحث:', error);
    return [];
  }
};

// --- جلب عمليات البحث الرائجة (Trending) ---
export const getTrendingSearches = async () => {
  try {
    // ملاحظة: هذه الدالة تحتاج إلى نقطة نهاية (Endpoint) مخصصة في الـ AI API.
    // حالياً سنقوم بمحاكاة البيانات لأننا لا نعرف إذا كانت الخدمة تدعمها.
    
    // محاكاة (للاستخدام التجريبي فقط)
    const mockTrending = [
      'سيارة تويوتا',
      'شقق للبيع دمشق',
      'هاتف آيفون',
      'عقارات حلب',
      'خدمات تصميم مواقع',
      'سيارات مستعملة',
      'فنادق دمشق',
    ];
    
    return mockTrending;
  } catch (error) {
    console.error('فشل جلب عمليات البحث الرائجة:', error);
    return [];
  }
};