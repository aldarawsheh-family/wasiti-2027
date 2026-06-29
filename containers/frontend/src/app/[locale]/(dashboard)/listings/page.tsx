'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { PlusSquare, Search, Trash2, Edit, AlertTriangle } from 'lucide-react';

export default function ListingsPage() {
  const [listings, setListings] = useState([
    { id: '1', title: 'سيارة تويوتا كورولا 2020', category: 'سيارات', status: 'نشط', date: '2026-01-15', image: 'https://placehold.co/60x60/1D3E66/ffffff?text=🚗' },
    { id: '2', title: 'شقة للبيع في المزة', category: 'عقارات', status: 'نشط', date: '2026-01-10', image: 'https://placehold.co/60x60/1D3E66/ffffff?text=🏠' },
    { id: '3', title: 'هاتف آيفون 15 برو', category: 'موبايلات', status: 'معلق', date: '2026-01-05', image: 'https://placehold.co/60x60/1D3E66/ffffff?text=📱' },
    { id: '4', title: 'خدمة تصميم مواقع', category: 'خدمات', status: 'محذوف', date: '2025-12-28', image: 'https://placehold.co/60x60/1D3E66/ffffff?text=⚡' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; title: string }>({
    open: false,
    id: null,
    title: '',
  });

  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteModal.id) {
      setListings((prev) => prev.filter((l) => l.id !== deleteModal.id));
      setDeleteModal({ open: false, id: null, title: '' });
    }
  };

  const columns = [
    { key: 'image', label: '' },
    { key: 'title', label: 'العنوان' },
    { key: 'category', label: 'الفئة' },
    { key: 'status', label: 'الحالة' },
    { key: 'date', label: 'التاريخ' },
    { key: 'actions', label: 'إجراءات' },
  ];

  const tableData = filteredListings.map((listing) => ({
    image: (
      <img
        src={listing.image}
        alt={listing.title}
        className="w-10 h-10 rounded-xl object-cover border border-white/10"
      />
    ),
    title: <span className="font-medium text-white">{listing.title}</span>,
    category: <span className="text-blue-200/60">{listing.category}</span>,
    status: (
      <Badge
        variant={
          listing.status === 'نشط' ? 'success' :
          listing.status === 'معلق' ? 'warning' :
          'error'
        }
      >
        {listing.status}
      </Badge>
    ),
    date: <span className="text-blue-200/60">{listing.date}</span>,
    actions: (
      <div className="flex gap-2">
        <Link href={`/ar/listing/${listing.id}/edit`}>
          <Button variant="glass" size="sm">
            <Edit size={14} /> تعديل
          </Button>
        </Link>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setDeleteModal({ open: true, id: listing.id, title: listing.title })}
        >
          <Trash2 size={14} /> حذف
        </Button>
      </div>
    ),
  }));

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* رأس الصفحة */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <h1 className="text-3xl font-bold text-white">إعلاناتي</h1>
            <Link href="/ar/publish">
              <Button variant="primary" size="lg">
                <PlusSquare size={20} /> نشر إعلان جديد
              </Button>
            </Link>
          </div>

          {/* شريط بحث */}
          <div className="w-full max-w-md">
            <Input
              placeholder="ابحث عن إعلان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
            />
          </div>

          {/* الجدول */}
          <Card className="p-0 overflow-hidden">
            <Table
              columns={columns}
              data={tableData}
              emptyMessage="لا توجد إعلانات مطابقة"
            />
          </Card>
        </div>
      </div>

      {/* Modal تأكيد الحذف */}
      <Modal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null, title: '' })}
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center mx-auto">
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">تأكيد الحذف</h3>
            <p className="text-blue-200/60 text-sm mt-2">
              هل أنت متأكد من حذف "{deleteModal.title}"؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="glass"
              onClick={() => setDeleteModal({ open: false, id: null, title: '' })}
            >
              إلغاء
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={16} /> حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}