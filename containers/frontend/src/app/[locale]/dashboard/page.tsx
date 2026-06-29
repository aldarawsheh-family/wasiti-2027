'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { getListings } from '@/features/listings/api/listings';
import Skeleton from '@/components/ui/Skeleton';
import { PlusSquare } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [myListings, setMyListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/ar');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getListings({ limit: 100 })
        .then((res: any) => {
          let list = res?.data || res;
          if (!Array.isArray(list) && list?.data) list = list.data;
          if (!Array.isArray(list)) list = [];
          setMyListings(list.filter((item: any) => item.owner_id === user.id));
        })
        .catch(() => {})
        .finally(() => setListingsLoading(false));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'مستخدم';

  return (
    <div className="space-y-6 mt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-white">لوحة التحكم</h1>
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <span className="text-sm">مرحباً، {displayName}</span>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center text-[10px] font-bold text-black">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[var(--color-primary)] rounded-full shadow-[var(--shadow-neon)]"></span>
            إعلاناتي
          </h2>
          <Link href="/ar/publish">
            <Button variant="primary" size="sm"><PlusSquare size={14} /> نشر إعلان جديد</Button>
          </Link>
        </div>

        {listingsLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} height="100px" className="rounded-2xl" />)}
          </div>
        )}

        {!listingsLoading && myListings.length === 0 && (
          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-8 text-center">
            <p className="text-[var(--text-secondary)] mb-4">ليس لديك أي إعلانات بعد</p>
            <Link href="/ar/publish" className="text-[var(--color-primary)] hover:underline text-sm">انشر إعلانك الأول</Link>
          </div>
        )}

        {!listingsLoading && myListings.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {myListings.map((item) => (
              <Link key={item.id} href={`/ar/listing/${item.id}`}
                className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all flex items-stretch">
                <div className="w-[100px] h-[100px] shrink-0 relative bg-black/30">
                  {item.image ? <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl">📷</span></div>}
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-white font-bold text-[14px] truncate max-w-[60%]">{item.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[var(--color-success)] bg-[var(--color-success)]/10 border border-[var(--color-success)]/30">
                      {item.status || 'نشط'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end text-[11px] text-[var(--text-secondary)]">
                    <span>📍 {item.city}</span>
                    <span>{Number(item.price).toLocaleString()} ل.س</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 flex flex-col items-center justify-center text-center h-[200px]">
        <h3 className="text-[var(--text-secondary)] font-medium mb-2">إحصائيات حسابك</h3>
        <p className="text-[var(--text-secondary)] text-sm max-w-[200px]">تابع أداء إعلاناتك وإحصائيات الزوار هنا.</p>
        <button className="mt-4 bg-white/5 hover:bg-white/10 text-white px-6 py-1.5 rounded-full text-sm transition-colors border border-[var(--border-color)]">عرض التفاصيل</button>
      </div>
    </div>
  );
}