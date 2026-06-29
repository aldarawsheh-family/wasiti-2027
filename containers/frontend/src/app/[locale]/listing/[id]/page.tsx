'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getListing, deleteListing } from '@/features/listings/api/listings';
import { useAuthStore } from '@/stores/auth.store';
import { ArrowRight, MapPin, Tag, FileText, Edit, Trash2, ShoppingCart, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const id = params.id as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    getListing(id)
      .then(setListing)
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteListing(id);
      setShowDeleteModal(false);
      setShowDeleted(true);
      setTimeout(() => router.push('/ar/dashboard'), 1500);
    } catch {
      setDeleting(false);
    }
  };

  const isOwner = user?.id === listing?.owner_id;

  if (showDeleted) {
    return (
      <div className="min-h-screen bg-[#1D3E66] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="relative z-10 glass rounded-2xl p-8 text-center max-w-md border border-emerald-400/30">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">تم الحذف بنجاح</h2>
          <p className="text-blue-200/60">تم حذف الإعلان نهائياً. جاري التوجيه...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D3E66] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#1D3E66] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold text-white">الإعلان غير موجود</h2>
          <Link href="/ar"><Button variant="primary" className="mt-4">العودة للرئيسية</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white pb-28 relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">

          {/* شريط علوي */}
          <div className="sticky top-4 z-30 pt-2 pb-4">
            <div className="bg-white/25 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <Button variant="glass" size="sm" onClick={() => router.push('/ar')}>
                <ArrowRight size={18} className="rotate-180" /> رجوع
              </Button>
              <span className="font-bold text-sm text-white">تفاصيل الإعلان</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'الرئيسية', href: '/ar' },
              { label: 'الإعلانات', href: '/ar/search' },
              { label: listing.title },
            ]}
            className="mb-4"
          />

          <h1 className="text-3xl font-bold text-white mb-6">{listing.title}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* الصورة */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-white/20 bg-black/30">
                {listing.image ? (
                  <img src={listing.image} alt={listing.title} className="w-full h-[400px] object-cover" />
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-6xl">📷</div>
                )}
              </div>

              {isOwner && (
                <div className="flex gap-3">
                  <Link href={`/ar/listing/${id}/edit`} className="flex-1">
                    <Button variant="primary" size="lg" className="w-full">
                      <Edit size={18} /> تعديل
                    </Button>
                  </Link>
                  <Button variant="danger" size="lg" className="flex-1" onClick={() => setShowDeleteModal(true)}>
                    <Trash2 size={18} /> حذف
                  </Button>
                </div>
              )}
            </div>

            {/* التفاصيل */}
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6 border border-[var(--border-color)]">
                <div className="text-sm text-blue-200/50 mb-1 flex items-center gap-2">
                  <Tag size={14} className="text-sky-300" /> السعر
                </div>
                <div className="text-4xl font-bold text-sky-300">
                  {Number(listing.price).toLocaleString()} ل.س
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-[var(--border-color)]">
                <div className="text-sm text-blue-200/50 mb-1 flex items-center gap-2">
                  <MapPin size={14} className="text-sky-300" /> المدينة
                </div>
                <div className="text-white font-medium">{listing.city}</div>
              </div>

              <div className="glass rounded-2xl p-6 border border-[var(--border-color)]">
                <div className="text-sm text-blue-200/50 mb-2 flex items-center gap-2">
                  <FileText size={14} className="text-sky-300" /> الوصف
                </div>
                <p className="text-blue-100/80 leading-relaxed">{listing.description}</p>
              </div>

              <div className="glass rounded-2xl p-6 border border-[var(--border-color)]">
                <div className="text-sm text-blue-200/50 mb-1">الحالة</div>
                <Badge variant="success">{listing.status === 'ACTIVE' ? 'نشط' : listing.status}</Badge>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/ar/checkout/${id}`}>
                  <Button variant="primary" size="lg" className="w-full">
                    <ShoppingCart size={18} /> شراء الآن
                  </Button>
                </Link>
                <Button variant="glass" size="lg" className="w-full">
                  <MessageCircle size={18} /> تواصل مع البائع
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal تأكيد الحذف */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center mx-auto">
            <Trash2 size={28} className="text-red-400" />
          </div>
          <p className="text-white">هل أنت متأكد من حذف "{listing.title}"؟</p>
          <div className="flex gap-3 justify-center">
            <Button variant="glass" onClick={() => setShowDeleteModal(false)}>إلغاء</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'جاري الحذف...' : 'نعم، احذف'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}