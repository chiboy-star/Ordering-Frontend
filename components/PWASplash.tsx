"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Utensils } from "lucide-react";

function getStandaloneSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.includes("android-app://")
  );
}

function getStandaloneServerSnapshot(): boolean {
  return false;
}

function subscribeToDisplayMode(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(display-mode: standalone)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export default function PWASplash() {
  const isStandalone = useSyncExternalStore(
    subscribeToDisplayMode,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot
  );

  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!isStandalone) return;
    const dismissTimer = setTimeout(() => {
      setIsDismissed(true);
    }, 1500);

    return () => clearTimeout(dismissTimer);
  }, [isStandalone]);

  if (!isStandalone || isDismissed) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-label="Loading application"
      className="fixed inset-0 z-[9999] h-screen w-screen bg-white flex flex-col justify-between items-center select-none pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] transition-opacity duration-300"
    >
      <div className="w-full h-8" />

      {/* Center Flat Identity */}
      <div className="flex flex-col items-center justify-center space-y-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-[#377EE9] flex items-center justify-center text-white shadow-sm">
          <Utensils className="w-8 h-8 stroke-[2.2]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-[#1E293B] tracking-tight">
            pickNdrop
          </h1>
          <p className="text-xs text-slate-400">
            Pan-Atlantic University
          </p>
        </div>

        {/* Minimalist Loading Indicator */}
        <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-[#377EE9] w-2/3 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="pb-8 text-center">
        <span className="text-[11px] text-slate-400 font-medium">
          Loading campus eateries...
        </span>
      </div>
    </aside>
  );
}
