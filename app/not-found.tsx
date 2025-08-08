"use client";
import React from 'react';

import Link from 'next/link';
import { Home, ArrowLeft, Search, RefreshCw } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#111] text-white flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full" style={{animation: 'particleFloat 8s ease-in-out infinite'}}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-yellow-500/40 rounded-full" style={{animation: 'particleFloat 6s ease-in-out infinite 1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-amber-300/20 rounded-full" style={{animation: 'particleFloat 10s ease-in-out infinite 2s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-slate-300/20 rounded-full" style={{animation: 'particleFloat 7s ease-in-out infinite 0.5s'}}></div>
        <div className="absolute top-10 left-10 w-1 h-1 bg-amber-500/40 rounded-full" style={{animation: 'particleFloat 9s ease-in-out infinite 3s'}}></div>
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-yellow-400/30 rounded-full" style={{animation: 'particleFloat 11s ease-in-out infinite 1.5s'}}></div>
        <div className="absolute bottom-32 left-16 w-1 h-1 bg-amber-300/50 rounded-full" style={{animation: 'particleFloat 12s ease-in-out infinite 4s'}}></div>
        <div className="absolute bottom-16 right-32 w-2 h-2 bg-yellow-500/25 rounded-full" style={{animation: 'particleFloat 8.5s ease-in-out infinite 2.5s'}}></div>
        <div className="absolute top-1/2 left-8 w-3 h-3 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 rounded-full" style={{animation: 'particleFloat 15s ease-in-out infinite'}}></div>
        <div className="absolute top-1/3 right-8 w-2 h-2 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 rounded-full" style={{animation: 'particleFloat 13s ease-in-out infinite 3.5s'}}></div>
        <div className="absolute top-16 left-1/3 w-1 h-1 bg-amber-600/35 rounded-full" style={{animation: 'particleFloat 14s ease-in-out infinite 5s'}}></div>
        <div className="absolute bottom-20 right-1/4 w-1.5 h-1.5 bg-yellow-300/40 rounded-full" style={{animation: 'particleFloat 16s ease-in-out infinite 1.8s'}}></div>
        <div className="absolute top-1/5 left-1/2 w-1 h-1 bg-amber-400/40 rounded-full" style={{animation: 'particleFloat 18s ease-in-out infinite 6s'}}></div>
        <div className="absolute bottom-1/5 right-1/2 w-1.5 h-1.5 bg-yellow-500/30 rounded-full" style={{animation: 'particleFloat 20s ease-in-out infinite 2.2s'}}></div>
        <div className="absolute top-2/5 left-1/5 w-1 h-1 bg-amber-500/35 rounded-full" style={{animation: 'particleFloat 22s ease-in-out infinite 7s'}}></div>
        <div className="absolute bottom-2/5 right-1/5 w-1.5 h-1.5 bg-yellow-400/25 rounded-full" style={{animation: 'particleFloat 24s ease-in-out infinite 3.8s'}}></div>
      </div>
      
      <style jsx>{`
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-15px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
      `}</style>

      <div className="relative z-10 text-center max-w-2xl mx-auto">


        {/* Error Code */}
        <div className="mb-6">
          <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¡Oops! Página no encontrada
          </h2>
          <p className="text-xl text-slate-400 mb-6 leading-relaxed">
            Parece que búho se perdió en la oscuridad. La página que buscas no existe o ha sido movida.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/"
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-amber-500/25 hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Volver al Inicio
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 px-8 py-4 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Página Anterior
          </button>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-slate-500 mb-4">¿Necesitas ayuda? Prueba estas opciones:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/help"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors duration-300"
            >
              <Search className="w-4 h-4" />
              Centro de Ayuda
            </Link>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar Página
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-slate-600 text-sm">
          © 2025 Buho AI. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default NotFound;