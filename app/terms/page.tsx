"use client";

import React, { useState, useEffect } from 'react';
import { Scale, Cpu, Shield, AlertTriangle, Calendar, Users, ChevronDown, ArrowLeft, FileText, HelpCircle, Home } from 'lucide-react';

const TermsOfUsePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [navigationContext, setNavigationContext] = useState<'home' | 'profile' | 'direct'>('direct');

  // Detectar de dónde viene el usuario
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    
    if (from === 'profile') {
      setNavigationContext('profile');
    } else if (from === 'home') {
      setNavigationContext('home');
    } else {
      // Intentar detectar por referrer o historial
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
      id: 'aceptacion',
      title: 'Aceptación de Términos',
      icon: Scale,
      summary: 'Al usar BUHO IA, aceptas estos términos y condiciones.',
      content: [
        'Al acceder y utilizar BUHO IA, usted acepta estar sujeto a estos Términos de Uso y todas las leyes y regulaciones aplicables.',
        'Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio y servicio.',
        'El uso continuado del servicio constituye la aceptación de cualquier modificación a estos términos.'
      ]
    },
    {
      id: 'descripcion',
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
        // Volver al perfil/chat
        window.location.href = '/chat?tab=profile';
      } else if (navigationContext === 'home') {
        // Volver al home
        window.location.href = '/';
      } else {
        // Fallback: intentar history.back, sino ir al home
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '/';
        }
      }
    } else if (destination === 'privacy') {
      // Ir a política de privacidad manteniendo el contexto
      const params = new URLSearchParams();
      params.set('from', navigationContext === 'profile' ? 'profile' : 'home');
      window.location.href = `/privacy?${params.toString()}`;
    } else if (destination === 'home') {
      window.location.href = '/';
    }
  };

  // Función para obtener el texto del botón de navegación
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900">
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2Y5NzMxNiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-40"></div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('back')}
                className="group flex items-center space-x-2 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">{getBackButtonText()}</span>
              </button>
              
              {navigationContext !== 'home' && (
                <>
                  <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                  <button
                    onClick={() => handleNavigation('home')}
                    className="group flex items-center space-x-2 text-slate-500 hover:text-slate-300 transition-colors duration-200"
                  >
                    <Home className="w-4 h-4" />
                    <span className="text-sm font-medium">Inicio</span>
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => handleNavigation('privacy')}
              className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 font-medium"
            >
              Política de Privacidad
            </button>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Términos de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Uso
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Condiciones claras y justas que rigen el uso de nuestros servicios de inteligencia artificial
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Actualizado: 26 de Junio, 2025</span>
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Versión 2.1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="group"
            >
              <div
                onClick={() => toggleSection(section.id)}
                className="cursor-pointer mb-6"
              >
                <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-xl flex items-center justify-center border border-amber-400/30">
                      <section.icon className="w-6 h-6 text-amber-300" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-200">
                      {section.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {section.summary}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-all duration-300 ${
                        activeSection === section.id ? 'rotate-180 text-amber-400' : 'group-hover:text-amber-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {activeSection === section.id && (
                <div className="mb-8 ml-4 pl-12 border-l-2 border-amber-400/30">
                  <div className="space-y-4">
                    {section.content.map((paragraph, pIndex) => (
                      <div key={pIndex} className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
                        <p className="text-slate-300 leading-relaxed">
                          {paragraph}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        
            
        
      </div>
    </div>
  );
};

export default TermsOfUsePage;