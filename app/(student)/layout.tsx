import React from "react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#1E293B] flex flex-col font-sans selection:bg-[#377EE9] selection:text-white">
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
