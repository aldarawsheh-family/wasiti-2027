'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getListing, deleteListing } from '@/features/listings/api/listings';
import { useAuthStore } from '@/stores/auth.store';
import { ArrowRight, MapPin, Tag, FileText, Edit, Trash2, ShoppingCart, MessageCircle } from 'lucide-react';

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const id = params.id as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    getListing(id).then(setListing).catch(() => setListing(null)).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteListing(id); setShowDelete(false); router.push('/ar/dashboard'); }
    catch { setDeleting(false); }
  };

  const isOwner = user?.id === listing?.owner_id;

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" /></div>;
  if (!listing) return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-900">الإعلان غير موجود</h2></div>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/ar')} className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition font-medium text-sm">
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </button>
        <span className="font-bold text-gray-900">تفاصيل الإعلان</span>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900">{listing.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50">
            {listing.image ? (
              <img src={listing.image} alt={listing.title} className="w-full h-[400px] object-cover" />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-6xl">📷</div>
            )}
          </div>
          {isOwner && (
            <div className="flex gap-3">
              <Link href={`/ar/listing/${id}/edit`} className="flex-1 bg-[#128C4F] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition">
                <Edit size={18} /> تعديل
              </Link>
              <button onClick={() => setShowDelete(true)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition">
                <Trash2 size={18} /> حذف
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="text-sm text-gray-400 mb-1 flex items-center gap-2"><Tag size={14} className="text-[#128C4F]" /> السعر</div>
            <div className="text-4xl font-extrabold text-[#128C4F]">{Number(listing.price).toLocaleString()} ل.س</div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="text-sm text-gray-400 mb-1 flex items-center gap-2"><MapPin size={14} className="text-[#128C4F]" /> المدينة</div>
            <div className="text-gray-900 font-semibold">{listing.city}</div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            <div className="text-sm text-gray-400 mb-2 flex items-center gap-2"><FileText size={14} className="text-[#128C4F]" /> الوصف</div>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>
          <div className="flex gap-3">
            <Link href={`/ar/checkout/${id}`} className="flex-1 bg-[#128C4F] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition"><ShoppingCart size={18} /> شراء الآن</Link>
            <button className="flex-1 border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition"><MessageCircle size={18} /> تواصل</button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDelete(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <Trash2 size={40} className="text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-bold mb-4">هل أنت متأكد من حذف "{listing.title}"؟</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold">إلغاء</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold">{deleting ? 'جاري...' : 'نعم، احذف'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}