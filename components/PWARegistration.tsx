"use client";

import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isSecureOrLocal =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if ("serviceWorker" in navigator && isSecureOrLocal) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("PWA Service Worker registered:", registration.scope);
          })
          .catch((error) => {
            console.warn("PWA Service Worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}
