"use client";

import React, { useState } from "react";
import Link from "next/link";
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
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mb-7">
          Log in to access your account.
        </p>

        {generalError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#FF2B2B]">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-600 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@pau.edu.ng or vendor@business.com"
              className="w-full px-4 py-3 bg-[#F8FAFC] rounded-xl border border-slate-200 text-[#1E293B] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#377EE9]/20 focus:border-[#377EE9] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-600"
              >
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-[#377EE9] hover:underline"
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
                className="w-full px-4 py-3 pr-11 bg-[#F8FAFC] rounded-xl border border-slate-200 text-[#1E293B] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#377EE9]/20 focus:border-[#377EE9] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] active:bg-[#2860b8] transition-colors mt-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-[#377EE9]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}