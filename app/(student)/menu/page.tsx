"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  X,
  User,
  Bike,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";
import { getRandomGreeting, getDefaultGreeting } from "@/lib/greetings";
import { useApp } from "@/context/AppContext";
import { createClient } from "@/app/utils/supabase/Client";

const CATEGORIES = ["All", "Food", "Snacks", "Drinks"];

interface DbProduct {
  id: string;
  vendor_id: string;
  name: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url: string;
  available: boolean;
}

export default function StorefrontPage() {
  const supabase = createClient();
  const {
    isRiderMode,
    toggleRiderMode,
    cart,
    addToCart,
    removeFromCart,
    totalCartCount,
    totalCartPrice,
    userName: defaultUserName,
  } = useApp();

  const [userName, setUserName] = useState<string>(defaultUserName || "");
  const [greeting, setGreeting] = useState<string>(getDefaultGreeting(defaultUserName));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Database Products State
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch logged-in user's profile name and products on mount
  useEffect(() => {
    async function loadUserDataAndProducts() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          if (profile?.full_name) {
            setUserName(profile.full_name);
            setGreeting(getRandomGreeting(profile.full_name));
          }
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }

      fetchStoreProducts();
    }

    loadUserDataAndProducts();
  }, [supabase]);

  // Fetch real products from Supabase
  const fetchStoreProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDbProducts(data);
      }
    } catch (err) {
      console.error("Error loading store products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleToggleMode = () => {
    toggleRiderMode();
  };

  // Filtered menu items based on category pill and search query
  const filteredItems = useMemo(() => {
    return dbProducts.filter((item) => {
      const matchCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "Food" && (item.category === "Rice" || item.category === "Food"));

      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [dbProducts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-[#1E293B] pb-28 sm:pb-32 selection:bg-[#377EE9] selection:text-white animate-page-enter">
      {/* ===== STICKY TOP HEADER & WIREFRAME SHELL ===== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3.5 sm:py-4 gap-4">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#1E293B] truncate">
                  {greeting}
                </h1>
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse hidden sm:inline-block" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide mt-0.5">
                Student Center Menu
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isSearchVisible || searchQuery
                    ? "bg-blue-50 text-[#377EE9]"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleToggleMode}
                className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-sm ${
                  isRiderMode
                    ? "border-2 border-[#10B981] bg-emerald-50 text-emerald-600 hover:bg-emerald-100/70"
                    : "border-2 border-[#377EE9] bg-blue-50 text-[#377EE9] hover:bg-blue-100/70"
                }`}
              >
                {isRiderMode ? (
                  <>
                    <Bike className="w-5 h-5 text-emerald-600 stroke-[2.2]" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white" />
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 text-[#377EE9] stroke-[2.2]" />
                    <span className="absolute -bottom-1 text-[9px] font-black uppercase tracking-widest px-1 bg-white text-[#377EE9] rounded-md shadow-xs border border-blue-100">
                      PA
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {isSearchVisible && (
            <div className="pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals, snacks, drinks..."
                  autoFocus
                  className="w-full pl-10 pr-9 py-2.5 bg-[#F8FAFC] border border-slate-200/80 rounded-xl text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#377EE9]/20 focus:border-[#377EE9] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Categories Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 pt-1 -mx-1 px-1">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                    isActive
                      ? "bg-[#377EE9] text-white shadow-sm shadow-blue-500/25 scale-[1.02]"
                      : "bg-[#F8FAFC] text-slate-600 hover:text-[#1E293B] hover:bg-slate-100 border border-slate-200/70"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ===== FOOD CARDS CONTAINER ===== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {searchQuery && (
          <div className="flex items-center justify-between pb-3 text-xs text-slate-500">
            <span>
              Showing {filteredItems.length} results for &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-[#377EE9] hover:underline font-medium cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}

        {loadingProducts ? (
          <div className="py-20 text-center text-sm text-slate-400">
            Loading menu items from store...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B]">
              No items available
            </h3>
            <p className="text-xs text-slate-400">
              Try choosing another category or clearing your search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#377EE9] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <span>View All Menu Items</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredItems.map((product) => {
              const qtyInCart = cart[product.id] || 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image */}
                    <div className="relative w-full h-36 sm:h-40 bg-slate-100 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                          Only {product.stock_quantity} left
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#377EE9] bg-blue-50 px-2 py-0.5 rounded-md">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#1E293B] line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-black text-[#1E293B]">
                        ₦{Number(product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Cart Action Footer */}
                  <div className="p-3 sm:p-4 pt-0">
                    {qtyInCart === 0 ? (
                      <button
                        type="button"
                        onClick={() => addToCart(product.id)}
                        className="w-full py-2 px-3 rounded-xl bg-[#377EE9] hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="w-8 h-8 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-extrabold text-[#1E293B]">
                          {qtyInCart}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(product.id)}
                          className="w-8 h-8 rounded-lg bg-[#377EE9] text-white hover:bg-blue-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ===== FLOATING QUICK CART BANNER ===== */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-30 px-4 sm:px-6 max-w-md sm:max-w-lg mx-auto pointer-events-none">
          <Link
            href="/checkout"
            className="pointer-events-auto flex items-center justify-between py-3 px-4.5 rounded-2xl bg-[#1E293B] text-white shadow-xl hover:bg-slate-800 transition-all active:scale-[0.99] border border-slate-700/50"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#377EE9] flex items-center justify-center text-xs font-black shadow-sm">
                {totalCartCount}
              </span>
              <span className="text-xs sm:text-sm font-bold">View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white">
                ₦{totalCartPrice.toLocaleString()}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}