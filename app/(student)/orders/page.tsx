"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  Bike,
  MapPin,
  Utensils,
  PhoneCall,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface PastOrder {
  id: string;
  token: string;
  date: string;
  vendor: string;
  items: string;
  total: number;
  status: "Delivered" | "Picked Up";
}

const PAST_ORDERS: PastOrder[] = [
  {
    id: "po-1",
    token: "#PND-742",
    date: "Yesterday, 1:45 PM",
    vendor: "Student Center Cafe",
    items: "1× Fried Rice & Diced Beef",
    total: 1600,
    status: "Delivered",
  },
  {
    id: "po-2",
    token: "#PND-691",
    date: "Oct 8, 12:15 PM",
    vendor: "SST Snack Bar",
    items: "2× Golden Flaky Meat Pie, 1× Zobo Juice",
    total: 1600,
    status: "Picked Up",
  },
];

export default function OrdersPage() {
  const { isRiderMode, toggleRiderMode } = useApp();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [riderJobStep, setRiderJobStep] = useState<"assigned" | "picked-up" | "delivered">("assigned");

  return (
    <div className="min-h-screen bg-white text-[#1E293B] pb-28 animate-page-enter">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-[#377EE9] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
          <h1 className="text-base sm:text-lg font-bold text-[#1E293B]">
            {isRiderMode ? "Rider Delivery Dispatch" : "Live Order Tracker"}
          </h1>
          <div className="w-20" />
        </div>

        {/* Tab Switcher: Active Order vs Order History */}
        <div className="flex p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "active"
                ? "bg-white text-[#1E293B] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {isRiderMode ? "Active Rider Job" : "Active Order Tracker"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-[#1E293B] shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {isRiderMode ? "Completed Jobs" : "Order History"}
          </button>
        </div>

        {activeTab === "active" ? (
          isRiderMode ? (
            /* ========================================================= */
            /* RIDER DISPATCH & ACTIVE JOB VIEW */
            /* ========================================================= */
            <div className="space-y-6">
              {/* Active Delivery Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Bike className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                        Assigned Delivery • Active
                      </span>
                      <h2 className="text-base font-extrabold text-[#1E293B]">
                        Ticket #PND-884
                      </h2>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                    +₦600 Payout
                  </span>
                </div>

                {/* Route Waypoints */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#377EE9] text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">
                        Pickup Location
                      </span>
                      <span className="text-sm font-bold text-[#1E293B]">
                        Student Center Cafe (Counter 2)
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Ask staff for ticket #PND-884 (Already packed)
                      </p>
                    </div>
                  </div>

                  <div className="w-0.5 h-4 bg-slate-200 ml-3" />

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block">
                        Drop-off Location
                      </span>
                      <span className="text-sm font-bold text-[#1E293B]">
                        SST Building (Lecture Hall LT-1)
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Recipient: Paul Adeyemi • Note: Drop at front desk
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items in Package */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-100 space-y-2 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Items to verify
                  </span>
                  <div className="flex justify-between font-medium text-[#1E293B]">
                    <span>1× Jollof Rice & Chicken</span>
                    <span className="text-slate-400">Food box</span>
                  </div>
                  <div className="flex justify-between font-medium text-[#1E293B]">
                    <span>1× Chilled Zobo Juice</span>
                    <span className="text-slate-400">Cold cup</span>
                  </div>
                </div>

                {/* Rider Actions */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="tel:+2348123456789"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Buyer</span>
                  </a>

                  {riderJobStep === "assigned" ? (
                    <button
                      type="button"
                      onClick={() => setRiderJobStep("picked-up")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-[#377EE9] hover:bg-[#2f6fd4] transition-colors shadow-xs"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Confirm Picked Up</span>
                    </button>
                  ) : riderJobStep === "picked-up" ? (
                    <button
                      type="button"
                      onClick={() => setRiderJobStep("delivered")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Delivered</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Job Completed</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Campus Delivery Requests Board */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                  Available Campus Drop-off Jobs Nearby
                </h3>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-[#1E293B] block">
                      Main Quad Cafeteria ➔ SMC Lobby
                    </span>
                    <span className="text-[11px] text-slate-400">
                      1× Peppered Grilled Chicken • 5 min walk
                    </span>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-colors"
                  >
                    Accept (+₦500)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* BUYER LIVE ORDER TRACKER VIEW */
            /* ========================================================= */
            <div className="space-y-6">
              {/* Main Live Order Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Estimated Cooking & Plating
                    </span>
                    <h2 className="text-2xl font-black text-[#1E293B] mt-0.5">
                      8 – 12 mins
                    </h2>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#377EE9] flex items-center justify-center">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E293B]">
                      1. Order received by cafeteria kitchen
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#377EE9] text-white flex items-center justify-center animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <span className="text-xs font-bold text-[#377EE9]">
                      2. Food in preparation & packaging
                    </span>
                  </div>

                  <div className="flex items-center gap-3 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-[10px] font-bold">
                      3
                    </div>
                    <span className="text-xs text-slate-500">
                      3. Ready for counter pickup / runner dispatch
                    </span>
                  </div>
                </div>

                {/* Digital Ticket / Token */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#377EE9]">
                    Show at Student Center Cafe Counter
                  </span>
                  <div className="text-3xl font-black tracking-widest text-[#1E293B] font-mono">
                    #PND-884
                  </div>
                  <p className="text-xs text-slate-500">
                    Your number will be called on the counter queue monitor.
                  </p>
                </div>

                {/* Order Details List */}
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-500">Cafeteria</span>
                    <span className="font-bold text-[#1E293B]">
                      Student Center Cafe
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-500">Items Ordered</span>
                    <span className="font-semibold text-[#1E293B]">
                      1× Jollof Rice & Chicken, 1× Zobo Juice
                    </span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-500">Total Paid</span>
                    <span className="font-bold text-[#1E293B]">₦1,900</span>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          /* ========================================================= */
          /* PAST ORDERS / COMPLETED RUNS HISTORY */
          /* ========================================================= */
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Previous Activity
            </h3>

            {PAST_ORDERS.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1E293B]">
                      {order.token}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {order.vendor} • {order.items}
                  </p>
                  <span className="text-[11px] text-slate-400">
                    {order.date}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#1E293B] block">
                    ₦{order.total.toLocaleString()}
                  </span>
                  <Link
                    href="/menu"
                    className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#377EE9] hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Order again</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
