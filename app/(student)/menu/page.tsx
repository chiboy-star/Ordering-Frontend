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
} from "lucide-react";
import { getRandomGreeting, getDefaultGreeting } from "@/lib/greetings";
import { useApp, MENU_ITEMS } from "@/context/AppContext";
import FoodCard from "@/components/FoodCard";

const CATEGORIES = ["All", "Food", "Snacks", "Drinks", "Proteins"];

export default function StorefrontPage() {
  const {
    isRiderMode,
    toggleRiderMode,
    cart,
    addToCart,
    removeFromCart,
    totalCartCount,
    totalCartPrice,
    userName,
  } = useApp();

  // Dynamic Greeting state (SSR-safe mount randomization)
  const [greeting, setGreeting] = useState<string>(getDefaultGreeting(userName));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [modeToast, setModeToast] = useState<string | null>(null);

  // Randomize greeting on component mount / app open
  useEffect(() => {
    setGreeting(getRandomGreeting(userName));
  }, [userName]);

  // Handle rider mode toggle (Global toast handled automatically in AppContext)
  const handleToggleMode = () => {
    toggleRiderMode();
  };

  // Filtered menu items based on category pill and search query
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === "Food" && item.category === "Rice");

      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-[#1E293B] pb-28 sm:pb-32 selection:bg-[#377EE9] selection:text-white animate-page-enter">

      {/* ===== STICKY TOP HEADER & WIREFRAME SHELL ===== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row: Left Text Rows & Right Profile Rider Toggle */}
          <div className="flex items-center justify-between py-3.5 sm:py-4 gap-4">
            {/* Left: Two distinct text rows */}
            <div className="flex flex-col min-w-0">
              {/* Row 1: Dynamic greeting with user's name */}
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#1E293B] truncate">
                  {greeting}
                </h1>
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse hidden sm:inline-block" />
              </div>

              {/* Row 2: Static text header */}
              <p className="text-xs sm:text-sm font-semibold text-slate-500 tracking-wide mt-0.5">
                Student Center Menu
              </p>
            </div>

            {/* Right: Profile Picture Icon & Rider Toggle */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Toggle button */}
              <button
                type="button"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isSearchVisible || searchQuery
                    ? "bg-blue-50 text-[#377EE9]"
                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                }`}
                aria-label="Toggle search"
                title="Search menu items"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Profile Icon / Rider Toggle Button */}
              <button
                type="button"
                onClick={handleToggleMode}
                className={`relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-sm ${
                  isRiderMode
                    ? "border-2 border-[#10B981] bg-emerald-50 text-emerald-600 hover:bg-emerald-100/70"
                    : "border-2 border-[#377EE9] bg-blue-50 text-[#377EE9] hover:bg-blue-100/70"
                }`}
                aria-label={
                  isRiderMode
                    ? "Rider mode active (border green). Tap to toggle buyer mode."
                    : "Buyer mode active (border blue). Tap to toggle rider mode."
                }
                title={
                  isRiderMode
                    ? "Rider Mode (Active) • Tap to switch to Buyer Mode"
                    : "Buyer Mode • Tap to switch to Rider Delivery Mode"
                }
              >
                {isRiderMode ? (
                  /* Rider State: Green border + distinct rider/delivery icon */
                  <>
                    <Bike className="w-5 h-5 text-emerald-600 stroke-[2.2] animate-in zoom-in-75 duration-200" />
                    {/* Active green status beacon */}
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white" />
                    </span>
                  </>
                ) : (
                  /* Buyer State: Primary Blue (#377EE9) border + standard user icon */
                  <>
                    <User className="w-5 h-5 text-[#377EE9] stroke-[2.2] animate-in zoom-in-75 duration-200" />
                    {/* Buyer subtle profile badge */}
                    <span className="absolute -bottom-1 text-[9px] font-black uppercase tracking-widest px-1 bg-white text-[#377EE9] rounded-md shadow-xs border border-blue-100">
                      PA
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Optional Sleek Expandable Search Bar */}
          {isSearchVisible && (
            <div className="pb-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search meals, snacks, drinks, or cafeterias..."
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

          {/* ===== 3. CATEGORIES BAR ===== */}
          {/* Directly above the food cards: horizontal scrollable row of category pills */}
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

      {/* ===== FOOD CARDS CONTAINER (RESPONSIVE GRID) ===== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Results summary if searching */}
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

        {filteredItems.length === 0 ? (
          /* Empty Search / Filter State */
          <div className="py-20 text-center max-w-sm mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B]">
              No items in this category
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
          /* Responsive Multi-Column Food Grid */
          /* Mobile: 2-column stacked grid matching wireframe */
          /* Desktop: expands to 3 & 4 columns */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                inCart={cart[item.id] || 0}
                onAdd={addToCart}
                onRemove={removeFromCart}
                lowQuotaThreshold={8}
              />
            ))}
          </div>
        )}
      </main>

      {/* ===== FLOATING QUICK CART BANNER (Above bottom nav) ===== */}
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