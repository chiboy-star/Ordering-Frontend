"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Bike, User, Info } from "lucide-react";

export default function GlobalToast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] pointer-events-none px-4 w-full max-w-sm flex justify-center animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl border text-xs font-bold backdrop-blur-xl transition-all ${
          toast.mode === "rider"
            ? "bg-[#064e3b]/95 text-white border-emerald-500/50 shadow-emerald-950/40"
            : toast.mode === "buyer"
            ? "bg-[#1E293B]/95 text-white border-[#377EE9]/50 shadow-slate-950/40"
            : "bg-[#1E293B]/95 text-white border-slate-700 shadow-slate-950/40"
        }`}
      >
        {toast.mode === "rider" ? (
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Bike className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>
        ) : toast.mode === "buyer" ? (
          <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-[#377EE9]" />
          </div>
        ) : (
          <Info className="w-4 h-4 text-slate-300" />
        )}
        <span className="tracking-tight select-none">{toast.message}</span>
      </div>
    </div>
  );
}
