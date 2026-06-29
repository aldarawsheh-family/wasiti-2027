// WASITI 2027 — TrustSection (لماذا وسيطي)
// المسار: components/features/TrustSection.tsx

import React from 'react';
import Card from '../ui/Card';

interface TrustFeature {
  icon: string;
  title: string;
  description: string;
}

interface TrustSectionProps {
  className?: string;
}

export default function TrustSection({ className = '' }: TrustSectionProps) {
  const features: TrustFeature[] = [
    {
      icon: '🔒',
      title: 'أمان تام',
      description: 'جميع بياناتك مشفرة ومحمية بأعلى معايير الأمان',
    },
    {
      icon: '⚡',
      title: 'سرعة فائقة',
      description: 'أسرع بحث وصفقات في المنطقة، بدون تأخير',
    },
    {
      icon: '💬',
      title: 'دعم متواصل',
      description: 'فريق دعم جاهز لمساعدتك 24/7',
    },
  ];

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-2">
            لماذا وسيطي؟
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            منصة تضع ثقتك وراحتك في المقام الأول
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              hover
              className="p-8 text-center flex flex-col items-center gap-4 min-h-[200px]"
            >
              <div className="text-5xl">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[var(--text-main)]">
                {feature.title}
              </h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}