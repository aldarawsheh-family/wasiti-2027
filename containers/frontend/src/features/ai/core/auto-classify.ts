// WASITI 2027 — دوال التصنيف التلقائي (Auto Classify)
// المسار: src/lib/ai/auto-classify.ts

import { getSearchSuggestions } from '../api/ai';

// --- تصنيف إعلان تلقائياً بناءً على العنوان والوصف ---
export const classifyListing = async (title: string, description: string) => {
  try {
    // ملاحظة: هذه الدالة تحتاج إلى نقطة نهاية (Endpoint) مخصصة في الـ AI API.
    // حالياً سنقوم بمحاكاة المنطق لأننا لا نعرف إذا كانت الخدمة تدعمها.
    
    const combinedText = `${title} ${description}`.toLowerCase();
    
    // محاكاة منطق بسيط للتصنيف (للاستخدام التجريبي فقط)
    if (combinedText.includes('سيارة') || combinedText.includes('مركبة') || combinedText.includes('تويوتا')) {
      return { category: 'سيارات', confidence: 0.85 };
    }
    if (combinedText.includes('شقة') || combinedText.includes('منزل') || combinedText.includes('عقار') || combinedText.includes('مزرعة')) {
      return { category: 'عقارات', confidence: 0.90 };
    }
    if (combinedText.includes('هاتف') || combinedText.includes('موبايل') || combinedText.includes('آيفون') || combinedText.includes('سامسونج')) {
      return { category: 'موبايلات', confidence: 0.88 };
    }
    if (combinedText.includes('خدمة') || combinedText.includes('تصميم') || combinedText.includes('تطوير') || combinedText.includes('استشارة')) {
      return { category: 'خدمات', confidence: 0.75 };
    }
    
    // إذا لم يتم التعرف على الفئة
    return { category: 'أخرى', confidence: 0.30 };
  } catch (error) {
    console.error('فشل تصنيف الإعلان:', error);
    return { category: 'أخرى', confidence: 0 };
  }
};

// --- اقتراح فئة بناءً على النص المدخل ---
export const suggestCategory = async (text: string) => {
  try {
    // استخدام API الاقتراحات للحصول على كلمات مفتاحية
    const suggestions = await getSearchSuggestions(text);
    
    // محاكاة اقتراح الفئة بناءً على النص
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('سيارة') || lowerText.includes('مركبة')) {
      return { suggestedCategory: 'سيارات', keywords: suggestions.slice(0, 5) };
    }
    if (lowerText.includes('شقة') || lowerText.includes('منزل') || lowerText.includes('عقار')) {
      return { suggestedCategory: 'عقارات', keywords: suggestions.slice(0, 5) };
    }
    if (lowerText.includes('هاتف') || lowerText.includes('موبايل')) {
      return { suggestedCategory: 'موبايلات', keywords: suggestions.slice(0, 5) };
    }
    if (lowerText.includes('خدمة') || lowerText.includes('تصميم')) {
      return { suggestedCategory: 'خدمات', keywords: suggestions.slice(0, 5) };
    }
    
    return { suggestedCategory: 'أخرى', keywords: suggestions.slice(0, 3) };
  } catch (error) {
    console.error('فشل اقتراح الفئة:', error);
    return { suggestedCategory: 'أخرى', keywords: [] };
  }
};