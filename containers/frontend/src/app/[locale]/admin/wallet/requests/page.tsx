'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Check, X, Wallet, Eye, Image } from 'lucide-react';

export default function AdminWalletRequests() {
  const { accessToken, user } = useAuthStore();
  const [requests, setRequests] = useState<any[]>([]);
  const [filter, setFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<string | null>(null);

  const tenantId = '00000000-0000-0000-0000-000000000001';
  const apiBase = '/api/wallet';

  useEffect(() => {
    if (accessToken) fetchRequests();
  }, [accessToken, filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url = apiBase + '/requests' + (filter !== 'ALL' ? `?status=${filter}` : '');
      const res = await fetch(url, {
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!approvingId) return;
    try {
      const res = await fetch(apiBase + '/approve/' + approvingId, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
      });
      if (res.ok) {
        setMessage('✅ تمت الموافقة بنجاح');
        setApprovingId(null);
        fetchRequests();
      } else {
        const data = await res.json();
        setMessage('❌ ' + (data.message || 'خطأ في الموافقة'));
      }
    } catch {
      setMessage('❌ خطأ في الموافقة');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReject = async (id: string) => {
    if (!reason) return;
    try {
      const res = await fetch(apiBase + '/reject/' + id, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        setMessage('✅ تم الرفض');
        setRejectingId(null);
        setReason('');
        fetchRequests();
      }
    } catch {
      setMessage('❌ خطأ في الرفض');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { DEPOSIT: 'إيداع', WITHDRAW: 'سحب', TRANSFER: 'تحويل' };
    return labels[type] || type;
  };

  const getTypeStyle = (type: string) => {
    const styles: Record<string, string> = {
      DEPOSIT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      WITHDRAW: 'bg-red-50 text-red-700 border-red-200',
      TRANSFER: 'bg-blue-50 text-blue-700 border-blue-200',
    };
    return styles[type] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      REJECTED: 'bg-red-50 text-red-700 border-red-200',
    };
    const labels: Record<string, string> = { PENDING: '⏳ قيد الانتظار', APPROVED: '✅ مقبول', REJECTED: '❌ مرفوض' };
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Message Toast */}
      {message && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 text-center text-gray-700 font-medium shadow-lg cursor-pointer" onClick={() => setMessage('')}>
          {message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
            <Wallet size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">طلبات المحفظة</h1>
            <p className="text-gray-500 mt-0.5">{requests.length} طلب</p>
          </div>
        </div>
        <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'ALL' ? 'الكل' : f === 'PENDING' ? 'معلق' : f === 'APPROVED' ? 'مقبول' : 'مرفوض'}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
            <Wallet size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getTypeStyle(req.type)}`}>
                    {getTypeLabel(req.type)}
                  </span>
                  <span className="text-gray-400 text-sm font-mono">{req.wallet_number}</span>
                </div>
                {getStatusBadge(req.status)}
              </div>

              <div className="text-3xl font-extrabold text-gray-900">
                {req.amount?.toLocaleString()} <span className="text-lg text-gray-400 font-medium">ل.س</span>
              </div>

                          {/* Proof Image Button */}
              {req.type === 'DEPOSIT' && req.meta?.proof_image_url && (
                <button
                  onClick={() => {
                    const url = req.meta.proof_image_url;
                    const fullUrl = url.startsWith('http') ? url : `/api/files/${url}`;
                    setImageModal(fullUrl);
                  }}
                  className="inline-flex items-center gap-2 text-[#128C4F] hover:text-emerald-700 text-sm font-semibold bg-emerald-50 px-4 py-2 rounded-xl transition-colors"
                >
                  <Eye size={16} />
                  عرض صورة الحوالة
                </button>
              )}

              {req.status === 'APPROVED' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-emerald-700 text-sm">
                  الرصيد قبل: {req.balance_before} ل.س → بعد: {req.balance_after} ل.س
                </div>
              )}

              {req.status === 'REJECTED' && req.rejection_reason && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2 text-red-600 text-sm">
                  سبب الرفض: {req.rejection_reason}
                </div>
              )}

              {req.status === 'PENDING' && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setApprovingId(req.id)}
                    className="flex-1 bg-[#128C4F] hover:bg-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-[#128C4F]/20"
                  >
                    <Check size={16} /> موافقة
                  </button>
                  {rejectingId === req.id ? (
                    <div className="flex-[2] flex gap-2">
                      <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="سبب الرفض"
                        className="flex-1 border-2 border-red-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-400"
                        autoFocus
                      />
                      <button onClick={() => handleReject(req.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
                        تأكيد
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setRejectingId(req.id); setReason(''); }}
                      className="flex-1 border-2 border-red-200 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition"
                    >
                      <X size={16} /> رفض
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {approvingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setApprovingId(null)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Check size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">تأكيد الموافقة</h3>
            <p className="text-gray-500 mb-6">سيتم تنفيذ العملية وتحديث رصيد المحفظة. لا يمكن التراجع.</p>
            <div className="flex gap-3">
              <button onClick={() => setApprovingId(null)} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition">
                إلغاء
              </button>
              <button onClick={handleApprove} className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20">
                نعم، موافقة
              </button>
            </div>
          </div>
        </div>
      )}

         {/* Image Modal */}
      {imageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setImageModal(null)}>
          <button
            onClick={() => setImageModal(null)}
            className="absolute top-6 right-6 text-white hover:bg-white/20 transition-colors z-10 bg-black/40 rounded-xl p-3"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img
              src={imageModal}
              alt="صورة الحوالة"
              className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
              style={{ minWidth: '300px', minHeight: '300px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}