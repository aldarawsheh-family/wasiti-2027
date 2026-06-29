'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react';

export default function CompanyMembersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const members = [
    { id: '1', name: 'أحمد المحمد', email: 'ahmed@company.com', role: 'مدير', joined: '2026-01-15', avatar: '' },
    { id: '2', name: 'سارة عبدالله', email: 'sara@company.com', role: 'مسوق', joined: '2026-01-10', avatar: '' },
    { id: '3', name: 'محمد علي', email: 'mohamed@company.com', role: 'مندوب مبيعات', joined: '2026-01-05', avatar: '' },
    { id: '4', name: 'نورا حسن', email: 'nora@company.com', role: 'مدير حسابات', joined: '2025-12-28', avatar: '' },
  ];

  const columns = [
    { key: 'avatar', label: '' },
    { key: 'name', label: 'الاسم' },
    { key: 'role', label: 'الدور' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'joined', label: 'تاريخ الانضمام' },
    { key: 'actions', label: 'إجراءات' },
  ];

  const tableData = members.map((member) => ({
    avatar: <Avatar name={member.name} size="sm" />,
    name: <span className="font-medium text-white">{member.name}</span>,
    role: <Badge variant="secondary">{member.role}</Badge>,
    email: <span className="text-[var(--text-secondary)]">{member.email}</span>,
    joined: <span className="text-[var(--text-secondary)]">{member.joined}</span>,
    actions: (
      <div className="flex gap-2">
        <Button variant="glass" size="sm"><Edit size={14} /> تعديل</Button>
        <Button variant="danger" size="sm"><Trash2 size={14} /> حذف</Button>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans relative">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center shadow-[var(--shadow-neon)]">
              <Users size={20} className="text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white">أعضاء الشركة</h1>
          </div>
          <Link href="/ar/dashboard/company/members/invite">
            <Button variant="primary" size="lg"><UserPlus size={20} /> دعوة عضو جديد</Button>
          </Link>
        </div>

        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="40px" />)}
            </div>
          ) : (
            <Table columns={columns} data={tableData} emptyMessage="لا يوجد أعضاء في الشركة" />
          )}
        </Card>
      </div>
    </div>
  );
}