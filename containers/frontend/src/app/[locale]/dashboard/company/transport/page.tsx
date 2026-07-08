'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Truck, Plus, MapPin, Calendar, Clock, X } from 'lucide-react';

export default function TransportDashboardPage() {
  const { accessToken } = useAuthStore();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [vehicleForm, setVehicleForm] = useState({ plateNumber: '', vehicleType: '', totalSeats: 50 });
  const [tripForm, setTripForm] = useState({ originCity: '', destinationCity: '', departureTime: '', pricePerSeat: 0, seatsAvailable: 50 });

  const companyId = '2898cfa8-acb4-480a-b892-3c19dd001e89';

  const fetchVehicles = () => {
    if (!accessToken) return;
    fetch(`/api/transport/${companyId}/vehicles`, {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'user-role': 'COMPANY_ADMIN' }
    })
      .then(r => r.json())
      .then(data => { setVehicles(Array.isArray(data) ? data : []); setLoading(false); });
  };

  const fetchTrips = (vehicleId: string) => {
    fetch(`/api/transport/vehicles/${vehicleId}/trips`, {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'user-role': 'COMPANY_ADMIN' }
    })
      .then(r => r.json())
      .then(data => setTrips(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchVehicles(); }, [accessToken]);

  const handleCreateVehicle = async () => {
    await fetch(`/api/transport/${companyId}/vehicles`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'Content-Type': 'application/json', 'user-role': 'COMPANY_ADMIN' },
      body: JSON.stringify(vehicleForm)
    });
    setShowVehicleForm(false);
    fetchVehicles();
  };

  const handleCreateTrip = async () => {
    if (!selectedVehicle) return;
    await fetch(`/api/transport/vehicles/${selectedVehicle}/trips`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'Content-Type': 'application/json', 'user-role': 'COMPANY_ADMIN' },
      body: JSON.stringify(tripForm)
    });
    setShowTripForm(false);
    fetchTrips(selectedVehicle);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
            <Truck size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">المركبات والرحلات</h1>
            <p className="text-gray-500 mt-0.5">{vehicles.length} مركبة</p>
          </div>
        </div>
        <button onClick={() => setShowVehicleForm(!showVehicleForm)} className="bg-[#128C4F] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg">
          <Plus size={18} /> إضافة مركبة
        </button>
      </div>

      {/* Vehicle Form */}
      {showVehicleForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
          <div className="flex justify-between"><h3 className="font-bold text-gray-900">مركبة جديدة</h3><button onClick={() => setShowVehicleForm(false)}><X size={18} className="text-gray-400" /></button></div>
          <input placeholder="رقم اللوحة" value={vehicleForm.plateNumber} onChange={e => setVehicleForm({...vehicleForm, plateNumber: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
          <input placeholder="نوع المركبة" value={vehicleForm.vehicleType} onChange={e => setVehicleForm({...vehicleForm, vehicleType: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
          <input type="number" placeholder="عدد المقاعد" value={vehicleForm.totalSeats} onChange={e => setVehicleForm({...vehicleForm, totalSeats: Number(e.target.value)})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
          <button onClick={handleCreateVehicle} className="w-full bg-[#128C4F] text-white py-3 rounded-xl font-bold">إضافة المركبة</button>
        </div>
      )}

      {/* Vehicles + Trips */}
      {vehicles.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center">
          <Truck size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد مركبات بعد</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vehicles.map((v: any) => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 flex items-center justify-between cursor-pointer" onClick={() => { setSelectedVehicle(v.id); fetchTrips(v.id); }}>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{v.plate_number}</h3>
                  <p className="text-gray-500 text-sm">{v.vehicle_type} • {v.total_seats} مقعد</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setSelectedVehicle(v.id); setShowTripForm(true); }} className="bg-[#128C4F] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                  <Calendar size={14} /> إضافة رحلة
                </button>
              </div>
              {selectedVehicle === v.id && trips.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-900 mb-3">الرحلات ({trips.length})</h4>
                  <div className="space-y-2">
                    {trips.map((t: any) => (
                      <div key={t.id} className="bg-white rounded-xl p-4 border border-gray-200 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={14} className="text-[#128C4F]" />
                            <span className="font-semibold text-gray-900">{t.origin_city} → {t.destination_city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <Clock size={12} /> {new Date(t.departure_time).toLocaleString('ar-SA')}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#128C4F] font-bold">{t.price_per_seat} ل.س</p>
                          <p className="text-gray-400 text-xs">{t.seats_available} مقعد متاح</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Trip Form Modal */}
      {showTripForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowTripForm(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 className="font-bold text-gray-900">إضافة رحلة</h3><button onClick={() => setShowTripForm(false)}><X size={18} className="text-gray-400" /></button></div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="من" value={tripForm.originCity} onChange={e => setTripForm({...tripForm, originCity: e.target.value})} className="border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
                <input placeholder="إلى" value={tripForm.destinationCity} onChange={e => setTripForm({...tripForm, destinationCity: e.target.value})} className="border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
              </div>
              <input type="datetime-local" value={tripForm.departureTime} onChange={e => setTripForm({...tripForm, departureTime: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
              <input type="number" placeholder="سعر المقعد" value={tripForm.pricePerSeat} onChange={e => setTripForm({...tripForm, pricePerSeat: Number(e.target.value)})} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#128C4F]" />
              <button onClick={handleCreateTrip} className="w-full bg-[#128C4F] text-white py-3 rounded-xl font-bold">إضافة الرحلة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}