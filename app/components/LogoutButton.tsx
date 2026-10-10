"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/app/utils/supabase/Client";

interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function LogoutButton({
  className = "",
  showText = true,
  variant = "ghost",
}: LogoutButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  // Base styling variants matching pickNdrop theme
  const variantStyles = {
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200",
    primary: "bg-[#377EE9] text-white hover:bg-[#2f6fd4]",
    danger: "bg-red-50 text-[#FF2B2B] hover:bg-red-100 border border-red-200",
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      title="Log out"
      type="button"
    >
      <LogOut className="w-4 h-4 flex-shrink-0" />
      {showText && <span>{loading ? "Logging out..." : "Log out"}</span>}
    </button>
  );
}