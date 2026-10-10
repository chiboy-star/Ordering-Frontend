"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/app/utils/supabase/Client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError("");
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Sign in with Supabase Auth
    const { data: authData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

    if (signInError) {
      setGeneralError(signInError.message);
      setLoading(false);
      return;
    }

    // 2. Fetch user profile to route appropriately based on role
    if (authData.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      setLoading(false);

      if (profile?.role === "vendor") {
        router.push("/vendor/dashboard");
      } else {
        router.push("/menu");
      }
    } else {
      setLoading(false);
      router.push("/menu");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1E293B] relative overflow-hidden flex flex-col items-center justify-center px-5 py-10 selection:bg-[#0400FF] selection:text-white">
      {/* ========================================================= */}
      {/* HERO GRADIENT AURA (Matching Landing Page Vibe) */}
      {/* ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[400px] overflow-visible -z-0"
      >
        <div className="w-[320px] sm:w-[420px] h-[280px] sm:h-[320px] mx-auto rounded-full bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#93C5FD] opacity-65 blur-3xl transform -translate-y-6" />
      </div>

      <div className="w-full max-w-[360px] sm:max-w-[400px] relative z-10 animate-page-enter">
        {/* Back Link */}
        <div className="text-left mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Logo at the top center (/Donut_BLUE.png) */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="hover:scale-105 transition-transform duration-300">
            <Image
              src="/Donut_BLUE.png"
              alt="pickNdrop logo"
              width={1043}
              height={1621}
              priority
              className="w-13 h-20 sm:w-15 sm:h-23 object-contain drop-shadow-sm"
            />
          </Link>
        </div>

        {/* Error Alert */}
        {generalError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-medium text-[#FF2B2B] shadow-sm animate-in fade-in duration-200">
            {generalError}
          </div>
        )}

        {/* Form matching mockup input styling */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 text-left"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@pau.edu.ng or vendor@business.com"
              className="w-full px-4 py-3.5 bg-[#F8FAFC] rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-[#1E293B] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0400FF]/20 focus:border-[#0400FF] focus:bg-white transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-semibold text-slate-800 text-left"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] font-semibold text-[#0400FF] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 pr-11 bg-[#F8FAFC] rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-[#1E293B] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0400FF]/20 focus:border-[#0400FF] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button (Electric Blue) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 rounded-2xl text-sm font-bold text-white bg-[#0400FF] hover:bg-[#0300d6] active:scale-95 transition-all cursor-pointer shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>

        <p className="text-xs sm:text-sm text-slate-500 text-center mt-7">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-bold text-[#0400FF] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}