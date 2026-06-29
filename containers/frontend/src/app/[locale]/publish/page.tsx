'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/features/listings/api/listings';
import { useAuthStore } from '@/stores/auth.store';
import { ArrowRight, UploadCloud, X, MapPin, Tag, FileText, Image as ImageIcon, PlusSquare, List, Home, Search, MessageCircle, User } from 'lucide-react';

const categories = ['سيارات', 'عقارات', 'موبايلات', 'خدمات', 'أثاث', 'وظائف'];

export default function PublishPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    city: '',
    category: '',
    description: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);
      const previews = newFiles.map((f) => URL.createObjectURL(f));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files) {
      const newFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
      setImageFiles((prev) => [...prev, ...newFiles]);
      const previews = newFiles.map((f) => URL.createObjectURL(f));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user?.id) {
      setError('يجب تسجيل الدخول أولاً');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = '';
      if (imageFiles.length > 0) {
        const formData = new FormData();
        formData.append('image', imageFiles[0]);
        const uploadRes = await fetch('/api/listings/upload', {
          method: 'POST',
          headers: { 'tenant-id': '00000000-0000-0000-0000-000000000001' },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData?.url || '';
      }

      await createListing({
        title: formData.title,
        category: formData.category || 'أخرى',
        price: Number(formData.price),
        city: formData.city,
        description: formData.description,
        imageUrl: imageUrl,
        // ownerId: user.id,  ← تم الحذف
      });
      router.push('/ar');
    } catch (err: any) {
      setError(err?.message || 'فشل نشر الإعلان');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans pb-28 relative overflow-x-hidden selection:bg-sky-500/30">

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-400/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 px-4 pb-10">

        <div className="sticky top-4 z-30 pt-2 pb-4">
          <div className="bg-white/25 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <button
              onClick={() => router.push('/ar')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
            >
              <ArrowRight size={18} className="rotate-180" />
              <span className="text-sm font-medium">رجوع</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-xs">ن</span>
              </div>
              <span className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200">نشر إعلان</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-2xl text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100/90">
              <FileText size={16} className="text-sky-300" /> عنوان الإعلان
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-300 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <input
                type="text"
                required
                placeholder="مثال: شقة فاخرة للبيع في دمشق"
                className="relative w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder:text-blue-300/50 outline-none focus:border-sky-400 transition-colors"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-blue-100/90">
                <Tag size={16} className="text-sky-300" /> السعر (ل.س)
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-300 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <input
                  type="number"
                  required
                  placeholder="مثال: 180000000"
                  className="relative w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder:text-blue-300/50 outline-none focus:border-sky-400 transition-colors"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-blue-100/90">
                <MapPin size={16} className="text-sky-300" /> المدينة
              </label>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-300 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <select
                  required
                  className="relative w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-sky-400 transition-colors appearance-none"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="" disabled>اختر المدينة...</option>
                  <option value="دمشق">دمشق</option>
                  <option value="حلب">حلب</option>
                  <option value="حمص">حمص</option>
                  <option value="حماة">حماة</option>
                  <option value="اللاذقية">اللاذقية</option>
                  <option value="طرطوس">طرطوس</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100/90">
              <List size={16} className="text-sky-300" /> الفئة
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-300 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <select
                required
                className="relative w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-sky-400 transition-colors appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="" disabled>اختر الفئة...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100/90">
              <FileText size={16} className="text-sky-300" /> وصف الإعلان
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-300 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <textarea
                required
                rows={5}
                placeholder="اكتب تفاصيل إضافية عن المنتج أو العقار أو الخدمة..."
                className="relative w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder:text-blue-300/50 outline-none focus:border-sky-400 transition-colors resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-blue-100/90">
              <ImageIcon size={16} className="text-sky-300" /> رفع الصور
            </label>

            {imagePreviews.length === 0 ? (
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer hover:scale-[1.01] ${
                  isDragging
                    ? 'border-sky-400 bg-sky-500/10 shadow-[0_0_30px_rgba(56,189,248,0.1)]'
                    : 'border-white/20 bg-black/20 backdrop-blur-sm hover:border-white/40'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleImageUpload}
                />
                <div className="flex flex-col items-center gap-2 relative z-0">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-white/20 flex items-center justify-center">
                    <UploadCloud size={32} className="text-sky-300" />
                  </div>
                  <p className="text-sm font-medium text-white/80">اسحب الصور هنا أو اضغط للرفع</p>
                  <p className="text-xs text-blue-300/50">يدعم صيغ JPG, PNG, WEBP</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/20 group">
                    <img src={img} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-red-500 transition-colors border border-red-400/30"
                    >
                      <X size={16} className="text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] text-white/80 border border-white/10">
                      صورة {index + 1}
                    </div>
                  </div>
                ))}
                <label className="aspect-square rounded-2xl border-2 border-dashed border-white/20 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <PlusSquare size={24} className="text-blue-300/60" />
                  <span className="text-[10px] text-blue-300/50">إضافة صورة</span>
                </label>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-white font-bold text-base py-4 rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.25)] active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusSquare size={20} />
            {loading ? 'جاري النشر...' : 'نشر الإعلان الآن'}
          </button>
        </form>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-gradient-to-r from-cyan-600/90 via-blue-600/90 to-indigo-600/90 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.5)] flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_80%)] pointer-events-none"></div>
          {[
            { id: 'home', label: 'الرئيسية', icon: Home, href: '/ar' },
            { id: 'search', label: 'بحث', icon: Search, href: '/ar/search' },
            { id: 'add', label: 'نشر', icon: PlusSquare, href: '/ar/publish' },
            { id: 'chat', label: 'رسائل', icon: MessageCircle, href: '/ar/chat' },
            { id: 'profile', label: 'حسابي', icon: User, href: '/ar/dashboard' },
          ].map((item) => {
            const isActive = item.href === '/ar/publish';
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="flex flex-col items-center gap-1 transition-all active:scale-95 w-14 py-1 rounded-xl hover:bg-white/20 relative z-10"
              >
                {isActive && (
                  <div className="absolute -top-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)]"></div>
                )}
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'text-white/70 hover:text-white'}`} />
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-white font-bold drop-shadow-sm' : 'text-white/70'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}