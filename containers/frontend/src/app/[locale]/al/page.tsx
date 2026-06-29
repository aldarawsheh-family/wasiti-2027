'use client';

import Link from 'next/link';
import { 
  Search, 
  Home, 
  User, 
  MessageCircle, 
  Plus, 
  Heart, 
  Car, 
  Building2, 
  Smartphone, 
  Wrench, 
  Armchair,
  LayoutGrid,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ShoppingBag 
} from 'lucide-react';

// بيانات وهمية للإعلانات
const featuredAds = [
  {
    id: 1,
    title: 'هيونداي توسان 2020',
    price: '125,000,000',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    location: 'دمشق',
    time: 'منذ 2 ساعة',
  },
  {
    id: 2,
    title: 'شقة للبيع في المزة',
    price: '320,000,000',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    location: 'دمشق',
    time: 'منذ 5 ساعات',
  },
];

export default function HomePage() {
  return (
    // الحاوية الرئيسية
    <main dir="rtl" className="min-h-screen bg-[#161b22] text-white pb-6 font-sans selection:bg-[#38ef7d] selection:text-black flex justify-center relative">
      
      {/* حاوية المحاكاة */}
      <div className="w-full max-w-[430px] relative px-4 pt-4 pb-28">
      
        {/* ====== 1. الهيدر (Header) ====== */}
        <header className="flex justify-between items-center pb-6">
          <Link 
            href="/publish"
            className="bg-gradient-to-r from-[#11998e] to-[#38ef7d] text-black font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"
          >
            <Plus size={18} />
            أضف إعلان
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-white text-sm cursor-pointer hover:text-gray-300 transition-colors">
              سوريا <ChevronDown size={14} className="text-gray-400" />
            </div>
            <div className="bg-[#2a303c] w-10 h-10 rounded-full flex justify-center items-center text-gray-300 hover:bg-[#38ef7d] hover:text-black transition-colors cursor-pointer">
              <User size={18} />
            </div>
          </div>
        </header>

        {/* ====== 2. النصوص الرئيسية (العنوان الجديد بتدرج لوني) ====== */}
        <section className="text-center mb-4 mt-2">
          <h1 className="text-2xl font-extrabold mb-1 leading-tight tracking-wide bg-gradient-to-r from-[#00ff88] via-[#a855f7] to-[#3b82f6] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,255,136,0.2)]">
            السوق السوري الرقمي
          </h1>
          <p className="text-gray-400 text-xs">
            اكتشف أفضل الصفقات بالقرب منك
          </p>
        </section>

        {/* ====== 3. شريط البحث (Search Bar) ====== */}
        <section className="mb-6">
          <div className="relative w-full rounded-full bg-gradient-to-r from-[#00ff88] to-[#a855f7] p-[1.5px] shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(0,255,136,0.5)]">
            <div className="relative bg-[#1a1d2e] rounded-full w-full h-full flex items-center">
              <input 
                type="text" 
                placeholder="ابحث عن أي شيء..."
                className="w-full h-11 bg-transparent rounded-full pl-4 pr-12 text-gray-300 outline-none placeholder-gray-500 text-[15px]"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </section>

        {/* ====== 4. شبكة الأيقونات (Category Grid) - تم تكبير الحجم قليلاً ====== */}
        <section className="grid grid-cols-3 gap-4 mb-8 text-center">
          {[
            { icon: <Car size={22} />, label: 'سيارات', color: '#00ff88' },
            { icon: <Building2 size={22} />, label: 'عقارات', color: '#a855f7' },
            { icon: <Smartphone size={22} />, label: 'موبايلات', color: '#3b82f6' },
            { icon: <ShoppingBag size={22} />, label: 'وظائف', color: '#facc15' },
            { icon: <Armchair size={22} />, label: 'أثاث', color: '#ef4444' },
            { icon: <Wrench size={22} />, label: 'خدمات', color: '#22d3ee' },
          ].map((item, index) => (
            <div 
              key={index} 
              className="w-[62px] h-[62px] mx-auto rounded-full bg-[#1a1d2e] border border-white/10 flex flex-col items-center justify-center gap-[2px] cursor-pointer group transition-all duration-300 hover:border-[#00ff88] hover:shadow-[0_0_20px_rgba(0,255,136,0.15)]"
            >
              <div style={{ color: item.color }} className="group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-[10px] text-gray-300 group-hover:text-white transition-colors font-medium leading-none">
                {item.label}
              </span>
            </div>
          ))}
        </section>

        {/* ====== 5. قسم الإعلانات المميزة (Featured Ads) ====== */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">إعلانات مميزة</h2>
            <Link href="/ads" className="text-sm text-gray-400 flex items-center gap-1 hover:text-white transition-colors">
              <ChevronLeft size={16} /> عرض الكل
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featuredAds.map((ad) => (
              <div key={ad.id} className="bg-[#1e2430] rounded-2xl overflow-hidden relative cursor-pointer hover:shadow-lg hover:shadow-[#38ef7d]/10 transition-all border border-[#2a303c] group">
                
                <div className="relative h-28 w-full overflow-hidden">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <button className="absolute top-2 right-2 bg-[#161b22]/80 p-1.5 rounded-full text-white hover:bg-[#161b22] transition-colors">
                    <Heart size={14} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#38ef7d] rounded-full shadow-[0_0_5px_rgba(56,239,125,0.5)]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full opacity-60"></span>
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full opacity-60"></span>
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate text-white mb-1">{ad.title}</h3>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mb-2">
                    <MapPin size={12} /> {ad.location}
                  </p>
                  <p className="text-[#38ef7d] font-bold text-sm">{ad.price} ل.س</p>
                  <p className="text-[10px] text-gray-500 mt-1">{ad.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ====== 6. القائمة السفلية العائمة المحسنة (Glassmorphism Floating Nav) ====== */}
      <div className="fixed bottom-6 left-4 right-4 flex justify-center z-50 pointer-events-none" style={{ maxWidth: '430px', margin: '0 auto' }}>
        
        <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-[30px] px-5 py-3 flex justify-between items-center pointer-events-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
          
          <Link href="/profile" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors min-w-[50px] group">
            <User size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium">حسابي</span>
          </Link>
          
          <Link href="/messages" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors min-w-[50px] group">
            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium">الرسائل</span>
          </Link>
          
          <Link href="/favorites" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors min-w-[50px] group">
            <Heart size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium">المفضلة</span>
          </Link>
          
          <Link href="/categories" className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors min-w-[50px] group">
            <LayoutGrid size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-medium">التصنيفات</span>
          </Link>

          <Link href="/" className="flex flex-col items-center gap-1 text-[#38ef7d] min-w-[50px] relative group">
            <div className="absolute -top-3 w-2 h-2 bg-[#38ef7d] rounded-full shadow-[0_0_10px_rgba(56,239,125,0.8)]"></div>
            <Home size={22} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </Link>
          
        </div>
      </div>

    </main>
  );
}