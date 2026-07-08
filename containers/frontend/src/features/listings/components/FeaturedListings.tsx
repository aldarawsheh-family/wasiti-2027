'use client';

import React, { useState, useEffect } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { getListings } from '@/features/listings/api/listings';
import Link from 'next/link';
import { Heart, MapPin, ChevronRight, BadgeCheck } from 'lucide-react';

export default function FeaturedListings({ className = '' }: { className?: string }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings({ limit: 4 })
      .then((res) => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : data.data || [];
        setListings(list.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={`py-16 px-4 max-w-7xl mx-auto ${className}`}>
      
      {/* العنوان + عرض الكل */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-[#1A202C]">إعلانات مميزة</h2>
        <Link href="/ar/search" className="text-[#128C4F] text-sm font-medium flex items-center gap-1 hover:underline">
          عرض الكل <ChevronRight size={16} />
        </Link>
      </div>

      {loading && (
        <div className="flex overflow-x-auto gap-6 pb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[280px] h-[320px] rounded-2xl overflow-hidden flex-shrink-0">
              <Skeleton height="100%" className="rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
  <span className="text-5xl mb-4">📢</span>
  <p className="text-[#A0AEC0] text-lg">لا توجد إعلانات مميزة بعد</p>
  <p className="text-[#A0AEC0] text-sm mt-1">تصفح الإعلانات المتاحة أو أضف إعلانك الأول</p>
</div>
      )}

      {!loading && listings.length > 0 && (
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
          {listings.map((item) => (
            <Link
              key={item.id}
              href={`/ar/listing/${item.id}`}
              className="relative min-w-[280px] md:min-w-[300px] h-[340px] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 group snap-center hover:shadow-lg transition-all duration-300 flex-shrink-0"
            >
              {/* الصورة */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl">📷</span>
                  </div>
                )}
                
                {/* شارة مميز */}
                <span className="absolute top-3 left-3 bg-[#E8F5E9] text-[#128C4F] text-xs font-medium rounded-full px-3 py-1 flex items-center gap-1">
                  <BadgeCheck size={14} /> مميز
                </span>

                {/* أيقونة المفضلة */}
                <button className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                  <Heart size={18} className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>

              {/* معلومات الإعلان */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-[#1A202C] font-semibold text-lg truncate">{item.title}</h3>
                <div className="text-[#128C4F] font-bold text-xl">{Number(item.price).toLocaleString()} ل.س</div>
                <div className="flex items-center gap-1 text-sm text-[#718096]">
                  <MapPin size={14} />
                  <span>{item.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}