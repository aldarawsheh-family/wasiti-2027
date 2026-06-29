'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { Headphones, AlertCircle, Clock, CheckCircle } from 'lucide-react';

export default function AdminSupportPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/tickets/')
      .then(r => r.json())
      .then(data => {
        const list = data?.data || data || [];
        setTickets(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch(() => {
        // API غير موجودة بعد - نعرض mock للوقت الحالي
        setTickets([
          { id: '1', user: 'لا توجد تذاكر حالياً', subject: 'الخدمة غير متاحة بعد', status: 'مفتوحة', priority: 'منخفضة', date: new Date().toISOString() },
        ]);
        setLoading(false);
      });
  }, []);

  const statusIcon: any = {
    'مفتوحة': <AlertCircle size={12} />,
    'قيد المعالجة': <Clock size={12} />,
    'مغلقة': <CheckCircle size={12} />,
  };

  const columns = [
    { key: 'user', label: 'المستخدم' },
    { key: 'subject', label: 'الموضوع' },
    { key: 'status', label: 'الحالة' },
    { key: 'priority', label: 'الأولوية' },
    { key: 'date', label: 'التاريخ' },
  ];

  const tableData = tickets.map((ticket: any) => ({
    user: <span className="text-blue-200/60">{ticket.user}</span>,
    subject: <span className="font-medium text-white">{ticket.subject}</span>,
    status: (
      <Badge variant={ticket.status === 'مفتوحة' ? 'primary' : ticket.status === 'قيد المعالجة' ? 'warning' : 'success'}>
        <span className="flex items-center gap-1">
          {statusIcon[ticket.status]}
          {ticket.status}
        </span>
      </Badge>
    ),
    priority: (
      <Badge variant={ticket.priority === 'عالية' ? 'error' : ticket.priority === 'متوسطة' ? 'warning' : 'success'}>
        {ticket.priority}
      </Badge>
    ),
    date: <span className="text-blue-200/60">{new Date(ticket.date).toLocaleDateString('ar')}</span>,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D3E66] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white">جاري التحميل...</h1>
            <Card className="p-4">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="40px" />)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
              <Headphones size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">الدعم الفني</h1>
          </div>

          <Card className="p-0 overflow-hidden">
            <Table columns={columns} data={tableData} emptyMessage="لا توجد تذاكر دعم" />
          </Card>
        </div>
      </div>
    </div>
  );
}