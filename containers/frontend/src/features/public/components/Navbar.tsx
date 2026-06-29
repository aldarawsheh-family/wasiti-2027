'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex justify-between items-center pb-6">
      {/* زر أضف إعلان */}
      <Link
        href="/ar/publish"
        className="bg-gradient-to-r from-[#11998e] to-[var(--color-primary)] text-black font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-300"
      >
        <Plus size={18} />
        أضف إعلان
      </Link>

      {/* الشعار */}
      <Link href="/ar" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] shadow-[var(--shadow-neon)]"></div>
        <span className="font-bold text-lg tracking-wider text-white">
          WASITI
        </span>
      </Link>
    </header>
  );
}