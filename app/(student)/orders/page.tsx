"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { createClient } from "@/app/utils/supabase/Client";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  Bike,
  PhoneCall,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";

interface OrderItemDisplay {
  id: string;
  quantity: number;
  price: number;
  products?: {
    name: string;
  } | {
    name: string;
  }[];
}

interface SupabaseOrder {
  id: string;
  token: string;
  created_at: string;
  fulfillment_type: string;
  dropoff_location?: string;
  delivery_note?: string;
  total: number;
  status: string;
  order_items: OrderItemDisplay[];
}

export default function OrdersPage() {
  const supabase = createClient();
  const { isRiderMode } = useApp();
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [riderJobStep, setRiderJobStep] = useState<"assigned" | "picked-up" | "delivered">("assigned");

  const [activeOrders, setActiveOrders] = useState<SupabaseOrder[]>([]);
  const [pastOrders, setPastOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real orders from Supabase
  useEffect(() => {
    async function fetchOrders() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            token,
            created_at,
            fulfillment_type,
            dropoff_location,
            delivery_note,
            total,
            status,
            order_items (
              id,
              quantity,
              price,
              products (
                name
              )
            )
          `)
          .eq("student_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const active = data.filter(
            (o) => o.status !== "Delivered" && o.status !== "Completed" && o.status !== "Picked Up"
          );
          const history = data.filter(
            (o) => o.status === "Delivered" || o.status === "Completed" || o.status === "Picked Up"
          );

          setActiveOrders(active as SupabaseOrder[]);
          setPastOrders(history as SupabaseOrder[]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [supabase]);

  // Helper to safely extract product name whether Supabase returns an object or array
  const getProductName = (prodField: OrderItemDisplay["products"]) => {
    if (!prodField) return "Item";
    if (Array.isArray(prodField)) {
      return prodField[0]?.name || "Item";
    }
    return prodField.name || "Item";
  };

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

        {/* Tab Switcher */}
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
            {isRiderMode ? "Active Rider Job" : `Active Orders (${activeOrders.length})`}
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

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400">
            Loading your orders...
          </div>
        ) : activeTab === "active" ? (
          isRiderMode ? (
            <div className="space-y-6">
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
                    </div>
                  </div>
                </div>

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
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-[#377EE9] hover:bg-[#2f6fd4] transition-colors shadow-xs cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Confirm Picked Up</span>
                    </button>
                  ) : riderJobStep === "picked-up" ? (
                    <button
                      type="button"
                      onClick={() => setRiderJobStep("delivered")}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
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
            </div>
          ) : (
            <div className="space-y-6">
              {activeOrders.length === 0 ? (
                <div className="py-20 text-center space-y-4 max-w-sm mx-auto bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
                  <div className="w-12 h-12 bg-blue-50 text-[#377EE9] rounded-2xl mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#1E293B]">No active orders</h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Your placed kitchen orders and live delivery tickets will appear here.
                    </p>
                  </div>
                  <Link
                    href="/menu"
                    className="inline-block py-3 px-6 rounded-xl text-xs font-semibold text-white bg-[#377EE9] shadow-xs"
                  >
                    Browse Menu & Order
                  </Link>
                </div>
              ) : (
                activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Status: {order.status}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#377EE9] flex items-center justify-center">
                        <Clock className="w-6 h-6 animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-3 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-[#1E293B]">
                          1. Order received & payment verified
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#377EE9] text-white flex items-center justify-center animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="text-xs font-bold text-[#377EE9]">
                          2. Kitchen in preparation & packaging
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-center space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#377EE9]">
                        Show at Cafeteria Counter
                      </span>
                      <div className="text-3xl font-black tracking-widest text-[#1E293B] font-mono">
                        {order.token || "#PND-000"}
                      </div>
                      <p className="text-xs text-slate-500">
                        Fulfillment: <span className="capitalize font-semibold">{order.fulfillment_type?.replace("-", " ")}</span>
                        {order.dropoff_location && ` • To: ${order.dropoff_location}`}
                      </p>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="py-2.5 flex justify-between">
                        <span className="text-slate-500">Items Ordered</span>
                        <span className="font-semibold text-[#1E293B] text-right">
                          {order.order_items?.map((i) => `${i.quantity}× ${getProductName(i.products)}`).join(", ")}
                        </span>
                      </div>
                      <div className="py-2.5 flex justify-between">
                        <span className="text-slate-500">Total Paid</span>
                        <span className="font-bold text-[#1E293B]">₦{Number(order.total).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )
        ) : (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Previous Activity ({pastOrders.length})
            </h3>

            {pastOrders.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200 p-6">
                No past order history found.
              </div>
            ) : (
              pastOrders.map((order) => {
                const itemSummary = order.order_items
                  ?.map((i) => `${i.quantity}× ${getProductName(i.products)}`)
                  .join(", ");

                const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
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
                          {order.status || "Completed"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {itemSummary}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {formattedDate}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-black text-[#1E293B] block">
                        ₦{Number(order.total).toLocaleString()}
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
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}