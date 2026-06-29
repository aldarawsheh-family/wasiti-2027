'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getListings } from '@/features/listings/api/listings';
import { ArrowRight, Search, MapPin, Tag, Package } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';

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
    if (query.trim()) {
      router.push(`/ar/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white pb-28 relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-6">

        {/* شريط علوي */}
        <div className="sticky top-4 z-30 pt-2 pb-4">
          <div className="bg-white/25 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <Button variant="glass" size="sm" onClick={() => router.push('/ar')}>
              <ArrowRight size={18} className="rotate-180" /> رجوع
            </Button>
            <span className="font-bold text-sm text-white">البحث عن إعلانات</span>
          </div>
        </div>

        {/* شريط البحث */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="ابحث عن سيارة، عقار، خدمة..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search size={18} />}
            className="flex-1"
          />
          <Button type="submit" size="lg">
            <Search size={18} /> بحث
          </Button>
        </form>

        {/* الفئات */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge key={cat.name} variant="glass">
              {cat.icon} {cat.name}
            </Badge>
          ))}
        </div>

        {/* النتائج */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton height="200px" className="rounded-xl mb-4" />
                <Skeleton height="24px" width="75%" className="mb-2" />
                <Skeleton height="16px" width="50%" />
              </Card>
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="text-blue-200/20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">لا توجد نتائج</h2>
            <p className="text-blue-200/50">حاول تعديل معايير البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <Link key={item.id} href={`/ar/listing/${item.id}`}>
                <Card hover className="overflow-hidden p-0">
                  <div className="h-48 bg-black/30 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">📷</span>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-white font-bold truncate">{item.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sky-300 font-bold flex items-center gap-1">
                        <Tag size={14} /> {Number(item.price).toLocaleString()} ل.س
                      </span>
                      <span className="text-blue-200/50 text-sm flex items-center gap-1">
                        <MapPin size={14} /> {item.city}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}