// WASITI 2027 — SearchHeader
// المسار: components/layout/SearchHeader.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface SearchHeaderProps {
  placeholder?: string;
  searchPath?: string;
  className?: string;
}

export default function SearchHeader({
  placeholder = 'ابحث عن سيارة، عقار، خدمة...',
  searchPath = '/search',
  className = '',
}: SearchHeaderProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${searchPath}?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div
      className={`
        w-full
        bg-[var(--glass-bg)]
        backdrop-blur-[var(--glass-blur)]
        border border-[var(--border-color)]
        rounded-2xl
        p-4 md:p-6
        ${className}
      `}
    >
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Button type="submit" variant="primary" className="sm:w-auto w-full">
          بحث
        </Button>
      </form>
    </div>
  );
}