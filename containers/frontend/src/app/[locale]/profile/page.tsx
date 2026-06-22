// ══════════════════════════════════════════════════
// WASITI 2027 — Profile Page
// ══════════════════════════════════════════════════

import Navbar from '@/components/layout/Navbar';

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">👤 الملف الشخصي</h1>
        <div className="glass p-6 rounded-2xl text-center">
          <div className="w-20 h-20 rounded-full glass mx-auto mb-4 flex items-center justify-center text-3xl">
            👤
          </div>
          <p className="text-gray-400">تسجيل الدخول لعرض الملف الشخصي</p>
        </div>
      </main>
    </>
  );
}