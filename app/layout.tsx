import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWASplash from "@/components/PWASplash";
import PWARegistration from "@/components/PWARegistration";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0400FF",
};

export const metadata: Metadata = {
  title: "pickNdrop — Campus Dining at PAU",
  description: "Skip the wait, savor the flavor. Eat-In, Self-Pickup, or Peer-Delivery at Pan-Atlantic University.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "pickNdrop",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white antialiased">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#1E293B]">
        <PWARegistration />
        <PWASplash />
        {children}
      </body>
    </html>
  );
}
