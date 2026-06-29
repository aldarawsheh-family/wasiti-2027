// WASITI 2027 — دوال التحقق من صحة البيانات (Validation)
// المسار: src/lib/security/validation.ts

// --- التحقق من صحة البريد الإلكتروني ---
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// --- التحقق من قوة كلمة المرور ---
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// --- التحقق من صحة رقم الهاتف ---
export const validatePhone = (phone: string): boolean => {
  // دعم الأرقام السورية والدولية
  const phoneRegex = /^(\+963|0)[1-9][0-9]{8}$/;
  return phoneRegex.test(phone);
};

// --- التحقق من صحة الرابط (URL) ---
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// --- تنظيف المدخلات من النصوص الضارة (XSS) ---
export const sanitizeInput = (input: string): string => {
  // تحويل الأحرف الخاصة إلى كيانات HTML
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (s) => map[s]);
};

// --- التحقق من صحة نموذج الإعلان ---
export const validateListingForm = (data: {
  title: string;
  description: string;
  price: number;
  city: string;
  category: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.title || data.title.trim().length < 5) {
    errors.title = 'العنوان يجب أن يكون 5 أحرف على الأقل';
  }
  if (!data.description || data.description.trim().length < 20) {
    errors.description = 'الوصف يجب أن يكون 20 حرفاً على الأقل';
  }
  if (!data.price || data.price <= 0) {
    errors.price = 'السعر يجب أن يكون أكبر من صفر';
  }
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'المدينة مطلوبة';
  }
  if (!data.category) {
    errors.category = 'الفئة مطلوبة';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};