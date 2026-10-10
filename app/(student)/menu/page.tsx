"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronDown,
  ArrowRight,
  Utensils,
  History,
  X,
  Plus,
  Minus,
  Wallet,
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  vendor: string;
  remainingQuota: number;
  image: string;
  prepTime: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Jollof Rice & Chicken",
    price: 1500,
    category: "Rice",
    vendor: "Student Center Cafe",
    remainingQuota: 8,
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=400&fit=crop&q=80",
    prepTime: "8 min",
  },
  {
    id: "item-2",
    name: "Fried Rice & Diced Beef",
    price: 1600,
    category: "Rice",
    vendor: "Student Center Cafe",
    remainingQuota: 14,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&q=80",
    prepTime: "10 min",
  },
  {
    id: "item-3",
    name: "Golden Flaky Meat Pie",
    price: 600,
    category: "Snacks",
    vendor: "SST Snack Bar",
    remainingQuota: 5,
    image:
      "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=600&h=400&fit=crop&q=80",
    prepTime: "Ready",
  },
  {
    id: "item-4",
    name: "Peppered Grilled Chicken",
    price: 1200,
    category: "Proteins",
    vendor: "Main Quad Cafeteria",
    remainingQuota: 7,
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74f0e7c827?w=600&h=400&fit=crop&q=80",
    prepTime: "5 min",
  },
  {
    id: "item-5",
    name: "Glazed Cinnamon Doughnut",
    price: 450,
    category: "Snacks",
    vendor: "Campus Buttery",
    remainingQuota: 18,
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop&q=80",
    prepTime: "Fresh",
  },
  {
    id: "item-6",
    name: "Chilled Zobo Juice",
    price: 400,
    category: "Drinks",
    vendor: "SST Snack Bar",
    remainingQuota: 22,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop&q=80",
    prepTime: "Chilled",
  },
  {
    id: "item-7",
    name: "Canned Malta Guinness",
    price: 500,
    category: "Drinks",
    vendor: "Student Center Cafe",
    remainingQuota: 30,
    image:
      "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600&h=400&fit=crop&q=80",
    prepTime: "Ice Cold",
  },
  {
    id: "item-8",
    name: "Ofada Rice & Ayamase",
    price: 1800,
    category: "Rice",
    vendor: "Main Quad Cafeteria",
    remainingQuota: 4,
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop&q=80",
    prepTime: "12 min",
  },
];

const CATEGORIES = ["All", "Rice", "Snacks", "Proteins", "Drinks"];
const CAMPUS_NODES = [
  "SST Building",
  "SMC Lobby",
  "Faculty of Engineering",
  "Main Library Quad",
  "Student Center",
];

export default function StorefrontPage() {
  const [selectedLocation, setSelectedLocation] = useState("SST Building");
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isRiderMode, setIsRiderMode] = useState(false);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const count = prev[id] || 0;
      if (count <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: count - 1 };
    });
  };

  const totalCartCount = useMemo(
    () => Object.values(cart).reduce((s, c) => s + c, 0),
    [cart]
  );

  const totalCartPrice = useMemo(
    () =>
      Object.entries(cart).reduce((s, [id, c]) => {
        const item = MENU_ITEMS.find((m) => m.id === id);
        return s + (item ? item.price * c : 0);
      }, 0),
    [cart]
  );

  return (
    <div className="min-h-screen bg-white text-[#1E293B] pb-20 lg:pb-6 animate-page-enter">
      {/* ===== STICKY HEADER ===== */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Top row */}
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Location picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-[#1E293B] truncate max-w-[160px] sm:max-w-none">
                  {selectedLocation}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </button>

              {showLocationPicker && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLocationPicker(false)}
                  />
                  <div className="absolute left-0 mt-2 w-60 rounded-xl bg-white border border-slate-200 shadow-lg py-1 z-50">
                    {CAMPUS_NODES.map((node) => (
                      <button
                        key={node}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(node);
                          setShowLocationPicker(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          selectedLocation === node
                            ? "text-[#377EE9] font-semibold bg-blue-50"
                            : "text-[#1E293B] hover:bg-slate-50"
                        }`}
                      >
                        {node}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-xs sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-9 pr-8 py-2.5 bg-[#F8FAFC] rounded-xl text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#377EE9]/20 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 -mx-1 px-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#377EE9] text-white shadow-sm"
                      : "bg-transparent text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-[#1E293B]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ===== MENU GRID ===== */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-5">
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-500">
              No items found. Try a different search or category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-3 text-sm font-semibold text-[#377EE9] hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredItems.map((item) => {
              const inCart = cart[item.id] || 0;
              const isLow = item.remainingQuota <= 8;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Food Image */}
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Low-quota badge */}
                    {isLow && (
                      <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-[#FF2B2B] text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                        {item.remainingQuota} left
                      </span>
                    )}

                    {/* Prep time */}
                    <span className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-lg shadow-sm">
                      {item.prepTime}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#1E293B] leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.vendor}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#1E293B]">
                        ₦{item.price.toLocaleString()}
                      </span>

                      {inCart > 0 ? (
                        <div className="flex items-center gap-0.5 bg-[#F8FAFC] rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-[#FF2B2B] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold text-[#1E293B] w-6 text-center">
                            {inCart}
                          </span>
                          <button
                            type="button"
                            onClick={() => addToCart(item.id)}
                            disabled={inCart >= item.remainingQuota}
                            className="w-8 h-8 flex items-center justify-center text-[#377EE9] hover:text-[#2f6fd4] disabled:text-slate-300 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item.id)}
                          className="h-8 px-3.5 rounded-xl text-xs font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] active:bg-[#2860b8] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ===== FLOATING CHECKOUT BAR ===== */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-16 lg:bottom-6 left-0 right-0 z-30 px-5 sm:px-8 max-w-6xl mx-auto">
          <Link
            href="/checkout"
            className="flex items-center justify-between py-3.5 px-5 rounded-2xl bg-[#1E293B] text-white shadow-lg hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#377EE9] flex items-center justify-center text-xs font-bold">
                {totalCartCount}
              </span>
              <span className="text-sm font-semibold">View Cart</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                ₦{totalCartPrice.toLocaleString()}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </Link>
        </div>
      )}

      {/* ===== BOTTOM TAB BAR (MOBILE) ===== */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 lg:hidden z-40">
        <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
          <Link
            href="/menu"
            className="flex flex-col items-center gap-0.5 py-1 px-3 text-[#377EE9]"
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Menu</span>
          </Link>

          <Link
            href="/orders"
            className="flex flex-col items-center gap-0.5 py-1 px-3 text-slate-400"
          >
            <History className="w-5 h-5" />
            <span className="text-[10px] font-medium">Orders</span>
          </Link>

          {/* Rider toggle */}
          <div className="flex items-center gap-2 py-1 px-3">
            {isRiderMode && (
              <div className="flex items-center gap-1 text-[#1E293B]">
                <Wallet className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-bold">₦0.00</span>
              </div>
            )}
            <button
              type="button"
              role="switch"
              aria-checked={isRiderMode}
              onClick={() => setIsRiderMode(!isRiderMode)}
              className={`relative inline-flex h-6 w-10 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                isRiderMode ? "bg-[#377EE9]" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-[3px] ml-[3px] ${
                  isRiderMode ? "translate-x-4" : "translate-x-0"
                }`}
                style={{ width: 18, height: 18 }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ===== DESKTOP SIDEBAR NAV (lg+) ===== */}
      <div className="hidden lg:flex fixed bottom-6 left-6 z-30 flex-col gap-2 bg-white rounded-2xl border border-slate-200 shadow-lg p-2">
        <Link
          href="/menu"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[#377EE9] bg-blue-50"
        >
          <Utensils className="w-4 h-4" />
          <span>Menu</span>
        </Link>
        <Link
          href="/orders"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
        >
          <History className="w-4 h-4" />
          <span>Orders</span>
        </Link>
        <div className="border-t border-slate-100 pt-2 mt-1 px-3 pb-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-500">Rider</span>
            <button
              type="button"
              role="switch"
              aria-checked={isRiderMode}
              onClick={() => setIsRiderMode(!isRiderMode)}
              className={`relative inline-flex h-6 w-10 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                isRiderMode ? "bg-[#377EE9]" : "bg-slate-200"
              }`}
            >
              <span
                className="inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-[3px] ml-[3px]"
                style={{
                  width: 18,
                  height: 18,
                  transform: isRiderMode ? "translateX(16px)" : "translateX(0)",
                }}
              />
            </button>
          </div>
          {isRiderMode && (
            <div className="flex items-center gap-1 mt-2 text-slate-600">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold">₦0.00</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
