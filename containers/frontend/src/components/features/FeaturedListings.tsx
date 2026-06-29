'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getListings } from '@/features/listings/api/listings';
import { Heart, MapPin, ChevronLeft } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

export default function FeaturedListings({ className = '' }: { className?: string }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings({ limit: 4 })
      .then((res: any) => {
        const data = res?.data || res;
        const list = Array.isArray(data) ? data : data.data || [];
        setListings(list.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={className}>
      {/* العنوان */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">إعلانات مميزة</h2>
        <Link href="/ar/search" className="text-sm text-[var(--text-secondary)] flex items-center gap-1 hover:text-white transition-colors">
          <ChevronLeft size={16} /> عرض الكل
        </Link>
      </div>

      {/* تحميل */}
      {loading && (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="220px" className="rounded-2xl" />
          ))}
        </div>
      )}

      {/* فارغة */}
      {!loading && listings.length === 0 && (
        <p className="text-[var(--text-secondary)] text-center py-8">لا توجد إعلانات بعد</p>
      )}

      {/* البطاقات */}
      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {listings.map((ad) => (
            <Link
              key={ad.id}
              href={`/ar/listing/${ad.id}`}
              className="bg-[var(--bg-card)] rounded-2xl overflow-hidden relative cursor-pointer hover:shadow-lg hover:shadow-[var(--color-primary)]/10 transition-all border border-[var(--border-color)] group"
            >
              {/* الصورة */}
              <div className="relative h-28 w-full overflow-hidden">
                {ad.image ? (
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-[#1a1d2e] flex items-center justify-center text-3xl">📷</div>
                )}
                <button className="absolute top-2 right-2 bg-[#161b22]/80 p-1.5 rounded-full text-white hover:bg-[#161b22] transition-colors">
                  <Heart size={14} />
                </button>
                {/* نقاط */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full shadow-[0_0_5px_rgba(56,239,125,0.5)]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full opacity-60"></span>
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full opacity-60"></span>
                </div>
              </div>

              {/* التفاصيل */}
              <div className="p-3">
                <h3 className="text-sm font-medium truncate text-white mb-1">{ad.title}</h3>
                <p className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1 mb-2">
                  <MapPin size={12} /> {ad.city}
                </p>
                <p className="text-[var(--color-primary)] font-bold text-sm">
                  {Number(ad.price).toLocaleString()} ل.س
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}