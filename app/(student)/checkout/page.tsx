"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Utensils,
  ShoppingBag,
  Bike,
  ChevronLeft,
  CheckCircle2,
  Building2,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

type FulfillmentType = "eat-in" | "self-pickup" | "peer-delivery";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const MOCK_CART_ITEMS: CartItem[] = [
  { id: "item-1", name: "Jollof Rice & Chicken", price: 1500, quantity: 1 },
  { id: "item-6", name: "Chilled Zobo Juice", price: 400, quantity: 1 },
];

const DROP_OFF_LOCATIONS = [
  "SST Building (Ground Floor)",
  "SST Building (LT-1)",
  "SMC Lobby",
  "Faculty of Engineering",
  "Main Library Quad",
  "Male Hostel Block A",
  "Female Hostel Block B",
];

export default function CheckoutPage() {
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("eat-in");
  const [dropoffLocation, setDropoffLocation] = useState(DROP_OFF_LOCATIONS[0]);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const subtotal = MOCK_CART_ITEMS.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );
  const packFee = fulfillment === "eat-in" ? 0 : 100;
  const deliveryFee = fulfillment === "peer-delivery" ? 500 : 0;
  const total = subtotal + packFee + deliveryFee;

  const fulfillmentOptions: {
    key: FulfillmentType;
    label: string;
    desc: string;
    fee: string;
    icon: React.ElementType;
  }[] = [
    {
      key: "eat-in",
      label: "Eat-In",
      desc: "Skip the billing queue. Get priority number.",
      fee: "Free",
      icon: Utensils,
    },
    {
      key: "self-pickup",
      label: "Self-Pickup",
      desc: "Packed for takeaway on express rack.",
      fee: "+₦100",
      icon: ShoppingBag,
    },
    {
      key: "peer-delivery",
      label: "Peer-Delivery",
      desc: "A student brings it to your faculty.",
      fee: "+₦600",
      icon: Bike,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1E293B] animate-page-enter">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-5 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Menu</span>
          </Link>
          <h1 className="text-base font-bold text-[#1E293B]">Checkout</h1>
          <div className="w-14" />
        </div>

        {orderConfirmed ? (
          /* ===== ORDER CONFIRMED ===== */
          <div className="py-16 text-center space-y-5 max-w-sm mx-auto">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-[#377EE9]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1E293B]">
                Order placed!
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Your kitchen ticket was dispatched.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] text-left space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Token</span>
                <span className="font-mono font-bold">#PND-884</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mode</span>
                <span className="font-semibold capitalize">
                  {fulfillment.replace("-", " ")}
                </span>
              </div>
              {fulfillment === "peer-delivery" && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Drop-off</span>
                  <span className="font-semibold truncate max-w-[180px]">
                    {dropoffLocation}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200/60">
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" /> ETA
                </span>
                <span className="font-bold">8-12 min</span>
              </div>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] transition-colors"
            >
              <span>Back to Menu</span>
            </Link>
          </div>
        ) : (
          <div className="py-6 space-y-7">
            {/* Order Summary */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Your order
              </h2>
              <div className="divide-y divide-slate-100">
                {MOCK_CART_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <span className="text-sm font-semibold text-[#1E293B]">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-400 ml-2">
                        ×{item.quantity}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#1E293B]">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Fulfillment Selector */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Fulfillment
              </h2>
              <div className="space-y-2.5">
                {fulfillmentOptions.map((opt) => {
                  const isActive = fulfillment === opt.key;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFulfillment(opt.key)}
                      className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-50/60 ring-2 ring-[#377EE9]"
                          : "bg-[#F8FAFC] hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isActive
                            ? "bg-[#377EE9] text-white"
                            : "bg-white text-slate-500 border border-slate-200"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#1E293B]">
                            {opt.label}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              opt.key === "eat-in"
                                ? "text-emerald-600"
                                : "text-slate-500"
                            }`}
                          >
                            {opt.fee}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Peer-Delivery Conditional Fields */}
            {fulfillment === "peer-delivery" && (
              <section className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Drop-off location
                </h2>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full pl-10 pr-8 py-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-sm font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#377EE9]/20 focus:border-[#377EE9] transition-all appearance-none cursor-pointer"
                  >
                    {DROP_OFF_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <ChevronLeft className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none -rotate-90" />
                </div>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    placeholder="Note for runner (e.g. Room 204)"
                    className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#377EE9]/20 focus:border-[#377EE9] transition-all"
                  />
                </div>
              </section>
            )}

            {/* Payment Breakdown */}
            <section className="pt-4 border-t border-slate-100 space-y-2.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-[#1E293B]">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              {packFee > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Pack fee</span>
                  <span className="font-medium text-[#1E293B]">
                    ₦{packFee.toLocaleString()}
                  </span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Delivery fee</span>
                  <span className="font-medium text-[#1E293B]">
                    ₦{deliveryFee.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-3 border-t border-slate-200/60">
                <span className="font-bold text-[#1E293B]">Total</span>
                <span className="text-xl font-bold text-[#1E293B]">
                  ₦{total.toLocaleString()}
                </span>
              </div>
            </section>

            {/* Submit Button */}
            <button
              type="button"
              onClick={() => setOrderConfirmed(true)}
              className="w-full py-4 rounded-2xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] active:bg-[#2860b8] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Pay ₦{total.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
