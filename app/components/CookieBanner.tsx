"use client";

import React, { useState, useEffect } from 'react';
import { cookieUtils } from '../utils/cookies';
import { X, Cookie } from 'lucide-react';

interface CookieBannerProps {
  onAccept?: () => void;
  onReject?: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onReject }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar si no se han aceptado las galletas
    const cookiesAccepted = cookieUtils.areCookiesAccepted();
    console.log('🍪 Cookies aceptadas:', cookiesAccepted);
    
    if (!cookiesAccepted) {
      setIsVisible(true);
      console.log('👀 Mostrando banner de cookies');
    }
  }, []);

  const handleAccept = () => {
    console.log('✅ Usuario aceptó las cookies');
    cookieUtils.acceptCookies();
    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = () => {
    console.log('❌ Usuario rechazó las cookies');
    setIsVisible(false);
    onReject?.();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="backdrop-blur-md bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80 rounded-2xl border border-slate-700/40 shadow-2xl text-white">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-700/40 rounded-lg flex items-center justify-center">
                <Cookie className="w-4 h-4 text-slate-300" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-100">Cookies</h3>
                <p className="text-xs text-slate-400">BUHO IA Chat</p>
              </div>
            </div>
            
            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-slate-300 text-xs mb-4 leading-relaxed">
            Utilizamos cookies esenciales para mantener tu sesión y mejorar tu experiencia en el chat.
          </p>

          <div className="flex gap-2">
            <button
              onClick={handleAccept}
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all font-medium text-xs border border-slate-600/50"
            >
              Aceptar
            </button>
            
            <button
              onClick={handleReject}
              className="flex-1 px-4 py-2 bg-transparent border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-700/40 hover:text-white transition-all text-xs"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;