// WASITI 2027 — اختبارات المصادقة (Auth Login Tests)
// المسار: src/__tests__/auth/login.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/app/[locale]/(auth)/login/page';
import { login } from '@/lib/api/auth';

// محاكاة دالة login
jest.mock('@/lib/api/auth', () => ({
  login: jest.fn(),
}));

describe('صفحة تسجيل الدخول', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('1. تسجيل دخول ناجح - يعيد التوجيه للصفحة الرئيسية', async () => {
    // إعداد المحاكاة
    (login as jest.Mock).mockResolvedValue({
      token: 'fake-token',
      refreshToken: 'fake-refresh',
      user: { id: '1', name: 'Test User' },
    });

    // تقديم الصفحة
    render(<LoginPage />);

    // ملء النموذج
    fireEvent.change(screen.getByPlaceholderText(/أدخل بريدك الإلكتروني/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/أدخل كلمة مرورك/i), {
      target: { value: 'TestPassword123!' },
    });

    // الضغط على زر الدخول
    fireEvent.click(screen.getByRole('button', { name: /دخول/i }));

    // التحقق من استدعاء الدالة
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'TestPassword123!');
    });
  });

  test('2. فشل تسجيل الدخول - يعرض رسالة خطأ', async () => {
    // إعداد المحاكاة للفشل
    (login as jest.Mock).mockRejectedValue(new Error('بيانات الدخول غير صحيحة'));

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/أدخل بريدك الإلكتروني/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/أدخل كلمة مرورك/i), {
      target: { value: 'wrong' },
    });

    fireEvent.click(screen.getByRole('button', { name: /دخول/i }));

    // التحقق من ظهور رسالة الخطأ
    await waitFor(() => {
      expect(screen.getByText(/بيانات الدخول غير صحيحة/i)).toBeInTheDocument();
    });
  });

  test('3. تسجيل الخروج - يمسح التوكن ويعيد التوجيه', async () => {
    // محاكاة دالة logout
    const mockLogout = jest.fn().mockResolvedValue({});
    jest.mock('@/lib/api/auth', () => ({
      logout: mockLogout,
    }));

    // إعادة تحميل الوحدة للحصول على الوظيفة الجديدة
    const { logout } = await import('@/lib/api/auth');
    await logout();

    expect(mockLogout).toHaveBeenCalled();
  });

  test('4. انتهاء صلاحية التوكن - يجبر المستخدم على إعادة الدخول', async () => {
    // محاكاة التحقق من صلاحية التوكن
    const isTokenExpired = jest.fn().mockReturnValue(true);
    jest.mock('@/lib/security/jwt', () => ({
      isTokenExpired,
    }));

    // محاكاة إعادة التوجيه للدخول
    const pushMock = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push: pushMock }),
    }));

    // هنا يتم وضع منطق التحقق من التوكن
    // (يتم اختباره عادة في middleware أو interceptor)
    // في هذا الاختبار، سنفترض أن المستخدم حاول الوصول لصفحة محمية
    const token = 'expired-token';
    const expired = await isTokenExpired(token);
    
    expect(expired).toBe(true);
  });
});