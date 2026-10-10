"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="w-full max-w-md animate-page-enter text-center">
      {/* Back Link */}
      <div className="text-left mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>

      {/* Mail Icon */}
      <div className="w-16 h-16 bg-[#377EE9]/10 text-[#377EE9] rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold text-[#1E293B] mb-2">
        Check your email
      </h1>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        We sent a verification link to{" "}
        <span className="font-semibold text-[#1E293B]">{email || "your inbox"}</span>.
        Please click the link in the email to authenticate your account.
      </p>

      <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/60 mb-8 text-xs text-slate-400">
        Didn&apos;t receive an email? Check your spam folder or try signing up again.
      </div>

      <Link
        href="/auth/login"
        className="inline-block w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#377EE9] hover:bg-[#2f6fd4] transition-colors"
      >
        Back to Login
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-white text-[#1E293B] flex items-center justify-center px-5 py-10">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}