'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { getListings } from '@/features/listings/api/listings';
import Skeleton from '@/components/ui/Skeleton';
import { PlusSquare, Package, TrendingUp, Eye } from 'lucide-react';

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
        <div className="w-16 h-16 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">إعلاناتي</h2>
          <p className="text-gray-500 text-sm mt-1">إدارة إعلاناتك ومتابعة أدائها</p>
        </div>
        <Link href="/ar/publish">
          <button className="flex items-center gap-2 bg-[#128C4F] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition shadow-lg shadow-[#128C4F]/20">
            <PlusSquare size={18} />
            نشر إعلان جديد
          </button>
        </Link>
      </div>

      {/* Loading */}
      {listingsLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} height="100px" className="rounded-2xl" />)}
        </div>
      )}

      {/* Empty State */}
      {!listingsLoading && myListings.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
            <Package size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium mb-2">ليس لديك أي إعلانات بعد</p>
          <Link href="/ar/publish" className="text-[#128C4F] hover:underline text-sm font-semibold">انشر إعلانك الأول</Link>
        </div>
      )}

      {/* Listings */}
      {!listingsLoading && myListings.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {myListings.map((item) => (
            <Link key={item.id} href={`/ar/listing/${item.id}`}
              className="bg-white rounded-2xl border border-gray-100 hover:border-[#128C4F]/30 hover:shadow-md transition-all flex items-stretch overflow-hidden group">
              <div className="w-[100px] h-[100px] shrink-0 bg-gray-100 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <Package size={36} className="text-gray-300" />
                )}
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="text-gray-900 font-bold text-sm truncate max-w-[60%]">{item.title}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.status || 'نشط'}
                  </span>
                </div>
                <div className="flex justify-between items-end text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1">📍 {item.city}</span>
                  <span className="font-bold text-gray-700">{Number(item.price).toLocaleString()} ل.س</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Stats Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#128C4F]/10 to-emerald-50 flex items-center justify-center">
            <TrendingUp size={20} className="text-[#128C4F]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">إحصائيات حسابك</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-gray-900">{myListings.length}</p>
            <p className="text-xs text-gray-400 mt-1">إعلان</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Eye size={16} className="text-gray-400" />
              <p className="text-2xl font-extrabold text-gray-900">0</p>
            </div>
            <p className="text-xs text-gray-400 mt-1">مشاهدة</p>
          </div>
        </div>
        <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition">
          عرض التفاصيل الكاملة
        </button>
      </div>
    </div>
  );
}