'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Bus, Ticket, Truck, Armchair, PlusSquare, Calendar } from 'lucide-react';

export default function TransportPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'رحلات اليوم', value: '18', icon: Bus, color: 'text-sky-300' },
    { label: 'الحجوزات', value: '42', icon: Ticket, color: 'text-emerald-300' },
    { label: 'مركبات نشطة', value: '12', icon: Truck, color: 'text-violet-300' },
    { label: 'مقاعد متاحة', value: '84', icon: Armchair, color: 'text-amber-300' },
  ];

  const trips = [
    { id: '1', route: 'دمشق → حلب', time: '08:00', available: 8, status: 'متاح' },
    { id: '2', route: 'حمص → اللاذقية', time: '10:30', available: 5, status: 'متاح' },
    { id: '3', route: 'حماة → دمشق', time: '14:00', available: 0, status: 'مكتمل' },
    { id: '4', route: 'دمشق → حمص', time: '16:45', available: 12, status: 'متاح' },
  ];

  const columns = [
    { key: 'route', label: 'المسار' },
    { key: 'time', label: 'الوقت' },
    { key: 'available', label: 'المقاعد المتاحة' },
    { key: 'status', label: 'الحالة' },
    { key: 'actions', label: 'إجراءات' },
  ];

  const tableData = trips.map((trip) => ({
    route: <span className="font-medium text-white">{trip.route}</span>,
    time: <span className="text-blue-200/60">{trip.time}</span>,
    available: (
      <span className={`font-bold ${trip.available > 0 ? 'text-sky-300' : 'text-red-300'}`}>
        {trip.available}
      </span>
    ),
    status: (
      <Badge
        variant={
          trip.status === 'متاح' ? 'success' :
          trip.status === 'مكتمل' ? 'warning' :
          'error'
        }
      >
        {trip.status}
      </Badge>
    ),
    actions: (
      <div className="flex gap-2">
        <Button variant="primary" size="sm">حجز</Button>
        <Button variant="danger" size="sm">إلغاء</Button>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-400/30 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* العنوان */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
              <Bus size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">لوحة تحكم النقل</h1>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton height="80px" />
                </Card>
              ))
            ) : (
              stats.map((stat, index) => (
                <Card key={index} className="p-6 flex flex-col items-center justify-center gap-2" hover>
                  <stat.icon size={28} className={stat.color} />
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-blue-200/50">{stat.label}</div>
                </Card>
              ))
            )}
          </div>

          {/* جدول الرحلات */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-sky-300" />
                <h2 className="text-lg font-bold text-white">الرحلات القادمة</h2>
              </div>
              <Button variant="primary" size="sm">
                <PlusSquare size={16} /> إضافة رحلة
              </Button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="40px" />)}
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-8 text-blue-200/40">
                لا توجد رحلات قادمة
              </div>
            ) : (
              <Table
                columns={columns}
                data={tableData}
                emptyMessage="لا توجد رحلات"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}