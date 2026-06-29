'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({
  items,
  className = '',
}: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav className={`flex items-center gap-1.5 text-sm ${className}`} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronLeft size={14} className="text-blue-300/40 shrink-0" />
            )}
            
            {isLast ? (
              <span className="text-white font-medium">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="text-blue-200/60 hover:text-sky-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-blue-200/60">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}