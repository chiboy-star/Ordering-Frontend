"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bike,
  Wallet,
  ChevronDown,
  LogOut,
  Radio,
  ShoppingBag,
  Bell,
  Menu,
  X,
  History,
  ShieldCheck,
} from "lucide-react";

export default function StudentNavbar() {
  const pathname = usePathname();
  const [isRiderOnline, setIsRiderOnline] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsAvatarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Menu", href: "/menu", icon: ShoppingBag },
    { name: "Orders", href: "/orders", icon: History },
  ];

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl transition-all duration-300 ${
        isRiderOnline
          ? "bg-[#130722]/95 border-b-2 border-orange-500 shadow-[0_4px_30px_rgba(249,115,22,0.22)]"
          : "bg-[#0e071a]/85 border-b border-purple-900/40"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* ========================================================= */}
          {/* LEFT: LOGO & CORE LINKS */}
          {/* ========================================================= */}
          <div className="flex items-center gap-6 sm:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-0.5 shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#170a2c] rounded-[10px] flex items-center justify-center">
                  <span className="text-orange-400 font-extrabold text-base">
                    p<span className="text-white">N</span>d
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-orange-400 transition-colors">
                  pick<span className="text-orange-500">N</span>drop
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-purple-300 -mt-1 hidden sm:block">
                  Student Hub
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-purple-900/40 text-orange-400 border border-purple-700/50"
                        : "text-zinc-300 hover:text-white hover:bg-purple-950/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: THE MONEY MAKER (RIDER TOGGLE, WALLET, AVATAR) */}
          {/* ========================================================= */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Online Status Beacon (Shown when Rider Mode is ON) */}
            {isRiderOnline && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/15 border border-orange-500/40 text-orange-400 animate-in fade-in zoom-in-95">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <Radio className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span>Online • Ready for Jobs</span>
              </div>
            )}

            {/* RIDER MODE TOGGLE SWITCH ("The Money Maker") */}
            <div
              className={`flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border transition-all duration-300 ${
                isRiderOnline
                  ? "bg-gradient-to-r from-orange-950/40 via-purple-950/60 to-orange-950/30 border-orange-500/50 shadow-md shadow-orange-500/20"
                  : "bg-purple-950/40 border-purple-800/40"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Bike
                  className={`w-4 h-4 transition-colors ${
                    isRiderOnline ? "text-orange-400 animate-bounce" : "text-zinc-400"
                  }`}
                />
                <span className="text-xs font-bold text-white hidden sm:inline">
                  Rider Mode
                </span>
              </div>

              {/* Accessible Interactive Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isRiderOnline}
                onClick={() => setIsRiderOnline(!isRiderOnline)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 focus:ring-offset-[#0e071a] ${
                  isRiderOnline
                    ? "bg-gradient-to-r from-orange-500 to-amber-500"
                    : "bg-purple-900/70"
                }`}
              >
                <span className="sr-only">Toggle Rider Delivery Mode</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isRiderOnline ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* SUBTLE WALLET BALANCE */}
            <Link
              href="/orders"
              className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border transition-all ${
                isRiderOnline
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-300 hover:bg-orange-500/20"
                  : "bg-purple-950/40 border-purple-800/40 text-zinc-300 hover:text-white hover:bg-purple-900/30"
              }`}
            >
              <Wallet className="w-4 h-4 text-orange-400" />
              <div className="text-left leading-none">
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block sm:hidden">
                  Wallet
                </span>
                <span className="text-xs sm:text-sm font-black tracking-tight text-white">
                  ₦0.00
                </span>
              </div>
            </Link>

            {/* NOTIFICATIONS BELL (Discreet) */}
            <button
              type="button"
              className="hidden sm:flex relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-purple-900/30 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
            </button>

            {/* USER AVATAR DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="flex items-center gap-2 p-1 sm:p-1.5 rounded-2xl hover:bg-purple-900/30 transition-colors border border-purple-800/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                aria-haspopup="true"
                aria-expanded={isAvatarOpen}
              >
                {/* Styled Avatar Initial */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-500/40 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-inner">
                  PA
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 hidden sm:block ${
                    isAvatarOpen ? "rotate-180 text-orange-400" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#140827] border border-purple-800/60 shadow-2xl shadow-purple-950/80 backdrop-blur-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  {/* User Meta Preview */}
                  <div className="px-4 py-3 border-b border-purple-800/40">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-white truncate">
                        Paul Adeyemi
                      </p>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-900/80 text-purple-300 border border-purple-700/50">
                        Student
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      p.adeyemi@pau.edu.ng
                    </p>
                  </div>

                  {/* Rider Status Flag in Dropdown */}
                  <div className="px-4 py-2 border-b border-purple-800/30 bg-purple-950/30 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Rider Status</span>
                    <span
                      className={`font-bold ${
                        isRiderOnline ? "text-orange-400" : "text-zinc-400"
                      }`}
                    >
                      {isRiderOnline ? "● Online" : "○ Offline"}
                    </span>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1 text-xs">
                    <Link
                      href="/menu"
                      onClick={() => setIsAvatarOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-white hover:bg-purple-900/30 transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4 text-orange-400" />
                      <span>Browse Cafeteria Menu</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setIsAvatarOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-zinc-300 hover:text-white hover:bg-purple-900/30 transition-colors"
                    >
                      <History className="w-4 h-4 text-purple-300" />
                      <span>Order History & Tokens</span>
                    </Link>
                    <div className="flex items-center justify-between px-4 py-2 text-zinc-400">
                      <span className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>PAU Matric ID</span>
                      </span>
                      <span className="text-[10px] font-mono text-zinc-300">Verified</span>
                    </div>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1 mt-1 border-t border-purple-800/40">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsAvatarOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-purple-900/30 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-900/40 space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-purple-900/50 text-orange-400 border border-purple-700/50"
                        : "text-zinc-300 hover:bg-purple-900/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Rider Status Indicator */}
            <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between px-2 text-xs">
              <span className="text-zinc-400">Rider Delivery Service</span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                  isRiderOnline
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-purple-950/60 text-zinc-400"
                }`}
              >
                {isRiderOnline ? "Active • Receiving Jobs" : "Offline"}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
