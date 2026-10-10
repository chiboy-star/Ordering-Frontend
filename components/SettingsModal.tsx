"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  X,
  User,
  ShieldCheck,
  Bell,
  MapPin,
  Bike,
  LogOut,
  ChevronRight,
  Wallet,
} from "lucide-react";
import Link from "next/link";

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, isRiderMode, toggleRiderMode } =
    useApp();

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Modal / Sheet Card */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 z-10 max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        {/* iOS Grabber Handle for mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#1E293B]">Settings</h2>
            <p className="text-xs text-slate-400">Account & delivery preferences</p>
          </div>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Profile Info */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-100">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-sm transition-colors ${
                isRiderMode ? "bg-emerald-600" : "bg-[#377EE9]"
              }`}
            >
              PA
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1E293B] truncate">
                  Paul Adeyemi
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-[#377EE9] border border-blue-100">
                  <ShieldCheck className="w-3 h-3 text-[#377EE9]" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                p.adeyemi@pau.edu.ng
              </p>
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                Matric: 21/0458 • SST
              </p>
            </div>
          </div>

          {/* Rider Mode Quick Switch */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isRiderMode
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1E293B] block">
                  Peer Delivery Rider Mode
                </span>
                <span className="text-[11px] text-slate-400">
                  {isRiderMode ? "Active • Ready for orders" : "Inactive • Buyer mode"}
                </span>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isRiderMode}
              onClick={toggleRiderMode}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                isRiderMode ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  isRiderMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rider Wallet summary if active */}
          {isRiderMode && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="text-xs font-semibold text-emerald-900 block">
                    Rider Payout Balance
                  </span>
                  <span className="text-xs text-emerald-700">PAU Campus Wallet</span>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-700">₦2,400.00</span>
            </div>
          )}

          {/* Preferences list */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Preferences
            </h3>

            <div className="divide-y divide-slate-100 rounded-2xl bg-[#F8FAFC] border border-slate-100">
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-[#1E293B]">
                    Push Notifications
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#377EE9]">Enabled</span>
              </div>

              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-[#1E293B]">
                    Default Building
                  </span>
                </div>
                <span className="text-xs text-slate-600">SST Building</span>
              </div>

              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-[#1E293B]">
                    Student Profile
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-2">
            <Link
              href="/auth/login"
              onClick={() => setIsSettingsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
