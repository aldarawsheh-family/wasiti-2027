// WASITI 2027 — SearchFilters
// المسار: components/features/SearchFilters.tsx

'use client';

import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface SearchFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  categories?: string[];
  cities?: string[];
  className?: string;
}

export interface FilterValues {
  category: string;
  city: string;
  priceMin: string;
  priceMax: string;
  sort: 'newest' | 'price_low' | 'price_high';
}

export default function SearchFilters({
  onFilterChange,
  categories = ['سيارات', 'عقارات', 'موبايلات', 'خدمات'],
  cities = ['دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية'],
  className = '',
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    category: '',
    city: '',
    priceMin: '',
    priceMax: '',
    sort: 'newest',
  });

  // تحديث الفلاتر وإرسالها
  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // تصفير الفلاتر
  const resetFilters = () => {
    const resetValues = {
      category: '',
      city: '',
      priceMin: '',
      priceMax: '',
      sort: 'newest' as const,
    };
    setFilters(resetValues);
    onFilterChange(resetValues);
  };

  return (
    <div className={`flex flex-col md:flex-row flex-wrap gap-4 items-end ${className}`}>
      {/* الفئة */}
      <div className="flex-1 min-w-[150px]">
        <label className="text-sm text-[var(--text-secondary)] block mb-1">الفئة</label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 focus:border-[var(--color-primary)] outline-none transition-colors"
        >
          <option value="">الكل</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* المدينة */}
      <div className="flex-1 min-w-[150px]">
        <label className="text-sm text-[var(--text-secondary)] block mb-1">المدينة</label>
        <select
          value={filters.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className="w-full bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 focus:border-[var(--color-primary)] outline-none transition-colors"
        >
          <option value="">الكل</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* السعر من */}
      <div className="flex-1 min-w-[120px]">
        <label className="text-sm text-[var(--text-secondary)] block mb-1">السعر من</label>
        <Input
          type="number"
          placeholder="من"
          value={filters.priceMin}
          onChange={(e) => handleChange('priceMin', e.target.value)}
          className="w-full"
        />
      </div>

      {/* السعر إلى */}
      <div className="flex-1 min-w-[120px]">
        <label className="text-sm text-[var(--text-secondary)] block mb-1">السعر إلى</label>
        <Input
          type="number"
          placeholder="إلى"
          value={filters.priceMax}
          onChange={(e) => handleChange('priceMax', e.target.value)}
          className="w-full"
        />
      </div>

      {/* الترتيب */}
      <div className="flex-1 min-w-[150px]">
        <label className="text-sm text-[var(--text-secondary)] block mb-1">الترتيب</label>
        <select
          value={filters.sort}
          onChange={(e) => handleChange('sort', e.target.value as any)}
          className="w-full bg-[var(--bg-input)] text-[var(--text-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 focus:border-[var(--color-primary)] outline-none transition-colors"
        >
          <option value="newest">الأحدث</option>
          <option value="price_low">الأقل سعراً</option>
          <option value="price_high">الأعلى سعراً</option>
        </select>
      </div>

      {/* زر التصفير */}
      <div>
        <Button variant="secondary" onClick={resetFilters} size="sm">
          تصفير
        </Button>
      </div>
    </div>
  );
}