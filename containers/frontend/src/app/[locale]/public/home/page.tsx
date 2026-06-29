'use client';

import Navbar from '@/features/public/components/Navbar';
import Hero from '@/features/public/components/Hero';
import WhyUs from '@/features/public/components/WhyUs';
import Stats from '@/features/public/components/Stats';
import FeaturedListings from '@/features/listings/components/FeaturedListings';
import CTA from '@/features/public/components/CTA';

export default function PublicHomePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[var(--bg-dark)] text-white font-sans pb-6 selection:bg-[var(--color-primary)] selection:text-black flex justify-center relative">

      <div className="w-full max-w-[430px] relative px-4 pt-4 pb-28 flex flex-col gap-8">
        
        <Navbar />
        <Hero />
        <WhyUs />
        <FeaturedListings />
        <Stats />

      </div>

      <CTA />
    </main>
  );
}