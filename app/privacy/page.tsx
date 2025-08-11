"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Eye, Database, Lock, Trash2, Globe, Calendar, Users, Plus, Minus, ArrowLeft, Mail, Home } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
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
      id: 'recopilacion',
      title: 'Información que Recopilamos',
      icon: Database,
      color: 'gold',
      summary: 'Qué datos personales recolectamos y cómo los obtenemos.',
      content: [
        'Recopilamos información que nos proporcionas directamente cuando creas una cuenta, utilizas nuestros servicios de IA BUHO, o te comunicas con nosotros.',
        'Información de cuenta: Nombre, dirección de correo electrónico, preferencias de configuración y datos de autenticación vía Google o Facebook.',
        'Contenido de conversaciones: Mensajes, consultas y respuestas generadas por nuestra IA para mejorar el servicio y entrenar nuestros modelos.',
        'Información técnica: Dirección IP, tipo de dispositivo, navegador, datos de uso de la plataforma y métricas de rendimiento.',
        'Datos de Firebase: Utilizamos Firebase Auth para autenticación, Firestore para almacenamiento de datos y Firebase Analytics para métricas de uso.',
        'Información de proveedores externos: Datos obtenidos cuando te autentificas con Google o Facebook, limitados a información básica de perfil.'
      ]
    },
    {
      id: 'uso',
      title: 'Cómo Utilizamos tu Información',
      icon: Eye,
      color: 'gold',
      summary: 'Los propósitos para los cuales procesamos tus datos personales.',
      content: [
        'Proporcionamos y mejoramos nuestros servicios de inteligencia artificial BUHO basándose en tus interacciones y feedback.',
        'Personalizamos tu experiencia y optimizamos las respuestas de la IA según tus preferencias y historial de uso.',
        'Comunicamos contigo sobre actualizaciones del servicio, nuevas funciones y soporte técnico vía correo electrónico.',
        'Analizamos patrones de uso mediante Firebase Analytics para detectar y prevenir actividades fraudulentas o abusivas.',
        'Cumplimos con obligaciones legales y protegemos los derechos y seguridad de nuestros usuarios y la plataforma.',
        'Mantenemos la seguridad de la aplicación mediante reglas de seguridad de Firebase y validación de datos.'
      ]
    },
    {
      id: 'compartir',
      title: 'Compartir Información',
      icon: Globe,
      color: 'gold',
      summary: 'Cuándo y con quién compartimos tu información personal.',
      content: [
        'No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales.',
        'Compartimos información con proveedores de servicios como Firebase (Google) que nos ayudan a operar la plataforma bajo estrictos acuerdos de confidencialidad.',
        'Los datos pueden procesarse por servicios de Google (Firebase Auth, Firestore, Analytics) según sus políticas de privacidad.',
        'Divulgaremos información si es requerido por ley o para proteger nuestros derechos legales y los de nuestros usuarios.',
        'En caso de fusión o adquisición, la información puede transferirse como parte de los activos empresariales.',
        'Los datos agregados y anónimos pueden utilizarse para investigación y mejora de servicios de IA sin identificar usuarios individuales.'
      ]
    },
    {
      id: 'seguridad',
      title: 'Seguridad de Datos',
      icon: Lock,
      color: 'gold',
      summary: 'Cómo protegemos tu información personal.',
      content: [
        'Implementamos medidas de seguridad técnicas y organizativas robustas para proteger tu información personal.',
        'Utilizamos cifrado SSL/TLS para todas las transmisiones de datos entre tu dispositivo y nuestros servidores Firebase.',
        'El acceso a datos personales está restringido mediante reglas de seguridad de Firebase y solo al personal autorizado.',
        'Implementamos autenticación multifactor y sistemas de validación para proteger las cuentas de usuario.',
        'Realizamos auditorías de seguridad regulares y actualizamos nuestras protecciones continuamente.',
        'En caso de violación de datos, notificaremos a los usuarios afectados según lo exige la ley y las mejores prácticas de seguridad.'
      ]
    },
    {
      id: 'derechos',
      title: 'Tus Derechos',
      icon: Shield,
      color: 'gold',
      summary: 'Derechos que tienes sobre tu información personal.',
      content: [
        'Tienes derecho a acceder, corregir o eliminar tu información personal almacenada en nuestros sistemas en cualquier momento.',
        'Puedes solicitar una copia de todos los datos que tenemos sobre ti en formato portable y legible.',
        'Puedes oponerte al procesamiento de tus datos para ciertos fines, como análisis de uso o marketing directo.',
        'Tienes derecho a la portabilidad de datos para transferir tu información a otro servicio compatible.',
        'Puedes retirar tu consentimiento en cualquier momento donde el procesamiento se base en consentimiento.',
        'Puedes eliminar tu cuenta y todos los datos asociados a través de la configuración de tu perfil o contactándonos directamente.'
      ]
    },
    {
      id: 'retencion',
      title: 'Retención de Datos',
      icon: Trash2,
      color: 'gold',
      summary: 'Por cuánto tiempo conservamos tu información.',
      content: [
        'Conservamos tu información personal solo durante el tiempo necesario para los fines descritos en esta política.',
        'Los datos de conversaciones se conservan para mejorar nuestros modelos de IA, pero pueden anonimizarse tras 12 meses.',
        'Los datos de autenticación se mantienen activos mientras tu cuenta esté vigente y se eliminan tras la desactivación.',
        'Puedes solicitar la eliminación inmediata de tu cuenta y todos los datos asociados en cualquier momento.',
        'Algunos datos pueden conservarse por períodos más largos cuando sea requerido por ley o para resolver disputas.',
        'Los datos de respaldo se eliminan según nuestro cronograma regular de eliminación segura cada 90 días.'
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
    } else if (destination === 'terms') {
      const params = new URLSearchParams();
      params.set('from', navigationContext === 'profile' ? 'profile' : 'home');
      window.location.href = `/terms?${params.toString()}`;
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
              onClick={() => handleNavigation('terms')}
              className="text-slate-400 hover:text-amber-400 transition-all duration-300 font-medium"
            >
              Términos de Uso
            </button>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Política de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 animate-pulse">
                Privacidad
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Descubre cómo protegemos y gestionamos tu información personal con total transparencia y compromiso
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
                    <div className="mt-6 space-y-4 border-t border-slate-700/50 pt-6 animate-in fade-in duration-[1000ms] ease-in-out">
                      {section.content.map((paragraph: string, pIndex: number) => (
                        <div 
                          key={pIndex} 
                          className="flex items-start space-x-3 p-4 bg-slate-900/60 rounded-lg border border-slate-800/30 backdrop-blur-sm transform transition-all duration-700 ease-in-out animate-in fade-in"
                          style={{ animationDelay: `${pIndex * 200}ms` }}
                        >
                          <div className="w-2 h-2 rounded-full mt-2 bg-amber-500/40 transition-all duration-500 ease-in-out hover:bg-amber-400/60"></div>
                          <p className="text-slate-300 leading-relaxed text-sm transition-colors duration-500 ease-in-out hover:text-slate-200">
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
                <p className="text-white font-semibold">¿Preguntas sobre privacidad?</p>
                <a href="mailto:privacy@uttlosmejoresb.com" className="text-amber-400 hover:text-amber-300 transition-colors text-sm">
                  privacy@uttlosmejoresb.com
                </a>
              </div>
            </div>
            
            <div className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Esta política de privacidad está diseñada para ser clara y transparente sobre cómo BUHO IA maneja tu información. 
              Si tienes alguna duda sobre Firebase, autenticación social o nuestros servicios, no dudes en contactarnos.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;