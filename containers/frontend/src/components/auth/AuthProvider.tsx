'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, refresh, logout, user } = useAuthStore();
  const router = useRouter();
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);
  const expiryTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    // فك تشفير JWT لمعرفة وقت الانتهاء
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiryTime = payload.exp * 1000; // milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;

      // جدد التوكين قبل ما ينتهي بـ 5 دقائق
      const refreshTime = timeUntilExpiry - 5 * 60 * 1000;

      if (refreshTime > 0) {
        refreshTimer.current = setTimeout(async () => {
          try {
            await refresh();
          } catch {
            // فشل التجديد — سجل خروج
            await logout();
            router.push('/auth/login');
          }
        }, refreshTime);
      }

      // لو انتهى — سجل خروج تلقائي
      if (timeUntilExpiry > 0) {
        expiryTimer.current = setTimeout(async () => {
          await logout();
          router.push('/auth/login');
        }, timeUntilExpiry);
      } else {
        // التوكين منتهي — سجل خروج الآن
        logout();
        router.push('/auth/login');
      }
    } catch {}

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      if (expiryTimer.current) clearTimeout(expiryTimer.current);
    };
  }, [accessToken]);

  return <>{children}</>;
}