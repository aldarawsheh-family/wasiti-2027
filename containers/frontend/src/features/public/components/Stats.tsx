'use client';

import React from 'react';
import { Building2, Users, FileCheck, Star } from 'lucide-react';

const stats = [
  { icon: FileCheck, value: '128,547', label: 'إعلان نشط' },
  { icon: Users, value: '45,892', label: 'تاجر موثوق' },
  { icon: Building2, value: '12,458', label: 'شركة مسجلة' },
  { icon: Star, value: '98%', label: 'معدل رضا العملاء' },
];

export default function Stats() {
  return (
    <div className="max-w-6xl mx-auto -mt-16 relative z-10 px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white/30 backdrop-blur-xl rounded-[24px] shadow-sm p-6 border border-white/40">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#22C55E]/20 backdrop-blur-sm flex items-center justify-center border border-[#22C55E]/30">
              <stat.icon size={24} className="text-[#22C55E]" />
            </div>
            <div className="text-2xl font-bold text-[#111827]">{stat.value}</div>
            <div className="text-sm text-[#6B7280]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}