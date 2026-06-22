// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Home Page
// ══════════════════════════════════════════════════

import Navbar from '@/components/layout/Navbar';
import SearchBar from '@/components/features/SearchBar';
import ListingCard from '@/components/features/ListingCard';
import GlassPanel from '@/components/ui/GlassPanel';

export default function HomePage() {
  const stats = [
    { value: '1243', label: 'إعلانات', color: 'text-indigo-400' },
    { value: '320', label: 'مستخدم', color: 'text-cyan-400' },
    { value: '84', label: 'صفقات', color: 'text-purple-400' },
    { value: '🔥', label: 'نمو', color: 'text-pink-400' },
  ];

  const tags = ['🚗 سيارات', '🏠 عقارات', '📱 موبايلات', '⚡ خدمات'];

  const listings = [
    { id: '1', title: 'سيارة حديثة', city: 'دمشق', image: 'https://picsum.photos/400/300?1' },
    { id: '2', title: 'شقة للإيجار', city: 'حلب', image: 'https://picsum.photos/400/300?2' },
    { id: '3', title: 'جوال جديد', city: 'حمص', image: 'https://picsum.photos/400/300?3' },
  ];

  return (
    <>
      <Navbar />

      <main className="pt-40 pb-16 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
          وسيطي<br />
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            السوق الذكي الجديد
          </span>
        </h1>

        <p className="text-gray-400 mt-4">بيع وشراء أسرع — ثقة أعلى — تجربة 2027</p>

        <div className="mt-8 max-w-2xl mx-auto">
          <SearchBar />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {tags.map(tag => (
            <GlassPanel key={tag} className="px-4 py-2 rounded-full text-sm text-gray-300">
              {tag}
            </GlassPanel>
          ))}
        </div>
      </main>

      <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
        {stats.map(stat => (
          <GlassPanel key={stat.label} className="p-6 rounded-2xl text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </GlassPanel>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-10">
        <GlassPanel className="p-4 rounded-2xl flex justify-between items-center">
          <div className="text-sm text-gray-300">🔴 12 إعلان جديد الآن</div>
          <div className="text-xs text-gray-500">تحديث مباشر</div>
        </GlassPanel>
      </section>

      <section className="max-w-6xl mx-auto mt-12 px-4">
        <h2 className="text-xl font-bold mb-4 text-white">🔥 أحدث الإعلانات</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {listings.map(listing => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-20 px-4">
        <GlassPanel className="p-10 rounded-3xl text-center">
          <h2 className="text-3xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            الذكاء في السوق
          </h2>
          <p className="text-gray-400 mt-3">النظام يتعلم اهتماماتك ويعرض الأفضل لك تلقائياً</p>
          <button className="mt-6 bg-green-500 text-black px-6 py-3 rounded-xl font-bold">
            تفعيل الذكاء
          </button>
        </GlassPanel>
      </section>

      <a className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-black rounded-full flex items-center justify-center text-2xl shadow-xl">
        +
      </a>
    </>
  );
}