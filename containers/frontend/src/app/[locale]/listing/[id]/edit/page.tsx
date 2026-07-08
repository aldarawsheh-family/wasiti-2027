'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getListing, updateListing, deleteListing } from '@/features/listings/api/listings';
import { ArrowRight, Save, Trash2 } from 'lucide-react';

const categories = ['سيارات', 'عقارات', 'موبايلات', 'خدمات', 'أثاث', 'وظائف'];
const cities = ['دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس'];

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState<any>({ title: '', price: 0, city: '', category: '', description: '', image: '' });
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'confirm'; message: string; onConfirm?: () => void } | null>(null);

  useEffect(() => {
    getListing(id)
      .then((data: any) => {
        const item = data.data || data;
        setListing({
          title: item.title || '',
          price: item.price || 0,
          city: item.city || '',
          category: item.category || '',
          description: item.description || '',
          image: item.image || '',
        });
      })
      .catch(() => setToast({ type: 'error', message: 'فشل تحميل الإعلان' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateListing(id, { title: listing.title, category: listing.category, price: Number(listing.price), city: listing.city, description: listing.description });
      setToast({ type: 'success', message: 'تم تحديث الإعلان بنجاح!' });
      setTimeout(() => router.push(`/ar/listing/${id}`), 1500);
    } catch { setToast({ type: 'error', message: 'فشل تحديث الإعلان' }); }
    finally { setSaving(false); }
  };

  const handleDelete = () => {
    setToast({ type: 'confirm', message: `هل أنت متأكد من حذف "${listing.title}"؟`, onConfirm: async () => {
      try { await deleteListing(id); setToast({ type: 'success', message: 'تم حذف الإعلان' }); setTimeout(() => router.push('/ar/dashboard'), 1500); }
      catch { setToast({ type: 'error', message: 'فشل حذف الإعلان' }); }
    }});
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push(`/ar/listing/${id}`)} className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition font-medium text-sm">
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </button>
        <h1 className="text-xl font-bold text-gray-900">تعديل الإعلان</h1>
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-md space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">عنوان الإعلان</label>
          <input value={listing.title} onChange={e => setListing({ ...listing, title: e.target.value })} required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">السعر (ل.س)</label>
            <input type="number" value={listing.price} onChange={e => setListing({ ...listing, price: e.target.value })} required className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">المدينة</label>
            <input value={listing.city} onChange={e => setListing({ ...listing, city: e.target.value })} required list="cities" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
            <datalist id="cities">{cities.map(c => <option key={c} value={c} />)}</datalist>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">الفئة</label>
          <input value={listing.category} onChange={e => setListing({ ...listing, category: e.target.value })} required list="cats" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
          <datalist id="cats">{categories.map(c => <option key={c} value={c} />)}</datalist>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">وصف الإعلان</label>
          <textarea value={listing.description} onChange={e => setListing({ ...listing, description: e.target.value })} rows={5} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] resize-none" />
        </div>

        {listing.image && <img src={listing.image} alt="" className="rounded-2xl w-full max-h-48 object-cover border-2 border-gray-200" />}

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="flex-1 bg-[#128C4F] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg">
            <Save size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
          <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-600 transition shadow-lg">
            <Trash2 size={18} /> حذف
          </button>
        </div>
      </form>

      {/* Confirm Modal */}
      {toast?.type === 'confirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setToast(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <Trash2 size={40} className="text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-bold mb-4">{toast.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setToast(null)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold">إلغاء</button>
              <button onClick={() => { toast.onConfirm?.(); setToast(null); }} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold">نعم، احذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && toast.type !== 'confirm' && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-gray-200 rounded-2xl px-5 py-3 text-gray-700 font-semibold shadow-xl cursor-pointer" onClick={() => setToast(null)}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}
    </div>
  );
}