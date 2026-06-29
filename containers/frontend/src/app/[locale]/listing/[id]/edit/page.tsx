'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getListing, updateListing, deleteListing } from '@/features/listings/api/listings';
import { ArrowRight, Save, Trash2, Home, Search, PlusSquare, MessageCircle, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

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
      await updateListing(id, {
        title: listing.title,
        category: listing.category,
        price: Number(listing.price),
        city: listing.city,
        description: listing.description,
      });
      setToast({ type: 'success', message: 'تم تحديث الإعلان بنجاح!' });
      setTimeout(() => router.push(`/ar/listing/${id}`), 1500);
    } catch {
      setToast({ type: 'error', message: 'فشل تحديث الإعلان' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setToast({
      type: 'confirm',
      message: `هل أنت متأكد من حذف "${listing.title}"؟`,
      onConfirm: async () => {
        try {
          await deleteListing(id);
          setToast({ type: 'success', message: 'تم حذف الإعلان بنجاح' });
          setTimeout(() => router.push('/ar/dashboard'), 1500);
        } catch {
          setToast({ type: 'error', message: 'فشل حذف الإعلان' });
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D3E66] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white pb-28 relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 px-4 pb-10">
        {/* شريط علوي */}
        <div className="sticky top-4 z-30 pt-2 pb-4">
          <div className="bg-white/25 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <Button variant="glass" size="sm" onClick={() => router.push(`/ar/listing/${id}`)}>
              <ArrowRight size={18} className="rotate-180" /> رجوع
            </Button>
            <span className="font-bold text-sm text-white">تعديل الإعلان</span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4 mt-2">
          <Input label="عنوان الإعلان" value={listing.title} onChange={(e) => setListing({ ...listing, title: e.target.value })} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="السعر (ل.س)" type="number" value={listing.price} onChange={(e) => setListing({ ...listing, price: e.target.value })} required />
            <Input label="المدينة" value={listing.city} onChange={(e) => setListing({ ...listing, city: e.target.value })} required list="cities" />
            <datalist id="cities">{cities.map(c => <option key={c} value={c} />)}</datalist>
          </div>

          <Input label="الفئة" value={listing.category} onChange={(e) => setListing({ ...listing, category: e.target.value })} required list="cats" />
          <datalist id="cats">{categories.map(c => <option key={c} value={c} />)}</datalist>

          <div className="space-y-1">
            <label className="text-sm text-blue-100/90">وصف الإعلان</label>
            <textarea
              value={listing.description}
              onChange={(e) => setListing({ ...listing, description: e.target.value })}
              rows={5}
              className="w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 text-white outline-none focus:border-sky-400 resize-none"
            />
          </div>

          {listing.image && (
            <img src={listing.image} alt="" className="rounded-2xl w-full max-h-48 object-cover border border-white/20" />
          )}

          <div className="flex gap-3">
            <Button type="submit" variant="success" size="lg" className="flex-1" disabled={saving}>
              <Save size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
            <Button type="button" variant="danger" size="lg" onClick={handleDelete}>
              <Trash2 size={18} /> حذف
            </Button>
          </div>
        </form>
      </div>

      {/* الشريط السفلي */}
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-gradient-to-r from-cyan-600/90 via-blue-600/90 to-indigo-600/90 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-3 shadow-xl flex justify-between">
          {[{ icon: Home, href: '/ar' }, { icon: Search, href: '/ar/search' }, { icon: PlusSquare, href: '/ar/publish' }, { icon: MessageCircle, href: '/ar/chat' }, { icon: User, href: '/ar/dashboard' }].map((item, i) => (
            <button key={i} onClick={() => router.push(item.href)} className="p-2 hover:bg-white/20 rounded-xl">
              <item.icon size={20} className="text-white/70" />
            </button>
          ))}
        </div>
      </div>

      {/* Modal تأكيد الحذف */}
      <Modal open={toast?.type === 'confirm'} onClose={() => setToast(null)} size="sm">
        <div className="text-center space-y-4">
          <Trash2 size={32} className="text-red-400 mx-auto" />
          <p className="text-white">{toast?.message}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="glass" onClick={() => setToast(null)}>إلغاء</Button>
            <Button variant="danger" onClick={() => { toast?.onConfirm?.(); setToast(null); }}>نعم، احذف</Button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && toast.type !== 'confirm' && (
        <div className="fixed bottom-24 left-4 right-4 z-[200] bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-2xl px-4 py-3 text-emerald-200 text-center text-sm" onClick={() => setToast(null)}>
          {toast.message}
        </div>
      )}
    </div>
  );
}