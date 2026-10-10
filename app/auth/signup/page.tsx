"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft, Mail, CheckCircle2, Store, GraduationCap } from "lucide-react";
import { createClient } from "@/app/utils/supabase/Client";

export default function SignUpPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  // Success state: show celebratory confirmation card + toast
  const [isRegistered, setIsRegistered] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setGeneralError("");

    const trimmedEmail = email.trim().toLowerCase();

    // Student email validation constraint
    if (!isVendor && !trimmedEmail.endsWith("@pau.edu.ng")) {
      setEmailError("Student accounts must use an official @pau.edu.ng email address.");
      return;
    }

    setLoading(true);

    const role = isVendor ? "vendor" : "student";
    const derivedName = trimmedEmail.split("@")[0].replace(/[._-]/g, " ");

    // 1. Sign up user in Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    if (signUpError) {
      setGeneralError(signUpError.message);
      setLoading(false);
      return;
    }

    // 2. Explicitly insert profile record to public.profiles table
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: trimmedEmail,
        role: role,
        sub_role: "standard",
        full_name: derivedName,
      });

      if (profileError) {
        setGeneralError(`Profile creation note: ${profileError.message}`);
        // Not fatal if signup succeeded
      }
    }

    setLoading(false);
    setIsRegistered(true);

    // Trigger success toast notification
    setToastMessage("Verification link sent! Please check your email inbox.");
  };

  return (
    <div className="min-h-screen bg-white text-[#1E293B] relative overflow-hidden flex flex-col items-center justify-center px-5 py-10 selection:bg-[#0400FF] selection:text-white">
      {/* ========================================================= */}
      {/* GLOBAL TOAST NOTIFICATION (Fixed at Top) */}
      {/* ========================================================= */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm flex justify-center animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-2xl border text-xs font-bold backdrop-blur-xl bg-[#0400FF]/95 text-white border-blue-400/50 shadow-blue-900/30">
            <Mail className="w-4 h-4 text-white animate-bounce" />
            <span className="tracking-tight">{toastMessage}</span>
          </div>
        </div>
      )}

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
        <div className="flex justify-center mb-6">
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

        {/* ========================================================= */}
        {/* STATE A: VERIFICATION CONFIRMATION SCREEN */}
        {/* ========================================================= */}
        {isRegistered ? (
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-blue-50 text-[#0400FF] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Mail className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#1E293B]">
                Check your email
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                We sent a verification link to{" "}
                <span className="font-bold text-[#0400FF]">{email}</span>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 text-[11px] text-slate-500 text-left space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verification email dispatched</span>
              </div>
              <p>Click the link inside to authenticate your account and start ordering.</p>
            </div>

            <div className="pt-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#0400FF] hover:bg-[#0300d6] shadow-md shadow-blue-600/20 active:scale-95 transition-all"
              >
                Proceed to Login
              </Link>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* STATE B: SIGN UP FORM */
          /* ========================================================= */
          <>
            {/* Error Alert */}
            {generalError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs font-medium text-[#FF2B2B] shadow-sm animate-in fade-in duration-200">
                {generalError}
              </div>
            )}

            {/* VENDOR TOGGLE ABOVE THE INPUTS (As explicitly requested) */}
            <div className="mb-5">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 text-left">
                Select Account Type
              </span>
              <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/60 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsVendor(false);
                    setEmailError("");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    !isVendor
                      ? "bg-white text-[#0400FF] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsVendor(true);
                    setEmailError("");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isVendor
                      ? "bg-white text-[#0400FF] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Vendor</span>
                </button>
              </div>
            </div>

            {/* Form using JUST Email and Password */}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder={isVendor ? "vendor@business.com" : "name@pau.edu.ng"}
                  className={`w-full px-4 py-3.5 bg-[#F8FAFC] rounded-2xl border shadow-[0_4px_16px_rgba(0,0,0,0.05)] text-[#1E293B] placeholder-slate-400 text-sm focus:outline-none transition-all ${
                    emailError
                      ? "border-[#FF2B2B] focus:ring-2 focus:ring-red-100 focus:border-[#FF2B2B]"
                      : "border-slate-100 focus:ring-2 focus:ring-[#0400FF]/20 focus:border-[#0400FF] focus:bg-white"
                  }`}
                />
                {emailError && (
                  <p className="text-[11px] font-semibold text-[#FF2B2B] mt-1.5 text-left">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5 text-left"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    minLength={6}
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
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    "Sign up"
                  )}
                </button>
              </div>
            </form>

            <p className="text-xs sm:text-sm text-slate-500 text-center mt-7">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-[#0400FF] hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}