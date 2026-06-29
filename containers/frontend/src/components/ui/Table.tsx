'use client';

import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

type Column = {
  key: string;
  label: string;
};

type TableProps = {
  columns: Column[];
  data: Record<string, React.ReactNode>[];
  loading?: boolean;
  emptyMessage?: string;
};

export default function Table({
  columns,
  data,
  loading = false,
  emptyMessage = 'لا توجد بيانات',
}: TableProps) {
  if (loading) {
    return (
      <div className="w-full space-y-3">
        <div className="flex gap-4 p-4 bg-white/10 rounded-2xl">
          {columns.map((col, i) => (
            <Skeleton key={i} height="24px" className="flex-1" />
          ))}
        </div>
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex gap-4 p-4 bg-white/5 rounded-2xl">
            {columns.map((col, i) => (
              <Skeleton key={i} height="20px" className="flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full p-10 text-center bg-white/5 rounded-2xl border border-white/10">
        <p className="text-blue-200/50 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/20 backdrop-blur-md">
      <table className="w-full text-right">
        <thead className="bg-white/10 text-blue-200/60">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-sm font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-white/5 transition-colors even:bg-white/[0.02]"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-white/80">
                  {row[col.key] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}