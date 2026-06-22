// ══════════════════════════════════════════════════
// WASITI 2027 — Transport Page
// ══════════════════════════════════════════════════

import Navbar from '@/components/layout/Navbar';

export default function TransportPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">🚌 النقل</h1>
        <div className="glass p-6 rounded-2xl">
          <div className="flex gap-2 mb-4">
            <input className="input flex-1" placeholder="من مدينة..." />
            <input className="input flex-1" placeholder="إلى مدينة..." />
            <input type="date" className="input w-48" />
            <button className="bg-green-500 text-black px-6 rounded-xl font-bold">بحث</button>
          </div>
          <p className="text-gray-400 text-center py-10">الرحلات المتاحة ستظهر هنا</p>
        </div>
      </main>
    </>
  );
}