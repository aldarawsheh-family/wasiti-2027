'use client';

import React from 'react';
import { Shield, Zap, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'موثوق ومعتمد',
    description: 'جميع التجار والشركات موثقة ومعتمدة من قبل فريق وسيط لضمان مصداقية الإعلانات والصفقات.',
  },
  {
    icon: Zap,
    title: 'سرعة وأمان',
    description: 'نظام دفع آمن ومعاملات سريعة مع حماية كاملة لبياناتك الشخصية والمالية.',
  },
  {
    icon: Headphones,
    title: 'دعم على مدار الساعة',
    description: 'فريق دعم فني جاهز لمساعدتك في أي وقت عبر المحادثة المباشرة أو الهاتف.',
  },
];

export default function WhyUs() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#111827] mb-12 drop-shadow-sm">
        لماذا تختار وسيط؟
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-8 bg-white/30 backdrop-blur-xl rounded-[20px] shadow-sm border border-white/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-[#22C55E]/30">
              <feature.icon size={32} className="text-[#22C55E]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">{feature.title}</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}