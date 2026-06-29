'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, User, MapPin, Phone, FileText, ShoppingCart, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setListing({ id, title: 'تويوتا كورولا 2020 - بحالة ممتازة', price: 25000, seller: 'أحمد المحمد' });
      setLoading(false);
    }, 500);
  }, [id]);

  const [formData, setFormData] = useState({ name: '', address: '', phone: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); router.push('/ar/dashboard'); }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="text-[var(--text-secondary)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">المنتج غير موجود</h2>
          <Link href="/ar"><Button variant="primary" className="mt-4">العودة للصفحة الرئيسية</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--bg-dark)] text-white font-sans flex justify-center relative">
      <div className="w-full max-w-[430px] relative px-4 py-8 pb-28">

        <div className="grid grid-cols-1 gap-6">
          
          {/* نموذج الطلب */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)]">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={18} className="text-[var(--color-primary)]" /> بيانات الشحن
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="الاسم الكامل" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="أدخل اسمك الكامل" required />
              <Input label="العنوان" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="أدخل عنوان الشحن" required />
              <Input label="رقم الهاتف" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="أدخل رقم هاتفك" required />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-secondary)]">ملاحظات إضافية</label>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-white placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--color-primary)] transition-all resize-none" rows={3} placeholder="أي ملاحظات إضافية للبائع..." />
              </div>
              <Button type="submit" disabled={submitting} size="lg" className="w-full">
                <ShoppingCart size={18} /> {submitting ? 'جاري تأكيد الطلب...' : 'تأكيد الشراء'}
              </Button>
            </form>
          </div>

          {/* ملخص الطلب */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-color)] space-y-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Package size={18} className="text-[var(--color-primary)]" /> ملخص الطلب
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">المنتج</span>
                <span className="text-white font-medium">{listing.title}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">البائع</span>
                <span className="text-white font-medium">{listing.seller}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">السعر</span>
                <span className="text-[var(--color-primary)] font-bold">{listing.price.toLocaleString()} ل.س</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[var(--text-secondary)]">الإجمالي</span>
                <span className="text-[var(--color-primary)] font-bold text-xl">{listing.price.toLocaleString()} ل.س</span>
              </div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-300 shrink-0" />
              <p className="text-emerald-200 text-sm">سيتم تأكيد الطلب بعد مراجعة البائع.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}