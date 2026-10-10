import type { Metadata } from "next";
import "./globals.css";
import PWASplash from "@/components/PWASplash";

export const metadata: Metadata = {
  title: "pickNdrop — Campus Dining at PAU",
  description: "Eat-In, Self-Pickup, or Peer-Delivery at Pan-Atlantic University.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <body className="min-h-full flex flex-col bg-white text-[#1E293B]">
        <PWASplash />
        {children}
      </body>
    </html>
  );
}
