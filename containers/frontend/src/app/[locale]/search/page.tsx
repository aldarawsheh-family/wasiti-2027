// ══════════════════════════════════════════════════
// WASITI 2027 — Search Page
// ══════════════════════════════════════════════════

import Navbar from '@/components/layout/Navbar';

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">🔍 بحث عن إعلانات</h1>
        <div className="flex gap-2 mb-8">
          <input className="input flex-1" placeholder="ابحث عن أي شيء..." />
          <button className="bg-green-500 text-black px-6 rounded-xl font-bold">بحث</button>
        </div>
        <p className="text-gray-400 text-center py-20">نتائج البحث ستظهر هنا</p>
      </main>
    </>
  );
}