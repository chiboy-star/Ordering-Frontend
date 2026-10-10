"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function ConfirmedPage() {
  return (
    <div className="min-h-screen bg-white text-[#1E293B] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md animate-page-enter text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
          Email Verified!
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Your email address has been successfully authenticated. You can now log in to start ordering or managing your cafeteria store.
        </p>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] transition-colors"
        >
          <span>Proceed to Login</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}