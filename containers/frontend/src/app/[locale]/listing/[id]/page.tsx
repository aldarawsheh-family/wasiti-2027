// ══════════════════════════════════════════════════
// WASITI 2027 — Listing Detail Page
// ══════════════════════════════════════════════════

import Navbar from '@/components/layout/Navbar';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-4 max-w-4xl mx-auto">
        <a href="/ar" className="text-indigo-400 mb-4 inline-block">← العودة للقائمة</a>
        <div className="glass p-6 rounded-2xl">
          <h1 className="text-2xl font-bold text-white mb-4">تفاصيل الإعلان #{params.id}</h1>
          <p className="text-gray-400">معلومات الإعلان ستظهر هنا</p>
        </div>
      </main>
    </>
  );
}