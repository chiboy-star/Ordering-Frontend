"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="w-full max-w-[360px] sm:max-w-[400px] relative z-10 animate-page-enter text-center">
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

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl space-y-4">
        {/* Mail Icon */}
        <div className="w-14 h-14 bg-blue-50 text-[#0400FF] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Mail className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#1E293B]">
            Check your email
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            We sent a verification link to{" "}
            <span className="font-bold text-[#0400FF]">{email || "your inbox"}</span>.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 text-[11px] text-slate-500 text-left space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#1E293B]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Verification email dispatched</span>
          </div>
          <p>Please click the authentication link in your inbox to verify your student or vendor status.</p>
        </div>

        <div className="pt-2">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#0400FF] hover:bg-[#0300d6] shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-white text-[#1E293B] relative overflow-hidden flex flex-col items-center justify-center px-5 py-10 selection:bg-[#0400FF] selection:text-white">
      {/* Ambient Gradient Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[400px] overflow-visible -z-0"
      >
        <div className="w-[320px] sm:w-[420px] h-[280px] sm:h-[320px] mx-auto rounded-full bg-gradient-to-r from-[#F472B6] via-[#C084FC] to-[#93C5FD] opacity-65 blur-3xl transform -translate-y-6" />
      </div>

      <Suspense fallback={<div className="text-xs text-slate-400">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}