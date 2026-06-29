// WASITI 2027 — CTASection
// المسار: components/features/CTASection.tsx

import React from 'react';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export default function CTASection({
  title = 'جاهز لبدء رحلتك؟',
  subtitle = 'انضم إلى آلاف المستخدمين الذين يثقون بواسطي يومياً',
  buttonText = 'ابدأ الآن',
  onButtonClick,
  className = '',
}: CTASectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <GlassPanel className="p-10 md:p-14 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-4">
            {title}
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={onButtonClick}
            className="px-10 py-4 text-lg"
          >
            {buttonText}
          </Button>
        </GlassPanel>
      </div>
    </section>
  );
}