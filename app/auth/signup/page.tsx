"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { createClient } from "@/app/utils/supabase/Client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

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
        full_name: fullName,
      });

      if (profileError) {
        setGeneralError(`Profile creation failed: ${profileError.message}`);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    // Redirect to confirmation page
    router.push("/auth/verify-email");
  };

  return (
    <div className="min-h-screen bg-white text-[#1E293B] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md animate-page-enter">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>

        {/* Brand */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#377EE9] flex items-center justify-center text-white font-bold text-sm">
            p
          </div>
          <span className="text-lg font-bold tracking-tight text-[#1E293B]">
            pickNdrop
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[#1E293B] mb-1">
          Create your account
        </h1>
        <p className="text-sm text-slate-500 mb-7">
          Join PAU&apos;s campus food network.
        </p>

        {generalError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#FF2B2B]">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-medium text-slate-600 mb-1.5">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="David Okon"
              className="w-full px-4 py-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-[#1E293B] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#377EE9]/20 focus:border-[#377EE9] transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-slate-600 mb-1.5">
              {isVendor ? "Vendor Email" : "PAU Email"}
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
              className={`w-full px-4 py-3 bg-[#F8FAFC] rounded-xl border text-[#1E293B] placeholder-slate-400 text-sm focus:outline-none transition-all ${
                emailError
                  ? "border-[#FF2B2B] focus:ring-2 focus:ring-red-100 focus:border-[#FF2B2B]"
                  : "border-slate-200 focus:ring-2 focus:ring-[#377EE9]/20 focus:border-[#377EE9]"
              }`}
            />
            {emailError && (
              <p className="text-[13px] text-[#FF2B2B] mt-1.5">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                className="w-full px-4 py-3 pr-11 bg-[#F8FAFC] rounded-xl border border-slate-200 text-[#1E293B] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#377EE9]/20 focus:border-[#377EE9] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Vendor Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/60">
            <div className="pr-4">
              <span className="text-sm font-medium text-[#1E293B] block">
                Cafeteria vendor account
              </span>
              <span className="text-xs text-slate-400">
                Only for campus food stall operators.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isVendor}
              onClick={() => setIsVendor(!isVendor)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                isVendor ? "bg-[#377EE9]" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 mt-1 ml-1 ${
                  isVendor ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] active:bg-[#2860b8] transition-colors mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-[#377EE9]">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}