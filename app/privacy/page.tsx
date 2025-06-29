"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Eye, Database, Lock, Trash2, Globe, Calendar, Users, ChevronDown, ArrowLeft, Mail, Home } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
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
      id: 'recopilacion',
      title: 'Información que Recopilamos',
      icon: Database,
      summary: 'Qué datos personales recolectamos y cómo los obtenemos.',
      content: [
        'Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, utilizas nuestros servicios de IA, o te comunicas con nosotros.',
        'Información de cuenta: nombre, dirección de correo electrónico, y preferencias de configuración.',
        'Contenido de conversaciones: mensajes, consultas y respuestas generadas por nuestra IA para mejorar el servicio.',
        'Información técnica: dirección IP, tipo de dispositivo, navegador, y datos de uso de la plataforma.'
      ]
    },
    {
      id: 'uso',
      title: 'Cómo Utilizamos tu Información',
      icon: Eye,
      summary: 'Los propósitos para los cuales procesamos tus datos personales.',
      content: [
        'Proporcionamos y mejoramos nuestros servicios de inteligencia artificial basándose en tus interacciones.',
        'Personalizamos tu experiencia y optimizamos las respuestas de la IA según tus preferencias.',
        'Comunicamos contigo sobre actualizaciones del servicio, nuevas funciones y soporte técnico.',
        'Analizamos patrones de uso para detectar y prevenir actividades fraudulentas o abusivas.',
        'Cumplimos con obligaciones legales y protegemos los derechos y seguridad de nuestros usuarios.'
      ]
    },
    {
      id: 'compartir',
      title: 'Compartir Información',
      icon: Globe,
      summary: 'Cuándo y con quién compartimos tu información personal.',
      content: [
        'No vendemos, alquilamos ni compartimos tu información personal con terceros para fines comerciales.',
        'Podemos compartir información con proveedores de servicios que nos ayudan a operar la plataforma.',
        'Divulgaremos información si es requerido por ley o para proteger nuestros derechos legales.',
        'En caso de fusión o adquisición, la información puede transferirse como parte de los activos empresariales.',
        'Los datos agregados y anónimos pueden utilizarse para investigación y mejora de servicios de IA.'
      ]
    },
    {
      id: 'seguridad',
      title: 'Seguridad de Datos',
      icon: Lock,
      summary: 'Cómo protegemos tu información personal.',
      content: [
        'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información.',
        'Utilizamos cifrado SSL/TLS para todas las transmisiones de datos entre tu dispositivo y nuestros servidores.',
        'El acceso a datos personales está restringido solo al personal autorizado que necesita esta información.',
        'Realizamos auditorías de seguridad regulares y actualizamos nuestras protecciones continuamente.',
        'En caso de violación de datos, notificaremos a los usuarios afectados según lo exige la ley.'
      ]
    },
    {
      id: 'derechos',
      title: 'Tus Derechos',
      icon: Shield,
      summary: 'Derechos que tienes sobre tu información personal.',
      content: [
        'Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento.',
        'Puedes solicitar una copia de todos los datos que tenemos sobre ti en formato portable.',
        'Puedes oponerte al procesamiento de tus datos para ciertos fines, como marketing directo.',
        'Tienes derecho a la portabilidad de datos para transferir tu información a otro servicio.',
        'Puedes retirar tu consentimiento en cualquier momento donde el procesamiento se base en consentimiento.'
      ]
    },
    {
      id: 'retencion',
      title: 'Retención de Datos',
      icon: Trash2,
      summary: 'Por cuánto tiempo conservamos tu información.',
      content: [
        'Conservamos tu información personal solo durante el tiempo necesario para los fines descritos.',
        'Los datos de conversaciones se conservan para mejorar nuestros modelos de IA, pero pueden anonimizarse.',
        'Puedes solicitar la eliminación de tu cuenta y datos asociados en cualquier momento.',
        'Algunos datos pueden conservarse por períodos más largos cuando sea requerido por ley.',
        'Los datos de respaldo se eliminan según nuestro cronograma regular de eliminación segura.'
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
    } else if (destination === 'terms') {
      // Ir a términos de uso manteniendo el contexto
      const params = new URLSearchParams();
      params.set('from', navigationContext === 'profile' ? 'profile' : 'home');
      window.location.href = `/terms?${params.toString()}`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-transparent">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzM3MzlmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-40"></div>
        
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
              onClick={() => handleNavigation('terms')}
              className="text-slate-400 hover:text-amber-400 transition-colors duration-200 font-medium"
            >
              Términos de Uso
            </button>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Política de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Privacidad
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Transparencia total sobre cómo protegemos y gestionamos tu información personal
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
                <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 rounded-xl flex items-center justify-center border border-emerald-400/30">
                      <section.icon className="w-6 h-6 text-emerald-300" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-200">
                      {section.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {section.summary}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-all duration-300 ${
                        activeSection === section.id ? 'rotate-180 text-emerald-400' : 'group-hover:text-emerald-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {activeSection === section.id && (
                <div className="mb-8 ml-4 pl-12 border-l-2 border-emerald-400/30">
                  <div className="space-y-4">
                    {section.content.map((paragraph: string, pIndex: number) => (
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

      <footer className="bg-slate-900/50 border-t border-slate-700/50 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Mail className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300">
                ¿Preguntas sobre privacidad? Contacta: 
                <a href="mailto:privacy@company.com" className="text-emerald-400 hover:text-emerald-300 ml-1">
                  privacy@uttlosmejoresb.com
                </a>
              </span>
            </div>
            
            <div className="text-sm text-slate-500">
              Esta política de privacidad está diseñada para ser clara y transparente. 
              Si tienes alguna duda, no dudes en contactarnos.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicyPage;