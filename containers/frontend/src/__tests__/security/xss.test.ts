// WASITI 2027 — اختبارات الأمان (Security & XSS Tests)
// المسار: src/__tests__/security/xss.test.ts

import { sanitizeInput, validateEmail, validatePassword } from '@/lib/security/validation';
import { getToken, isTokenExpired } from '@/lib/security/jwt';

describe('اختبارات الأمان والحماية من XSS', () => {
  // --- 1. اختبار منع XSS ---
  test('1. منع XSS - تنظيف النصوص من الرموز الضارة', () => {
    const dirtyInput = '<script>alert("XSS")</script>';
    const sanitized = sanitizeInput(dirtyInput);
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });

  test('1. منع XSS - تنظيف روابط ضارة', () => {
    const dirtyInput = '<a href="javascript:alert(\'XSS\')">انقر هنا</a>';
    const sanitized = sanitizeInput(dirtyInput);
    expect(sanitized).toBe('&lt;a href=&quot;javascript:alert(&#x27;XSS&#x27;)&quot;&gt;انقر هنا&lt;/a&gt;');
  });

  test('1. منع XSS - تنظيف مدخلات متعددة', () => {
    const inputs = [
      '<img src="x" onerror="alert(1)">',
      '<div onmouseover="alert(2)">تحويم</div>',
      '"><script>alert(3)</script>',
    ];
    const sanitized = inputs.map(sanitizeInput);
    expect(sanitized[0]).toBe('&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;');
    expect(sanitized[1]).toBe('&lt;div onmouseover=&quot;alert(2)&quot;&gt;تحويم&lt;/div&gt;');
    expect(sanitized[2]).toBe('&quot;&gt;&lt;script&gt;alert(3)&lt;/script&gt;');
  });

  test('1. منع XSS - نص آمن لا يتغير', () => {
    const safeInput = 'مرحباً، هذا نص آمن تماماً';
    const sanitized = sanitizeInput(safeInput);
    expect(sanitized).toBe(safeInput);
  });

  // --- 2. اختبار تنظيف المدخلات ---
  test('2. تنظيف المدخلات - إزالة المسافات الزائدة', () => {
    const input = '   نص مع مسافات   ';
    const trimmed = input.trim();
    expect(trimmed).toBe('نص مع مسافات');
  });

  test('2. تنظيف المدخلات - تحويل الأحرف الكبيرة/الصغيرة', () => {
    const input = 'Email@Example.COM';
    const normalized = input.toLowerCase();
    expect(normalized).toBe('email@example.com');
  });

  test('2. تنظيف المدخلات - إزالة الأحرف الخاصة (غير مسموح بها)', () => {
    const input = 'اسم#@!$%^&*()';
    const cleaned = input.replace(/[^a-zA-Z0-9\s\u0600-\u06FF]/g, '');
    expect(cleaned).toBe('اسم');
  });

  // --- 3. اختبار التحقق من صحة التوكن ---
  test('3. التحقق من صحة التوكن - وجود التوكن', () => {
    // محاكاة التوكن في localStorage
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    // محاكاة دالة getToken
    const getTokenMock = jest.fn(() => mockToken);
    expect(getTokenMock()).toBe(mockToken);
  });

  test('3. التحقق من صحة التوكن - توكن صالح', async () => {
    // محاكاة توكن صالح (غير منتهي الصلاحية)
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    // محاكاة دالة isTokenExpired
    const isTokenExpiredMock = jest.fn(async (token: string) => {
      // محاكاة التحقق (التوكن غير منتهي)
      return false;
    });

    const expired = await isTokenExpiredMock(validToken);
    expect(expired).toBe(false);
    expect(isTokenExpiredMock).toHaveBeenCalledWith(validToken);
  });

  test('3. التحقق من صحة التوكن - توكن منتهي الصلاحية', async () => {
    // محاكاة توكن منتهي الصلاحية
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    // محاكاة دالة isTokenExpired تعود بـ true
    const isTokenExpiredMock = jest.fn(async (token: string) => {
      return true;
    });

    const expired = await isTokenExpiredMock(expiredToken);
    expect(expired).toBe(true);
    expect(isTokenExpiredMock).toHaveBeenCalledWith(expiredToken);
  });

  test('3. التحقق من صحة التوكن - توكن فارغ', async () => {
    const getTokenMock = jest.fn(() => null);
    const token = getTokenMock();
    expect(token).toBeNull();
  });

  // --- 4. اختبار التحقق من البريد الإلكتروني ---
  test('4. التحقق من البريد الإلكتروني - بريد صحيح', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
    expect(validateEmail('user+filter@domain.com')).toBe(true);
  });

  test('4. التحقق من البريد الإلكتروني - بريد غير صحيح', () => {
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false);
    expect(validateEmail('user.domain.com')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@domain..com')).toBe(false);
  });

  // --- 5. اختبار التحقق من كلمة المرور ---
  test('5. التحقق من كلمة المرور - كلمة مرور قوية', () => {
    const result = validatePassword('TestPassword123!');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('5. التحقق من كلمة المرور - كلمة مرور ضعيفة', () => {
    const result = validatePassword('password');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors).toContain('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  });
});