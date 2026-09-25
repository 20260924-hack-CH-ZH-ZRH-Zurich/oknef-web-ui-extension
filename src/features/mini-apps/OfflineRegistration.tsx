"use client";

import { useEffect } from "react";

export function OfflineRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {
        console.warn(
          "Offline preview could not be enabled. The extension package remains available offline.",
        );
      });
    }
  }, []);
  return null;
}
