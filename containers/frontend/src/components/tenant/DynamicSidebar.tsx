'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Package, Users, Handshake, Building2, Hotel, Car, ShoppingBag, 
  Settings, Calendar, Star, Truck, ClipboardList 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  'listings': <Package size={18} />,
  'clients': <Users size={18} />,
  'deals': <Handshake size={18} />,
  'property-info': <Building2 size={18} />,
  'rooms': <Hotel size={18} />,
  'reservations': <Calendar size={18} />,
  'reviews': <Star size={18} />,
  'calendar': <Calendar size={18} />,
  'company-info': <Building2 size={18} />,
  'vehicles': <Truck size={18} />,
  'trips': <ClipboardList size={18} />,
  'bookings': <Calendar size={18} />,
  'products': <ShoppingBag size={18} />,
  'orders': <ClipboardList size={18} />,
  'team': <Users size={18} />,
  'settings': <Settings size={18} />,
};
const PATH_MAP: Record<string, string> = {
  'company-info': '/ar/dashboard/company',
  'vehicles': '/ar/dashboard/company/transport',
  'trips': '/ar/dashboard/company/transport',
  'bookings': '/ar/dashboard/company/booking',
  'property-info': '/ar/dashboard/company/booking',
  'rooms': '/ar/dashboard/company/booking',
  'reservations': '/ar/dashboard/company/booking',
  'reviews': '/ar/dashboard/company/booking',
  'products': '/ar/dashboard/company/shop',
  'orders': '/ar/dashboard/company/shop',
  'listings': '/ar/dashboard/company',
  'clients': '/ar/dashboard/company/members',
  'deals': '/ar/dashboard/company',
  'team': '/ar/dashboard/company/members',
  'settings': '/ar/dashboard/company/settings',
  'calendar': '/ar/dashboard/company/booking',
};
const LABEL_MAP: Record<string, string> = {
  'listings': 'إعلاناتي',
  'clients': 'عملائي',
  'deals': 'صفقاتي',
  'property-info': 'معلومات الفندق',
  'rooms': 'الغرف',
  'reservations': 'الحجوزات',
  'reviews': 'التقييمات',
  'calendar': 'التقويم',
  'company-info': 'معلومات الشركة',
  'vehicles': 'المركبات',
  'trips': 'الرحلات',
  'bookings': 'الحجوزات',
  'products': 'المنتجات',
  'orders': 'الطلبات',
  'team': 'الفريق',
  'settings': 'الإعدادات',
};

interface DynamicSidebarProps {
  sections: string[];
  basePath?: string;
}

export default function DynamicSidebar({ sections, basePath = '/ar/dashboard/company' }: DynamicSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-60 bg-white border-l border-gray-200 shadow-sm overflow-y-auto z-40">
      <div className="flex flex-col gap-1 p-3">
        {sections.map((section) => {
          const href = PATH_MAP[section] || `${basePath}/${section}`;
          const isActive = pathname === href || pathname?.startsWith(href + '/');
          return (
            <Link
              key={section}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-[#128C4F] text-white font-bold shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {ICON_MAP[section] || <Settings size={18} />}
              <span>{LABEL_MAP[section] || section}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}