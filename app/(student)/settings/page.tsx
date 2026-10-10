"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { createClient } from "@/app/utils/supabase/Client";
import {
  ChevronLeft,
  ShieldCheck,
  Bike,
  Wallet,
  Bell,
  MapPin,
  LogOut,
  Smartphone,
  Download,
  CheckCircle2,
  Share,
} from "lucide-react";
import { usePWAInstall } from "@/lib/usePWAInstall";

const CAMPUS_BUILDINGS = [
  "SST Building (Ground Floor)",
  "SST Building (LT-1)",
  "SMC Lobby",
  "Faculty of Engineering",
  "Main Library Quad",
  "Male Hostel Block A",
  "Female Hostel Block B",
];

interface ProfileData {
  full_name?: string;
  phone_number?: string;
  role?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { isRiderMode, toggleRiderMode } = useApp();
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState("SST Building (Ground Floor)");
  const [isBuildingPickerOpen, setIsBuildingPickerOpen] = useState(false);

  // User Profile State
  const [userEmail, setUserEmail] = useState("student@pau.edu.ng");
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    phone_number: "",
    role: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch real profile from Supabase
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          if (user.email) setUserEmail(user.email);

          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, phone_number, role")
            .eq("id", user.id)
            .maybeSingle();

          if (!error && data) {
            setProfile(data);
          }
        }
      } catch (err) {
        console.error("Error fetching user settings profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadUserProfile();
  }, [supabase]);

  // Compute initials dynamically (e.g., "Clinton" -> "CL", "Paul Adeyemi" -> "PA")
  const userInitials = React.useMemo(() => {
    if (!profile.full_name) return "PA";
    const parts = profile.full_name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }, [profile.full_name]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
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
            Settings & Profile
          </h1>
          <div className="w-20" />
        </div>

        {/* User Profile Card */}
        <section className="bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar with dynamic border based on mode */}
            <div
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl text-white shadow-sm transition-all duration-300 ${
                isRiderMode
                  ? "bg-emerald-600 ring-4 ring-emerald-400/20"
                  : "bg-[#377EE9] ring-4 ring-blue-400/20"
              }`}
            >
              {userInitials}
              <span
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white ${
                  isRiderMode ? "bg-emerald-500" : "bg-[#377EE9]"
                }`}
              >
                {isRiderMode ? "⚡" : "✓"}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-[#1E293B] truncate">
                  {loadingProfile ? "Loading..." : profile.full_name || "Campus Student"}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#377EE9] border border-blue-100">
                  <ShieldCheck className="w-3 h-3 text-[#377EE9]" />
                  PAU Verified
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {userEmail}
              </p>

              <div className="flex items-center gap-2 mt-2 text-[11px] font-medium text-slate-500 flex-wrap">
                <span className="font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200/80 text-[#1E293B] capitalize">
                  Role: {profile.role || "student"}
                </span>
                {profile.phone_number && (
                  <span>Phone: {profile.phone_number}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Rider Mode Interactive Card */}
        <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                  isRiderMode
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E293B]">
                  Peer Delivery Rider Mode
                </h3>
                <p className="text-xs text-slate-400">
                  {isRiderMode
                    ? "Online • Receiving campus delivery orders"
                    : "Inactive • Browsing menu as a buyer"}
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isRiderMode}
              onClick={toggleRiderMode}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                isRiderMode ? "bg-emerald-500" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                  isRiderMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rider status banner when active */}
          {isRiderMode && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">
                    Rider Payout Balance
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    3 jobs completed today (₦600/avg)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-black text-emerald-800">
                  ₦2,400.00
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Cash Out
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Dining & Delivery Preferences */}
        <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Delivery & Dining Preferences
          </h3>

          <div className="divide-y divide-slate-100">
            {/* Default Dropoff Location */}
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#377EE9] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E293B] block">
                    Default Campus Drop-off
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedBuilding}
                  </span>
                </div>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBuildingPickerOpen(!isBuildingPickerOpen)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#377EE9] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Change
                </button>

                {isBuildingPickerOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsBuildingPickerOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-30">
                      {CAMPUS_BUILDINGS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setSelectedBuilding(b);
                            setIsBuildingPickerOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${
                            selectedBuilding === b
                              ? "bg-blue-50 text-[#377EE9] font-bold"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E293B] block">
                    Instant Notifications
                  </span>
                  <span className="text-xs text-slate-400">
                    Order readiness alerts & rider dispatch
                  </span>
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={notificationsEnabled}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  notificationsEnabled ? "bg-[#377EE9]" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    notificationsEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Progressive Web App (PWA) Card */}
        <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#377EE9] flex items-center justify-center">
                <Smartphone className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E293B]">
                  pickNdrop Mobile App
                </h3>
                <p className="text-xs text-slate-400">
                  {isInstalled
                    ? "Installed & running in standalone mode"
                    : "Add to home screen for offline dining & instant access"}
                </p>
              </div>
            </div>

            {isInstalled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Installed
              </span>
            ) : isInstallable ? (
              <button
                type="button"
                onClick={installApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#377EE9] hover:bg-blue-600 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            ) : null}
          </div>

          {!isInstalled && isIOS && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
                <Share className="w-3.5 h-3.5 text-[#377EE9]" />
                <span>iOS Installation Guide</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tap the Safari <strong>Share</strong> button at the bottom of the screen, scroll down, and select <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
            </div>
          )}
        </section>

        {/* Security & Sign Out */}
        <section className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-slate-400">App Version</span>
            <span className="text-xs font-mono font-medium text-slate-600">
              v1.2.0 (PAU Web PWA)
            </span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-red-100 mt-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from Campus Device</span>
          </button>
        </section>
      </div>
    </div>
  );
}