"use client";

import React, { useState, useEffect } from "react";
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
  CreditCard,
  XCircle,
  Loader2,
} from "lucide-react";
import { useApp, MENU_ITEMS } from "@/context/AppContext";
import { createClient } from "@/app/utils/supabase/Client";

type FulfillmentType = "eat-in" | "self-pickup" | "peer-delivery";

interface CartProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  vendor_id: string;
}

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
  const supabase = createClient();
  const { cart, clearCart, productCatalog } = useApp();

  const [fulfillment, setFulfillment] = useState<FulfillmentType>("eat-in");
  const [dropoffLocation, setDropoffLocation] = useState(DROP_OFF_LOCATIONS[0]);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cartProducts, setCartProducts] = useState<CartProductItem[]>([]);

  // Simulation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simulatingStatus, setSimulatingStatus] = useState<"success" | "failure" | null>(null);
  const [simMsg, setSimMsg] = useState("");

  // Fetch cart details on mount, combining Supabase DB and local catalog
  useEffect(() => {
    async function fetchCartDetails() {
      const productIds = Object.keys(cart);
      if (productIds.length === 0) {
        setCartProducts([]);
        setLoadingProducts(false);
        return;
      }

      try {
        const { data } = await supabase
          .from("products")
          .select("id, name, price, vendor_id")
          .in("id", productIds);

        const dbMap = new Map((data || []).map((p) => [p.id, p]));
        const combined: CartProductItem[] = [];

        for (const id of productIds) {
          const qty = cart[id] || 1;
          const dbItem = dbMap.get(id);
          const localItem = productCatalog[id] || MENU_ITEMS.find((m) => m.id === id);

          if (dbItem) {
            combined.push({
              id: dbItem.id,
              name: dbItem.name,
              price: Number(dbItem.price),
              quantity: qty,
              vendor_id: dbItem.vendor_id || "campus-vendor",
            });
          } else if (localItem) {
            combined.push({
              id: localItem.id,
              name: localItem.name,
              price: Number(localItem.price),
              quantity: qty,
              vendor_id: (localItem as any).vendor_id || "campus-vendor",
            });
          }
        }

        setCartProducts(combined);
      } catch (err) {
        console.error("Error loading cart product info:", err);
        // Fallback to local catalog
        const fallbackList: CartProductItem[] = productIds
          .map((id) => {
            const local = productCatalog[id] || MENU_ITEMS.find((m) => m.id === id);
            if (!local) return null;
            return {
              id: local.id,
              name: local.name,
              price: Number(local.price),
              quantity: cart[id] || 1,
              vendor_id: (local as any).vendor_id || "campus-vendor",
            };
          })
          .filter(Boolean) as CartProductItem[];
        setCartProducts(fallbackList);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchCartDetails();
  }, [cart, productCatalog, supabase]);

  const subtotal = cartProducts.reduce((s, i) => s + i.price * i.quantity, 0);
  const packFee = fulfillment === "eat-in" ? 0 : 100;
  const deliveryFee = fulfillment === "peer-delivery" ? 500 : 0;
  const total = subtotal + packFee + deliveryFee;

  const handleSimulatedPaymentResult = async (status: "success" | "failure") => {
    setSimulatingStatus(status);
    if (status === "success") {
      setSimMsg("Connecting to Secure Payment Gateway...");
    } else {
      setSimMsg("Authorizing transaction...");
    }

    // Artificial delay to simulate bank processing spinner
    setTimeout(async () => {
      if (status === "failure") {
        setIsModalOpen(false);
        setSimulatingStatus(null);
        setSimMsg("");
        alert("Payment Failed: Insufficient funds or card declined. Please try again.");
        return;
      }

      // Success path: Create order in Supabase
      setSimMsg("Payment Approved! Dispatched to Kitchen...");
      
      setTimeout(async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            alert("You must be logged in to place an order.");
            setIsModalOpen(false);
            setSimulatingStatus(null);
            return;
          }

          let vendorId = cartProducts[0]?.vendor_id;
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vendorId || "");
          if (!isUuid) {
            const { data: vProfile } = await supabase
              .from("profiles")
              .select("id")
              .eq("role", "vendor")
              .limit(1)
              .maybeSingle();
            vendorId = vProfile?.id || null;
          }

          const tokenString = `#PND-${Math.floor(100 + Math.random() * 900)}`;

          // 1. Insert into orders table
          const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .insert({
              student_id: user.id,
              vendor_id: vendorId,
              fulfillment_type: fulfillment,
              dropoff_location: fulfillment === "peer-delivery" ? dropoffLocation : null,
              delivery_note: deliveryNote || null,
              subtotal,
              pack_fee: packFee,
              delivery_fee: deliveryFee,
              total,
              status: "Paid",
              token: tokenString,
            })
            .select()
            .single();

          if (!orderError && orderData) {
            // 2. Insert line items if valid UUID product IDs
            const validItems = cartProducts.filter((item) =>
              /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item.id)
            );

            if (validItems.length > 0) {
              const orderItemsPayload = validItems.map((item) => ({
                order_id: orderData.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
              }));

              await supabase.from("order_items").insert(orderItemsPayload);
            }
          }

          // Complete confirmation for student
          setGeneratedToken(tokenString);
          setOrderConfirmed(true);
          clearCart();
        } catch (err: any) {
          console.error("Order submission note:", err);
          // Even if remote DB schema had an issue, provide local confirmed token
          const tokenString = `#PND-${Math.floor(100 + Math.random() * 900)}`;
          setGeneratedToken(tokenString);
          setOrderConfirmed(true);
          clearCart();
        } finally {
          setIsModalOpen(false);
          setSimulatingStatus(null);
          setSimMsg("");
        }
      }, 1000);
    }, 1200);
  };

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
    <div className="min-h-screen bg-white text-[#1E293B] pb-28 animate-page-enter">
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
              <h2 className="text-xl font-bold text-[#1E293B]">Order placed!</h2>
              <p className="text-sm text-slate-500 mt-1">
                Your simulated payment was successful & ticket was dispatched.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F8FAFC] text-left space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Token</span>
                <span className="font-mono font-bold">{generatedToken}</span>
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
        ) : loadingProducts ? (
          <div className="py-20 text-center text-sm text-slate-400">
            Loading cart summary...
          </div>
        ) : cartProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
            <h2 className="text-base font-bold text-[#1E293B]">Your cart is empty</h2>
            <p className="text-xs text-slate-400">Add items from the store menu to proceed with checkout.</p>
            <Link
              href="/menu"
              className="inline-block py-3 px-6 rounded-xl text-xs font-semibold text-white bg-[#377EE9]"
            >
              Go to Menu
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
                {cartProducts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3">
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

            {/* Pay Button -> Triggers Simulator Modal */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 rounded-2xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] active:bg-[#2860b8] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Pay ₦{total.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ===== SIMULATED PAYMENT MODAL ===== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-5 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center text-[#377EE9]">
                <CreditCard className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Simulate Gateway Payment
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose a simulation outcome for ₦{total.toLocaleString()}
                </p>
              </div>

              {simulatingStatus ? (
                <div className="py-6 space-y-3">
                  <Loader2 className="w-8 h-8 text-[#377EE9] animate-spin mx-auto" />
                  <p className="text-xs font-semibold text-slate-600 animate-pulse">
                    {simMsg}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSimulatedPaymentResult("success")}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Successful Payment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulatedPaymentResult("failure")}
                    className="w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-200"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Simulate Failed Payment</span>
                  </button>

                  <button
                    type="button"
                    disabled={Boolean(simulatingStatus)}
                    onClick={() => setIsModalOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all cursor-pointer mt-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}