// WASITI 2027 — إعدادات أمان الرؤوس (Security Headers)
// المسار: src/lib/security/headers.ts

// --- الحصول على إعدادات رؤوس الأمان ---
export const getSecurityHeaders = (): Record<string, string> => {
  return {
    // سياسة أمان المحتوى (CSP)
    'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https:;
      connect-src 'self' https://api.wasiti.ly;
      frame-src 'self' https://www.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim(),

    // منع عرض الصفحة في إطار (حماية من Clickjacking)
    'X-Frame-Options': 'DENY',

    // منع المتصفح من تخمين نوع المحتوى
    'X-Content-Type-Options': 'nosniff',

    // فرض استخدام HTTPS (HSTS)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // منع المتصفح من إرسال المراجع (Referrer)
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // إعدادات أمان إضافية
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
};

// --- تطبيق رؤوس الأمان على الاستجابة ---
export const applySecurityHeaders = (headers: Headers): Headers => {
  const securityHeaders = getSecurityHeaders();
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  return headers;
};

// --- الحصول على رؤوس الأمان ككائن للاستخدام مع Next.js ---
export const getSecurityHeadersObject = (): Record<string, string> => {
  return getSecurityHeaders();
};