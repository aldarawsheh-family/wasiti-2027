// WASITI 2027 — StatisticsSection
// المسار: components/features/StatisticsSection.tsx

'use client';

import React from 'react';
import GlassPanel from '../ui/GlassPanel';

interface StatItem {
  value: string | number;
  label: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

interface StatisticsSectionProps {
  stats?: StatItem[];
  className?: string;
}

export default function StatisticsSection({
  stats,
  className = '',
}: StatisticsSectionProps) {
  // بيانات تجريبية
  const defaultStats: StatItem[] = [
    { value: '1,243', label: 'إعلانات', icon: '📦', trend: 'up', trendValue: '+12%' },
    { value: '320', label: 'مستخدمين', icon: '👤', trend: 'up', trendValue: '+8%' },
    { value: '89', label: 'صفقات', icon: '🤝', trend: 'up', trendValue: '+23%' },
    { value: '47%', label: 'نمو', icon: '📈', trend: 'up', trendValue: '+5%' },
  ];

  const displayStats = stats || defaultStats;

  return (
    <section className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayStats.map((stat, index) => (
            <GlassPanel
              key={index}
              className="p-6 text-center flex flex-col items-center justify-center gap-2 min-h-[120px]"
              hover={false}
            >
              <div className="text-3xl">{stat.icon}</div>
              <div className="text-3xl font-bold text-[var(--text-main)]">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--text-secondary)]">
                {stat.label}
              </div>
              {stat.trend && (
                <div className={`text-xs font-medium ${stat.trend === 'up' ? 'text-[var(--color-success)]' : stat.trend === 'down' ? 'text-[var(--color-error)]' : 'text-[var(--text-secondary)]'}`}>
                  {stat.trendValue}
                </div>
              )}
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}