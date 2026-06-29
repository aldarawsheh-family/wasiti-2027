import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1D3E66] flex flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 glass rounded-2xl p-12 border border-white/20 max-w-md">
        <div className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-400 mb-4">
          404
        </div>
        <h2 className="text-xl text-blue-200/80 mb-2">الصفحة غير موجودة</h2>
        <p className="text-blue-200/40 text-sm mb-8">ربما تم حذفها أو نقلها</p>
        <Link
          href="/ar"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-[0_0_25px_rgba(56,189,248,0.2)]"
        >
          <Home size={18} /> العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}