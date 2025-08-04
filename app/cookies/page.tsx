"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Settings, Save, Check, Mail, Calendar, Users, Lock, User } from 'lucide-react';

// Simulamos cookieUtils para el ejemplo
const cookieUtils = {
  acceptCookies: () => console.log('Cookies accepted'),
  get: (key: string) => key === 'essential_cookies' ? true : false,
  areCookiesAccepted: () => true
};

const CookiesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    preferences: false
  });

  const [navigationContext, setNavigationContext] = useState<'home' | 'profile' | 'direct'>('direct');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    
    if (from === 'profile') {
      setNavigationContext('profile');
    } else if (from === 'home') {
      setNavigationContext('home');
    }
  }, []);

  const handlePreferenceChange = (type: keyof typeof preferences) => {
    if (type === 'essential') return;

    const newValue = !preferences[type];
    
    const newPreferences = {
      ...preferences,
      [type]: newValue,
    };
    
    setPreferences(newPreferences);
  };

  const handleSavePreferences = () => {
    cookieUtils.acceptCookies();
    setSaveMessage('Preferencias guardadas correctamente');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      preferences: true
    };
    
    setPreferences(allAccepted);
    setSaveMessage('Todas las cookies han sido aceptadas');
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleNavigation = (destination: string) => {
    if (destination === 'back') {
      if (navigationContext === 'profile') {
        window.location.href = '/chat?tab=profile';
      } else if (navigationContext === 'home') {
        window.location.href = '/';
      } else {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      }
    }
  };

  const getBackButtonText = () => {
    switch (navigationContext) {
      case 'profile':
        return 'Volver al Chat';
      case 'home':
        return 'Volver al Inicio';
      default:
        return 'Volver';
    }
  };

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Cookies Esenciales',
      icon: Shield,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      description: 'Necesarias para el funcionamiento del sitio',
      details: 'Incluyen cookies de autenticación para mantener tu sesión segura, recordar que estás logueado y permitir la navegación segura por BUHO IA.',
      alwaysActive: true
    },
    {
      id: 'preferences',
      title: 'Preferencias del Chat',
      icon: Settings,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      description: 'Configuraciones personales del chat',
      details: 'Almacenan configuraciones básicas como idioma, tema visual y otras preferencias que mejoran tu experiencia en el chat.',
      alwaysActive: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-slate-400/10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-slate-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-slate-400/15 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-slate-300/20 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-b from-slate-950/95 via-slate-900/80 to-transparent">        
        <div className="relative px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-10">
            <button
              onClick={() => handleNavigation('back')}
              className="group flex items-center space-x-3 text-slate-400 hover:text-slate-200 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-slate-800/30"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">{getBackButtonText()}</span>
            </button>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Política de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300">
                Cookies
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tu privacidad es nuestra prioridad. Descubre exactamente qué información recopilamos y cómo la protegemos en BUHO IA
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Actualizado: 26 de Junio, 2025</span>
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Versión 2.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600/90 text-white px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm border border-emerald-500/30 flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="font-medium">{saveMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Qué cookies utilizamos?</h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            En BUHO IA creemos en la transparencia total. Solo utilizamos las cookies estrictamente necesarias para 
            mantener tu sesión segura y recordar tus preferencias básicas del chat.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-6 bg-slate-900/20 rounded-2xl border border-slate-800/30 backdrop-blur-sm hover:bg-slate-900/30 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-emerald-400 text-base block">Autenticación</span>
                <span className="text-slate-400 text-sm">Mantiene tu sesión segura</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-slate-900/20 rounded-2xl border border-slate-800/30 backdrop-blur-sm hover:bg-slate-900/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-blue-400 text-base block">Preferencias</span>
                <span className="text-slate-400 text-sm">Idioma y configuraciones</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 mb-16">
          {cookieTypes.map((cookie) => (
            <div key={cookie.id} className="group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${cookie.bgColor} ${cookie.borderColor} border backdrop-blur-sm group-hover:scale-105 transition-transform duration-300`}>
                    <cookie.icon className={`w-8 h-8 ${cookie.color}`} />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${cookie.color} mb-2`}>
                      {cookie.title}
                    </h3>
                    <p className="text-slate-400 text-lg">
                      {cookie.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {cookie.alwaysActive ? (
                    <div className="flex items-center gap-4 px-6 py-3 bg-slate-900/30 rounded-xl border border-slate-800/30 backdrop-blur-sm">
                      <div className="w-6 h-6 bg-emerald-600/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-slate-300 font-medium">Siempre activo</span>
                    </div>
                  ) : (
                    <label className="flex items-center cursor-pointer gap-4 px-6 py-3 bg-slate-900/30 rounded-xl border border-slate-800/30 backdrop-blur-sm hover:bg-slate-900/40 transition-all duration-300 group">
                      <input
                        type="checkbox"
                        checked={preferences[cookie.id as keyof typeof preferences]}
                        onChange={() => handlePreferenceChange(cookie.id as keyof typeof preferences)}
                        className="w-6 h-6 text-blue-500 bg-slate-800 border-slate-600 rounded-lg focus:ring-blue-400 focus:ring-2"
                      />
                      <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                        {preferences[cookie.id as keyof typeof preferences] ? 'Activado' : 'Desactivado'}
                      </span>
                    </label>
                  )}
                </div>
              </div>
              
              <div className="ml-22 bg-slate-900/20 rounded-2xl border border-slate-800/20 backdrop-blur-sm p-6">
                <p className="text-slate-300 text-base leading-relaxed">
                  {cookie.details}
                </p>
              </div>
              
              {cookieTypes.indexOf(cookie) !== cookieTypes.length - 1 && (
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent mt-8"></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={handleSavePreferences}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-700/80 hover:bg-slate-600 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50"
          >
            <Save className="w-5 h-5" />
            Guardar Preferencias
          </button>
          
          <button
            onClick={handleAcceptAll}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl transition-all duration-300 font-medium backdrop-blur-sm"
          >
            <Check className="w-5 h-5" />
            Aceptar Todo
          </button>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Sí usamos cookies… pero poquitas</h3>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
            Creemos que menos es más. Solo recopilamos lo esencial para brindarte una experiencia segura 
            y personalizada sin comprometer tu privacidad. Tu confianza es lo más importante para nosotros.
          </p>
          
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/20 rounded-2xl border border-slate-800/30 backdrop-blur-sm">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-slate-300 font-medium">Tus datos están seguros y nunca los compartimos con terceros</span>
          </div>
        </div>
      </div>

      <footer className="bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent border-t border-slate-800/30 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center border border-slate-600/30 backdrop-blur-sm">
                <Mail className="w-6 h-6 text-slate-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">¿Dudas sobre nuestras cookies?</p>
                <a href="mailto:privacy@uttlosmejoresb.com" className="text-slate-400 hover:text-slate-200 transition-colors text-sm">
                  privacy@uttlosmejoresb.com
                </a>
              </div>
            </div>
             
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Transparencia total: solo las cookies esenciales para que BUHO IA funcione perfecto
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CookiesPage;