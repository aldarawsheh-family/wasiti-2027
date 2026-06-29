// WASITI 2027 — دوال إدارة JWT (Security)
// المسار: src/lib/security/jwt.ts

import { jwtVerify, SignJWT } from 'jose';

// مفتاح التشفير (يجب أن يكون في متغيرات البيئة)
const JWT_SECRET = process.env.JWT_SECRET || 'wasiti-secret-key-2027';
const JWT_ENCODER = new TextEncoder().encode(JWT_SECRET);

// --- تخزين التوكن في localStorage ---
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// --- جلب التوكن من localStorage ---
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// --- حذف التوكن ---
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
};

// --- التحقق من انتهاء صلاحية التوكن ---
export const isTokenExpired = async (token: string): Promise<boolean> => {
  try {
    const { payload } = await jwtVerify(token, JWT_ENCODER);
    const exp = payload.exp as number;
    if (!exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  } catch (error) {
    console.error('فشل التحقق من صلاحية التوكن:', error);
    return true;
  }
};

// --- استخراج معرف المستخدم من التوكن ---
export const getUserIdFromToken = async (token: string): Promise<string | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_ENCODER);
    return (payload.sub as string) || null;
  } catch (error) {
    console.error('فشل استخراج معرف المستخدم:', error);
    return null;
  }
};

// --- إنشاء توكن جديد (للاستخدام في الخادم) ---
export const createToken = async (payload: Record<string, any>, expiresIn = '1d') => {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(expiresIn)
      .sign(JWT_ENCODER);
    return token;
  } catch (error) {
    console.error('فشل إنشاء التوكن:', error);
    return null;
  }
};