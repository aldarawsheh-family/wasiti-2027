'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Building2, Settings, Ban, X, Save } from 'lucide-react';

export default function AdminTenantsPage() {
  const { accessToken } = useAuthStore();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<any>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const tenantId = '00000000-0000-0000-0000-000000000001';

  const fetchCompanies = () => {
    if (!accessToken) return;
    setLoading(true);
    fetch('/api/companies', {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
    })
      .then(r => r.json())
      .then(data => {
        setCompanies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => { setCompanies([]); setLoading(false); });
  };

  useEffect(() => { fetchCompanies(); }, [accessToken]);

  const openEdit = (company: any) => {
    setEditModal(company);
    setEditName(company.name || '');
    setEditType(company.type || '');
  };

  const handleSave = async () => {
    if (!editModal) return;
    try {
      await fetch(`/api/companies/${editModal.id}`, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, type: editType })
      });
      setEditModal(null);
      fetchCompanies();
    } catch {}
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-2xl w-64"></div>
          <div className="h-48 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <Building2 size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">المستأجرين والشركات</h1>
          <p className="text-gray-500 mt-0.5">{companies.length} شركة مسجلة</p>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Building2 size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">لا يوجد شركات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((c: any) => (
            <div key={c.id} className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">نشط</span>
              </div>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between"><span>النوع</span><span className="text-gray-700 font-semibold">{c.type || '—'}</span></div>
                <div className="flex justify-between"><span>المالك</span><span className="text-gray-700 font-semibold">{c.owner_id?.substring(0, 8) || '—'}</span></div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(c)} className="flex-1 py-2.5 rounded-xl bg-[#128C4F] text-white text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-1">
                  <Settings size={14} /> إعدادات
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-1">
                  <Ban size={14} /> تعطيل
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">إعدادات الشركة</h2>
              <button onClick={() => setEditModal(null)} className="p-2 rounded-xl hover:bg-gray-100"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">اسم الشركة</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">النوع</label>
                <select value={editType} onChange={e => setEditType(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] bg-white">
                  <option value="ENTERPRISE">مؤسسة</option>
                  <option value="DEALER">تاجر</option>
                  <option value="SHOP">متجر</option>
                  <option value="TECHNOLOGY">تقنية</option>
                  <option value="SERVICE">خدمات</option>
                </select>
              </div>
              <button onClick={handleSave} className="w-full bg-[#128C4F] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition">
                <Save size={18} /> حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}