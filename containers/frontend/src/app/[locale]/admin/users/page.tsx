'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Users, Edit, Trash2, Check, X, AlertTriangle, Search, Shield, Mail, Calendar } from 'lucide-react';

type User = {
  id: string;
  email: string;
  display_name?: string;
  name?: string;
  role: string;
  phone?: string;
  created_at: string;
};

export default function AdminUsersPage() {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const apiBase = '/api/users';
  const tenantId = '00000000-0000-0000-0000-000000000001';

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = () => {
    setLoading(true);
    fetch(apiBase, {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
    })
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setUsers(list);
        setFilteredUsers(list);
        setLoading(false);
      })
      .catch(() => { setUsers([]); setFilteredUsers([]); setLoading(false); });
  };

  useEffect(() => { if (accessToken) fetchUsers(); }, [accessToken]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(users.filter(u =>
        (u.display_name || u.email).toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      ));
    }
  }, [searchTerm, users]);

  const handleRoleChange = async (userId: string) => {
    if (!newRole) return;
    try {
      const res = await fetch(apiBase + '/' + userId + '/role', {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showToast('✅ تم تغيير الدور بنجاح', 'success');
        setEditingRole(null);
        setNewRole('');
        fetchUsers();
      } else {
        const d = await res.json();
        showToast('❌ ' + (d.message || 'فشل تغيير الدور'), 'error');
      }
    } catch {
      showToast('❌ فشل الاتصال بالخادم', 'error');
    }
  };

  const handleDelete = async (userId: string) => {
    setDeletingId(userId);
    try {
      const res = await fetch(apiBase + '/' + userId, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
      });
      if (res.ok) {
        showToast('✅ تم حذف المستخدم بنجاح', 'success');
        setConfirmDelete(null);
        fetchUsers();
      } else {
        const d = await res.json();
        showToast('❌ ' + (d.message || 'فشل حذف المستخدم'), 'error');
      }
    } catch {
      showToast('❌ فشل الاتصال بالخادم', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const roleOptions = [
    { value: 'USER', label: 'مستخدم', icon: '👤' },
    { value: 'SELLER', label: 'بائع', icon: '🏪' },
    { value: 'COMPANY_ADMIN', label: 'مدير شركة', icon: '🏢' },
    { value: 'MODERATOR', label: 'مراقب', icon: '🛡️' },
    { value: 'SUPPORT', label: 'دعم فني', icon: '🎧' },
    { value: 'ADMIN', label: 'مدير', icon: '⚙️' },
    { value: 'PLATFORM_OWNER', label: 'مالك المنصة', icon: '👑' },
  ];

  const getRoleInfo = (role: string) => {
    return roleOptions.find(r => r.value === role) || { label: role, icon: '👤' };
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'PLATFORM_OWNER': return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-300 shadow-amber-100';
      case 'ADMIN': return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-300 shadow-emerald-100';
      case 'SUPPORT': return 'bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-teal-300 shadow-teal-100';
      case 'MODERATOR': return 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border-violet-300 shadow-violet-100';
      case 'COMPANY_ADMIN': return 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-300 shadow-orange-100';
      case 'SELLER': return 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-300 shadow-sky-100';
      default: return 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border-gray-200';
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'ADMIN' || u.role === 'PLATFORM_OWNER').length,
    sellers: users.filter(u => u.role === 'SELLER').length,
    regular: users.filter(u => u.role === 'USER').length,
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>)}
          </div>
          <div className="h-12 bg-gray-100 rounded-2xl"></div>
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold animate-slide-in ${
          toast.type === 'success'
            ? 'bg-white border border-emerald-200 text-emerald-700'
            : 'bg-white border border-red-200 text-red-700'
        }`}>
          <span className="text-lg">{toast.type === 'success' ? '✅' : '❌'}</span>
          {toast.message}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">تأكيد الحذف</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              هل أنت متأكد من حذف هذا المستخدم؟<br/>
              <span className="text-red-500 font-medium">هذا الإجراء لا يمكن التراجع عنه.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-5 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete}
                className="flex-1 px-5 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {deletingId === confirmDelete ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                نعم، حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header + Stats */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
              <Users size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">إدارة المستخدمين</h1>
              <p className="text-gray-500 mt-0.5">إدارة جميع المستخدمين وصلاحياتهم</p>
            </div>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-72 pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-100 bg-white text-gray-700 placeholder-gray-400 focus:border-[#128C4F] focus:ring-4 focus:ring-[#128C4F]/10 transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'إجمالي المستخدمين', value: stats.total, icon: Users, color: 'from-gray-600 to-gray-800' },
            { label: 'المديرين', value: stats.admins, icon: Shield, color: 'from-emerald-500 to-[#128C4F]' },
            { label: 'البائعين', value: stats.sellers, icon: Edit, color: 'from-sky-500 to-blue-600' },
            { label: 'المستخدمين العاديين', value: stats.regular, icon: Mail, color: 'from-violet-500 to-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-400">{stat.label}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-50 flex items-center justify-center">
            <Users size={40} className="text-gray-300" />
          </div>
          <p className="text-gray-400 text-lg font-medium">
            {searchTerm ? 'لا يوجد نتائج للبحث' : 'لا يوجد مستخدمين'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-right px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">المستخدم</th>
                  <th className="text-right px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">البريد</th>
                  <th className="text-right px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">الدور</th>
                  <th className="text-right px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">التاريخ</th>
                  <th className="text-right px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 transition-colors duration-150 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#128C4F]/10 to-emerald-50 flex items-center justify-center ring-2 ring-[#128C4F]/10">
                          <span className="text-[#128C4F] font-bold text-sm">
                            {(user.display_name || user.name || user.email)[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900 block">
                            {user.display_name || user.name || user.email}
                          </span>
                          <span className="text-xs text-gray-400 md:hidden">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-300" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingRole === user.id ? (
                        <div className="flex items-center gap-2 animate-fade-in">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="border-2 border-[#128C4F] rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 bg-white focus:outline-none focus:ring-4 focus:ring-[#128C4F]/10"
                          >
                            <option value="">اختر الدور</option>
                            {roleOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                            ))}
                          </select>
                          <button onClick={() => handleRoleChange(user.id)} className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/30">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setEditingRole(null)} className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all duration-200">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getRoleStyle(user.role)}`}>
                          {getRoleInfo(user.role).icon}
                          {getRoleInfo(user.role).label}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-300" />
                        {new Date(user.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => { setEditingRole(user.id); setNewRole(user.role || 'USER'); }}
                          className="p-2.5 rounded-xl text-[#128C4F] hover:bg-[#128C4F]/10 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="تغيير الدور"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(user.id)}
                          className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-95"
                          title="حذف المستخدم"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              عرض {filteredUsers.length} من {users.length} مستخدم
            </p>
          </div>
        </div>
      )}
    </div>
  );
}