'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import { Users, Shield, ShieldOff, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/users/')
      .then(r => r.json())
      .then(data => {
        const list = data?.data || data || [];
        setUsers(list);
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    { key: 'avatar', label: '' },
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'role', label: 'الدور' },
    { key: 'status', label: 'الحالة' },
    { key: 'joined', label: 'تاريخ التسجيل' },
    { key: 'actions', label: 'إجراءات' },
  ];

  const tableData = users.map((user) => ({
    avatar: <Avatar name={user.display_name || user.email} size="sm" />,
    name: <span className="font-medium text-white">{user.display_name || user.email}</span>,
    email: <span className="text-blue-200/60">{user.email}</span>,
    role: (
      <Badge variant={user.role === 'PLATFORM_OWNER' ? 'success' : 'secondary'}>
        {user.role || 'USER'}
      </Badge>
    ),
    status: (
      <Badge variant={user.is_banned ? 'error' : 'success'}>
        {user.is_banned ? 'محظور' : 'نشط'}
      </Badge>
    ),
    joined: <span className="text-blue-200/60">{new Date(user.created_at).toLocaleDateString('ar')}</span>,
    actions: (
      <div className="flex gap-2">
        <Button variant="glass" size="sm">
          {user.is_banned ? (
            <><Shield size={14} /> فك الحظر</>
          ) : (
            <><ShieldOff size={14} /> حظر</>
          )}
        </Button>
        <Button variant="danger" size="sm">
          <Trash2 size={14} /> حذف
        </Button>
      </div>
    ),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D3E66] text-white font-sans relative overflow-x-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white">إدارة المستخدمين</h1>
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
              <Users size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">إدارة المستخدمين</h1>
          </div>

          <Card className="p-0 overflow-hidden">
            {users.length === 0 ? (
              <div className="text-center py-8 text-blue-200/40">
                لا يوجد مستخدمين
              </div>
            ) : (
              <Table
                columns={columns}
                data={tableData}
                emptyMessage="لا يوجد مستخدمين"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}