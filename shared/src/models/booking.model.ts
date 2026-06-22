// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Booking Model
// ══════════════════════════════════════════════════

export interface BookingService {
  id: string;
  tenantId: string;
  name: Record<string, string>;
  slug: string;
  type: 'HOTEL' | 'RESTAURANT' | 'TRAVEL' | 'EVENT' | 'MEDICAL' | 'OTHER';
  phone?: string;
  ratingAvg: number;
  totalBookings: number;
  isActive: boolean;
  isVerified: boolean;
}

export interface BookingReservation {
  id: string;
  availabilityId: string;
  userId: string;
  tenantId: string;
  guestName: string;
  guestPhone?: string;
  slots: number;
  pricePaid: number;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'REFUNDED';
  bookingCode: string;
  qrCode?: string;
}