"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflineGate({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

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

  const retry = async () => {
    if (typeof window === "undefined") return;
    setReconnecting(true);
    setRetryError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
      const resp = await fetch("/favicon.ico", { method: "HEAD", cache: "no-store", signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok && navigator.onLine) {
        setOnline(true);
      } else {
        setOnline(false);
        setRetryError("No se pudo reconectar");
      }
    } catch {
      clearTimeout(timeout);
      setOnline(false);
      setRetryError("No se pudo reconectar");
    } finally {
      setReconnecting(false);
    }
  };

  if (!online) {
    return (
      <div className="relative flex items-center justify-center h-screen bg-black text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-80 sm:h-80 opacity-30 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="180,0 200,0 200,20" fill="#1f2937" />
            <polygon points="160,0 200,40 140,0" fill="#374151" />
            <polygon points="200,80 120,0 200,0" fill="#111827" />
            <polygon points="200,120 160,60 200,60" fill="#6b7280" />
            <polygon points="200,160 140,120 200,120" fill="#f59e0b" opacity="0.35" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 opacity-30 pointer-events-none rotate-180">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <polygon points="180,0 200,0 200,20" fill="#1f2937" />
            <polygon points="160,0 200,40 140,0" fill="#374151" />
            <polygon points="200,80 120,0 200,0" fill="#111827" />
            <polygon points="200,120 160,60 200,60" fill="#6b7280" />
            <polygon points="200,160 140,120 200,120" fill="#f59e0b" opacity="0.35" />
          </svg>
        </div>

        <div className="relative w-full max-w-2xl text-center px-6">
          <div className="inline-flex items-center gap-2 mb-3 text-gray-400">
            <WifiOff className="w-5 h-5" />
            <span className="text-xs">Sin conexión</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-widest mb-2">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-amber-400 to-amber-300">OFFLINE</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 mb-6">Revisa tu red o intenta reconectar</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={retry} disabled={reconnecting} className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-600/40 hover:bg-amber-500/30 text-xs inline-flex items-center gap-2 disabled:opacity-60">
              <RefreshCw className={`w-4 h-4 ${reconnecting ? "animate-spin" : ""}`} />
              {reconnecting ? "Reconectando…" : "Reintentar"}
            </button>
            <div className="text-xs text-gray-500 inline-flex items-center gap-2">
              <span className="animate-pulse">●</span>
              {reconnecting ? "Intentando reconectar…" : retryError ? retryError : "Sin conexión"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
