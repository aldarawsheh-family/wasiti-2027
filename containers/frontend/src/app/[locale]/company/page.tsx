// ══════════════════════════════════════════════════
// WASITI 2027 — Company Dashboard Page
// ══════════════════════════════════════════════════

import Navbar from '@/components/layout/Navbar';

export default function CompanyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">🏢 لوحة تحكم الشركة</h1>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-green-400">0</div>
            <div className="text-gray-400 text-sm">إعلانات</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-blue-400">0</div>
            <div className="text-gray-400 text-sm">أعضاء</div>
          </div>
          <div className="glass p-6 rounded-2xl text-center">
            <div className="text-3xl font-bold text-purple-400">0</div>
            <div className="text-gray-400 text-sm">صفقات</div>
          </div>
        </div>
      </main>
    </>
  );
}