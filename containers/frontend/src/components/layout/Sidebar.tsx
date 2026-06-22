// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Sidebar
// ══════════════════════════════════════════════════

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 p-4">
      <nav className="flex flex-col gap-2">
        <a className="glass px-4 py-2 rounded-xl text-gray-300">🏠 الرئيسية</a>
        <a className="glass px-4 py-2 rounded-xl text-gray-300">🔍 استكشف</a>
        <a className="glass px-4 py-2 rounded-xl text-gray-300">💬 المحادثات</a>
        <a className="glass px-4 py-2 rounded-xl text-gray-300">👤 الملف الشخصي</a>
      </nav>
    </aside>
  );
}