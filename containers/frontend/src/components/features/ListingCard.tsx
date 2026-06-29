// WASITI 2027 — ListingCard
// المسار: components/features/ListingCard.tsx

'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type ListingStatus = 'active' | 'pending' | 'deleted';

type Listing = {
  id: string;
  title: string;
  price: number;
  city: string;
  date: string;
  image: string;
  status?: ListingStatus;
  category?: string;
};

type ListingCardProps = {
  listing: Listing;
  onClick?: () => void;
  className?: string;
};

export default function ListingCard({
  listing,
  onClick,
  className = '',
}: ListingCardProps) {
  const {
    title,
    price,
    city,
    date,
    image,
    status = 'active',
    category,
  } = listing;

  const statusColors: Record<ListingStatus, 'success' | 'warning' | 'error'> = {
    active: 'success',
    pending: 'warning',
    deleted: 'error',
  };

  const statusLabels: Record<ListingStatus, string> = {
    active: 'نشط',
    pending: 'معلق',
    deleted: 'محذوف',
  };

  const formattedPrice = price.toLocaleString();

  return (
    <Card
      hover
      onClick={onClick}
      className={`overflow-hidden cursor-pointer p-0 ${className}`}
    >
      <div className="relative w-full h-48">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          {status !== 'active' ? (
            <Badge variant={statusColors[status]}>
              {statusLabels[status]}
            </Badge>
          ) : category ? (
            <Badge variant="secondary">{category}</Badge>
          ) : null}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-[var(--text-main)] font-bold text-lg truncate">
          {title}
        </h3>
        
        <div className="text-[var(--color-primary)] font-bold text-xl">
          {formattedPrice} $
        </div>
        
        <div className="flex items-center justify-between text-[var(--text-secondary)] text-sm">
          <span className="flex items-center gap-1">
            <span>📍</span> {city}
          </span>
          <span>{date}</span>
        </div>
      </div>
    </Card>
  );
}