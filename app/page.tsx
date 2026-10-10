"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Plus,
  Clock,
  Sparkles,
  ShieldCheck,
  Utensils,
  Bike,
  Flame,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1E293B] relative overflow-hidden flex flex-col selection:bg-[#377EE9] selection:text-white">
      {/* ========================================================= */}
      {/* TOP NAVBAR (Minimalist, iOS-inspired) */}
      {/* ========================================================= */}
      <header className="w-full max-w-6xl mx-auto px-5 sm:px-8 pt-5 pb-3 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-12 sm:w-9 sm:h-14 transition-transform group-hover:scale-105">
            <Image
              src="/Logo.png"
              alt="pickNdrop logo"
              width={1043}
              height={1621}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tight text-[#1E293B]">
            pick<span className="text-[#0400FF]">N</span>drop
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/auth/login"
            className="text-xs sm:text-sm font-bold text-[#0400FF] hover:text-[#1E293B] px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="text-xs sm:text-sm font-bold text-white bg-[#1E2229] hover:bg-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN HERO SECTION */}
      {/* ========================================================= */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 lg:pt-14 pb-16 relative z-10 flex flex-col justify-center">
        {/* HERO GRADIENT BLOB (Diffused pink-to-blue glow) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 sm:top-6 left-1/2 -translate-x-1/2 w-full max-w-[650px] lg:max-w-[850px] h-[480px] sm:h-[550px] overflow-visible -z-10"
        >
          <div className="w-[320px] sm:w-[480px] lg:w-[620px] h-[300px] sm:h-[380px] lg:h-[440px] mx-auto rounded-full bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#93C5FD] opacity-65 sm:opacity-75 blur-3xl transform -translate-y-6" />
        </div>

        {/* HERO GRID: Centered stack on Mobile/Tablet, balanced 2-column on Desktop */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ========================================================= */}
          {/* LEFT / CENTER: LOGO, HEADLINE, SUBTEXT, CTA */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6">
            {/* Center Monogram Logo from public/Logo.png */}
            <div className="flex items-center justify-center lg:justify-start">
              <div className="relative w-12 h-18 sm:w-14 sm:h-20 lg:w-16 lg:h-24 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/Logo.png"
                  alt="pickNdrop Monogram Logo"
                  width={1043}
                  height={1621}
                  priority
                  className="w-full h-full object-contain drop-shadow-sm"
                />
              </div>
            </div>

            {/* Headline with exact punctuation and line break */}
            <h1 className="text-[34px] sm:text-[46px] lg:text-[54px] font-black text-black tracking-tight leading-[1.12]">
              Skip the wait ,<br />
              Savor the flavor
            </h1>

            {/* Subtext neatly wrapped in 3-4 lines */}
            <p className="text-sm sm:text-base lg:text-lg text-zinc-700 font-normal leading-relaxed max-w-[340px] sm:max-w-[440px] lg:max-w-md">
              The easiest way to enjoy the cafeteria. Grab a table and order
              stress-free, or add a takeaway pack to get your meal packed for
              pickup or delivery.
            </p>

            {/* CTA Button linking to /auth/signup */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#1E2229] hover:bg-black text-white text-base font-bold tracking-wide shadow-xl shadow-slate-900/15 hover:shadow-2xl active:scale-95 transition-all group cursor-pointer"
              >
                <span>Order now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/auth/login"
                className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1"
              >
                Already registered? <span className="text-[#0400FF] font-bold">Log in</span>
              </Link>
            </div>

            {/* Trust Signals (visible on desktop for better space fill) */}
            <div className="hidden lg:flex items-center gap-5 pt-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0400FF]" /> PAU ID Verified
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0400FF]" /> ~10m Avg Wait
              </span>
              <span className="flex items-center gap-1.5">
                <Bike className="w-4 h-4 text-[#0400FF]" /> Peer Delivery
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT / BOTTOM: 3 FLOATING OVERLAPPING FOOD CARDS */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center pt-6 lg:pt-0">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[440px] flex flex-col items-center">
              {/* Floating Decorative Badges for Desktop & Tablet */}
              <div className="hidden sm:flex absolute -top-5 -right-4 z-40 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-100 items-center gap-1.5 text-xs font-bold text-[#1E293B] animate-bounce">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>3 Cafeterias Online</span>
              </div>

              <div className="hidden sm:flex absolute -bottom-5 -left-4 z-40 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-slate-100 items-center gap-1.5 text-xs font-bold text-[#1E293B]">
                <Clock className="w-4 h-4 text-[#377EE9]" />
                <span>Express Pick-up Shelf</span>
              </div>

              {/* CARD 1 (Top Left) - Light Blue Background, Rotated Left */}
              <Link
                href="/auth/signup"
                className="relative w-full h-[135px] sm:h-[150px] lg:h-[155px] bg-[#96CEFD] rounded-[28px] sm:rounded-3xl shadow-[0_22px_45px_rgba(0,0,0,0.16)] -rotate-[8deg] -translate-x-3 sm:-translate-x-5 z-10 cursor-pointer hover:scale-[1.03] hover:-rotate-[5deg] transition-all duration-300 block group"
              >
                {/* Protruding Circular Pizza Image */}
                <div className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-34 sm:h-34 rounded-full overflow-hidden shadow-lg ring-2 ring-white/30 bg-slate-100 transition-transform group-hover:scale-105 duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop&q=80"
                    alt="Pepperoni pizza slice"
                    fill
                    className="object-cover"
                    sizes="140px"
                    priority
                  />
                </div>

                {/* Card Content (Right Side) */}
                <div className="ml-24 sm:ml-28 pr-5 sm:pr-6 py-4 h-full flex flex-col justify-between text-left">
                  <div>
                    <h2 className="text-base sm:text-lg lg:text-xl font-black text-white uppercase tracking-wider leading-none">
                      PIZZA SLICE
                    </h2>
                    <p className="text-[9px] sm:text-[10px] text-white/80 uppercase font-medium mt-1 leading-tight line-clamp-2">
                      OVEN BAKED CRISPY CRUST WITH MOZZARELLA & SPICY PEPPERONI
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm lg:text-base font-black text-white">
                      NGN1,500
                    </span>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* CARD 2 (Middle Right) - Periwinkle/Light Purple, Rotated Right */}
              <Link
                href="/auth/signup"
                className="relative w-full h-[135px] sm:h-[150px] lg:h-[155px] bg-[#9EA7FC] rounded-[28px] sm:rounded-3xl shadow-[0_22px_45px_rgba(0,0,0,0.18)] rotate-[6deg] translate-x-4 sm:translate-x-6 -mt-8 sm:-mt-10 z-20 cursor-pointer hover:scale-[1.03] hover:rotate-[4deg] transition-all duration-300 block group"
              >
                {/* Protruding Circular Chicken Wings Image */}
                <div className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-34 sm:h-34 rounded-full overflow-hidden shadow-lg ring-2 ring-white/30 bg-slate-100 transition-transform group-hover:scale-105 duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&h=500&fit=crop&q=80"
                    alt="Crispy roasted chicken wings"
                    fill
                    className="object-cover"
                    sizes="140px"
                    priority
                  />
                </div>

                {/* Card Content (Right Side) */}
                <div className="ml-24 sm:ml-28 pr-5 sm:pr-6 py-4 h-full flex flex-col justify-between text-left">
                  <div>
                    <h2 className="text-base sm:text-lg lg:text-xl font-black text-white uppercase tracking-wider leading-none">
                      CHICKEN
                    </h2>
                    <p className="text-[9px] sm:text-[10px] text-white/80 uppercase font-medium mt-1 leading-tight line-clamp-2">
                      CRISPY GOLDEN SPICY WINGS GLAZED WITH HOMEMADE SAUCE
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm lg:text-base font-black text-white">
                      NGN1,200
                    </span>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* CARD 3 (Bottom Left) - Bright Pink/Magenta, Rotated Left */}
              <Link
                href="/auth/signup"
                className="relative w-full h-[135px] sm:h-[150px] lg:h-[155px] bg-[#F28CE6] rounded-[28px] sm:rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.2)] -rotate-[6deg] -translate-x-3 sm:-translate-x-5 -mt-8 sm:-mt-10 z-30 cursor-pointer hover:scale-[1.03] hover:-rotate-[4deg] transition-all duration-300 block group"
              >
                {/* Protruding Circular Egusi Soup Image */}
                <div className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-28 h-28 sm:w-34 sm:h-34 rounded-full overflow-hidden shadow-lg ring-2 ring-white/30 bg-slate-100 transition-transform group-hover:scale-105 duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=500&fit=crop&q=80"
                    alt="Rich Egusi Soup bowl"
                    fill
                    className="object-cover"
                    sizes="140px"
                    priority
                  />
                </div>

                {/* Card Content (Right Side) */}
                <div className="ml-24 sm:ml-28 pr-5 sm:pr-6 py-4 h-full flex flex-col justify-between text-left">
                  <div>
                    <h2 className="text-base sm:text-lg lg:text-xl font-black text-white uppercase tracking-wider leading-none">
                      EGUSI SOUP
                    </h2>
                    <p className="text-[9px] sm:text-[10px] text-white/80 uppercase font-medium mt-1 leading-tight line-clamp-2">
                      TRADITIONAL MELON SEED SOUP WITH ASSORTED MEATS & GREENS
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm lg:text-base font-black text-white">
                      NGN800
                    </span>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DESKTOP VALUE PROPS (Adds richness & fills space on PC) */}
        {/* ========================================================= */}
        <div className="hidden lg:grid grid-cols-3 gap-6 pt-16 mt-8 border-t border-slate-100">
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#377EE9] flex items-center justify-center font-bold">
              🪑
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E293B]">
                Eat-In Priority Tickets
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Skip long billing lines. Get a numbered seat token on your phone.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold">
              🛍️
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E293B]">
                Express Takeaway Shelves
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pre-order between lectures and grab packed food directly.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              🚶
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E293B]">
                Student Peer-Delivery
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Fellow students heading your way bring meals straight to your faculty.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}
      <footer className="border-t border-slate-100 py-6 px-5 sm:px-8 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-6 relative">
              <Image
                src="/Logo.png"
                alt="Logo icon"
                width={1043}
                height={1621}
                className="w-full h-full object-contain opacity-70"
              />
            </div>
            <span className="font-semibold text-slate-600">pickNdrop</span>
            <span>• Pan-Atlantic University</span>
          </div>
          <span>© 2026 pickNdrop. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
