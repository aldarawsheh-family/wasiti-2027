'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getListings } from '@/features/listings/api/listings';
import { ArrowRight, Search, MapPin, Tag, Package } from 'lucide-react';

const categories = [
  { name: 'سيارات', icon: '🚗' },
  { name: 'عقارات', icon: '🏠' },
  { name: 'موبايلات', icon: '📱' },
  { name: 'خدمات', icon: '⚡' },
];

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    getListings({ limit: 50 })
      .then((res: any) => {
        let list = res?.data || res;
        if (!Array.isArray(list) && list?.data) list = list.data;
        if (!Array.isArray(list)) list = [];
        setResults(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/ar/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/ar')} className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition font-medium text-sm">
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </button>
        <h1 className="text-xl font-bold text-gray-900">البحث عن إعلانات</h1>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="ابحث عن سيارة، عقار، خدمة..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-2xl pr-11 pl-4 py-3.5 text-gray-900 outline-none focus:border-[#128C4F]"
          />
        </div>
        <button type="submit" className="bg-[#128C4F] text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg">
          <Search size={18} /> بحث
        </button>
      </form>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <span key={cat.name} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-[#128C4F]/10 hover:text-[#128C4F] transition cursor-pointer">
            {cat.icon} {cat.name}
          </span>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-100 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">لا توجد نتائج</h2>
          <p className="text-gray-400">حاول تعديل معايير البحث</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map(item => (
            <Link key={item.id} href={`/ar/listing/${item.id}`} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#128C4F]/30 transition group">
              <div className="h-48 bg-gray-50 flex items-center justify-center">
                {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <span className="text-4xl">📷</span>}
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-gray-900 font-bold truncate">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#128C4F] font-bold flex items-center gap-1"><Tag size={14} /> {Number(item.price).toLocaleString()} ل.س</span>
                  <span className="text-gray-400 text-sm flex items-center gap-1"><MapPin size={14} /> {item.city}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}