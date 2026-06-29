// WASITI 2027 — DealTracker
// المسار: components/features/DealTracker.tsx

import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

type DealStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type Deal = {
  id: string;
  title: string;
  listingTitle?: string;
  buyerName: string;
  sellerName: string;
  buyer?: string;
  seller?: string;
  amount: number;
  status?: DealStatus;
  currentStatus: DealStatus;
  date?: string;
  statusHistory: {
    status: DealStatus;
    date: string;
    note?: string;
  }[];
};

type DealTrackerProps = {
  deal: Deal;
  className?: string;
};

export default function DealTracker({ deal, className = '' }: DealTrackerProps) {
  const statusColors: Record<DealStatus, { color: string; badge: 'warning' | 'secondary' | 'primary' | 'success' | 'error' }> = {
    PENDING: { color: 'var(--color-warning)', badge: 'warning' },
    ACCEPTED: { color: 'var(--color-secondary)', badge: 'secondary' },
    IN_PROGRESS: { color: 'var(--color-primary)', badge: 'primary' },
    COMPLETED: { color: 'var(--color-success)', badge: 'success' },
    CANCELLED: { color: 'var(--color-error)', badge: 'error' },
  };

  const statusLabels: Record<DealStatus, string> = {
    PENDING: 'معلق',
    ACCEPTED: 'مقبول',
    IN_PROGRESS: 'قيد التنفيذ',
    COMPLETED: 'مكتمل',
    CANCELLED: 'ملغي',
  };

  const currentStatus = deal.currentStatus;
  const history = deal.statusHistory || [];
  const displayTitle = deal.title || deal.listingTitle || 'بدون عنوان';
  const buyer = deal.buyerName || deal.buyer || 'غير معروف';
  const seller = deal.sellerName || deal.seller || 'غير معروف';

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-main)]">{displayTitle}</h3>
          <div className="text-sm text-[var(--text-secondary)] mt-1">
            {buyer} → {seller}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-[var(--color-primary)]">
            ${deal.amount.toLocaleString()}
          </div>
          <Badge variant={statusColors[currentStatus].badge}>
            {statusLabels[currentStatus]}
          </Badge>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pt-2">
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-[var(--border-color)]" />
        
        <div className="flex flex-wrap gap-2 relative">
          {(Object.keys(statusLabels) as DealStatus[]).map((status) => {
            const isActive = history.some((h) => h.status === status);
            const isCurrent = currentStatus === status;
            const statusDate = history.find((h) => h.status === status)?.date;

            return (
              <div
                key={status}
                className={`
                  flex-1 min-w-[120px] p-3 rounded-lg border transition-all
                  ${isCurrent 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' 
                    : isActive 
                    ? 'border-[var(--border-color)] bg-[var(--bg-input)]/50' 
                    : 'border-[var(--border-color)] opacity-40'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full bg-[${statusColors[status].color}]`}
                    style={{ backgroundColor: statusColors[status].color }}
                  />
                  <span className={`text-sm font-medium ${isCurrent ? 'text-[var(--text-main)]' : 'text-[var(--text-secondary)]'}`}>
                    {statusLabels[status]}
                  </span>
                  {isCurrent && <Badge variant="primary" className="text-xs px-2 py-0.5">الحالية</Badge>}
                </div>
                {statusDate && (
                  <div className="text-xs text-[var(--text-secondary)]">{statusDate}</div>
                )}
                {!isActive && !isCurrent && (
                  <div className="text-xs text-[var(--text-secondary)] opacity-50">قادم</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}