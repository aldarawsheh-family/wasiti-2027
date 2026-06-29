'use client';

import React, { useState, useEffect } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { getListings } from '@/features/listings/api/listings';
import Link from 'next/link';
import { Heart, MapPin, ChevronRight } from 'lucide-react';

export default function FeaturedListings({ className = '' }: { className?: string }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings({ limit: 4 })
      .then((res) => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : data.data || [];
        const items = list.slice(0, 4);
        setListings(items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`px-4 space-y-4 pt-2 ${className}`}>
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 drop-shadow-md">
          <span className="w-1.5 h-5 bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(103,232,249,0.5)]"></span>
          مميز
        </h2>
        <Link href="/ar/search" className="text-xs text-cyan-300/80 flex items-center gap-1 hover:text-cyan-200 transition-colors">
          عرض الكل <ChevronRight size={14} />
        </Link>
      </div>

      {loading && (
        <div className="flex gap-4 pb-2 px-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[300px] max-w-[320px] h-[320px] rounded-2xl overflow-hidden flex-shrink-0">
              <Skeleton height="100%" className="rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <p className="text-blue-200/50 text-center py-8">لا توجد إعلانات مميزة بعد</p>
      )}

      {!loading && listings.length > 0 && (
        <div className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory scrollbar-hide px-1 -mx-1">
          {listings.map((item) => (
            <Link
              key={item.id}
              href={`/ar/listing/${item.id}`}
              className="relative min-w-[300px] max-w-[320px] h-[320px] rounded-2xl overflow-hidden bg-white/20 group snap-center hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] transition-all duration-500 border border-white/25 flex-shrink-0 backdrop-blur-sm"
            >
              {/* الصورة */}
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: item.image
                    ? `url(${item.image})`
                    : undefined,
                }}
              >
                {!item.image && (
                  <div className="w-full h-full bg-[#1a252e] flex items-center justify-center">
                    <span className="text-4xl">📷</span>
                  </div>
                )}
              </div>

              {/* التدرج */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D3E66] via-[#1D3E66]/70 to-transparent" />

              {/* زر المفضلة */}
              <button className="absolute top-3 right-3 bg-[#1D3E66]/50 backdrop-blur-md p-2 rounded-full border border-white/25 hover:bg-cyan-500/20 hover:border-cyan-300/50 transition-all">
                <Heart size={18} className="text-blue-200/70 group-hover:text-cyan-200 transition-colors" />
              </button>

              {/* معلومات الإعلان */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
                <div className="flex justify-between items-end">
                  <h3 className="text-white font-bold text-[15px] truncate max-w-[65%] tracking-wide drop-shadow-md">
                    {item.title}
                  </h3>
                  <div className="bg-[#1D3E66]/60 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-400/30 text-cyan-300 text-xs font-bold shadow-lg">
                    {Number(item.price).toLocaleString()} ل.س
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-blue-200/60 mt-1">
                  <MapPin size={14} className="text-blue-200/60" />
                  <span>{item.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}