'use client';
import { Activity, Server, Database, Wifi } from 'lucide-react';

export default function AdminSystemPage() {
  const services = [
    { name: 'API Gateway', status: 'شغال', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Auth Service', status: 'شغال', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'PostgreSQL', status: 'شغال', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Redis', status: 'شغال', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'MinIO', status: 'شغال', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'RabbitMQ', status: 'شغال', color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <Activity size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">النظام</h1>
          <p className="text-gray-500 mt-0.5">مراقبة حالة النظام</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server size={20} className="text-gray-400" />
              <span className="font-semibold text-gray-900">{s.name}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.color}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}