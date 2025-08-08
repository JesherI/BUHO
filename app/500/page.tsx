"use client";
import React from 'react';

import Link from 'next/link';
import { Home, ArrowLeft, RefreshCw, Bug, Server, Zap, Clock } from 'lucide-react';

const InternalServerErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#111] text-white flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500/30 rounded-full" style={{animation: 'particleFloat 8s ease-in-out infinite'}}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-red-600/40 rounded-full" style={{animation: 'particleFloat 6s ease-in-out infinite 1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-red-400/20 rounded-full" style={{animation: 'particleFloat 10s ease-in-out infinite 2s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-slate-300/20 rounded-full" style={{animation: 'particleFloat 7s ease-in-out infinite 0.5s'}}></div>
        <div className="absolute top-10 left-10 w-1 h-1 bg-red-500/40 rounded-full" style={{animation: 'particleFloat 9s ease-in-out infinite 3s'}}></div>
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-red-600/30 rounded-full" style={{animation: 'particleFloat 11s ease-in-out infinite 1.5s'}}></div>
        <div className="absolute bottom-32 left-16 w-1 h-1 bg-red-400/50 rounded-full" style={{animation: 'particleFloat 12s ease-in-out infinite 4s'}}></div>
        <div className="absolute bottom-16 right-32 w-2 h-2 bg-red-500/25 rounded-full" style={{animation: 'particleFloat 8.5s ease-in-out infinite 2.5s'}}></div>
        <div className="absolute top-1/2 left-8 w-3 h-3 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full" style={{animation: 'particleFloat 15s ease-in-out infinite'}}></div>
        <div className="absolute top-1/3 right-8 w-2 h-2 bg-gradient-to-r from-red-600/30 to-red-500/30 rounded-full" style={{animation: 'particleFloat 13s ease-in-out infinite 3.5s'}}></div>
        <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-red-500/10 rounded-full" style={{animation: 'particleFloat 16s ease-in-out infinite 5s'}}></div>
        <div className="absolute bottom-1/3 right-1/6 w-2 h-2 bg-red-600/15 rounded-full" style={{animation: 'particleFloat 14s ease-in-out infinite 2.8s'}}></div>
        <div className="absolute top-1/5 left-1/2 w-1 h-1 bg-red-500/40 rounded-full" style={{animation: 'particleFloat 18s ease-in-out infinite 6s'}}></div>
        <div className="absolute bottom-1/5 right-1/2 w-1.5 h-1.5 bg-red-600/30 rounded-full" style={{animation: 'particleFloat 20s ease-in-out infinite 2.2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-red-500/10 rounded-full" style={{animation: 'particleFloat 25s ease-in-out infinite 8s'}}></div>
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


        {/* Error Icon with animation */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center">
              <Bug className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Error Code with glitch effect */}
        <div className="mb-6">
          <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 animate-pulse">
            500
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Error Interno del Servidor
          </h2>
          <p className="text-xl text-slate-400 mb-6 leading-relaxed">
            ¡Ups! Búho no puede encontrar una solución en nuestros servidores. Nuestro equipo técnico ha sido notificado automáticamente.
          </p>
          
          {/* Status information */}
          <div className="bg-slate-900/30 rounded-xl p-6 border border-slate-700/30 backdrop-blur-sm mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-red-400" />
              Estado del Sistema
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-slate-300 font-medium">Servidor Principal</p>
                  <p className="text-red-400">Con problemas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-slate-300 font-medium">Base de Datos</p>
                  <p className="text-yellow-400">Verificando</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-slate-800/30 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-slate-300 font-medium">CDN</p>
                  <p className="text-green-400">Operativo</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-red-300">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Incidente reportado:</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Nuestro equipo está trabajando para resolver este problema. Tiempo estimado de resolución: 15-30 minutos.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href=""
            onClick={(e) => { e.preventDefault(); window.location.reload(); }}
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/25 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Reintentar
          </Link>
          
          <Link
            href="/"
            className="group flex items-center gap-3 px-8 py-4 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Ir al Inicio
          </Link>
          
          <Link
            href=""
            onClick={(e) => { e.preventDefault(); window.history.back(); }}
            className="group flex items-center gap-3 px-8 py-4 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Página Anterior
          </Link>
        </div>

        {/* Status updates */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-4">
            <Clock className="w-4 h-4" />
            <span>Última actualización: hace 2 minutos</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="https://status.buho.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 transition-colors duration-300"
            >
              Estado del Sistema
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="mailto:support@buho.ai"
              className="text-amber-400 hover:text-amber-300 transition-colors duration-300"
            >
              Reportar Problema
            </Link>
            <span className="text-slate-600">•</span>
            <Link
              href="/help"
              className="text-amber-400 hover:text-amber-300 transition-colors duration-300"
            >
              Centro de Ayuda
            </Link>
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

export default InternalServerErrorPage;