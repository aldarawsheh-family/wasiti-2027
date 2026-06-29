'use client';

import React, { useState, useEffect } from 'react';
import Skeleton from '@/components/ui/Skeleton';
import { getListings } from '@/features/listings/api/listings';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';

export default function Stats() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getListings({ limit: 4, sort: 'newest' })
      .then((res) => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : data.data || [];
        setListings(list.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-4 space-y-3 pt-2 pb-4">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 drop-shadow-md">
          <span className="w-1.5 h-5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.5)]"></span>
          حديثة
        </h2>
      </div>

      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height="200px" className="rounded-2xl" />
          ))}
        </div>
      )}

      {!loading && listings.length === 0 && (
        <p className="text-blue-200/50 text-center py-8">لا توجد إعلانات حديثة</p>
      )}

      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {listings.map((item) => (
            <Link
              key={item.id}
              href={`/ar/listing/${item.id}`}
              className="rounded-2xl overflow-hidden bg-white/20 backdrop-blur-md group cursor-pointer transition-all border border-white/25 hover:border-cyan-400/30 hover:shadow-[0_0_20px_rgba(56,189,248,0.15)] flex flex-col"
            >
              <div className="relative aspect-[4/3.5] w-full overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: item.image ? `url(${item.image})` : undefined,
                  }}
                >
                  {!item.image && (
                    <div className="w-full h-full bg-[#1a252e] flex items-center justify-center">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}
                </div>
                <button className="absolute top-2 right-2 bg-[#1D3E66]/60 backdrop-blur-sm p-1.5 rounded-full hover:bg-white/20 transition-colors z-10">
                  <Heart size={15} className="text-white/70" />
                </button>
              </div>

              <div className="p-3 flex flex-col gap-1.5 bg-white/20">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-medium text-[13px] truncate max-w-[65%]">{item.title}</h3>
                  <span className="text-cyan-300 font-bold text-[11px] bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {Number(item.price).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-300/50 mt-0.5">
                  <MapPin size={12} className="text-blue-300/50" />
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