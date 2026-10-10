"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const HERO_FOOD_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop&q=80",
    alt: "Jollof rice",
  },
  {
    src: "https://images.unsplash.com/photo-1598103442097-8b74f0e7c827?w=400&h=400&fit=crop&q=80",
    alt: "Grilled chicken",
  },
  {
    src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop&q=80",
    alt: "Fresh doughnut",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1E293B] flex flex-col">
      {/* ========== HEADER ========== */}
      <header className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#377EE9] flex items-center justify-center text-white font-bold text-sm">
            p
          </div>
          <span className="text-lg font-bold tracking-tight text-[#1E293B]">
            pickNdrop
          </span>
        </div>
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-[#377EE9]"
        >
          Log In
        </Link>
      </header>

      {/* ========== HERO ========== */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-8 sm:pt-14 lg:pt-20 pb-12">
          {/* Copy Side */}
          <div className="space-y-5 max-w-xl">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#377EE9] text-xs font-semibold">
              Pan-Atlantic University
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#1E293B] tracking-tight leading-[1.15]">
              Your campus food,{" "}
              <span className="text-[#377EE9]">delivered.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-md">
              Order from campus cafeterias. Skip the counter queue with Eat-In
              tickets, grab packed meals from express racks, or get peer
              delivery straight to your faculty.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] active:bg-[#2860b8] transition-colors"
              >
                <span>Get Started — It&apos;s Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-semibold text-[#1E293B] bg-[#F8FAFC] hover:bg-slate-100 transition-colors"
              >
                I already have an account
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex items-center gap-5 pt-3 text-xs text-slate-400">
              <span>✓ Free for students</span>
              <span>✓ No delivery surcharge</span>
              <span>✓ Verified IDs only</span>
            </div>
          </div>

          {/* Image Grid Side — visible on tablet and up */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={HERO_FOOD_IMAGES[0].src}
                  alt={HERO_FOOD_IMAGES[0].alt}
                  fill
                  className="object-cover"
                  sizes="280px"
                  priority
                />
              </div>
              <div className="p-4 rounded-2xl bg-[#F8FAFC]">
                <div className="text-2xl font-extrabold text-[#1E293B]">35+</div>
                <div className="text-xs text-slate-500 mt-0.5">Minutes saved daily per student</div>
              </div>
            </div>
            <div className="space-y-3 pt-8">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={HERO_FOOD_IMAGES[1].src}
                  alt={HERO_FOOD_IMAGES[1].alt}
                  fill
                  className="object-cover"
                  sizes="280px"
                  priority
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src={HERO_FOOD_IMAGES[2].src}
                  alt={HERO_FOOD_IMAGES[2].alt}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== HOW IT WORKS SECTION ========== */}
        <section className="py-12 sm:py-16 lg:py-20 border-t border-slate-100">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1E293B] text-center mb-2">
            How it works
          </h2>
          <p className="text-sm text-slate-500 text-center mb-10 max-w-md mx-auto">
            Three flexible ways to get your campus meal without the wait.
          </p>

          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white mx-auto flex items-center justify-center text-xl shadow-sm">
                🪑
              </div>
              <h3 className="text-sm font-bold text-[#1E293B]">Eat-In</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sit down at the cafeteria. Order from your phone and skip the billing queue with a digital priority ticket.
              </p>
            </div>
            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white mx-auto flex items-center justify-center text-xl shadow-sm">
                🛍️
              </div>
              <h3 className="text-sm font-bold text-[#1E293B]">Self-Pickup</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pre-order between classes. Your packed meal waits on the express shelf — just scan your QR and grab.
              </p>
            </div>
            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#F8FAFC] text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white mx-auto flex items-center justify-center text-xl shadow-sm">
                🚶
              </div>
              <h3 className="text-sm font-bold text-[#1E293B]">Peer-Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A student heading your way picks up your meal and drops it at your faculty building.
              </p>
            </div>
          </div>

          <div className="text-center pt-10">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] transition-colors"
            >
              <span>Start Ordering</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-slate-100 py-6 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span className="font-medium text-slate-500">pickNdrop</span>
          <span>© 2026 Pan-Atlantic University</span>
        </div>
      </footer>
    </div>
  );
}
