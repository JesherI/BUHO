"use client";
import React from 'react';

import Link from 'next/link';
import { Home, ArrowLeft, RefreshCw, AlertTriangle, Bug, Shield } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset }) => {
  const getErrorInfo = () => {
    const message = error.message.toLowerCase();
    
    if (message.includes('400') || message.includes('bad request')) {
      return {
        code: '400',
        title: 'Solicitud Incorrecta',
        description: 'La solicitud no pudo ser procesada debido a un error en los datos enviados.',
        icon: AlertTriangle,
        color: 'from-red-400 to-red-600'
      };
    }
    
    if (message.includes('405') || message.includes('method not allowed')) {
      return {
        code: '405',
        title: 'Método No Permitido',
        description: 'El método de solicitud utilizado no está permitido para este recurso.',
        icon: Shield,
        color: 'from-orange-400 to-orange-600'
      };
    }
    
    return {
      code: '500',
      title: 'Error Interno del Servidor',
      description: 'Búho no puede encontrar una solución. Mi equipo ha sido notificado.',
      icon: Bug,
      color: 'from-red-500 to-red-700'
    };
  };

  const errorInfo = getErrorInfo();
  const IconComponent = errorInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-[#111] text-white flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-500/30 rounded-full" style={{animation: 'particleFloat 8s ease-in-out infinite'}}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-amber-600/40 rounded-full" style={{animation: 'particleFloat 6s ease-in-out infinite 1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-amber-400/20 rounded-full" style={{animation: 'particleFloat 10s ease-in-out infinite 2s'}}></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-slate-300/20 rounded-full" style={{animation: 'particleFloat 7s ease-in-out infinite 0.5s'}}></div>
        <div className="absolute top-10 left-10 w-1 h-1 bg-amber-500/40 rounded-full" style={{animation: 'particleFloat 9s ease-in-out infinite 3s'}}></div>
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-amber-600/30 rounded-full" style={{animation: 'particleFloat 11s ease-in-out infinite 1.5s'}}></div>
        <div className="absolute bottom-32 left-16 w-1 h-1 bg-amber-400/50 rounded-full" style={{animation: 'particleFloat 12s ease-in-out infinite 4s'}}></div>
        <div className="absolute bottom-16 right-32 w-2 h-2 bg-amber-500/25 rounded-full" style={{animation: 'particleFloat 8.5s ease-in-out infinite 2.5s'}}></div>
        <div className="absolute top-1/2 left-8 w-3 h-3 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-full" style={{animation: 'particleFloat 15s ease-in-out infinite'}}></div>
        <div className="absolute top-1/3 right-8 w-2 h-2 bg-gradient-to-r from-amber-600/30 to-amber-500/30 rounded-full" style={{animation: 'particleFloat 13s ease-in-out infinite 3.5s'}}></div>
        <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-amber-500/10 rounded-full" style={{animation: 'particleFloat 16s ease-in-out infinite 5s'}}></div>
        <div className="absolute bottom-1/3 right-1/6 w-2 h-2 bg-amber-600/15 rounded-full" style={{animation: 'particleFloat 14s ease-in-out infinite 2.8s'}}></div>
        <div className="absolute top-1/5 left-1/2 w-1 h-1 bg-amber-500/40 rounded-full" style={{animation: 'particleFloat 18s ease-in-out infinite 6s'}}></div>
        <div className="absolute bottom-1/5 right-1/2 w-1.5 h-1.5 bg-amber-600/30 rounded-full" style={{animation: 'particleFloat 20s ease-in-out infinite 2.2s'}}></div>
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


        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${errorInfo.color} rounded-full blur-lg opacity-30 animate-pulse`}></div>
            <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${errorInfo.color} flex items-center justify-center`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="mb-6">
          <h1 className={`text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${errorInfo.color} animate-pulse`}>
            {errorInfo.code}
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {errorInfo.title}
          </h2>
          <p className="text-xl text-slate-400 mb-6 leading-relaxed">
            {errorInfo.description}
          </p>
          
          {/* Error details for development */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-slate-500 hover:text-slate-400 transition-colors">
                Detalles técnicos (desarrollo)
              </summary>
              <pre className="mt-2 p-4 bg-slate-900/50 rounded-lg text-sm text-slate-300 overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={reset}
            className={`group flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${errorInfo.color} hover:opacity-90 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/25 hover:scale-105`}
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            Intentar de Nuevo
          </button>
          
          <Link
            href="/"
            className="group flex items-center gap-3 px-8 py-4 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 hover:scale-105"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Volver al Inicio
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

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-slate-500 mb-4">Si el problema persiste, contáctanos:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/help"
              className="text-amber-400 hover:text-amber-300 transition-colors duration-300"
            >
              Centro de Ayuda
            </Link>
            <span className="text-slate-600">•</span>
            <a
              href="mailto:support@buho.ai"
              className="text-amber-400 hover:text-amber-300 transition-colors duration-300"
            >
              Soporte Técnico
            </a>
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

export default ErrorPage;