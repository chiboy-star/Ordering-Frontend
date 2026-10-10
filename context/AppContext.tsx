"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  vendor: string;
  remainingQuota: number;
  image: string;
  prepTime: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "item-1",
    name: "Jollof Rice & Chicken",
    price: 1500,
    category: "Food",
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
    category: "Food",
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
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop&q=80",
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
    category: "Food",
    vendor: "Main Quad Cafeteria",
    remainingQuota: 4,
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop&q=80",
    prepTime: "12 min",
  },
];

export interface ToastInfo {
  message: string;
  mode: "rider" | "buyer" | "info";
}

interface AppContextType {
  isRiderMode: boolean;
  setIsRiderMode: (val: boolean) => void;
  toggleRiderMode: () => void;
  cart: Record<string, number>;
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalCartCount: number;
  totalCartPrice: number;
  userName: string;
  toast: ToastInfo | null;
  showToast: (message: string, mode?: "rider" | "buyer" | "info") => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (val: boolean) => void;
  isActiveOrderOpen: boolean;
  setIsActiveOrderOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isRiderMode, setIsRiderMode] = useState<boolean>(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [userName] = useState<string>("Paul");
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isActiveOrderOpen, setIsActiveOrderOpen] = useState<boolean>(false);

  // Sync cart and rider status from/to localStorage if in browser
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("pickndrop_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedRider = localStorage.getItem("pickndrop_rider");
      if (savedRider !== null) {
        setIsRiderMode(savedRider === "true");
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (message: string, mode: "rider" | "buyer" | "info" = "info") => {
    setToast({ message, mode });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const toggleRiderMode = () => {
    setIsRiderMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pickndrop_rider", String(next));
      } catch {
        // ignore
      }
      // Trigger global top toast
      if (next) {
        showToast("Switched to Rider Mode (Online • Receiving Jobs)", "rider");
      } else {
        showToast("Switched to Buyer Mode (Student Center Menu)", "buyer");
      }
      return next;
    });
  };

  const addToCart = (id: string) => {
    setCart((prev) => {
      const item = MENU_ITEMS.find((m) => m.id === id);
      const current = prev[id] || 0;
      if (item && current >= item.remainingQuota) {
        return prev;
      }
      const updated = { ...prev, [id]: current + 1 };
      try {
        localStorage.setItem("pickndrop_cart", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      let updated: Record<string, number>;
      if (current <= 1) {
        updated = { ...prev };
        delete updated[id];
      } else {
        updated = { ...prev, [id]: current - 1 };
      }
      try {
        localStorage.setItem("pickndrop_cart", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart({});
    try {
      localStorage.removeItem("pickndrop_cart");
    } catch {
      // ignore
    }
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
    <AppContext.Provider
      value={{
        isRiderMode,
        setIsRiderMode,
        toggleRiderMode,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalCartCount,
        totalCartPrice,
        userName,
        toast,
        showToast,
        isSettingsOpen,
        setIsSettingsOpen,
        isActiveOrderOpen,
        setIsActiveOrderOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
