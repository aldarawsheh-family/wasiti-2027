// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Transport Model
// ══════════════════════════════════════════════════

export interface TransportCompany {
  id: string;
  tenantId: string;
  name: Record<string, string>;
  slug: string;
  transportType: 'BUS' | 'MINIBUS' | 'VAN' | 'TAXI' | 'TRUCK' | 'SHIPPING';
  phone?: string;
  whatsapp?: string;
  ratingAvg: number;
  totalTrips: number;
  isActive: boolean;
  isVerified: boolean;
}

export interface TransportTrip {
  id: string;
  companyId: string;
  routeId: string;
  vehicleId: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  basePrice: number;
  currency: string;
  status: 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'COMPLETED' | 'CANCELLED';
}

export interface TransportBooking {
  id: string;
  tripId: string;
  userId: string;
  tenantId: string;
  seatNumber: number;
  seatClassId?: string;
  passengerName: string;
  passengerPhone?: string;
  pricePaid: number;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'NO_SHOW' | 'CANCELLED' | 'REFUNDED';
  bookingCode: string;
  qrCode?: string;
}