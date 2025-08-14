"use client";

import React, { useState, useEffect } from 'react';
import { Scale, Cpu, Shield, AlertTriangle, Calendar, Users, ArrowLeft, Home, Plus, Minus, Mail } from 'lucide-react';

const TermsOfUsePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [navigationContext, setNavigationContext] = useState<'home' | 'profile' | 'direct'>('direct');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    
    if (from === 'profile') {
      setNavigationContext('profile');
    } else if (from === 'home') {
      setNavigationContext('home');
    } else {
      const referrer = document.referrer;
      if (referrer.includes('/chat') || referrer.includes('/profile')) {
        setNavigationContext('profile');
      } else if (referrer.includes('/home') || referrer === '') {
        setNavigationContext('home');
      }
    }
  }, []);

  const sections = [
    {
      id: 'aceptación',
      title: 'Aceptación de Términos',
      icon: Scale,
      summary: 'Al usar BUHO IA, aceptas estos términos y condiciones.',
      content: [
        'Al acceder y utilizar BUHO IA, usted acepta estar sujeto a estos Términos de Uso y todas las leyes y regulaciones aplicables, incluyendo el uso de nuestro sistema de autenticación basado en Firebase.',
        'Nuestro sistema de autenticación maneja el registro de usuarios, inicio de sesión y gestión de sesiones a través de Firebase Auth, incluyendo proveedores de autenticación social como Google y Facebook.',
        'El sistema utiliza el proyecto Firebase `buho-8aba3` para la gestión de usuarios, almacenamiento de datos en Firestore y análisis de interacciones del usuario.',
        'Al registrarse o iniciar sesión, acepta el procesamiento de sus datos de autenticación y el uso de cookies para mantener su sesión activa.',
        'Si no está de acuerdo con alguno de estos términos o con el uso de nuestros servicios de autenticación, tiene prohibido usar o acceder a este sitio y servicio.',
        'El uso continuado del servicio constituye la aceptación de cualquier modificación a estos términos y a nuestras políticas de autenticación.'
      ]
    },
    {
      id: 'descripción',
      title: 'Descripción del Servicio',
      icon: Cpu,
      summary: 'Plataforma de IA para asistencia y automatización de tareas.',
      content: [
        'BUHO IA es una plataforma de inteligencia artificial diseñada para proporcionar asistencia y automatización en diversas tareas.',
        'Nuestros servicios incluyen procesamiento de lenguaje natural, análisis de datos y generación de contenido mediante IA.',
        'El servicio se proporciona "tal como está" y puede estar sujeto a limitaciones técnicas y de disponibilidad.'
      ]
    },
    {
      id: 'uso-aceptable',
      title: 'Uso Aceptable',
      icon: Shield,
      summary: 'Reglas sobre el uso apropiado de nuestros servicios.',
      content: [
        'No debe utilizar el servicio para actividades ilegales, dañinas o que violen los derechos de terceros.',
        'Está prohibido intentar acceder, dañar o interferir con los sistemas, servidores o redes de BUHO IA.',
        'No debe utilizar el servicio para generar contenido spam, malicioso o que infrinja derechos de autor.',
        'Se reserva el derecho de suspender o terminar cuentas que violen estas políticas.'
      ]
    },
    {
      id: 'limitaciones',
      title: 'Limitaciones de Responsabilidad',
      icon: AlertTriangle,
      summary: 'Límites de nuestra responsabilidad por el uso del servicio.',
      content: [
        'BUHO IA no será responsable por daños directos, indirectos, incidentales o consecuentes.',
        'La información proporcionada por la IA puede contener errores y no debe considerarse como asesoramiento profesional.',
        'Los usuarios son responsables de verificar la exactitud de la información antes de tomar decisiones basadas en ella.',
        'No garantizamos la disponibilidad continua del servicio ni la ausencia de interrupciones.'
      ]
    },
    {
      id: 'modificaciones',
      title: 'Modificaciones',
      icon: Calendar,
      summary: 'Cómo y cuándo podemos actualizar estos términos.',
      content: [
        'Nos reservamos el derecho de modificar estos términos en cualquier momento.',
        'Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma.',
        'Es responsabilidad del usuario revisar periódicamente estos términos para mantenerse informado de los cambios.',
        'El uso continuado del servicio después de las modificaciones constituye la aceptación de los nuevos términos.'
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
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
    } else if (destination === 'privacy') {
      const params = new URLSearchParams();
      params.set('from', navigationContext === 'profile' ? 'profile' : 'home');
      window.location.href = `/privacy?${params.toString()}`;
    } else if (destination === 'home') {
      window.location.href = '/';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-amber-400/30 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-300/30 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1.5 h-1.5 bg-amber-400/20 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2Y5NzMxNiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-30"></div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('back')}
                className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">{getBackButtonText()}</span>
              </button>
              
              {navigationContext !== 'home' && (
                <>
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                  <button
                    onClick={() => handleNavigation('home')}
                    className="group flex items-center space-x-2 text-slate-500 hover:text-slate-300 transition-all duration-300"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">Inicio</span>
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handleNavigation('privacy')}
              className="text-slate-400 hover:text-amber-400 transition-all duration-300 font-medium"
            >
              Política de Privacidad
            </button>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Términos de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 animate-pulse">
                Uso
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Condiciones claras y justas que rigen el uso de nuestros servicios de inteligencia artificial
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Actualizado: 26 de Junio, 2025</span>
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Versión 2.8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500/50 via-yellow-500/50 to-amber-600/50"></div>
          
          {sections.map((section) => (
            <div key={section.id} className="relative mb-12">
              <div className={`absolute left-6 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                activeSection === section.id 
                  ? 'border-amber-400 bg-amber-500/30 shadow-lg shadow-amber-500/50' 
                  : 'border-amber-500/30 bg-amber-500/10'
              }`}>
                <div className={`absolute inset-1 rounded-full transition-all duration-300 ${
                  activeSection === section.id 
                    ? 'bg-amber-400/60' 
                    : 'bg-amber-500/20'
                }`}></div>
              </div>
              
              <div className="ml-16">
                <div
                  onClick={() => toggleSection(section.id)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg backdrop-blur-sm ${
                    activeSection === section.id 
                      ? 'bg-slate-800/60 border-slate-700/50 shadow-xl' 
                      : 'bg-slate-900/40 border-slate-800/30 hover:bg-slate-800/40 hover:border-slate-700/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                        activeSection === section.id 
                          ? 'border-amber-400/60 bg-amber-500/20' 
                          : 'border-amber-500/30 bg-amber-500/10'
                      }`}>
                        <section.icon className={`w-6 h-6 transition-all duration-300 ${
                          activeSection === section.id 
                            ? 'text-amber-400' 
                            : 'text-amber-500'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold transition-all duration-300 ${
                          activeSection === section.id 
                            ? 'text-amber-400' 
                            : 'text-white'
                        }`}>
                          {section.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                          {section.summary}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      activeSection === section.id 
                        ? 'border-amber-400/60 bg-amber-500/20' 
                        : 'border-slate-600 bg-slate-800/50'
                    }`}>
                      {activeSection === section.id ? (
                        <Minus className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Plus className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {activeSection === section.id && (
                    <div className="mt-6 space-y-4 border-t border-slate-700/50 pt-6 animate-in slide-in-from-top-2 duration-300">
                      {section.content.map((paragraph: string, pIndex: number) => (
                        <div key={pIndex} className="flex items-start space-x-3 p-4 bg-slate-900/60 rounded-lg border border-slate-800/30 backdrop-blur-sm">
                          <div className="w-2 h-2 rounded-full mt-2 bg-amber-500/60"></div>
                          <p className="text-slate-300 leading-relaxed text-sm">
                            {paragraph}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-gradient-to-t from-black/60 via-slate-900/30 to-transparent border-t border-slate-800/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 backdrop-blur-sm">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">¿Preguntas sobre términos?</p>
                <a href="mailto:legal@uttlosmejoresb.com" className="text-amber-400 hover:text-amber-300 transition-colors text-sm">
                  legal@uttlosmejoresb.com
                </a>
              </div>
            </div>
            
            <div className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Estos términos de uso están diseñados para ser claros y transparentes sobre cómo BUHO IA opera. 
              Si tienes alguna duda sobre Firebase, autenticación o nuestros servicios, no dudes en contactarnos.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfUsePage;