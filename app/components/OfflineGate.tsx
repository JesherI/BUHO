"use client";

import { useEffect, useState } from "react";

export default function OfflineGate({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!online) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="w-full max-w-md bg-linear-to-br from-gray-900/85 to-gray-800/85 border border-gray-700/50 rounded-2xl shadow-2xl p-6 text-center">
          <div className="text-lg font-medium mb-2">Sin conexión</div>
          <div className="text-gray-400 text-sm mb-4">Revisa tu conexión a internet</div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Intentando reconectar…</span>
            <span className="animate-pulse">●</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
