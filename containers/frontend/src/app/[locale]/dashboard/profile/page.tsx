'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import { ArrowRight, User, Mail, Phone, Edit, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState({
    name: 'أحمد المحمد',
    email: 'ahmed@example.com',
    phone: '+963 123 456 789',
  });

  const handleSave = () => {
    setIsEditing(false);
    setShowToast(true);
  };

  return (
    <div className="space-y-6">
      {showToast && <Toast message="تم حفظ التغييرات بنجاح!" type="success" onClose={() => setShowToast(false)} />}

      <div className="flex justify-between items-center pt-2">
        <Button variant="glass" size="sm" onClick={() => router.push('/ar/dashboard')}>
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </Button>
        <span className="font-bold text-white">الملف الشخصي</span>
      </div>

      <div className="flex justify-center">
        <Avatar name={user.name} size="lg" className="w-20 h-20 text-2xl" />
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">المعلومات الشخصية</h2>
          <Button variant={isEditing ? 'secondary' : 'primary'} size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <><X size={16} /> إلغاء</> : <><Edit size={16} /> تعديل</>}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input label="الاسم" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
            <Input label="البريد الإلكتروني" type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
            <Input label="رقم الهاتف" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
            <Button variant="success" size="lg" className="w-full" onClick={handleSave}><Save size={18} /> حفظ التغييرات</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[var(--bg-input)] rounded-xl p-4">
              <div className="text-xs text-[var(--text-secondary)] mb-1">الاسم</div>
              <div className="text-white font-medium flex items-center gap-2"><User size={16} className="text-[var(--color-primary)]" /> {user.name}</div>
            </div>
            <div className="bg-[var(--bg-input)] rounded-xl p-4">
              <div className="text-xs text-[var(--text-secondary)] mb-1">البريد الإلكتروني</div>
              <div className="text-white font-medium flex items-center gap-2"><Mail size={16} className="text-[var(--color-primary)]" /> {user.email}</div>
            </div>
            <div className="bg-[var(--bg-input)] rounded-xl p-4">
              <div className="text-xs text-[var(--text-secondary)] mb-1">رقم الهاتف</div>
              <div className="text-white font-medium flex items-center gap-2"><Phone size={16} className="text-[var(--color-primary)]" /> {user.phone}</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}