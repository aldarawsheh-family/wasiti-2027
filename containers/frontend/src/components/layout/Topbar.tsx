'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { Bell, LogOut, Shield, User, Wallet } from 'lucide-react';

export default function Topbar() {
  const { user, logout } = useAuthStore();

  const adminRoles = ['PLATFORM_OWNER', 'ADMIN', 'SUPPORT', 'MODERATOR'];
  const isAdmin = user && adminRoles.includes(user.role);

  return (
    <header className="sticky top-0 z-50 bg-[#128C4F] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={isAdmin ? '/ar/admin' : '/ar/dashboard'} className="font-bold text-lg">
          WASITI {isAdmin && '• Admin'}
        </Link>

        <div className="flex items-center gap-3">
          <Link href={isAdmin ? '/ar/admin/wallet/requests' : '/ar/dashboard/wallet'} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Wallet size={18} />
          </Link>
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <Bell size={18} />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-white/20">
            <div className="flex items-center gap-1">
              <Shield size={14} className="text-white/70" />
              <span className="text-sm text-white/90 font-medium">{user?.displayName || user?.email}</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{user?.role}</span>
            <button onClick={logout} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="تسجيل خروج">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}