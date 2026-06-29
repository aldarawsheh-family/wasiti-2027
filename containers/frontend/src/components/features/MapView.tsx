// WASITI 2027 — MapView (عنصر نائب للخريطة)
// المسار: components/features/MapView.tsx

'use client';

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export interface MapListing {
  id: string;
  title: string;
  city: string;
  address?: string;
  lat?: number;
  lng?: number;
}

interface MapViewProps {
  listings?: MapListing[];
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export default function MapView({
  listings = [],
  center = { lat: 33.5138, lng: 36.2765 }, // دمشق افتراضياً
  zoom = 10,
  className = '',
}: MapViewProps) {
  // عرض بسيط للمواقع كنص
  return (
    <Card className={`overflow-hidden bg-[var(--bg-card)] border-[var(--border-color)] ${className}`}>
      <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
        <h3 className="text-[var(--text-main)] font-bold">الخريطة</h3>
        <Badge variant="secondary">📍 {listings.length} موقع</Badge>
      </div>

      {/* عنصر نائب للخريطة */}
      <div className="p-6 min-h-[300px] flex flex-col gap-4 bg-[var(--bg-input)]/50">
        <div className="text-center text-[var(--text-secondary)] mb-4">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-sm">خريطة تفاعلية (قيد التطوير)</p>
          <p className="text-xs opacity-70">المركز: {center.lat}, {center.lng} | التكبير: {zoom}</p>
        </div>

        {/* عرض المواقع كنص */}
        {listings.length > 0 ? (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-2 bg-[var(--bg-card)]/50 rounded-lg border border-[var(--border-color)]/30"
              >
                <div>
                  <div className="text-sm font-medium text-[var(--text-main)]">{listing.title}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{listing.city}</div>
                </div>
                {listing.address && (
                  <div className="text-xs text-[var(--text-secondary)]">{listing.address}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[var(--text-secondary)] py-8">
            <div className="text-6xl mb-2">📍</div>
            <p className="text-sm">لا توجد مواقع لعرضها</p>
          </div>
        )}
      </div>
    </Card>
  );
}