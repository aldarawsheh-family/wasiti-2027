// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Navbar
// ══════════════════════════════════════════════════

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 glass">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          WASITI
        </div>

        <nav className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="/ar">الرئيسية</a>
          <a href="/ar/search">استكشف</a>
          <a href="/ar/listing/new">نشر</a>
          <a href="/ar/chat">محادثات</a>
        </nav>

        <button className="glass px-4 py-2 rounded-xl text-white">
          دخول
        </button>
      </div>
    </header>
  );
}