"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  Bike,
  Clock,
  CheckCircle2,
  MapPin,
  Utensils,
  PhoneCall,
  QrCode,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function ActiveOrderModal() {
  const { isActiveOrderOpen, setIsActiveOrderOpen, isRiderMode } = useApp();

  if (!isActiveOrderOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsActiveOrderOpen(false)}
      />

      {/* Modal / Sheet Card */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 z-10 max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        {/* iOS Grabber */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isRiderMode ? "Rider Delivery Dispatch" : "Live Buyer Tracking"}
            </span>
            <h2 className="text-lg font-bold text-[#1E293B]">
              {isRiderMode ? "Active Rider Order" : "Track Buyer Order"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsActiveOrderOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            aria-label="Close active order modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isRiderMode ? (
            /* ===== RIDER ACTIVE ORDER VIEW ===== */
            <div className="space-y-5">
              {/* Status Header Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                    <Bike className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">
                      Order #PND-884 Assigned
                    </h3>
                    <p className="text-xs text-emerald-700">
                      Food ready at pickup counter
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200">
                  +₦600 Fee
                </span>
              </div>

              {/* Waypoint Route */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#377EE9] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">
                      Pickup Point:
                    </span>
                    <span className="font-bold text-[#1E293B] text-sm">
                      Student Center Cafe
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Ask for Token #PND-884 at counter
                    </p>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-slate-200 ml-3" />

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">
                      Drop-off Destination:
                    </span>
                    <span className="font-bold text-[#1E293B] text-sm">
                      SST Building (LT-1)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Recipient: Paul A. • +234 812 345 6789
                    </p>
                  </div>
                </div>
              </div>

              {/* Items in delivery package */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Order Items (Packed)
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E293B]">
                    1× Jollof Rice & Chicken
                  </span>
                  <span className="text-slate-400">Student Center</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1E293B]">
                    1× Chilled Zobo Juice
                  </span>
                  <span className="text-slate-400">SST Snack Bar</span>
                </div>
              </div>

              {/* Rider Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Buyer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsActiveOrderOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Delivered</span>
                </button>
              </div>
            </div>
          ) : (
            /* ===== BUYER TRACKING VIEW ===== */
            <div className="space-y-5">
              {/* Status Header */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#377EE9] text-white flex items-center justify-center shadow-sm">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E293B]">
                      Order #PND-884
                    </h3>
                    <p className="text-xs text-[#377EE9] font-medium">
                      Kitchen Preparing • 8-12 mins
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold bg-white px-2 py-1 rounded-lg text-slate-700 border border-blue-100">
                  Eat-In Ticket
                </span>
              </div>

              {/* Progress Tracker Steps */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-[#1E293B]">
                    1. Order Received by Kitchen
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#377EE9] text-white flex items-center justify-center animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-xs font-bold text-[#377EE9]">
                    2. Meal Cooking & Plating
                  </span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-[10px] font-bold">
                    3
                  </div>
                  <span className="text-xs text-slate-500">
                    3. Ready for Counter Pickup / Drop-off
                  </span>
                </div>
              </div>

              {/* Digital Pick-up Token */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Show at Student Center Cafeteria
                </span>
                <div className="text-2xl font-black tracking-widest text-[#1E293B] font-mono">
                  #884
                </div>
                <p className="text-xs text-slate-400">
                  Your ticket will be called on the order display screen.
                </p>
              </div>

              <div className="pt-1">
                <Link
                  href="/menu"
                  onClick={() => setIsActiveOrderOpen(false)}
                  className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl text-xs font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] transition-colors"
                >
                  <span>Continue Browsing Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
