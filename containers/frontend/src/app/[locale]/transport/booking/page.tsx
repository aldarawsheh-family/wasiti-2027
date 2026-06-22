// ══════════════════════════════════════════════════
// WASITI 2027 — Transport Booking Page
// ══════════════════════════════════════════════════

import Navbar from '@/components/layout/Navbar';
import BookingFlow from '@/components/features/BookingFlow';

export default function TransportBookingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32 px-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">🎫 حجز رحلة</h1>
        <BookingFlow />
      </main>
    </>
  );
}