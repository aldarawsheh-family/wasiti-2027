'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Wallet, ArrowUp, ArrowDown, RefreshCw, History, ArrowRightLeft, Upload, X } from 'lucide-react';

export default function WalletPage() {
  const { accessToken } = useAuthStore();
  const [wallet, setWallet] = useState<any>(null);
  const [statement, setStatement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [amount, setAmount] = useState('');
  const [toWallet, setToWallet] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const tenantId = '00000000-0000-0000-0000-000000000001';
  const apiBase = '/api/wallet';

  useEffect(() => {
    if (accessToken) fetchAll();
  }, [accessToken]);

  const fetchAll = async () => {
    setLoading(true);
    setMessage('');
    try {
      const [walletRes, statementRes] = await Promise.all([
        fetch(apiBase + '/me', {
          headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
        }),
        fetch(apiBase + '/me/statement', {
          headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
        })
      ]);

      const walletData = await walletRes.json();
      const statementData = await statementRes.json();

      if (walletRes.ok) setWallet(walletData);
      else setMessage('Error: ' + (walletData.message || 'Failed to fetch wallet'));

      if (statementRes.ok) setStatement(statementData);
    } catch (err: any) {
      console.error('Wallet fetch error:', err);
      setMessage('Error: ' + (err?.message || 'Connection failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount) { setMessage('الرجاء إدخال المبلغ'); return; }
    setMessage('');
    try {
      const res = await fetch(apiBase + '/request', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'DEPOSIT',
          amount: Number(amount),
          meta: {
            proof_image_url: proofImage ? proofImage.name : '',
            note: ''
          },
          idempotencyKey: crypto.randomUUID()
        })
      });
      const data = await res.json();
      if (res.ok) { setMessage('تم استلام طلبك، بانتظار موافقة المالك'); setShowDeposit(false); setAmount(''); setProofImage(null); }
      else { setMessage('Error: ' + (data.message || 'Failed')); }
    } catch (err: any) { 
      console.error('Deposit error:', err);
      setMessage('Error: ' + (err?.message || 'Connection failed')); 
    }
  };

  const handleWithdraw = async () => {
    if (!amount) { setMessage('الرجاء إدخال المبلغ'); return; }
    if (!bankAccount) { setMessage('الرجاء إدخال رقم الحساب البنكي'); return; }
    setMessage('');
    try {
      const res = await fetch(apiBase + '/request', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'WITHDRAW',
          amount: Number(amount),
          meta: {
            bank_account_number: bankAccount,
            note: ''
          },
          idempotencyKey: crypto.randomUUID()
        })
      });
      const data = await res.json();
      if (res.ok) { setMessage('تم استلام طلبك، بانتظار موافقة المالك'); setShowWithdraw(false); setAmount(''); setBankAccount(''); }
      else { setMessage('Error: ' + (data.message || 'Failed')); }
    } catch (err: any) { 
      console.error('Withdraw error:', err);
      setMessage('Error: ' + (err?.message || 'Connection failed')); 
    }
  };

  const handleTransfer = async () => {
    if (!amount) { setMessage('الرجاء إدخال المبلغ'); return; }
    if (!toWallet) { setMessage('الرجاء إدخال رقم المحفظة المستقبلة'); return; }
    setMessage('');
    try {
      const res = await fetch(apiBase + '/request', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TRANSFER',
          amount: Number(amount),
          meta: {
            recipient_user_id: toWallet,
            note: ''
          },
          idempotencyKey: crypto.randomUUID()
        })
      });
      const data = await res.json();
      if (res.ok) { setMessage('تم استلام طلبك، بانتظار موافقة المالك'); setShowTransfer(false); setAmount(''); setToWallet(''); }
      else { setMessage('Error: ' + (data.message || 'Failed')); }
    } catch (err: any) { 
      console.error('Transfer error:', err);
      setMessage('Error: ' + (err?.message || 'Connection failed')); 
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const isoStr = dateStr.replace(' ', 'T');
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('ar-SY', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getEntryLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'إيداع';
      case 'WITHDRAWAL': return 'سحب';
      case 'TRANSFER': return 'تحويل';
      default: return type;
    }
  };

  const entries = statement?.entries && Array.isArray(statement.entries) ? statement.entries : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-700 text-sm font-semibold text-center cursor-pointer" onClick={() => setMessage('')}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 text-center space-y-4 shadow-md">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-lg">
            <Wallet size={22} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">محفظتي</h2>
        </div>

        <p className="text-gray-500 text-sm">رقم المحفظة</p>
        <p className="text-gray-700 font-mono text-lg" dir="ltr">{wallet?.wallet_number || '——'}</p>
        
        <div className="text-5xl font-extrabold text-gray-900">
          {statement?.finalBalance ?? wallet?.balance ?? '0'} <span className="text-xl text-gray-400 font-medium">ل.س</span>
        </div>

        <div className="flex justify-center gap-3">
          <button onClick={() => { setShowDeposit(!showDeposit); setShowWithdraw(false); setShowTransfer(false); setAmount(''); setToWallet(''); setBankAccount(''); setProofImage(null); }}
            className="bg-[#128C4F] hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 shadow-md">
            <ArrowDown size={14} /> إيداع
          </button>
          <button onClick={() => { setShowWithdraw(!showWithdraw); setShowDeposit(false); setShowTransfer(false); setAmount(''); setToWallet(''); setBankAccount(''); setProofImage(null); }}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 shadow-md">
            <ArrowUp size={14} /> سحب
          </button>
          <button onClick={() => { setShowTransfer(!showTransfer); setShowDeposit(false); setShowWithdraw(false); setAmount(''); setToWallet(''); setBankAccount(''); setProofImage(null); }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 shadow-md">
            <RefreshCw size={14} /> تحويل
          </button>
        </div>

        {showDeposit && (
          <div className="space-y-2 pt-2">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="المبلغ" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm text-center outline-none focus:border-[#128C4F]" />
            <label className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-pointer hover:border-[#128C4F]">
              <Upload size={14} /> {proofImage ? proofImage.name : 'إرفاق صورة الحوالة'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setProofImage(e.target.files?.[0] || null)} />
            </label>
            {proofImage && (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-1 text-gray-500 text-xs">
                <span>تم اختيار الصورة</span>
                <X size={14} className="cursor-pointer hover:text-red-500" onClick={() => setProofImage(null)} />
              </div>
            )}
            <button onClick={handleDeposit} className="w-full bg-[#128C4F] hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold shadow-md">تأكيد الإيداع</button>
          </div>
        )}

        {showWithdraw && (
          <div className="space-y-2 pt-2">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="المبلغ" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm text-center outline-none" />
            <input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)}
              placeholder="رقم الحساب البنكي" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm text-center outline-none" />
            <button onClick={handleWithdraw} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold shadow-md">تأكيد السحب</button>
          </div>
        )}

        {showTransfer && (
          <div className="space-y-2 pt-2">
            <input type="text" value={toWallet} onChange={(e) => setToWallet(e.target.value)}
              placeholder="رقم المحفظة المستقبلة" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm text-center outline-none" />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="المبلغ" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm text-center outline-none" />
            <button onClick={handleTransfer} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl text-sm font-bold shadow-md">تأكيد التحويل</button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <History size={18} className="text-[#128C4F]" />
          <h2 className="font-bold text-gray-900">آخر المعاملات</h2>
          {statement?.totalEntries > 0 && (
            <span className="text-gray-400 text-xs">({statement.totalEntries})</span>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">لا توجد معاملات بعد</p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry: any) => (
              <div key={entry.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  {entry.operation_type === 'DEPOSIT' ? <ArrowDown size={14} className="text-emerald-500" /> :
                   entry.operation_type === 'WITHDRAWAL' ? <ArrowUp size={14} className="text-red-500" /> :
                   <ArrowRightLeft size={14} className="text-blue-500" />}
                  <span className="text-sm font-semibold text-gray-700">
                    {getEntryLabel(entry.operation_type)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-xs">{formatDate(entry.created_at)}</span>
                  <span className={`text-sm font-bold ${entry.entry_type === 'CREDIT' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {entry.entry_type === 'CREDIT' ? '+' : '-'}{entry.amount} ل.س
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}