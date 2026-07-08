'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Hotel, Plus, Star, MapPin, Bed, Calendar, X } from 'lucide-react';

export default function BookingDashboardPage() {
  const { accessToken } = useAuthStore();
  const [properties, setProperties] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [propertyForm, setPropertyForm] = useState({ name: '', city: '', address: '', starRating: 5, description: '' });
  const [roomForm, setRoomForm] = useState({ roomType: '', pricePerNight: 0, quantity: 1, viewType: '', maxGuests: 2 });

  const companyId = 'a3cea121-df67-4f9b-91ef-07391047ec64';

  const fetchProperties = () => {
    if (!accessToken) return;
    fetch(`/api/booking/${companyId}/properties`, {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'user-role': 'COMPANY_ADMIN' }
    })
      .then(r => r.json())
      .then(data => { setProperties(Array.isArray(data) ? data : []); setLoading(false); });
  };

  const fetchRooms = (propertyId: string) => {
    fetch(`/api/booking/properties/${propertyId}/rooms`, {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'user-role': 'COMPANY_ADMIN' }
    })
      .then(r => r.json())
      .then(data => setRooms(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchProperties(); }, [accessToken]);

  const handleCreateProperty = async () => {
    await fetch(`/api/booking/${companyId}/properties`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'Content-Type': 'application/json', 'user-role': 'COMPANY_ADMIN' },
      body: JSON.stringify({ ...propertyForm, amenities: [] })
    });
    setShowPropertyForm(false);
    setPropertyForm({ name: '', city: '', address: '', starRating: 5, description: '' });
    fetchProperties();
  };

  const handleCreateRoom = async () => {
    if (!selectedProperty) return;
    await fetch(`/api/booking/properties/${selectedProperty}/rooms`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'Content-Type': 'application/json', 'user-role': 'COMPANY_ADMIN' },
      body: JSON.stringify(roomForm)
    });
    setShowRoomForm(false);
    setRoomForm({ roomType: '', pricePerNight: 0, quantity: 1, viewType: '', maxGuests: 2 });
    fetchRooms(selectedProperty);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
            <Hotel size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">الفنادق والغرف</h1>
            <p className="text-gray-500 mt-0.5">{properties.length} فندق</p>
          </div>
        </div>
        <button onClick={() => setShowPropertyForm(!showPropertyForm)} className="bg-[#128C4F] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg">
          <Plus size={18} /> إضافة فندق
        </button>
      </div>

      {/* Property Form */}
      {showPropertyForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
          <div className="flex justify-between"><h3 className="font-bold text-gray-900">فندق جديد</h3><button onClick={() => setShowPropertyForm(false)}><X size={18} className="text-gray-400" /></button></div>
          <input placeholder="اسم الفندق" value={propertyForm.name} onChange={e => setPropertyForm({...propertyForm, name: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="المدينة" value={propertyForm.city} onChange={e => setPropertyForm({...propertyForm, city: e.target.value})} className="border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
            <select value={propertyForm.starRating} onChange={e => setPropertyForm({...propertyForm, starRating: Number(e.target.value)})} className="border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F] bg-white">
              {[1,2,3,4,5].map(s => <option key={s} value={s}>{s} نجوم</option>)}
            </select>
          </div>
          <input placeholder="العنوان" value={propertyForm.address} onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
          <button onClick={handleCreateProperty} className="w-full bg-[#128C4F] text-white py-3 rounded-xl font-bold">إنشاء الفندق</button>
        </div>
      )}

      {/* Properties + Rooms */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center">
          <Hotel size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد فنادق بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => { setSelectedProperty(p.id); fetchRooms(p.id); }}>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {p.city}</span>
                    <span className="flex items-center gap-1"><Star size={14} className="text-amber-500" /> {p.star_rating}</span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setSelectedProperty(p.id); setShowRoomForm(true); }} className="bg-[#128C4F] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                  <Bed size={14} /> إضافة غرفة
                </button>
              </div>
              {selectedProperty === p.id && rooms.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-900 mb-3">الغرف ({rooms.length})</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {rooms.map((r: any) => (
                      <div key={r.id} className="bg-white rounded-xl p-4 border border-gray-200">
                        <p className="font-bold text-gray-900 text-sm">{r.room_type}</p>
                        <p className="text-[#128C4F] font-bold mt-1">{r.price_per_night} ل.س</p>
                        <p className="text-gray-400 text-xs mt-1">{r.quantity} غرف • {r.max_guests} ضيوف</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Room Form Modal */}
      {showRoomForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowRoomForm(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 className="font-bold text-gray-900">إضافة غرفة</h3><button onClick={() => setShowRoomForm(false)}><X size={18} className="text-gray-400" /></button></div>
            <div className="space-y-3">
              <input placeholder="نوع الغرفة" value={roomForm.roomType} onChange={e => setRoomForm({...roomForm, roomType: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="السعر/ليلة" value={roomForm.pricePerNight} onChange={e => setRoomForm({...roomForm, pricePerNight: Number(e.target.value)})} className="border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
                <input type="number" placeholder="الكمية" value={roomForm.quantity} onChange={e => setRoomForm({...roomForm, quantity: Number(e.target.value)})} className="border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
              </div>
              <input type="number" placeholder="حد الضيوف" value={roomForm.maxGuests} onChange={e => setRoomForm({...roomForm, maxGuests: Number(e.target.value)})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
              <button onClick={handleCreateRoom} className="w-full bg-[#128C4F] text-white py-3 rounded-xl font-bold">إضافة الغرفة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}