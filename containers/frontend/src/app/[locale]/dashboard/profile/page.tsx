'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { ArrowRight, User, Mail, Phone, Edit, Save, X, Check, Shield } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { accessToken, user: authUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });

  const tenantId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    if (accessToken) {
      fetch('/api/users/profile', {
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId, 'user-id': authUser?.id || '' }
      })
        .then(r => r.json())
        .then(data => {
          setUser({
            name: data.displayName || data.display_name || data.name || data.email || '',
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || authUser?.role || '',
          });
        })
        .catch(() => {});
    }
  }, [accessToken]);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'tenant-id': tenantId,
          'Content-Type': 'application/json',
          'user-id': authUser?.id || ''
        },
        body: JSON.stringify({ displayName: user.name, phone: user.phone })
      });
      if (res.ok) {
        setIsEditing(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 bg-white border border-emerald-200 rounded-2xl shadow-xl text-emerald-700 font-semibold text-sm animate-bounce">
          <Check size={18} className="text-emerald-500" />
          تم حفظ التغييرات بنجاح!
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/ar/dashboard')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition-colors font-medium text-sm"
        >
          <ArrowRight size={18} className="rotate-180" />
          رجوع
        </button>
        <h1 className="text-xl font-bold text-gray-900">الملف الشخصي</h1>
      </div>

      {/* Avatar + Role */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#128C4F]/10 to-emerald-50 ring-4 ring-white shadow-xl flex items-center justify-center">
            <span className="text-3xl font-extrabold text-[#128C4F]">
              {(user.name || '?')[0].toUpperCase()}
            </span>
          </div>
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <Shield size={14} />
            {user.role}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-5 shadow-md">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">المعلومات الشخصية</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isEditing
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-[#128C4F] text-white hover:bg-emerald-700 shadow-lg shadow-[#128C4F]/20'
            }`}
          >
            {isEditing ? <><X size={16} /> إلغاء</> : <><Edit size={16} /> تعديل</>}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">الاسم</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] focus:ring-4 focus:ring-[#128C4F]/10 transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-400 bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">رقم الهاتف</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] focus:ring-4 focus:ring-[#128C4F]/10 transition"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
            >
              <Save size={18} /> حفظ التغييرات
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#128C4F]/10 flex items-center justify-center">
                <User size={18} className="text-[#128C4F]" />
              </div>
              <div>
                <div className="text-xs text-gray-400">الاسم</div>
                <div className="text-gray-900 font-semibold">{user.name}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#128C4F]/10 flex items-center justify-center">
                <Mail size={18} className="text-[#128C4F]" />
              </div>
              <div>
                <div className="text-xs text-gray-400">البريد الإلكتروني</div>
                <div className="text-gray-900 font-semibold">{user.email}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#128C4F]/10 flex items-center justify-center">
                <Phone size={18} className="text-[#128C4F]" />
              </div>
              <div>
                <div className="text-xs text-gray-400">رقم الهاتف</div>
                <div className="text-gray-900 font-semibold">{user.phone || 'غير محدد'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}