import React from "react";
import { AppProvider } from "@/context/AppContext";
import BottomNavigation from "@/components/BottomNavigation";
import GlobalToast from "@/components/GlobalToast";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-white text-[#1E293B] flex flex-col font-sans selection:bg-[#377EE9] selection:text-white">
        {/* Global Toast fixed strictly at the top of the viewport */}
        <GlobalToast />

        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global Bottom Navigation fixed strictly at the bottom of the viewport */}
        <BottomNavigation />
      </div>
    </AppProvider>
  );
}
