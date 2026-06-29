// WASITI 2027 — دوال تحديد معدل الطلبات (Rate Limiting)
// المسار: src/lib/security/rate-limit.ts

// تخزين محاولات الطلبات في الذاكرة (للاستخدام التجريبي)
// في بيئة الإنتاج، يجب استخدام Redis أو تخزين خارجي
const rateLimitStore = new Map<string, { attempts: number; firstAttempt: number }>();

// --- التحقق من معدل الطلبات ---
export const checkRateLimit = (
  key: string,
  maxAttempts: number = 5,
  windowSeconds: number = 60
): { allowed: boolean; remaining: number; resetIn: number } => {
  const now = Math.floor(Date.now() / 1000);
  
  // إذا لم يكن هناك سجل لهذا المفتاح، قم بإنشائه
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { attempts: 0, firstAttempt: now });
  }

  const record = rateLimitStore.get(key)!;

  // التحقق من انتهاء النافذة الزمنية
  if (now - record.firstAttempt > windowSeconds) {
    // إعادة تعيين المحاولات
    rateLimitStore.set(key, { attempts: 0, firstAttempt: now });
    record.attempts = 0;
    record.firstAttempt = now;
  }

  // زيادة عدد المحاولات
  record.attempts += 1;

  // التحقق من تجاوز الحد الأقصى
  const allowed = record.attempts <= maxAttempts;
  const remaining = Math.max(0, maxAttempts - record.attempts);
  const resetIn = Math.max(0, (record.firstAttempt + windowSeconds) - now);

  return {
    allowed,
    remaining,
    resetIn,
  };
};

// --- إعادة تعيين معدل الطلبات لمفتاح معين ---
export const resetRateLimit = (key: string): boolean => {
  try {
    rateLimitStore.delete(key);
    return true;
  } catch (error) {
    console.error('فشل إعادة تعيين معدل الطلبات:', error);
    return false;
  }
};

// --- تنظيف الذاكرة من السجلات المنتهية (اختياري) ---
export const cleanExpiredRateLimits = (windowSeconds: number = 60): void => {
  const now = Math.floor(Date.now() / 1000);
  for (const [key, record] of rateLimitStore.entries()) {
    if (now - record.firstAttempt > windowSeconds) {
      rateLimitStore.delete(key);
    }
  }
};