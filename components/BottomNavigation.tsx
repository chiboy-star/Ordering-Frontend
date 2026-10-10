"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  UtensilsCrossed,
  ShoppingBag,
  Settings,
  Bike,
  Clock,
} from "lucide-react";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { isRiderMode, totalCartCount } = useApp();

  const isMenu = pathname === "/menu" || pathname === "/";
  const isCheckout = pathname === "/checkout";
  const isSettings = pathname === "/settings";
  const isOrders = pathname === "/orders" || pathname === "/active-order";

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] transition-all"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="max-w-md sm:max-w-lg mx-auto grid grid-cols-4 items-center h-16 px-1">
        {/* 1. Menu */}
        <Link
          href="/menu"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1 transition-all group cursor-pointer ${
            isMenu
              ? "text-[#377EE9]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <UtensilsCrossed
              className={`w-5 h-5 transition-transform duration-200 ${
                isMenu ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
              }`}
            />
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight transition-colors ${
              isMenu ? "text-[#377EE9]" : "text-slate-500"
            }`}
          >
            Menu
          </span>
        </Link>

        {/* 2. Checkout / Cart */}
        <Link
          href="/checkout"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1 transition-all group cursor-pointer ${
            isCheckout
              ? "text-[#377EE9]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <ShoppingBag
              className={`w-5 h-5 transition-transform duration-200 ${
                isCheckout ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
              }`}
            />
            {totalCartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-2.5 bg-[#377EE9] text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75 duration-200"
                aria-label={`${totalCartCount} items in cart`}
              >
                {totalCartCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight transition-colors ${
              isCheckout ? "text-[#377EE9]" : "text-slate-500"
            }`}
          >
            Cart
          </span>
        </Link>

        {/* 3. Settings */}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1 transition-all group cursor-pointer ${
            isSettings
              ? "text-[#377EE9]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <Settings
              className={`w-5 h-5 transition-transform duration-200 ${
                isSettings ? "scale-110 stroke-[2.4] text-[#377EE9]" : "stroke-[1.8]"
              }`}
            />
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight transition-colors ${
              isSettings ? "text-[#377EE9]" : "text-slate-500 group-hover:text-slate-700"
            }`}
          >
            Settings
          </span>
        </Link>

        {/* 4. Active Order */}
        <Link
          href="/orders"
          className={`flex flex-col items-center justify-center gap-1 py-1 px-0.5 transition-all group cursor-pointer ${
            isOrders
              ? isRiderMode
                ? "text-emerald-600"
                : "text-[#377EE9]"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            {isRiderMode ? (
              <div className="relative">
                <Bike
                  className={`w-5 h-5 stroke-[2.2] transition-transform ${
                    isOrders ? "scale-110 text-emerald-600 animate-bounce" : "text-emerald-600"
                  }`}
                />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
            ) : (
              <div className="relative">
                <Clock
                  className={`w-5 h-5 transition-transform ${
                    isOrders ? "scale-110 stroke-[2.4] text-[#377EE9]" : "stroke-[1.8] text-slate-500"
                  }`}
                />
                <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#377EE9] ring-2 ring-white" />
              </div>
            )}
          </div>
          <span
            className={`text-[10px] font-semibold tracking-tight text-center leading-[1.1] max-w-[85px] truncate transition-colors ${
              isOrders
                ? isRiderMode
                  ? "text-emerald-700"
                  : "text-[#377EE9]"
                : isRiderMode
                ? "text-emerald-700"
                : "text-slate-500 group-hover:text-slate-700"
            }`}
          >
            {isRiderMode ? "Active rider order" : "Track buyer order"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
